import { CloseBadge } from "../CloseBadge";
import { useComboBox } from "./ComboBoxProvider";

export const ComboBoxSelectedItem = <T,>({item}: ComboBoxSelectedItemProps<T>) => {

    const { labelField, valueField, onChange, onRemove, selectedItems, setSelectedItems } = useComboBox();

    const removeItem = (item: T) => {
        onRemove?.(item);

        const newSelectedItems = selectedItems.filter(i => valueField(i) !== valueField(item));
        setSelectedItems(newSelectedItems);
        onChange?.(newSelectedItems);
    }

    return (
        <div className="item"><CloseBadge pill bg="primary" onClose={() => removeItem(item)}>{labelField(item)}</CloseBadge></div>
    );
}

ComboBoxSelectedItem.displayName = "ComboBoxSelectedItem";

export interface ComboBoxSelectedItemProps<TItem> {
    item: TItem;
}