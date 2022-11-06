import { useHttpClient } from "../providers";
import { useMemo, useState } from "react";

export const usePhoto = (userName: string) => {

    const [photo, setPhoto] = useState<string>();

    const httpClient = useHttpClient();
   
    useMemo(() => {
        httpClient.get("https://graph.microsoft.com/v1.0/me/photo/$value", { responseType: "blob"}).then((response) =>
        {
            const url = URL.createObjectURL(response.data);
            setPhoto(url);
        });
    },[userName]);

    return photo;
}