import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    KeyRound,
    LockKeyhole,
    Mail,
    ShieldCheck,
    Vote,
} from "lucide-react";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("password.email"));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="relative flex min-h-[calc(100vh-73px)] items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
                {/* Decorative background */}
                <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-100/70 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-blue-100/70 blur-3xl" />

                <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 lg:grid-cols-2">
                    {/* Branding panel */}
                    <div className="relative hidden flex-col justify-between overflow-hidden bg-indigo-700 p-10 text-white lg:flex xl:p-12">
                        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[40px] border-white/5" />
                        <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full border-[50px] border-white/5" />

                        <div className="relative">
                            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                                <Vote size={30} />
                            </div>

                            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-200">
                                Voting Portal
                            </p>

                            <h1 className="max-w-sm text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
                                Get back to
                                <br />
                                your account.
                            </h1>

                            <p className="mt-6 max-w-sm text-base leading-7 text-indigo-100">
                                Forgot your password? Follow a few simple steps
                                to regain access to your account.
                            </p>
                        </div>

                        <div className="relative mt-12 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                            <div className="flex items-start gap-3">
                                <ShieldCheck
                                    size={24}
                                    className="mt-0.5 shrink-0 text-indigo-200"
                                />
                                <div>
                                    <h2 className="font-semibold">
                                        Secure password recovery
                                    </h2>
                                    <p className="mt-1 text-sm leading-6 text-indigo-100">
                                        Use the email address associated with
                                        your account and follow the instructions
                                        in the reset email.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Password recovery form */}
                    <div className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-16">
                        <div className="w-full max-w-md">
                            {/* Mobile branding */}
                            <div className="mb-8 lg:hidden">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                                    <KeyRound size={26} />
                                </div>

                                <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                                    Voting Portal
                                </p>
                            </div>

                            <Link
                                href={route("login")}
                                className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-700"
                            >
                                <ArrowLeft size={16} />
                                Back to sign in
                            </Link>

                            <div className="mb-8 mt-5">
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                                    <Mail size={27} />
                                </div>

                                <p className="mb-2 text-sm font-semibold text-indigo-600">
                                    ACCOUNT RECOVERY
                                </p>

                                <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                                    Forgot your password?
                                </h2>

                                <p className="mt-3 text-sm leading-6 text-slate-500">
                                    Enter the email address registered to your
                                    account. If it is eligible for recovery, we
                                    will send you a password reset link.
                                </p>
                            </div>

                            {/* Success/status message from Laravel */}
                            {status && (
                                <div
                                    role="status"
                                    className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
                                >
                                    <CheckCircle2
                                        size={21}
                                        className="mt-0.5 shrink-0"
                                    />
                                    <div>
                                        <p className="font-semibold">
                                            Check your email
                                        </p>
                                        <p className="mt-1 leading-6">
                                            {status}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Email address
                                    </label>

                                    <div className="relative">
                                        <Mail
                                            size={19}
                                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="block w-full rounded-xl border-slate-200 py-3 pl-11 pr-4 text-sm shadow-sm transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                                            placeholder="you@example.com"
                                            autoComplete="email"
                                            autoFocus
                                            required
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                        />
                                    </div>

                                    <InputError
                                        message={errors.email}
                                        className="mt-2"
                                    />
                                </div>

                                <PrimaryButton
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition duration-200 hover:bg-indigo-700 hover:shadow-indigo-300 focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                                    disabled={processing}
                                >
                                    {processing
                                        ? "Sending reset link..."
                                        : "Email password reset link"}

                                    {!processing && <ArrowRight size={18} />}
                                </PrimaryButton>
                            </form>

                            <div className="mt-8 border-t border-slate-100 pt-6">
                                <div className="flex items-start justify-center gap-2 text-xs leading-5 text-slate-500">
                                    <LockKeyhole
                                        size={15}
                                        className="mt-0.5 shrink-0"
                                    />
                                    <p>
                                        For your security, only use password
                                        reset links sent through the official
                                        account recovery process.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
