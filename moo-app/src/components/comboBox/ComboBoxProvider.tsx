import { RefProps } from "../../models";
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

export const ComboBoxContext = createContext<ComboBoxOptions | undefined>(undefined);

export const ComboBoxProvider = <T,>(props: React.PropsWithChildren<ComboBoxProviderProps<T>>) => {

    const [selectedItems, setSelectedItems] = useState(props.selectedItems ? props.selectedItems : []);
    const [text, setText] = useState("");
    const [items, setItems] = useState<T[]>(props.items);
    const [newItem, setNewItem] = useState(null as any);
    const [show, setShow] = useState(false);
    const [showInput, setShowInput] = useState(false);

    const allItems = useMemo(() => {
        if (!props.multiSelect) return props.items ? props.items : []

        return props.items ? props.items.filter(i => !selectedItems.some(si => props.valueField(si) === props.valueField(i))) : []

    }, [JSON.stringify(props.items), selectedItems]);

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

    const { clearable, creatable, multiSelect, readonly, labelField, valueField, onAdd, onRemove, onChange, onCreate, createLabel, search, ref } = props;

    return (
        <ComboBoxContext value={{ selectedItems, setSelectedItems, text, setText, items, setItems, newItem, setNewItem, show, setShow, showInput, setShowInput, clear, clearable, creatable, multiSelect, readonly, labelField, valueField, onAdd, onRemove, onChange, onCreate, createLabel, search, allItems, ref }}>
            {props.children}
        </ComboBoxContext>
    );
}

ComboBoxProvider.displayName = "ComboBoxProvider";

export const useComboBox = () => useContext(ComboBoxContext);

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
    clear: (e: React.MouseEvent<any>) => void;
    clearable?: boolean;
    creatable?: boolean;
    multiSelect?: boolean;
    readonly?: boolean;
    labelField: (item: any) => ReactNode;
    valueField: (item: any) => any;
    onCreate?: (name: string) => void;
    onAdd?: (item: any) => void;
    onRemove?: (item: any) => void;
    onChange?: (items: any[]) => void;
    createLabel?: (input: string) => string;
    search?: (input: string) => any[];
    allItems?: any[];
    ref: React.Ref<HTMLInputElement>;
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

