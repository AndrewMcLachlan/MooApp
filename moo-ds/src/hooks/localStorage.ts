import { SetStateAction } from "react";
import { useStorage } from "./useStorage";

export const useLocalStorage = <T = undefined>(key: string, initialValue: (T | undefined) | (() => T | undefined)): [T, React.Dispatch<SetStateAction<T>>] => useStorage(window.localStorage, key, initialValue);