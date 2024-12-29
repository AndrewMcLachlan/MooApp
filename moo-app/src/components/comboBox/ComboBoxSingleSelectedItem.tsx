import { useComboBox } from "./ComboBoxProvider";

export const ComboBoxSingleSelectedItem: React.FC = () => {

    const { selectedItems, text, labelField } = useComboBox();

    if (text) return null;

    return (
        <div className="single-item">
            <span>{labelField(selectedItems[0])}</span>
        </div>
    );

};