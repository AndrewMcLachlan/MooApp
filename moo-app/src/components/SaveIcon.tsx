import { ClickableIcon, ClickableIconProps } from "./ClickableIcon";

export const SaveIcon: React.FC<SaveIconProps> = (props) => (
    <ClickableIcon icon="check-circle" title="save" size="lg" {...props} />
);

export interface SaveIconProps extends Omit<ClickableIconProps, "icon" | "title" | "size"> {
}
