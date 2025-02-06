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
import { isValidEmail } from '../../utils';
// import { updateAuth as actionUpdateAuth } from './actions';

require( 'dotenv' ).config();
/**
 * Internal Dependencies
 */
// import Icon from '../../components/icon';
// import { isValidEmail } from '../../utils';

/**
 * Component
 */
class Content extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            cliente: null,
            email: '',
            emailError: '',
            loading: false,
            redirect: false,
            modal: false,
            modal2: false,
            mensaje: '',
        };

        this.checkEmail = this.checkEmail.bind( this );
        this.settings = setting;
        this.checkEverythingBefore = this.checkEverythingBefore.bind( this );
        this.renderForm = this.renderForm.bind( this );
        this.openModal = this.openModal.bind( this );
        this.closeModal = this.closeModal.bind( this );
        this.redireccionar = this.redireccionar.bind( this );
        this.enviarLink = this.enviarLink.bind( this );
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

    enviarLink() {
        const data = {
            email: this.state.email,
        };
        axios.get( process.env.REACT_APP_LOCAL + '/api/clientes/getByEmail/' + data.email ).then( ( res ) => {
            if ( res.data.ok ) {
                data.id = res.data.data.cliente.id;

                const email = res.data.data.cliente.email;

                this.props.firebase.doPasswordReset( email )
                    .then( () => {
                        this.setState( {
                            mensaje: 'Se ha enviado un link a su correo. Por favor, espere unos 5 minutos y revise su bandeja.',
                        } );
                        this.openModal( 1 );
                    } )
                    .catch( error => {
                        console.log( error );
                        if ( error ) {
                            this.setState( {
                                mensaje: 'Hubo un error enviando su correo. Inténtelo más tarde.',
                            } );
                            this.openModal( 2 );
                        }
                    } );
            } else {
                this.setState( {
                    mensaje: 'No se ha encontrado ningún cliente registrado con ese email. Por favor, contacte al administrador si está interesado en trabajar con nosotros.',
                } );
                this.openModal( 2 );
            }
        } ).catch( ( error ) => {
            console.log( error );
            this.setState( {
                mensaje: 'No se ha encontrado ningún cliente registrado con ese email. Por favor, contacte al administrador si está interesado en trabajar con nosotros.',
            } );
            this.openModal( 2 );
        } );
    }

    async checkEverythingBefore() {
        const validation = this.checkEmail();

        if ( validation ) {
            try {
                this.setState( { loading: true } );
                this.enviarLink();
            } catch ( error ) {
                console.log( error );
            }

            // enviar al servidor y registrar al usuario
        } else {
            this.setState( {
                mensaje: 'Debe escribir un email válido',
            } );
            this.openModal( 2 );
        }
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
            email,
            emailError,
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
                                <h3>Recupere su contraseña</h3>
                                <div className="login-form">
                                    <div className="form-group mb-40">
                                        <input
                                            type="email"
                                            className={ classnames( 'form-control', { 'is-invalid': emailError } ) }
                                            placeholder="Email"
                                            value={ email }
                                            onChange={ ( e ) => {
                                                this.setState( {
                                                    email: e.target.value,
                                                }, emailError ? this.checkEmail : () => {} );
                                            } }
                                            onBlur={ this.checkEmail }
                                            disabled={ this.state.loading }
                                        />
                                    </div>
                                    <button
                                        className="btn btn-login-form"
                                        onClick={ this.checkEverythingBefore }
                                        disabled={ this.state.loading }
                                    >
                                        Enviar link
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

const enhance = compose( withFirebase, connect( ( { settings, info } ) => ( { settings, info } ) ) );
export default withRouter( enhance( Content ) );

// export default connect( ( { settings } ) => (
//     {
//         settings,
//     }
// ) )( Content );

