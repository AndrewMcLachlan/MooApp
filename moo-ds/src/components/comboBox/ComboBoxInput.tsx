import { useComboBox } from "./ComboBoxProvider";
import { useDebouncedCallback } from "use-debounce";
import { useInnerRef } from "../../hooks";

export const ComboBoxInput = ({ placeholder, ...props }: ComboBoxInputProps) => {

    const { createLabel, creatable, allItems, labelField, search, setItems, selectedItems, newItem, setNewItem, show, text, setText, setShow, ref, listId } = useComboBox();

    // Debounce the actual search execution. Previously `useDebounce(search, 300)`
    // debounced the function *value* (a stable reference), so the search ran
    // synchronously on every keystroke with no debounce at all.
    const runSearch = useDebouncedCallback((value: string) => {
        if (!search) return;
        const results = search(value);
        setItems(results);

        // Mirror the non-search branch's creatable flow: offer "Add '…'" when
        // the typed text matches none of the results. Empty input never
        // offers an add option.
        if (creatable && value !== "" && !results.some((i) => labelField(i).toString().toLowerCase() === value.toLowerCase())) {

            const addItem = newItem ? newItem : {};

            addItem.label = createLabel(value);

            setNewItem(addItem);
        }
        else if (creatable) {
            setNewItem(null);
        }

        setShow(true);
    }, 300);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const value = e.currentTarget.value;
        setText(value);

        if (search) {
            runSearch(value);
        }
        else {
            const tempItems = allItems.filter((i) => labelField(i).toString().toLowerCase().indexOf(value.toLowerCase()) > -1);

            if (creatable && value !== "" && !allItems.some((i) => labelField(i).toString().toLowerCase() === value.toLowerCase())) {

                const addItem = newItem ? newItem : {};

                addItem.label = createLabel(value);

                setNewItem(addItem);
            }
            else if (creatable) {
                setNewItem(null);
            }

            setItems(tempItems);
            setShow(true);
        }
    }

    const keyUp: React.KeyboardEventHandler<any> = (e) => {
        if (e.key === "Escape") {
            // Cancel any pending debounced search so it can't reopen/repopulate
            // the list after the user dismisses it.
            runSearch.cancel();
            setShow(false);
            setText("");
            setItems(allItems);
        }
    }

    // While the dropdown is closed the selected pills stand in for the input;
    // opening it reveals the input for typing/searching.
    const inputVisible = selectedItems?.length === 0 || !!show;

    const innerRef = useInnerRef<HTMLInputElement>(ref);

    return (
        <input type="text" ref={innerRef} hidden={!inputVisible} placeholder={selectedItems?.length == 0 && !props.readonly ? placeholder : ""} onChange={onChange} onKeyUp={keyUp} value={text} tabIndex={props.tabIndex} autoCapitalize="off" autoComplete="off" autoCorrect="off" spellCheck={false} role="combobox" aria-expanded={!!show} aria-controls={listId} />
    );
}

export interface ComboBoxInputProps {
    placeholder: string;
    readonly: boolean;
    tabIndex?: number;
}
