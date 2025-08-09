import { useMsal } from "@azure/msal-react";
import { useMemo } from "react";
import { useLayout } from "../providers";
import { Avatar as DSAvatar } from "@andrewmclachlan/moo-ds";

const AvatarComponent = () => {

    const photo = useLayout().photo;
    const msal = useMsal();

    return useMemo(() => (
        <DSAvatar photo={photo} name={msal.accounts[0]?.name} />
    ), [photo, msal]);
};

AvatarComponent.displayName = "Avatar";

export const Avatar = AvatarComponent;
