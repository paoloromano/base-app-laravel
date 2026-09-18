import UserLayout from '@/Layouts/UserLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { Card } from '@heroui/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <UserLayout header={<h1 className="text-2xl font-semibold">Profilo</h1>}>
            <Head title="Profilo" />

            <div className="mx-auto flex max-w-3xl flex-col gap-6">
                <Card>
                    <Card.Header>
                        <Card.Title className="text-lg font-semibold">
                            Informazioni profilo
                        </Card.Title>
                    </Card.Header>
                    <Card.Content>
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </Card.Content>
                </Card>

                <Card>
                    <Card.Header>
                        <Card.Title className="text-lg font-semibold">
                            Aggiorna password
                        </Card.Title>
                    </Card.Header>
                    <Card.Content>
                        <UpdatePasswordForm />
                    </Card.Content>
                </Card>

                <Card>
                    <Card.Header>
                        <Card.Title className="text-lg font-semibold text-danger">
                            Elimina account
                        </Card.Title>
                    </Card.Header>
                    <Card.Content>
                        <DeleteUserForm />
                    </Card.Content>
                </Card>
            </div>
        </UserLayout>
    );
}
