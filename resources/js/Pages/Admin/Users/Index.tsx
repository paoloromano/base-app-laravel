import ConfirmDialog from '@/Components/ConfirmDialog';
import FlashMessages from '@/Components/FlashMessages';
import AdminLayout from '@/Layouts/AdminLayout';
import { Paginated, PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    Button,
    Card,
    Chip,
    Pagination,
    SearchField,
    Table,
    buttonVariants,
} from '@heroui/react';
import { FormEventHandler, useState } from 'react';

interface UserRow {
    id: number;
    name: string;
    email: string;
    is_verified: boolean;
    roles: string[];
}

type Props = PageProps<{
    users: Paginated<UserRow>;
    filters: { search: string };
}>;

export default function UsersIndex({ users, filters, auth }: Props) {
    const [search, setSearch] = useState(filters.search);

    const applySearch: FormEventHandler = (e) => {
        e.preventDefault();
        router.get('/admin/users', search ? { search } : {}, {
            preserveState: true,
            replace: true,
        });
    };

    const goToPage = (page: number) => {
        router.get(
            '/admin/users',
            { ...(filters.search ? { search: filters.search } : {}), page },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AdminLayout header={<h1 className="text-2xl font-semibold">Utenti</h1>}>
            <Head title="Admin · Utenti" />

            <div className="flex flex-col gap-4">
                <FlashMessages />

                <div className="flex flex-wrap items-center justify-between gap-3">
                    <form onSubmit={applySearch} className="flex items-center gap-2">
                        <SearchField
                            aria-label="Cerca utenti"
                            value={search}
                            onChange={setSearch}
                        >
                            <SearchField.Group>
                                <SearchField.SearchIcon />
                                <SearchField.Input placeholder="Nome o email" />
                                <SearchField.ClearButton />
                            </SearchField.Group>
                        </SearchField>
                        <Button type="submit" variant="secondary">
                            Cerca
                        </Button>
                    </form>

                    <Link
                        href="/admin/users/create"
                        className={buttonVariants({ variant: 'primary' })}
                    >
                        Nuovo utente
                    </Link>
                </div>

                <Card>
                    <Card.Content className="p-0">
                        <Table aria-label="Elenco utenti">
                            <Table.Content>
                                <Table.Header>
                                    <Table.Column isRowHeader>Nome</Table.Column>
                                    <Table.Column>Email</Table.Column>
                                    <Table.Column>Ruoli</Table.Column>
                                    <Table.Column>Verificato</Table.Column>
                                    <Table.Column>Azioni</Table.Column>
                                </Table.Header>
                                <Table.Body
                                    items={users.data}
                                    renderEmptyState={() => (
                                        <div className="p-6 text-center text-sm text-muted">
                                            Nessun utente trovato.
                                        </div>
                                    )}
                                >
                                    {(user) => (
                                        <Table.Row id={user.id}>
                                            <Table.Cell>{user.name}</Table.Cell>
                                            <Table.Cell>{user.email}</Table.Cell>
                                            <Table.Cell>
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles.length === 0 ? (
                                                        <span className="text-sm text-muted">—</span>
                                                    ) : (
                                                        user.roles.map((role) => (
                                                            <Chip key={role} size="sm">
                                                                {role}
                                                            </Chip>
                                                        ))
                                                    )}
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {user.is_verified ? 'Sì' : 'No'}
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={`/admin/users/${user.id}/edit`}
                                                        className={buttonVariants({
                                                            variant: 'tertiary',
                                                            size: 'sm',
                                                        })}
                                                    >
                                                        Modifica
                                                    </Link>
                                                    {user.id === auth.user.id ? null : (
                                                        <ConfirmDialog
                                                            trigger={
                                                                <Button
                                                                    variant="danger-soft"
                                                                    size="sm"
                                                                >
                                                                    Elimina
                                                                </Button>
                                                            }
                                                            title="Eliminare l'utente?"
                                                            description={
                                                                <>
                                                                    L'account di{' '}
                                                                    <strong>{user.name}</strong> e i
                                                                    suoi dati saranno cancellati in
                                                                    modo permanente.
                                                                </>
                                                            }
                                                            confirmLabel="Elimina"
                                                            onConfirm={() =>
                                                                router.delete(
                                                                    `/admin/users/${user.id}`,
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

                {users.last_page > 1 && (
                    <Pagination>
                        <Pagination.Summary>
                            {users.from}–{users.to} di {users.total}
                        </Pagination.Summary>
                        <Pagination.Content>
                            <Pagination.Item>
                                <Pagination.Previous
                                    isDisabled={users.current_page === 1}
                                    onPress={() => goToPage(users.current_page - 1)}
                                >
                                    <Pagination.PreviousIcon />
                                    Precedente
                                </Pagination.Previous>
                            </Pagination.Item>
                            {Array.from({ length: users.last_page }, (_, i) => i + 1).map(
                                (page) => (
                                    <Pagination.Item key={page}>
                                        <Pagination.Link
                                            isActive={page === users.current_page}
                                            onPress={() => goToPage(page)}
                                        >
                                            {page}
                                        </Pagination.Link>
                                    </Pagination.Item>
                                ),
                            )}
                            <Pagination.Item>
                                <Pagination.Next
                                    isDisabled={users.current_page === users.last_page}
                                    onPress={() => goToPage(users.current_page + 1)}
                                >
                                    Successiva
                                    <Pagination.NextIcon />
                                </Pagination.Next>
                            </Pagination.Item>
                        </Pagination.Content>
                    </Pagination>
                )}
            </div>
        </AdminLayout>
    );
}
