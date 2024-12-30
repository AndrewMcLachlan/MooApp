import { useComboBox } from "./ComboBoxProvider";

export const ComobBoxItem = <T,>(props: ComboBoxItemProps<T>) => {

    const { labelField } = useComboBox();

    const click = (e: React.MouseEvent<HTMLLIElement>) => {
        e.preventDefault();
        e.stopPropagation();

        props.onSelected(props.item);
    }

    if (props.item === undefined) return null;

    return (<li onClick={click} tabIndex={2}>{props.label ?? labelField(props.item)}</li>);
}

ComobBoxItem.displayName = "ComboBoxItem";

export interface ComboBoxItemProps<TItem> {
    onSelected: (item: TItem) => void;
    label?: string;
    item: TItem;
}
