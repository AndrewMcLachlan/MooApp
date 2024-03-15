import classNames from "classnames";

export type LabelComponent = React.FC<LabelProps>;

export const Label: LabelComponent = ({className, ...rest}) => (
    <label className={classNames("form-label", className)} {...rest} />
);

export interface LabelProps extends React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement> {
}
