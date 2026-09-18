import FlashMessages from '@/Components/FlashMessages';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { Card } from '@heroui/react';
import RoleForm from './Partials/RoleForm';

type Props = PageProps<{
    role: { id: number; name: string; permissions: string[]; is_system: boolean };
    availablePermissions: string[];
}>;

export default function RolesEdit({ role, availablePermissions }: Props) {
    return (
        <AdminLayout header={<h1 className="text-2xl font-semibold">Modifica ruolo</h1>}>
            <Head title={`Admin · ${role.name}`} />

            <div className="flex flex-col gap-4">
                <FlashMessages />
                <Card>
                    <Card.Content>
                        <RoleForm
                            availablePermissions={availablePermissions}
                            role={role}
                        />
                    </Card.Content>
                </Card>
            </div>
        </AdminLayout>
    );
}
