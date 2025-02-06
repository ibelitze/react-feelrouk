/**
 * External Dependencies
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Label, FormGroup, Input } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import './style.scss';

/**
 * Component
 */
class Preguntas extends Component {
    constructor( props ) {
        super( props );

        // Set the intiial input values
        this.state = {
            pregunta: this.props.pregunta,
            respuestas: this.props.respuestas,
            respuestaTemp: '',
        };

        this.renderCrearRespuestas = this.renderCrearRespuestas.bind( this );
        this.enviarRespuesta = this.enviarRespuesta.bind( this );
    }

    static getDerivedStateFromProps( props, state ) {
        if ( props.respuestas.length !== state.respuestas.length ) {
            return {
                respuestas: props.respuestas,
                respuestaTemp: '',
            };
        }
        return null;
    }

    enviarRespuesta( id, checked ) {
        this.props.marcarCorrecta( id, checked );
    }

    renderCrearRespuestas() {
        let respuestas = null;
        let noEsAbierta1 = null;
        let noEsAbierta2 = null;
        const { respuestaTemp } = this.state;

        if ( this.props.pregunta.tipo !== "abierta" ) {
            noEsAbierta2 = <div className="d-flex width-max">
                <input
                    type="text"
                    className="form-control"
                    id="nuevaRespuesta"
                    value={ respuestaTemp }
                    onChange={ ( e ) => {
                        const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()?¿¡_|\=;:'".<>\{\}\[\]\\\/]/gi, '' );
                        this.setState( {
                            respuestaTemp: nuevo,
                        } );
                    } }
                />
                <button
                    className="btn btn-add-permiso justify-content-center"
                    onClick={ ( e ) => {
                        e.preventDefault();
                        this.props.agregarRespuesta( this.props.pregunta.id, this.state.respuestaTemp );
                        this.setState( {
                            respuestaTemp: '',
                        } );
                    } }>
                    <FontAwesomeIcon icon={ faPlusSquare } />
                </button>
            </div>;
        }

        if ( this.props.pregunta.tipo === "simple" && this.props.pregunta.respuestas.length > 0 ) {
            // renderizamos los radio buttons

            noEsAbierta1 = <Row className="justify-content-center">
                <Label for="nuevaRespuesta">Respuestas mínimas: 2 *</Label>
            </Row>;

            const resps = this.props.respuestas.map( ( resp ) => {
                return (
                    <div className="respuesta" key={ resp.id }>
                        <FormGroup className="respuesta" check>
                            <Input
                                name="respuesta"
                                type="radio"
                                onChange={ ( e ) => {
                                    this.enviarRespuesta( resp.id, e.target.checked );
                                } }
                            />
                            { ' ' }
                            <Label check>
                                { resp.respuesta }
                            </Label>
                        </FormGroup>

                        <button
                            className="btn btn-respuesta-borrar justify-content-center"
                            onClick={ () => {
                                this.props.eliminarRespuesta( this.state.pregunta.id, resp.id );
                                this.setState( {
                                    respuestaTemp: '',
                                } );
                            } }>
                            <FontAwesomeIcon icon={ faTrashAlt } />
                        </button>
                    </div>
                );
            } );

            respuestas = <Fragment> { resps } </Fragment>;
        } else if ( this.props.pregunta.tipo === "multiple" && this.props.pregunta.respuestas.length > 0 ) {
            // renderizamos los checks

            noEsAbierta1 = <Row className="justify-content-center">
                <Label for="nuevaRespuesta">Respuestas mínimas: 2 *</Label>
            </Row>;

            const resps = this.props.respuestas.map( ( resp ) => {
                return (
                    <div key={ resp.id }>
                        <FormGroup className="respuesta" check>
                            <Input
                                id={ resp.id }
                                type="checkbox"
                                onChange={ ( e ) => {
                                    this.enviarRespuesta( resp.id, e.target.checked );
                                } }
                            />
                            { ' ' }
                            <Label className="ml-10" check>
                                { resp.respuesta }
                            </Label>

                            <button
                                className="btn btn-respuesta-borrar justify-content-center"
                                onClick={ ( e ) => {
                                    this.props.eliminarRespuesta( this.state.pregunta.id, resp.id, e.target.checked );
                                } }>
                                <FontAwesomeIcon icon={ faTrashAlt } />
                            </button>
                        </FormGroup>
                    </div>
                );
            } );

            respuestas = <Fragment> { resps } </Fragment>;
        }

        return (
            <Col lg="12" xs="10">
                { noEsAbierta1 }
                <Row className="justify-content-center">
                    { noEsAbierta2 }
                </Row>
                <Row className="mt-10 justify-content-center">
                    <Col lg="10" xs="12">
                        { respuestas }
                    </Col>
                </Row>
            </Col>
        );
    }

    render() {
        let respuestas = null;

        if ( this.props.pregunta.respuestas ) {
            respuestas = this.renderCrearRespuestas();
        }

        return (
            <div className="container-respuestas">
                <Col lg="12" xs="12">
                    <div className="d-flex">
                        <input
                            type="text"
                            className="form-control"
                            id="nuevoBeneficio"
                            value={ this.props.pregunta.pregunta }
                            disabled
                        />
                        <button
                            className="btn btn-del-pregunta justify-content-center"
                            onClick={ () => {
                                this.props.eliminarPregunta( this.props.pregunta.id );
                            } }>
                            <FontAwesomeIcon icon={ faTrashAlt } />
                        </button>
                    </div>
                    <div className="mt-10 pl-25 content-obligatoria">
                        <FormGroup check>
                            <Label check>
                                <Input type="checkbox" 
                                    id={ this.props.pregunta.id + '-requerido' }
                                    name="requerido"
                                    onChange={ ( e ) => {
                                        this.props.preguntaRequerida( this.props.pregunta.id, e.target.checked );
                                    } }
                                />{ ' ' }
                                Pregunta obligatoria
                            </Label>
                        </FormGroup>
                    </div>
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
) )( Preguntas );
