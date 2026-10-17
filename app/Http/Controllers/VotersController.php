<?php

namespace App\Http\Controllers;

use App\Mail\ContestantRegisteredMail;
use App\Models\Contestant;
use App\Models\Position;
use App\Models\User;
use App\Models\Vote;
use App\Models\Voter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class VotersController extends Controller
{
    public function index()
    {
        $contestants = Contestant::with('position')
            ->where('status', 'approved')
            ->where('payment_status', 'paid')
            ->orderBy('full_name')
            ->get();

        $positions = Position::whereHas('contestants', function ($query) {
            $query->where('status', 'approved')
                ->where('payment_status', 'paid');
        })
            ->with(['contestants' => function ($query) {
                $query->where('status', 'approved')
                    ->where('payment_status', 'paid')
                    ->orderBy('full_name');
            }])
            ->orderBy('name')
            ->get();

        return inertia('Vote', [
            'positions' => $positions,
            'contestants' => $contestants,
        ]);
    }

    public function contestantRegister()
    {
        $positions = Position::orderBy('name')->get();

        return inertia('ContestantRegister', [
            'positions' => $positions,
        ]);
    }

    public function storeVote(Request $request)
    {
        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone_number' => ['required', 'string', 'max:30'],
            'passport_number' => ['required', 'string', 'max:100'],

            'votes' => ['required', 'array', 'min:1'],
            'votes.*' => [
                'required',
                'integer',
                'distinct',
                'exists:contestants,id',
            ],
        ]);

        DB::transaction(function () use ($request, $validated) {
            // Find a voter using either unique identifier.
            $existingVoter = Voter::where('email', $validated['email'])
                ->orWhere('passport_number', $validated['passport_number'])
                ->lockForUpdate()
                ->first();

            if ($existingVoter) {
                // Do not allow the email and passport to identify
                // different voter records.
                if (
                    strcasecmp($existingVoter->email, $validated['email']) !== 0 ||
                    $existingVoter->passport_number !== $validated['passport_number']
                ) {
                    throw ValidationException::withMessages([
                        'passport_number' =>
                        'These voter details do not match an existing voter record.',
                    ]);
                }

                $voter = $existingVoter;
            } else {
                $voter = Voter::create([
                    'full_name' => $validated['full_name'],
                    'email' => $validated['email'],
                    'phone_number' => $validated['phone_number'],
                    'passport_number' => $validated['passport_number'],
                    'ip_address' => $request->ip(),
                ]);
            }

            foreach ($validated['votes'] as $positionId => $contestantId) {
                $position = Position::find($positionId);

                if (!$position) {
                    throw ValidationException::withMessages([
                        "votes.{$positionId}" => 'The selected position is invalid.',
                    ]);
                }

                $contestant = Contestant::whereKey($contestantId)
                    ->where('position_id', $position->id)
                    ->where('status', 'approved')
                    ->where('payment_status', 'paid')
                    ->first();

                if (!$contestant) {
                    throw ValidationException::withMessages([
                        "votes.{$positionId}" =>
                        'The selected contestant is not eligible for this position.',
                    ]);
                }

                if (
                    Vote::where('voter_id', $voter->id)
                    ->where('position_id', $position->id)
                    ->exists()
                ) {
                    throw ValidationException::withMessages([
                        "votes.{$positionId}" =>
                        "A vote has already been recorded for {$position->name}.",
                    ]);
                }

                Vote::create([
                    'voter_id' => $voter->id,
                    'position_id' => $position->id,
                    'contestant_id' => $contestant->id,
                ]);
            }
        });

        return redirect()
            ->route('vote')
            ->with('success', 'Your votes have been recorded successfully.');
    }

    public function updateContestant(Request $request, Contestant $contestant)
    {
        // Normalize identifiers before validation.
        $request->merge([
            'email' => strtolower(trim((string) $request->input('email'))),
            'passport_number' => strtoupper(
                trim((string) $request->input('passport_number'))
            ),
        ]);

        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],

            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('contestants', 'email')->ignore($contestant->id),
            ],

            'phone_number' => ['required', 'string', 'max:30'],
            'address' => ['required', 'string', 'max:500'],

            'position_id' => ['required', 'exists:positions,id'],

            'passport_number' => [
                'required',
                'string',
                'max:100',
                Rule::unique('contestants', 'passport_number')
                    ->ignore($contestant->id),
            ],

            // A new passport photo is optional during editing.
            'passport_photo' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png',
                'max:5120',
            ],
        ], [
            'email.unique' =>
            'This email address is already registered by another contestant.',

            'passport_number.unique' =>
            'This passport number is already registered by another contestant.',
        ]);

        $oldPhoto = $contestant->passport_photo;
        $newPhotoPath = null;

        // Save a replacement photo directly inside public/.
        if ($request->hasFile('passport_photo')) {
            $destinationPath = public_path('contestants/passports');

            if (!is_dir($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }

            $photo = $request->file('passport_photo');

            $fileName = uniqid('passport_', true) . '.' .
                $photo->getClientOriginalExtension();

            $photo->move($destinationPath, $fileName);

            $newPhotoPath = 'contestants/passports/' . $fileName;
            $validated['passport_photo'] = $newPhotoPath;
        }

        // Update contestant details.
        $contestant->update($validated);

        // Delete the old photo only after the database update succeeds.
        if ($newPhotoPath && $oldPhoto) {
            $oldPhotoPath = public_path(
                ltrim(
                    preg_replace('#^/?public/#', '', $oldPhoto),
                    '/'
                )
            );

            // Only delete files from the contestant passport directory.
            $passportDirectory = realpath(
                public_path('contestants/passports')
            );
            $resolvedOldPhoto = realpath($oldPhotoPath);

            if (
                $passportDirectory &&
                $resolvedOldPhoto &&
                str_starts_with(
                    $resolvedOldPhoto,
                    $passportDirectory . DIRECTORY_SEPARATOR
                ) &&
                is_file($resolvedOldPhoto)
            ) {
                unlink($resolvedOldPhoto);
            }
        }

        return redirect()
            ->back()
            ->with('success', 'Contestant details updated successfully.');
    }


    public function storeContestantRegister(Request $request)
    {
        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],

            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:contestants,email',
            ],

            'phone_number' => ['required', 'string', 'max:30'],
            'address' => ['required', 'string', 'max:500'],
            'position_id' => ['required', 'exists:positions,id'],

            'passport_number' => [
                'required',
                'string',
                'max:100',
                'unique:contestants,passport_number',
            ],

            'passport_photo' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png',
                'max:5120',
            ],
        ], [
            'email.unique' =>
            'This email address is already registered. Please use a different email address.',

            'passport_number.unique' =>
            'This passport number is already registered. Each contestant must use a unique passport number.',
        ]);

        // Normalize email and passport number.
        $validated['email'] = strtolower(trim($validated['email']));

        $validated['passport_number'] = strtoupper(
            trim($validated['passport_number'])
        );

        // Store passport photo directly in public/contestants/passports.
        $passportPhoto = $request->file('passport_photo');

        $destinationPath = public_path('contestants/passports');

        if (!is_dir($destinationPath)) {
            mkdir($destinationPath, 0755, true);
        }

        $fileName = uniqid('passport_', true) . '.' .
            $passportPhoto->getClientOriginalExtension();

        $passportPhoto->move($destinationPath, $fileName);

        // Store the relative photo path in the database.
        $validated['passport_photo'] =
            'contestants/passports/' . $fileName;

        // Set default registration status.
        $validated['status'] = 'pending';
        $validated['payment_status'] = 'pending';

        // Save the contestant.
        $contestant = Contestant::create($validated);

        // Send an email notification to all registered users.
        try {
            User::whereNotNull('email')
                ->where('email', '!=', '')
                ->select('id', 'email')
                ->chunkById(100, function ($users) use ($contestant) {
                    foreach ($users as $user) {
                        try {
                            Mail::to($user->email)->send(
                                new ContestantRegisteredMail($contestant)
                            );
                        } catch (\Throwable $e) {
                            Log::error(
                                'Failed to notify user about contestant registration.',
                                [
                                    'user_id' => $user->id,
                                    'contestant_id' => $contestant->id,
                                    'error' => $e->getMessage(),
                                ]
                            );
                        }
                    }
                });
        } catch (\Throwable $e) {
            Log::error(
                'Failed to process contestant registration email notifications.',
                [
                    'contestant_id' => $contestant->id,
                    'error' => $e->getMessage(),
                ]
            );
        }

        return redirect()
            ->route('contestant.register')
            ->with(
                'success',
                'Your contestant registration has been submitted successfully. Your application is now pending review.'
            );
    }

    public function results()
    {
        $eligibleContestants = function ($query) {
            $query->where('status', 'approved')
                ->where('payment_status', 'paid');
        };

        $positions = Position::with([
            'contestants' => function ($query) {
                $query->where('status', 'approved')
                    ->where('payment_status', 'paid')
                    ->withCount('votes')
                    ->orderByDesc('votes_count')
                    ->orderBy('full_name');
            },
        ])
            ->orderBy('name')
            ->get();

        $totalVotes = Vote::whereHas('contestant', $eligibleContestants)->count();

        $totalContestants = Contestant::where('status', 'approved')
            ->where('payment_status', 'paid')
            ->count();

        return inertia('Results', [
            'positions' => $positions,
            'stats' => [
                'total_votes' => $totalVotes,
                'total_positions' => $positions->count(),
                'total_contestants' => $totalContestants,
            ],
        ]);
    }
}
