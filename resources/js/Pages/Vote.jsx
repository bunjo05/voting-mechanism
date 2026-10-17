import React from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import {
    Users,
    UserRound,
    Briefcase,
    Mail,
    Phone,
    MapPin,
    CheckCircle2,
    Vote as VoteIcon,
    ArrowRight,
    ArrowUp,
    ClipboardCheck,
    ShieldCheck,
    CircleCheck,
    AlertCircle,
    ChevronRight,
} from "lucide-react";

export default function Vote({ positions = [], contestants = [] }) {
    const { props } = usePage();

    const { data, setData, post, processing, errors } = useForm({
        full_name: "",
        email: "",
        phone_number: "",
        passport_number: "",
        votes: {},
    });

    const selectedCount = Object.keys(data.votes).length;

    const totalPositions = positions.filter(
        (position) => (position.contestants?.length ?? 0) > 0,
    ).length;

    const allSelected = selectedCount === totalPositions && totalPositions > 0;

    const getPhotoUrl = (path) => {
        if (!path) return null;

        if (path.startsWith("http://") || path.startsWith("https://")) {
            return path;
        }

        return `/public/${path.replace(/^\/?storage\//, "")}`;
    };

    const updateVoterField = (field, value) => {
        setData(field, value);
    };

    const selectContestant = (positionId, contestantId) => {
        setData("votes", {
            ...data.votes,
            [positionId]: contestantId,
        });
    };

    const removeSelection = (positionId) => {
        const updatedVotes = { ...data.votes };
        delete updatedVotes[positionId];
        setData("votes", updatedVotes);
    };

    const getSelectedContestant = (position) => {
        return position.contestants?.find(
            (contestant) =>
                String(contestant.id) === String(data.votes[position.id]),
        );
    };

    const submitVotes = (event) => {
        event.preventDefault();

        post(route("vote.submit"), {
            preserveScroll: true,
        });
    };

    const voterFields = [
        {
            name: "full_name",
            label: "Full name",
            placeholder: "Enter your full name",
            type: "text",
            icon: UserRound,
            autocomplete: "name",
        },
        {
            name: "email",
            label: "Email address",
            placeholder: "you@example.com",
            type: "email",
            icon: Mail,
            autocomplete: "email",
        },
        {
            name: "phone_number",
            label: "Phone number",
            placeholder: "Enter your phone number",
            type: "tel",
            icon: Phone,
            autocomplete: "tel",
        },
        {
            name: "passport_number",
            label: "Passport number",
            placeholder: "Enter your passport number",
            type: "text",
            icon: ShieldCheck,
            autocomplete: "off",
        },
    ];

    return (
        <GuestLayout>
            <Head title="Election Voting Portal" />

            <div className="min-h-screen bg-slate-50 text-slate-800">
                {/* Election overview */}
                <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-blue-800 px-4 py-12 text-white sm:py-16">
                    <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />

                    <div className="relative mx-auto max-w-7xl">
                        <div className="max-w-3xl">
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm font-medium text-indigo-100">
                                <VoteIcon size={16} />
                                Election Portal
                            </div>

                            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
                                Make your vote count
                            </h1>

                            <p className="mt-4 max-w-2xl text-sm leading-7 text-indigo-100 sm:text-base">
                                Review the eligible contestants for each
                                position, select your preferred candidates, and
                                check your choices before submitting.
                            </p>
                        </div>

                        <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:gap-4">
                            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 sm:p-5">
                                <div className="flex items-center gap-2 text-indigo-100">
                                    <Users size={19} />
                                    <span className="text-sm">
                                        Eligible contestants
                                    </span>
                                </div>
                                <p className="mt-3 text-3xl font-bold">
                                    {contestants.length}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 sm:p-5">
                                <div className="flex items-center gap-2 text-indigo-100">
                                    <Briefcase size={19} />
                                    <span className="text-sm">
                                        Available positions
                                    </span>
                                </div>
                                <p className="mt-3 text-3xl font-bold">
                                    {totalPositions}
                                </p>
                            </div>
                        </div>

                        <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-sm text-indigo-100">
                            <span className="inline-flex items-center gap-2">
                                <CheckCircle2 size={17} />
                                One selection per position
                            </span>
                            <span className="inline-flex items-center gap-2">
                                <ShieldCheck size={17} />
                                Review before submitting
                            </span>
                        </div>
                    </div>
                </section>

                <form onSubmit={submitVotes}>
                    <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:py-10">
                        {/* Flash feedback */}
                        {props.flash?.success && (
                            <div
                                role="status"
                                className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800"
                            >
                                <CircleCheck
                                    size={22}
                                    className="mt-0.5 shrink-0"
                                />
                                <div>
                                    <p className="font-semibold">
                                        Vote submission successful
                                    </p>
                                    <p className="mt-1 text-sm">
                                        {props.flash.success}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Form-level errors */}
                        {Object.keys(errors).length > 0 && (
                            <div
                                role="alert"
                                className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800"
                            >
                                <AlertCircle
                                    size={21}
                                    className="mt-0.5 shrink-0"
                                />
                                <div>
                                    <p className="font-semibold">
                                        Please review your submission
                                    </p>
                                    <p className="mt-1 text-sm">
                                        Some information needs attention. Check
                                        the messages below and try again.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Voting progress */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-indigo-700">
                                        YOUR VOTING PROGRESS
                                    </p>
                                    <h2 className="mt-1 text-xl font-bold text-slate-900">
                                        {selectedCount} of {totalPositions}{" "}
                                        positions selected
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Choose one contestant for each position
                                        you want to vote in.
                                    </p>
                                </div>

                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                                    <ClipboardCheck size={28} />
                                </div>
                            </div>

                            <div
                                className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100"
                                role="progressbar"
                                aria-label="Voting progress"
                                aria-valuemin={0}
                                aria-valuemax={totalPositions || 1}
                                aria-valuenow={selectedCount}
                            >
                                <div
                                    className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                                    style={{
                                        width: `${
                                            totalPositions > 0
                                                ? Math.min(
                                                      100,
                                                      (selectedCount /
                                                          totalPositions) *
                                                          100,
                                                  )
                                                : 0
                                        }%`,
                                    }}
                                />
                            </div>

                            {totalPositions > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {positions
                                        .filter(
                                            (position) =>
                                                position.contestants?.length,
                                        )
                                        .map((position, index) => {
                                            const selected =
                                                !!getSelectedContestant(
                                                    position,
                                                );

                                            return (
                                                <a
                                                    key={position.id}
                                                    href={`#position-${position.id}`}
                                                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition ${
                                                        selected
                                                            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                                            : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-700"
                                                    }`}
                                                >
                                                    {selected ? (
                                                        <CheckCircle2
                                                            size={14}
                                                        />
                                                    ) : (
                                                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 text-[10px]">
                                                            {index + 1}
                                                        </span>
                                                    )}
                                                    {position.name}
                                                </a>
                                            );
                                        })}
                                </div>
                            )}
                        </section>

                        {/* Voter information */}
                        <section
                            id="voter-information"
                            className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm"
                        >
                            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                                        <UserRound size={22} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900">
                                            1. Voter information
                                        </h2>
                                        <p className="mt-1 text-sm leading-6 text-slate-500">
                                            Complete your details before
                                            submitting your selections.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">
                                {voterFields.map((field) => {
                                    const FieldIcon = field.icon;

                                    return (
                                        <div key={field.name}>
                                            <label
                                                htmlFor={field.name}
                                                className="mb-2 block text-sm font-semibold text-slate-700"
                                            >
                                                {field.label}
                                                <span className="ml-1 text-red-500">
                                                    *
                                                </span>
                                            </label>

                                            <div className="relative">
                                                <FieldIcon
                                                    size={18}
                                                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                                />
                                                <input
                                                    id={field.name}
                                                    name={field.name}
                                                    type={field.type}
                                                    autoComplete={
                                                        field.autocomplete
                                                    }
                                                    value={data[field.name]}
                                                    onChange={(event) =>
                                                        updateVoterField(
                                                            field.name,
                                                            event.target.value,
                                                        )
                                                    }
                                                    placeholder={
                                                        field.placeholder
                                                    }
                                                    required
                                                    aria-invalid={
                                                        !!errors[field.name]
                                                    }
                                                    aria-describedby={
                                                        errors[field.name]
                                                            ? `${field.name}-error`
                                                            : undefined
                                                    }
                                                    className={`w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                                                        errors[field.name]
                                                            ? "border-red-300 focus:border-red-400 focus:ring-red-50"
                                                            : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-50"
                                                    }`}
                                                />
                                            </div>

                                            {errors[field.name] && (
                                                <p
                                                    id={`${field.name}-error`}
                                                    className="mt-2 text-sm text-red-600"
                                                >
                                                    {errors[field.name]}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}

                                <div className="sm:col-span-2">
                                    <div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3.5 text-xs leading-5 text-slate-600">
                                        <ShieldCheck
                                            size={17}
                                            className="mt-0.5 shrink-0 text-slate-500"
                                        />
                                        <p>
                                            Enter accurate information. Do not
                                            enter another person's identity
                                            details. Your application's voter
                                            verification rules still apply.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Contestant selection */}
                        <section>
                            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-indigo-700">
                                        STEP 2
                                    </p>
                                    <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
                                        Choose your contestants
                                    </h2>
                                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                                        Review each profile and select your
                                        preferred contestant. You can change
                                        your selection before submitting.
                                    </p>
                                </div>

                                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">
                                    <CheckCircle2
                                        size={17}
                                        className="text-emerald-600"
                                    />
                                    {selectedCount} selected
                                </span>
                            </div>

                            {positions.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                        <Users size={28} />
                                    </div>
                                    <h3 className="mt-4 text-lg font-bold text-slate-900">
                                        No eligible contestants yet
                                    </h3>
                                    <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                                        Contestants will appear here once their
                                        registrations are approved and their
                                        payments are confirmed.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-10">
                                    {positions.map(
                                        (position, positionIndex) => {
                                            const selected =
                                                getSelectedContestant(position);

                                            return (
                                                <section
                                                    key={position.id}
                                                    id={`position-${position.id}`}
                                                    className="scroll-mt-6"
                                                >
                                                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                        <div className="flex items-start gap-3">
                                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 font-bold text-indigo-700">
                                                                {positionIndex +
                                                                    1}
                                                            </div>
                                                            <div>
                                                                <h3 className="text-xl font-bold text-slate-900">
                                                                    {
                                                                        position.name
                                                                    }
                                                                </h3>
                                                                {position.description && (
                                                                    <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                                                                        {
                                                                            position.description
                                                                        }
                                                                    </p>
                                                                )}
                                                                <p className="mt-1 text-xs text-slate-500">
                                                                    {position
                                                                        .contestants
                                                                        ?.length ||
                                                                        0}{" "}
                                                                    eligible{" "}
                                                                    {(position
                                                                        .contestants
                                                                        ?.length ||
                                                                        0) === 1
                                                                        ? "contestant"
                                                                        : "contestants"}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div
                                                            className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${
                                                                selected
                                                                    ? "bg-emerald-50 text-emerald-700"
                                                                    : "bg-amber-50 text-amber-800"
                                                            }`}
                                                        >
                                                            {selected ? (
                                                                <CheckCircle2
                                                                    size={15}
                                                                />
                                                            ) : (
                                                                <AlertCircle
                                                                    size={15}
                                                                />
                                                            )}
                                                            {selected
                                                                ? "Your choice: " +
                                                                  selected.full_name
                                                                : "No selection yet"}
                                                        </div>
                                                    </div>

                                                    {!position.contestants
                                                        ?.length ? (
                                                        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
                                                            No eligible
                                                            contestants are
                                                            available for this
                                                            position.
                                                        </div>
                                                    ) : (
                                                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                                            {position.contestants.map(
                                                                (
                                                                    contestant,
                                                                ) => {
                                                                    const isSelected =
                                                                        String(
                                                                            data
                                                                                .votes[
                                                                                position
                                                                                    .id
                                                                            ] ??
                                                                                "",
                                                                        ) ===
                                                                        String(
                                                                            contestant.id,
                                                                        );

                                                                    return (
                                                                        <article
                                                                            key={
                                                                                contestant.id
                                                                            }
                                                                            className={`flex flex-col overflow-hidden rounded-2xl border bg-white transition ${
                                                                                isSelected
                                                                                    ? "border-indigo-500 ring-2 ring-indigo-100 shadow-md"
                                                                                    : "border-slate-200 shadow-sm hover:border-indigo-200 hover:shadow-md"
                                                                            }`}
                                                                        >
                                                                            <div className="relative flex h-56 items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 to-slate-100">
                                                                                {contestant.passport_photo ? (
                                                                                    <img
                                                                                        src={getPhotoUrl(
                                                                                            contestant.passport_photo,
                                                                                        )}
                                                                                        alt={`${contestant.full_name} profile`}
                                                                                        loading="lazy"
                                                                                        className="h-full w-full object-cover"
                                                                                        onError={(
                                                                                            event,
                                                                                        ) => {
                                                                                            event.currentTarget.style.display =
                                                                                                "none";
                                                                                        }}
                                                                                    />
                                                                                ) : (
                                                                                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-indigo-300 shadow-sm">
                                                                                        <UserRound
                                                                                            size={
                                                                                                48
                                                                                            }
                                                                                        />
                                                                                    </div>
                                                                                )}

                                                                                <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
                                                                                    <CheckCircle2
                                                                                        size={
                                                                                            14
                                                                                        }
                                                                                    />
                                                                                    Eligible
                                                                                </span>

                                                                                {isSelected && (
                                                                                    <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-indigo-700 px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
                                                                                        <CheckCircle2
                                                                                            size={
                                                                                                14
                                                                                            }
                                                                                        />
                                                                                        Selected
                                                                                    </span>
                                                                                )}
                                                                            </div>

                                                                            <div className="flex flex-1 flex-col p-5">
                                                                                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                                                                                    {
                                                                                        position.name
                                                                                    }
                                                                                </p>

                                                                                <h4 className="mt-2 break-words text-lg font-bold text-slate-900">
                                                                                    {
                                                                                        contestant.full_name
                                                                                    }
                                                                                </h4>

                                                                                {/* <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                                                                                    {contestant.email && (
                                                                                        <div className="flex items-start gap-2.5 text-sm text-slate-600">
                                                                                            <Mail
                                                                                                size={
                                                                                                    16
                                                                                                }
                                                                                                className="mt-0.5 shrink-0 text-slate-400"
                                                                                            />
                                                                                            <span className="break-all">
                                                                                                {
                                                                                                    contestant.email
                                                                                                }
                                                                                            </span>
                                                                                        </div>
                                                                                    )}

                                                                                    {contestant.phone_number && (
                                                                                        <div className="flex items-start gap-2.5 text-sm text-slate-600">
                                                                                            <Phone
                                                                                                size={
                                                                                                    16
                                                                                                }
                                                                                                className="mt-0.5 shrink-0 text-slate-400"
                                                                                            />
                                                                                            <span className="break-words">
                                                                                                {
                                                                                                    contestant.phone_number
                                                                                                }
                                                                                            </span>
                                                                                        </div>
                                                                                    )}

                                                                                    {contestant.address && (
                                                                                        <div className="flex items-start gap-2.5 text-sm text-slate-600">
                                                                                            <MapPin
                                                                                                size={
                                                                                                    16
                                                                                                }
                                                                                                className="mt-0.5 shrink-0 text-slate-400"
                                                                                            />
                                                                                            <span className="break-words">
                                                                                                {
                                                                                                    contestant.address
                                                                                                }
                                                                                            </span>
                                                                                        </div>
                                                                                    )}
                                                                                </div> */}

                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() =>
                                                                                        selectContestant(
                                                                                            position.id,
                                                                                            contestant.id,
                                                                                        )
                                                                                    }
                                                                                    aria-pressed={
                                                                                        isSelected
                                                                                    }
                                                                                    className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-4 ${
                                                                                        isSelected
                                                                                            ? "bg-indigo-700 text-white focus:ring-indigo-100"
                                                                                            : "border border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 focus:ring-indigo-100"
                                                                                    }`}
                                                                                >
                                                                                    {isSelected ? (
                                                                                        <>
                                                                                            <CheckCircle2
                                                                                                size={
                                                                                                    18
                                                                                                }
                                                                                            />
                                                                                            Selected
                                                                                        </>
                                                                                    ) : (
                                                                                        <>
                                                                                            <VoteIcon
                                                                                                size={
                                                                                                    18
                                                                                                }
                                                                                            />
                                                                                            Select
                                                                                            this
                                                                                            contestant
                                                                                        </>
                                                                                    )}
                                                                                </button>
                                                                            </div>
                                                                        </article>
                                                                    );
                                                                },
                                                            )}
                                                        </div>
                                                    )}

                                                    {errors[
                                                        `votes.${position.id}`
                                                    ] && (
                                                        <p
                                                            role="alert"
                                                            className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                                                        >
                                                            {
                                                                errors[
                                                                    `votes.${position.id}`
                                                                ]
                                                            }
                                                        </p>
                                                    )}

                                                    {selected && (
                                                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                                                            <p className="flex items-center gap-2 text-sm text-emerald-800">
                                                                <CheckCircle2
                                                                    size={18}
                                                                />
                                                                Selected:{" "}
                                                                <strong>
                                                                    {
                                                                        selected.full_name
                                                                    }
                                                                </strong>
                                                            </p>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeSelection(
                                                                        position.id,
                                                                    )
                                                                }
                                                                className="text-sm font-semibold text-emerald-800 underline underline-offset-4 hover:text-emerald-950"
                                                            >
                                                                Clear selection
                                                            </button>
                                                        </div>
                                                    )}
                                                </section>
                                            );
                                        },
                                    )}
                                </div>
                            )}
                        </section>

                        {/* Final review */}
                        <section
                            id="review-votes"
                            className="scroll-mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                        >
                            <div className="border-b border-slate-100 p-5 sm:p-6">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                                        <ClipboardCheck size={22} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-indigo-700">
                                            STEP 3
                                        </p>
                                        <h2 className="mt-1 text-xl font-bold text-slate-900">
                                            Review your selections
                                        </h2>
                                        <p className="mt-1 text-sm leading-6 text-slate-500">
                                            Check your choices before sending
                                            your ballot.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 sm:p-6">
                                {selectedCount === 0 ? (
                                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
                                        <VoteIcon
                                            size={28}
                                            className="mx-auto text-slate-400"
                                        />
                                        <p className="mt-3 font-semibold text-slate-700">
                                            You haven't selected any contestants
                                            yet
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Return to the contestant cards and
                                            choose your preferred candidates.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {positions.map((position) => {
                                            const selected =
                                                getSelectedContestant(position);

                                            if (!selected) return null;

                                            return (
                                                <div
                                                    key={position.id}
                                                    className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4"
                                                >
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                            {position.name}
                                                        </p>
                                                        <p className="mt-1 break-words font-semibold text-slate-900">
                                                            {selected.full_name}
                                                        </p>
                                                    </div>

                                                    <div className="flex shrink-0 items-center gap-2">
                                                        <CheckCircle2
                                                            size={18}
                                                            className="text-emerald-600"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                document
                                                                    .getElementById(
                                                                        `position-${position.id}`,
                                                                    )
                                                                    ?.scrollIntoView(
                                                                        {
                                                                            behavior:
                                                                                "smooth",
                                                                            block: "start",
                                                                        },
                                                                    );
                                                            }}
                                                            className="text-sm font-semibold text-indigo-700 hover:text-indigo-900"
                                                        >
                                                            Change
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                <div className="mt-6 rounded-xl bg-slate-50 p-4">
                                    <div className="flex items-start gap-3">
                                        <ShieldCheck
                                            size={20}
                                            className="mt-0.5 shrink-0 text-slate-500"
                                        />
                                        <p className="text-sm leading-6 text-slate-600">
                                            Submitting will record your
                                            selections. Check your voter details
                                            and choices carefully before
                                            continuing. The server validates
                                            contestant eligibility and whether a
                                            vote has already been recorded for a
                                            position.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">
                                            {selectedCount}{" "}
                                            {selectedCount === 1
                                                ? "selection"
                                                : "selections"}{" "}
                                            ready
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            You may leave positions unselected
                                            if you do not wish to vote in them.
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={
                                            processing ||
                                            selectedCount === 0 ||
                                            positions.length === 0
                                        }
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                                    >
                                        {processing ? (
                                            <>
                                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                                Submitting ballot...
                                            </>
                                        ) : (
                                            <>
                                                Submit my votes
                                                <ArrowRight size={18} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </section>

                        <div className="flex justify-center pb-2">
                            <a
                                href="#voter-information"
                                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-700"
                            >
                                <ArrowUp size={16} />
                                Back to voter information
                                <ChevronRight size={15} />
                            </a>
                        </div>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}
