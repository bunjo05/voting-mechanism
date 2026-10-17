<?php

namespace App\Http\Controllers;

use App\Models\Contestant;
use App\Models\Position;
use App\Models\Vote;
use App\Models\Voter;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

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
