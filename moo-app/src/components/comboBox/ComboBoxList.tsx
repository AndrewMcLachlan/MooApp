import { ComobBoxItem } from "./ComboBoxItem"
import { useComboBox } from "./ComboBoxProvider";

export const ComboBoxList = () => {

    const { creatable, items, multiSelect, onAdd, onChange, onCreate, show, setShow, newItem, selectedItems, setSelectedItems, setText, valueField } = useComboBox();

    if (!show) return null;

    const onItemSelected = (item: any) => {

        let newSelectedItems = [];

        if (multiSelect) {
            newSelectedItems = [...selectedItems, item];
            onAdd?.(item);
        }
        else {
            newSelectedItems = [item];
        }

        setSelectedItems(newSelectedItems);
        onChange?.(newSelectedItems);

        setShow(false);
        setText("");
    }

    const onItemCreated = () => {
        onCreate?.(newItem.label);
        setShow(false);
    }

    return (
        <ol className="cb-list">
            {items.map((i) =>
                <ComobBoxItem key={valueField(i)} onSelected={onItemSelected} item={i} />
            )}
            {creatable && newItem &&
                <ComobBoxItem onSelected={onItemCreated} item={newItem} label={newItem.label} />
            }
            {!creatable && items.length === 0 &&
                <li className="no-results">No results found</li>
            }
        </ol>
    );
}