/**
 * External Dependencies
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Col, Row, Label, Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";
import Icon from '../icon';
import agregar from '../../../common-assets/images/vcm/plus-circle.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import './style.scss';

/**
 * Component
 */
class TercerPaso extends Component {
    constructor( props ) {
        super( props );

        // Set the intiial input values
        this.state = {
            modal1: false,
            mensajeAviso: '',
            inputAdjunto: '',
            adjuntos: [],
            enviado: false,
        };

        this.renderAdjuntos = this.renderAdjuntos.bind( this );
        this.removerAdjunto = this.removerAdjunto.bind( this );
        this.agregarAdjunto = this.agregarAdjunto.bind( this );
        this.guardarEnLocal = this.guardarEnLocal.bind( this );
        this.openModal = this.openModal.bind( this );
        this.closeModal = this.closeModal.bind( this );
    }

    componentDidMount() {
        // this.props.datos
        this.setState( {
            adjuntos: this.props.datos.adjuntos.slice(),
        } );
    }

    guardarEnLocal() {
        if ( this.state.adjuntos.length <= 0 ) {
            const data = {
                adjuntos: this.state.adjuntos,
                paso3: false,
            };

            this.props.actualizarFormulario( data );
        } else {
            const data = {
                adjuntos: this.state.adjuntos,
                paso3: true,
            };

            this.props.actualizarFormulario( data );
        }
    }

    agregarAdjunto() {
        let estaRepetida = false;

        const adjuntoTmp = this.state.inputAdjunto.toLowerCase();

        const consegui = this.state.adjuntos.find( ( preg ) => {
            return preg.pregunta.toLowerCase() === adjuntoTmp;
        } );
        if ( consegui ) {
            estaRepetida = true;
        }

        if ( ! estaRepetida ) {
            if ( this.state.inputAdjunto.length > 0 ) {
                const final = this.state.adjuntos.slice();
                const nuevo = {
                    id: Math.ceil( Math.random() * ( ( 9999 - 1 ) + 1 ) ),
                    pregunta: this.state.inputAdjunto,
                };
                final.push( nuevo );
                this.setState( {
                    adjuntos: final,
                    inputAdjunto: '',
                }, () => {
                    this.guardarEnLocal();
                } );
            }
        } else {
            this.setState( {
                mensajeAviso: "El nombre del adjunto no debe repetirse",
            }, () => {
                this.openModal( 1 );
            } );
        }
    }

    renderAdjuntos() {
        const paraMapear = this.state.adjuntos.slice();
        const renderizado = paraMapear.map( ( adj ) => {
            return (
                <div key={ adj.id } className="div-requisitos">
                    <p> { adj.pregunta } </p>
                    <button
                        className="btn btn-add-permiso justify-content-center"
                        onClick={ () => {
                            this.removerAdjunto( adj.id );
                        } }>
                        <FontAwesomeIcon icon={ faTrashAlt } />
                    </button>
                </div>
            );
        } );

        return renderizado;
    }

    removerAdjunto( id ) {
        let clon = this.state.adjuntos.slice();

        clon = clon.filter( ( adj ) => {
            return adj.id !== id;
        } );

        this.setState( {
            adjuntos: clon,
        }, () => {
            this.guardarEnLocal();
        } );
    }

    openModal( number ) {
        switch ( number ) {
        case 1:
            this.setState( { modal1: true } );
            break;
        case 2:
            this.setState( { modal2: true } );
            break;
        default:
            break;
        }
    }

    closeModal( number ) {
        switch ( number ) {
        case 1:
            this.setState( { modal1: false } );
            break;
        case 2:
            this.setState( { modal2: false } );
            break;
        default:
            break;
        }
    }

    render() {
        if ( this.props.currentStep !== 3 ) {
            return null;
        }
        const {
            inputAdjunto,
        } = this.state;

        let adjuntos = null;

        if ( this.state.adjuntos.length > 0 ) {
            adjuntos = this.renderAdjuntos();
        }

        return (
            <Fragment>

                <Modal isOpen={ this.state.modal1 } toggle={ () => { 
                    this.closeModal( 2 );
                } }>
                    <ModalHeader
                        toggle={ () => { 
                            this.closeModal( 1 );
                        } }>Aviso</ModalHeader>
                    <ModalBody>
                        <Row className="vertical-gap d-flex justify-content-center">
                            <Col lg="10" className="justify-content-center text-centered">
                                <div className="icon-container">
                                    <Icon name="dizzy" />
                                </div>
                                <h2>{ this.state.mensajeAviso }</h2>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button className="btn-feelrouk-naranja" onClick={ () => this.closeModal( 1 ) }>Cerrar</Button>
                    </ModalFooter>
                </Modal>

                <h2 className="mt-30">Editar adjuntos para el postulante</h2>
                <Row>
                    <Col lg="6" sm="12">
                        <Row>
                            <Col lg="12">
                                <Label>Adjuntos necesarios</Label>
                                <div className="d-flex">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nuevoBeneficio"
                                        placeholder="CV, Certificados, etc"
                                        value={ inputAdjunto }
                                        onChange={ ( e ) => {
                                            const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡_|+\-=?;:'"<>\{\}\[\]\\\/]/gi, '' );
                                            this.setState( {
                                                inputAdjunto: nuevo,
                                            } );
                                        } }
                                    />
                                    <button
                                        className="btn btn-permiso justify-content-center"
                                        onClick={ ( e ) => {
                                            e.preventDefault();
                                            this.agregarAdjunto();
                                        } }>
                                        <img alt="agregar" src={ agregar } />
                                    </button>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col lg="6" sm="12" xs="12">
                        <div className="mt-30"></div>
                        { adjuntos }
                    </Col>
                </Row>
            </Fragment>
        );
    }
}

export default connect( ( { settings } ) => (
    {
        settings,
    }
) )( TercerPaso );
