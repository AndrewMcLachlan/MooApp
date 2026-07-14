import { type SetStateAction, useEffect, useRef, useState } from "react";

export const useStorage = <T = undefined>(storage: Storage, key: string, initialValue: (T | undefined) | (() => T | undefined)): [T, React.Dispatch<SetStateAction<T>>] => {

    const readValue = (): T => {
        // SSR-safety: no window/storage available during server render.
        if (typeof window === "undefined") return initialValue as T;

        try {
            const val = storage.getItem(key);

            if (!val) return initialValue as T;

            return JSON.parse(val);
        } catch {
            // Corrupt or legacy (non-JSON) value: fall back rather than crash the tree.
            return initialValue as T;
        }
    };

    const [storedValue, setStoredValue] = useState<T>(readValue);

    // Re-read from storage when the key changes (skip the initial mount).
    const keyRef = useRef(key);
    useEffect(() => {
        if (keyRef.current === key) return;
        keyRef.current = key;
        // Wrap in a functional update so a function initialValue is stored, not invoked.
        setStoredValue(() => readValue());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    // Cross-tab synchronisation via the window storage event.
    useEffect(() => {
        if (typeof window === "undefined") return undefined;

        const handleStorage = (event: StorageEvent) => {
            if (event.key !== key) return;

            if (event.newValue === null) {
                setStoredValue(() => initialValue as T);
                return;
            }

            try {
                const parsed = JSON.parse(event.newValue) as T;
                setStoredValue(() => parsed);
            } catch {
                setStoredValue(() => initialValue as T);
            }
        };

        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    const setValue = (value: SetStateAction<T>) => {
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        storage.setItem(key, JSON.stringify(valueToStore));
        setStoredValue(valueToStore);
    }

    return [storedValue, setValue];
}
