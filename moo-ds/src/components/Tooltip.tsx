import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PropsWithChildren, useId } from "react";

export const Tooltip: React.FC<PropsWithChildren<{ id: string }>> = ({ id, children }) => {
    const uniqueId = useId();
    const tooltipId = `tooltip-${id || uniqueId}`;

    return (
        <span className="tooltip-wrapper">
            <span className="tooltip-icon" aria-describedby={tooltipId}>
                <FontAwesomeIcon icon="info-circle" size="1x" />
            </span>
            <span className="tooltip-content" id={tooltipId} data-placement="top" role="tooltip">
                {children}
            </span>
        </span>
    );
};

Tooltip.displayName = "Tooltip";
