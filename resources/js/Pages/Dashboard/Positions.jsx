import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useState } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import {
    Plus,
    Search,
    BriefcaseBusiness,
    X,
    LoaderCircle,
    Pencil,
    Trash2,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";

export default function Positions({ positions = [] }) {
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState("");

    const { flash } = usePage().props;

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            name: "",
        });

    const openModal = () => {
        reset();
        clearErrors();
        setShowModal(true);
    };

    const closeModal = () => {
        if (processing) return;

        setShowModal(false);
        reset();
        clearErrors();
    };

    const submit = (e) => {
        e.preventDefault();

        post(route("positions.store"), {
            preserveScroll: true,
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    const filteredPositions = positions.filter((position) =>
        `${position.name}`.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <AuthenticatedLayout header="Positions">
            <Head title="Positions" />

            <div className="space-y-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                                <BriefcaseBusiness size={21} />
                            </span>

                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Election Positions
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Manage the positions contestants can run
                                    for.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={openModal}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <Plus size={19} />
                        Create Position
                    </button>
                </div>

                {/* Success message */}
                {flash?.success && (
                    <div
                        role="status"
                        className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
                    >
                        <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
                        <p>{flash.success}</p>
                    </div>
                )}

                {/* Summary card */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Total Positions
                                </p>
                                <p className="mt-2 text-3xl font-bold text-slate-900">
                                    {positions.length}
                                </p>
                            </div>

                            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                                <BriefcaseBusiness size={23} />
                            </span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Search Results
                                </p>
                                <p className="mt-2 text-3xl font-bold text-slate-900">
                                    {filteredPositions.length}
                                </p>
                            </div>

                            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                                <Search size={23} />
                            </span>
                        </div>
                    </div>
                </div>

                {/* Positions table */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="font-bold text-slate-900">
                                All Positions
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                                View and manage registered election positions.
                            </p>
                        </div>

                        <div className="relative w-full sm:max-w-xs">
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search positions..."
                                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                                        ID
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Position Name
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Date Created
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {filteredPositions.length > 0 ? (
                                    filteredPositions.map((position) => (
                                        <tr
                                            key={position.id}
                                            className="transition hover:bg-slate-50"
                                        >
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-500">
                                                #{position.id}
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                                                        <BriefcaseBusiness
                                                            size={19}
                                                        />
                                                    </span>

                                                    <span className="text-sm font-semibold text-slate-900">
                                                        {position.name}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                                                {position.created_at
                                                    ? new Date(
                                                          position.created_at,
                                                      ).toLocaleDateString()
                                                    : "—"}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="px-6 py-16 text-center"
                                        >
                                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                                <BriefcaseBusiness size={27} />
                                            </div>

                                            <h4 className="mt-4 font-semibold text-slate-900">
                                                {search
                                                    ? "No matching positions"
                                                    : "No positions created yet"}
                                            </h4>

                                            <p className="mt-2 text-sm text-slate-500">
                                                {search
                                                    ? "Try another search term."
                                                    : "Create your first position to get started."}
                                            </p>

                                            {!search && (
                                                <button
                                                    type="button"
                                                    onClick={openModal}
                                                    className="mt-4 inline-flex items-center gap-2 font-semibold text-blue-700 hover:text-blue-800"
                                                >
                                                    <Plus size={17} />
                                                    Create your first position
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Create Position Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) closeModal();
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="create-position-title"
                        className="my-auto w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
                    >
                        {/* Modal header */}
                        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                                    <BriefcaseBusiness size={23} />
                                </span>

                                <div>
                                    <h3
                                        id="create-position-title"
                                        className="text-lg font-bold text-slate-900"
                                    >
                                        Create Position
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Add a new position to the election.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={processing}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                                aria-label="Close modal"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal form */}
                        <form onSubmit={submit}>
                            <div className="space-y-5 px-6 py-6">
                                {errors.position && (
                                    <div className="flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                        <AlertCircle
                                            size={18}
                                            className="shrink-0"
                                        />
                                        {errors.position}
                                    </div>
                                )}

                                <div>
                                    <label
                                        htmlFor="position-name"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Position Name
                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        id="position-name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        placeholder="e.g. President"
                                        autoFocus
                                        maxLength={255}
                                        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                                            errors.name
                                                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                                : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                                        }`}
                                    />

                                    {errors.name && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
                                    <p className="text-xs leading-5 text-blue-800">
                                        Make sure the position name is correct.
                                        You can use it when assigning
                                        contestants to their respective election
                                        positions.
                                    </p>
                                </div>
                            </div>

                            {/* Modal footer */}
                            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={processing}
                                    className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {processing ? (
                                        <>
                                            <LoaderCircle
                                                size={17}
                                                className="animate-spin"
                                            />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={17} />
                                            Save Position
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
