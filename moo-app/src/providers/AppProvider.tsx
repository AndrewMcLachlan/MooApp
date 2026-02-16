import React, { createContext } from "react";
import { useContext } from "react";
import * as Models from "../models";

export const AppContext = createContext<Models.AppOptions | undefined>(undefined);

export const AppProvider: React.FC<React.PropsWithChildren<AppProviderProps>> = ({ name, version, copyrightYear, children }) => {

    return (
        <AppContext.Provider value={{ name, version, copyrightYear }}>
            {children}
        </AppContext.Provider>
    );
}

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useApp must be used within an AppProvider");
    }
    return context;
};

export interface AppProviderProps extends Models.AppOptions {
}

AppProvider.displayName = "AppProvider";
