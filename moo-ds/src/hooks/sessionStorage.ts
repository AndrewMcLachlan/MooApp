import { SetStateAction } from "react";
import { useStorage } from "./useStorage";

export const useSessionStorage = <T = undefined>(key: string, initialValue: (T | undefined) | (() => T | undefined)): [T, React.Dispatch<SetStateAction<T>>] => useStorage(window.sessionStorage, key, initialValue);