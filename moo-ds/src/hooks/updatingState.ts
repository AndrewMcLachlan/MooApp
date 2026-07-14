import { useEffect, useRef, useState } from "react"

export const useUpdatingState = <T>(value: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>] => {

    const [state, setState] = useState<T>(value);

    // Track the last value we synced from so we only reset when it actually changes.
    const previousValue = useRef(value);

    useEffect(() => {
        if (Object.is(previousValue.current, value)) return;
        previousValue.current = value;
        // Resolve a function value as a lazy initialiser and store it via a
        // functional update, so it is never invoked as a React state updater.
        setState(() => (typeof value === "function" ? (value as () => T)() : value));
    }, [value]);

    return [state, setState];
}
