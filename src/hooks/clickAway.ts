import React, { useEffect } from "react";

export const useClickAway = (setShow: (value: boolean) => void, ref: React.RefObject<any>, onClickAway?: () => void) => {

    function handleClickOutside(event: Event) {
        if (ref.current && !ref.current.contains(event.target)) {
            onClickAway?.();
            setShow?.(false);
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    });
}
