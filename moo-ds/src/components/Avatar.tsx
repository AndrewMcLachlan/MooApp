import { useMemo } from "react";

const AvatarComponent: React.FC<AvatarProps> = ({ photo, name }) => (

    useMemo(() => (
        <div className="avatar clickable">
            {photo && <img src={photo} alt="Me" />}
            {!photo && <div className="initials">{name?.split(" ").map(n => n[0]).join("")}</div>}
        </div>
    ), [photo, name])
);

AvatarComponent.displayName = "Avatar";

export const Avatar = AvatarComponent;

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