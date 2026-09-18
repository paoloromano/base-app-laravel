import ApplicationLogo from '@/Components/ApplicationLogo';
import ThemeToggle from '@/Components/ThemeToggle';
import { Head, Link } from '@inertiajs/react';
import { Card, buttonVariants } from '@heroui/react';
import { PageProps } from '@/types';

export default function Welcome({
    auth,
    canLogin,
    canRegister,
    phpVersion,
}: PageProps<{
    canLogin: boolean;
    canRegister: boolean;
    phpVersion: string;
}>) {
    return (
        <>
            <Head title="Benvenuto" />
            <div className="min-h-screen bg-background">
                <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
                    <Link href="/" className="flex items-center gap-2">
                        <ApplicationLogo className="h-8 w-8 fill-current text-accent" />
                        <span className="font-semibold">App Base</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        {/* In v3 Button non è più polimorfico: gli stili si applicano
                            al Link di Inertia tramite buttonVariants. */}
                        {auth?.user ? (
                            <Link
                                href="/dashboard"
                                className={buttonVariants({
                                    variant: 'primary',
                                    size: 'sm',
                                })}
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                {canLogin && (
                                    <Link
                                        href={route('login')}
                                        className={buttonVariants({
                                            variant: 'tertiary',
                                            size: 'sm',
                                        })}
                                    >
                                        Accedi
                                    </Link>
                                )}
                                {canRegister && (
                                    <Link
                                        href={route('register')}
                                        className={buttonVariants({
                                            variant: 'primary',
                                            size: 'sm',
                                        })}
                                    >
                                        Registrati
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </header>

                <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
                    <section className="mx-auto max-w-3xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                            App Base
                        </h1>
                        <p className="mt-4 text-lg text-muted">
                            Core riutilizzabile: Inertia + React + HeroUI + Tailwind v4.
                            Auth, ruoli e area admin pronti.
                        </p>
                    </section>

                    <section className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <Card.Content className="gap-2">
                                <h3 className="text-lg font-semibold">Autenticazione</h3>
                                <p className="text-sm text-muted">
                                    Login, registrazione, recupero password, verifica email.
                                </p>
                            </Card.Content>
                        </Card>
                        <Card>
                            <Card.Content className="gap-2">
                                <h3 className="text-lg font-semibold">Ruoli & permessi</h3>
                                <p className="text-sm text-muted">
                                    Spatie Permission integrato, ruoli admin/user predefiniti.
                                </p>
                            </Card.Content>
                        </Card>
                        <Card>
                            <Card.Content className="gap-2">
                                <h3 className="text-lg font-semibold">UI moderna</h3>
                                <p className="text-sm text-muted">
                                    HeroUI + Tailwind v4 con dark mode persistente.
                                </p>
                            </Card.Content>
                        </Card>
                    </section>
                </main>

                <footer className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-muted sm:px-6">
                    PHP v{phpVersion}
                </footer>
            </div>
        </>
    );
}
