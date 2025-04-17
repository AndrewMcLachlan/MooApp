import React, { useRef } from "react";
import classNames from "classnames";

import { useClickAway } from "../../hooks";

import { ComboBoxInput as Input } from "./ComboBoxInput";
import { ComboBoxControls as Controls } from "./ComboBoxControls";
import { ComboBoxProps, useComboBox } from "./ComboBoxProvider";
import { ComboBoxList as List } from "./ComboBoxList";
import { ComboBoxSelectedItem as SelectedItem } from "./ComboBoxSelectedItem";
import { ComboBoxSingleSelectedItem as SingleSelectedItem } from "./ComboBoxSingleSelectedItem";

export const ComboBoxContainer: React.FC<ComboBoxContainerProps> = ({ placeholder = "Select...", readonly = false, hidden = false, id, className, tabIndex }) => {

    const { multiSelect, selectedItems, show, setShow, valueField } = useComboBox();

    const divRef = useRef<HTMLDivElement>(null);

    useClickAway(setShow, divRef as React.RefObject<any>);

    return (
        <div id={id} ref={divRef} className={classNames("combo-box", readonly ? "readonly" : "", className)} hidden={hidden} onClick={() => setShow(!show)} onKeyUp={key => key.key === "Escape" && setShow(false)}>
            <div>
            <div className="body">
                {!!multiSelect && selectedItems.map(item => <SelectedItem key={valueField(item)?.toString()} item={item} />)}
                {!multiSelect && selectedItems.length > 0 && <SingleSelectedItem />}
                <Input placeholder={placeholder} readonly={readonly} tabIndex={tabIndex}  />
                </div>
            <Controls />
            </div>
            <List />
        </div>
    );
};

ComboBoxContainer.displayName = "ComboBoxContainer";

interface ComboBoxContainerProps extends Pick<ComboBoxProps<any>, "placeholder" | "readonly" | "hidden" | "id" | "className" | "ref" | "tabIndex" > {
}