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

export const useApp = () => useContext(AppContext);

export interface AppProviderProps extends Models.AppOptions {
}

AppProvider.displayName = "AppProvider";
