import classNames from "classnames";

export type TextAreaComponent = React.FC<TextAreaProps>;

export const TextArea: TextAreaComponent = ({ className, ...rest }) => {

    return (
        <textarea className={classNames("form-control", className)} {...rest} />
    );
}

export interface TextAreaProps extends React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
}
