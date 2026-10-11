import GuestLayout from "@/Layouts/GuestLayout";
import { Head } from "@inertiajs/react";
import React from "react";
import {
    Trophy,
    Vote,
    Users,
    BriefcaseBusiness,
    BarChart3,
    Award,
    Medal,
    ChartNoAxesColumn,
    CircleHelp,
} from "lucide-react";

export default function Results({ positions = [], stats = {} }) {
    const number = (value) => Number(value || 0).toLocaleString();

    return (
        <GuestLayout>
            <Head title="Election Results" />

            <div className="min-h-screen bg-slate-50">
                {/* Hero */}
                <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-800 px-4 py-14 sm:px-6 sm:py-20">
                    <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full border-[45px] border-white/5" />
                    <div className="pointer-events-none absolute -bottom-40 left-1/3 h-96 w-96 rounded-full border-[35px] border-white/5" />

                    <div className="relative mx-auto max-w-7xl">
                        <div className="max-w-3xl">
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm font-medium text-indigo-100">
                                <ChartNoAxesColumn size={17} />
                                Election results centre
                            </div>

                            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                                Election Results
                            </h1>

                            <p className="mt-5 max-w-2xl text-base leading-7 text-indigo-100 sm:text-lg">
                                Follow the vote counts and compare contestant
                                performance across every election position.
                                Results are based on votes currently recorded in
                                the system.
                            </p>

                            <div className="mt-7 flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-indigo-100">
                                <CircleHelp
                                    size={20}
                                    className="mt-0.5 shrink-0"
                                />
                                <p>
                                    Leading contestants are shown for
                                    informational purposes. A current leader is
                                    not necessarily the officially declared
                                    winner.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
                    {/* Summary statistics */}
                    <section className="-mt-16 relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <SummaryCard
                            title="Votes recorded"
                            value={number(stats.total_votes)}
                            description="Votes for eligible contestants"
                            icon={<Vote size={23} />}
                        />

                        <SummaryCard
                            title="Election positions"
                            value={number(stats.total_positions)}
                            description="Positions in the election"
                            icon={<BriefcaseBusiness size={23} />}
                        />

                        <SummaryCard
                            title="Eligible contestants"
                            value={number(stats.total_contestants)}
                            description="Approved and paid contestants"
                            icon={<Users size={23} />}
                        />
                    </section>

                    {/* Results heading */}
                    <section className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                                Results by position
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Contestants are ranked by recorded votes within
                                each position.
                            </p>
                        </div>

                        <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                            <BarChart3 size={17} className="text-indigo-600" />
                            {positions.length}{" "}
                            {positions.length === 1 ? "position" : "positions"}
                        </div>
                    </section>

                    {/* Position cards */}
                    {positions.length > 0 ? (
                        <div className="space-y-6">
                            {positions.map((position) => {
                                const contestants = position.contestants || [];

                                const positionVotes = contestants.reduce(
                                    (total, contestant) =>
                                        total +
                                        Number(contestant.votes_count || 0),
                                    0,
                                );

                                const highestVotes = contestants.reduce(
                                    (highest, contestant) =>
                                        Math.max(
                                            highest,
                                            Number(contestant.votes_count || 0),
                                        ),
                                    0,
                                );

                                const leaders =
                                    highestVotes > 0
                                        ? contestants.filter(
                                              (contestant) =>
                                                  Number(
                                                      contestant.votes_count ||
                                                          0,
                                                  ) === highestVotes,
                                          )
                                        : [];

                                const isTie = leaders.length > 1;
                                const hasLeader = leaders.length === 1;

                                return (
                                    <article
                                        key={position.id}
                                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                                    >
                                        {/* Position header */}
                                        <div className="flex flex-col gap-4 border-b border-slate-100 bg-gradient-to-r from-white to-indigo-50/70 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                                                    <BriefcaseBusiness
                                                        size={24}
                                                    />
                                                </div>

                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                                                        Election position
                                                    </p>
                                                    <h3 className="mt-1 text-xl font-bold text-slate-900">
                                                        {position.name}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-slate-500">
                                                        {contestants.length}{" "}
                                                        {contestants.length ===
                                                        1
                                                            ? "eligible contestant"
                                                            : "eligible contestants"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 sm:text-right">
                                                <p className="text-xs font-medium text-slate-500">
                                                    Total votes
                                                </p>
                                                <p className="mt-1 text-2xl font-bold text-slate-900">
                                                    {number(positionVotes)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-5 sm:p-7">
                                            {/* Leading contestant */}
                                            {hasLeader && (
                                                <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                                                    <Trophy
                                                        size={22}
                                                        className="mt-0.5 shrink-0 text-amber-600"
                                                    />
                                                    <div>
                                                        <p className="font-semibold text-amber-950">
                                                            Current leader
                                                        </p>
                                                        <p className="mt-1 text-sm leading-6 text-amber-900">
                                                            {
                                                                leaders[0]
                                                                    .full_name
                                                            }{" "}
                                                            leads with{" "}
                                                            {number(
                                                                highestVotes,
                                                            )}{" "}
                                                            {highestVotes === 1
                                                                ? "vote"
                                                                : "votes"}
                                                            .
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {isTie && (
                                                <div className="mb-6 flex items-start gap-3 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
                                                    <Award
                                                        size={22}
                                                        className="mt-0.5 shrink-0 text-indigo-600"
                                                    />
                                                    <div>
                                                        <p className="font-semibold text-indigo-950">
                                                            Current tie
                                                        </p>
                                                        <p className="mt-1 text-sm leading-6 text-indigo-900">
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
                                                            are tied with{" "}
                                                            {number(
                                                                highestVotes,
                                                            )}{" "}
                                                            {highestVotes === 1
                                                                ? "vote each"
                                                                : "votes each"}
                                                            .
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {contestants.length === 0 ? (
                                                <div className="rounded-xl border border-dashed border-slate-300 px-5 py-12 text-center">
                                                    <Users
                                                        size={32}
                                                        className="mx-auto text-slate-400"
                                                    />
                                                    <h4 className="mt-3 font-semibold text-slate-900">
                                                        No eligible contestants
                                                    </h4>
                                                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                                                        There are currently no
                                                        contestants approved and
                                                        marked as paid for this
                                                        position.
                                                    </p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="mb-4 flex items-center justify-between gap-3">
                                                        <h4 className="font-semibold text-slate-900">
                                                            Contestant standings
                                                        </h4>
                                                        <span className="text-xs text-slate-500">
                                                            Ranked by votes
                                                        </span>
                                                    </div>

                                                    <div className="space-y-4">
                                                        {contestants.map(
                                                            (
                                                                contestant,
                                                                index,
                                                            ) => {
                                                                const votes =
                                                                    Number(
                                                                        contestant.votes_count ||
                                                                            0,
                                                                    );

                                                                const percentage =
                                                                    positionVotes >
                                                                    0
                                                                        ? (votes /
                                                                              positionVotes) *
                                                                          100
                                                                        : 0;

                                                                const isLeader =
                                                                    highestVotes >
                                                                        0 &&
                                                                    votes ===
                                                                        highestVotes;

                                                                return (
                                                                    <div
                                                                        key={
                                                                            contestant.id
                                                                        }
                                                                        className="rounded-xl border border-slate-100 p-4 transition hover:border-slate-200 sm:p-5"
                                                                    >
                                                                        <div className="flex items-start gap-3">
                                                                            <div
                                                                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                                                                                    isLeader
                                                                                        ? "bg-amber-100 text-amber-800"
                                                                                        : "bg-slate-100 text-slate-600"
                                                                                }`}
                                                                            >
                                                                                {isLeader ? (
                                                                                    <Medal
                                                                                        size={
                                                                                            20
                                                                                        }
                                                                                    />
                                                                                ) : (
                                                                                    index +
                                                                                    1
                                                                                )}
                                                                            </div>

                                                                            <div className="min-w-0 flex-1">
                                                                                <div className="flex flex-wrap items-center gap-2">
                                                                                    <p className="break-words font-semibold text-slate-900">
                                                                                        {
                                                                                            contestant.full_name
                                                                                        }
                                                                                    </p>

                                                                                    {isLeader && (
                                                                                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                                                                                            {isTie
                                                                                                ? "Joint leader"
                                                                                                : "Leading"}
                                                                                        </span>
                                                                                    )}
                                                                                </div>

                                                                                <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                                                                                    <span className="text-xl font-bold text-slate-900">
                                                                                        {number(
                                                                                            votes,
                                                                                        )}
                                                                                    </span>
                                                                                    <span className="text-xs text-slate-500">
                                                                                        {votes ===
                                                                                        1
                                                                                            ? "vote"
                                                                                            : "votes"}
                                                                                    </span>
                                                                                    <span className="text-xs font-medium text-slate-500">
                                                                                        {percentage.toFixed(
                                                                                            1,
                                                                                        )}

                                                                                        %
                                                                                        of
                                                                                        votes
                                                                                    </span>
                                                                                </div>

                                                                                <div
                                                                                    className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100"
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
                                                                    </div>
                                                                );
                                                            },
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mt-5 border-t border-slate-100 pt-4">
                                                <p className="text-xs leading-5 text-slate-500">
                                                    Vote share is calculated
                                                    from the recorded votes for
                                                    eligible contestants in this
                                                    position. These are current
                                                    standings, not a declaration
                                                    of final results.
                                                </p>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                            <BarChart3
                                size={40}
                                className="mx-auto text-slate-400"
                            />
                            <h3 className="mt-4 text-lg font-bold text-slate-900">
                                Results are not available yet
                            </h3>
                            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                                Election positions will appear here when they
                                have been configured in the system.
                            </p>
                        </div>
                    )}

                    {/* Footer note */}
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <p className="text-sm leading-6 text-slate-600">
                            <span className="font-semibold text-slate-800">
                                About these results:
                            </span>{" "}
                            The page displays votes currently stored in the
                            system. Official winners should only be announced
                            after voting has closed and the election records
                            have been verified.
                        </p>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}

function SummaryCard({ title, value, description, icon }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md shadow-slate-900/5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>
                    <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
                        {value}
                    </p>
                </div>

                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-700">
                    {icon}
                </div>
            </div>

            <p className="mt-3 text-xs leading-5 text-slate-500">
                {description}
            </p>
        </div>
    );
}
