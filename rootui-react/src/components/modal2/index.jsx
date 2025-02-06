import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changeModal as actionChangeModal, updateAuth as actionUpdateAuth } from '../../actions';
import { Modal, Button } from 'react-bootstrap';

import './style.scss';

require( 'dotenv' ).config();

class Modal2 extends Component {
    constructor( props ) {
        super( props );
        this.handleClose = this.handleClose.bind( this );
        this.handleShow = this.handleShow.bind( this );
        this.state = {
            bool: false,
            time: 0,
        };
        this.timer = null;
    }

    componentDidUpdate( prevProps ) {
        const { modal, auth } = this.props;

        if ( modal !== prevProps.modal
            && auth.token.length === 0 
            && parseInt( window.localStorage.getItem( 'countDown' ) ) < 3 ) {
            this.setState( { bool: false, time: 0 } );
        }
        if ( modal !== prevProps.modal
            && auth.token.length > 0 
            && parseInt( window.localStorage.getItem( 'countDown' ) ) > 9 ) {
            this.setState( { bool: modal } );
        }
    }

    componentWillUnmount() {
        clearInterval( this.timer );
    }

    componentDidMount() {
        const { modal } = this.props;
        this.timer = setInterval( () => {
            this.setState( { time: parseInt( window.localStorage.getItem( 'countDown' ) ) - 1 } );
        }, 1000 );

        if ( parseInt( window.localStorage.getItem( 'countDown' ) ) <= 2 ) {
            this.setState( { bool: false } );
        } else {
            this.setState( { bool: modal } );
        }
    }

    handleClose() {
        actionChangeModal( false );
        this.setState( { bool: false } );
        this.props.updateAuth( {
            token: '',
        } );
        window.localStorage.setItem( 'countDown', 0 );
    }
    handleShow() {
        window.localStorage.setItem( 'countDown', parseInt( window.localStorage.getItem( 'countDown' ) ) + 300 );
        actionChangeModal( false );
        this.setState( { bool: false } );
    }

    render() {
        const { settings } = this.props;
        return (
            <Modal show={ this.state.bool } onHide={ this.handleClose } 
                backdrop="static" keyboard={ false } dialogClassName="feelrouk-modal">
                <Modal.Header className="header-blanco">
                    <img src={ settings.img_feelrouk.modal } alt={ "logo, tiempo de sesion" } className="tiempo-sesion" />
                </Modal.Header>
                <Modal.Body>
                    <Modal.Title>TU SESIÓN EXPIRA EN</Modal.Title>
                    <div className="tiempo-recorrido">
                        <div className="numero"> { this.state.time } </div>
                        <div className="segundos"> { 'Segundos' } </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="seguir-sesion" variant="primary" onClick={ this.handleShow }>
                        CONTINUAR TRABAJANDO
                    </Button>
                    <Button className="cerrar-sesion" variant="secondary" onClick={ this.handleClose }>
                        SALIR
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default connect( ( { modal, auth, settings } ) => (
    {
        modal,
        auth,
        settings,
    }
), {
    updateAuth: actionUpdateAuth,
    changeModal: actionChangeModal,
} )( Modal2 );
