import { useFormGroup } from "./FormGroupProvider";
import { ComboBox, ComboBoxProps } from "../comboBox";

export const FormComboBox = <T,>({ id, ref, ...rest }: ComboBoxProps<T>) => {

    const group = useFormGroup();

    id = id ?? group.groupId;

    return (
        <ComboBox id={id} {...rest} ref={ref} />
    );
};

FormComboBox.displayName = "FormSelect";
