import ConfirmDialog from '@/Components/ConfirmDialog';
import FlashMessages from '@/Components/FlashMessages';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Button,
    Card,
    Chip,
    FieldError,
    Input,
    Label,
    Spinner,
    Table,
    TextField,
    buttonVariants,
} from '@heroui/react';
import { FormEventHandler } from 'react';

interface RoleRow {
    id: number;
    name: string;
    guard_name: string;
    users_count: number;
    permissions: string[];
    is_system: boolean;
}

interface PermissionRow {
    id: number;
    name: string;
    roles_count: number;
}

type Props = PageProps<{
    roles: RoleRow[];
    permissions: PermissionRow[];
}>;

export default function RolesIndex({ roles, permissions }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({ name: '' });

    const createPermission: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/permissions', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <AdminLayout header={<h1 className="text-2xl font-semibold">Ruoli e permessi</h1>}>
            <Head title="Admin · Ruoli" />

            <div className="flex flex-col gap-6">
                <FlashMessages />

                <section className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-lg font-semibold">Ruoli</h2>
                        <Link
                            href="/admin/roles/create"
                            className={buttonVariants({ variant: 'primary' })}
                        >
                            Nuovo ruolo
                        </Link>
                    </div>

                    <Card>
                        <Card.Content className="p-0">
                            <Table aria-label="Elenco ruoli">
                                <Table.Content>
                                    <Table.Header>
                                        <Table.Column isRowHeader>Nome</Table.Column>
                                        <Table.Column>Permessi</Table.Column>
                                        <Table.Column>Utenti</Table.Column>
                                        <Table.Column>Azioni</Table.Column>
                                    </Table.Header>
                                    <Table.Body items={roles}>
                                        {(role) => (
                                            <Table.Row id={role.id}>
                                                <Table.Cell>
                                                    <div className="flex items-center gap-2">
                                                        {role.name}
                                                        {role.is_system && (
                                                            <Chip size="sm">sistema</Chip>
                                                        )}
                                                    </div>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {role.permissions.length === 0 ? (
                                                            <span className="text-sm text-muted">
                                                                —
                                                            </span>
                                                        ) : (
                                                            role.permissions.map((permission) => (
                                                                <Chip key={permission} size="sm">
                                                                    {permission}
                                                                </Chip>
                                                            ))
                                                        )}
                                                    </div>
                                                </Table.Cell>
                                                <Table.Cell>{role.users_count}</Table.Cell>
                                                <Table.Cell>
                                                    <div className="flex items-center gap-2">
                                                        <Link
                                                            href={`/admin/roles/${role.id}/edit`}
                                                            className={buttonVariants({
                                                                variant: 'tertiary',
                                                                size: 'sm',
                                                            })}
                                                        >
                                                            Modifica
                                                        </Link>
                                                        {role.is_system ? null : (
                                                            <ConfirmDialog
                                                                trigger={
                                                                    <Button
                                                                        variant="danger-soft"
                                                                        size="sm"
                                                                    >
                                                                        Elimina
                                                                    </Button>
                                                                }
                                                                title="Eliminare il ruolo?"
                                                                description={
                                                                    <>
                                                                        Il ruolo{' '}
                                                                        <strong>{role.name}</strong>{' '}
                                                                        sarà rimosso dai{' '}
                                                                        {role.users_count} utenti che
                                                                        lo hanno.
                                                                    </>
                                                                }
                                                                confirmLabel="Elimina"
                                                                onConfirm={() =>
                                                                    router.delete(
                                                                        `/admin/roles/${role.id}`,
                                                                        { preserveScroll: true },
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                    </div>
                                                </Table.Cell>
                                            </Table.Row>
                                        )}
                                    </Table.Body>
                                </Table.Content>
                            </Table>
                        </Card.Content>
                    </Card>
                </section>

                <section className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold">Permessi</h2>

                    <Card>
                        <Card.Content className="flex flex-col gap-4">
                            <form
                                onSubmit={createPermission}
                                className="flex max-w-xl items-end gap-2"
                            >
                                <TextField
                                    name="name"
                                    isRequired
                                    fullWidth
                                    value={data.name}
                                    onChange={(v) => setData('name', v)}
                                    isInvalid={!!errors.name}
                                >
                                    <Label>Nuovo permesso</Label>
                                    <Input placeholder="es. users.delete" />
                                    <FieldError>{errors.name}</FieldError>
                                </TextField>
                                <Button
                                    type="submit"
                                    variant="secondary"
                                    isPending={processing}
                                >
                                    {({ isPending }) => (
                                        <>
                                            {isPending && (
                                                <Spinner color="current" size="sm" />
                                            )}
                                            Aggiungi
                                        </>
                                    )}
                                </Button>
                            </form>

                            {permissions.length === 0 ? (
                                <p className="text-sm text-muted">
                                    Nessun permesso definito.
                                </p>
                            ) : (
                                <ul className="flex flex-col divide-y divide-separator">
                                    {permissions.map((permission) => (
                                        <li
                                            key={permission.id}
                                            className="flex items-center justify-between gap-3 py-2"
                                        >
                                            <div>
                                                <p className="text-sm">{permission.name}</p>
                                                <p className="text-xs text-muted">
                                                    usato da {permission.roles_count} ruoli
                                                </p>
                                            </div>
                                            <ConfirmDialog
                                                trigger={
                                                    <Button variant="danger-soft" size="sm">
                                                        Elimina
                                                    </Button>
                                                }
                                                title="Eliminare il permesso?"
                                                description={
                                                    <>
                                                        <strong>{permission.name}</strong> sarà
                                                        rimosso da tutti i ruoli che lo usano.
                                                    </>
                                                }
                                                confirmLabel="Elimina"
                                                onConfirm={() =>
                                                    router.delete(
                                                        `/admin/permissions/${permission.id}`,
                                                        { preserveScroll: true },
                                                    )
                                                }
                                            />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Card.Content>
                    </Card>
                </section>
            </div>
        </AdminLayout>
    );
}
