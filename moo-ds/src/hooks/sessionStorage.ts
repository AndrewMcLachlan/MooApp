import { useState } from "react";

export const usesessionStorage = <T = undefined>(key: string, initialValue: T | undefined): [T, (value: T | undefined) => void] => {

    const [storedValue, setStoredValue] = useState<T>(() => {
        const val = window.sessionStorage.getItem(key);

        if (!val) return initialValue;
    
        return JSON.parse(val);
    });

    const setValue = (value: T | undefined) => {

        window.sessionStorage.setItem(key, JSON.stringify(value));
        setStoredValue(value);
    }

    return [storedValue, setValue];
}
