import classNames from "classnames";
import { ElementType, useRef, useState } from "react";
import { useClickAway } from "../hooks";
import { ComboBox } from "./comboBox";

export const TagPanel = <T,>({ as = "div", allowCreate = false, readonly = false, alwaysShowEditPanel = false, ...props }: TagPanelProps<T, any>) => {

    const [editMode, setEditMode] = useState(false);
    const ref = useRef(null);
    useClickAway(setEditMode, ref);


    const onChange = (items: T[]) => {
        props.onChange?.(items);
    }

    const keyUp: React.KeyboardEventHandler<any> = (e) => {
        if (e.key === "Enter" || e.key === "Tab") {
            setEditMode(false);
        }
    }

    const onClick: React.MouseEventHandler<any> = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setEditMode(true);
    }

    const displayEdit = !readonly  && (editMode || alwaysShowEditPanel);
    const isReadonly = readonly || (!editMode && !alwaysShowEditPanel);

    const As = as;

    return (
        <As ref={ref} className={classNames("tag-panel", displayEdit && "edit-mode")} onClick={onClick} onKeyUp={props.onKeyUp ?? keyUp} onTouchStart={() => setEditMode(true)}>
            <ComboBox<T> items={props.items} multiSelect clearable creatable selectedItems={props.selectedItems} labelField={props.labelField} valueField={props.valueField} onChange={onChange} createLabel={() => "Create new tag..."} readonly={isReadonly} />
        </As>
    );
}

TagPanel.displayName = "TagPanel";

export type TagPanelProps<TData, TElement extends ElementType> = Props<TData, TElement> & Omit<React.ComponentPropsWithoutRef<TElement>, keyof Props<TData, TElement>>;

export interface Props<TData, TElement extends ElementType> {

    as?: TElement;
    allowCreate?: boolean;
    alwaysShowEditPanel?: boolean;

    selectedItems: TData[];
    items: TData[];
    labelField: (item: TData) => string;
    valueField: (item: TData) => string;

    onAdd?: (item: TData) => void;
    onRemove?: (item: TData) => void;
    onChange?: (items: TData[]) => void;
    onCreate?: (text: string) => void;
}
