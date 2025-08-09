import { Icon, IconProps } from "./Icon";

export const DeleteIcon: React.FC<DeleteIconProps> = (props) => (
    <Icon icon="trash-alt" title="delete" {...props} />
);

DeleteIcon.displayName = "DeleteIcon";

export interface DeleteIconProps extends Omit<IconProps, "icon" | "title" | "size"> {
}
