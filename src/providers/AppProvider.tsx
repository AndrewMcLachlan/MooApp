import React, { createContext } from "react";
import { useContext } from "react";
import * as Models from "../models";

export const AppContext = createContext<Models.AppOptions>({ name: ""});

export const AppProvider: React.FC<React.PropsWithChildren<AppProviderProps>> = ({ name, children }) => {

    return (
        <AppContext.Provider value={{ name }}>
            {children}
        </AppContext.Provider>
    );
}

export const useApp = () => useContext(AppContext);

export interface AppProviderProps extends Models.AppOptions {
}

AppProvider.displayName = "AppProvider";
