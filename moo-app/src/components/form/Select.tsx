import { useFormGroup } from "./FormGroupProvider";
import React from "react";
import { ComboBox, ComboBoxProps } from "../comboBox";

export type SelectComponent<T> = React.FC<ComboBoxProps<T>>;

export const Select: SelectComponent<any> = <T,>({ id, ref, ...rest }: ComboBoxProps<T>) => {

    const group = useFormGroup();

    id = id ?? group.groupId;

    return (
        <ComboBox id={id} {...rest} ref={ref} />
    );
});

Select.displayName = "Select";
