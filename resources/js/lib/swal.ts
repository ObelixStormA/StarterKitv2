import Swal from 'sweetalert2';

const THEME_PRIMARY = '#3b82f6';
const THEME_DANGER = '#ef4444';

const toastMixin = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
        popup: 'swal-toast-popup',
    },
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
});

export function toastSuccess(message: string) {
    toastMixin.fire({ icon: 'success', title: message });
}

export function toastError(message: string) {
    toastMixin.fire({ icon: 'error', title: message });
}

export async function confirmDelete(options: {
    title: string;
    text?: string;
    confirmText: string;
    cancelText: string;
}): Promise<boolean> {
    const result = await Swal.fire({
        icon: 'warning',
        title: options.title,
        text: options.text,
        showCancelButton: true,
        confirmButtonText: options.confirmText,
        cancelButtonText: options.cancelText,
        confirmButtonColor: THEME_DANGER,
        cancelButtonColor: THEME_PRIMARY,
        reverseButtons: true,
        focusCancel: true,
    });

    return result.isConfirmed;
}
