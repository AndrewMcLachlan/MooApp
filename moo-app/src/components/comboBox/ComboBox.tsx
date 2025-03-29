import { ComboBoxProps, ComboBoxProvider } from "./ComboBoxProvider";
import { ComboBoxContainer } from "./ComboBoxContainer";

export const ComboBox = <T,>({ placeholder = "Select...", ...props }: ComboBoxProps<T>) => {

    return (
        <ComboBoxProvider placeholder={placeholder} {...props}>
            <ComboBoxContainer {...props} />
        </ComboBoxProvider>
    );
};

ComboBox.displayName = "ComboBox";
