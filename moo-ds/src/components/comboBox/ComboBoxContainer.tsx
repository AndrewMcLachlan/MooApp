import React, { useEffect, useRef } from "react";
import classNames from "classnames";

import { useClickAway } from "../../hooks";

import { ComboBoxInput as Input } from "./ComboBoxInput";
import { ComboBoxControls as Controls } from "./ComboBoxControls";
import { type ComboBoxProps, useComboBox } from "./ComboBoxProvider";
import { ComboBoxList as List } from "./ComboBoxList";
import { ComboBoxSelectedItem as SelectedItem } from "./ComboBoxSelectedItem";
import { ComboBoxSingleSelectedItem as SingleSelectedItem } from "./ComboBoxSingleSelectedItem";

export const ComboBoxContainer: React.FC<ComboBoxContainerProps> = ({ placeholder, readonly = false, hidden = false, id, className, tabIndex }) => {

    const { multiSelect, selectedItems, setShow, showInput, setShowInput, valueField, collapseAfter } = useComboBox();

    const divRef = useRef<HTMLDivElement>(null);

    const setAllShow = (show: boolean) => {
        setShow(show);
        setShowInput(show);
    };

    useClickAway(setAllShow, divRef as React.RefObject<any>);

    const focusInput = () => divRef.current?.querySelector<HTMLInputElement>("input")?.focus();

    // Focus the input once it un-hides on activation (it can't be focused while
    // hidden, so this runs after the show-driven re-render).
    useEffect(() => {
        if (showInput && !readonly) focusInput();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showInput]);

    const activate = () => {
        setShow(true);
        setShowInput(true);
        focusInput();
    };

    // Collapse the pills to the first N + a "+X more" chip while inactive, so a
    // large selection doesn't grow the control. Activating expands to all pills.
    const collapsed = !!multiSelect && !showInput && selectedItems.length > collapseAfter;
    const visibleItems = collapsed ? selectedItems.slice(0, collapseAfter) : selectedItems;
    const hiddenCount = selectedItems.length - visibleItems.length;

    return (
        <div id={id} ref={divRef} className={classNames("combo-box", readonly ? "readonly" : "", className)} hidden={hidden} onClick={activate} onKeyUp={key => key.key === "Escape" && setShow(false)}>
            <div>
                <div className="body">
                    {!!multiSelect && visibleItems.map(item => <SelectedItem key={valueField(item)?.toString()} item={item} />)}
                    {hiddenCount > 0 && <span className="cb-more" aria-hidden="true">+{hiddenCount} more</span>}
                    {!multiSelect && selectedItems.length > 0 && <SingleSelectedItem />}
                    <Input placeholder={placeholder} readonly={readonly} tabIndex={tabIndex} />
                </div>
                <Controls />
            </div>
            <List />
        </div>
    );
};

ComboBoxContainer.displayName = "ComboBoxContainer";

interface ComboBoxContainerProps extends Pick<ComboBoxProps<any>, "placeholder" | "readonly" | "hidden" | "id" | "className" | "ref" | "tabIndex"> {
}
