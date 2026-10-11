import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import {
    LayoutDashboard,
    BriefcaseBusiness,
    Users,
    UserRoundCheck,
    ChartNoAxesColumnIncreasing,
    Menu,
    X,
    ChevronDown,
    LogOut,
    UserRound,
    Vote,
    PanelLeftClose,
    PanelLeftOpen,
} from "lucide-react";

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const navigation = [
        {
            name: "Dashboard",
            href: route("dashboard"),
            active: route().current("dashboard"),
            icon: LayoutDashboard,
        },
        {
            name: "Positions",
            href: route("admin.positions"),
            active:
                route().current("admin.positions.*") ||
                route().current("admin.positions"),
            icon: BriefcaseBusiness,
        },
        {
            name: "Contestants",
            href: route("admin.contestants"),
            active:
                route().current("admin.contestants.*") ||
                route().current("admin.contestants"),
            icon: Users,
        },
        {
            name: "Voters",
            href: route("admin.voters"),
            active:
                route().current("admin.voters.*") ||
                route().current("admin.voters"),
            icon: UserRoundCheck,
        },
        {
            name: "Results",
            href: route("admin.results"),
            active:
                route().current("admin.results.*") ||
                route().current("admin.results"),
            icon: ChartNoAxesColumnIncreasing,
        },
    ];

    const NavItems = ({ mobile = false }) => (
        <nav className="space-y-1.5">
            {navigation.map((item) => {
                const Icon = item.icon;

                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => {
                            if (mobile) {
                                setShowingNavigationDropdown(false);
                            }
                        }}
                        title={sidebarCollapsed && !mobile ? item.name : ""}
                        className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                            item.active
                                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                : "text-slate-600 hover:bg-slate-100 hover:text-blue-700"
                        } ${sidebarCollapsed && !mobile ? "justify-center" : ""}`}
                    >
                        <Icon
                            size={20}
                            strokeWidth={1.8}
                            className="shrink-0"
                        />

                        {(!sidebarCollapsed || mobile) && (
                            <span>{item.name}</span>
                        )}

                        {item.active && (!sidebarCollapsed || mobile) && (
                            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
                        )}
                    </Link>
                );
            })}
        </nav>
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            {/* Top Navigation */}
            <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
                <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        {/* Mobile Menu Button */}
                        <button
                            type="button"
                            onClick={() =>
                                setShowingNavigationDropdown(
                                    (previous) => !previous,
                                )
                            }
                            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
                            aria-label="Toggle navigation menu"
                        >
                            {showingNavigationDropdown ? (
                                <X size={22} />
                            ) : (
                                <Menu size={22} />
                            )}
                        </button>

                        <Link
                            href={route("dashboard")}
                            className="flex items-center gap-3"
                        >
                            <ApplicationLogo className="block h-9 w-auto fill-current text-blue-700" />

                            <div className="hidden sm:block">
                                <p className="text-base font-bold tracking-tight text-slate-900">
                                    Voting Portal
                                </p>
                                <p className="text-xs text-slate-500">
                                    Election Management System
                                </p>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop User Menu */}
                    <div className="hidden items-center gap-4 sm:flex">
                        <div className="hidden text-right md:block">
                            <p className="text-sm font-semibold text-slate-800">
                                {user?.name ?? "User"}
                            </p>
                            <p className="text-xs text-slate-500">
                                {user?.email ?? ""}
                            </p>
                        </div>

                        <div className="relative">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button
                                        type="button"
                                        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                                            <UserRound size={19} />
                                        </span>

                                        <ChevronDown
                                            size={16}
                                            className="text-slate-500"
                                        />
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content align="right" width="48">
                                    <Dropdown.Link href={route("profile.edit")}>
                                        <span className="flex items-center gap-2">
                                            <UserRound size={16} />
                                            Profile Settings
                                        </span>
                                    </Dropdown.Link>

                                    <Dropdown.Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                    >
                                        <span className="flex items-center gap-2">
                                            <LogOut size={16} />
                                            Sign Out
                                        </span>
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>

                    {/* Mobile User Avatar */}
                    <div className="flex items-center sm:hidden">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                            <UserRound size={19} />
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex min-h-[calc(100vh-4rem)]">
                {/* Desktop Sidebar */}
                <aside
                    className={`sticky top-16 hidden h-[calc(100vh-4rem)] shrink-0 flex-col border-r border-slate-200 bg-white transition-[width] duration-300 lg:flex ${
                        sidebarCollapsed ? "w-20" : "w-64"
                    }`}
                >
                    <div className="flex items-center justify-between px-4 py-5">
                        {!sidebarCollapsed && (
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                    Main Menu
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                    Manage your election
                                </p>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() =>
                                setSidebarCollapsed((previous) => !previous)
                            }
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-blue-700"
                            aria-label={
                                sidebarCollapsed
                                    ? "Expand sidebar"
                                    : "Collapse sidebar"
                            }
                            title={
                                sidebarCollapsed
                                    ? "Expand sidebar"
                                    : "Collapse sidebar"
                            }
                        >
                            {sidebarCollapsed ? (
                                <PanelLeftOpen size={19} />
                            ) : (
                                <PanelLeftClose size={19} />
                            )}
                        </button>
                    </div>

                    <div className="flex-1 px-3">
                        <NavItems />
                    </div>

                    {!sidebarCollapsed && (
                        <div className="m-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm">
                                <Vote size={20} />
                            </div>

                            <p className="text-sm font-semibold text-slate-800">
                                Voting Portal
                            </p>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                Manage positions, contestants, voters and
                                election results.
                            </p>
                        </div>
                    )}

                    <div className="border-t border-slate-100 px-4 py-4">
                        <p className="text-center text-xs text-slate-400">
                            {!sidebarCollapsed && "Election Management System"}
                        </p>
                    </div>
                </aside>

                {/* Mobile Sidebar */}
                {showingNavigationDropdown && (
                    <>
                        <button
                            type="button"
                            aria-label="Close navigation menu"
                            onClick={() => setShowingNavigationDropdown(false)}
                            className="fixed inset-0 top-16 z-40 bg-slate-900/40 lg:hidden"
                        />

                        <aside className="fixed bottom-0 left-0 top-16 z-50 w-72 overflow-y-auto border-r border-slate-200 bg-white p-4 shadow-xl lg:hidden">
                            <div className="mb-5 border-b border-slate-100 pb-4">
                                <p className="font-semibold text-slate-900">
                                    {user?.name ?? "User"}
                                </p>
                                <p className="mt-1 break-all text-xs text-slate-500">
                                    {user?.email ?? ""}
                                </p>
                            </div>

                            <p className="mb-3 px-3 text-xs font-bold uppercase tracking-widest text-slate-400">
                                Navigation
                            </p>

                            <NavItems mobile />

                            <div className="mt-6 space-y-1 border-t border-slate-100 pt-4">
                                <Link
                                    href={route("profile.edit")}
                                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100"
                                >
                                    <UserRound size={19} />
                                    Profile Settings
                                </Link>

                                <Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
                                >
                                    <LogOut size={19} />
                                    Sign Out
                                </Link>
                            </div>
                        </aside>
                    </>
                )}

                {/* Main Content */}
                <main className="min-w-0 flex-1">
                    {header && (
                        <div className="border-b border-slate-200 bg-white px-4 py-6 sm:px-6 lg:px-8">
                            <div className="mx-auto w-full max-w-[1600px]">
                                <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                                    {header}
                                </h1>

                                <p className="mt-1 text-sm text-slate-500">
                                    Manage and monitor your voting activities.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
