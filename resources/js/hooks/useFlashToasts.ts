import { toastError, toastSuccess } from '@/lib/swal';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

type FlashProps = {
    flash?: {
        success?: string | null;
        error?: string | null;
    };
};

export function useFlashToasts() {
    const { flash } = usePage().props as unknown as FlashProps;

    useEffect(() => {
        if (flash?.success) {
            toastSuccess(flash.success);
        }
    }, [flash?.success]);

    useEffect(() => {
        if (flash?.error) {
            toastError(flash.error);
        }
    }, [flash?.error]);
}
