import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import {
    Award,
    BarChart3,
    CheckCircle2,
    Trophy,
    Users,
    Vote,
} from "lucide-react";

export default function Results({ positions = [] }) {
    const totalContestants = positions.reduce(
        (total, position) => total + (position.contestants?.length || 0),
        0,
    );

    const totalVotes = positions.reduce(
        (total, position) =>
            total +
            (position.contestants || []).reduce(
                (sum, contestant) => sum + Number(contestant.votes_count || 0),
                0,
            ),
        0,
    );

    const positionsWithVotes = positions.filter((position) =>
        (position.contestants || []).some(
            (contestant) => Number(contestant.votes_count || 0) > 0,
        ),
    ).length;

    return (
        <AuthenticatedLayout>
            <Head title="Election Results" />

            <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-8">
                    {/* Page heading */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-indigo-600">
                                <BarChart3 size={18} />
                                Election Management
                            </div>

                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                Election Results
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                                Review contestant performance, vote counts, and
                                the leading candidates for each position.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm sm:self-auto">
                            <Vote className="text-indigo-600" size={20} />
                            <span className="text-sm font-medium text-gray-700">
                                Results overview
                            </span>
                        </div>
                    </div>

                    {/* Summary statistics */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <StatCard
                            title="Total votes"
                            value={totalVotes.toLocaleString()}
                            description="Votes counted for eligible contestants"
                            icon={<Vote size={22} />}
                        />

                        <StatCard
                            title="Election positions"
                            value={positions.length.toLocaleString()}
                            description="Positions configured in the system"
                            icon={<BarChart3 size={22} />}
                        />

                        <StatCard
                            title="Eligible contestants"
                            value={totalContestants.toLocaleString()}
                            description="Approved and paid contestants"
                            icon={<Users size={22} />}
                        />

                        <StatCard
                            title="Positions with votes"
                            value={positionsWithVotes.toLocaleString()}
                            description="Positions with at least one recorded vote"
                            icon={<CheckCircle2 size={22} />}
                        />
                    </div>

                    {/* Position results */}
                    {positions.length > 0 ? (
                        <div className="space-y-6">
                            {positions.map((position) => {
                                const contestants = position.contestants || [];

                                const positionTotalVotes = contestants.reduce(
                                    (total, contestant) =>
                                        total +
                                        Number(contestant.votes_count || 0),
                                    0,
                                );

                                const highestVoteCount = contestants.reduce(
                                    (highest, contestant) =>
                                        Math.max(
                                            highest,
                                            Number(contestant.votes_count || 0),
                                        ),
                                    0,
                                );

                                const leaders =
                                    highestVoteCount > 0
                                        ? contestants.filter(
                                              (contestant) =>
                                                  Number(
                                                      contestant.votes_count ||
                                                          0,
                                                  ) === highestVoteCount,
                                          )
                                        : [];

                                const hasTie = leaders.length > 1;
                                const hasWinner =
                                    leaders.length === 1 &&
                                    highestVoteCount > 0;

                                return (
                                    <section
                                        key={position.id}
                                        className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                                    >
                                        {/* Position header */}
                                        <div className="border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white px-5 py-5 sm:px-7">
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                                                        Election position
                                                    </p>

                                                    <h2 className="mt-1 text-xl font-bold text-gray-900">
                                                        {position.name}
                                                    </h2>

                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {contestants.length}{" "}
                                                        {contestants.length ===
                                                        1
                                                            ? "contestant"
                                                            : "contestants"}
                                                    </p>
                                                </div>

                                                <div className="rounded-xl border border-indigo-100 bg-white px-4 py-3">
                                                    <p className="text-xs font-medium text-gray-500">
                                                        Total votes
                                                    </p>
                                                    <p className="mt-1 text-2xl font-bold text-gray-900">
                                                        {positionTotalVotes.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-5 sm:p-7">
                                            {/* Leading candidate / tie */}
                                            {hasWinner && (
                                                <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                                                    <Trophy
                                                        className="mt-0.5 shrink-0 text-amber-600"
                                                        size={22}
                                                    />

                                                    <div>
                                                        <p className="font-semibold text-amber-900">
                                                            Current leader
                                                        </p>
                                                        <p className="mt-1 text-sm text-amber-800">
                                                            {
                                                                leaders[0]
                                                                    .full_name
                                                            }{" "}
                                                            is leading with{" "}
                                                            {highestVoteCount.toLocaleString()}{" "}
                                                            {highestVoteCount ===
                                                            1
                                                                ? "vote"
                                                                : "votes"}
                                                            .
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {hasTie && (
                                                <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
                                                    <Award
                                                        className="mt-0.5 shrink-0 text-blue-600"
                                                        size={22}
                                                    />

                                                    <div>
                                                        <p className="font-semibold text-blue-900">
                                                            Current tie
                                                        </p>
                                                        <p className="mt-1 text-sm text-blue-800">
                                                            {leaders
                                                                .map(
                                                                    (
                                                                        contestant,
                                                                    ) =>
                                                                        contestant.full_name,
                                                                )
                                                                .join(
                                                                    ", ",
                                                                )}{" "}
                                                            each have{" "}
                                                            {highestVoteCount.toLocaleString()}{" "}
                                                            votes. No single
                                                            leader has emerged.
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {!hasWinner &&
                                                !hasTie &&
                                                contestants.length > 0 && (
                                                    <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
                                                        <p className="text-sm font-medium text-gray-700">
                                                            No votes recorded
                                                            for this position
                                                            yet.
                                                        </p>
                                                    </div>
                                                )}

                                            {/* Contestant list */}
                                            {contestants.length > 0 ? (
                                                <div className="space-y-5">
                                                    {contestants.map(
                                                        (contestant, index) => {
                                                            const votes =
                                                                Number(
                                                                    contestant.votes_count ||
                                                                        0,
                                                                );

                                                            const percentage =
                                                                positionTotalVotes >
                                                                0
                                                                    ? (votes /
                                                                          positionTotalVotes) *
                                                                      100
                                                                    : 0;

                                                            const isLeader =
                                                                highestVoteCount >
                                                                    0 &&
                                                                votes ===
                                                                    highestVoteCount;

                                                            return (
                                                                <div
                                                                    key={
                                                                        contestant.id
                                                                    }
                                                                    className="rounded-xl border border-gray-100 p-4 transition hover:border-gray-200 sm:p-5"
                                                                >
                                                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                                        <div className="flex items-center gap-3">
                                                                            <div
                                                                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                                                                                    isLeader
                                                                                        ? "bg-amber-100 text-amber-700"
                                                                                        : "bg-gray-100 text-gray-600"
                                                                                }`}
                                                                            >
                                                                                {index +
                                                                                    1}
                                                                            </div>

                                                                            <div>
                                                                                <div className="flex flex-wrap items-center gap-2">
                                                                                    <h3 className="font-semibold text-gray-900">
                                                                                        {
                                                                                            contestant.full_name
                                                                                        }
                                                                                    </h3>

                                                                                    {isLeader && (
                                                                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">
                                                                                            <Trophy
                                                                                                size={
                                                                                                    12
                                                                                                }
                                                                                            />
                                                                                            {hasTie
                                                                                                ? "Joint leader"
                                                                                                : "Leading"}
                                                                                        </span>
                                                                                    )}
                                                                                </div>

                                                                                <p className="mt-1 text-sm text-gray-500">
                                                                                    Candidate{" "}
                                                                                    {index +
                                                                                        1}
                                                                                </p>
                                                                            </div>
                                                                        </div>

                                                                        <div className="sm:text-right">
                                                                            <p className="text-xl font-bold text-gray-900">
                                                                                {votes.toLocaleString()}
                                                                            </p>
                                                                            <p className="text-xs text-gray-500">
                                                                                {votes ===
                                                                                1
                                                                                    ? "vote"
                                                                                    : "votes"}
                                                                            </p>
                                                                        </div>
                                                                    </div>

                                                                    <div className="mt-4">
                                                                        <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
                                                                            <span>
                                                                                Vote
                                                                                share
                                                                            </span>
                                                                            <span className="font-semibold text-gray-700">
                                                                                {percentage.toFixed(
                                                                                    1,
                                                                                )}

                                                                                %
                                                                            </span>
                                                                        </div>

                                                                        <div
                                                                            className="h-2.5 overflow-hidden rounded-full bg-gray-100"
                                                                            role="progressbar"
                                                                            aria-label={`${contestant.full_name} vote share`}
                                                                            aria-valuenow={Number(
                                                                                percentage.toFixed(
                                                                                    1,
                                                                                ),
                                                                            )}
                                                                            aria-valuemin={
                                                                                0
                                                                            }
                                                                            aria-valuemax={
                                                                                100
                                                                            }
                                                                        >
                                                                            <div
                                                                                className={`h-full rounded-full transition-all duration-500 ${
                                                                                    isLeader
                                                                                        ? "bg-amber-500"
                                                                                        : "bg-indigo-500"
                                                                                }`}
                                                                                style={{
                                                                                    width: `${percentage}%`,
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        },
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="rounded-xl border border-dashed border-gray-300 px-5 py-10 text-center">
                                                    <Users
                                                        className="mx-auto text-gray-400"
                                                        size={32}
                                                    />
                                                    <h3 className="mt-3 font-semibold text-gray-900">
                                                        No eligible contestants
                                                    </h3>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        No contestants have been
                                                        approved and marked as
                                                        paid for this position.
                                                    </p>
                                                </div>
                                            )}

                                            <p className="mt-5 text-xs leading-5 text-gray-500">
                                                Vote percentages are calculated
                                                from the votes displayed for
                                                this position. These results
                                                reflect the current recorded
                                                votes and are not necessarily
                                                final election results.
                                            </p>
                                        </div>
                                    </section>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
                            <BarChart3
                                className="mx-auto text-gray-400"
                                size={40}
                            />

                            <h2 className="mt-4 text-lg font-semibold text-gray-900">
                                No election positions found
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                                Create election positions and register
                                contestants before results can be displayed.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function StatCard({ title, value, description, icon }) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                        {value}
                    </p>
                </div>

                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                    {icon}
                </div>
            </div>

            <p className="mt-3 text-xs leading-5 text-gray-500">
                {description}
            </p>
        </div>
    );
}
