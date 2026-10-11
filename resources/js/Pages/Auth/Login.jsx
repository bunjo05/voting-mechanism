import { useState } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    ShieldCheck,
    Vote,
    ArrowRight,
} from "lucide-react";

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Sign In" />

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
                                Your voice.
                                <br />
                                Your choice.
                                <br />
                                Your future.
                            </h1>

                            <p className="mt-6 max-w-sm text-base leading-7 text-indigo-100">
                                Sign in to access your account and participate
                                in the voting process.
                            </p>
                        </div>

                        <div className="relative mt-12 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                            <div className="flex items-start gap-3">
                                <ShieldCheck
                                    className="mt-0.5 shrink-0 text-indigo-200"
                                    size={24}
                                />
                                <div>
                                    <h2 className="font-semibold">
                                        Account security
                                    </h2>
                                    <p className="mt-1 text-sm leading-6 text-indigo-100">
                                        Keep your password private and always
                                        sign out when using a shared device.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Login form */}
                    <div className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-16">
                        <div className="w-full max-w-md">
                            <div className="mb-8 lg:hidden">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                                    <Vote size={26} />
                                </div>
                                <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                                    Voting Portal
                                </p>
                            </div>

                            <div className="mb-8">
                                <p className="mb-2 text-sm font-semibold text-indigo-600">
                                    WELCOME BACK
                                </p>

                                <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                                    Sign in to your account
                                </h2>

                                <p className="mt-3 text-sm leading-6 text-slate-500">
                                    Enter your credentials below to continue.
                                </p>
                            </div>

                            {status && (
                                <div
                                    role="status"
                                    className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
                                >
                                    <ShieldCheck
                                        size={20}
                                        className="mt-0.5 shrink-0"
                                    />
                                    <p>{status}</p>
                                </div>
                            )}

                            {errors.email && (
                                <div
                                    role="alert"
                                    className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                                >
                                    Please check your login details and try
                                    again.
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-6">
                                {/* Email */}
                                <div>
                                    <InputLabel
                                        htmlFor="email"
                                        value="Email address"
                                        className="mb-2 text-sm font-semibold text-slate-700"
                                    />

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
                                            autoComplete="username"
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

                                {/* Password */}
                                <div>
                                    <div className="mb-2 flex items-center justify-between gap-3">
                                        <InputLabel
                                            htmlFor="password"
                                            value="Password"
                                            className="text-sm font-semibold text-slate-700"
                                        />

                                        {canResetPassword && (
                                            <Link
                                                href={route("password.request")}
                                                className="text-xs font-semibold text-indigo-600 transition hover:text-indigo-800 sm:text-sm"
                                            >
                                                Forgot password?
                                            </Link>
                                        )}
                                    </div>

                                    <div className="relative">
                                        <LockKeyhole
                                            size={19}
                                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <TextInput
                                            id="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="password"
                                            value={data.password}
                                            className="block w-full rounded-xl border-slate-200 py-3 pl-11 pr-12 text-sm shadow-sm transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                                            placeholder="Enter your password"
                                            autoComplete="current-password"
                                            required
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value,
                                                )
                                            }
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(
                                                    (previous) => !previous,
                                                )
                                            }
                                            aria-label={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            {showPassword ? (
                                                <EyeOff size={19} />
                                            ) : (
                                                <Eye size={19} />
                                            )}
                                        </button>
                                    </div>

                                    <InputError
                                        message={errors.password}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Remember me */}
                                <label className="flex cursor-pointer items-center gap-3">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData(
                                                "remember",
                                                e.target.checked,
                                            )
                                        }
                                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-slate-600">
                                        Remember me on this device
                                    </span>
                                </label>

                                {/* Submit */}
                                <PrimaryButton
                                    className="!mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition duration-200 hover:bg-indigo-700 hover:shadow-indigo-300 focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                                    disabled={processing}
                                >
                                    {processing ? "Signing in..." : "Sign in"}
                                    {!processing && <ArrowRight size={18} />}
                                </PrimaryButton>
                            </form>

                            <div className="mt-8 border-t border-slate-100 pt-6">
                                <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                                    <LockKeyhole size={14} />
                                    <span>
                                        Your account credentials are handled
                                        securely.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
