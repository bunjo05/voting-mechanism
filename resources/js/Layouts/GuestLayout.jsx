import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";

export default function GuestLayout({ children }) {
    const navigation = [
        {
            name: "Vote",
            href: route("vote"),
            active: route().current("vote"),
        },
        {
            name: "Results",
            href: route("results"),
            active: route().current("results"),
        },
        {
            name: "Contestant Registration",
            href: route("contestant.register"),
            active: route().current("contestant.register"),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
                <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    {/* Logo and application name */}
                    <Link
                        href={route("vote")}
                        className="flex items-center gap-3"
                    >
                        <ApplicationLogo className="h-10 w-10 fill-current text-indigo-600" />

                        <div>
                            <span className="block text-lg font-bold tracking-tight text-gray-900">
                                Voting Portal
                            </span>
                            <span className="hidden text-xs text-gray-500 sm:block">
                                Participate. Choose. Make a Difference.
                            </span>
                        </div>
                    </Link>

                    {/* Navigation links */}
                    <div className="flex items-center gap-1 sm:gap-3">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                aria-current={item.active ? "page" : undefined}
                                className={`rounded-lg px-3 py-2 text-sm font-medium transition duration-200 sm:px-4 ${
                                    item.active
                                        ? "bg-indigo-50 text-indigo-700"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </nav>
            </header>

            {/* Main page content */}
            <main className="min-h-[calc(100vh-73px)]">{children}</main>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-5 text-center text-sm text-gray-500 sm:px-6 lg:px-8">
                    © {new Date().getFullYear()} Voting Portal. All rights
                    reserved.
                </div>
            </footer>
        </div>
    );
}
