import FlashMessages from '@/Components/FlashMessages';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { Card } from '@heroui/react';
import UserForm from './Partials/UserForm';

type Props = PageProps<{ availableRoles: string[] }>;

export default function UsersCreate({ availableRoles }: Props) {
    return (
        <AdminLayout header={<h1 className="text-2xl font-semibold">Nuovo utente</h1>}>
            <Head title="Admin · Nuovo utente" />

            <div className="flex flex-col gap-4">
                <FlashMessages />
                <Card>
                    <Card.Content>
                        <UserForm availableRoles={availableRoles} />
                    </Card.Content>
                </Card>
            </div>
        </AdminLayout>
    );
}
