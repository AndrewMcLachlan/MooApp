import { Page } from "@andrewmclachlan/moo-app";
import { Form, Section, SectionForm, FormComboBox, Button, Input } from "@andrewmclachlan/moo-ds";
import { useForm, type Resolver } from "react-hook-form";
import { formsNav } from "../../nav";

interface FormSampleValues {
    group1: string;
    group2: string;
    group3: string[];
    group4: string;
    group5: string;
    group6: string;
}

interface SignupValues {
    email: string;
    password: string;
    age: string;
}

const selectItems = Array.from({ length: 10 }, (_, i) => ({ id: `${i + 1}`, text: `Option ${i + 1}` }));

// The form controls own the register call, so rules arrive through a resolver
// rather than per field. A real app would hand zod or yup to this slot; a
// plain function keeps the sample dependency-free.
const signupResolver: Resolver<SignupValues> = async (values) => {
    const errors: Record<string, { type: string; message: string }> = {};

    if (!values.email) errors.email = { type: "required", message: "Email address is required" };
    else if (!values.email.includes("@")) errors.email = { type: "pattern", message: "That doesn't look like an email address" };

    if (!values.password) errors.password = { type: "required", message: "Password is required" };
    else if (values.password.length < 8) errors.password = { type: "minLength", message: `Too short — ${8 - values.password.length} more character${8 - values.password.length === 1 ? "" : "s"} needed` };

    // Age is optional, but if it is filled in it has to be a whole number.
    // Number("abc") is NaN and every comparison against NaN is false, so a
    // range check on its own lets text through silently. Trimmed first, so
    // whitespace counts as leaving an optional field empty.
    const age = values.age?.trim();
    if (age) {
        if (!/^\d+$/.test(age)) errors.age = { type: "pattern", message: "Age must be a whole number" };
        else if (Number(age) < 18) errors.age = { type: "min", message: "Must be 18 or over" };
    }

    return Object.keys(errors).length ? { values: {}, errors: errors as never } : { values, errors: {} };
};

export const FormPage = () => {

    const existing: FormSampleValues = {
        group1: "Existing value 1",
        group2: "Existing value 2",
        group3: ["1", "2"],
        group4: "2",
        group5: "3",
        group6: "A longer, multi-line note to check the label lines up with the first line of the textarea.",
    };

    const form = useForm<FormSampleValues>({ defaultValues: existing });

    // onTouched so a field reports as you leave it. A resolver validates the
    // whole object and returns every failure at once, so on the default
    // onSubmit mode the first submit lights up fields you have not reached yet.
    const signupForm = useForm<SignupValues>({
        defaultValues: { email: "", password: "", age: "" },
        resolver: signupResolver,
        mode: "onTouched",
    });

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
                <Form.Group groupId="group6">
                    <Form.Label>Notes (textarea)</Form.Label>
                    <Form.TextArea rows={4} placeholder="Multi-line notes" />
                </Form.Group>
                <Button type="submit" variant="primary">Submit</Button>
            </SectionForm>

            <Section title="Validation" header="Validation" headerSize={4}>
                <p>
                    Fields report failures two ways, and they look the same either way. Submit the
                    form below with it empty to see the resolver&rsquo;s messages, then try the last
                    field on its own &mdash; that one is checked by the browser, with no rules and no
                    message component involved.
                </p>
            </Section>

            <SectionForm header="Resolver validation" headerSize={5} form={signupForm} onSubmit={(data) => { console.log(data); }}>
                <p>
                    <code>Form.Feedback</code> shows the message for its group and nothing at all
                    while the field is valid, so it can sit in the group permanently. The control it
                    describes is marked <code>aria-invalid</code>, which is what turns the border and
                    label red &mdash; a resolver rule never reaches the browser&rsquo;s own validity
                    state, so the styling cannot rely on that.
                </p>
                <p>
                    Fields here report as you leave them. A resolver checks the whole object and
                    returns every failure at once, so submitting flags each field still outstanding
                    rather than only the one you were editing.
                </p>
                <p>
                    Age shows why a rule can be worth writing even for something a native
                    constraint looks capable of: it is optional, so it only complains once you put
                    something in it, and it tells you whether the problem is the format or the
                    number. Give <code>Form.Feedback</code> children to replace the wording, which
                    suits a field with a single rule rather than one like this that has more than
                    one thing to say.
                </p>
                <Form.Group groupId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Input placeholder="you@example.com" />
                    <Form.Feedback />
                </Form.Group>
                <Form.Group groupId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Input type="password" placeholder="At least 8 characters" />
                    <Form.Feedback />
                </Form.Group>
                <Form.Group groupId="age">
                    <Form.Label>Age (optional)</Form.Label>
                    <Form.Input inputMode="numeric" placeholder="18" />
                    <Form.Feedback />
                </Form.Group>
                <Button type="submit" variant="primary">Create account</Button>
            </SectionForm>

            <Section title="Native validation" header="Native constraints" headerSize={5}>
                <p>
                    A control with its own constraint needs no wiring: the styling matches
                    <code> :user-invalid</code>, so the field stays neutral until you have actually
                    interacted with it rather than going red the moment the page loads. Type
                    something that isn&rsquo;t an email address and tab away.
                </p>
                <div className="demo-col">
                    <Input type="email" placeholder="Native email constraint" />
                    <Input required placeholder="Native required constraint" />
                </div>
            </Section>

        </Page>
    );
}
