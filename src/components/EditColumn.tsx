import { useClickAway } from "../hooks";
import { ValueProps } from "../models";
import { ChangeEventHandler, FocusEventHandler, KeyboardEventHandler, useEffect, useRef, useState } from "react";

export const EditColumn: React.FC<EditColumnProps> = (props) => {

    const ref = useRef<HTMLInputElement>();

    const [editing, setEditing] = useState(false);
    
    useClickAway(setEditing, ref, () => {
        props.onChange && props.onChange(ref.current?.value ?? "");
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
        props.onChange && props.onChange(e.currentTarget.value);
    }

    const onKey: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === "Enter" || e.key === "Tab") {
            setEditing(false);
            props.onChange && props.onChange(e.currentTarget.value);
        }
    }

    return (
        <td onClick={() => setEditing(true)}>
            {!editing && props.value}
            {editing &&
                <input className="form-control" value={value} onChange={onChange} onBlur={onBlur} onKeyUp={onKey} ref={ref} autoFocus />
            }
        </td>
    );
}

export interface EditColumnProps extends ValueProps {

}