import classNames from "classnames";
import React from "react";
import { useFormGroup } from "./FormGroupProvider";
import { fieldErrorId, useFieldError } from "./useFieldError";

export type FeedbackComponent = React.FC<FeedbackProps>;

/**
 * The validation message for the enclosing Form.Group.
 *
 * Renders nothing while the field is valid, so it can sit in the group
 * unconditionally. Children, if given, replace the resolver's wording while
 * still only appearing when the field is actually in error.
 */
export const Feedback: FeedbackComponent = ({ className, children, id, ...rest }) => {

    const group = useFormGroup();
    const error = useFieldError();

    if (!error) return null;

    return (
        <div
            id={id ?? (group.groupId ? fieldErrorId(group.groupId) : undefined)}
            className={classNames("invalid-feedback", className)}
            {...rest}
        >
            {children ?? error}
        </div>
    );
};

Feedback.displayName = "Feedback";

export interface FeedbackProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
}
