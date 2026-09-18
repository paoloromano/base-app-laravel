import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Button,
    Checkbox,
    FieldError,
    Input,
    Label,
    Spinner,
    TextField,
} from '@heroui/react';
import { FormEventHandler } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Accedi" />

            <h1 className="mb-1 text-2xl font-semibold">Accedi</h1>
            <p className="mb-6 text-sm text-muted">Bentornato. Inserisci le tue credenziali.</p>

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

                <TextField
                    type="password"
                    name="password"
                    isRequired
                    value={data.password}
                    onChange={(v) => setData('password', v)}
                    isInvalid={!!errors.password}
                >
                    <Label>Password</Label>
                    <Input autoComplete="current-password" />
                    <FieldError>{errors.password}</FieldError>
                </TextField>

                <div className="flex items-center justify-between">
                    <Checkbox
                        isSelected={data.remember}
                        onChange={(v) => setData('remember', v)}
                    >
                        <Checkbox.Content>
                            <Checkbox.Control>
                                <Checkbox.Indicator />
                            </Checkbox.Control>
                            Ricordami
                        </Checkbox.Content>
                    </Checkbox>
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-accent hover:underline"
                        >
                            Password dimenticata?
                        </Link>
                    )}
                </div>

                <Button type="submit" variant="primary" isPending={processing}>
                    {({ isPending }) => (
                        <>
                            {isPending && <Spinner color="current" size="sm" />}
                            Accedi
                        </>
                    )}
                </Button>

                <p className="text-center text-sm text-muted">
                    Non hai un account?{' '}
                    <Link href={route('register')} className="text-accent hover:underline">
                        Registrati
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}
