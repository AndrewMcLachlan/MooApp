import { useMsal } from "@azure/msal-react";
import React, { useMemo } from "react";
import { useLayout } from "../providers";

const AvatarComponent = () => {

    const photo = useLayout().photo;
    const msal = useMsal();

    return useMemo(() => {
        return (
            <div className="avatar clickable">
                {photo && <img src={photo} alt="Me" />}
                {!photo && <div className="initials">{msal.accounts[0]?.name.split(" ").map(n => n[0]).join("")}</div>}
            </div>
        );
    }, [photo]);
};

export const Avatar = AvatarComponent;