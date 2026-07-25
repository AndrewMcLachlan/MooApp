import { type RefProps } from "../../models";
import React, { createContext, type ReactNode, useContext, useEffect, useId, useMemo, useState } from "react";

export const ComboBoxContext = createContext<ComboBoxOptions | undefined>(undefined);

export const ComboBoxProvider = <T,>(props: React.PropsWithChildren<ComboBoxProviderProps<T>>) => {

    const [selectedItems, setSelectedItems] = useState(props.selectedItems ? props.selectedItems : []);
    const [text, setText] = useState("");
    const [items, setItems] = useState<T[]>(props.items);
    const [newItem, setNewItem] = useState(null as any);
    const [show, setShow] = useState(false);
    const [showInput, setShowInput] = useState(false);

    // Per-instance listbox id so multiple ComboBoxes on a page don't share a
    // duplicated aria-controls/id relationship.
    const listId = useId();

    // Multi-select keeps the selected items *in* the list (rendered checked),
    // so the list is the single source of truth for what's selected. They are
    // no longer stripped out — the dropdown, not just the pills, lets the user
    // see and toggle every selection.
    const allItems = useMemo(() => {
        return props.items ? props.items : []
    }, [JSON.stringify(props.items)]);

    const clear = (e: React.MouseEvent<any>) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedItems([]);
        onChange?.([]);
        setText("");
        resetItems();
    }

    const resetItems = () => {
        setItems(allItems);
    }

    useEffect(() => {
        resetItems();
    }, [allItems]);

    useEffect(() => {
        setSelectedItems(props.selectedItems ? props.selectedItems : []);
    }, [JSON.stringify(props.selectedItems)]);

    useEffect(() => {
        if (!!show && !props.readonly) return;
        setShow(false);
    }, [props.readonly]);

    const { clearable, creatable, multiSelect, readonly, labelField, valueField, colourField, onAdd, onRemove, onChange, onCreate, createLabel, search, ref } = props;

    // Whether the dropdown panel actually has something worth showing. Opening
    // the control is not enough: an empty, un-queried list (e.g. a search combo
    // on first click, or a list whose items haven't loaded yet) shows no panel
    // at all rather than an empty "No results" bar. The panel appears once there
    // are items, a creatable "add" row, or a query has been typed (so an empty
    // result is meaningful). This is the single source of truth for both the
    // list's rendering and the input's aria-expanded state.
    const showList = show && (items.length > 0 || (!!creatable && !!newItem) || text.length > 0);

    return (
        <ComboBoxContext value={{ selectedItems, setSelectedItems, text, setText, items, setItems, newItem, setNewItem, show, setShow, showInput, setShowInput, showList, clear, clearable, creatable, multiSelect, readonly, labelField, valueField, colourField, onAdd, onRemove, onChange, onCreate, createLabel, search, allItems, ref, listId }}>
            {props.children}
        </ComboBoxContext>
    );
}

ComboBoxProvider.displayName = "ComboBoxProvider";

export const useComboBox = () => {
    const context = useContext(ComboBoxContext);
    if (!context) {
        throw new Error("useComboBox must be used within a ComboBoxProvider");
    }
    return context;
};

export interface ComboBoxProviderProps<TItem> extends ComboBoxProps<TItem> {
}

export interface ComboBoxOptions {
    text: string;
    setText: (text: string) => void;
    selectedItems: any[];
    setSelectedItems: (items: any[]) => void;
    items: any[];
    setItems: (items: any[]) => void;
    newItem: any;
    setNewItem: (item: any) => void;
    show: boolean;
    setShow: (show: boolean) => void
    showInput: boolean;
    setShowInput: (show: boolean) => void;
    /** True when the dropdown panel has content worth showing (see provider). */
    showList: boolean;
    clear: (e: React.MouseEvent<any>) => void;
    clearable?: boolean;
    creatable?: boolean;
    multiSelect?: boolean;
    readonly?: boolean;
    labelField: (item: any) => ReactNode;
    valueField: (item: any) => any;
    colourField?: (item: any) => string;
    onCreate?: (name: string) => void;
    onAdd?: (item: any) => void;
    onRemove?: (item: any) => void;
    onChange?: (items: any[]) => void;
    createLabel?: (input: string) => string;
    search?: (input: string) => any[];
    allItems?: any[];
    ref: React.Ref<HTMLInputElement>;
    listId: string;
}

export interface ComboBoxProps<TItem> extends RefProps<HTMLInputElement> {
    id?: string;
    className?: string;
    search?: (input: string) => TItem[];
    onCreate?: (name: string) => void;
    onAdd?: (item: TItem) => void;
    onRemove?: (item: TItem) => void;
    onChange?: (items: TItem[]) => void;
    labelField: (item: TItem) => ReactNode;
    valueField: (item: TItem) => any;
    colourField?: (item: TItem) => string;
    items?: TItem[];
    hidden?: boolean;
    selectedItems?: TItem[];
    clearable?: boolean;
    creatable?: boolean;
    multiSelect?: boolean;
    placeholder?: string;
    readonly?: boolean;
    tabIndex?: number;
    createLabel?: (input: string) => string;
}

