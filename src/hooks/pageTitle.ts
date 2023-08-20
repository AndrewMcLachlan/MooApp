import { useApp } from "providers/AppProvider";
import { useMemo } from "react";

export function usePageTitle(title?: string) {

    const app = useApp();

    useMemo(() => document.title = `${title} : ${app.name}`, [title ?? ""]);
}