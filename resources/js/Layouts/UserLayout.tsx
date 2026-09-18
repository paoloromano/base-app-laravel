import ApplicationLogo from '@/Components/ApplicationLogo';
import ThemeToggle from '@/Components/ThemeToggle';
import { getInitials } from '@/lib/initials';
import { PageProps } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { Avatar, Dropdown, Label } from '@heroui/react';
import { PropsWithChildren, ReactNode, useState } from 'react';

interface NavItem {
    label: string;
    href: string;
    routeName?: string;
}

const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', routeName: 'dashboard' },
];

interface Props {
    header?: ReactNode;
}

export default function UserLayout({ children, header }: PropsWithChildren<Props>) {
    const { auth } = usePage<PageProps>().props;
    const [menuOpen, setMenuOpen] = useState(false);
    const isAdmin = auth.user.roles.includes('admin');
    const initials = getInitials(auth.user.name);

    return (
        <div className="min-h-screen bg-background">
            {/* HeroUI v3 non fornisce più Navbar: la barra è composta a mano con
                elementi nativi, come indicato dalla guida di migrazione. */}
            <nav className="sticky top-0 z-40 w-full border-b border-separator bg-background/70 backdrop-blur-lg">
                <header className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            className="sm:hidden"
                            aria-label={menuOpen ? 'Chiudi menu' : 'Apri menu'}
                            aria-expanded={menuOpen}
                            onClick={() => setMenuOpen((open) => !open)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                className="size-6"
                            >
                                {menuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18 18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>

                        <Link href="/dashboard" className="flex items-center gap-2">
                            <ApplicationLogo className="h-8 w-8 fill-current text-accent" />
                            <span className="font-semibold">App Base</span>
                        </Link>
                    </div>

                    <ul className="hidden items-center gap-4 sm:flex">
                        {navItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className="text-muted hover:text-accent"
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Dropdown>
                            <Dropdown.Trigger
                                className="rounded-full"
                                aria-label="Menu utente"
                            >
                                <Avatar size="sm">
                                    <Avatar.Fallback>{initials}</Avatar.Fallback>
                                </Avatar>
                            </Dropdown.Trigger>
                            <Dropdown.Popover placement="bottom end">
                                <div className="px-3 py-2">
                                    <p className="font-semibold">{auth.user.name}</p>
                                    <p className="text-xs text-muted">{auth.user.email}</p>
                                </div>
                                <Dropdown.Menu aria-label="Azioni utente">
                                    <Dropdown.Item
                                        id="profile"
                                        textValue="Profilo"
                                        onAction={() => router.visit('/profile')}
                                    >
                                        <Label>Profilo</Label>
                                    </Dropdown.Item>
                                    {isAdmin ? (
                                        <Dropdown.Item
                                            id="admin"
                                            textValue="Area Admin"
                                            onAction={() => router.visit('/admin')}
                                        >
                                            <Label>Area Admin</Label>
                                        </Dropdown.Item>
                                    ) : null}
                                    <Dropdown.Item
                                        id="logout"
                                        textValue="Esci"
                                        variant="danger"
                                        onAction={() => router.post('/logout')}
                                    >
                                        <Label>Esci</Label>
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown.Popover>
                        </Dropdown>
                    </div>
                </header>

                {menuOpen ? (
                    <div className="border-t border-separator sm:hidden">
                        <ul className="flex flex-col gap-2 p-4">
                            {navItems.map((item) => (
                                <li key={item.href}>
                                    <Link href={item.href} className="block w-full py-2">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                            {isAdmin ? (
                                <li>
                                    <Link href="/admin" className="block w-full py-2">
                                        Area Admin
                                    </Link>
                                </li>
                            ) : null}
                        </ul>
                    </div>
                ) : null}
            </nav>

            {header ? (
                <header className="border-b border-separator bg-surface">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{header}</div>
                </header>
            ) : null}

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
        </div>
    );
}
