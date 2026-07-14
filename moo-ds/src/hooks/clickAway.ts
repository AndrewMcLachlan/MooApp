import { useEffect, useRef } from "react";

export const useClickAway = (setShow: (value: boolean) => void, ref: React.RefObject<HTMLElement | null | undefined>, onClickAway?: () => void) => {

    // Keep the latest callbacks in refs so the effect can subscribe once and
    // still call the current handlers without re-subscribing every render.
    const setShowRef = useRef(setShow);
    const onClickAwayRef = useRef(onClickAway);
    setShowRef.current = setShow;
    onClickAwayRef.current = onClickAway;

    useEffect(() => {
        const handleClickOutside = (event: Event) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onClickAwayRef.current?.();
                setShowRef.current?.(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [ref]);
}
