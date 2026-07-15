import { useEffect, useRef } from "react";

export const useInnerRef = <T extends HTMLElement>(ref: React.Ref<T>) => {

    const innerRef = useRef<T>(null);

    useEffect(() => {
        if (!ref) return undefined;
        if (typeof ref === "function") {
            ref(innerRef.current);
            // Clear the consumer's callback ref on unmount so it doesn't retain
            // a stale, detached node.
            return () => { ref(null); };
        }
        ref.current = innerRef.current;
        return undefined;
    }, [ref]);

    return innerRef;
};
