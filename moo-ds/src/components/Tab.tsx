import classNames from "classnames";
import React, { useState, useCallback, useMemo, useContext, createContext } from "react";
import { Nav } from "./Nav";

interface TabContextValue {
    activeKey: string;
    onSelect: (key: string) => void;
}

const TabContext = createContext<TabContextValue | undefined>(undefined);

const useTabContext = () => {
    const context = useContext(TabContext);
    if (!context) {
        throw new Error("Tab components must be used within a Tab.Container");
    }
    return context;
};

export interface TabContainerProps {
    defaultActiveKey?: string;
    activeKey?: string;
    onSelect?: (key: string) => void;
    children: React.ReactNode;
}

export interface TabContentProps extends React.HTMLAttributes<HTMLDivElement> {
}

export interface TabPaneProps extends React.HTMLAttributes<HTMLDivElement> {
    eventKey: string;
    title: React.ReactNode;
    disabled?: boolean;
}

const TabContent: React.FC<React.PropsWithChildren<TabContentProps>> = ({ className, children, ...rest }) => {
    const { activeKey } = useTabContext();

    const activePane = React.Children.toArray(children).find(
        (child) => React.isValidElement(child) && (child.props as TabPaneProps).eventKey === activeKey
    );

    return (
        <div className={classNames("tab-content", className)} {...rest}>
            {activePane}
        </div>
    );
};

TabContent.displayName = "Tab.Content";

const TabPane: React.FC<React.PropsWithChildren<TabPaneProps>> = ({ eventKey, className, children, ...rest }) => {
    const { activeKey } = useTabContext();
    const isActive = activeKey === eventKey;

    return (
        <div
            className={classNames("tab-pane", isActive && "active", className)}
            role="tabpanel"
            {...rest}
        >
            {children}
        </div>
    );
};

TabPane.displayName = "Tab.Pane";

const TabContainer: React.FC<TabContainerProps> = ({ defaultActiveKey, activeKey: controlledKey, onSelect, children }) => {
    const [uncontrolledKey, setUncontrolledKey] = useState(defaultActiveKey ?? "");

    const isControlled = controlledKey !== undefined;
    const activeKey = isControlled ? controlledKey : uncontrolledKey;

    const handleSelect = useCallback((key: string) => {
        if (!isControlled) {
            setUncontrolledKey(key);
        }
        onSelect?.(key);
    }, [isControlled, onSelect]);

    const contextValue = useMemo(() => ({ activeKey, onSelect: handleSelect }), [activeKey, handleSelect]);

    // Collect Tab.Pane children from Tab.Content to build the nav
    let panes: TabPaneProps[] = [];
    React.Children.forEach(children, (child) => {
        if (React.isValidElement(child) && (child.type as any)?.displayName === "Tab.Content") {
            React.Children.forEach(child.props.children, (paneChild) => {
                if (React.isValidElement(paneChild) && (paneChild.type as any)?.displayName === "Tab.Pane") {
                    panes.push(paneChild.props as TabPaneProps);
                }
            });
        }
    });

    return (
        <TabContext.Provider value={contextValue}>
            <Nav variant="tabs" role="tablist">
                {panes.map((pane) => (
                    <Nav.Item key={pane.eventKey}>
                        <Nav.Link
                            active={activeKey === pane.eventKey}
                            disabled={pane.disabled}
                            onClick={() => !pane.disabled && handleSelect(pane.eventKey)}
                            role="tab"
                        >
                            {pane.title}
                        </Nav.Link>
                    </Nav.Item>
                ))}
            </Nav>
            {children}
        </TabContext.Provider>
    );
};

TabContainer.displayName = "Tab.Container";

export const Tab = {
    Container: TabContainer,
    Content: TabContent,
    Pane: TabPane,
};
