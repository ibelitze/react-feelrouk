/**
 * External Dependencies
 */
import React, { Component, Fragment } from 'react';
import classnames from 'classnames/dedupe';
import { connect } from 'react-redux';
import setting from '../../settings';
import { withRouter } from 'react-router-dom';
import { Spinner, Row, Col, Modal, ModalFooter, ModalHeader, ModalBody, Button } from 'reactstrap';
import Icon from '../../components/icon';
import { withFirebase } from '../../components/auth-component/context';
import { compose } from 'recompose';
import axios from 'axios';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { updateAuth as actionUpdateAuth } from './actions';

require( 'dotenv' ).config();
/**
 * Internal Dependencies
 */
// import Icon from '../../components/icon';
// import { isValidEmail } from '../../utils';

import { updateAuth as actionUpdateAuth, updateInfo as actionUpdateInfo } from '../../actions';

/**
 * Component
 */
class Content extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            hash: "",
            cliente: null,
            email: '',
            password1: '',
            password2: '',
            passwordError: '',
            loading: false,
            iguales: null,
            redirect: false,
            modal: false,
            modal2: false,
            modal3: false,
            mensaje: '',
            urlBase: window.location.origin,
        };

        this.checkPassword = this.checkPassword.bind( this );
        this.settings = setting;
        this.registrarUsuario = this.registrarUsuario.bind( this );
        this.getQueryVariable = this.getQueryVariable.bind( this );
        this.checkEverythingBefore = this.checkEverythingBefore.bind( this );
        this.renderForm = this.renderForm.bind( this );
        this.openModal = this.openModal.bind( this );
        this.closeModal = this.closeModal.bind( this );
        this.redireccionar = this.redireccionar.bind( this );
    }

    componentDidMount() {
        const hash = this.getQueryVariable( 'hash' );

        if ( hash ) {
            this.setState( {
                hash: hash,
            } );

            const dato = {
                content: hash,
            };
            // llamar a la api para saber si este usuario está activo o si existe (al menos).
            axios.post( process.env.REACT_APP_DEVAPI + '/api/clientes/revisarUsuario', dato ).then( ( res ) => {
                if ( res.data.ok ) {
                    const cliente = res.data.cliente;
                    // el cliente ya puso contraseña anteriormente.
                    if ( cliente.registrado ) {
                        this.setState( {
                            mensaje: 'Su usuario ya ha sido registrado anteriormente. Ya puede entrar en la plataforma. Si perdió su clave: vaya al Login y recupere su contraseña',
                        } );
                        this.openModal( 1 );

                        // el cliente no se ha registrado. Todo bien, sigue el proceso normal.
                    } else {
                        this.setState( {
                            cliente: cliente,
                        } );
                    }

                    // usuario no encontrado.
                }
            } ).catch( () => {
                this.setState( {
                    mensaje: 'Usuario no encontrado o link dañado. Por favor, contacte con el administrador Feelrouk',
                } );
                this.openModal( 1 );
            } );
        } else {
            // no se pudo decodificar el email. Hubo un problema
            this.setState( {
                mensaje: 'Usuario no encontrado o link dañado. Por favor, contacte con el administrador Feelrouk',
            } );
            this.openModal( 1 );
        }
    }

    checkPassword() {
        const {
            password1,
            password2,
        } = this.state;

        const isValidFirst = password1 && password1.length >= 6;
        const isValidSecond = password2 && password1.length >= 6;
        const isValidThird = password1 === password2;
        const finalValidation = isValidFirst && isValidSecond && isValidThird;

        if ( ! isValidFirst || ! isValidSecond ) {
            this.setState( {
                passwordError: 'Contraseña debe ser de 6 caracteres o más',
                iguales: false,
            } );
        } else if ( ! isValidThird ) {
            this.setState( {
                passwordError: 'Las contraseñas deben coincidir',
                iguales: false,
            } );
        }
        if ( isValidThird ) {
            this.setState( {
                passwordError: '',
                iguales: true,
            } );
        }

        return finalValidation;
    }

    async checkEverythingBefore() {
        const validation = this.checkPassword();

        if ( validation ) {
            try {
                this.setState( { loading: true } );
                this.registrarUsuario( this.state.cliente.email, this.state.password1 );
            } catch ( error ) {
                console.log( error );
            }

            // enviar al servidor y registrar al usuario
        } else {
            // no se pudo decodificar el email. Hubo un problema
            this.setState( {
                mensaje: 'Las contraseñas deben tener más de 6 caracteres y coincidir',
            } );
            this.openModal( 2 );
            // mostrar algo, o simplemente dejarlo así.
        }
    }

    // getQueryVariable - se usa para optener el hash completo del link

    getQueryVariable( name, url = window.location.href ) {
        name = name.replace( /[\[\]]/g, '\\$&' );
        const regex = new RegExp( '[?&]' + name + '(=([^&#]*)|&|#|$)' ),
            results = regex.exec( url );
        if ( ! results ) {
            return null;   
        }
        if ( ! results[ 2 ] ) {
            return '';  
        } 
        return decodeURIComponent( results[ 2 ].replace( /\+/g, ' ' ) );
    }

    async registrarUsuario( email, password ) {
        const id = this.state.cliente.id;
        this.props.firebase.doCreateUserWithEmailAndPassword( email, password )
            .then( () => {
                const data = { id: id };
                // llamar a la api para saber si este usuario está activo o si existe (al menos).
                axios.post( process.env.REACT_APP_DEVAPI + '/api/clientes/usuarioRegistrado', data ).then( ( res ) => {
                    if ( res.data.ok ) {
                        this.setState( {
                            mensaje: 'Su usuario ha sido registrado satisfactoriamente. Ya puede entrar en la aplicación',
                        } );
                        this.openModal( 3 );
                    }
                } ).catch( () => {
                    this.setState( {
                        mensaje: 'Hubo un error registrando su contraseña, contacte con el administrador Feelrouk',
                    } );
                    this.openModal( 1 );
                } );
            } )
            .catch( error => {
                if ( error.code ) {
                    this.setState( { loading: false, mensaje: 'Error al guardar su contraseña, intente de nuevo o llame al administrador' } );
                    this.openModal( 2 );
                }
            } );
    }

    // Abrir/Cerrar de todos los modales
    // Abrir/Cerrar de todos los modales
    // Abrir/Cerrar de todos los modales

    openModal( number ) {
        switch ( number ) {
        case 1:
            this.setState( { modal: true } );
            break;
        case 2:
            this.setState( { modal2: true } );
            break;
        case 3:
            this.setState( { modal3: true } );
            break;
        default:
            break;
        }
    }

    closeModal( number ) {
        switch ( number ) {
        case 1:
            this.setState( { 
                modal2: false,
                mensaje: '',
            } );
            break;
        case 2:
            this.setState( { 
                modal2: false,
                mensaje: '',
            } );
            break;
        case 3:
            this.setState( { 
                modal3: false,
                mensaje: '',
            } );
            break;
        default:
            break;
        }
    }

    redireccionar() {
        const { history } = this.props;
        history.replace( '/sign-in' );
    }

    renderForm() {
        const {
            password1,
            password2,
            passwordError,
        } = this.state;

        return (
            <Fragment>

                <Modal isOpen={ this.state.modal } toggle={ () => { 
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
                                    <Icon name="dizzy" />
                                </div>
                                <h2>{ this.state.mensaje }</h2>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button className="btn-feelrouk-naranja" onClick={ () => { 
                            this.redireccionar(); 
                        } }>Cerrar</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={ this.state.modal2 } toggle={ () => { 
                    this.closeModal( 2 );
                } }>
                    <ModalHeader
                        toggle={ () => { 
                            this.closeModal( 2 ); 
                        } }>Aviso</ModalHeader>
                    <ModalBody>
                        <Row className="vertical-gap d-flex justify-content-center">
                            <Col lg="10" className="justify-content-center text-centered">
                                <div className="icon-container">
                                    <Icon name="dizzy" />
                                </div>
                                <h2>{ this.state.mensaje }</h2>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button className="btn-feelrouk-naranja" onClick={ () => { 
                            this.closeModal( 2 );
                        } }>Cerrar</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={ this.state.modal3 } toggle={ () => { 
                    this.closeModal( 1 );
                } }>
                    <ModalHeader
                        toggle={ () => { 
                            this.closeModal( 3 ); 
                        } }>Aviso</ModalHeader>
                    <ModalBody>
                        <Row className="vertical-gap d-flex justify-content-center">
                            <Col lg="10" className="justify-content-center text-centered">
                                <div className="icon-container">
                                    <FontAwesomeIcon className="check-icon" icon={ faCheck } />
                                </div>
                                <h2>{ this.state.mensaje }</h2>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button className="btn-feelrouk-naranja" onClick={ () => { 
                            this.redireccionar(); 
                        } }>Cerrar</Button>
                    </ModalFooter>
                </Modal>

                <nav className="navbar navbar-expand-lg ftco_navbar ftco-navbar-light">
                    <div className="container">
                        <a className="navbar-brand" href="/">
                            <img src={ this.settings.login.logo } alt={ 'Feelrouk logo' } className="view-desktop" />
                        </a>
                        <div className="collapse navbar-collapse view-desktop" id="ftco-nav">
                            <ul className="navbar-nav ml-auto mr-md-3">
                                <li className="nav-item">
                                    <a href="https://feelrouk.com/human-capital/" className="nav-link">Human Capital 
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a href="https://feelrouk.com/revenue/" className="nav-link">Revenue
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a href="https://feelrouk.com/value-chain/" className="nav-link">Value Chain
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a href="https://feelrouk.com/digital/" className="nav-link">Digital
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a href="https://feelrouk.com/proyectos/" className="nav-link">Proyectos</a>
                                </li>
                            </ul>
                        </div>
                        <div className="collapse navbar-collapse view-mobile" id="ftco-nav">

                            <ul className="navbar-nav-mobile ml-auto ml-md-3">
                                <li className="nav-item">
                                    <a href="/" className="nav-link"> Volver
                                        <i className="fas fa-caret-down"></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <div className="content-login">
                    <img src={ this.settings.login.circulo1 } alt={ 'Feelrouk backgrounds' } className="lazy view-mobile circle-mobile" />
                    <div className="row col-container">
                        <div className="col-md-5 col-sm-12"></div>
                        <div className="col-md-7 col-sm-12 extra-background">
                            <div className="wti-heading-login">
                                <h1>Una <b>Plataforma</b></h1>
                                <h2>Múltiples <b>Objetivos</b></h2>
                            </div>
                            <div className="container-form signup">
                                <img src={ this.settings.login.logo } alt={ 'Feelrouk logo' } className="view-desktop" />
                                <img src={ this.settings.login.logoInvertido } alt={ 'Feelrouk logo' } className="view-mobile" />
                                <h3>Cree su contraseña</h3>
                                <div className="login-form">
                                    <div className="form-group mb-4">
                                        <input
                                            type="password"
                                            className={ classnames( 'form-control', { 'is-invalid': passwordError } ) }
                                            placeholder="Contraseña"
                                            value={ password1 }
                                            onChange={ ( e ) => {
                                                this.setState( {
                                                    password1: e.target.value,
                                                }, passwordError ? this.checkPassword : () => {} );
                                            } }
                                            onBlur={ this.checkPassword }
                                            disabled={ this.state.loading }
                                        />
                                    </div>
                                    <div className="form-group mb-4">
                                        <input
                                            type="password"
                                            className={ classnames( 'form-control', { 'is-invalid': passwordError } ) }
                                            placeholder="Repita la contraseña"
                                            value={ password2 }
                                            onChange={ ( e ) => {
                                                this.setState( {
                                                    password2: e.target.value,
                                                }, passwordError ? this.checkPassword : () => {} );
                                            } }
                                            onBlur={ this.checkPassword }
                                            disabled={ this.state.loading }
                                        />
                                        { passwordError ? (
                                            <div className="invalid-feedback">{ passwordError }</div>
                                        ) : '' }
                                    </div>
                                    <button
                                        className="btn btn-login-form"
                                        onClick={ this.checkEverythingBefore }
                                        disabled={ this.state.loading }
                                    >
                                        Crear
                                        { this.state.loading ? (
                                            <Spinner />
                                        ) : '' }
                                    </button>
                                </div>
                            </div>
                            <img src={ this.settings.login.blueCircle } alt={ 'Feelrouk backgrounds varios' } className="view-desktop blue-circle" />
                            <img src={ this.settings.login.circuitos } alt={ 'Feelrouk backgrounds varios' } className="view-desktop circuito-uno" />
                            <img src={ this.settings.login.circuitos2 } alt={ 'Feelrouk backgrounds varios' } className="view-desktop circuito-dos" />
                            <img src={ this.settings.login.rayas } alt={ 'Feelrouk backgrounds varios' } className="view-desktop rayas" />
                            <img src={ this.settings.login.circulOscuro } alt={ 'Feelrouk backgrounds varios' } className="view-desktop dark-circle" />
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }

    render() {
        const formulario = this.renderForm();
        return formulario;
    }
}

const enhance = compose( withFirebase, connect( ( { auth, settings, info } ) => ( { auth, settings, info } ), { updateAuth: actionUpdateAuth, updateInfo: actionUpdateInfo } ) );
export default withRouter( enhance( Content ) );
