import React from "react";

const AvatarComponent: React.FC<AvatarProps> = ({ photo, name }) => (
    <div className="avatar clickable">
        {photo && <img src={photo} alt={name ?? "Avatar"} />}
        {!photo && <div className="initials">{name?.split(" ").map(n => n[0]).join("")}</div>}
    </div>
);

AvatarComponent.displayName = "Avatar";

export const Avatar = React.memo(AvatarComponent);
Avatar.displayName = "Avatar";

export interface AvatarProps {
    /**
     * The URL of the avatar image.
     */
    photo?: string;

    /**
     * The name of the user, used to generate initials if no photo is provided.
     */
    name?: string;
}