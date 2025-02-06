/**
 * External Dependencies
 */
import React, { Component, Fragment } from 'react';
import classnames from 'classnames/dedupe';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import setting from '../../settings';
import { Spinner } from 'reactstrap';
import { withFirebase } from '../../components/auth-component/context';
import { compose } from 'recompose';
import axios from 'axios';
import moment from 'moment';
require( 'dotenv' ).config();

/**
 * Internal Dependencies
 */
// import Icon from '../../components/icon';
import { isValidEmail } from '../../utils';

import { updateAuth as actionUpdateAuth, updateInfo as actionUpdateInfo } from '../../actions';

/**
 * Component
 */
class Content extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            error: false,
            email: '',
            emailError: '',
            errorGeneral: '',
            password: '',
            passwordError: '',
            staff: false,
            cliente: false,
            loading: false,
        };

        this.checkEmail = this.checkEmail.bind( this );
        this.checkPassword = this.checkPassword.bind( this );
        // this.checkForPermissions = this.checkForPermissions.bind( this );
        this.loginAndFoundPermissions = this.loginAndFoundPermissions.bind( this );
        this.settings = setting;
        this.checkForPermissions2 = this.checkForPermissions2.bind( this );
        this.llamadaFirebase = this.llamadaFirebase.bind( this );
        this.loginFinal = this.loginFinal.bind( this );
    }

    checkEmail() {
        const {
            email,
        } = this.state;

        const isValid = email && isValidEmail( email );

        this.setState( {
            emailError: isValid ? '' : 'Formato de email inválido',
        } );

        return isValid;
    }

    checkPassword() {
        const {
            password,
        } = this.state;

        const isValid = password && password.length >= 6;

        this.setState( {
            passwordError: isValid ? '' : 'Contraseña debe ser de 6 caracteres o más',
        } );

        return isValid;
    }

    // aquí se llama a la api y se inicia todo
    async loginAndFoundPermissions() {
        if ( this.state.loading ) {
            return;
        }

        let isValid = true;
        isValid = this.checkEmail() && isValid;
        isValid = this.checkPassword() && isValid;

        // Form is not valid.
        if ( ! isValid ) {
            return;
        }

        try {
            this.llamadaFirebase();
        } catch ( error ) {
            console.log( error );
        }
    }

    async loginFinal() {
        const data = {
            email: this.state.email,
        };
        axios.post( process.env.REACT_APP_DEVAPI + '/api/auth/login', data ).then( ( res ) => {
            if ( res.data.ok ) {
                console.log( res.data );
                // el usuario es STAFF
                if ( res.data.data.tipo === "staff" ) {
                    this.props.updateInfo( {
                        id: res.data.data.usuario.id,
                        nombre: res.data.data.usuario.nombre,
                        email: res.data.data.usuario.email,
                        jerarquia: "administrador",
                        init: moment().format( 'LTS' ),
                        exp: moment().add( 1.5, 'hour' ).format( 'LTS' ),
                    } );
                    this.setState( { loading: false } );
                    this.props.updateAuth( {
                        token: res.data.data.token,
                    } );
                    window.localStorage.setItem( 'countDown', 240 );
                } else if ( res.data.data.tipo === "cliente" ) {
                    // el usuario es CLIENTE
                    this.checkForPermissions2( res.data.data );
                }
            } else {
                this.setState( { loading: false, emailError: 'Usuario no encontrado. Por favor, contacte al administrador' } );
            }
        } );
    }

    async checkForPermissions2( data ) {
        axios.get( process.env.REACT_APP_DEVAPI + '/api/clientes/getByEmail/' + data.usuario.email ).then( ( res ) => {
            if ( res.data.ok ) {
                // solamemte si la empresa y el admin están activos
                if ( res.data.data.permisos.active && res.data.data.cliente.active ) {
                    if ( res.data.data.cliente.is_admin ) {
                        this.setState( { loading: false } );

                        this.props.updateInfo( {
                            id: res.data.data.cliente.id,
                            nombre: res.data.data.cliente.nombre,
                            email: res.data.data.cliente.email,
                            jerarquia: "clienteAdmin",
                            cliente: res.data.data.cliente,
                            empresa: res.data.data.empresa,
                            permisos: res.data.data.permisos.codigo,
                            permisosTotal: res.data.data.permisos,
                            init: moment().format( 'LTS' ),
                            exp: moment().add( 1.5, 'hour' ).format( 'LTS' ),
                        } );
                    } else {
                        this.setState( { loading: false } );
                        this.props.updateInfo( {
                            id: res.data.data.cliente.id,
                            nombre: res.data.data.cliente.nombre,
                            email: res.data.data.cliente.email,
                            jerarquia: "empleado",
                            permisos: res.data.data.permisos.codigo,
                            init: moment().format( 'LTS' ),
                            exp: moment().add( 1.5, 'hour' ).format( 'LTS' ),
                        } );
                    }
                    this.props.updateAuth( {
                        token: data.token,
                    } );
                    window.localStorage.setItem( 'countDown', 240 );

                    // si la empresa está inactiva entonces no se puede loguear
                } else {
                    this.setState( { loading: false, emailError: 'Empresa o cliente deshabilitado. Por favor, contacte al administrador' } );
                }
            }
        } );
    }

    llamadaFirebase() {
        this.setState( { loading: true } );
        return this.props.firebase.doSignInWithEmailAndPassword( this.state.email, this.state.password ).then( ( res1 ) => {
            if ( res1 ) {
                try {
                    this.loginFinal();
                    // this.checkForPermissions();
                    // this.checkForPermissions2();
                } catch {
                    console.log( 'error buscando la data' );
                }
            } else {
                this.setState( { loading: false, errorGeneral: 'Error de credenciales. por favor, revise y vuelva a intentarlo' } );
            }
        } ).catch( ( error ) => {
            // this.setState( { loading: false, error: true, errorGeneral: 'Error de credenciales. por favor, revise y vuelva a intentarlo' } );
            if ( error ) {
                if ( error.code === "auth/user-not-found" ) {
                    this.setState( { loading: false, emailError: 'Usuario no registrado. Por favor, contacte al administrador' } );
                } else if ( error.code === "auth/wrong-password" ) {
                    this.setState( { loading: false, passwordError: 'Credenciales incorrectas' } );
                    this.setState( { loading: false, emailError: 'Credenciales incorrectas' } );
                } else {
                    this.setState( { loading: false, errorGeneral: 'Error de credenciales. por favor, revise y vuelva a intentarlo' } );
                }
            } else {
                this.setState( { loading: false, emailError: 'Error al loguear, intente de nuevo' } );
            }
        } );
    }

    render() {
        const {
            error,
            email,
            emailError,
            password,
            passwordError,
            errorGeneral,
        } = this.state;

        return (
            <Fragment>
                <nav className="navbar navbar-expand-lg ftco_navbar ftco-navbar-light">
                    <div className="container">
                        <a className="navbar-brand" href="#/">
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
                            <div className="container-form">
                                <img src={ this.settings.login.logo } alt={ 'Feelrouk logo' } className="view-desktop" />
                                <img src={ this.settings.login.logoInvertido } alt={ 'Feelrouk logo' } className="view-mobile" />
                                <h3>Inicia sesión</h3>
                                <div className="login-form">
                                    <div className="form-group mb-4">
                                        <input
                                            type="email"
                                            className={ classnames( 'form-control', { 'is-invalid': emailError } ) }
                                            aria-describedby="emailHelp"
                                            placeholder="Correo Electrónico"
                                            value={ email }
                                            onChange={ ( e ) => {
                                                this.setState( {
                                                    email: e.target.value,
                                                }, emailError ? this.checkEmail : () => {} );
                                            } }
                                            onBlur={ this.checkEmail }
                                            disabled={ this.state.loading }
                                        />
                                        { emailError.length > 0 ? (
                                            <div className="invalid-feedback">{ emailError }</div>
                                        ) : '' }
                                    </div>
                                    <div className="form-group mb-4">
                                        <input
                                            type="password"
                                            className={ classnames( 'form-control', { 'is-invalid': passwordError } ) }
                                            placeholder="Contraseña"
                                            value={ password }
                                            onChange={ ( e ) => {
                                                this.setState( {
                                                    password: e.target.value,
                                                }, passwordError ? this.checkPassword : () => {} );
                                            } }
                                            onBlur={ this.checkPassword }
                                            disabled={ this.state.loading }
                                        />
                                        { passwordError.length > 0 ? (
                                            <>
                                                <div className="invalid-feedback">{ passwordError }</div>
                                                <div className="invalid-feedback">{ errorGeneral }</div>
                                            </>
                                        ) : '' }
                                        { error ? (
                                            <div className="invalid-feedback">{ errorGeneral }</div>
                                        ) : '' }
                                    </div>
                                    <div className="row flex-center mt-25 mb-25">
                                        <div className="col-md-4 justify-content-left onMobile">
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="custom-control-input"
                                                    id="rememberMe"
                                                    disabled={ this.state.loading }
                                                />
                                                <label className="custom-control-label recordar fs-16" htmlFor="rememberMe">Recordar</label>
                                            </div>
                                        </div>

                                        <div className="col text-centered">
                                            <a className="link-black fs-16" href="#/recuperar-password">¿Olvidaste tu contraseña?</a>
                                        </div>
                                        <div className="col-md-12 col-xs-12 text-centered">
                                            <a className="link-black fs-16" href="#/configurar-cuenta">Necesito configurar mi cuenta</a>
                                        </div>
                                    </div>
                                    <button
                                        className="btn btn-login-form"
                                        onClick={ this.loginAndFoundPermissions }
                                        disabled={ this.state.loading }
                                    >
                                        Iniciar
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
}

const enhance = compose( withFirebase, connect( ( { auth, settings, info } ) => ( { auth, settings, info } ), { updateAuth: actionUpdateAuth, updateInfo: actionUpdateInfo } ) );
export default enhance( Content );

