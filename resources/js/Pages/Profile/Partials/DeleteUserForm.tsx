import { useForm } from '@inertiajs/react';
import {
    Button,
    FieldError,
    Input,
    Label,
    Modal,
    Spinner,
    TextField,
    useOverlayState,
} from '@heroui/react';
import { FormEventHandler } from 'react';

export default function DeleteUserForm() {
    // v3 sostituisce useDisclosure con useOverlayState.
    const state = useOverlayState();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({ password: '' });

    const close = () => {
        state.close();
        clearErrors();
        reset();
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => close(),
            onFinish: () => reset(),
        });
    };

    return (
        <div className="flex flex-col gap-4">
            <p className="text-sm text-muted">
                Una volta eliminato l'account, tutti i dati saranno cancellati permanentemente.
                Scarica le informazioni che desideri conservare prima di procedere.
            </p>

            <Modal state={state}>
                <div>
                    <Button variant="danger" onPress={state.open}>
                        Elimina account
                    </Button>
                </div>

                <Modal.Backdrop>
                    <Modal.Container placement="center">
                        <Modal.Dialog>
                            <form onSubmit={submit}>
                                <Modal.Header>
                                    <Modal.Heading>Confermi l'eliminazione?</Modal.Heading>
                                </Modal.Header>
                                <Modal.Body>
                                    <p className="text-sm text-muted">
                                        Tutti i dati associati all'account saranno cancellati
                                        permanentemente. Inserisci la password per confermare.
                                    </p>
                                    <TextField
                                        type="password"
                                        name="password"
                                        isRequired
                                        value={data.password}
                                        onChange={(v) => setData('password', v)}
                                        isInvalid={!!errors.password}
                                    >
                                        <Label>Password</Label>
                                        <Input autoFocus />
                                        <FieldError>{errors.password}</FieldError>
                                    </TextField>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button
                                        type="button"
                                        variant="tertiary"
                                        onPress={close}
                                    >
                                        Annulla
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="danger"
                                        isPending={processing}
                                    >
                                        {({ isPending }) => (
                                            <>
                                                {isPending && (
                                                    <Spinner color="current" size="sm" />
                                                )}
                                                Elimina account
                                            </>
                                        )}
                                    </Button>
                                </Modal.Footer>
                            </form>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </div>
    );
}
