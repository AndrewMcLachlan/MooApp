import { useMsal } from "@azure/msal-react";
import { addMsalInterceptor, createHttpClient } from "../providers/HttpClientProvider";
import { useMemo, useState } from "react";

export const usePhoto = (userName: string) => {

    const [photo, setPhoto] = useState<string>();

    const msal = useMsal();

    const httpClient = createHttpClient("https://graph.microsoft.com/v1.0");
    addMsalInterceptor(httpClient, msal, ["User.Read"]);
   
    useMemo(() => {
        httpClient.get("me/photo/$value", { responseType: "blob"}).then((response) =>
        {
            const url = URL.createObjectURL(response.data);
            setPhoto(url);
        }).catch((error) => {
            console.warn("No photo found for user", error);
        });
    },[userName]);

    return photo;
}