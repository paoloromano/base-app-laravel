import { Link, useForm } from '@inertiajs/react';
import {
    Button,
    Checkbox,
    CheckboxGroup,
    Description,
    FieldError,
    Input,
    Label,
    Spinner,
    TextField,
    buttonVariants,
} from '@heroui/react';
import { FormEventHandler } from 'react';

interface Props {
    availablePermissions: string[];
    /** Assente in creazione. */
    role?: {
        id: number;
        name: string;
        permissions: string[];
        is_system: boolean;
    };
}

export default function RoleForm({ availablePermissions, role }: Props) {
    const isEdit = role !== undefined;
    const isSystem = role?.is_system ?? false;

    const { data, setData, post, put, processing, errors } = useForm({
        name: role?.name ?? '',
        permissions: role?.permissions ?? [],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit) {
            put(`/admin/roles/${role.id}`);
        } else {
            post('/admin/roles');
        }
    };

    return (
        <form onSubmit={submit} className="flex max-w-xl flex-col gap-4">
            <TextField
                name="name"
                isRequired
                isReadOnly={isSystem}
                value={data.name}
                onChange={(v) => setData('name', v)}
                isInvalid={!!errors.name}
            >
                <Label>Nome</Label>
                <Input autoFocus={!isSystem} />
                {isSystem && (
                    <Description>
                        Ruolo di sistema: il nome è cablato nelle rotte e nei menu, quindi
                        non è modificabile. I permessi sì.
                    </Description>
                )}
                <FieldError>{errors.name}</FieldError>
            </TextField>

            <CheckboxGroup
                value={data.permissions}
                onChange={(v) => setData('permissions', v)}
                isInvalid={!!errors.permissions}
            >
                <Label>Permessi</Label>
                {availablePermissions.length === 0 ? (
                    <Description>
                        Nessun permesso definito. Creane uno dalla pagina Ruoli.
                    </Description>
                ) : (
                    availablePermissions.map((permission) => (
                        <Checkbox key={permission} value={permission}>
                            <Checkbox.Content>
                                <Checkbox.Control>
                                    <Checkbox.Indicator />
                                </Checkbox.Control>
                                {permission}
                            </Checkbox.Content>
                        </Checkbox>
                    ))
                )}
                <FieldError>{errors.permissions}</FieldError>
            </CheckboxGroup>

            <div className="flex items-center gap-3">
                <Button type="submit" variant="primary" isPending={processing}>
                    {({ isPending }) => (
                        <>
                            {isPending && <Spinner color="current" size="sm" />}
                            {isEdit ? 'Salva' : 'Crea ruolo'}
                        </>
                    )}
                </Button>
                <Link
                    href="/admin/roles"
                    className={buttonVariants({ variant: 'tertiary' })}
                >
                    Annulla
                </Link>
            </div>
        </form>
    );
}
