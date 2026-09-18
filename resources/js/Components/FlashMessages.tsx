import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';

/**
 * Mostra i messaggi flash che HandleInertiaRequests condivide con ogni pagina
 * (session()->flash('success'|'error')).
 */
export default function FlashMessages() {
    const { flash } = usePage<PageProps>().props;

    if (!flash?.success && !flash?.error) {
        return null;
    }

    return (
        <div className="flex flex-col gap-2">
            {flash.success && (
                <div
                    role="status"
                    className="rounded-lg bg-success-soft px-3 py-2 text-sm text-success-soft-foreground"
                >
                    {flash.success}
                </div>
            )}
            {flash.error && (
                <div
                    role="alert"
                    className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger-soft-foreground"
                >
                    {flash.error}
                </div>
            )}
        </div>
    );
}
