import React from "react";
import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

/**
 * @deprecated
 * Use Icon instead
 * @see Icon
 **/
export const ClickableIcon: React.FC<ClickableIconProps> = (props) => <FontAwesomeIcon {...props} className={classNames(props.className, "clickable")} />;

ClickableIcon.displayName = "ClickableIcon";

export interface ClickableIconProps extends FontAwesomeIconProps {
}
