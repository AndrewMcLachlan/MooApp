import classNames from "classnames";
import { useFormGroup } from "./FormGroupProvider";

export type SelectComponent = React.FC<SelectProps>;

export const Select: SelectComponent = ({ className, id, ...rest }) => {

    const group = useFormGroup();

    id = id ?? group.groupId;

    return (
        <select id={id} className={classNames("form-select", className)} {...rest} />
    );
};

export interface SelectProps extends React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
}
