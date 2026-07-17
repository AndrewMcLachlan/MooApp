import { ComobBoxItem } from "./ComboBoxItem"
import { useComboBox } from "./ComboBoxProvider";

export const ComboBoxList = () => {

    const { creatable, items, multiSelect, onAdd, onChange, onCreate, show, setShow, newItem, selectedItems, setSelectedItems, setText, text, valueField, listId } = useComboBox();

    if (!show) return null;

    const onItemSelected = (item: any) => {

        const newSelectedItems = multiSelect ? [...selectedItems, item] : [item];

        if (multiSelect) {
            onAdd?.(item);
        }

        setSelectedItems(newSelectedItems);
        onChange?.(newSelectedItems);

        setShow(false);
        setText("");
    }

    const onItemCreated = () => {
        onCreate?.(text);
        setText("");
        setShow(false);
    }

    return (
        <ol className="cb-list" id={listId} role="listbox">
            {items.map((i) =>
                <ComobBoxItem key={valueField(i)} onSelected={onItemSelected} item={i} />
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
