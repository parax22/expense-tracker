import { useState } from "react";

export const useDialog = () => {
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isRecurring, setIsRecurring] = useState(false);

    const openDialog = (item = null, isRecurring = false) => {
        setSelectedItem(item);
        setIsRecurring(isRecurring);
        setOpen(true);
    };

    const closeDialog = () => {
        setSelectedItem(null);
        setIsRecurring(false);
        setOpen(false);
    };

    return {
        open,
        selectedItem,
        isRecurring,
        openDialog,
        closeDialog,
    };
};