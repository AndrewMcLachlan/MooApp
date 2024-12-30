import { useComboBox } from "./ComboBoxProvider";

export const ComboBoxSingleSelectedItem: React.FC = () => {

    const { selectedItems, text, labelField } = useComboBox();

    if (text) return null;
    if (!selectedItems || selectedItems.length === 0) return null;

    return (
        <div className="single-item">
            <span>{labelField(selectedItems[0])}</span>
        </div>
    );

};