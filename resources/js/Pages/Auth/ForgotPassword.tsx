import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button, FieldError, Input, Label, Spinner, TextField } from '@heroui/react';
import { FormEventHandler } from 'react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Recupera password" />

            <h1 className="mb-1 text-2xl font-semibold">Recupera password</h1>
            <p className="mb-6 text-sm text-muted">
                Inserisci la tua email per ricevere il link di reset.
            </p>

            {status && (
                <div className="mb-4 rounded-lg bg-success-soft px-3 py-2 text-sm text-success-soft-foreground">
                    {status}
                </div>
            )}

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
                    <Input autoComplete="username" autoFocus />
                    <FieldError>{errors.email}</FieldError>
                </TextField>

                <Button type="submit" variant="primary" isPending={processing}>
                    {({ isPending }) => (
                        <>
                            {isPending && <Spinner color="current" size="sm" />}
                            Invia link reset
                        </>
                    )}
                </Button>

                <p className="text-center text-sm text-muted">
                    <Link href={route('login')} className="text-accent hover:underline">
                        Torna all'accesso
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}
