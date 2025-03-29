import { ComboBox, useClickAway } from "@andrewmclachlan/mooapp";
import classNames from "classnames";
import { ElementType, useRef, useState } from "react";

export const TagPanel = <T,>({ as = "div", readonly = false, alwaysShowEditPanel = false, ...props }: TagPanelProps<T, any>) => {

    const [editMode, setEditMode] = useState(false);
    const ref = useRef(null);
    useClickAway(setEditMode, ref);

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
            <ComboBox<T> {...props} multiSelect clearable createLabel={() => "Create new tag..."} readonly={isReadonly} />
        </As>
    );
}

TagPanel.displayName = "TagPanel";

export type TagPanelProps<TData, TElement extends ElementType> = Props<TData, TElement> & Omit<React.ComponentPropsWithoutRef<TElement>, keyof Props<TData, TElement>>;

export interface Props<TData, TElement extends ElementType> {

    as?: TElement;
    creatable?: boolean;
    alwaysShowEditPanel?: boolean;

    selectedItems: TData[];
    items: TData[];
    labelField: (item: TData) => string;
    valueField: (item: TData) => any;

    onAdd?: (item: TData) => void;
    onRemove?: (item: TData) => void;
    onChange?: (items: TData[]) => void;
    onCreate?: (text: string) => void;
}
