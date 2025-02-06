/**
 * External Dependencies
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PageTitleFeelrouk from '../../components/page-title-feelrouk';
import { MensajeBloqueo } from '../no-permisos';
import { Row, Col, Button, Form, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Icon from '../icon';
import axios from 'axios';

import PrimerPaso from "./paso1";
import SegundoPaso from "./paso2";
import TercerPaso from "./paso3";
import CuartoPaso from "./paso4";
require( 'dotenv' ).config();

import BarraProgresoStepper from '../../components/barra-progreso';

import './style.scss';

/**
 * Component
 */
class StepperForm extends Component {
    constructor( props ) {
        super( props );

        // Set the intiial input values
        this.state = {
            icono: false,
            loading: false,
            modal: false,
            modal2: false,
            mensajeAviso: '',
            currentStep: 1,
            nombre: '',
            empresa: '',
            cargo: '',
            tipoEmpleo: '',
            nivelPerfil: '',
            modalidadLaboral: '',
            ubicacionEmpleo: '',
            formulario1: {},
            formulario2: {},
            formulario3: {},
            paso1: false,
            paso2: false,
            paso3: false,
            enviado: false,
        };

        // Bind the submission to handleChange()
        this.handleChange = this.handleChange.bind( this );
        this.preguntarPrimero = this.preguntarPrimero.bind( this );
        this.openModal = this.openModal.bind( this );
        this.closeModal = this.closeModal.bind( this );
        this.publicarTodo = this.publicarTodo.bind( this );

        this.siguiente = this.siguiente.bind( this );
        this.anterior = this.anterior.bind( this );
        this.actualizarFormulario1 = this.actualizarFormulario1.bind( this );
        this.actualizarFormulario2 = this.actualizarFormulario2.bind( this );
        this.actualizarFormulario3 = this.actualizarFormulario3.bind( this );
    }

    // datos de la publicación
    actualizarFormulario1( data ) {
        this.setState( {
            formulario1: data,
            paso1: data.paso1,
        } );
    }

    // cuestionario / preguntas
    actualizarFormulario2( data ) {
        this.setState( {
            formulario2: data,
            paso2: data.paso2,
        } );
    }

    // adjuntos
    actualizarFormulario3( data ) {
        this.setState( {
            formulario3: data,
            paso3: data.paso3,
        } );
    }

    openModal( number ) {
        switch ( number ) {
        case 1:
            this.setState( { modal: true } );
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
            this.setState( { 
                modal: false,
            } );
            break;
        case 2:
            this.setState( { modal2: false } );
            break;
        default:
            break;
        }
    }

    // sirve para cambiar cualquier data del estado
    handleChange( event ) {
        const { name, value } = event.target;
        this.setState( {
            [ name ]: value,
        } );
    }

    // el submit final de todo el formulario
    preguntarPrimero( e ) {
        e.preventDefault();
        this.openModal( 1 );
    }

    publicarTodo() {
        this.setState( {
            loading: true,
        } );

        const data = {
            nombre: this.state.formulario1.nombre,
            empresa: this.state.formulario1.empresa.id,
            perfil: this.state.formulario1.perfil.id,
            autor: this.props.info.id,
            responsable: this.state.formulario1.responsable,
            inicio: this.state.formulario1.inicio,
            final: this.state.formulario1.final,
            localizacion: JSON.stringify( this.state.formulario1.localizacion ),
            sueldoVisible: this.state.formulario1.sueldoVisible,
            usarLogo: this.state.formulario1.usarLogo,
            compartirWeb: this.state.formulario1.compartirWeb,
            preguntas: JSON.stringify( this.state.formulario2.preguntas ),
            adjuntos: JSON.stringify( this.state.formulario3.adjuntos ),
        };

        // llamada aquí - finalmente
        axios.post( process.env.REACT_APP_DEVAPI + '/api/hcm/crearPublicacion', data ).then( ( res ) => {
            if ( res.data.ok ) {
                this.closeModal( 1 );
                this.setState( {
                    loading: false,
                    mensajeAviso: 'La publicación ha sido creada satisfactoriamente.',
                    icono: true,
                    currentStep: 1,
                    formulario1: {},
                    formulario2: {},
                    formulario3: {},
                    enviado: true,
                    paso1: false,
                    paso2: false,
                }, () => {
                    this.openModal( 2 );
                } );
            }
        } ).catch( ( e ) => {
            console.log( e );
            this.closeModal( 1 );
            this.setState( {
                loading: false,
                mensajeAviso: 'La publicación no pudo ser guardada. Contacte con el administrador.',
                icono: false,
            }, () => {
                this.openModal( 2 );
            } );
        } );
    }

    siguiente() {
        let currentStep = this.state.currentStep;

        // agregar pasos/steps al estado general
        currentStep = currentStep >= 3 ? 4 : currentStep + 1;
        this.setState( {
            currentStep: currentStep,
        } );
    }

    anterior() {
        let currentStep = this.state.currentStep;
        // Si el paso/step es 2 o 3: le restamos 1. De lo contrario no restamos nada
        currentStep = currentStep <= 1 ? 1 : currentStep - 1;
        this.setState( {
            currentStep: currentStep,
        } );
    }

