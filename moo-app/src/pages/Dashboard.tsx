import React, { PropsWithChildren } from "react";

import { Page, PageProps } from "../layout/Page";
import { Row } from "react-bootstrap";
import classNames from "classnames";

export const Dashboard: React.FC<PropsWithChildren<DashboardProps>> = ({className, children, ...rest}) => (
    <Page className={classNames("dashboard", className)} {...rest}>
        <Row>
            {children}
        </Row>
    </Page>
);

export interface DashboardProps extends PageProps {
}
