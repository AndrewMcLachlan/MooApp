import { useComboBox } from "./ComboBoxProvider";

export const ComobBoxItem = <T,>(props: ComboBoxItemProps<T>) => {

    const { labelField } = useComboBox();

    const select = () => {
        props.onSelected(props.item);
    }

    const click = (e: React.MouseEvent<HTMLLIElement>) => {
        e.preventDefault();
        e.stopPropagation();

        select();
    }

    const keyDown = (e: React.KeyboardEvent<HTMLLIElement>) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            select();
        }
    }

    if (props.item === undefined) return null;

    return (<li role="option" onClick={click} onKeyDown={keyDown} tabIndex={-1}>{props.label ?? labelField(props.item)}</li>);
}

ComobBoxItem.displayName = "ComboBoxItem";

export interface ComboBoxItemProps<TItem> {
    onSelected: (item: TItem) => void;
    label?: string;
    item: TItem;
}
