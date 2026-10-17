import GuestLayout from "@/Layouts/GuestLayout";
import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import {
    User,
    Mail,
    MapPin,
    Briefcase,
    CreditCard,
    ArrowRight,
    ShieldCheck,
    Phone,
    Upload,
    FileImage,
    CheckCircle2,
    X,
} from "lucide-react";

export default function ContestantRegister({ positions }) {
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [successMessage, setSuccessMessage] = useState(
        "Your registration has been submitted successfully.",
    );

    const { data, setData, post, processing, errors, reset } = useForm({
        full_name: "",
        email: "",
        phone_number: "",
        address: "",
        position_id: "",
        passport_number: "",
        passport_photo: null,
    });

    const submitContestantRegistration = (e) => {
        e.preventDefault();

        post(route("contestant.register.submit"), {
            preserveScroll: true,
            forceFormData: true,

            onSuccess: (page) => {
                const message = page.props.flash?.success;

                setSuccessMessage(
                    message ||
                        "Your registration has been submitted successfully. Your application is now pending review.",
                );

                setShowSuccessModal(true);

                // Reset only after a successful server response.
                reset();
            },
        });
    };

    return (
        <GuestLayout>
            <Head title="Contestant Registration" />

            {/* Successful Registration Modal */}
            {showSuccessModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="success-modal-title"
                >
                    <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={() => setShowSuccessModal(false)}
                            aria-label="Close success modal"
                            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        >
                            <X size={20} />
                        </button>

                        {/* Success Content */}
                        <div className="px-7 pb-8 pt-10 text-center sm:px-9">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                                    <CheckCircle2
                                        size={36}
                                        className="text-emerald-600"
                                        strokeWidth={2}
                                    />
                                </div>
                            </div>

                            <h2
                                id="success-modal-title"
                                className="mt-6 text-2xl font-bold tracking-tight text-slate-900"
                            >
                                Registration Successful!
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-slate-600">
                                {successMessage}
                            </p>

                            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">
                                        <ShieldCheck
                                            size={21}
                                            className="text-amber-600"
                                        />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-amber-900">
                                            Application Pending Review
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-amber-800">
                                            Your registration has been received.
                                            Please wait for the administration
                                            team to review your application.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowSuccessModal(false)}
                                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
                            >
                                <CheckCircle2 size={18} />
                                Done
                            </button>
                        </div>

                        {/* Bottom Accent */}
                        <div className="h-1.5 bg-gradient-to-r from-indigo-600 via-violet-500 to-emerald-500" />
                    </div>
                </div>
            )}

            <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl">
                    {/* =========================
                        PAGE HEADER
                    ========================== */}
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                            <User size={30} strokeWidth={1.8} />
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Contestant Registration
                        </h1>

                        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                            Register your candidature by providing the required
                            personal and identification information below.
                        </p>
                    </div>

                    {/* =========================
                        MAIN CARD
                    ========================== */}
                    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
                        {/* Card Header */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 px-6 py-8 text-white sm:px-10">
                            {/* Decorative circles */}
                            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10" />
                            <div className="absolute -bottom-20 right-20 h-48 w-48 rounded-full bg-white/5" />

                            <div className="relative">
                                <div className="mb-2 flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
                                        <CheckCircle2 size={17} />
                                    </div>

                                    <span className="text-xs font-semibold uppercase tracking-widest text-indigo-100">
                                        Registration Form
                                    </span>
                                </div>

                                <h2 className="text-2xl font-bold">
                                    Personal Information
                                </h2>

                                <p className="mt-2 max-w-2xl text-sm leading-6 text-indigo-100">
                                    Please ensure that all information provided
                                    matches your official identification
                                    documents.
                                </p>
                            </div>
                        </div>

                        {/* =========================
                            FORM
                        ========================== */}
                        <form
                            className="p-6 sm:p-8 lg:p-10"
                            onSubmit={submitContestantRegistration}
                        >
                            {/* Section Header */}
                            <div className="mb-6 flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                    <User size={20} />
                                </div>

                                <div>
                                    <h3 className="text-base font-bold text-slate-900">
                                        Personal Details
                                    </h3>

                                    <p className="text-xs text-slate-500">
                                        Enter your personal contact information.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Full Name */}
                                <div className="md:col-span-2">
                                    <label
                                        htmlFor="full_name"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Full Names
                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <div className="relative">
                                        <User
                                            size={18}
                                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            id="full_name"
                                            name="full_name"
                                            type="text"
                                            value={data.full_name}
                                            onChange={(e) =>
                                                setData(
                                                    "full_name",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Enter your full legal name"
                                            autoComplete="name"
                                            required
                                            className={`w-full rounded-xl border bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition-all ${
                                                errors.full_name
                                                    ? "border-red-500 focus:ring-4 focus:ring-red-100"
                                                    : "border-slate-300 hover:border-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                            }`}
                                        />

                                        {errors.full_name && (
                                            <p className="mt-1.5 text-xs font-medium text-red-600">
                                                {errors.full_name}
                                            </p>
                                        )}
                                    </div>

                                    <p className="mt-1.5 text-xs text-slate-400">
                                        Use the name exactly as it appears on
                                        your passport.
                                    </p>
                                </div>
                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Email Address
                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <div className="relative">
                                        <Mail
                                            size={18}
                                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            placeholder="you@example.com"
                                            autoComplete="email"
                                            required
                                            className={`w-full rounded-xl border bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition-all ${
                                                errors.email
                                                    ? "border-red-500 focus:ring-4 focus:ring-red-100"
                                                    : "border-slate-300 hover:border-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                            }`}
                                        />

                                        {errors.email && (
                                            <p className="mt-1.5 text-xs font-medium text-red-600">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {/* Phone */}
                                <div>
                                    <label
                                        htmlFor="phone_number"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Phone Number
                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <div className="relative">
                                        <Phone
                                            size={18}
                                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            id="phone_number"
                                            name="phone_number"
                                            type="tel"
                                            value={data.phone_number}
                                            onChange={(e) =>
                                                setData(
                                                    "phone_number",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="+20 100 000 0000"
                                            autoComplete="tel"
                                            required
                                            className={`w-full rounded-xl border bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition-all ${
                                                errors.phone_number
                                                    ? "border-red-500 focus:ring-4 focus:ring-red-100"
                                                    : "border-slate-300 hover:border-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                            }`}
                                        />

                                        {errors.phone_number && (
                                            <p className="mt-1.5 text-xs font-medium text-red-600">
                                                {errors.phone_number}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {/* Address */}
                                <div>
                                    <label
                                        htmlFor="address"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Address
                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <div className="relative">
                                        <MapPin
                                            size={18}
                                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            id="address"
                                            name="address"
                                            type="text"
                                            value={data.address}
                                            onChange={(e) =>
                                                setData(
                                                    "address",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="City, Country"
                                            autoComplete="street-address"
                                            required
                                            className={`w-full rounded-xl border bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition-all ${
                                                errors.address
                                                    ? "border-red-500 focus:ring-4 focus:ring-red-100"
                                                    : "border-slate-300 hover:border-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                            }`}
                                        />

                                        {errors.address && (
                                            <p className="mt-1.5 text-xs font-medium text-red-600">
                                                {errors.address}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Position */}
                                <div>
                                    <label
                                        htmlFor="position_id"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Position
                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <div className="relative">
                                        <Briefcase
                                            size={18}
                                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <select
                                            id="position_id"
                                            name="position_id"
                                            value={data.position_id}
                                            onChange={(e) =>
                                                setData(
                                                    "position_id",
                                                    e.target.value,
                                                )
                                            }
                                            required
                                            disabled={
                                                !positions ||
                                                positions.length === 0
                                            }
                                            className={`w-full appearance-none rounded-xl border bg-white py-3.5 pl-11 pr-4 text-sm text-slate-700 shadow-sm outline-none transition-all ${
                                                errors.position_id
                                                    ? "border-red-500 focus:ring-4 focus:ring-red-100"
                                                    : "border-slate-300 hover:border-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                            }`}
                                        >
                                            <option value="" disabled>
                                                {!positions ||
                                                positions.length === 0
                                                    ? "No positions available"
                                                    : "Select Position"}
                                            </option>

                                            {positions?.map((position) => (
                                                <option
                                                    key={position.id}
                                                    value={position.id}
                                                >
                                                    {position.name}
                                                </option>
                                            ))}
                                        </select>

                                        {errors.position_id && (
                                            <p className="mt-1.5 text-xs font-medium text-red-600">
                                                {errors.position_id}
                                            </p>
                                        )}
                                    </div>

                                    <p className="mt-1.5 text-xs text-slate-400">
                                        Select the election position you wish to
                                        contest for.
                                    </p>
                                </div>
                            </div>

                            <div className="my-10 border-t border-slate-200 pt-8">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                        <CreditCard size={20} />
                                    </div>

                                    <div>
                                        <h3 className="text-base font-bold text-slate-900">
                                            Identification
                                        </h3>

                                        <p className="text-xs text-slate-500">
                                            Provide your official passport
                                            information.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* Passport Number */}
                                    <div>
                                        <label
                                            htmlFor="passport_number"
                                            className="mb-2 block text-sm font-semibold text-slate-700"
                                        >
                                            Passport Number
                                            <span className="ml-1 text-red-500">
                                                *
                                            </span>
                                        </label>

                                        <div className="relative">
                                            <CreditCard
                                                size={18}
                                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                            />

                                            <input
                                                id="passport_number"
                                                name="passport_number"
                                                type="text"
                                                value={data.passport_number}
                                                onChange={(e) =>
                                                    setData(
                                                        "passport_number",
                                                        e.target.value.toUpperCase(),
                                                    )
                                                }
                                                placeholder="Enter passport number"
                                                required
                                                className={`w-full rounded-xl border bg-white py-3.5 pl-11 pr-4 text-sm uppercase tracking-wide text-slate-900 placeholder-slate-400 shadow-sm outline-none transition-all ${
                                                    errors.passport_number
                                                        ? "border-red-500 focus:ring-4 focus:ring-red-100"
                                                        : "border-slate-300 hover:border-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                                }`}
                                            />

                                            {errors.passport_number && (
                                                <p className="mt-1.5 text-xs font-medium text-red-600">
                                                    {errors.passport_number}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Passport Photo */}
                                    <div>
                                        <label
                                            htmlFor="passport_photo"
                                            className="mb-2 block text-sm font-semibold text-slate-700"
                                        >
                                            Passport Photo
                                            <span className="ml-1 text-red-500">
                                                *
                                            </span>
                                        </label>

                                        <label
                                            htmlFor="passport_photo"
                                            className="group flex cursor-pointer items-center gap-4 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-3.5 transition-all hover:border-indigo-400 hover:bg-indigo-50/50"
                                        >
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                                                <Upload size={19} />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-semibold text-slate-700 group-hover:text-indigo-700">
                                                    Upload passport photo
                                                </p>

                                                <p className="mt-0.5 text-xs text-slate-400">
                                                    JPG, PNG or JPEG
                                                </p>
                                            </div>

                                            <FileImage
                                                size={20}
                                                className="shrink-0 text-slate-400"
                                            />
                                            <input
                                                id="passport_photo"
                                                name="passport_photo"
                                                type="file"
                                                accept="image/jpeg,image/png,image/jpg"
                                                required
                                                onChange={(e) =>
                                                    setData(
                                                        "passport_photo",
                                                        e.target.files[0],
                                                    )
                                                }
                                                className="hidden"
                                            />
                                            {errors.passport_photo && (
                                                <p className="mt-1.5 text-xs font-medium text-red-600">
                                                    {errors.passport_photo}
                                                </p>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* =========================
                                PRIVACY NOTICE
                            ========================== */}
                            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5">
                                <div className="flex gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                                        <ShieldCheck size={21} />
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-indigo-950">
                                            Your information is protected
                                        </h3>

                                        <p className="mt-1.5 text-sm leading-6 text-indigo-800/80">
                                            The information submitted through
                                            this registration form will be used
                                            for contestant registration,
                                            verification, and related
                                            administrative purposes.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* =========================
                                SUBMIT AREA
                            ========================== */}
                            <div className="mt-8 flex flex-col gap-4 border-t border-slate-200 pt-7 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-700">
                                        Ready to submit?
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Please review your information before
                                        completing registration.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                                >
                                    {processing ? (
                                        <>
                                            <svg
                                                className="h-5 w-5 animate-spin"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />

                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                                />
                                            </svg>
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            Submit Registration
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* =========================
                        FOOTER
                    ========================== */}
                    <div className="py-6 text-center">
                        <p className="text-xs leading-5 text-slate-400">
                            By submitting this form, you confirm that the
                            information provided is accurate and complete.
                        </p>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
