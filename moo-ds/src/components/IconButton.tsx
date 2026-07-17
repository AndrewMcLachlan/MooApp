import classNames from "classnames";
import { type PropsWithChildren } from "react";
import { Button, type ButtonProps } from "./Button";
import { type IconType } from "../types";
import { Icon } from "./Icon";
import { Spinner } from "./Spinner";

export const IconButton: React.FC<PropsWithChildren<IconButtonProps>> = ({ children, icon, iconSrc: src, badge, loading = false, className, ...button }) => {

    // While loading the icon becomes the spinner; Button keeps the loading
    // semantics (disabled, aria-busy, click guard) but not its own spinner.
    const glyph = loading
        ? <Spinner animation="border" size="sm" aria-hidden="true" />
        : <Icon icon={icon} src={src} />;

    return (
        <Button className={classNames(className, "btn-icon", badge && "btn-icon-badge")} loading={loading} loadingSpinner={false} {...button}>
            {badge
                ? <span className="btn-icon-panel">{glyph}</span>
                : glyph}
            <span>{children}</span>
        </Button>
    );
};

export interface IconButtonProps extends ButtonProps {
    icon?: IconType;
    iconSrc?: string;
    /** Render the icon in a full-height split panel on the left, divided from the label by a convex sweep (as in "Add" buttons). Designed for solid variants. */
    badge?: boolean;
}

IconButton.displayName = "IconButton";
