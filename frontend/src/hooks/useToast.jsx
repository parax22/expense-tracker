import { useRef } from "react";

export function useToast() {
    const toastRef = useRef(null);

    const showToast = (message, severity) => {
        if (toastRef.current) {
            toastRef.current.show({
                severity,
                summary: severity.charAt(0).toUpperCase() + severity.slice(1),
                detail: message,
                life: 6000
            });
        }
    };

    return { showToast, toastRef };
}