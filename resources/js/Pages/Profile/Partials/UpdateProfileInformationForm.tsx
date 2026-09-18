import { Link, useForm, usePage } from '@inertiajs/react';
import { Button, FieldError, Input, Label, Spinner, TextField } from '@heroui/react';
import { FormEventHandler } from 'react';
import { PageProps } from '@/types';

export default function UpdateProfileInformationForm({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const user = usePage<PageProps>().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-4">
            <TextField
                name="name"
                isRequired
                value={data.name}
                onChange={(v) => setData('name', v)}
                isInvalid={!!errors.name}
            >
                <Label>Nome</Label>
                <Input autoComplete="name" />
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
                <Input autoComplete="username" />
                <FieldError>{errors.email}</FieldError>
            </TextField>

            {mustVerifyEmail && user.email_verified_at == null && (
                <div className="rounded-lg bg-warning-soft px-3 py-2 text-sm text-warning-soft-foreground">
                    L'indirizzo email non è verificato.{' '}
                    <Link
                        href={route('verification.send')}
                        method="post"
                        as="button"
                        className="underline hover:text-warning"
                    >
                        Reinvia link di verifica
                    </Link>
                    {status === 'verification-link-sent' && (
                        <p className="mt-1 text-success">
                            Nuovo link di verifica inviato.
                        </p>
                    )}
                </div>
            )}

            <div className="flex items-center gap-3">
                <Button type="submit" variant="primary" isPending={processing}>
                    {({ isPending }) => (
                        <>
                            {isPending && <Spinner color="current" size="sm" />}
                            Salva
                        </>
                    )}
                </Button>
                {recentlySuccessful && (
                    <span className="text-sm text-muted">Salvato.</span>
                )}
            </div>
        </form>
    );
}
