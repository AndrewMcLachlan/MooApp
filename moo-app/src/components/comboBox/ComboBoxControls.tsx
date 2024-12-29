import { useComboBox } from "./ComboBoxProvider";

export const ComboBoxControls = () => {

    const { selectedItems, clear, clearable } = useComboBox();

    return (
        <div className="controls clearable">
            {clearable && selectedItems?.length > 0 && <div><svg onClick={clear} height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" className="clear-input"><path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path></svg></div>}
            <div><svg xmlns='http://www.w3.org/2000/svg' height={16} width={16} viewBox='0 0 16 16'><path fill='none' stroke='#ced4da' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='m2 5 6 6 6-6' /></svg></div>
        </div>
    );
}