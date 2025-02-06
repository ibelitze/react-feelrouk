import React from 'react';
import { Col, Row } from 'reactstrap';

export const MensajeBloqueo = () => {
    return (
        <Row className="justify-content-center">
            <Col lg="5" sm="12" xs="12">
                <h2 className="mt-20">No tiene permisos para entrar en esta sección.</h2>
            </Col>
        </Row>
    );
};
