import classNames from "classnames";

export type InputComponent = React.FC<InputProps>;

export const Input: InputComponent = ({ className, ...rest }) => {

    const innerClass = rest.type === "checkbox" ? "form-check-input" : "form-control";

    return (
        <input className={classNames(innerClass, className)} {...rest} />
    );
}

export interface InputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
}
