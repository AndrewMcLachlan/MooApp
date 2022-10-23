import { useHttpClient } from "../providers";
import { useEffect, useState } from "react";

export const usePhoto = () => {

    const [photo, setPhoto] = useState<string>();

    const httpClient = useHttpClient();

    useEffect(() => {
        httpClient.get("https://graph.microsoft.com/v1.0/me/photo/$value", { responseType: "blob"}).then((response) =>
        {
            const url = URL.createObjectURL(response.data);
            setPhoto(url);
        });
    }, []);

    return photo;
}