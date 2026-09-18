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
    availableRoles: string[];
    /** Assente in creazione. */
    user?: {
        id: number;
        name: string;
        email: string;
        roles: string[];
    };
    /** True quando l'admin sta modificando se stesso. */
    isSelf?: boolean;
}

export default function UserForm({ availableRoles, user, isSelf = false }: Props) {
    const isEdit = user !== undefined;

    const { data, setData, post, put, processing, errors } = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        password: '',
        password_confirmation: '',
        roles: user?.roles ?? [],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit) {
            put(`/admin/users/${user.id}`);
        } else {
            post('/admin/users');
        }
    };

    return (
        <form onSubmit={submit} className="flex max-w-xl flex-col gap-4">
            <TextField
                name="name"
                isRequired
                value={data.name}
                onChange={(v) => setData('name', v)}
                isInvalid={!!errors.name}
            >
                <Label>Nome</Label>
                <Input autoComplete="name" autoFocus />
                <FieldError>{errors.name}</FieldError>
            </TextField>

            <TextField
                type="email"
                name="email"
                isRequired
                value={data.email}
                onChange={(v) => setData('email', v)}
                isInvalid={!!errors.email}
            >
                <Label>Email</Label>
                <Input autoComplete="off" />
                {isEdit && (
                    <Description>
                        Cambiando l'email l'account torna da verificare.
                    </Description>
                )}
                <FieldError>{errors.email}</FieldError>
            </TextField>

            <TextField
                type="password"
                name="password"
                isRequired={!isEdit}
                value={data.password}
                onChange={(v) => setData('password', v)}
                isInvalid={!!errors.password}
            >
                <Label>Password</Label>
                <Input autoComplete="new-password" />
                {isEdit && (
                    <Description>Lascia vuoto per non cambiarla.</Description>
                )}
                <FieldError>{errors.password}</FieldError>
            </TextField>

            <TextField
                type="password"
                name="password_confirmation"
                isRequired={!isEdit}
                value={data.password_confirmation}
                onChange={(v) => setData('password_confirmation', v)}
            >
                <Label>Conferma password</Label>
                <Input autoComplete="new-password" />
            </TextField>

            <CheckboxGroup
                value={data.roles}
                onChange={(v) => setData('roles', v)}
                isInvalid={!!errors.roles}
            >
                <Label>Ruoli</Label>
                {isSelf && (
                    <Description>
                        Non puoi togliere il ruolo admin al tuo account.
                    </Description>
                )}
                {availableRoles.map((role) => (
                    <Checkbox
                        key={role}
                        value={role}
                        isDisabled={isSelf && role === 'admin'}
                    >
                        <Checkbox.Content>
                            <Checkbox.Control>
                                <Checkbox.Indicator />
                            </Checkbox.Control>
                            {role}
                        </Checkbox.Content>
                    </Checkbox>
                ))}
                <FieldError>{errors.roles}</FieldError>
            </CheckboxGroup>

            <div className="flex items-center gap-3">
                <Button type="submit" variant="primary" isPending={processing}>
                    {({ isPending }) => (
                        <>
                            {isPending && <Spinner color="current" size="sm" />}
                            {isEdit ? 'Salva' : 'Crea utente'}
                        </>
                    )}
                </Button>
                <Link
                    href="/admin/users"
                    className={buttonVariants({ variant: 'tertiary' })}
                >
                    Annulla
                </Link>
            </div>
        </form>
    );
}
