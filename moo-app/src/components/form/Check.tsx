import React from "react";
import { Input } from "./Input";

export type CheckComponent = React.FC<CheckProps>;

export const Check: CheckComponent = (props) => {

    return (
        <Input type="checkbox" {...props} />
    );
};

Check.displayName = "Check";

export interface CheckProps extends Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "type"> {
}
