import FlashMessages from '@/Components/FlashMessages';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { Card } from '@heroui/react';
import RoleForm from './Partials/RoleForm';

type Props = PageProps<{ availablePermissions: string[] }>;

export default function RolesCreate({ availablePermissions }: Props) {
    return (
        <AdminLayout header={<h1 className="text-2xl font-semibold">Nuovo ruolo</h1>}>
            <Head title="Admin · Nuovo ruolo" />

            <div className="flex flex-col gap-4">
                <FlashMessages />
                <Card>
                    <Card.Content>
                        <RoleForm availablePermissions={availablePermissions} />
                    </Card.Content>
                </Card>
            </div>
        </AdminLayout>
    );
}
