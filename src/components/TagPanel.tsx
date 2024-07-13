import { ElementType, useRef, useState } from "react";
import { useClickAway } from "../hooks";
import Select, { ActionMeta, MultiValue } from "react-select";
import Creatable, { CreatableProps } from "react-select/creatable";
import classNames from "classnames";

export const TagPanel = <T extends unknown>({ as = "div", allowCreate = false, readonly = false, alwaysShowEditPanel = false, ...props }: TagPanelProps<T, any>) => {

    const [editMode, setEditMode] = useState(false);
    const ref = useRef(null);
    useClickAway(setEditMode, ref);

    const Component = allowCreate ? Creatable : Select;

    const extraProps: Partial<CreatableProps<any, any, any>> = allowCreate ? {
        onCreateOption: props.onCreate,
        formatCreateLabel: (input) => `Create ${input}...`,
    } : {};

    const onChange = (value: MultiValue<T>, meta: ActionMeta<T>) => {

        switch (meta.action) {
            case "remove-value":
            case "pop-value":
            case "deselect-option":
                props.onRemove && props.onRemove(meta.removedValue);
                break;
            case "clear":
                for (const val of meta.removedValues) {
                    props.onRemove && props.onRemove(val);
                }
                break;
            case "select-option":
                props.onAdd && props.onAdd(meta.option);
        }

        props.onChange && props.onChange(Array.from(value));
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

    const getOptionLabel = (item: T) => props.labelField(item) ?? (allowCreate && "Create new tag...");

    const displayEdit = !readonly  && (editMode || alwaysShowEditPanel);
    const isReadonly = readonly || (!editMode && !alwaysShowEditPanel);

    const As = as;

    const {
        selectedItems,
        items,
        labelField,
        valueField,
        search,
        onAdd,
        onRemove,
        onCreate, ...rest } = props;

    return (
        <As ref={ref} className={classNames("tag-panel", displayEdit && "edit-mode")} onClick={onClick} onKeyUp={rest.onKeyUp ?? keyUp} onTouchStart={() => setEditMode(true)}>
            <Component unstyled={isReadonly} {...extraProps} options={props.items} isMulti isClearable value={props.selectedItems} getOptionLabel={getOptionLabel} getOptionValue={props.valueField} onChange={onChange} className={classNames("react-select", isReadonly && "readonly")} classNamePrefix="react-select" />
        </As>
    );
}

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
    onCreate?: (text: string) => void;
}
