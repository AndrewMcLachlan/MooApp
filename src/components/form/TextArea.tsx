import classNames from "classnames";
import { useFormGroup } from "./FormGroupProvider";

export type TextAreaComponent = React.FC<TextAreaProps>;

export const TextArea: TextAreaComponent = ({ className, id, ...rest }) => {

    const group = useFormGroup();

    id = id ?? group.groupId;

    return (
        <textarea id={id} className={classNames("form-control", className)} {...rest} />
    );
}

export interface TextAreaProps extends React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
}
