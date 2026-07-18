import React, { useEffect, useRef } from "react";
import classNames from "classnames";

import { useClickAway } from "../../hooks";

import { ComboBoxInput as Input } from "./ComboBoxInput";
import { ComboBoxControls as Controls } from "./ComboBoxControls";
import { type ComboBoxProps, useComboBox } from "./ComboBoxProvider";
import { ComboBoxList as List } from "./ComboBoxList";
import { ComboBoxPills as Pills } from "./ComboBoxPills";
import { ComboBoxSingleSelectedItem as SingleSelectedItem } from "./ComboBoxSingleSelectedItem";

export const ComboBoxContainer: React.FC<ComboBoxContainerProps> = ({ placeholder, readonly = false, hidden = false, id, className, tabIndex }) => {

    const { multiSelect, selectedItems, show, setShow, setShowInput } = useComboBox();

    const divRef = useRef<HTMLDivElement>(null);

    const setAllShow = (value: boolean) => {
        setShow(value);
        setShowInput(value);
    };

    useClickAway(setAllShow, divRef as React.RefObject<any>);

    const focusInput = () => divRef.current?.querySelector<HTMLInputElement>("input")?.focus();

    // Opening the control (dropdown) also un-hides the input, so focus it once
    // that has happened.
    useEffect(() => {
        if (show && !readonly) focusInput();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    // Any click in the control opens it and focuses the input. Remove-x / clear-x
    // stop propagation, so they don't trigger this.
    const activate = () => {
        setAllShow(true);
        focusInput();
    };

    return (
        <div id={id} ref={divRef} className={classNames("combo-box", readonly ? "readonly" : "", className)} hidden={hidden} onClick={activate} onKeyUp={key => key.key === "Escape" && setShow(false)}>
            <div>
                <div className="body">
                    {!!multiSelect && <Pills />}
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
