/**
 * External Dependencies
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
// import Cookies from 'js-cookie';
import { FormGroup, Label, Input, Col, Row, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, 
    InputGroup, Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import axios from 'axios';

import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import { format } from "date-fns";
import isBefore from 'date-fns/isBefore';
registerLocale( 'es', es );

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import Icon from '../icon';
import AutoComplete from 'react-google-autocomplete';
require( 'dotenv' ).config();

// import GoogleMapReact from 'google-map-react';

import './style.scss';

/**
 * Component
 */
class PrimerPaso extends Component {
    constructor( props ) {
        super( props );

        // Set the intiial input values
        this.state = {
            modal: false,
            dropdownOpen: false,
            dropdownOpen2: false,
            dropdownOpen3: false,
            id: null,
            empresas: null,
            perfiles: null,
            empresaEscogida: null,
            perfilEscogido: null,
            nombrePublicacion: '',
            responsable: '',
            inicio: new Date(),
            final: new Date(),
            inicioFormat: null,
            finalFormat: null,
            localizacion: '',
            localizacionMap: {
                lat: 0,
                lng: 0,
                texto: '',
            },
            renderAutoCompletado: true,
            botonAceptarUbicacion: false,
            sueldoVisible: false,
            usarLogo: false,
            compartirWeb: false,
            enviado: false,
            mensajeAviso: '',
        };
        this.toggle = this.toggle.bind( this );
        this.openModal = this.openModal.bind( this );
        this.closeModal = this.closeModal.bind( this );
        this.getEmpresas = this.getEmpresas.bind( this );
        this.getPerfiles = this.getPerfiles.bind( this );
        this.guardarEnLocal = this.guardarEnLocal.bind( this );
        this.obtenerDireccion = this.obtenerDireccion.bind( this );
    }

    componentDidMount() {
        this.setState( {
            id: this.props.datos.id,
            empresaEscogida: this.props.datos.empresa,
            perfilEscogido: this.props.datos.perfil,
            nombrePublicacion: this.props.datos.nombre,
            responsable: this.props.datos.responsable,
            inicio: this.props.datos.inicio,
            final: this.props.datos.final,
            inicioFormat: null,
            finalFormat: null,
            localizacion: this.props.datos.localizacion,
            localizacionMap: {
                lat: this.props.datos.localizacion.lat,
                lng: this.props.datos.localizacion.lng,
                texto: this.props.datos.localizacion.texto,
            },
            sueldoVisible: this.props.datos.sueldoVisible,
            usarLogo: this.props.datos.usarLogo,
            compartirWeb: this.props.datos.compartirWeb,
        }, () => {
            this.getEmpresas();
            this.getPerfiles( this.state.empresaEscogida.id );
        } );
    }

    obtenerDireccion( lat, lng ) {
        const url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&key=AIzaSyCVyB7xjfw1zZ-ZIuHM5G7pyENo5_lwk_A';
        axios.post( url ).then( ( res ) => {
            this.setState( {
                localizacion: res.data.results[ 0 ].formatted_address,
                localizacionMap: {
                    lat: lat,
                    lng: lng,
                    texto: res.data.results[ 0 ].formatted_address, 
                },
                botonAceptarUbicacion: true,
            } );
        } );
    }

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

    // llamada API para traer todas las empresas
    getEmpresas() {
        const data = {
            id: this.props.info.id,
        };
        return axios.post( process.env.REACT_APP_DEVAPI + '/api/hcm/getEmpresas', data ).then( ( res ) => {
            this.setState( {
                empresas: res.data.empresas,
            } );
        } );
    }

    // llamada API para traer todos los permisos
    getPerfiles( idEmpresa ) {
        const data = {
            id: idEmpresa,
        };
        return axios.post( process.env.REACT_APP_DEVAPI + '/api/hcm/getPerfiles', data ).then( ( res ) => {
            this.setState( { 
                ok: res.data.ok,
                perfiles: res.data.data,
            } );
        } );
    }

