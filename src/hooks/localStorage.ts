import { useState } from "react";

export const useLocalStorage = <T = undefined>(key: string, initialValue: T | undefined): [T, (value: T | undefined) => void] => {

    const [storedValue, setStoredValue] = useState<T>(() => {
        const val = window.localStorage.getItem(key);

        if (!val) return initialValue;
    
        return JSON.parse(val);
    });

    const setValue = (value: T | undefined) => {

        window.localStorage.setItem(key, JSON.stringify(value));
        setStoredValue(value);
    }

    return [storedValue, setValue];
}
