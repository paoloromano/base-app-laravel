import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button, FieldError, Input, Label, Spinner, TextField } from '@heroui/react';
import { FormEventHandler } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Registrati" />

            <h1 className="mb-1 text-2xl font-semibold">Crea account</h1>
            <p className="mb-6 text-sm text-muted">Inizia a usare l'app in pochi secondi.</p>

            <form onSubmit={submit} className="flex flex-col gap-4">
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
                    <Label>Password</Label>
                    <Input autoComplete="new-password" />
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
                            Registrati
                        </>
                    )}
                </Button>

                <p className="text-center text-sm text-muted">
                    Hai già un account?{' '}
                    <Link href={route('login')} className="text-accent hover:underline">
                        Accedi
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}