    // The "next" and "previous" button functions
    get previousButton() {
        const currentStep = this.state.currentStep;

        // If the current step is not 1, then render the "previous" button
        if ( currentStep !== 1 ) {
            return (
                <Button color="btn btn-feelrouk-redondo float-left mr-10" onClick={ this.anterior }>
                    Anterior
                </Button>
            );
        }

        // ...else return nothing
        return null;
    }

    get proximo() {
        const currentStep = this.state.currentStep;
        // Si el paso donde estamos no es el 4: entonces renderiza el boton de -siguiente-
        if ( currentStep < 4 ) {
            if ( currentStep === 1 ) {
                return (
                    <Button className="btn-feelrouk-naranja2" disabled={ ! this.state.paso1 } onClick={ this.siguiente }>
                        Siguiente
                    </Button>
                );
            } else if ( currentStep === 2 ) {
                return (
                    <Button className="btn-feelrouk-naranja2" disabled={ ! this.state.paso2 } onClick={ this.siguiente }>
                        Siguiente
                    </Button>
                );
            } else if ( currentStep === 3 ) {
                return (
                    <Button className="btn-feelrouk-naranja2" disabled={ ! this.state.paso3 } onClick={ this.siguiente }>
                        Siguiente
                    </Button>
                );
            }
        }
        // ...si no: no renderizar nada
        return null;
    }

    get botonEnviar() {
        const currentStep = this.state.currentStep;

        // Si ya estamos en el paso 3: renderiza el último botón de ENVIAR
        if ( currentStep > 3 ) {
            return <Button className="btn-feelrouk-naranja2" onClick={ this.preguntarPrimero }>Enviar</Button>;
        }
        // ...si no: no renderizar nada
        return null;
    }

    render() {
        if ( this.props.info.jerarquia !== "administrador" && this.props.info.permisos.includes( 'reclutamiento' ) ) {
            return (
                <Fragment>
                    <PageTitleFeelrouk
                        breadcrumbs={ {
                            '/': 'Home',
                            '/human': {
                                title: 'HCM',
                                sub: 'Human Capital',
                            },
                        } }
                        stepper={ <BarraProgresoStepper currentStep={ this.state.currentStep } /> }
                    >
                    </PageTitleFeelrouk>

                    <Modal isOpen={ this.state.modal2 } toggle={ () => { 
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
                                        { 
                                            this.state.icono ? <Icon name="check-circle" /> : <Icon name="dizzy" />
                                        }
                                    </div>
                                    <h2>{ this.state.mensajeAviso }</h2>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button className="btn-feelrouk-naranja" onClick={ () => this.closeModal( 2 ) }>Cerrar</Button>
                        </ModalFooter>
                    </Modal>

                    <Modal isOpen={ this.state.modal } toggle={ () => { 
                        this.closeModal( 1 );
                    } }>
                        <ModalHeader
                            toggle={ () => { 
                                this.closeModal( 1 );
                            } }>Mapa de ubicación</ModalHeader>
                        <ModalBody>
                            <Row className="vertical-gap d-flex justify-content-center">
                                <Col lg="10" className="justify-content-center text-centered">
                                    <h2>¿Está seguro que desea crear la publicación?</h2>
                                    <p>Luego de creada no podrá modificarse y será publicada inmediatamente.</p>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button className="btn-feelrouk-naranja" onClick={ () => {
                                this.publicarTodo();
                            } } disabled={ this.state.loading ? true : false } >Continuar</Button>
                            <Button className="btn-feelrouk" 
                                disabled={ this.state.loading ? true : false } 
                                onClick={ () => this.closeModal( 1 ) }>No</Button>
                        </ModalFooter>
                    </Modal>

                    <Row>
                        <Col lg="12" xs="12">
                            <Form className="formulario-stepper">
                                <PrimerPaso
                                    currentStep={ this.state.currentStep }
                                    handleChange={ this.handleChange }
                                    actualizarFormulario={ this.actualizarFormulario1 }
                                    enviado={ this.state.enviado }
                                />
                                <SegundoPaso
                                    currentStep={ this.state.currentStep }
                                    handleChange={ this.handleChange }
                                    actualizarFormulario={ this.actualizarFormulario2 }
                                    enviado={ this.state.enviado }
                                />
                                <TercerPaso
                                    currentStep={ this.state.currentStep }
                                    handleChange={ this.handleChange }
                                    actualizarFormulario={ this.actualizarFormulario3 }
                                    formulario3={ this.state.formulario3 }
                                />
                                <CuartoPaso
                                    currentStep={ this.state.currentStep }
                                    handleChange={ this.handleChange }
                                    formulario1={ this.state.formulario1 }
                                    formulario2={ this.state.formulario2 }
                                    formulario3={ this.state.formulario3 }
                                />
                            </Form>
                        </Col>
                    </Row>
                    <Row className="justify-content-end">
                        <Col lg="5" className="mt-20 ml-10">
                            { this.previousButton }
                            { this.proximo }
                            { this.botonEnviar }
                        </Col>
                    </Row>

                </Fragment>
            );
        }

        return <MensajeBloqueo />;
    }
}

export default connect( ( { settings, info } ) => (
    {
        settings,
        info,
    }
) )( StepperForm );

