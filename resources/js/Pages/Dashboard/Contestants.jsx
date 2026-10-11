import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useMemo, useState } from "react";
import { Head, router } from "@inertiajs/react";
import {
    Users,
    Search,
    Filter,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    UserCheck,
    UserX,
    X,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    CreditCard,
    Image as ImageIcon,
    CalendarDays,
    RefreshCw,
} from "lucide-react";

export default function Contestants({ contestants = [] }) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [paymentFilter, setPaymentFilter] = useState("all");
    const [selectedContestant, setSelectedContestant] = useState(null);

    const filteredContestants = useMemo(() => {
        return contestants.filter((contestant) => {
            const query = search.toLowerCase();

            const matchesSearch = [
                contestant.full_name,
                contestant.email,
                contestant.phone_number,
                contestant.passport_number,
                contestant.position?.name,
                contestant.position,
            ].some((value) =>
                String(value ?? "")
                    .toLowerCase()
                    .includes(query),
            );

            const matchesStatus =
                statusFilter === "all" || contestant.status === statusFilter;

            const matchesPayment =
                paymentFilter === "all" ||
                contestant.payment_status === paymentFilter;

            return matchesSearch && matchesStatus && matchesPayment;
        });
    }, [contestants, search, statusFilter, paymentFilter]);

    const stats = useMemo(
        () => ({
            total: contestants.length,
            pending: contestants.filter((c) => c.status === "pending").length,
            approved: contestants.filter((c) => c.status === "approved").length,
            rejected: contestants.filter((c) => c.status === "rejected").length,
            paid: contestants.filter((c) => c.payment_status === "paid").length,
        }),
        [contestants],
    );

    const updateStatus = (contestant, status) => {
        const action = status === "approved" ? "approve" : "reject";

        if (
            !window.confirm(
                `Are you sure you want to ${action} ${contestant.full_name}?`,
            )
        ) {
            return;
        }

        // These route names must match the routes in web.php.
        router.patch(
            route("admin.contestants.status", contestant.id),
            { status },
            {
                preserveScroll: true,
                onSuccess: () => setSelectedContestant(null),
            },
        );
    };

    const updatePaymentStatus = (contestant, payment_status) => {
        const action =
            payment_status === "paid"
                ? "mark this payment as paid"
                : "reset this payment to pending";

        if (
            !window.confirm(
                `Are you sure you want to ${action} for ${contestant.full_name}?`,
            )
        ) {
            return;
        }

        router.patch(
            route("admin.contestants.payment-status", contestant.id),
            { payment_status },
            {
                preserveScroll: true,
                onSuccess: () => setSelectedContestant(null),
            },
        );
    };

    const statusStyles = {
        pending: "bg-amber-50 text-amber-700 ring-amber-200",
        approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
        rejected: "bg-red-50 text-red-700 ring-red-200",
    };

    const paymentStyles = {
        pending: "bg-amber-50 text-amber-700 ring-amber-200",
        paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    };

    const formatDate = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const photoUrl = (path) => {
        if (!path) return null;
        if (path.startsWith("http://") || path.startsWith("https://")) {
            return path;
        }

        return `/storage/${path.replace(/^\/?storage\//, "")}`;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manage Contestants" />

            <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-6">
                    {/* Page heading */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
                                <Users size={17} />
                                Administration
                            </div>

                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                Contestants
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm text-slate-500">
                                Review registrations, verify contestant
                                information, and manage approval status.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                router.reload({ only: ["contestants"] })
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
                        >
                            <RefreshCw size={16} />
                            Refresh
                        </button>
                    </div>

                    {/* Summary cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                        <StatCard
                            title="Total Contestants"
                            value={stats.total}
                            icon={Users}
                            iconClass="bg-indigo-50 text-indigo-600"
                        />
                        <StatCard
                            title="Pending Review"
                            value={stats.pending}
                            icon={Clock}
                            iconClass="bg-amber-50 text-amber-600"
                        />
                        <StatCard
                            title="Approved"
                            value={stats.approved}
                            icon={UserCheck}
                            iconClass="bg-emerald-50 text-emerald-600"
                        />
                        <StatCard
                            title="Rejected"
                            value={stats.rejected}
                            icon={UserX}
                            iconClass="bg-red-50 text-red-600"
                        />
                        <StatCard
                            title="Payments Received"
                            value={stats.paid}
                            icon={CreditCard}
                            iconClass="bg-sky-50 text-sky-600"
                        />
                    </div>

                    {/* Contestants table */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-200 p-5 sm:p-6">
                            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        Registered Contestants
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-500">
                                        {filteredContestants.length} of{" "}
                                        {contestants.length} contestants
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    <div className="relative">
                                        <Search
                                            size={17}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        />
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                            placeholder="Search contestants..."
                                            className="w-full rounded-xl border-slate-200 py-2.5 pl-10 pr-3 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>

                                    <div className="relative">
                                        <Filter
                                            size={16}
                                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        />
                                        <select
                                            value={statusFilter}
                                            onChange={(e) =>
                                                setStatusFilter(e.target.value)
                                            }
                                            className="w-full rounded-xl border-slate-200 py-2.5 pl-9 pr-3 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="all">
                                                All statuses
                                            </option>
                                            <option value="pending">
                                                Pending
                                            </option>
                                            <option value="approved">
                                                Approved
                                            </option>
                                            <option value="rejected">
                                                Rejected
                                            </option>
                                        </select>
                                    </div>

                                    <select
                                        value={paymentFilter}
                                        onChange={(e) =>
                                            setPaymentFilter(e.target.value)
                                        }
                                        className="w-full rounded-xl border-slate-200 py-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="all">
                                            All payments
                                        </option>
                                        <option value="pending">
                                            Payment pending
                                        </option>
                                        <option value="paid">Paid</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-[1000px] w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Contestant
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Position
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Registration Date
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Payment
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {filteredContestants.map((contestant) => (
                                        <tr
                                            key={contestant.id}
                                            className="transition hover:bg-slate-50/80"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {contestant.passport_photo ? (
                                                        <img
                                                            src={photoUrl(
                                                                contestant.passport_photo,
                                                            )}
                                                            alt={
                                                                contestant.full_name
                                                            }
                                                            className="h-11 w-11 rounded-xl border border-slate-200 object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-600">
                                                            {contestant.full_name
                                                                ?.charAt(0)
                                                                ?.toUpperCase() ||
                                                                "?"}
                                                        </div>
                                                    )}

                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-slate-900">
                                                            {
                                                                contestant.full_name
                                                            }
                                                        </p>
                                                        <p className="mt-1 text-sm text-slate-500">
                                                            {contestant.email}
                                                        </p>
                                                        <p className="mt-1 text-xs text-slate-400">
                                                            ID: #{contestant.id}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-slate-700">
                                                    <Briefcase
                                                        size={15}
                                                        className="text-slate-400"
                                                    />
                                                    {contestant.position
                                                        ?.name ||
                                                        contestant.position ||
                                                        "Not specified"}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                <div className="flex items-center gap-2">
                                                    <CalendarDays
                                                        size={15}
                                                        className="text-slate-400"
                                                    />
                                                    {formatDate(
                                                        contestant.created_at,
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex flex-col items-start gap-2">
                                                    <StatusBadge
                                                        value={
                                                            contestant.payment_status
                                                        }
                                                        styles={paymentStyles}
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updatePaymentStatus(
                                                                contestant,
                                                                contestant.payment_status ===
                                                                    "paid"
                                                                    ? "pending"
                                                                    : "paid",
                                                            )
                                                        }
                                                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                                                            contestant.payment_status ===
                                                            "paid"
                                                                ? "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                                                                : "bg-emerald-600 text-white hover:bg-emerald-700"
                                                        }`}
                                                    >
                                                        {contestant.payment_status ===
                                                        "paid"
                                                            ? "Reset to Pending"
                                                            : "Mark as Paid"}
                                                    </button>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <StatusBadge
                                                    value={contestant.status}
                                                    styles={statusStyles}
                                                />
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedContestant(
                                                                contestant,
                                                            )
                                                        }
                                                        title="View details"
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                                                    >
                                                        <Eye size={15} />
                                                        View
                                                    </button>

                                                    {contestant.status ===
                                                        "pending" && (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    updateStatus(
                                                                        contestant,
                                                                        "approved",
                                                                    )
                                                                }
                                                                title="Approve contestant"
                                                                className="rounded-lg bg-emerald-600 p-2 text-white transition hover:bg-emerald-700"
                                                            >
                                                                <CheckCircle
                                                                    size={16}
                                                                />
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    updateStatus(
                                                                        contestant,
                                                                        "rejected",
                                                                    )
                                                                }
                                                                title="Reject contestant"
                                                                className="rounded-lg bg-red-600 p-2 text-white transition hover:bg-red-700"
                                                            >
                                                                <XCircle
                                                                    size={16}
                                                                />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                    {filteredContestants.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="px-6 py-16 text-center"
                                            >
                                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                                    <Users size={25} />
                                                </div>
                                                <h3 className="mt-4 font-semibold text-slate-900">
                                                    No contestants found
                                                </h3>
                                                <p className="mt-1 text-sm text-slate-500">
                                                    Try changing your search or
                                                    filter settings.
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSearch("");
                                                        setStatusFilter("all");
                                                        setPaymentFilter("all");
                                                    }}
                                                    className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                                                >
                                                    Clear filters
                                                </button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                            <span>
                                Showing {filteredContestants.length} contestants
                            </span>
                            <span>
                                Review contestant information before making a
                                decision.
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contestant details modal */}
            {selectedContestant && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
                    onClick={() => setSelectedContestant(null)}
                >
                    <div
                        className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Contestant Details
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Registration #{selectedContestant.id}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedContestant(null)}
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="max-h-[70vh] space-y-6 overflow-y-auto p-6">
                            <div className="flex flex-col items-center gap-4 rounded-xl bg-slate-50 p-5 sm:flex-row">
                                {selectedContestant.passport_photo ? (
                                    <img
                                        src={photoUrl(
                                            selectedContestant.passport_photo,
                                        )}
                                        alt={selectedContestant.full_name}
                                        className="h-24 w-24 rounded-2xl border border-slate-200 object-cover"
                                    />
                                ) : (
                                    <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                                        <ImageIcon size={32} />
                                    </div>
                                )}

                                <div className="text-center sm:text-left">
                                    <h3 className="text-xl font-bold text-slate-900">
                                        {selectedContestant.full_name}
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-500">
                                        {selectedContestant.position?.name ||
                                            selectedContestant.position ||
                                            "Position not specified"}
                                    </p>
                                    <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                                        <StatusBadge
                                            value={selectedContestant.status}
                                            styles={statusStyles}
                                        />
                                        <StatusBadge
                                            value={
                                                selectedContestant.payment_status
                                            }
                                            styles={paymentStyles}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">
                                    Contact Information
                                </h4>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Detail
                                        icon={Mail}
                                        label="Email Address"
                                        value={selectedContestant.email}
                                    />
                                    <Detail
                                        icon={Phone}
                                        label="Phone Number"
                                        value={selectedContestant.phone_number}
                                    />
                                    <Detail
                                        icon={MapPin}
                                        label="Address"
                                        value={selectedContestant.address}
                                    />
                                    <Detail
                                        icon={Briefcase}
                                        label="Position"
                                        value={
                                            selectedContestant.position?.name ||
                                            selectedContestant.position
                                        }
                                    />
                                    <Detail
                                        icon={CreditCard}
                                        label="Passport Number"
                                        value={
                                            selectedContestant.passport_number
                                        }
                                    />
                                    <Detail
                                        icon={CalendarDays}
                                        label="Registered On"
                                        value={formatDate(
                                            selectedContestant.created_at,
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-200 p-4">
                            <h4 className="text-sm font-bold text-slate-900">
                                Payment Management
                            </h4>

                            <p className="mt-1 text-sm text-slate-500">
                                Current payment status:{" "}
                                <span className="font-semibold text-slate-800">
                                    {selectedContestant.payment_status ===
                                    "paid"
                                        ? "Paid"
                                        : "Pending"}
                                </span>
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    updatePaymentStatus(
                                        selectedContestant,
                                        selectedContestant.payment_status ===
                                            "paid"
                                            ? "pending"
                                            : "paid",
                                    )
                                }
                                className={`mt-4 rounded-xl px-4 py-2.5 text-sm font-semibold ${
                                    selectedContestant.payment_status === "paid"
                                        ? "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                                }`}
                            >
                                {selectedContestant.payment_status === "paid"
                                    ? "Reset Payment to Pending"
                                    : "Confirm Payment Received"}
                            </button>
                        </div>

                        {selectedContestant.status === "pending" && (
                            <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={() =>
                                        updateStatus(
                                            selectedContestant,
                                            "rejected",
                                        )
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50"
                                >
                                    <XCircle size={17} />
                                    Reject
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        updateStatus(
                                            selectedContestant,
                                            "approved",
                                        )
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                                >
                                    <CheckCircle size={17} />
                                    Approve Contestant
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

function StatCard({ title, value, icon: Icon, iconClass }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>
                    <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                        {value}
                    </p>
                </div>
                <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconClass}`}
                >
                    <Icon size={22} />
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ value, styles }) {
    const label = value
        ? value
              .replaceAll("_", " ")
              .replace(/\b\w/g, (char) => char.toUpperCase())
        : "Unknown";

    return (
        <span
            className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                styles[value] || "bg-slate-100 text-slate-600 ring-slate-200"
            }`}
        >
            {label}
        </span>
    );
}

function Detail({ icon: Icon, label, value }) {
    return (
        <div className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-200 p-3.5">
            <div className="mt-0.5 rounded-lg bg-slate-100 p-2 text-slate-500">
                <Icon size={16} />
            </div>
            <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500">{label}</p>
                <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                    {value || "Not provided"}
                </p>
            </div>
        </div>
    );
}
