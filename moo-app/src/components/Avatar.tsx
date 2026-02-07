import { useMsal } from "@azure/msal-react";
import { useMemo } from "react";
import { useLayout } from "../providers";
import { Avatar as DSAvatar } from "@andrewmclachlan/moo-ds";

const AvatarComponent = () => {

    const photo = useLayout().photo;
    const msal = useMsal();
    const account = msal.instance.getActiveAccount() ?? msal.accounts[0];

    return useMemo(() => (
        <DSAvatar photo={photo} name={account?.name} />
    ), [photo, account]);
};

AvatarComponent.displayName = "Avatar";

export const Avatar = AvatarComponent;
