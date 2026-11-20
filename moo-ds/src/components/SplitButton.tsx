import classNames from "classnames";
import React, { type PropsWithChildren } from "react";
import { Button, type ButtonProps } from "./Button";
import { ButtonGroup } from "./ButtonGroup";
import { IconButton } from "./IconButton";
import { Menu } from "./Menu";
import { type IconType } from "../types";

export interface SplitButtonProps extends Omit<ButtonProps, "as" | "href"> {
    /** The menu's id. */
    id: string;
    /** The default action's label. `onClick` runs it. */
    label: React.ReactNode;
    /** A leading icon on the default action. */
    icon?: IconType;
    /** Accessible name for the caret, which has no text of its own. */
    toggleLabel?: string;
}

/**
 * A split button: the label runs the default action and the caret opens a
 * menu of alternatives. Children are `Menu.Item`s and `Menu.Divider`s.
 */
export const SplitButton: React.FC<PropsWithChildren<SplitButtonProps>> = ({
    id, label, icon, toggleLabel = "More options", variant = "primary", size, disabled, className, style, children, ...rest
}) => (
    <ButtonGroup className={classNames("split-button", className)} style={style}>
        {icon
            ? <IconButton icon={icon} variant={variant} size={size} disabled={disabled} {...rest}>{label}</IconButton>
            : <Button variant={variant} size={size} disabled={disabled} {...rest}>{label}</Button>}
        <Menu
            id={id}
            className="split-button-menu"
            trigger={
                <Button
                    variant={variant}
                    size={size}
                    disabled={disabled}
                    className="split-button-toggle"
                    aria-haspopup="menu"
                    aria-label={toggleLabel}
                >
                    <svg xmlns='http://www.w3.org/2000/svg' height={16} width={16} viewBox='0 0 16 16' className="split-button-caret" aria-hidden="true"><path fill='none' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='m2 5 6 6 6-6' className="drop-down-chevron" /></svg>
                </Button>
            }
        >
            {children}
        </Menu>
    </ButtonGroup>
);

SplitButton.displayName = "SplitButton";