    guardarEnLocal() {
        if ( this.state.nombrePublicacion.length <= 0 || ! this.state.empresaEscogida || ! this.state.perfilEscogido
            || this.state.responsable.length <= 0 || ! this.state.inicio || ! this.state.final
            || ! this.state.localizacion ) {
            const data = {
                id: this.state.id,
                nombre: this.state.nombrePublicacion,
                empresa: this.state.empresaEscogida,
                perfil: this.state.perfilEscogido,
                responsable: this.state.responsable,
                inicio: this.state.inicio,
                final: this.state.final,
                localizacion: this.state.localizacionMap,
                localizacionMap: this.state.localizacionMap,
                sueldoVisible: this.state.sueldoVisible,
                usarLogo: this.state.usarLogo,
                compartirWeb: this.state.compartirWeb,
                paso1: false,
            };
            this.props.actualizarFormulario( data );
        } else {
            const data = {
                id: this.state.id,
                nombre: this.state.nombrePublicacion,
                empresa: this.state.empresaEscogida,
                perfil: this.state.perfilEscogido,
                responsable: this.state.responsable,
                inicio: this.state.inicio,
                final: this.state.final,
                localizacion: this.state.localizacionMap,
                localizacionMap: this.state.localizacionMap,
                sueldoVisible: this.state.sueldoVisible,
                usarLogo: this.state.usarLogo,
                compartirWeb: this.state.compartirWeb,
                paso1: true,
            };
            // Cookies.set( 'formulario-p1', JSON.stringify( data ), { expires: 1 } );
            this.props.actualizarFormulario( data );
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

    render() {
        if ( this.props.currentStep !== 1 ) {
            return null;
        }

        const {
            responsable,
            nombrePublicacion,
        } = this.state;

        let empresas = null;
        let perfiles = null;
        let inputLocalizacion = null;

        if ( this.state.empresas ) {
            empresas = this.state.empresas.map( ( emp ) => {
                return (
                    <DropdownItem 
                        onClick={ () => {
                            this.setState( {
                                empresaEscogida: Object.assign( {}, emp ),
                            }, () => {
                                this.guardarEnLocal();
                                this.getPerfiles( emp.id );
                            } );
                        } } 
                        key={ emp.id }>
                        { emp.razon_social }
                    </DropdownItem>
                );
            } );
        }

        if ( this.state.perfiles ) {
            perfiles = this.state.perfiles.map( ( perfil ) => {
                return (
                    <DropdownItem 
                        onClick={ () => {
                            this.setState( {
                                perfilEscogido: Object.assign( {}, perfil ),
                            }, () => {
                                this.guardarEnLocal();
                            } );
                        } } 
                        key={ perfil.id }>
                        { perfil.nombre }
                    </DropdownItem>
                );
            } );
        }

        inputLocalizacion = <AutoComplete
            apiKey={ 'AIzaSyCVyB7xjfw1zZ-ZIuHM5G7pyENo5_lwk_A' }
            style={ { minHeight: '36px',
                padding: '7.5px 17px 9px',
                backgroundColor: '#fbfcfc',
                border: 'none',
                borderRadius: '0px',
                borderBottom: '1px solid gray', 
            } }
            defaultValue={ this.state.localizacionMap.texto }
            onPlaceSelected={ ( place ) => {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                this.setState( {
                    localizacion: place.formatted_address,
                    localizacionMap: {
                        lat: lat,
                        lng: lng,
                        texto: place.formatted_address,
                    },
                }, () => {
                    this.guardarEnLocal();
                } );                    
            } }
            options={ {
                types: [ "geocode", "establishment" ],
            } }
        />;

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
                                <h2>{ this.state.mensajeAviso }</h2>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button className="btn-feelrouk-naranja" onClick={ () => this.closeModal( 1 ) }>Cerrar</Button>
                    </ModalFooter>
                </Modal>

                <h2 className="mt-30">Editar datos de la publicación</h2>
                <Row>
                    <Col className="ml-10">
                        <Row>
                            <Col md="12" xs="12">
                                <div className="form-group mt-30">
                                    <Label for="publicacion" className="mb-3">Nombre de Publicación *</Label>
                                    <Input type="text" name="publicacion" 
                                        className="input-hcm-formulario"
                                        value={ nombrePublicacion }
                                        onChange={ ( e ) => {
                                            const final = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡_|+\=?;:'"<>\{\}\[\]\\\/]/gi, '' );
                                            this.setState( {
                                                nombrePublicacion: final,
                                            }, () => {
                                                this.guardarEnLocal();
                                            } );
                                        } } />
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col md="6" xs="12">
                                <div className="form-group">
                                    <Label for="empresas">Seleccione Empresa *</Label>
                                    <Dropdown name="empresas" className="formulario-hcm-dropdown" isOpen={ this.state.dropdownOpen } toggle={ () => this.toggle( 1 ) }>
                                        <DropdownToggle caret>
                                            { this.state.empresaEscogida ? this.state.empresaEscogida.razon_social : "Seleccionar" }
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            { empresas }
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>

                                <div className="form-group">
                                    <Label for="perfiles">Seleccione Perfil *</Label>
                                    <Dropdown name="perfiles" className="formulario-hcm-dropdown" isOpen={ this.state.dropdownOpen2 } toggle={ () => this.toggle( 2 ) }>
                                        <DropdownToggle caret>
                                            { this.state.perfilEscogido ? this.state.perfilEscogido.nombre : "Seleccionar" }
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            { perfiles }
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>

                                <FormGroup className="datepickers">
                                    <Label>Fin de Publicación *</Label>
                                    <DatePicker
                                        id="inicio-publicacion"
                                        locale="es"
                                        value={ this.state.final }
                                        onChange={ ( value ) => {
                                            const dateFormatted = format( value, "dd/MM/yyyy" );
                                            const today = new Date();
                                            const rightNow = new Date( value );
                                            if ( isBefore( rightNow, today ) ) {
                                                this.setState( {
                                                    mensajeAviso: 'No se puede escoger una fecha anterior a hoy',
                                                }, () => {
                                                    this.openModal( 1 );
                                                } );
                                            } else {
                                                this.setState( {
                                                    final: dateFormatted,
                                                }, () => {
                                                    this.guardarEnLocal();
                                                } );
                                            }
                                        } }
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="6" xs="12">
                                <Label for="localizacion" className="mb-3">Localización</Label>
                                <InputGroup className="localizacion">
                                    { inputLocalizacion }
                                    <div className="boton-googlemaps">
                                        <FontAwesomeIcon icon={ faMapMarkerAlt } />
                                    </div>
                                </InputGroup>

                                <div className="form-group mt-30">
                                    <Label for="encargado" className="mb-3">Responsable *</Label>
                                    <Input type="email" name="encargado" 
                                        className="input-hcm-formulario"
                                        value={ responsable }
                                        onChange={ ( e ) => {
                                            const final = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                            this.setState( {
                                                responsable: final,
                                            }, () => {
                                                this.guardarEnLocal();
                                            } );
                                        } } />
                                </div>

                                <div className="mt-20"></div>
                                <FormGroup check>
                                    <Label check>
                                        <Input type="checkbox" 
                                            name="radio1"
                                            checked={ this.state.sueldoVisible }
                                            isselected={ this.state.sueldoVisible.toString() }
                                            onChange={ () => {
                                                const final = ! this.state.sueldoVisible;
                                                this.setState( {
                                                    sueldoVisible: final,
                                                }, () => {
                                                    this.guardarEnLocal();
                                                } );
                                            } }
                                        />{ ' ' }
                                        Sueldo visible en la publicación
                                    </Label>
                                </FormGroup>

                                <div className="mt-5"></div>
                                <FormGroup check>
                                    <Label check>
                                        <Input type="checkbox" 
                                            name="radio1"
                                            checked={ this.state.usarLogo }
                                            isselected={ this.state.usarLogo.toString() }
                                            onChange={ () => {
                                                const final = ! this.state.usarLogo;
                                                this.setState( {
                                                    usarLogo: final,
                                                }, () => {
                                                    this.guardarEnLocal();
                                                } );
                                            } }
                                        />{ ' ' }
                                        Utilizar Logo de la empresa
                                    </Label>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Col>
                    <Col lg="6" sm="12">
                        <Row>
                            <Col lg="6" className="recuadro-info-formulario">
                                <h3>Lorem ipsum dolor sit amet, consectetur adipiscing elit</h3>
                                <p>
                                    Morbi mattis maximus tortor, quis maximus dolor malesuada id. 
                                    Sed sit amet ex mattis, sagittis orci maximus, facilisis ipsum. Proin fermentum, est sed convallis accumsan
                                </p>
                            </Col>
                        </Row>
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
) )( PrimerPaso );
