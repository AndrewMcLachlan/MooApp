import { useComboBox } from "./ComboBoxProvider";
import { useDebounce } from "use-debounce";

export const ComboBoxInput = ({ placeholder, ...props }: ComboBoxInputProps) => {

    const { createLabel, creatable, allItems, items, labelField, search, setItems, selectedItems, newItem, setNewItem, text, setText, setShow } = useComboBox();

    const [debouncedSearch] = useDebounce(search, 300);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        setText(e.currentTarget.value);

        if (search) {
            setItems(debouncedSearch(e.currentTarget.value));
        }
        else {

            const tempItems = allItems.filter((i) => labelField(i).toString().toLowerCase().indexOf(e.currentTarget.value.toLowerCase()) > -1);

            if (creatable && !allItems.some((i) => labelField(i).toString() === e.currentTarget.value.toLowerCase())) {

                const addItem = newItem ? newItem : {};

                addItem.label = createLabel(e.currentTarget.value);

                setNewItem(addItem);
            }

            setItems(tempItems);
            setShow(true);
        }
    }

    const keyUp: React.KeyboardEventHandler<any> = (e) => {
        if (e.key === "Escape") {
            setShow(false);
            setText("");
            setItems(allItems);
        }
    }

    return (
        <input type="text" placeholder={selectedItems?.length == 0 && !props.readonly ? placeholder : ""} onChange={onChange} onKeyUp={keyUp} value={text} tabIndex={1} autoCapitalize="off" autoComplete="off" autoCorrect="off" spellCheck={false} role="combobox" aria-expanded={items.length > 0} />
    );
}

export interface ComboBoxInputProps {
    placeholder: string;
    readonly: boolean;
}