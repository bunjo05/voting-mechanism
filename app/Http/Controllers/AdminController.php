<?php

namespace App\Http\Controllers;

use App\Models\Contestant;
use App\Models\Position;
use App\Models\Vote;
use App\Models\Voter;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

use App\Mail\ContestantStatusUpdated;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class AdminController extends Controller
{
    public function dasboard()
    {
        $stats = [
            'total_voters' => Voter::count(),
            'total_contestants' => Contestant::count(),
            'total_positions' => Position::count(),
            'total_votes' => Vote::count(),

            'pending_contestants' => Contestant::where(
                'status',
                'pending'
            )->count(),

            'approved_contestants' => Contestant::where(
                'status',
                'approved'
            )->count(),

            'paid_contestants' => Contestant::where(
                'payment_status',
                'paid'
            )->count(),
        ];

        $recentContestants = Contestant::with('position')
            ->latest()
            ->take(5)
            ->get([
                'id',
                'full_name',
                'email',
                'position_id',
                'status',
                'payment_status',
                'created_at',
            ]);

        return inertia('Dashboard/Dashboard', [
            'stats' => $stats,
            'recentContestants' => $recentContestants,
        ]);
    }

    public function exportBallotPdf()
    {
        $positions = Position::with([
            'contestants' => function ($query) {
                $query->where('status', 'approved')
                    ->where('payment_status', 'paid')
                    ->orderBy('full_name');
            },
        ])
            ->orderBy('name')
            ->get();

        // Only include positions that have eligible contestants.
        $positions = $positions
            ->filter(fn($position) => $position->contestants->isNotEmpty())
            ->values();

        abort_if(
            $positions->isEmpty(),
            404,
            'There are no eligible contestants to include in the ballot.'
        );

        // Embed local photos so the PDF generator can display them.
        foreach ($positions as $position) {
            foreach ($position->contestants as $contestant) {
                $contestant->ballot_photo = null;

                if (empty($contestant->passport_photo)) {
                    continue;
                }

                $photoPath = ltrim(
                    str_replace('\\', '/', $contestant->passport_photo),
                    '/'
                );

                // Support paths saved as public/storage/... or storage/...
                $photoPath = preg_replace(
                    '#^public/#',
                    '',
                    $photoPath
                );

                $absolutePath = null;

                if (str_starts_with($photoPath, 'storage/')) {
                    $relativePath = substr($photoPath, strlen('storage/'));

                    if (Storage::disk('public')->exists($relativePath)) {
                        $absolutePath = Storage::disk('public')
                            ->path($relativePath);
                    }
                } elseif (is_file(public_path($photoPath))) {
                    $absolutePath = public_path($photoPath);
                } elseif (Storage::disk('public')->exists($photoPath)) {
                    $absolutePath = Storage::disk('public')
                        ->path($photoPath);
                }

                if (
                    $absolutePath &&
                    is_file($absolutePath) &&
                    in_array(
                        strtolower(pathinfo($absolutePath, PATHINFO_EXTENSION)),
                        ['jpg', 'jpeg', 'png'],
                        true
                    )
                ) {
                    $mimeType = match (strtolower(pathinfo($absolutePath, PATHINFO_EXTENSION))) {
                        'png' => 'image/png',
                        default => 'image/jpeg',
                    };

                    $contestant->ballot_photo =
                        'data:' . $mimeType . ';base64,' .
                        base64_encode(file_get_contents($absolutePath));
                }
            }
        }

        $pdf = Pdf::loadView('pdf.ballot-paper', [
            'positions' => $positions,
            'generatedAt' => now(),
        ])
            ->setPaper('a4', 'portrait')
            ->setOptions([
                'isRemoteEnabled' => false,
                'defaultFont' => 'DejaVu Sans',
            ]);

        return $pdf->download(
            'official-ballot-paper-' . now()->format('Y-m-d') . '.pdf'
        );
    }

    public function contestants()
    {
        // $contestants = Contestant::all();
        return inertia(
            'Dashboard/Contestants',
            [
                'contestants' => Contestant::with('position')->get(),
            ]
        );
    }


    public function updateContestantStatus(
        Request $request,
        Contestant $contestant
    ) {
        $validated = $request->validate([
            'status' => [
                'required',
                Rule::in(['pending', 'approved', 'rejected']),
            ],
        ]);

        $oldStatus = $contestant->status;
        $newStatus = $validated['status'];

        // Update and notify only when the status actually changes.
        if ($oldStatus !== $newStatus) {
            $contestant->update([
                'status' => $newStatus,
            ]);

            try {
                Mail::to($contestant->email)->send(
                    new ContestantStatusUpdated(
                        $contestant,
                        'status',
                        $oldStatus,
                        $newStatus
                    )
                );
            } catch (\Throwable $e) {
                Log::error('Contestant status email failed.', [
                    'contestant_id' => $contestant->id,
                    'email' => $contestant->email,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return back()->with(
            'success',
            $oldStatus !== $newStatus
                ? 'Contestant status updated successfully.'
                : 'Contestant status remains unchanged.'
        );
    }

    public function updateContestantPaymentStatus(
        Request $request,
        Contestant $contestant
    ) {
        $validated = $request->validate([
            'payment_status' => [
                'required',
                Rule::in(['pending', 'paid']),
            ],
        ]);

        $oldStatus = $contestant->payment_status;
        $newStatus = $validated['payment_status'];

        // Update and notify only when the payment status changes.
        if ($oldStatus !== $newStatus) {
            $contestant->update([
                'payment_status' => $newStatus,
            ]);

            try {
                Mail::to($contestant->email)->send(
                    new ContestantStatusUpdated(
                        $contestant,
                        'payment status',
                        $oldStatus,
                        $newStatus
                    )
                );
            } catch (\Throwable $e) {
                Log::error('Contestant payment status email failed.', [
                    'contestant_id' => $contestant->id,
                    'email' => $contestant->email,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return back()->with(
            'success',
            $oldStatus !== $newStatus
                ? 'Payment status updated successfully.'
                : 'Payment status remains unchanged.'
        );
    }


    // public function updateContestantPaymentStatus(
    //     Request $request,
    //     Contestant $contestant
    // ) {
    //     $validated = $request->validate([
    //         'payment_status' => [
    //             'required',
    //             Rule::in(['pending', 'paid']),
    //         ],
    //     ]);

    //     $contestant->update([
    //         'payment_status' => $validated['payment_status'],
    //     ]);

    //     return back()->with(
    //         'success',
    //         'Contestant payment status updated successfully.'
    //     );
    // }

    public function voters()
    {
        $voters = Voter::all();
        return inertia('Dashboard/Voters', compact('voters'));
    }

    public function positions()
    {
        $positions = Position::all();
        return inertia('Dashboard/Positions', compact('positions'));
    }

    public function storePosition(Request $request)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],
        ]);
        Position::create($validated);
        return redirect()->back()->with('success', 'Position created successfully.');
    }


    public function results()
    {
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

        return inertia('Dashboard/Results', [
            'positions' => $positions,
        ]);
    }
}
