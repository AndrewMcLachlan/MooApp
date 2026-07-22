import classNames from "classnames";
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

    // tabIndex 0 keeps options reachable by keyboard (Tab from the input) so the
    // Enter/Space handler is usable, without the positive-tabIndex anti-pattern.
    // When `selected` is set (multi-select), the row reads as a checkbox: a tick
    // marks it and aria-selected exposes the state to assistive tech.
    return (
        <li role="option" aria-selected={props.selected} onClick={click} onKeyDown={keyDown} tabIndex={0} className={classNames({ "cb-option": props.selected !== undefined, selected: props.selected })}>
            {props.selected !== undefined &&
                <svg className="cb-check" height="14" width="14" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m3 8 3.5 3.5L13 4.5" /></svg>
            }
            <span className="cb-option-label">{props.label ?? labelField(props.item)}</span>
        </li>
    );
}

ComobBoxItem.displayName = "ComboBoxItem";

export interface ComboBoxItemProps<TItem> {
    onSelected: (item: TItem) => void;
    label?: string;
    item: TItem;
    /** Multi-select only: renders the row as a checkbox with a tick when true. */
    selected?: boolean;
}
