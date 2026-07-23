import { ComobBoxItem } from "./ComboBoxItem"
import { useComboBox } from "./ComboBoxProvider";

export const ComboBoxList = () => {

    const { creatable, items, multiSelect, onAdd, onRemove, onChange, onCreate, show, setShow, newItem, setNewItem, selectedItems, setSelectedItems, setText, text, valueField, listId } = useComboBox();

    if (!show) return null;

    const isSelected = (item: any) => selectedItems.some(i => valueField(i) === valueField(item));

    const onItemSelected = (item: any) => {

        // Single-select: pick and close, as before.
        if (!multiSelect) {
            const newSelectedItems = [item];
            setSelectedItems(newSelectedItems);
            onChange?.(newSelectedItems);
            setShow(false);
            setText("");
            return;
        }

        // Multi-select: the row is a checkbox. Toggle it and keep the dropdown
        // open so the user can pick several. The text filter is left intact.
        const selected = isSelected(item);
        const newSelectedItems = selected
            ? selectedItems.filter(i => valueField(i) !== valueField(item))
            : [...selectedItems, item];

        if (selected) onRemove?.(item);
        else onAdd?.(item);

        setSelectedItems(newSelectedItems);
        onChange?.(newSelectedItems);
    }

    const onItemCreated = () => {
        onCreate?.(text);
        setText("");
        setShow(false);
        setNewItem(null);
    }

    // Multi-select pins the checked items to the top so "see everything I've
    // picked" is answered by just opening the list. Stable sort preserves the
    // original order within each group.
    const displayItems = multiSelect
        ? [...items].sort((a, b) => Number(isSelected(b)) - Number(isSelected(a)))
        : items;

    return (
        <ol className="cb-list" id={listId} role="listbox">
            {displayItems.map((i) =>
                <ComobBoxItem key={valueField(i)} onSelected={onItemSelected} item={i} selected={multiSelect ? isSelected(i) : undefined} />
            )}
            {creatable && newItem &&
                <ComobBoxItem onSelected={onItemCreated} item={newItem} label={newItem.label} />
            }
            {!creatable && items.length === 0 &&
                <li className="no-results" role="presentation">No results found</li>
            }
        </ol>
    );
}
