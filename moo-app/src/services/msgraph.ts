import { useMsal } from "@azure/msal-react";
import axios from "axios";
import { addMsalInterceptor } from "../providers/MsalAuthProvider";
import { useEffect, useMemo, useState } from "react";

export const usePhoto = () => {

    const [photo, setPhoto] = useState<string>();

    const msal = useMsal();
    const httpClient = useMemo(() => axios.create({ baseURL: "https://graph.microsoft.com/v1.0", headers: { "Accept": "application/json" } }), []);

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
            // The request was aborted, or the interceptor could not acquire a
            // token silently (e.g. block_iframe_reload / InteractionRequired) and
            // handed off to an interactive redirect. Not an error — just skip.
            if (error?.code === "ERR_CANCELED") {
                return;
            }
            // 404 is the expected response when the account has no profile photo.
            if (error?.response?.status === 404) {
                console.debug("No photo found for user");
                return;
            }
            // Anything else is a genuine, unexpected failure worth surfacing.
            console.warn("Error fetching user photo", error);
        });

        return () => {
            isMounted = false;
            abortController.abort();
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [httpClient, msal.accounts]);

    return photo;
}
