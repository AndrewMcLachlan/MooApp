import React, { useRef } from "react";
import classNames from "classnames";

import { RefProps } from "models";
import { useClickAway } from "hooks";

import { ComboBoxInput as Input } from "./ComboBoxInput";
import { ComboBoxControls as Controls } from "./ComboBoxControls";
import { useComboBox } from "./ComboBoxProvider";
import { ComboBoxList as List } from "./ComboBoxList";
import { ComboBoxSelectedItem as SelectedItem } from "./ComboBoxSelectedItem";
import { ComboBoxSingleSelectedItem as SingleSelectedItem } from "./ComboBoxSingleSelectedItem";

export const ComboBoxContainer: React.FC<ComboBoxContainerProps> = ({ placeholder = "Select...", readonly = false, hidden = false, ref }) => {

    const { multiSelect, selectedItems, show, setShow, valueField } = useComboBox();

    const divRef = useRef<HTMLDivElement>(null);

    const theRef = ref || divRef;

    useClickAway(setShow, theRef as React.RefObject<any>);

    return (
        <div className={classNames("combo-box", readonly ? "readonly" : "")} hidden={hidden} ref={theRef} onClick={() => setShow(!show)} onKeyUp={key => key.key === "Escape" && setShow(false)}>
            <div>
                {!!multiSelect && selectedItems.map(item => <SelectedItem key={valueField(item)?.toString()} item={item} />)}
                {!multiSelect && selectedItems.length > 0 && <SingleSelectedItem />}
                <Input placeholder={placeholder} readonly={readonly} />
                <Controls />
            </div>
            <List />
        </div>
    );
};

ComboBoxContainer.displayName = "ComboBoxContainer";

interface ComboBoxContainerProps extends RefProps<HTMLDivElement> {
    placeholder?: string;
    readonly?: boolean;
    hidden?: boolean;
}