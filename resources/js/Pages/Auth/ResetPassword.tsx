import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button, FieldError, Input, Label, Spinner, TextField } from '@heroui/react';
import { FormEventHandler } from 'react';

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Reimposta password" />

            <h1 className="mb-1 text-2xl font-semibold">Reimposta password</h1>
            <p className="mb-6 text-sm text-muted">Scegli una nuova password sicura.</p>

            <form onSubmit={submit} className="flex flex-col gap-4">
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

                <TextField
                    type="password"
                    name="password"
                    isRequired
                    value={data.password}
                    onChange={(v) => setData('password', v)}
                    isInvalid={!!errors.password}
                >
                    <Label>Nuova password</Label>
                    <Input autoComplete="new-password" autoFocus />
                    <FieldError>{errors.password}</FieldError>
                </TextField>

                <TextField
                    type="password"
                    name="password_confirmation"
                    isRequired
                    value={data.password_confirmation}
                    onChange={(v) => setData('password_confirmation', v)}
                    isInvalid={!!errors.password_confirmation}
                >
                    <Label>Conferma password</Label>
                    <Input autoComplete="new-password" />
                    <FieldError>{errors.password_confirmation}</FieldError>
                </TextField>

                <Button type="submit" variant="primary" isPending={processing}>
                    {({ isPending }) => (
                        <>
                            {isPending && <Spinner color="current" size="sm" />}
                            Reimposta password
                        </>
                    )}
                </Button>
            </form>
        </GuestLayout>
    );
}
