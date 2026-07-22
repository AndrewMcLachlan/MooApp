import React from "react";

import { useClickAway } from "../hooks";
import { type ChangeEventHandler, type FocusEventHandler, type KeyboardEventHandler, type PropsWithChildren, useEffect, useRef, useState } from "react";

export const EditColumn: React.FC<PropsWithChildren<EditColumnProps>> = ({children, className, type = "text", value, onChange, onBlur: onBlurProp, onKeyUp: onKeyUpProp, ...props }) => {

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

    // Caller handlers are composed, not replaced: edit tracking always runs,
    // then the caller's handler (if any) still observes the event.
    const onBlur: FocusEventHandler<HTMLInputElement> = (e) => {
        setEditing(false);
        onChange?.(e.currentTarget);
        onBlurProp?.(e);
    }

    const onKey: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === "Enter" || e.key === "Tab") {
            setEditing(false);
            onChange?.(e.currentTarget);
        }
        onKeyUpProp?.(e);
    }

    return (
        <td onClick={() => setEditing(true)} className={className}>
            {!editing && (children ?? value)}
            {editing &&
                // Remaining input attributes (step, min, max, placeholder, maxLength, ...) are
                // forwarded, but spread first so the component's own wiring always wins. Caller
                // onBlur/onKeyUp are composed into the handlers above rather than spread here.
                <input {...props} className="form-control" type={type} value={editValue} onChange={onInputChange} onBlur={onBlur} onKeyUp={onKey} ref={ref} autoFocus />
            }
        </td>
    );
}

EditColumn.displayName = "EditColumn";

export interface EditColumnProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    onChange?: (target?: EventTarget & HTMLInputElement) => void;
}
