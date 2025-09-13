import { CloseBadge } from "../CloseBadge";
import { useComboBox } from "./ComboBoxProvider";

export const ComboBoxSelectedItem = <T,>({item}: ComboBoxSelectedItemProps<T>) => {

    const { labelField, valueField, colourField, onChange, onRemove, selectedItems, setSelectedItems } = useComboBox();

    const removeItem = (item: T) => {
        onRemove?.(item);

        const newSelectedItems = selectedItems.filter(i => valueField(i) !== valueField(item));
        setSelectedItems(newSelectedItems);
        onChange?.(newSelectedItems);
    }

    if (item === undefined) return null;

    const bgColour = colourField ? colourField(item) : "inherit";
    const bg = colourField ? "none" : "primary";

    console.debug("bg", bg);

    return (
        <div className="item"><CloseBadge pill bg={bg} style={{backgroundColor: bgColour}} onClose={() => removeItem(item)}>{labelField(item)}</CloseBadge></div>
    );
}

ComboBoxSelectedItem.displayName = "ComboBoxSelectedItem";

export interface ComboBoxSelectedItemProps<TItem> {
    item: TItem;
}