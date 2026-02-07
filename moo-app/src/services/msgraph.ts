import { useMsal } from "@azure/msal-react";
import { addMsalInterceptor, createHttpClient } from "../providers/HttpClientProvider";
import { useEffect, useMemo, useState } from "react";

export const usePhoto = () => {

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
        if (!msal.instance.getActiveAccount()) {
            setPhoto(undefined);
            return () => {};
        }

        let isMounted = true;
        let objectUrl = "";
        const abortController = new AbortController();

        httpClient.get("me/photo/$value", { responseType: "blob", signal: abortController.signal }).then((response) =>
        {
            objectUrl = URL.createObjectURL(response.data);
            if (isMounted) {
                setPhoto(objectUrl);
            } else {
                URL.revokeObjectURL(objectUrl);
            }
        }).catch((error) => {
            if (error?.code !== "ERR_CANCELED") {
                console.warn("No photo found for user", error);
            }
        });

        return () => {
            isMounted = false;
            abortController.abort();
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [httpClient]);

    return photo;
}
