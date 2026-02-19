import classNames from "classnames";
import React, { useState, useCallback, useMemo, useContext, createContext } from "react";
import { Icon } from "./Icon";
import { Nav } from "./Nav";
import type { IconType } from "../types";

interface TabContextValue {
    activeKey: string;
    onSelect: (key: string) => void;
}

const TabContext = createContext<TabContextValue | undefined>(undefined);

const useTabContext = () => {
    const context = useContext(TabContext);
    if (!context) {
        throw new Error("Tab must be used within Tabs");
    }
    return context;
};

export interface TabsProps {
    defaultActiveKey?: string;
    activeKey?: string;
    onSelect?: (key: string) => void;
    children: React.ReactNode;
}

export interface TabProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
    eventKey: string;
    title: React.ReactNode;
    icon?: IconType;
    disabled?: boolean;
}

export const Tab: React.FC<React.PropsWithChildren<TabProps>> = ({ eventKey, title: _title, icon: _icon, disabled: _disabled, className, children, ...rest }) => {
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

Tab.displayName = "Tab";

export const Tabs: React.FC<TabsProps> = ({ defaultActiveKey, activeKey: controlledKey, onSelect, children }) => {

    // Collect Tab children to build the nav
    const tabs: TabProps[] = [];
    React.Children.forEach(children, (child) => {
        if (React.isValidElement<TabProps>(child) && (child.type as any)?.displayName === "Tab") {
            tabs.push(child.props);
        }
    });

    // Default to first non-disabled tab when no key is provided
    const defaultKey = defaultActiveKey ?? tabs.find(t => !t.disabled)?.eventKey ?? "";

    const [uncontrolledKey, setUncontrolledKey] = useState(defaultKey);

    const isControlled = controlledKey !== undefined;
    const activeKey = isControlled ? controlledKey : uncontrolledKey;

    const handleSelect = useCallback((key: string) => {
        if (!isControlled) {
            setUncontrolledKey(key);
        }
        onSelect?.(key);
    }, [isControlled, onSelect]);

    const contextValue = useMemo(() => ({ activeKey, onSelect: handleSelect }), [activeKey, handleSelect]);

    const activePane = React.Children.toArray(children).find(
        (child) => React.isValidElement<TabProps>(child) && child.props.eventKey === activeKey
    );

    return (
        <TabContext.Provider value={contextValue}>
            <Nav variant="tabs" role="tablist">
                {tabs.map((tab) => (
                    <Nav.Item key={tab.eventKey}>
                        <Nav.Link
                            active={activeKey === tab.eventKey}
                            disabled={tab.disabled}
                            onClick={() => !tab.disabled && handleSelect(tab.eventKey)}
                            role="tab"
                        >
                            {tab.icon && <Icon icon={tab.icon} />}{tab.title}
                        </Nav.Link>
                    </Nav.Item>
                ))}
            </Nav>
            <div className="tab-content">
                {activePane}
            </div>
        </TabContext.Provider>
    );
};

Tabs.displayName = "Tabs";
