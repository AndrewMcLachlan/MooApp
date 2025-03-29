import { Page, Form, SectionForm, FormComboBox } from "@andrewmclachlan/mooapp"
import { useState } from "react";

export const FormSample = () => {

    const selectItems = [
        { id: "1", text: "Option 1" },
        { id: "2", text: "Option 2" },
        { id: "3", text: "Option 3" },
        { id: "4", text: "Option 4" },
        { id: "5", text: "Option 5" },
        { id: "6", text: "Option 6" },
        { id: "7", text: "Option 7" },
        { id: "8", text: "Option 8" },
        { id: "9", text: "Option 9" },
        { id: "10", text: "Option 10" },
    ];

    const [value, setValue] = useState<string | undefined>(undefined);

    return (
        <Page title="Form Sample" className="form-sample-page">
            <div>
                <h2>Form Sample</h2>

                <SectionForm onSubmit={() => { }}>
                    <Form.Group groupId="group1">
                        <Form.Label htmlFor="input1">Input 1</Form.Label>
                        <Form.Input id="input1" name="input1" placeholder="Input 1" required />
                    </Form.Group>
                    <Form.Group groupId="group2">
                        <Form.Label htmlFor="input2">Input 2</Form.Label>
                        <Form.Input id="input2" name="input2" placeholder="Input 2" required />
                    </Form.Group>
                    <Form.Group groupId="group3">
                        <Form.Label htmlFor="input3">Input 3</Form.Label>
                        <FormComboBox<{ id: string, text: string }> items={selectItems} labelField={i => i.text} valueField={i => i.id} selectedItems={[]} />
                    </Form.Group>
                    <Form.Group groupId="group4">
                        <Form.Label htmlFor="input4">Input 4</Form.Label>
                        <Form.Select id="input4" name="input4" required>
                            <option value="">Select an option</option>
                            <option value="1">Option 1</option>
                            <option value="2">Option 2</option>
                            <option value="3">Option 3</option>
                            <option value="4">Option 4</option>
                        </Form.Select>
                        </Form.Group>
                </SectionForm>
            </div>
        </Page>
    );
}
