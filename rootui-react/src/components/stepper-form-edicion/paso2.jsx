/**
 * External Dependencies
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Col, Row, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Label, 
    Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";
import Icon from '../icon';
import agregar from '../../../common-assets/images/vcm/plus-circle.svg';
import Preguntas from '../preguntas';

import './style.scss';

/**
 * Component
 */
class SegundoPaso extends Component {
    constructor( props ) {
        super( props );

        // Set the intiial input values
        this.state = {
            modal1: false,
            mensajeAviso: '',
            dropdownOpen: false,
            dropdownOpen2: false,
            tipoPregunta: null,
            preguntaTemp: '',
            preguntas: [],
            enviado: false,
        };
        this.toggle = this.toggle.bind( this );
        this.agregarPregunta = this.agregarPregunta.bind( this );
        this.eliminarPregunta = this.eliminarPregunta.bind( this );
        this.crearRespuesta = this.crearRespuesta.bind( this );
        this.eliminarRespuesta = this.eliminarRespuesta.bind( this );
        this.guardarEnLocal = this.guardarEnLocal.bind( this );
        this.marcarRespuestaCorrecta = this.marcarRespuestaCorrecta.bind( this );
        this.marcarRequerida = this.marcarRequerida.bind( this );

        this.openModal = this.openModal.bind( this );
        this.closeModal = this.closeModal.bind( this );
    }

    componentDidMount() {
        // this.props.datos
        this.setState( {
            preguntas: this.props.datos.preguntas.slice(),
        } );
    }

    guardarEnLocal() {
        if ( this.state.preguntas.length <= 0 ) {
            const data = {
                preguntas: this.state.preguntas,
                paso2: false,
            };

            this.props.actualizarFormulario( data );
        } else {
            let noCumpleLasDosRespuestas = true;

            this.state.preguntas.forEach( ( pregunta ) => {
                if ( pregunta.tipo !== "abierta" && pregunta.respuestas.length < 2 ) {
                    noCumpleLasDosRespuestas = false;
                }
            } );

            if ( ! noCumpleLasDosRespuestas ) {
                const data = {
                    preguntas: this.state.preguntas,
                    paso2: false,
                };

                this.props.actualizarFormulario( data );
            } else {
                const data = {
                    preguntas: this.state.preguntas,
                    paso2: true,
                };

                this.props.actualizarFormulario( data );
            }
        }
    }

