import React from "react";

import { useClickAway } from "../hooks";
import { ChangeEventHandler, FocusEventHandler, KeyboardEventHandler, PropsWithChildren, useEffect, useRef, useState } from "react";

export const EditColumn: React.FC<PropsWithChildren<EditColumnProps>> = ({children, type = "text", ...props }) => {

    const ref = useRef<HTMLInputElement>();

    const [editing, setEditing] = useState(false);

    useClickAway(setEditing, ref, () => {
        props.onChange?.(ref.current);
    });

    const [value, setValue] = useState(props.value);

    const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setValue(e.currentTarget.value);
    }

    useEffect(() => {
        setValue(value);
    }, [props.value]);

    const onBlur: FocusEventHandler<HTMLInputElement> = (e) => {
        setEditing(false);
        props.onChange?.(e.currentTarget);
    }

    const onKey: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === "Enter" || e.key === "Tab") {
            setEditing(false);
            props.onChange?.(e.currentTarget);
        }
    }

    return (
        <td onClick={() => setEditing(true)}>
            {!editing && (children ?? props.value)}
            {editing &&
                <input className="form-control" type={type} value={value} onChange={onChange} onBlur={onBlur} onKeyUp={onKey} ref={ref} autoFocus />
            }
        </td>
    );
}

EditColumn.displayName = "EditColumn";

export interface EditColumnProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    onChange?: (target?: EventTarget & HTMLInputElement) => void;
}
