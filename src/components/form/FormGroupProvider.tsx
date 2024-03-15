import React, { useContext } from "react";

const FormGroupContext = React.createContext<FormGroupContextProps>({ groupId: undefined });

export const useFormGroup = () => useContext(FormGroupContext);

export const FromGroupProvider: React.FC<React.PropsWithChildren<FormGroupContextProps>> = ({ groupId, children }) => (
    <FormGroupContext.Provider value={{ groupId }}>
        {children}
    </FormGroupContext.Provider>
)

interface FormGroupContextProps {
    groupId?: string;
}