    toggle( number ) {
        let state = null;
        switch ( number ) {
        case 1:
            state = ! this.state.dropdownOpen;
            this.setState( { dropdownOpen: state } );
            break;
        case 2:
            state = ! this.state.dropdownOpen2;
            this.setState( { dropdownOpen2: state } );
            break;
        case 3:
            state = ! this.state.dropdownOpen3;
            this.setState( { dropdownOpen3: state } );
            break;
        default:
            break;
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

    agregarPregunta() {
        let estaRepetida = false;

        const preguntaTmp = this.state.preguntaTemp.toLowerCase();

        const consegui = this.state.preguntas.find( ( preg ) => {
            return preg.pregunta.toLowerCase() === preguntaTmp;
        } );
        if ( consegui ) {
            estaRepetida = true;
        }

        if ( ! estaRepetida ) {
            if ( this.state.preguntaTemp.length > 0 ) {
                if ( this.state.tipoPregunta === 'simple' ) {
                    // simple
                    const nuevaSimple = {
                        id: Math.ceil( Math.random() * ( ( 9999 - 1 ) + 1 ) ),
                        tipo: 'simple',
                        pregunta: this.state.preguntaTemp,
                        requerida: false,
                        respuestas: [],
                    };

                    const temp = this.state.preguntas.slice();
                    temp.push( nuevaSimple );

                    this.setState( {
                        preguntas: temp,
                        preguntaTemp: '',
                    }, () => {
                        this.guardarEnLocal();
                    } );
                } else if ( this.state.tipoPregunta === 'multiple' ) {
                    // multiple
                    const nuevaMultiple = {
                        id: Math.ceil( Math.random() * ( ( 9999 - 1 ) + 1 ) ),
                        tipo: 'multiple',
                        pregunta: this.state.preguntaTemp,
                        requerida: false,
                        respuestas: [],
                    };

                    const temp = this.state.preguntas.slice();
                    temp.push( nuevaMultiple );

                    this.setState( {
                        preguntas: temp,
                        preguntaTemp: '',
                    }, () => {
                        this.guardarEnLocal();
                    } );
                } else if ( this.state.tipoPregunta === 'abierta' ) {
                    // abierta
                    const nuevaAbierta = {
                        id: Math.ceil( Math.random() * ( ( 9999 - 1 ) + 1 ) ),
                        tipo: 'abierta',
                        pregunta: this.state.preguntaTemp,
                        respuestas: false,
                        requerida: false,
                    };

                    const temp = this.state.preguntas.slice();
                    temp.push( nuevaAbierta );

                    this.setState( {
                        preguntas: temp,
                        preguntaTemp: '',
                    }, () => {
                        this.guardarEnLocal();
                    } );
                }
            }
        } else {
            this.setState( {
                mensajeAviso: "La pregunta no debe repetirse",
            }, () => {
                this.openModal( 1 );
            } );
        }
    }

    eliminarPregunta( id ) {
        const temp = this.state.preguntas.filter( ( preg ) => {
            return preg.id !== id;
        } );

        this.setState( {
            preguntas: temp,
        }, () => {
            this.guardarEnLocal();
        } );
    }

    crearRespuesta( id, respuesta ) {
        const nuevaRespuesta = {
            id: Math.ceil( Math.random() * ( ( 99999 - 1 ) + 1 ) ),
            respuesta: respuesta,
            correcta: false,
        };

        const temp = this.state.preguntas.slice();
        temp.forEach( ( preg ) => {
            if ( preg.id === id ) {
                preg.respuestas.push( nuevaRespuesta );
            }
        } );

        this.setState( {
            preguntas: temp,
        }, () => {
            this.guardarEnLocal();
        } );
    }

    eliminarRespuesta( idPregunta, idRespuesta ) {
        // clonamos el array con otras las preguntas
        const temp = this.state.preguntas.slice();

        temp.forEach( ( pregunta ) => {
            if ( pregunta.id === idPregunta ) {
                pregunta.respuestas = pregunta.respuestas.filter( ( res ) => {
                    return res.id !== idRespuesta;
                } );
            }
        } );

        this.setState( {
            preguntas: temp,
        }, () => {
            this.guardarEnLocal();
        } );
    }

    marcarRespuestaCorrecta( respuestaId, checked ) {
        const tempArr = this.state.preguntas.slice();

        tempArr.forEach( ( preg ) => {
            if ( preg.respuestas.length > 0 ) {
                preg.respuestas.forEach( ( resp ) => {
                    if ( resp.id === respuestaId ) {
                        resp.correcta = checked;
                    } else if ( resp.id !== respuestaId && preg.tipo === "simple" ) {
                        resp.correcta = false;
                    }
                } );
            }
        } );

        this.setState( {
            preguntas: tempArr,
        } );
    }

    marcarRequerida( preguntaID, checked ) {
        const arrTemp = this.state.preguntas.slice();

        arrTemp.forEach( ( pregunta ) => {
            if ( pregunta.id === preguntaID ) {
                pregunta.requerida = checked;
            }
        } );

        this.setState( {
            preguntas: arrTemp,
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
        if ( this.props.currentStep !== 2 ) {
            return null;
        }
        const {
            preguntaTemp,
        } = this.state;

        let preguntas = null;

        if ( this.state.preguntas.length > 0 ) {
            preguntas = this.state.preguntas.map( ( pregunta ) => {
                if ( ! pregunta.respuestas ) {
                    pregunta.respuestas = [];
                }
                return (
                    <Preguntas key={ pregunta.id }
                        pregunta={ pregunta } 
                        respuestas={ pregunta.respuestas }
                        eliminarPregunta={ this.eliminarPregunta }
                        agregarRespuesta={ this.crearRespuesta }
                        eliminarRespuesta={ this.eliminarRespuesta }
                        marcarCorrecta={ this.marcarRespuestaCorrecta }
                        preguntaRequerida={ this.marcarRequerida } />
                );
            } );
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

                <h2 className="mt-30">Editar preguntas para postulantes</h2>
                <Row>
                    <Col lg="6">
                        <Row>
                            <Col lg="4">
                                <div className="form-group">
                                    <Label for="empresas">Seleccione tipo de pregunta *</Label>
                                    <Dropdown name="empresas" className="formulario-hcm-dropdown" isOpen={ this.state.dropdownOpen } toggle={ () => this.toggle( 1 ) }>
                                        <DropdownToggle caret>
                                            { this.state.tipoPregunta ? this.state.tipoPregunta : "Seleccionar" }
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem onClick={ () => {
                                                this.setState( {
                                                    tipoPregunta: 'simple',
                                                } );
                                            } }>Simple</DropdownItem>
                                            <DropdownItem onClick={ () => {
                                                this.setState( {
                                                    tipoPregunta: 'multiple',
                                                } );
                                            } }>Múltiple</DropdownItem>
                                            <DropdownItem onClick={ () => {
                                                this.setState( {
                                                    tipoPregunta: 'abierta',
                                                } );
                                            } }>Abierta</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>
                            </Col>
                            <Col lg="8">
                                <Label>Escriba la pregunta *</Label>
                                <div className="d-flex">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nuevoBeneficio"
                                        placeholder="¿Tiene auto propio?"
                                        value={ preguntaTemp }
                                        onChange={ ( e ) => {
                                            const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¡_|+\-=;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                            this.setState( {
                                                preguntaTemp: nuevo,
                                            } );
                                        } }
                                    />
                                    <button
                                        className="btn btn-permiso justify-content-center"
                                        onClick={ ( e ) => {
                                            e.preventDefault();
                                            this.agregarPregunta();
                                        } }>
                                        <img alt="agregar" src={ agregar } />
                                    </button>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col lg="6" sm="12" xs="12">
                        <div className="mt-20"></div>
                        { preguntas }
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
) )( SegundoPaso );
