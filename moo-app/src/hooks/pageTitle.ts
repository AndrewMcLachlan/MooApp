import { useApp } from "../providers/AppProvider";
import { useEffect } from "react";

export function usePageTitle(title?: string) {

    const app = useApp();

    useEffect(() => {
        document.title = `${title} : ${app.name}`;
    }, [title, app.name]);
}
