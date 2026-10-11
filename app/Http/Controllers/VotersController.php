<?php

namespace App\Http\Controllers;

use App\Models\Contestant;
use App\Models\Position;
use App\Models\Vote;
use App\Models\Voter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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



    public function storeContestantRegister(Request $request)
    {
        $validated = $request->validate([
            'full_name' => [
                'required',
                'string',
                'max:255',
            ],

            'email' => [
                'required',
                'email',
                'max:255',
                'unique:contestants,email',
            ],

            'phone_number' => [
                'required',
                'string',
                'max:30',
            ],

            'address' => [
                'required',
                'string',
                'max:500',
            ],
            'position_id' => [
                'required',
                'exists:positions,id',
            ],

            'passport_number' => [
                'required',
                'string',
                'max:100',
            ],

            'passport_photo' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png',
                'max:5120',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Store Passport Photo
        |--------------------------------------------------------------------------
        */

        if ($request->hasFile('passport_photo')) {
            $validated['passport_photo'] = $request
                ->file('passport_photo')
                ->store('contestants/passports', 'public');
        }

        /*
        |--------------------------------------------------------------------------
        | Default Registration Status
        |--------------------------------------------------------------------------
        */

        $validated['status'] = 'pending';
        $validated['payment_status'] = 'pending';

        /*
        |--------------------------------------------------------------------------
        | Create Contestant
        |--------------------------------------------------------------------------
        */

        Contestant::create($validated);

        /*
        |--------------------------------------------------------------------------
        | Redirect After Successful Registration
        |--------------------------------------------------------------------------
        */

        return redirect()
            ->route('contestant.register')
            ->with('success', 'Your contestant registration has been submitted successfully. Your application is now pending review.');
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
