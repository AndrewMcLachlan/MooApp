import { Page } from '@andrewmclachlan/moo-app';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

export const Notifications = () => {

    return (
        <Page title="Notifications" breadcrumbs={[{ route: "/notifications", text: "Notifications" }]}>
        <Button onClick={() => toast("This is a test alert")}>Show Notification</Button>
        </Page>
    )
}
