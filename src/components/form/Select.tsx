import classNames from "classnames";

export type SelectComponent = React.FC<SelectProps>;

export const Select: SelectComponent = ({className, ...rest}) => (
    <select className={classNames("form-select", className)} {...rest} />
);

export interface SelectProps extends React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
}
