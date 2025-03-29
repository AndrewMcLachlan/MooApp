import { useFormGroup } from "./FormGroupProvider";
import { ComboBox, ComboBoxProps } from "../comboBox";
import { Controller } from "react-hook-form";

export const FormComboBox = <T,>({ id, ref, ...rest }: Omit<ComboBoxProps<T>, "selectedItems" | "onChange">) => {

    const group = useFormGroup();

    id = id ?? group.groupId;
    return (
        <Controller
            name={id}
            render={({ field }) => {

                const selectedItems = rest.multiSelect ?
                    rest.items?.filter(i => field.value?.some((v: any) => v === rest.valueField(i))) :
                    rest.items?.filter(i => field.value === rest.valueField(i));

                const onChange = (items: T[]) => {
                    console.log("onChange", items);
                    if (rest.multiSelect) {
                        field.onChange(items?.map(i => rest.valueField(i)))
                    } else {
                        field.onChange(rest.valueField(items?.[0]));
                    }
                };

                return (
                    <ComboBox id={id} {...rest} ref={ref} selectedItems={selectedItems} onChange={onChange} />
                );
            }} />
    );
};

FormComboBox.displayName = "FormComboBox";
