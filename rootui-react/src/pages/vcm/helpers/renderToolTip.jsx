import React from "react";
import { Tooltip } from "react-bootstrap";

export const renderTooltip = ( { props, texto } ) => (
    <Tooltip id={ `tooltip-${ texto }` } { ...props }>
        { texto }
    </Tooltip>
);
