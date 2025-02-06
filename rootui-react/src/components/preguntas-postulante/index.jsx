/**
 * External Dependencies
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Label, FormGroup, Input } from "reactstrap";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlusSquare, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import './style.scss';

/**
 * Component
 */
class PreguntasPostulante extends Component {
    constructor( props ) {
        super( props );

        // Set the initial input values
        this.state = {
            pregunta: this.props.pregunta,
            respuestas: this.props.respuestas,
            respuestaTemp: '',
        };

        this.renderRespuestas = this.renderRespuestas.bind( this );
    }

    renderRespuestas() {
        let respuestas = null;

        if ( this.props.pregunta.tipo === "simple" && this.props.pregunta.respuestas.length > 0 ) {
            // renderizamos los radio buttons
            const resps = this.props.respuestas.map( ( resp ) => {
                return (
                    <div className="respuesta" key={ resp.id }>
                        <FormGroup className="respuesta" check>
                            <Input
                                name="respuesta"
                                type="radio"
                                disabled={ true }
                                onChange={ ( e ) => {
                                    this.props.marcarCorrecta( this.props.pregunta.id, resp.id, e.target.checked );
                                } }
                            />
                            { ' ' }
                            <Label check>
                                { resp.respuesta }
                            </Label>
                        </FormGroup>
                    </div>
                );
            } );

            respuestas = <Fragment> { resps } </Fragment>;
        } else if ( this.props.pregunta.tipo === "multiple" && this.props.pregunta.respuestas.length > 0 ) {
            // renderizamos los checks
            const resps = this.props.respuestas.map( ( resp ) => {
                return (
                    <div key={ resp.id }>
                        <FormGroup className="respuesta" check>
                            <Input
                                id={ resp.id }
                                type="checkbox"
                                disabled={ true }
                                onChange={ ( e ) => {
                                    this.props.marcarCorrecta( this.props.pregunta.id, resp.id, e.target.checked );
                                } }
                            />
                            { ' ' }
                            <Label className="ml-10" check>
                                { resp.respuesta }
                            </Label>
                        </FormGroup>
                    </div>
                );
            } );

            respuestas = <Fragment> { resps } </Fragment>;
        } else if ( this.props.pregunta.tipo === "abierta" ) {
            respuestas = 
                <div className="form-group">
                    <textarea
                        className="textarea-hcm"
                        name="correo"
                        disabled={ true }
                        onChange={ ( e ) => {
                            // en este caso solamente enviamos el id de la pregunta ABIERTA, y la respuesta
                            this.props.marcarCorrecta( this.props.pregunta.id, null, e.target.value );
                        } } />
                </div>;
        }

        return (
            <Row className="mt-10 justify-content-center">
                <Col lg="12" sm="12" xs="12">
                    { respuestas }
                </Col>
            </Row>
        );
    }

    render() {
        let respuestas = null;
        let pregunta = null;

        if ( this.props.pregunta.tipo !== "adjunto" ) {
            respuestas = this.renderRespuestas();

            pregunta = (
                <div className="d-flex">
                    <input
                        type="text"
                        className="form-control"
                        id="nuevoBeneficio"
                        value={ this.props.pregunta.pregunta }
                        disabled
                    />
                </div>
            );
        } else {
            pregunta = (
                <div className="div-requisitos">
                    <p> { this.props.pregunta.pregunta } </p>
                </div>
            );
        }

        return (
            <div className="container-respuestas">
                <Col lg="12" xs="12">
                    { pregunta }
                </Col>
                <Col className="mt-15 justify-content-center" lg="12" xs="12">
                    { respuestas }
                </Col>
            </div>
        );
    }
}

export default connect( ( { settings } ) => (
    {
        settings,
    }
) )( PreguntasPostulante );
