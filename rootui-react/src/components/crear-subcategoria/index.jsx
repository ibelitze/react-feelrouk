/**
 * External Dependencies
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
// import PageTitleFeelrouk from '../../components/page-title-feelrouk';
import { Spinner, Row, Col, Button, FormGroup, Modal, 
    ModalFooter, ModalHeader, ModalBody } from 'reactstrap';
import axios from 'axios';
import Icon from '../icon';
import Select from 'react-select';

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
class CrearSubcategoriaTAG extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            modal1: false,
            loading: false,
            mensajeAviso: '',
            icono: true,
            categorias: null,
            nombre: '',
            nombreError: '',
            categoriaError: '',
            relacion: '',

        };

        this.inputFileRef = React.createRef();
        this.getCategorias = this.getCategorias.bind( this );
        this.openModal = this.openModal.bind( this );
        this.closeModal = this.closeModal.bind( this );
        this.guardarSub = this.guardarSub.bind( this );
    }

    componentDidMount() {
        this.getCategorias();
    }

    // llamada API para traer todas las empresas
    async getCategorias() {
        return axios.get( process.env.REACT_APP_LOCAL + '/api/hcm/tags/getCategorias' ).then( ( res ) => {
            this.setState( { 
                categorias: res.data.data,
            } );
        } );
    }

    guardarSub() {
        // primero:  comprobación de que todos los inputs fueron llenados
        let conteo = 0;

        if ( this.state.nombre.length <= 0 ) {
            this.setState( {
                loading: false,
                nombreError: 'Debe darle un nombre a la subcategoría',
            } );
            conteo++;
        }
        if ( this.state.relacion.length <= 0 || this.state.relacion === '0' ) {
            this.setState( {
                loading: false,
                categoriaError: 'Debe asignar una categoría madre',
            } );
            conteo++;
        }

        if ( conteo > 0 ) {
            return;
        }

        this.setState( {
            loading: true,
        } );

        const data = {
            nombre: this.state.nombre,
            rel_categoria: this.state.relacion,
        };
        // llamada aquí - finalmente
        axios.post( process.env.REACT_APP_LOCAL + '/api/hcm/tags/crearSubCategoria', data ).then( ( res ) => {
            if ( res.data.ok ) {
                this.setState( {
                    nombre: '',
                    loading: false,
                    mensajeAviso: 'La subcategoría ha sido creada satisfactoriamente.',
                    icono: true,
                    relacion: '',
                }, () => {
                    this.props.actualizarCategorias();
                    this.closeModal( 2 );
                    this.openModal( 1 );
                } );
            } else {
                this.setState( {
                    nombre: '',
                    loading: false,
                    mensajeAviso: 'La subcategoría no se pudo crear. Contacte con el administrador.',
                    icono: false,
                    relacion: '',
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
                relacion: '',
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

    renderEscogida( id ) {
        this.setState( {
            relacion: id,
            categoriaError: '',
        } );
    }

    render() {
        const { nombre, nombreError, categoriaError } = this.state;
        let selectCategoria = null;

        if ( this.state.categorias ) {
            const options = [];

            this.state.categorias.forEach( ( cat ) => {
                options.push( {
                    label: cat.nombre,
                    value: cat.id,
                } );
            } );

            selectCategoria = <Select
                className="dropdown-feelrouk"
                name="escoja-categoria"
                options={ options }
                defaultValue={ { label: "Escoger categoría...", value: 0 } }
                onChange={ ( e ) => {
                    this.renderEscogida( e.value );
                } }
            />;
        }

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
                        <h3>Crear nueva subcategoría</h3>

                        <FormGroup>
                            <label className="carga-tag" htmlFor="creartag">
                                Nombre
                                <div>
                                    <input 
                                        className={ classnames( 'form-control', { 'is-invalid': nombreError } ) } 
                                        id="creartag" 
                                        name="crear-tag"
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
                    <Col lg="12" xs="12">
                        <FormGroup>
                            { selectCategoria }
                            <div className="mt-5"></div>
                            { categoriaError ? (
                                <div className="invalid-feedback" style={ { display: 'block' } }>{ categoriaError }</div>
                            ) : '' }
                        </FormGroup>
                    </Col>
                </Row>
                <Row className="mr-10 ml-10 mt-30">
                    <Col lg="12" className="flex justify-content-end">
                        <Button className="btn-feelrouk2" 
                            onClick={ this.guardarSub }
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
) )( CrearSubcategoriaTAG );
