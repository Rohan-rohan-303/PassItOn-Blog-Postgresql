import { toast, type ToastOptions } from "react-toastify"

// 1. Define the allowed toast types
type ToastType = 'success' | 'error' | 'info' | 'default';

export const showToast = (type: ToastType, message: string): void => {
    // 2. Use the built-in ToastOptions type
    const config: ToastOptions = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    }

    // 3. Use a switch statement or direct indexing for cleaner code
    switch (type) {
        case 'success':
            toast.success(message, config);
            break;
        case 'error':
            toast.error(message, config);
            break;
        case 'info':
            toast.info(message, config);
            break;
        default:
            toast(message, config);
            break;
    }
}