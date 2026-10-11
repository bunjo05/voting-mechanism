<?php

namespace App\Http\Controllers;

use App\Models\Contestant;
use App\Models\Position;
use App\Models\Vote;
use App\Models\Voter;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

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

        $contestant->update([
            'status' => $validated['status'],
        ]);

        return back()->with(
            'success',
            'Contestant status updated successfully.'
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

        $contestant->update([
            'payment_status' => $validated['payment_status'],
        ]);

        return back()->with(
            'success',
            'Contestant payment status updated successfully.'
        );
    }

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
