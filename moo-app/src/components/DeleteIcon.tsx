import { ClickableIcon, ClickableIconProps } from "./ClickableIcon";

export const DeleteIcon: React.FC<DeleteIconProps> = (props) => (
    <ClickableIcon icon="trash-alt" title="delete" size="1x" {...props} />
);

export interface DeleteIconProps extends Omit<ClickableIconProps, "icon" | "title" | "size"> {
}
