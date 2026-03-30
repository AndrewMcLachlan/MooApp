import React, { type PropsWithChildren } from "react";

import { Page, type PageProps } from "../layout/Page";
import classNames from "classnames";

export const Dashboard: React.FC<PropsWithChildren<DashboardProps>> = ({className, children, ...rest}) => (
    <Page className={classNames("dashboard", className)} {...rest}>
        <div className="dashboard-grid">
            {children}
        </div>
    </Page>
);

export interface DashboardProps extends PageProps {
}
