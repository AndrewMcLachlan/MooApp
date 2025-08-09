import { Page } from "@andrewmclachlan/moo-app";
import { Form, SectionForm, FormComboBox } from "@andrewmclachlan/moo-ds"
import { useState } from "react";
import { Button } from "react-bootstrap";
import { useForm } from "react-hook-form";

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

    const existing: FormSample = {
        group1: "Existing value 1",
        group2: "Existing value 2",
        group3: ["1", "2"],
        group4: "2",
        group5: "3",
    };

    const form = useForm<FormSample>({defaultValues: existing});

    return (
        <Page title="Form Sample" className="form-sample-page">
            <div>
                <h2>Form Sample</h2>

                <SectionForm form={form} onSubmit={(data) => { console.log(data); }}>
                    <Form.Group groupId="group1">
                        <Form.Label>Input 1</Form.Label>
                        <Form.Input placeholder="Input 1" required clearable />
                    </Form.Group>
                    <Form.Group groupId="group2">
                        <Form.Label>Input 2</Form.Label>
                        <Form.Input placeholder="Input 2" />
                    </Form.Group>
                    <Form.Group groupId="group3">
                        <Form.Label>Input 3</Form.Label>
                        <FormComboBox<{ id: string, text: string }> items={selectItems} multiSelect labelField={i => i.text} valueField={i => i.id} clearable />
                    </Form.Group>
                    <Form.Group groupId="group4">
                        <Form.Label>Input 4</Form.Label>
                        <Form.Select>
                            <option value="">Select an option</option>
                            {selectItems.map((item) => (
                                <option key={item.id} value={item.id}>{item.text}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group groupId="group5">
                        <Form.Label>Input 5</Form.Label>
                        <FormComboBox<{ id: string, text: string }> items={selectItems} labelField={i => i.text} valueField={i => i.id} clearable />
                    </Form.Group>
                    <Button type="submit" variant="primary">Submit</Button>
                </SectionForm>
            </div>
        </Page>
    );
}

interface FormSample {
    group1: string;
    group2: string;
    group3: string[];
    group4: string;
    group5: string;
}