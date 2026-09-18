import { useForm } from '@inertiajs/react';
import { Button, FieldError, Input, Label, Spinner, TextField } from '@heroui/react';
import { FormEventHandler } from 'react';

export default function UpdatePasswordForm() {
    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errs) => {
                if (errs.password) reset('password', 'password_confirmation');
                if (errs.current_password) reset('current_password');
            },
        });
    };

    return (
        <form onSubmit={updatePassword} className="flex flex-col gap-4">
            <TextField
                type="password"
                name="current_password"
                isRequired
                value={data.current_password}
                onChange={(v) => setData('current_password', v)}
                isInvalid={!!errors.current_password}
            >
                <Label>Password attuale</Label>
                <Input autoComplete="current-password" />
                <FieldError>{errors.current_password}</FieldError>
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
