import { useEffect, useRef } from "react";

export const useInnerRef = <T extends HTMLElement>(ref: React.Ref<T>) => {

    const innerRef = useRef<T>(null);

    useEffect(() => {
        if (!ref) return;
        if (typeof ref === "function") {
            ref(innerRef.current);
        } else {
            ref.current = innerRef.current;
        }
    }, [ref, innerRef, innerRef.current]);

    return innerRef;
};
