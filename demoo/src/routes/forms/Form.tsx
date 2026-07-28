import { Page } from "@andrewmclachlan/moo-app";
import { Form, SectionForm, FormComboBox, Button } from "@andrewmclachlan/moo-ds";
import { useForm } from "react-hook-form";
import { formsNav } from "../../nav";

interface FormSampleValues {
    group1: string;
    group2: string;
    group3: string[];
    group4: string;
    group5: string;
}

const selectItems = Array.from({ length: 10 }, (_, i) => ({ id: `${i + 1}`, text: `Option ${i + 1}` }));

export const FormPage = () => {

    const existing: FormSampleValues = {
        group1: "Existing value 1",
        group2: "Existing value 2",
        group3: ["1", "2"],
        group4: "2",
        group5: "3",
    };

    const form = useForm<FormSampleValues>({ defaultValues: existing });

    return (
        <Page title="Form" breadcrumbs={[{ route: "/forms/form", text: "Forms" }, { route: "/forms/form", text: "Form" }]} navItems={formsNav} className="form-sample-page">

            <SectionForm header="Form" headerSize={4} form={form} onSubmit={(data) => { console.log(data); }}>
                <p>
                    <code>Form</code> wires <a href="https://react-hook-form.com">react-hook-form</a> to
                    the design system&rsquo;s inputs. Groups pair a label with a control; text inputs,
                    a native select, and both single- and multi-select <code>FormComboBox</code>es all
                    bind to the same form state. Submit logs the values to the console.
                </p>
                <Form.Group groupId="group1">
                    <Form.Label>Input 1</Form.Label>
                    <Form.Input placeholder="Input 1" required clearable />
                </Form.Group>
                <Form.Group groupId="group2">
                    <Form.Label>Input 2</Form.Label>
                    <Form.Input placeholder="Input 2" />
                </Form.Group>
                <Form.Group groupId="group3">
                    <Form.Label>Input 3 (multi-select)</Form.Label>
                    <FormComboBox<{ id: string, text: string }> items={selectItems} multiSelect labelField={i => i.text} valueField={i => i.id} clearable />
                </Form.Group>
                <Form.Group groupId="group4">
                    <Form.Label>Input 4 (native select)</Form.Label>
                    <Form.Select>
                        <option value="">Select an option</option>
                        {selectItems.map((item) => (
                            <option key={item.id} value={item.id}>{item.text}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group groupId="group5">
                    <Form.Label>Input 5 (single-select)</Form.Label>
                    <FormComboBox<{ id: string, text: string }> items={selectItems} labelField={i => i.text} valueField={i => i.id} clearable />
                </Form.Group>
                <Button type="submit" variant="primary">Submit</Button>
            </SectionForm>

        </Page>
    );
}
