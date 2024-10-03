import React, { createContext } from "react";
import { useContext } from "react";
import * as Models from "../models";

export const AppContext = createContext<Models.AppOptions | undefined>(undefined);

export const AppProvider: React.FC<React.PropsWithChildren<AppProviderProps>> = ({ name, version, children }) => {

    return (
        <AppContext.Provider value={{ name, version }}>
            {children}
        </AppContext.Provider>
    );
}

export const useApp = () => useContext(AppContext);

export interface AppProviderProps extends Pick<Models.AppOptions, "name" | "version"> {
}

AppProvider.displayName = "AppProvider";
