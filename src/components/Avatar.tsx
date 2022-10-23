import { useMsal } from "@azure/msal-react";
import React from "react";
import { usePhoto } from "../services"

const AvatarComponent = () => {
    const photo = usePhoto();
    const msal = useMsal();

    return (
        <div className="avatar">
            {photo && <img src={photo} alt="Me" />}
            {!photo && <div className="initials">{msal.accounts[0]?.name.split(" ").map(n => n[0]).join(" ")}</div>}
        </div>
    );
};

export const Avatar = React.memo(AvatarComponent);