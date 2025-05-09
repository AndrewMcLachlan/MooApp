import { useInnerRef } from "../hooks";

export const ClearableInput: React.FC<ClearableInputProps> = (({clearable = false, ref, ...rest}) => {
    const innerRef = useInnerRef<HTMLInputElement>(ref);

    const onClick = () => {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement!.prototype, "value")!.set!;

        nativeInputValueSetter.call(innerRef.current!, "");

        innerRef.current!.dispatchEvent(new Event("input", { bubbles: true }));
    }

    const input = <input ref={innerRef} {...rest} />;

    return clearable ? (
        <div className={clearable && "clearable clearable-input"}>
            {input}
            {clearable && <svg onClick={onClick} height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" className="clear-input"><path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path></svg>}
        </div>
    ) : input;
});

ClearableInput.displayName = "ClearableInput";

export interface ClearableInputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    clearable?: boolean;
}
