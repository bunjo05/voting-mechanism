import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import React from "react";
import {
    Users,
    UserRoundCheck,
    Vote,
    BriefcaseBusiness,
    ClipboardList,
    UserPlus,
    Settings2,
    BarChart3,
    ArrowRight,
    Clock3,
    CheckCircle2,
    CreditCard,
    CalendarDays,
    LayoutDashboard,
} from "lucide-react";

export default function Dashboard({ stats = {}, recentContestants = [] }) {
    const formatNumber = (value) => Number(value || 0).toLocaleString();

    const formatDate = (date) => {
        if (!date) return "Date unavailable";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Date unavailable";
        }

        return parsedDate.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const statCards = [
        {
            title: "Registered voters",
            value: stats.total_voters,
            description: "Voter records in the system",
            icon: Users,
            iconStyle: "bg-blue-50 text-blue-700",
            href: route("admin.voters"),
        },
        {
            title: "Total contestants",
            value: stats.total_contestants,
            description: "All contestant applications",
            icon: UserRoundCheck,
            iconStyle: "bg-violet-50 text-violet-700",
            href: route("admin.contestants"),
        },
        {
            title: "Election positions",
            value: stats.total_positions,
            description: "Configured positions",
            icon: BriefcaseBusiness,
            iconStyle: "bg-amber-50 text-amber-700",
            href: route("admin.positions"),
        },
        {
            title: "Votes recorded",
            value: stats.total_votes,
            description: "Votes stored in the database",
            icon: Vote,
            iconStyle: "bg-emerald-50 text-emerald-700",
            href: route("admin.results"),
        },
    ];

    const quickActions = [
        {
            title: "Manage contestants",
            description:
                "Review applications and update approval or payment status.",
            icon: UserPlus,
            href: route("admin.contestants"),
        },
        {
            title: "Manage voters",
            description: "View registered voters and their records.",
            icon: Users,
            href: route("admin.voters"),
        },
        {
            title: "Election positions",
            description:
                "Create and manage positions contestants can compete for.",
            icon: Settings2,
            href: route("admin.positions"),
        },
        {
            title: "View election results",
            description: "Review contestant vote counts and current standings.",
            icon: BarChart3,
            href: route("admin.results"),
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Election Administration Dashboard" />

            <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-8">
                    {/* Welcome header */}
                    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950 via-indigo-900 to-blue-900 px-6 py-8 shadow-sm sm:px-8 sm:py-10">
                        <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border-[35px] border-white/5" />
                        <div className="pointer-events-none absolute -bottom-24 right-40 h-56 w-56 rounded-full border-[25px] border-white/5" />

                        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
                            <div className="max-w-2xl">
                                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-indigo-100">
                                    <LayoutDashboard size={15} />
                                    Election administration
                                </div>

                                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                    Dashboard overview
                                </h1>

                                <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
                                    Manage voters, review contestant
                                    applications, organize election positions,
                                    and monitor voting activity from one place.
                                </p>
                            </div>

                            <Link
                                href={route("admin.results")}
                                className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-white px-5 py-3 text-sm font-semibold text-indigo-900 shadow-sm transition hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-900 md:self-center"
                            >
                                <BarChart3 size={18} />
                                View election results
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </section>

                    {/* Main statistics */}
                    <section>
                        <div className="mb-4">
                            <h2 className="text-lg font-bold text-gray-900">
                                Election overview
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                A summary of the current records in your system.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {statCards.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.title}
                                        href={item.href}
                                        className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">
                                                    {item.title}
                                                </p>
                                                <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
                                                    {formatNumber(item.value)}
                                                </p>
                                            </div>

                                            <div
                                                className={`rounded-xl p-3 ${item.iconStyle}`}
                                            >
                                                <Icon size={23} />
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between gap-2">
                                            <p className="text-xs leading-5 text-gray-500">
                                                {item.description}
                                            </p>
                                            <ArrowRight
                                                size={16}
                                                className="shrink-0 text-gray-300 transition group-hover:translate-x-1 group-hover:text-indigo-600"
                                            />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>

                    {/* Contestant status summaries */}
                    <section>
                        <div className="mb-4">
                            <h2 className="text-lg font-bold text-gray-900">
                                Contestant application status
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Monitor approvals and payment records.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <StatusCard
                                title="Pending review"
                                value={stats.pending_contestants}
                                description="Applications awaiting a decision"
                                icon={<Clock3 size={21} />}
                                iconStyle="bg-amber-50 text-amber-700"
                            />

                            <StatusCard
                                title="Approved contestants"
                                value={stats.approved_contestants}
                                description="Applications marked as approved"
                                icon={<CheckCircle2 size={21} />}
                                iconStyle="bg-emerald-50 text-emerald-700"
                            />

                            <StatusCard
                                title="Payments recorded"
                                value={stats.paid_contestants}
                                description="Contestants whose payment status is paid"
                                icon={<CreditCard size={21} />}
                                iconStyle="bg-blue-50 text-blue-700"
                            />
                        </div>

                        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-indigo-100 bg-indigo-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-semibold text-indigo-950">
                                    Keep contestant records up to date
                                </p>
                                <p className="mt-1 text-sm text-indigo-800">
                                    Review pending applications and verify
                                    payment records before contestants
                                    participate in voting.
                                </p>
                            </div>

                            <Link
                                href={route("admin.contestants")}
                                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-indigo-200 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
                            >
                                Manage contestants
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </section>

                    {/* Quick actions */}
                    <section>
                        <div className="mb-4">
                            <h2 className="text-lg font-bold text-gray-900">
                                Quick actions
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Navigate directly to common administration
                                tasks.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {quickActions.map((action) => {
                                const Icon = action.icon;

                                return (
                                    <Link
                                        key={action.title}
                                        href={action.href}
                                        className="group flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <div className="rounded-xl bg-gray-100 p-3 text-gray-700 transition group-hover:bg-indigo-50 group-hover:text-indigo-700">
                                            <Icon size={22} />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-semibold text-gray-900">
                                                {action.title}
                                            </h3>
                                            <p className="mt-1 text-sm leading-6 text-gray-500">
                                                {action.description}
                                            </p>
                                        </div>

                                        <ArrowRight
                                            size={18}
                                            className="mt-1 shrink-0 text-gray-300 transition group-hover:translate-x-1 group-hover:text-indigo-600"
                                        />
                                    </Link>
                                );
                            })}
                        </div>
                    </section>

                    {/* Recent registrations */}
                    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                        <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    Recent contestant registrations
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    The latest contestant applications received.
                                </p>
                            </div>

                            <Link
                                href={route("admin.contestants")}
                                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                            >
                                View all contestants
                                <ArrowRight size={16} />
                            </Link>
                        </div>

                        {recentContestants.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {recentContestants.map((contestant) => (
                                    <div
                                        key={contestant.id}
                                        className="flex flex-col gap-3 px-5 py-4 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-50 font-semibold text-indigo-700">
                                                {String(
                                                    contestant.full_name || "?",
                                                )
                                                    .trim()
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate font-semibold text-gray-900">
                                                    {contestant.full_name ||
                                                        "Unnamed contestant"}
                                                </p>
                                                <p className="mt-1 break-all text-sm text-gray-500">
                                                    {contestant.email ||
                                                        "No email provided"}
                                                </p>
                                                <p className="mt-1 text-xs text-gray-500">
                                                    Position:{" "}
                                                    {contestant.position
                                                        ?.name ||
                                                        "Not assigned"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                                            <StatusBadge
                                                value={contestant.status}
                                            />
                                            <StatusBadge
                                                value={
                                                    contestant.payment_status
                                                }
                                            />

                                            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 sm:ml-2">
                                                <CalendarDays size={14} />
                                                {formatDate(
                                                    contestant.created_at,
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="px-6 py-12 text-center">
                                <Users
                                    size={32}
                                    className="mx-auto text-gray-300"
                                />
                                <h3 className="mt-3 font-semibold text-gray-900">
                                    No contestant registrations yet
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    New contestant applications will appear
                                    here.
                                </p>
                            </div>
                        )}

                        <div className="border-t border-gray-200 bg-gray-50 px-5 py-3 sm:px-6">
                            <p className="text-xs text-gray-500">
                                Dashboard statistics reflect the records
                                currently stored in the database.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function StatusCard({ title, value, description, icon, iconStyle }) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                        {Number(value || 0).toLocaleString()}
                    </p>
                </div>

                <div className={`rounded-xl p-3 ${iconStyle}`}>{icon}</div>
            </div>

            <p className="mt-3 text-xs leading-5 text-gray-500">
                {description}
            </p>
        </div>
    );
}

function StatusBadge({ value }) {
    const status = String(value || "unknown").toLowerCase();

    const styles = {
        approved: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
        paid: "bg-blue-50 text-blue-700 ring-blue-600/20",
        pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
        rejected: "bg-red-50 text-red-700 ring-red-600/20",
        unknown: "bg-gray-100 text-gray-600 ring-gray-500/20",
    };

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${
                styles[status] || styles.unknown
            }`}
        >
            {status.replaceAll("_", " ")}
        </span>
    );
}
