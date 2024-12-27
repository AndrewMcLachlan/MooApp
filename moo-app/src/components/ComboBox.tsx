import { useClickAway } from "hooks";
import { RefProps } from "models/RefProps";
import React, { useEffect, useRef, useState } from "react";
import { CloseBadge } from "./CloseBadge";
import { set } from "react-hook-form";
import { fas } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";

export const ComboBox = <T,>({ placeholder = "Select...", ...props }: ComboBoxProps<T>) => {

    const [items, setItems] = useCustomState<any[]>((value: any[]) => value.slice(0, 10), []);
    const [text, setText] = useState("");
    const [selectedItems, setSelectedItems] = useState(props.selectedItems ? props.selectedItems : []);
    const [newItem, setNewItem] = useState(null as any);
    const [show, setShow] = useState(false);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        setText(e.currentTarget.value);
        if (!props.multiSelect) setSelectedItems(null);

        if (props.search) {
            // TODO: Debounce
            setItems(props.search(e.currentTarget.value));
        }
        else {


            const tempItems = props.items.filter((i) => props.labelField(i).toLowerCase().startsWith(e.currentTarget.value.toLowerCase()));

            if (props.creatable && !props.items.some((i) => props.labelField(i).toLowerCase() === e.currentTarget.value.toLowerCase())) {

                const addItem = newItem ? newItem : {};

                addItem.label = props.createLabel(e.currentTarget.value);
                console.debug(addItem.label);

                setNewItem(addItem);
            }

            setItems(tempItems);
        }
    }

    const clear = (e: React.MouseEvent<any>) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedItems([]);
        setText("");
    }

    const onItemSelected = (item: T) => {

        if (props.multiSelect) {
            setSelectedItems([...selectedItems, item]);
        }
        else {
            setSelectedItems([item]);
        }

        props.onAdd?.(item);
        setShow(false)
        setItems([]);
        setText("");
    }
    
    const removeItem = (item: T) => {
        props.onRemove?.(item);
        setSelectedItems(selectedItems.filter((i) => props.valueField(i) !== props.valueField(item)));
    }

    const onItemCreated = () => {

        props.onCreate?.(newItem.label)
        setShow(false)
        setItems([]);
        setText("");
        setNewItem(undefined);
    }

    useEffect(() => {
        setSelectedItems(props.selectedItems ? props.selectedItems : []);
    }, [JSON.stringify(props.selectedItems)]);

    useEffect(() => {
        props.onChange?.(selectedItems);
    }, [JSON.stringify(selectedItems)]);

    const showHideItems = (e?: React.MouseEvent<any>) => {

        if (e) {
            e.preventDefault();
        }

        if (items.length > 1) {
            setShow(false);
            setNewItem(undefined);
            setItems([]);
        }
        else {
            setShow(true);
            setItems(props.items!);
        }
    }


    const value = props.multiSelect ? text : (selectedItems[0] && props.labelField(selectedItems[0])) || text;

    const divRef = useRef<HTMLDivElement>(null);

    const theRef = props.ref || divRef;

    useClickAway(setShow, theRef);

    return (
        <div className={classNames("combo-box", props.readonly ? "readonly" : "")} hidden={props.hidden} ref={theRef} onClick={showHideItems}>
            <div>
                {props.multiSelect && selectedItems.map(item => <div key={props.valueField(item)} className="item"><CloseBadge pill bg="primary" onClose={() => removeItem(item)}>{props.labelField(item)}</CloseBadge></div>)}
                <input type="text" placeholder={selectedItems.length == 0 && !props.readonly ? placeholder : ""} onChange={onChange} value={value} tabIndex={1} autoCapitalize="off" autoComplete="off" autoCorrect="off" spellCheck={false} role="combobox" aria-expanded={items.length > 0} />
                <div className="controls clearable">
                    {props.clearable && selectedItems?.length > 0 && <div><svg onClick={clear} height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" className="clear-input"><path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path></svg></div>}
                    <div><svg xmlns='http://www.w3.org/2000/svg' height={16} width={16} viewBox='0 0 16 16'><path fill='none' stroke='#ced4da' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='m2 5 6 6 6-6' /></svg></div>
                </div>
            </div>
            {show &&
                <ol className="cb-list">
                    {items.map((i) =>
                        <ComobBoxItem key={props.valueField(i)} onSelected={onItemSelected} item={i} labelField={props.labelField} />
                    )}
                    {props.creatable && newItem &&
                        <ComobBoxItem onSelected={onItemCreated} item={newItem} labelField={(i) => i.label} />
                    }
                </ol>
            }
        </div>
    );
};

ComboBox.displayName = "ComboBox";

const ComobBoxItem = <T,>(props: ComboBoxItemProps<T>) => {

    const click = (e: React.MouseEvent<HTMLLIElement>) => {
        e.preventDefault();
        e.stopPropagation();

        props.onSelected(props.item);
    }

    return (<li onClick={click} tabIndex={2}>{props.labelField(props.item)}</li>);
}

ComobBoxItem.displayName = "ComboBoxItem";



function useCustomState<S>(customSetter: (value: S) => S, initialState: S | (() => S)): [S, (value: S) => void] {
    const [value, setter] = useState<S>(initialState);

    const setterWrapper = (value: S) => {
        const newValue = customSetter(value);
        setter(newValue);
    }

    return [value, setterWrapper];
}

export interface ComboBoxProps<TItem> extends RefProps<HTMLDivElement> {
    search?: (input: string) => TItem[];
    onCreate?: (name: string) => void;
    onAdd?: (item: TItem) => void;
    onRemove?: (item: TItem) => void;
    onChange?: (items: TItem[]) => void;
    allowAdd?: boolean;
    labelField: (item: TItem) => string;
    valueField: (item: TItem) => string;
    items?: TItem[];
    hidden?: boolean;
    selectedItems?: TItem[];
    clearable?: boolean;
    creatable?: boolean;
    multiSelect?: boolean;
    placeholder?: string;
    readonly?: boolean;
    createLabel?: (input: string) => string;
}

export interface ComboBoxItemProps<TItem> {
    onSelected: (item: TItem) => void;
    labelField: (item: TItem) => string;
    item: TItem;
}
