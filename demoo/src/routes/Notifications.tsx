import { Page } from '@andrewmclachlan/moo-app';
import { Button, toast } from '@andrewmclachlan/moo-ds';

export const Notifications = () => {

    return (
        <Page title="Notifications" breadcrumbs={[{ route: "/notifications", text: "Notifications" }]}>
        <Button onClick={() => toast("This is a test alert")}>Show Notification</Button>
        </Page>
    )
}
