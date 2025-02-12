import { Toast } from "../ui";
import { useRef, useEffect } from "react";

function SnackbarAlert({ open, message, severity, onClose }) {
    const toast = useRef(null);

    useEffect(() => {
        if (open && toast.current) {
            toast.current.show({
                severity,
                summary: severity.charAt(0).toUpperCase() + severity.slice(1),
                detail: message,
                life: 6000
            });
            onClose();
        }
    }, [open, message, severity, onClose]);

    return <Toast ref={toast} position="bottom-right" />;
}

export default SnackbarAlert;