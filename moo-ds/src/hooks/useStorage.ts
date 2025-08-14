import { SetStateAction, useState } from "react";

export const useStorage = <T = undefined>(storage: Storage, key: string, initialValue: (T | undefined) | (() => T | undefined)): [T, React.Dispatch<SetStateAction<T>>] => {

    const [storedValue, setStoredValue] = useState<T>(() => {
        const val = storage.getItem(key);

        if (!val) return initialValue;
    
        return JSON.parse(val);
    });

    const setValue = (value: SetStateAction<T>) => {
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        storage.setItem(key, JSON.stringify(valueToStore));
        setStoredValue(valueToStore);
    }

    return [storedValue, setValue];
}
