/**
 * External Dependencies
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Spinner, Row, Col, Label, Button, Modal, ModalFooter, 
    ModalHeader, ModalBody, FormGroup, Input } from 'reactstrap';
import { MensajeBloqueo } from '../../components/no-permisos';
import Icon from '../../components/icon';
import axio from '../../components/instancia-axios';
import Select from 'react-select';
import agregar from '../../../common-assets/images/vcm/plus-circle.svg';
import borrar from '../../../common-assets/images/vcm/x-circle.svg';
import { Link } from 'react-router-dom';
require( 'dotenv' ).config();
import axios from 'axios';

/**
 * Internal Dependencies
 */
import './style.scss';

/**
 * Component
 */
class ContentPasos extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            loading: false,
            empresas: null,
            pasoTemp: '',
            pasos: [],
            rangeValues: [ 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100 ],
            currentRangeDatos: 0,
            currentRangeRegistro: 0,
            currentRangeCV: 0,
            currentRangeDocumentos: 0,
            currentRangeTags: 0,
            alertaPorcentaje: false,
            porcentajes: null,
            idPorcentaje: null,
        };

        this.getEmpresas = this.getEmpresas.bind( this );
        this.getPorcentajes = this.getPorcentajes.bind( this );
        this.agregarPaso = this.agregarPaso.bind( this );
        this.eliminarPaso = this.eliminarPaso.bind( this );
        this.cargarLista = this.cargarLista.bind( this );
        this.guardarTodo = this.guardarTodo.bind( this );
        this.escogerEmpresa = this.escogerEmpresa.bind( this );
        this.escogerPublicacion = this.escogerPublicacion.bind( this );
        this.conteoDeCurrent = this.conteoDeCurrent.bind( this );
        this.calcularMax = this.calcularMax.bind( this );
        this.renderOptions = this.renderOptions.bind( this );
        this.manejarEcualizadores = this.manejarEcualizadores.bind( this );
        this.renderEcualizadores = this.renderEcualizadores.bind( this );
        this.guardarPorcentajes = this.guardarPorcentajes.bind( this );
    }

    componentDidMount() {
        this.getEmpresas();
    }

    // llamada API para traer todas las empresas (cuando se usa el dropdown)
    getEmpresas() {
        const data = {
            id: this.props.info.id,
        };
        return axio.post( '/api/hcm/getEmpresas', data ).then( ( res ) => {
            this.setState( {
                empresas: res.data.empresas,
            } );
        } );
    }

    // llamada API para traer una publicación por id
    getPorcentajes() {
        return axios.get( process.env.REACT_APP_LOCAL + '/api/hcm/getPorcentajePublicacion/' + this.state.publicacionEscogida.id ).then( ( res ) => {
            if ( res.data.ok ) {
                const temp = JSON.parse( res.data.data.datos );
                this.setState( { 
                    porcentajes: temp,
                    idPorcentaje: res.data.data.id,
                } );
            }
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

    escogerEmpresa( id ) {
        const encontrada = this.state.empresas.find( ( empresa ) => {
            return empresa.id === id;
        } );

        const data = {
            id,
        };

        return axio.post( '/api/hcm/getByEmpresa', data ).then( ( res ) => {
            this.setState( { 
                empresaEscogida: encontrada,
                publicaciones: res.data.data,
            } );
        } );
    }

    escogerPublicacion( id ) {
        const found = this.state.publicaciones.find( ( pub ) => {
            return pub.id === id;
        } );
        this.setState( {
            publicacionEscogida: found,
        }, () => {
            this.getPorcentajes();
        } );
    }

    agregarPaso() {
        const pasosTemp = this.state.pasos.slice();
        const nuevo = {
            id: Math.ceil( Math.random() * ( ( 9999 - 1 ) + 1 ) ),
            nombre: this.state.pasoTemp,
        };
        pasosTemp.push( nuevo );
        this.setState( {
            pasoTemp: '',
            pasos: pasosTemp,
        } );
    }

    cargarLista() {
        const final = [];
        final.push( this.state.pasos.map( ( paso ) => {
            return (
                <div className="pasos-lista" key={ paso.id }>
                    <div style={ { width: '85%' } }>{ paso.nombre }</div>
                    <Button className="btn btn-datatable" onClick={ () => {
                        this.eliminarPaso( paso.id );
                    } }>
                        <img alt="eliminar" style={ { width: "25px" } } src={ borrar } />
                    </Button>
                </div>
            );
        } ) );

        return final;
    }

    eliminarPaso( id ) {
        const arr = this.state.pasos.filter( ( paso ) => {
            return paso.id !== id;
        } );

        this.setState( {
            pasos: arr,
        } );
    }

    calcularMax( tipo ) {
        const total = parseInt( this.conteoDeCurrent( tipo ) );
        return parseInt( 100 - total );
    }

    renderOptions() {
        const data = [];
        for ( let step = 0; step <= 20; step++ ) {
            data.push( <option>{ step }</option> );
        }

        return data;
    }

    manejarEcualizadores( e, tipo ) {
        const sumatoria = this.conteoDeCurrent( tipo );
        if ( tipo === 'datos' ) {
            const total = parseInt( sumatoria ) + parseInt( e.target.value );
            if ( total <= 100 ) {
                if ( this.state.porcentajes ) {
                    const temp = Object.assign( {}, this.state.porcentajes );
                    temp.datosBasicos = parseInt( e.target.value );
                    this.setState( {
                        alertaPorcentaje: false,
                        porcentajes: temp,
                    } );
                } else {
                    this.setState( {
                        alertaPorcentaje: false,
                        currentRangeDatos: parseInt( e.target.value ),
                    } );
                }
            }
        }
        if ( tipo === 'cv' ) {
            const total = parseInt( sumatoria ) + parseInt( e.target.value );
            if ( total <= 100 ) {
                if ( this.state.porcentajes ) {
                    const temp = Object.assign( {}, this.state.porcentajes );
                    temp.cv = parseInt( e.target.value );
                    this.setState( {
                        alertaPorcentaje: false,
                        porcentajes: temp,
                    } );
                } else {
                    this.setState( {
                        alertaPorcentaje: false,
                        currentRangeCV: parseInt( e.target.value ),
                    } );
                }
            }
        }
        if ( tipo === 'documentos' ) {
            const total = parseInt( sumatoria ) + parseInt( e.target.value );
            if ( total <= 100 ) {
                if ( this.state.porcentajes ) {
                    const temp = Object.assign( {}, this.state.porcentajes );
                    temp.documentos = parseInt( e.target.value );
                    this.setState( {
                        alertaPorcentaje: false,
                        porcentajes: temp,
                    } );
                } else {
                    this.setState( {
                        alertaPorcentaje: false,
                        currentRangeDocumentos: parseInt( e.target.value ),
                    } );
                }
            }
        }
        if ( tipo === 'registro' ) {
            const total = parseInt( sumatoria ) + parseInt( e.target.value );
            if ( total <= 100 ) {
                if ( this.state.porcentajes ) {
                    const temp = Object.assign( {}, this.state.porcentajes );
                    temp.registro = parseInt( e.target.value );
                    this.setState( {
                        alertaPorcentaje: false,
                        porcentajes: temp,
                    } );
                } else {
                    this.setState( {
                        alertaPorcentaje: false,
                        currentRangeRegistro: parseInt( e.target.value ),
                    } );
                }
            }
        }
        if ( tipo === 'tags' ) {
            const total = parseInt( sumatoria ) + parseInt( e.target.value );
            if ( total <= 100 ) {
                if ( this.state.porcentajes ) {
                    const temp = Object.assign( {}, this.state.porcentajes );
                    temp.tags = parseInt( e.target.value );
                    this.setState( {
                        alertaPorcentaje: false,
                        porcentajes: temp,
                    } );
                } else {
                    this.setState( {
                        alertaPorcentaje: false,
                        currentRangeTags: parseInt( e.target.value ),
                    } );
                }
            }
        }
    }

    conteoDeCurrent( tipo ) {
        let total = 0;
        const datos = this.state.porcentajes ? this.state.porcentajes.datosBasicos : this.state.currentRangeDatos;
        const cv = this.state.porcentajes ? this.state.porcentajes.cv : this.state.currentRangeCV;
        const registro = this.state.porcentajes ? this.state.porcentajes.registro : this.state.currentRangeRegistro;
        const documentos = this.state.porcentajes ? this.state.porcentajes.documentos : this.state.currentRangeDocumentos;
        const tags = this.state.porcentajes ? this.state.porcentajes.tags : this.state.currentRangeTags;

        if ( tipo === 'datos' ) {
            total = cv + registro + tags + documentos;
        }
        if ( tipo === 'registro' ) {
            total = cv + datos + tags + documentos;
        }
        if ( tipo === 'cv' ) {
            total = datos + registro + tags + documentos;
        }
        if ( tipo === 'documentos' ) {
            total = cv + registro + tags + datos;
        }
        if ( tipo === 'tags' ) {
            total = cv + registro + datos + documentos;
        }
        if ( tipo === 'todo' ) {
            total = cv + registro + tags + documentos + datos;
        }

        return parseInt( total );
    }

    renderEcualizadores() {
        let alerta = null;
        const datosBasicos = this.state.porcentajes ? this.state.porcentajes.datosBasicos : this.state.currentRangeDatos;
        const cv = this.state.porcentajes ? this.state.porcentajes.cv : this.state.currentRangeCV;
        const registro = this.state.porcentajes ? this.state.porcentajes.registro : this.state.currentRangeRegistro;
        const documentos = this.state.porcentajes ? this.state.porcentajes.documentos : this.state.currentRangeDocumentos;
        const tags = this.state.porcentajes ? this.state.porcentajes.tags : this.state.currentRangeTags;
        const final = this.state.porcentajes ? "Editar" : "Guardar";

        if ( this.state.alertaPorcentaje ) {
            alerta = <span className="alerta-ecualizador">Debe completar el 100% entre todas las opciones</span>;
        }

        const porcentajeDatos = datosBasicos + ' %';
        const porcentajeCV = cv + ' %';
        const porcentajeRegistro = registro + ' %';
        const porcentajeDocumentos = documentos + ' %';
        const porcentajeTags = tags + ' %';

        const html = <div className="popup-porcentajes">
            <FormGroup>
                <Label>Datos básicos</Label>
                <Input
                    onChange={ ( e ) => this.manejarEcualizadores( e, 'datos' ) }
                    type={ 'range' }
                    min={ 0 }
                    defaultValue={ datosBasicos }
                    max={ this.calcularMax( 'datos' ) }
                    step={ 5 }
                    list={ "tick-list" } />
                <datalist id="tick-list">
                    { this.renderOptions() }
                </datalist>
                <span id="output">{ porcentajeDatos }</span>
            </FormGroup>
            <FormGroup>
                <Label>CV</Label>
                <Input
                    onChange={ ( e ) => this.manejarEcualizadores( e, 'cv' ) }
                    type={ 'range' }
                    min={ 0 }
                    defaultValue={ cv }
                    max={ this.calcularMax( 'cv' ) }
                    step={ 5 }
                    list={ "tick-list" } />
                <datalist id="tick-list">
                    { this.renderOptions() }
                </datalist>
                <span id="output">{ porcentajeCV }</span>
            </FormGroup>
            <FormGroup>
                <Label>Registro TakenJobs</Label>
                <Input
                    onChange={ ( e ) => this.manejarEcualizadores( e, 'registro' ) }
                    type={ 'range' }
                    min={ 0 }
                    defaultValue={ registro }
                    max={ this.calcularMax( 'registro' ) }
                    step={ 5 }
                    list={ "tick-list" } />
                <datalist id="tick-list">
                    { this.renderOptions() }
                </datalist>
                <span id="output">{ porcentajeRegistro }</span>
            </FormGroup>
            <FormGroup>
                <Label>Documentos solicitados</Label>
                <Input
                    onChange={ ( e ) => this.manejarEcualizadores( e, 'documentos' ) }
                    type={ 'range' }
                    min={ 0 }
                    defaultValue={ documentos }
                    max={ this.calcularMax( 'documentos' ) }
                    step={ 5 }
                    list={ "tick-list" } />
                <datalist id="tick-list">
                    { this.renderOptions() }
                </datalist>
                <span id="output">{ porcentajeDocumentos }</span>
            </FormGroup>
            <FormGroup>
                <Label>Match de Tags</Label>
                <Input
                    onChange={ ( e ) => this.manejarEcualizadores( e, 'tags' ) }
                    type={ 'range' }
                    min={ 0 }
                    defaultValue={ tags }
                    max={ this.calcularMax( 'tags' ) }
                    step={ 5 }
                    list={ "tick-list" } />
                <datalist id="tick-list">
                    { this.renderOptions() }
                </datalist>
                <span id="output">{ porcentajeTags }</span>
            </FormGroup>
            <Row className="mt-10 mb-20 justify-content-center">
                <Col lg="10">
                    <span>Recuerde que al presionar -Guardar- estará grabando los porcentajes en la base de datos.</span>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Button className="btn-feelrouk-naranja2" onClick={ () => {
                    const total = this.conteoDeCurrent( 'todo' );
                    if ( total < 100 ) {
                        this.setState( {
                            alertaPorcentaje: true,
                        } );
                    } else {
                        this.setState( {
                            modal2: false,
                        }, () => {
                            this.guardarPorcentajes();
                        } );
                    }
                } }>{ final }</Button>  
            </Row>
            <Row className="justify-content-center mt-20">
                { alerta }
            </Row>
        </div>;

        return html;
    }

    guardarTodo() {
        console.log( this.state.pasos );
    }

    guardarPorcentajes() {
        if ( ! this.state.porcentajes ) {
            const data = {
                datosBasicos: this.state.currentRangeDatos,
                cv: this.state.currentRangeCV,
                documentos: this.state.currentRangeDocumentos,
                registro: this.state.currentRangeRegistro,
                tags: this.state.currentRangeTags,
            };

            const final = JSON.stringify( data );

            const aEnviar = {
                relEmpresa: this.state.empresaEscogida.id,
                relPublicacion: this.state.publicacionEscogida.id,
                datos: final, 
            };

            axios.post( process.env.REACT_APP_LOCAL + '/api/hcm/crearPorcentajes', aEnviar ).then( ( res ) => {
                if ( res.data.ok ) {
                    const temp = JSON.parse( res.data.data.datos );
                    this.setState( {
                        porcentajes: temp,
                        icono: true,
                        modal2: false,
                        modal1: true,
                        mensajeAviso: "Porcentajes guardados satisfactoriamente.",
                    } );
                }
            } );
        } else {
            const final = JSON.stringify( this.state.porcentajes );

            const aEnviar = {
                id: this.state.idPorcentaje,
                datos: final, 
            };
            axios.post( process.env.REACT_APP_LOCAL + '/api/hcm/editarPorcentajes', aEnviar ).then( ( res ) => {
                if ( res.data.ok ) {
                    const temp = JSON.parse( res.data.data.datos );
                    this.setState( {
                        porcentajes: temp,
                        icono: true,
                        modal2: false,
                        modal1: true,
                        mensajeAviso: "Porcentajes editados satisfactoriamente.",
                    } );
                }
            } );
        }
    }

    render() {
        let selectPublicacion = null;
        let botonEcualizador = null;
        let ecualizador = null;
        const publicaciones = [];

        if ( this.props.info.jerarquia !== "administrador" && this.props.info.permisos.includes( 'seleccion' ) ) {
            const empresas = [];
            const { pasoTemp } = this.state;
            let listaPasos = null;

            // renderizamos el dropdown de empresas
            if ( this.state.empresas ) {
                this.state.empresas.forEach( ( emp ) => {
                    empresas.push( { value: emp.id, label: emp.razon_social } );
                } );
            }
            if ( this.state.publicaciones ) {
                this.state.publicaciones.forEach( ( emp ) => {
                    publicaciones.push( { value: emp.id, label: emp.nombre } );
                } );
            }
            if ( this.state.pasos.length > 0 ) {
                listaPasos = this.cargarLista();
            }
            if ( this.state.empresaEscogida ) {
                selectPublicacion = <div className="mt-30">
                    <h3 className="mb-20">Seleccione una publicación de trabajo:</h3>
                    <Label>Seleccione</Label>
                    <Select
                        className="dropdown-feelrouk"
                        name="escoja-empresa"
                        options={ publicaciones }
                        defaultValue={ { label: "Seleccione una publicación", value: 0 } }
                        onChange={ ( e ) => {
                            this.escogerPublicacion( e.value );
                        } }
                    />
                </div>;
            }
            if ( this.state.publicacionEscogida ) {
                botonEcualizador = <Button className="btn-feelrouk-naranja2" onClick={
                    () => {
                        this.setState( {
                            modal2: true,
                        } );
                    } 
                }>{ this.state.porcentajes ? "Editar porcentajes" : "Crear porcentajes" }</Button>;

                ecualizador = this.renderEcualizadores();
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

                    <Modal isOpen={ this.state.modal2 } toggle={ () => { 
                        this.closeModal( 2 );
                    } }>
                        <ModalHeader
                            toggle={ () => { 
                                this.closeModal( 2 );
                            } }>Editar porcentajes de evaluación
                        </ModalHeader>
                        <ModalBody>
                            <Row className="vertical-gap d-flex justify-content-center">
                                <Col lg="10" className="justify-content-center text-centered">
                                    { ecualizador }
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button className="btn-feelrouk" onClick={ () => this.closeModal( 2 ) }>Cerrar</Button>
                        </ModalFooter>
                    </Modal>

                    <Row className="mb-30 mt-20">
                        <Col lg="4" sm="4" xs="12">
                            <Link to={ '/' } style={ { display: 'flex', 'align-items': 'center' } }>
                                <img style={ { height: '25px', 'margin-right': '20px' } } src={ require( "../../../common-assets/images/hcm/back-arrow.png" ) } alt="" />
                                <h3 className="texto-back">Volver atrás</h3>
                            </Link>
                        </Col>
                    </Row>

                    <Row className="mb-20">
                        <Col className="ml-25 separador-bottom">
                            <div className="contenedor-flex">
                                <img src={ require( "../../../common-assets/images/hcm/price-tag.png" ) } alt="" />
                                <div className="contenedor-hijo">
                                    <h2>Selección - Cargar pasos por empresa</h2>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row className="ml-20 mt-40">
                        <Col lg="4" sm="12" xs="12">
                            <h3 className="mb-20">Seleccione una empresa:</h3>
                            <Label>Seleccione</Label>
                            <Select
                                className="dropdown-feelrouk"
                                name="escoja-empresa"
                                options={ empresas }
                                defaultValue={ { label: "Seleccione una empresa", value: 0 } }
                                onChange={ ( e ) => {
                                    this.escogerEmpresa( e.value );
                                } }
                            />
                            { selectPublicacion }
                            <Row className="mt-40 justify-content-center">
                                { botonEcualizador }
                            </Row>
                        </Col>
                        <Col lg="5" sm="12" xs="12">
                            <div className="linea-costados">
                                <h3>Agregar pasos al proceso de selección:</h3>
                                <Label>Agregar</Label>
                                <div className="d-flex">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nuevoPaso"
                                        value={ pasoTemp }
                                        onChange={ ( e ) => {
                                            const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¡_|+\-=;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                            this.setState( {
                                                pasoTemp: nuevo,
                                            } );
                                        } }
                                    />
                                    <button
                                        className="btn btn-permiso justify-content-center"
                                        onClick={ ( e ) => {
                                            e.preventDefault();
                                            this.agregarPaso();
                                        } }>
                                        <img alt="agregar" src={ agregar } />
                                    </button>
                                </div>
                                <div>
                                    { this.state.pasos.length > 0 ? <h3 className="pl-5 mt-10 mb-10">Pasos</h3> : null }
                                    <div>
                                        { listaPasos }
                                    </div>
                                </div>

                                <div style={ { display: 'flex', justifyContent: 'end' } } className="mt-20">
                                    <Button className="btn-feelrouk2" 
                                        onClick={ this.guardarTodo }
                                        disabled={ this.state.loading }
                                    > 
                                        Guardar
                                        { this.state.loading ? (
                                            <Spinner />
                                        ) : '' }
                                    </Button>
                                </div> 

                            </div>
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
) )( ContentPasos );
