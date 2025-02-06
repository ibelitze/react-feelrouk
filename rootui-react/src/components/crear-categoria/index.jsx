/**
 * External Dependencies
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
// import PageTitleFeelrouk from '../../components/page-title-feelrouk';
import { Spinner, Row, Col, Button, FormGroup, Label, Input, Modal, 
    ModalFooter, ModalHeader, ModalBody } from 'reactstrap';
import axios from 'axios';
import Icon from '../icon';

import classnames from 'classnames/dedupe';

import { renderTooltip } from '../../pages/vcm/helpers/renderToolTip';
import { OverlayTrigger } from 'react-bootstrap';
import alert from '../../../common-assets/images/vcm/alert-circle.png';

require( 'dotenv' ).config();
/**
 * Internal Dependencies
 */
// import Snippet from '../../components/snippet';

/**
 * Component
 */
class CrearCategoriaTAG extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            modal1: false,
            modal2: false,
            loading: false,
            mensajeAviso: '',
            icono: true,
            nombre: '',
            nombreError: '',
        };

        this.inputFileRef = React.createRef();
        this.openModal = this.openModal.bind( this );
        this.closeModal = this.closeModal.bind( this );
        this.guardarCategoria = this.guardarCategoria.bind( this );
        this.renderCreacionCategoria = this.renderCreacionCategoria.bind( this );
    }

    guardarCategoria() {
        // primero:  comprobación de que todos los inputs fueron llenados
        this.setState( {
            loading: true,
        } );

        if ( this.state.nombre.length <= 0 ) {
            this.setState( {
                loading: false,
                nombreError: 'Debe darle un nombre a la categoría',
            } );
            return;
        }

        const data = {
            nombre: this.state.nombre,
        };
        // llamada aquí - finalmente
        axios.post( process.env.REACT_APP_LOCAL + '/api/hcm/tags/crearCategoria', data ).then( ( res ) => {
            if ( res.data.ok ) {
                this.setState( {
                    nombre: '',
                    loading: false,
                    mensajeAviso: 'La categoría ha sido creada satisfactoriamente.',
                    icono: true,
                }, () => {
                    this.props.actualizarCategorias();
                    this.closeModal( 2 );
                    this.openModal( 1 );
                } );
            } else {
                this.setState( {
                    nombre: '',
                    loading: false,
                    mensajeAviso: 'La categoría no se pudo crear. Contacte con el administrador.',
                    icono: false,
                } );
                this.closeModal( 2 );
                this.openModal( 1 );
            }
        } ).catch( ( e ) => {
            console.log( e );
            this.setState( {
                nombre: '',
                loading: false,
                mensajeAviso: 'La categoría no se pudo crear. Contacte con el administrador.',
                icono: false,
            } );
            this.closeModal( 2 );
            this.openModal( 1 );
        } );
    }

    // Abrir/Cerrar de todos los modales

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

    renderCreacionCategoria() {
        const {
            nombre,
            nombreError,
        } = this.state;

        return (
            <Fragment>
                <Row className="mr-10 ml-10 justify-content-center">
                    <Col lg="12" xs="12">
                        <h2>Crear nueva categoría</h2>
                        <FormGroup>
                            <Label for="razonsocial">Nombre *</Label>
                            <Input type="text" 
                                name="razonsocial" 
                                className={ classnames( 'input-hcm-formulario', { 'is-invalid': nombreError } ) }
                                value={ nombre }
                                onChange={ ( e ) => {
                                    const nuevo = e.target.value.replace( /[`~!¨´@$%^&*°()¿¡_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                    this.setState( {
                                        nombre: nuevo,
                                        nombreError: '',
                                    } );
                                } }
                            />
                            { nombreError ? (
                                <div className="invalid-feedback">{ nombreError }</div>
                            ) : '' }
                        </FormGroup>
                    </Col>
                </Row>
                <Row className="mt-30">
                    <Col lg="12" className="flex justify-content-center">
                        <Button className="btn-feelrouk-naranja2" 
                            onClick={ this.guardarCategoria }
                            disabled={ this.state.loading }
                        > 
                            Crear
                            { this.state.loading ? (
                                <Spinner />
                            ) : '' }
                        </Button>
                    </Col>
                </Row>
            </Fragment>
        );
    }

    render() {
        const { nombre, nombreError } = this.state;

        return (
            <Fragment>

                <Modal isOpen={ this.state.modal1 } toggle={ () => { 
                    this.closeModal( 1 );
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
                        <Button className="btn-feelrouk-naranja" onClick={ () => this.closeModal( 1 ) }>Cerrar</Button>
                    </ModalFooter>
                </Modal>
                <Row className="mr-10 ml-10">
                    <Col lg="12" xs="12">
                        <h3>Crear nueva categoría</h3>

                        <FormGroup>
                            <label className="carga-tag" htmlFor="crearcategoria">
                                Nombre
                                <div>
                                    <input 
                                        className={ classnames( 'form-control', { 'is-invalid': nombreError } ) } 
                                        id="crearcategoria" 
                                        name="crear-categoria"
                                        value={ nombre }
                                        onChange={ ( e ) => {
                                            const nuevo = e.target.value.replace( /[`~!¨´@$%^&*°()¿¡_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                            this.setState( {
                                                nombre: nuevo,
                                                nombreError: '',
                                            } );
                                        } } type="text" />
                                    <OverlayTrigger
                                        placement="right"
                                        delay={ { show: 250, hide: 400 } }
                                        overlay={ props => renderTooltip( { props, texto: "Tooltip" } ) }
                                    >
                                        <img alt={ "informacion" } src={ alert } />
                                    </OverlayTrigger>
                                </div>
                            </label>
                            { nombreError ? (
                                <div className="invalid-feedback">{ nombreError }</div>
                            ) : '' }
                        </FormGroup>
                    </Col>
                </Row>
                <Row className="mr-10 ml-10 mt-30">
                    <Col lg="12" className="flex justify-content-end">
                        <Button className="btn-feelrouk2" 
                            onClick={ this.guardarCategoria }
                            disabled={ this.state.loading }
                        > 
                            Crear
                            { this.state.loading ? (
                                <Spinner />
                            ) : '' }
                        </Button>
                    </Col>
                </Row>
            </Fragment>
        );
    }
}

export default connect( ( { settings, info } ) => (
    {
        settings,
        info,
    }
) )( CrearCategoriaTAG );
