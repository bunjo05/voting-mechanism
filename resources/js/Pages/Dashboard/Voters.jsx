import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React, { useMemo, useState } from "react";
import {
    Users,
    Search,
    Mail,
    Phone,
    UserRound,
    Hash,
    ArrowUpDown,
    UserCheck,
    ClipboardList,
    X,
} from "lucide-react";

export default function Voters({ voters = [] }) {
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState("newest");

    const filteredVoters = useMemo(() => {
        const term = search.trim().toLowerCase();

        const filtered = voters.filter((voter) => {
            return [
                voter.full_name,
                voter.email,
                voter.phone_number,
                voter.passport_number,
            ].some((value) =>
                String(value ?? "")
                    .toLowerCase()
                    .includes(term),
            );
        });

        return [...filtered].sort((a, b) => {
            if (sortOrder === "name") {
                return String(a.full_name ?? "").localeCompare(
                    String(b.full_name ?? ""),
                );
            }

            if (sortOrder === "oldest") {
                return Number(a.id) - Number(b.id);
            }

            return Number(b.id) - Number(a.id);
        });
    }, [voters, search, sortOrder]);

    const voterCount = voters.length;
    const filteredCount = filteredVoters.length;
    const withEmail = voters.filter((voter) => voter.email).length;
    const withPhone = voters.filter((voter) => voter.phone_number).length;

    return (
        <AuthenticatedLayout>
            <Head title="Voters Management" />

            <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-7">
                    {/* Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-indigo-600">
                                <Users size={18} />
                                Election Administration
                            </div>

                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                Voters Management
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                                View registered voter records and find voter
                                contact information quickly.
                            </p>
                        </div>

                        <div className="flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                            <ClipboardList
                                size={20}
                                className="text-indigo-600"
                            />
                            <span className="text-sm font-medium text-gray-700">
                                Voter Directory
                            </span>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        <StatCard
                            title="Total registered voters"
                            value={voterCount}
                            description="All voter records in the system"
                            icon={<Users size={22} />}
                        />

                        <StatCard
                            title="With email addresses"
                            value={withEmail}
                            description="Voters with an email recorded"
                            icon={<Mail size={22} />}
                        />

                        <StatCard
                            title="With phone numbers"
                            value={withPhone}
                            description="Voters with a phone number recorded"
                            icon={<Phone size={22} />}
                        />
                    </div>

                    {/* Main table card */}
                    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-200 p-5 sm:p-6">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">
                                        Registered voters
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {search.trim()
                                            ? `${filteredCount} matching ${
                                                  filteredCount === 1
                                                      ? "record"
                                                      : "records"
                                              }`
                                            : `${voterCount} ${
                                                  voterCount === 1
                                                      ? "record"
                                                      : "records"
                                              } available`}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <div className="relative min-w-0 sm:min-w-72">
                                        <Search
                                            size={18}
                                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        />

                                        <input
                                            type="search"
                                            value={search}
                                            onChange={(event) =>
                                                setSearch(event.target.value)
                                            }
                                            placeholder="Search voters..."
                                            aria-label="Search voters"
                                            className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                        />

                                        {search && (
                                            <button
                                                type="button"
                                                onClick={() => setSearch("")}
                                                aria-label="Clear search"
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>

                                    <div className="relative">
                                        <ArrowUpDown
                                            size={16}
                                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        />

                                        <select
                                            value={sortOrder}
                                            onChange={(event) =>
                                                setSortOrder(event.target.value)
                                            }
                                            aria-label="Sort voters"
                                            className="w-full appearance-none rounded-xl border border-gray-300 bg-white py-2.5 pl-9 pr-8 text-sm text-gray-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:w-48"
                                        >
                                            <option value="newest">
                                                Newest first
                                            </option>
                                            <option value="oldest">
                                                Oldest first
                                            </option>
                                            <option value="name">
                                                Name A–Z
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {filteredVoters.length > 0 ? (
                            <>
                                {/* Desktop table */}
                                <div className="hidden overflow-x-auto md:block">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50">
                                            <tr className="border-b border-gray-200">
                                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                    Voter
                                                </th>
                                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                    Contact information
                                                </th>
                                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                    Passport number
                                                </th>
                                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                    Voter ID
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-gray-100">
                                            {filteredVoters.map((voter) => (
                                                <tr
                                                    key={voter.id}
                                                    className="transition hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-700">
                                                                <UserRound
                                                                    size={19}
                                                                />
                                                            </div>

                                                            <div className="min-w-0">
                                                                <p className="font-semibold text-gray-900">
                                                                    {voter.full_name ||
                                                                        "Name not provided"}
                                                                </p>
                                                                <p className="mt-1 text-xs text-gray-500">
                                                                    Registered
                                                                    voter
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <div className="space-y-2">
                                                            <ContactLine
                                                                icon={
                                                                    <Mail
                                                                        size={
                                                                            15
                                                                        }
                                                                    />
                                                                }
                                                                value={
                                                                    voter.email
                                                                }
                                                            />
                                                            <ContactLine
                                                                icon={
                                                                    <Phone
                                                                        size={
                                                                            15
                                                                        }
                                                                    />
                                                                }
                                                                value={
                                                                    voter.phone_number
                                                                }
                                                            />
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4 text-sm text-gray-700">
                                                        {voter.passport_number ||
                                                            "—"}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-1.5 font-mono text-xs font-semibold text-gray-600">
                                                            #{voter.id}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile cards */}
                                <div className="space-y-3 p-4 md:hidden">
                                    {filteredVoters.map((voter) => (
                                        <article
                                            key={voter.id}
                                            className="rounded-xl border border-gray-200 p-4"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-700">
                                                    <UserRound size={21} />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <h3 className="break-words font-semibold text-gray-900">
                                                        {voter.full_name ||
                                                            "Name not provided"}
                                                    </h3>

                                                    <p className="mt-1 text-xs text-gray-500">
                                                        Voter ID: #{voter.id}
                                                    </p>
                                                </div>

                                                <UserCheck
                                                    size={18}
                                                    className="shrink-0 text-emerald-600"
                                                />
                                            </div>

                                            <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
                                                <ContactLine
                                                    icon={<Mail size={16} />}
                                                    value={voter.email}
                                                />

                                                <ContactLine
                                                    icon={<Phone size={16} />}
                                                    value={voter.phone_number}
                                                />

                                                <ContactLine
                                                    icon={<Hash size={16} />}
                                                    value={
                                                        voter.passport_number
                                                    }
                                                    label="Passport"
                                                />
                                            </div>
                                        </article>
                                    ))}
                                </div>

                                <div className="border-t border-gray-200 bg-gray-50 px-5 py-4 sm:px-6">
                                    <p className="text-xs text-gray-500">
                                        Showing {filteredCount} of {voterCount}{" "}
                                        registered{" "}
                                        {voterCount === 1 ? "voter" : "voters"}.
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className="px-6 py-16 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                                    {search ? (
                                        <Search size={26} />
                                    ) : (
                                        <Users size={26} />
                                    )}
                                </div>

                                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                                    {search
                                        ? "No matching voters"
                                        : "No voters registered yet"}
                                </h3>

                                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                                    {search
                                        ? "Try another name, email address, phone number, or passport number."
                                        : "Registered voters will appear here when voter records have been added to the system."}
                                </p>

                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch("")}
                                        className="mt-5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Clear search
                                    </button>
                                )}
                            </div>
                        )}
                    </section>

                    <p className="text-xs leading-5 text-gray-500">
                        Voter contact and passport information should only be
                        accessible to authorized election administrators.
                    </p>
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
                        {value.toLocaleString()}
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

function ContactLine({ icon, value, label }) {
    return (
        <div className="flex min-w-0 items-center gap-2 text-sm text-gray-600">
            <span className="shrink-0 text-gray-400">{icon}</span>
            {label && <span className="shrink-0 text-gray-500">{label}:</span>}
            {value ? (
                <span className="break-all">{value}</span>
            ) : (
                <span className="text-gray-400">Not provided</span>
            )}
        </div>
    );
}
