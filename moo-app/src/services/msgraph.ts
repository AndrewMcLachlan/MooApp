import { useMsal } from "@azure/msal-react";
import { addMsalInterceptor, createHttpClient } from "../providers/HttpClientProvider";
import { useEffect, useMemo, useState } from "react";

export const usePhoto = (userName?: string) => {

    const [photo, setPhoto] = useState<string>();

    const msal = useMsal();
    const httpClient = useMemo(() => createHttpClient("https://graph.microsoft.com/v1.0"), []);

    useEffect(() => {
        const interceptorId = addMsalInterceptor(httpClient, msal, ["User.Read"]);
        return () => {
            httpClient.interceptors.request.eject(interceptorId);
        };
    }, [httpClient, msal]);

    useEffect(() => {
        if (!userName) {
            setPhoto(undefined);
            return;
        }

        let isMounted = true;
        let objectUrl = "";

        httpClient.get("me/photo/$value", { responseType: "blob"}).then((response) =>
        {
            objectUrl = URL.createObjectURL(response.data);
            if (isMounted) {
                setPhoto(objectUrl);
            }
        }).catch((error) => {
            console.warn("No photo found for user", error);
        });

        return () => {
            isMounted = false;
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [httpClient, userName]);

    return photo;
}
