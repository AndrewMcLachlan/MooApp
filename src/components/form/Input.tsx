import classNames from "classnames";
import { useFormGroup } from "./FormGroupProvider";

export type InputComponent = React.FC<InputProps>;

export const Input: InputComponent = ({ className, id, ...rest }) => {

    const group = useFormGroup();
    id = id ?? group.groupId;
    const innerClass = rest.type === "checkbox" ? "form-check-input" : "form-control";

    return (
        <input id={id} className={classNames(innerClass, className)} {...rest} />
    );
}

export interface InputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
}
