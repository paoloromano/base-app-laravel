import ApplicationLogo from '@/Components/ApplicationLogo';
import ThemeToggle from '@/Components/ThemeToggle';
import { Card } from '@heroui/react';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function GuestLayout({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-10">
            <div className="absolute right-4 top-4">
                <ThemeToggle />
            </div>

            <Link href="/" className="mb-6">
                <ApplicationLogo className="h-16 w-16 fill-current text-muted" />
            </Link>

            <Card className="w-full max-w-md">
                <Card.Content className="px-6 py-8">{children}</Card.Content>
            </Card>
        </div>
    );
}
