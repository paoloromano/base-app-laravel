import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button, FieldError, Input, Label, Spinner, TextField } from '@heroui/react';
import { FormEventHandler } from 'react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Conferma password" />

            <h1 className="mb-1 text-2xl font-semibold">Conferma password</h1>
            <p className="mb-6 text-sm text-muted">
                Area protetta. Conferma la password per continuare.
            </p>

            <form onSubmit={submit} className="flex flex-col gap-4">
                <TextField
                    type="password"
                    name="password"
                    isRequired
                    value={data.password}
                    onChange={(v) => setData('password', v)}
                    isInvalid={!!errors.password}
                >
                    <Label>Password</Label>
                    <Input autoComplete="current-password" autoFocus />
                    <FieldError>{errors.password}</FieldError>
                </TextField>

                <Button type="submit" variant="primary" isPending={processing}>
                    {({ isPending }) => (
                        <>
                            {isPending && <Spinner color="current" size="sm" />}
                            Conferma
                        </>
                    )}
                </Button>
            </form>
        </GuestLayout>
    );
}
