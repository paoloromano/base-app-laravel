import { AlertDialog, Button } from '@heroui/react';
import { ReactNode } from 'react';

interface Props {
    /** Elemento che apre il dialog (di norma un Button). */
    trigger: ReactNode;
    title: string;
    description: ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
}

/**
 * Conferma per le azioni distruttive. AlertDialog non si chiude cliccando fuori:
 * serve una scelta esplicita.
 */
export default function ConfirmDialog({
    trigger,
    title,
    description,
    confirmLabel = 'Conferma',
    cancelLabel = 'Annulla',
    onConfirm,
}: Props) {
    return (
        <AlertDialog>
            {trigger}
            <AlertDialog.Backdrop>
                <AlertDialog.Container placement="center">
                    <AlertDialog.Dialog>
                        {({ close }) => (
                            <>
                                <AlertDialog.Header>
                                    <AlertDialog.Heading>{title}</AlertDialog.Heading>
                                </AlertDialog.Header>
                                <AlertDialog.Body>
                                    <div className="text-sm text-muted">{description}</div>
                                </AlertDialog.Body>
                                <AlertDialog.Footer>
                                    <Button variant="tertiary" onPress={close}>
                                        {cancelLabel}
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onPress={() => {
                                            onConfirm();
                                            close();
                                        }}
                                    >
                                        {confirmLabel}
                                    </Button>
                                </AlertDialog.Footer>
                            </>
                        )}
                    </AlertDialog.Dialog>
                </AlertDialog.Container>
            </AlertDialog.Backdrop>
        </AlertDialog>
    );
}
