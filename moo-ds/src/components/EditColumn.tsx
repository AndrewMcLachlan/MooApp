import React from "react";

import { useClickAway } from "../hooks";
import { type ChangeEventHandler, type FocusEventHandler, type KeyboardEventHandler, type PropsWithChildren, useEffect, useRef, useState } from "react";

export const EditColumn: React.FC<PropsWithChildren<EditColumnProps>> = ({children, className, type = "text", value, onChange, ...props }) => {

    const ref = useRef<HTMLInputElement>(undefined);

    const [editing, setEditing] = useState(false);

    useClickAway(setEditing, ref, () => {
        onChange?.(ref.current);
    });

    const [editValue, setEditValue] = useState(value);

    const onInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setEditValue(e.currentTarget.value);
    }

    useEffect(() => {
        setEditValue(value);
    }, [value]);

    const onBlur: FocusEventHandler<HTMLInputElement> = (e) => {
        setEditing(false);
        onChange?.(e.currentTarget);
    }

    const onKey: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === "Enter" || e.key === "Tab") {
            setEditing(false);
            onChange?.(e.currentTarget);
        }
    }

    return (
        <td onClick={() => setEditing(true)} className={className}>
            {!editing && (children ?? value)}
            {editing &&
                // Remaining input attributes (step, min, max, placeholder, maxLength, ...) are
                // forwarded, but spread first so the component's own wiring always wins -- a caller
                // passing onBlur/onKeyUp/ref must not be able to silently break edit tracking.
                <input {...props} className="form-control" type={type} value={editValue} onChange={onInputChange} onBlur={onBlur} onKeyUp={onKey} ref={ref} autoFocus />
            }
        </td>
    );
}

EditColumn.displayName = "EditColumn";

export interface EditColumnProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    onChange?: (target?: EventTarget & HTMLInputElement) => void;
}
