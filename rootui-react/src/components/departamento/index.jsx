import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames/dedupe';
import axios from 'axios';
import { Modal, ModalFooter, ModalHeader, ModalBody, Button, Row, Col, Label, Spinner } from 'reactstrap';
import Icon from '../../components/icon';
import './style.scss';
require( 'dotenv' ).config();

class CrearDepartamento extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            modal: false,
            modal2: false,
            nombre: '',
            nombreError: '',
            mensajeAviso: '',
            empresas: null,
        };

        this.openModal = this.openModal.bind( this );
        this.closeModal = this.closeModal.bind( this );
        this.renderFormulario = this.renderFormulario.bind( this );
        this.guardarDepartamento = this.guardarDepartamento.bind( this );
        this.getAllCompanies = this.getAllCompanies.bind( this );
        this.escogerEmpresa = this.escogerEmpresa.bind( this );
    }

    componentDidMount() {
        this.getAllCompanies();
    }

    getAllCompanies() {
        return axios.get( process.env.REACT_APP_LOCAL + '/api/company/getAll' ).then( ( res ) => {
            this.setState( { 
                ok: res.data.ok,
                empresas: res.data.data,
            } );
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
            this.setState( { modal: false } );
            break;
        case 2:
            this.setState( { modal2: false } );
            break;
        default:
            break;
        }
    }

    renderFormulario() {
        const {
            nombre,
            nombreError,
        } = this.state;

        return (
            <Col>
                <div className="container-form-staff">
                    <h2>Datos del departamento</h2>
                    <Label for="Nombre">Nombre</Label>
                    <input
                        type="text"
                        className={ classnames( 'form-control', { 'is-invalid': nombreError } ) }
                        id="Nombre"
                        value={ nombre }
                        onChange={ ( e ) => {
                            const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                            this.setState( {
                                nombre: nuevo,
                                nombreError: '',
                            } );
                        } }
                    />
                    { nombreError ? (
                        <div className="invalid-feedback">{ nombreError }</div>
                    ) : '' }
                    <br></br>
                    <button
                        className="btn btn-feelrouk centrar-boton"
                        onClick={ this.guardarDepartamento }
                        disabled={ this.state.loading }>
                        Guardar departamento
                        { this.state.loading ? (
                            <Spinner />
                        ) : '' }
                    </button>
                </div>
            </Col>
        );
    }

    guardarDepartamento() {
        // comprobando primero la data

        if ( this.state.nombre.length <= 0 ) {
            this.setState( {
                nombreError: 'El nombre es necesario',
            } );
            return;
        }
        if ( ! this.state.empresaEscogida ) {
            this.setState( {
                mensajeAviso: 'Debe escoger una empresa',
                icono: false,
            } );
            this.openModal( 2 );
            return;
        }

        const data = {
            nombre: this.state.nombre,
            relEmpresa: this.state.empresaEscogida.id,
        };

        axios.post( process.env.REACT_APP_LOCAL + '/api/departamentos/nuevo', data ).then( ( res ) => {
            if ( res.data.ok ) {
                this.setState( {
                    loading: false,
                    nombre: '',
                    modal: false,
                    mensajeAviso: 'Departamento creado satisfactoriamente',
                    icono: true,
                } );
                this.openModal( 2 );
                this.getAll();
            }
        } ).catch( ( e ) => {
            console.log( e );
        } );
    }

    escogerEmpresa( e ) {
        if ( e.target.value ) {
            const id = e.target.value;
            const empresa = this.state.empresas.find( ( emp ) => {
                return emp.id === id;
            } );

            if ( empresa ) {
                this.setState( {
                    empresaEscogida: empresa,
                } );
            }
        }
    }

    render() {
        let empresasParaDropdown = null;

        // renderizando los dropdowns
        if ( this.state.empresas ) {
            // array empresas para obtener perfiles y activarlos / desactivarlos
            empresasParaDropdown = this.state.empresas.map( ( empresa ) => {
                return (
                    <option key={ empresa.id } value={ empresa.id }>{ empresa.nombre }</option>
                    // <DropdownItem 
                    //     onClick={ () => {
                    //     } } 
                    //     key={ empresa.id }>
                    //     { empresa.nombre }
                    // </DropdownItem>
                );
            } );
        }

        return (
            <Fragment>
                <Modal isOpen={ this.state.modal } toggle={ () => this.closeModal( 1 ) }>
                    <ModalHeader
                        toggle={ () => this.closeModal( 1 ) }>Crear departamento</ModalHeader>
                    <ModalBody>
                        <Row>
                            <select className="form-control" id="empresas" onBlur={ this.escogerEmpresa } onChange={ this.escogerEmpresa }>
                                { empresasParaDropdown }
                            </select>
                        </Row>
                        <br></br>
                        <Row className="vertical-gap d-flex justify-content-center">
                            { this.renderFormulario() }
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button className="btn-feelrouk-naranja" onClick={ () => this.closeModal( 1 ) }>Cerrar</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={ this.state.modal2 } toggle={ () => this.closeModal( 2 ) }>
                    <ModalHeader
                        toggle={ () => this.closeModal( 2 ) }>Aviso</ModalHeader>
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
                        <Button className="btn-feelrouk-naranja" onClick={ () => this.closeModal( 2 ) }>Salir</Button>
                    </ModalFooter>
                </Modal>

                <Button className="btn btn-feelrouk" 
                    onClick={ () => { 
                        this.openModal( 1 ); 
                    } }
                >Crear departamento</Button>
            </Fragment>
        );
    }
}

export default connect( ( { settings } ) => (
    {
        settings,
    }
), {} )( CrearDepartamento );
