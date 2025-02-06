/**
 * External Dependencies
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
// import PageTitleFeelrouk from '../../components/page-title-feelrouk';
import { Spinner, Row, Col, Button, FormGroup, Label, Input, Modal, 
    ModalFooter, ModalHeader, ModalBody } from 'reactstrap';
import axios from 'axios';
import FormData from 'form-data';
import './style.scss';
import Icon from '../icon';

import classnames from 'classnames/dedupe';
require( 'dotenv' ).config();

/**
 * Internal Dependencies
 */
// import Snippet from '../../components/snippet';

/**
 * Component
 */
class CrearEmpresaHCM extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            modal1: false,
            modal2: false,
            loading: false,
            mensajeAviso: '',
            icono: true,
            razonSocial: '',
            rut: '',
            url: '',
            nombre: '',
            apellido: '',
            cargo: '',
            correo: '',
            telefono: '',
            logo: null,
            logoNombre: '',
            razonError: '',
            rutError: '',
            nombreError: '',
            apellidoError: '',
            cargoError: '',
            correoError: '',
            tlfError: '',
            logoError: null,
        };

        this.inputFileRef = React.createRef();
        this.openModal = this.openModal.bind( this );
        this.closeModal = this.closeModal.bind( this );
        this.guardarEmpresa = this.guardarEmpresa.bind( this );
        this.renderCreacionEmpresa = this.renderCreacionEmpresa.bind( this );
        this.subirLogo = this.subirLogo.bind( this );
        this.botonActivarSubida = this.botonActivarSubida.bind( this );
    }

    botonActivarSubida() {
        this.setState( {
            logoError: null,
        } );
        this.inputFileRef.current.click();
    }

    subirLogo( file ) {
        if ( ! file ) {
            return;
        }

        if ( file.type !== 'image/jpeg' && file.type !== 'image/png' ) {
            this.setState( {
                logoError: 'El logo solo puede ser jpeg o png',
            } );
            return;
        }

        if ( file.size > 10485760 ) {
            this.setState( {
                logoError: 'El logo no debe pesar más de 10 MB',
            } );
        }

        this.setState( {
            logo: file,
            logoNombre: file.name,
        } );
    }

    guardarEmpresa() {
        // primero:  comprobación de que todos los inputs fueron llenados
        this.setState( {
            loading: true,
        } );

        let count = 0;
        const foundRUT = [];
        const foundNombre = [];

        if ( this.state.razonSocial.length <= 0 ) {
            this.setState( {
                loading: false,
                razonError: 'Debe llenar el campo de Razón Social',
            } );
            count += 1;
        }
        if ( this.state.rut.length <= 0 ) {
            this.setState( {
                loading: false,
                rutError: 'Debe llenar el campo del RUT',
            } );
            count += 1;
        }
        if ( this.state.nombre.length <= 0 ) {
            this.setState( {
                loading: false,
                nombreError: 'Debe llenar el nombre de la persona encargada',
            } );
            count += 1;
        }
        if ( this.state.apellido.length <= 0 ) {
            this.setState( {
                loading: false,
                apellidoError: 'Debe llenar el apellido de la persona encargada',
            } );
            count += 1;
        }
        if ( this.state.cargo.length <= 0 ) {
            this.setState( {
                loading: false,
                cargoError: 'Debe llenar el cargo',
            } );
            count += 1;
        }
        if ( this.state.correo.length <= 0 ) {
            this.setState( {
                loading: false,
                correoError: 'Debe llenar el correo electrónico',
            } );
            count += 1;
        }
        if ( this.state.telefono.length <= 0 ) {
            this.setState( {
                loading: false,
                tlfError: 'Debe indicar algún número telefónico',
            } );
            count += 1;
        }

        this.props.empresas.forEach( ( empresa ) => {
            if ( empresa.razon_social === this.state.razonSocial ) {
                foundNombre.push( empresa );
            }
            if ( empresa.rut === this.state.rut ) {
                foundRUT.push( empresa );
            }
        } );

        if ( foundRUT.length > 0 ) {
            this.setState( {
                loading: false,
                rutError: 'Ya existe otra empresa registrada con el mismo RUT',
            } );
            count += 1;
        }

        if ( foundNombre.length > 0 ) {
            this.setState( {
                loading: false,
                razonError: 'Ya existe otra empresa registrada bajo la misma razón social',
            } );
            count += 1;
        }

        if ( count > 0 ) {
            return;
        }

        if ( ! this.state.logo ) {
            this.setState( {
                mensajeAviso: 'Debe incluir un logo para la empresa',
                icono: false,
                loading: false,
            } );
            this.openModal( 1 );
            return;
        }

        // subir acá el logo - una vez que todo esté lleno en el formulario
        const formData = new FormData();
        formData.append( 'image', this.state.logo );
        formData.append( 'ldt', 'hcm' );

        // llamada aquí - finalmente
        axios.post( process.env.REACT_APP_LOCAL + '/api/hcm/bucketgoogle', formData ).then( ( res ) => {
            if ( res.data.ok ) {
                const data = {
                    razonSocial: this.state.razonSocial,
                    rut: this.state.rut,
                    url: this.state.url,
                    relEmpresa: this.props.info.id,
                    nombre: this.state.nombre,
                    apellido: this.state.apellido,
                    cargo: this.state.cargo,
                    correo: this.state.correo,
                    telefono: this.state.telefono,
                    logo: res.data.url,
                };

                // llamada aquí - finalmente
                axios.post( process.env.REACT_APP_LOCAL + '/api/hcm/nuevaEmpresa', data ).then( ( res2 ) => {
                    if ( res2.data ) {
                        this.setState( {
                            razonSocial: '',
                            rut: '',
                            nombre: '',
                            apellido: '',
                            cargo: '',
                            correo: '',
                            telefono: '',
                            loading: false,
                            mensajeAviso: 'Empresa creada satisfactoriamente.',
                            icono: true,
                        } );
                        this.props.getEmpresas();
                        this.closeModal( 2 );
                        this.openModal( 1 );
                    } else {
                        this.setState( {
                            loading: false,
                            mensajeAviso: 'La empresa no se pudo registrar, por favor, contacte al administrador.',
                            icono: false,
                        } );
                        this.openModal( 1 );
                    }
                } ).catch( ( e ) => {
                    console.log( e );
                    this.setState( {
                        razonSocial: '',
                        rut: '',
                        nombre: '',
                        apellido: '',
                        cargo: '',
                        correo: '',
                        telefono: '',
                        loading: false,
                        mensajeAviso: 'La empresa no se pudo crear. Contacte con el administrador.',
                        icono: false,
                    } );
                    this.closeModal( 2 );
                    this.openModal( 1 );
                } );
            } else {
                this.setState( {
                    loading: false,
                    mensajeAviso: 'El archivo no se pudo cargar, por favor, contacte al administrador.',
                    icono: false,
                } );
                this.openModal( 1 );
            }
        } ).catch( ( e ) => {
            console.log( e );
            this.setState( {
                loading: false,
                mensajeAviso: 'El archivo no se pudo cargar, por favor, contacte al administrador.',
                icono: false,
            } );
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

    renderCreacionEmpresa() {
        const {
            razonSocial,
            rut,
            url,
            nombre,
            apellido,
            cargo,
            correo,
            telefono,
            razonError,
            rutError,
            nombreError,
            apellidoError,
            cargoError,
            correoError,
            tlfError,
        } = this.state;

        return (
            <Fragment>
                <Row className="mr-10 ml-10">
                    <Col lg="6" xs="12">
                        <h2>Datos de la empresa</h2>
                        <FormGroup>
                            <Label for="razonsocial">Razón Social *</Label>
                            <Input type="text" 
                                name="razonsocial" 
                                className={ classnames( 'input-hcm-formulario', { 'is-invalid': razonError } ) }
                                value={ razonSocial }
                                onChange={ ( e ) => {
                                    const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                    this.setState( {
                                        razonSocial: nuevo,
                                        razonError: '',
                                    } );
                                } }
                            />
                            { razonError ? (
                                <div className="invalid-feedback">{ razonError }</div>
                            ) : '' }
                        </FormGroup>
                        <FormGroup>
                            <Label for="rut">RUT de la empresa *</Label>
                            <Input type="text" 
                                name="rut" 
                                className={ classnames( 'input-hcm-formulario', { 'is-invalid': rutError } ) }
                                value={ rut }
                                onChange={ ( e ) => {
                                    const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                    this.setState( {
                                        rut: nuevo,
                                        rutError: '',
                                    } );
                                } }
                            />
                            { rutError ? (
                                <div className="invalid-feedback">{ rutError }</div>
                            ) : '' }
                        </FormGroup>
                        <FormGroup>
                            <Label for="rut">URL de la página web (opcional)</Label>
                            <Input type="text" 
                                name="url" 
                                className="input-hcm-formulario"
                                value={ url }
                                onChange={ ( e ) => {
                                    const nuevo = e.target.value.replace( /[`~!¨´#$%^&*°()¿¡|+=?;:'",<>\{\}\[\]\\\/]/gi, '' );
                                    this.setState( {
                                        url: nuevo,
                                    } );
                                } }
                            />
                        </FormGroup>
                        <br></br>
                        <FormGroup>
                            <Label for="rut">Cargar logo de la empresa</Label>
                            <Row>
                                <Col className="align-center">
                                    <input className="boton-adjuntar-file" 
                                        name="adjuntar_logo" 
                                        type="file"
                                        ref={ this.inputFileRef }
                                        onChange={ ( e ) => {
                                            this.setState( {
                                                logoError: null,
                                            } );
                                            this.subirLogo( e.target.files[ 0 ] );
                                        } } />
                                    <Button onClick={ () => {
                                        this.botonActivarSubida();
                                    } } className="boton-adjuntar">Adjuntar logo</Button>
                                    { this.state.logo ? <span>Logo cargado</span> : null }
                                    { this.state.logoError ? <span className="error">{ this.state.logoError }</span> : null }
                                </Col>
                                <Col lg="7">
                                    <div>
                                        Imagen logo: Debe ser un JPEG o PNG no mayor a 10 MB. Las imagenes deben tener como mínimo 1000 x 1000 píxeles.
                                    </div>
                                </Col>
                            </Row>
                        </FormGroup>

                    </Col>
                    <Col lg="6" xs="12">
                        <h2>Datos contacto principal</h2>
                        <FormGroup>
                            <Label for="nombre">Nombre *</Label>
                            <Input type="text" 
                                name="nombre" 
                                className={ classnames( 'input-hcm-formulario', { 'is-invalid': nombreError } ) } 
                                value={ nombre }
                                onChange={ ( e ) => {
                                    const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
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
                        <FormGroup>
                            <Label for="apellido">Apellido *</Label>
                            <Input type="text" 
                                name="apellido" 
                                className={ classnames( 'input-hcm-formulario', { 'is-invalid': apellidoError } ) } 
                                value={ apellido }
                                onChange={ ( e ) => {
                                    const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                    this.setState( {
                                        apellido: nuevo,
                                        apellidoError: '',
                                    } );
                                } }
                            />
                            { apellidoError ? (
                                <div className="invalid-feedback">{ apellidoError }</div>
                            ) : '' }
                        </FormGroup>
                        <FormGroup>
                            <Label for="cargo">Cargo *</Label>
                            <Input type="text" 
                                name="cargo" 
                                className={ classnames( 'input-hcm-formulario', { 'is-invalid': cargoError } ) } 
                                value={ cargo }
                                onChange={ ( e ) => {
                                    const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                    this.setState( {
                                        cargo: nuevo,
                                        cargoError: '',
                                    } );
                                } }
                            />
                            { cargoError ? (
                                <div className="invalid-feedback">{ cargoError }</div>
                            ) : '' }
                        </FormGroup>
                        <FormGroup>
                            <Label for="email">Correo Electrónico *</Label>
                            <Input type="email" 
                                name="email" 
                                className={ classnames( 'input-hcm-formulario', { 'is-invalid': correoError } ) }
                                value={ correo }
                                onChange={ ( e ) => {
                                    this.setState( {
                                        correo: e.target.value,
                                    } );
                                } }
                            />
                            { correoError ? (
                                <div className="invalid-feedback">{ correoError }</div>
                            ) : '' }
                        </FormGroup>
                        <FormGroup>
                            <Label for="telefono">Teléfono *</Label>
                            <Input type="text" 
                                name="telefono" 
                                className={ classnames( 'input-hcm-formulario', { 'is-invalid': tlfError } ) }
                                value={ telefono }
                                onChange={ ( e ) => {
                                    const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                    this.setState( {
                                        telefono: nuevo,
                                        tlfError: '',
                                    } );
                                } }
                            />
                            { tlfError ? (
                                <div className="invalid-feedback">{ tlfError }</div>
                            ) : '' }
                        </FormGroup>
                    </Col>
                </Row>
                <Row className="mt-30">
                    <Col lg="12" className="flex justify-content-end">
                        <Button className="btn-feelrouk-naranja2" 
                            onClick={ this.guardarEmpresa }
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
        const contenidoCreacion = this.renderCreacionEmpresa();

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

                <Modal className="modal-grande" isOpen={ this.state.modal2 } toggle={ () => { 
                    this.closeModal( 2 );
                } }>
                    <ModalHeader
                        toggle={ () => { 
                            this.closeModal( 2 );
                        } }>Creación de empresa</ModalHeader>
                    <ModalBody>
                        <Row className="vertical-gap d-flex justify-content-center">
                            <div className="mt-30"></div>
                            { contenidoCreacion }
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button className="btn-feelrouk" onClick={ () => this.closeModal( 2 ) }>Cerrar</Button>
                    </ModalFooter>
                </Modal>

                <Button className="btn-feelrouk"
                    onClick={ () => this.openModal( 2 ) }
                >Crear empresa</Button>
            </Fragment>
        );
    }
}

export default connect( ( { settings, info } ) => (
    {
        settings,
        info,
    }
) )( CrearEmpresaHCM );
