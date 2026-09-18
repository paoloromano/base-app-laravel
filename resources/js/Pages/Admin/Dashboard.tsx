import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { Card } from '@heroui/react';

interface Stats {
    users_total: number;
    users_admin: number;
    users_user: number;
}

export default function AdminDashboard({ stats }: PageProps<{ stats: Stats }>) {
    return (
        <AdminLayout
            header={<h1 className="text-2xl font-semibold">Admin · Dashboard</h1>}
        >
            <Head title="Admin · Dashboard" />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <Card.Header>
                        <Card.Title className="text-sm font-normal text-muted">
                            Utenti totali
                        </Card.Title>
                    </Card.Header>
                    <Card.Content>
                        <p className="text-3xl font-bold">{stats.users_total}</p>
                    </Card.Content>
                </Card>
                <Card>
                    <Card.Header>
                        <Card.Title className="text-sm font-normal text-muted">
                            Amministratori
                        </Card.Title>
                    </Card.Header>
                    <Card.Content>
                        <p className="text-3xl font-bold">{stats.users_admin}</p>
                    </Card.Content>
                </Card>
                <Card>
                    <Card.Header>
                        <Card.Title className="text-sm font-normal text-muted">
                            Utenti standard
                        </Card.Title>
                    </Card.Header>
                    <Card.Content>
                        <p className="text-3xl font-bold">{stats.users_user}</p>
                    </Card.Content>
                </Card>
            </div>
        </AdminLayout>
    );
}
