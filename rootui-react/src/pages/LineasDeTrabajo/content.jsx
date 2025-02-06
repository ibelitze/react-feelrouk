/**
 * External Dependencies
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import classnames from 'classnames/dedupe';
// import { isValidEmail } from '../../utils';
import { Spinner, Row, Col, Label, Input, FormGroup, TabContent, TabPane, Nav, NavItem, NavLink, Modal, 
    ModalFooter, ModalHeader, ModalBody, Button } from 'reactstrap'; 

import DataTable from 'react-data-table-component';
import Icon from '../../components/icon';
import Select from 'react-select';
import { MensajeBloqueo } from '../../components/no-permisos';

import edit from '../../../common-assets/images/vcm/edit.svg';
import borrar from '../../../common-assets/images/vcm/x-circle.svg';
import agregar from '../../../common-assets/images/vcm/plus-circle.svg';
require( 'dotenv' ).config();

// import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// plus-circle

/**
 * Component
 */
class Content extends Component {
    constructor( props ) {
        super( props );
        this.renderingDataTableLDT = this.renderingDataTableLDT.bind( this );
        this.renderingDataTableModulos = this.renderingDataTableModulos.bind( this );
        this.renderingDataTableVistas = this.renderingDataTableVistas.bind( this );

        this.renderBotonesListadoLDT = this.renderBotonesListadoLDT.bind( this );
        this.renderBotonesListadoModulos = this.renderBotonesListadoModulos.bind( this );
        this.renderBotonesListadoVistas = this.renderBotonesListadoVistas.bind( this );

        this.toggleTabs = this.toggleTabs.bind( this );
        this.renderModulos = this.renderModulos.bind( this );
        this.getTodosLosLDT = this.getTodosLosLDT.bind( this );
        this.getTodasLasvistas = this.getTodasLasvistas.bind( this );
        this.openModal = this.openModal.bind( this );
        this.closeModal = this.closeModal.bind( this );
        this.actionLDT = this.actionLDT.bind( this );
        this.actionModulo = this.actionModulo.bind( this );
        this.renderEdicion = this.renderEdicion.bind( this );
        this.crearLDT = this.crearLDT.bind( this );
        this.renderCreacion = this.renderCreacion.bind( this );
        this.crearModulo = this.crearModulo.bind( this );
        this.crearVista = this.crearVista.bind( this );
        this.cargarLDTparaModulo = this.cargarLDTparaModulo.bind( this );
        this.cargarModuloParaVista = this.cargarModuloParaVista.bind( this );
        this.cargarVistaParaPermisologia = this.cargarVistaParaPermisologia.bind( this );
        this.eliminarFinalmente = this.eliminarFinalmente.bind( this );
        this.renderFormPermisosVistas = this.renderFormPermisosVistas.bind( this );
        this.guardarPermisosVistas = this.guardarPermisosVistas.bind( this );
        this.renderURLInput = this.renderURLInput.bind( this );
        this.cargarLDTparaVistas = this.cargarLDTparaVistas.bind( this );

        this.state = {
            loading: false,
            activeTab: "1",
            ldt: false,
            allModulos: null,
            allVistas: null,
            modulos: null,
            vistas: null,
            modal: false,
            modal2: false,
            modal3: false,
            modal4: false,
            modal5: false,
            dropDownValue: false,
            dropDownValue2: false,
            dropDownValue3: false,
            dropDownValue4: false,
            dropDownValue5: false,
            dropDownValue6: false,
            dropDownValue7: false,
            dropDownValue8: false,
            queEstoyCreando: null,
            ldtEscogido: null,
            moduloEscogido: null,
            ldtModificar: null,
            moduloModificar: null,
            vistaModificar: null,
            modificadoLDT: null,
            modificadoModulo: null,
            modificadaVista: null,
            mensajeAviso: '',
            ldtEliminar: null,
            moduloEliminar: null,
            vistaEliminar: null,
            nuevoPermiso: null,
            icono: false,
            nuevaPropiedad: '',
            moduloNuevo: {
                nombre: '',
                codigo: '',
                rel_ldt: '',
            },
            ldtNuevo: {
                nombre: '',
                codigo: '',
                host: '',
                url: '',
            },
            vistaNueva: {
                nombre: '',
                codigo: '',
                rel_ldt: '',
                rel_mod: '',
            },
            editarPermisoVista: {},
            cambioDePermisos: false,
            vistaEscogida: null,
        };
    }

    componentDidMount() {
        this.getTodosLosLDT();
        this.getTodasLasvistas();
    }

    getTodasLasvistas() {
        axios.get( process.env.REACT_APP_DEVAPI + '/api/permisos/getAllVistas' ).then( ( res ) => {
            if ( res.data.ok ) {
                this.setState( {
                    allVistas: res.data.data,
                } );
            }
        } ).catch( ( e ) => {
            console.log( e );
        } );
    }

    // llamada API para obtener de la BD todas las LDT y Módulos existentes

    getTodosLosLDT() {
        return axios.get( process.env.REACT_APP_DEVAPI + '/api/permisos/getAll' ).then( ( res ) => {
            const allModulos = [];
            res.data.data.forEach( ( ldt ) => {
                if ( ldt.Modulos.length > 0 ) {
                    ldt.Modulos.forEach( ( modulo ) => {
                        allModulos.push( modulo );
                    } );
                }
            } );
            this.setState( { 
                ok: res.data.ok,
                ldt: res.data.data,
                allModulos: allModulos,
            } );
            if ( this.state.ldt && this.state.ldtEscogido ) {
                const id = this.state.ldtEscogido.id;
                this.renderModulos( id, "otro" );
                this.cargarModuloParaVista();
                this.setState( { 
                    vistas: null,
                } );
            }
        } );
    }

    renderingDataTableLDT() {
        const columns = [
            {
                name: 'Nombre',
                selector: row => row.nombre,
                sortable: true,
            },
            {
                name: 'Código',
                selector: row => row.codigo,
                sortable: true,
            },
            {
                name: 'Acciones',
                sortable: false,
                cell: ( row ) => this.renderBotonesListadoLDT( row ),
            },
        ];

        const paginationComponentOptions = {
            rowsPerPageText: 'Filas por página',
            rangeSeparatorText: 'de',
            selectAllRowsItem: true,
            selectAllRowsItemText: 'Todos',
        };

        return (
            <DataTable
                columns={ columns }
                data={ this.state.ldt }
                pagination
                paginationComponentOptions={ paginationComponentOptions }
            />
        );
    }

    renderingDataTableModulos() {
        const columns = [
            {
                name: 'Nombre',
                selector: row => row.nombre,
                sortable: true,
            },
            {
                name: 'Código',
                selector: row => row.codigo,
                sortable: true,
            },
            {
                name: 'Acciones',
                sortable: false,
                cell: ( row ) => this.renderBotonesListadoModulos( row ),
            },
        ];

        const paginationComponentOptions = {
            rowsPerPageText: 'Filas por página',
            rangeSeparatorText: 'de',
            selectAllRowsItem: true,
            selectAllRowsItemText: 'Todos',
        };

        return (
            <DataTable
                columns={ columns }
                data={ this.state.modulos }
                pagination
                paginationComponentOptions={ paginationComponentOptions }
            />
        );
    }

    renderingDataTableVistas() {
        const columns = [
            {
                name: 'Nombre',
                selector: row => row.nombre,
                sortable: true,
            },
            {
                name: 'Código',
                selector: row => row.codigo,
                sortable: true,
            },
            {
                name: 'Línea de trabajo',
                selector: row => row.rel_ldt,
                sortable: true,
            },
            {
                name: 'Módulo',
                selector: row => row.rel_mod,
                sortable: true,
            },
            {
                name: 'Permisos',
                selector: row => row.permisos,
                sortable: true,
            },
            {
                name: 'Acciones',
                sortable: false,
                cell: ( row ) => this.renderBotonesListadoVistas( row ),
            },
        ];

        const paginationComponentOptions = {
            rowsPerPageText: 'Filas por página',
            rangeSeparatorText: 'de',
            selectAllRowsItem: true,
            selectAllRowsItemText: 'Todos',
        };

        return (
            <DataTable
                columns={ columns }
                data={ this.state.vistas }
                pagination
                paginationComponentOptions={ paginationComponentOptions }
            />
        );
    }

    renderBotonesListadoLDT( row ) {
        return (
            <Fragment>
                <button onClick={ () => this.actionLDT( { accion: "editar", ldt: Object.assign( {}, row ) } ) } className="btn btn-datatable">
                    <img alt="editar" style={ { width: "25px" } } src={ edit } />
                </button>
                <button onClick={ () => this.actionLDT( { accion: "eliminar", ldt: Object.assign( {}, row ) } ) } className="btn btn-datatable">
                    <img alt="borrar" style={ { width: "25px" } } src={ borrar } />
                </button>
            </Fragment>
        );
    }

    renderBotonesListadoModulos( row ) {
        return (
            <Fragment>
                <button onClick={ () => this.actionModulo( { accion: "editar", modulo: Object.assign( {}, row ) } ) } className="btn btn-datatable">
                    <img alt="editar" style={ { width: "25px" } } src={ edit } />
                </button>
                <button onClick={ () => this.actionModulo( { accion: "eliminar", modulo: Object.assign( {}, row ) } ) } className="btn btn-datatable">
                    <img alt="borrar" style={ { width: "25px" } } src={ borrar } />
                </button>
            </Fragment>
        );
    }

    renderBotonesListadoVistas( row ) {
        return (
            <Fragment>
                <button onClick={ () => this.actionVista( { accion: "editar", vista: Object.assign( {}, row ) } ) } className="btn btn-datatable">
                    <img alt="editar" style={ { width: "25px" } } src={ edit } />
                </button>
                <button onClick={ () => this.actionVista( { accion: "eliminar", vista: Object.assign( {}, row ) } ) } className="btn btn-datatable">
                    <img alt="borrar" style={ { width: "25px" } } src={ borrar } />
                </button>
            </Fragment>
        );
    }

    // función para renderizar los módulos debajo de las LDT (escogiendo permisos en creación de empresa)

    renderModulos( e, type ) {
        if ( e && type === "event" ) {
            let modulos = null;
            let escogido = null;
            this.state.ldt.forEach( ( linea ) => {
                if ( linea.id === e.value ) {
                    escogido = Object.assign( {}, linea );
                    modulos = linea.Modulos.slice();
                }
            } );
            this.setState( {
                ldtEscogido: escogido,
                modulos: modulos,
                vistaEscogida: null,
            } );
        } else {
            let modulos = null;
            let escogido = null;
            this.state.ldt.forEach( ( linea ) => {
                if ( linea.id === e ) {
                    escogido = Object.assign( {}, linea );
                    modulos = linea.Modulos.slice();
                }
            } );
            this.setState( {
                ldtEscogido: escogido,
                modulos: modulos,
                vistaEscogida: null,
            } );
        }
    }

    toggleTabs( tab ) {
        if ( this.state.activeTab !== tab ) {
            this.setState( {
                activeTab: tab,
            } );
        }
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
        case 3:
            this.setState( { modal3: true } );
            break;
        case 4:
            this.setState( { modal4: true } );
            break;
        case 5:
            this.setState( { modal5: true } );
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
        case 3:
            this.setState( { 
                modal3: false,
                ldtEscogido: null,
                moduloEscogido: null,
                modulos: null,
            } );
            break;
        case 4:
            this.setState( { 
                modal4: false,
                mensajeAviso: '',
            } );
            break;
        case 5:
            this.setState( { 
                modal5: false,
            } );
            break;
        default:
            break;
        }
    }

    actionLDT( data ) {
        // { accion: "editar", ldt: data }
        if ( data.accion === "editar" ) {
            this.setState( { 
                ldtModificar: data.ldt,
                moduloModificar: null,
            } );
            this.openModal( 2 );
        } else {
            const found = this.state.allModulos.find( ( modulo ) => {
                return data.ldt.codigo === modulo.rel_ldt;
            } );

            if ( found ) {
                this.setState( { 
                    mensajeAviso: "Debe primero eliminar todos los módulos asociados a ésta línea de trabajo",
                    icono: false,
                } );
                this.openModal( 4 );
                return;
            }

            this.setState( {
                ldtEliminar: data.ldt,
                moduloEliminar: null,
                vistaEliminar: null,
            } );
            this.openModal( 5 );
        }
    }

    actionModulo( data ) {
        // { accion: "eliminar", modulo: modulo }
        if ( data.accion === "editar" ) {
            this.setState( { 
                moduloModificar: data.modulo,
                ldtModificar: null,
            } );
            this.openModal( 2 );
        } else {
            const found = this.state.allVistas.find( ( vista ) => {
                return data.modulo.codigo === vista.rel_mod;
            } );

            if ( found ) {
                this.setState( { 
                    mensajeAviso: "Debe primero eliminar todas las vistas asociadas a este módulo",
                    icono: false,
                } );
                this.openModal( 4 );
                return;
            }

            this.setState( {
                ldtEliminar: null,
                moduloEliminar: data.modulo,
                vistaEliminar: null,
            } );
            this.openModal( 5 );
        }
    }

    actionVista( data ) {
        // { accion: "eliminar", modulo: modulo }
        if ( data.accion === "editar" ) {
            this.setState( { 
                vistaModificar: data.vista,
                moduloModificar: null,
                ldtModificar: null,
            } );
            this.openModal( 2 );
        } else {
            this.setState( {
                ldtEliminar: null,
                moduloEliminar: null,
                vistaEliminar: data.vista,
            } );
            this.openModal( 5 );
        }
    }

    eliminarFinalmente() {
        if ( this.state.ldtEliminar ) {
            const dato = { 
                id: this.state.ldtEliminar.id,
                codigo: this.state.ldtEliminar.codigo,
            };
            axios.post( process.env.REACT_APP_DEVAPI + '/api/permisos/eliminarLDT', dato ).then( ( res ) => {
                if ( res.data.ok ) {
                    this.setState( {
                        loading: false,
                        ldtModificar: null,
                        moduloModificar: null,
                        modulos: null,
                        ldtEliminar: null,
                        moduloEliminar: null,
                        vistaEliminar: null,
                        mensajeAviso: 'Linea de trabajo eliminada.',
                        icono: true,
                    } );
                    this.closeModal( 5 );
                    this.openModal( 4 );
                    // obtener de nuevo todas las empresas y renderizar en la lista del tab 2
                    this.getTodosLosLDT();
                }
            } ).catch( ( e ) => {
                console.log( e );
            } );
        } else if ( this.state.moduloEliminar ) {
            const dato = { 
                id: this.state.moduloEliminar.id,
                codigo: this.state.moduloEliminar.codigo,
            };
            axios.post( process.env.REACT_APP_DEVAPI + '/api/permisos/eliminarModulo', dato ).then( ( res ) => {
                if ( res.data.ok ) {
                    this.setState( {
                        loading: false,
                        ldtModificar: null,
                        moduloModificar: null,
                        modificadoLDT: null,
                        modificadoModulo: null,
                        modulos: null,
                        ldtEliminar: null,
                        moduloEliminar: null,
                        vistaEliminar: null,
                        mensajeAviso: 'Módulo eliminado satisfactoriamente.',
                        icono: true,
                    } );
                    this.closeModal( 5 );
                    this.openModal( 4 );
                    // obtener de nuevo todas las empresas y renderizar en la lista del tab 2
                    this.getTodosLosLDT();
                }
            } ).catch( ( e ) => {
                console.log( e );
            } );
        } else if ( this.state.vistaEliminar ) {
            const dato = { id: this.state.vistaEliminar.id };
            axios.post( process.env.REACT_APP_DEVAPI + '/api/permisos/eliminarVista', dato ).then( ( res ) => {
                if ( res.data.ok ) {
                    this.setState( {
                        loading: false,
                        ldtModificar: null,
                        moduloModificar: null,
                        modificadoLDT: null,
                        modificadoModulo: null,
                        vistaModificar: null,
                        modificadaVista: null,
                        ldtEliminar: null,
                        moduloEliminar: null,
                        vistaEliminar: null,
                        mensajeAviso: 'Vista eliminada satisfactoriamente.',
                        icono: true,
                    } );
                    this.closeModal( 5 );
                    this.openModal( 4 );
                    // obtener de nuevo todas las empresas y renderizar en la lista del tab 2
                    this.cargarModuloParaVista();
                }
            } ).catch( ( e ) => {
                console.log( e );
            } );
        }
    }

    abrirCreacion( type ) {
        this.setState( { queEstoyCreando: type } );
        this.openModal( 3 );
    }

    renderURLInput() {
        const { ldtNuevo } = this.state;
        return (
            <FormGroup>
                <Label for="url">Url</Label>
                <Input type="text" 
                    name="url" 
                    className="input-hcm-formulario"
                    value={ ldtNuevo.url }
                    onChange={ ( e ) => {
                        ldtNuevo.url = e.target.value;
                        const dato = Object.assign( {}, ldtNuevo );
                        this.setState( {
                            ldtNuevo: dato,
                        } );
                    } }
                />
            </FormGroup>
        );
    }

    renderCreacion( type ) {
        const { moduloNuevo, ldtNuevo, vistaNueva } = this.state;

        if ( type === "ldt" ) {
            return (
                <div className="container-form-staff">
                    <h2>Asignar permisos a la nueva empresa</h2>
                    <FormGroup tag="fieldset">
                        <Label>Escoja el tipo de Host</Label>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name="radio1" onChange={ () => {
                                    ldtNuevo.host = "self";
                                    const dato = Object.assign( {}, ldtNuevo );
                                    this.setState( {
                                        ldtNuevo: dato,
                                    } );
                                } } />{ ' ' }
                                Self Hosted
                            </Label>
                            {
                                this.state.ldtNuevo.host === "self" ? this.renderURLInput() : null
                            }
                        </FormGroup>

                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name="radio1" onChange={ () => {
                                    ldtNuevo.host = "cloud";
                                    const dato = Object.assign( {}, ldtNuevo );
                                    this.setState( {
                                        ldtNuevo: dato,
                                    } );
                                } } />{ ' ' }
                                Cloud Hosted
                            </Label>
                        </FormGroup>
                    </FormGroup>

                    <h2>Nueva Línea de trabajo</h2>

                    <FormGroup>
                        <Label for="Nombre">Nombre de LDT</Label>
                        <Input type="text" 
                            name="Nombre" 
                            className="input-hcm-formulario"
                            value={ ldtNuevo.nombre }
                            onChange={ ( e ) => {
                                const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                ldtNuevo.nombre = nuevo;
                                const dato = Object.assign( {}, ldtNuevo );
                                this.setState( {
                                    ldtNuevo: dato,
                                } );
                            } }
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="codigo">Código</Label>
                        <Input type="text" 
                            name="codigo" 
                            className="input-hcm-formulario"
                            value={ ldtNuevo.codigo }
                            onChange={ ( e ) => {
                                const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                ldtNuevo.codigo = nuevo;
                                const dato = Object.assign( {}, ldtNuevo );
                                this.setState( {
                                    ldtNuevo: dato,
                                } );
                            } }
                        />
                    </FormGroup>

                    <br></br>

                    <button
                        className="btn btn-feelrouk centrar-boton"
                        onClick={ () => this.crearLDT() }
                        disabled={ this.state.loading }>
                        Guardar LDT
                        { this.state.loading ? (
                            <Spinner />
                        ) : '' }
                    </button>
                </div>
            );
        } else if ( type === "modulo" ) {
            const ldt2 = [];

            this.state.ldt.forEach( ( ldtr ) => {
                ldt2.push( { value: ldtr.id, label: ldtr.codigo } );
            } );

            return (
                <div className="container-form-staff">
                    <h2>Nuevo módulo</h2>
                    <Select
                        className="dropdown-feelrouk"
                        name="seleccione-ldt2"
                        options={ ldt2 }
                        defaultValue={ { label: "Seleccione línea de trabajo", value: 0 } }
                        onChange={ ( e ) => {
                            this.cargarLDTparaModulo( e );
                        } }
                    />
                    <br></br>

                    <FormGroup>
                        <Label for="NombreModulo">Nombre de módulo</Label>
                        <Input type="text" 
                            name="NombreModulo" 
                            className="input-hcm-formulario"
                            value={ moduloNuevo.nombre }
                            onChange={ ( e ) => {
                                const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                moduloNuevo.nombre = nuevo;
                                const dato = Object.assign( {}, moduloNuevo );
                                this.setState( {
                                    moduloNuevo: dato,
                                } );
                            } }
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="codigoModulo">Código</Label>
                        <Input type="text" 
                            name="codigoModulo" 
                            className="input-hcm-formulario"
                            value={ moduloNuevo.codigo }
                            onChange={ ( e ) => {
                                const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                moduloNuevo.codigo = nuevo;
                                const dato = Object.assign( {}, moduloNuevo );
                                this.setState( {
                                    moduloNuevo: dato,
                                } );
                            } }
                        />
                    </FormGroup>

                    <br></br>

                    <button
                        className="btn btn-feelrouk justify-content-center"
                        onClick={ () => this.crearModulo() }
                        disabled={ this.state.loading }>
                        Guardar Módulo
                        { this.state.loading ? (
                            <Spinner />
                        ) : '' }
                    </button>
                </div>
            );
        } else if ( type === "vista" ) {
            const mod = [];
            const ldt2 = [];

            this.state.ldt.forEach( ( ldtr ) => {
                ldt2.push( { value: ldtr.id, label: ldtr.codigo } );
            } );

            if ( this.state.modulos ) {
                this.state.modulos.forEach( ( modulo ) => {
                    mod.push( { value: modulo.id, label: modulo.codigo } );
                } );
            }

            return (
                <div className="container-form-staff">
                    <h2>Nueva Vista</h2>
                    <div>
                        <Select
                            className="dropdown-feelrouk"
                            name="escoja-ldt3"
                            options={ ldt2 }
                            defaultValue={ { label: "Escoja línea de trabajo", value: 0 } }
                            onChange={ ( e ) => {
                                this.cargarLDTparaVistas( e );
                            } }
                        />
                        <Select
                            className="dropdown-feelrouk"
                            name="escoja-modulo"
                            options={ mod }
                            defaultValue={ { label: "Escoja un módulo", value: 0 } }
                            onChange={ ( e ) => {
                                this.cargarModuloParaVista( e );
                            } }
                        />

                    </div>

                    <br></br>

                    <FormGroup>
                        <Label for="nombrevista">Nombre de vista</Label>
                        <Input type="text" 
                            name="nombrevista" 
                            className="input-hcm-formulario"
                            value={ vistaNueva.nombre }
                            disabled={ this.state.moduloEscogido ? false : true }
                            onChange={ ( e ) => {
                                const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                vistaNueva.nombre = nuevo;
                                const dato = Object.assign( {}, vistaNueva );
                                this.setState( {
                                    vistaNueva: dato,
                                } );
                            } }
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="codigoVista">Código de vista</Label>
                        <Input type="text" 
                            name="codigoVista" 
                            className="input-hcm-formulario"
                            value={ vistaNueva.codigo }
                            disabled={ this.state.moduloEscogido ? false : true }
                            onChange={ ( e ) => {
                                const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                vistaNueva.codigo = nuevo;
                                const dato = Object.assign( {}, vistaNueva );
                                this.setState( {
                                    vistaNueva: dato,
                                } );
                            } }
                        />
                    </FormGroup>

                    <br></br>

                    <button
                        className="btn btn-feelrouk justify-content-center"
                        onClick={ () => this.crearVista() }
                        disabled={ this.state.loading }>
                        Guardar Vista
                        { this.state.loading ? (
                            <Spinner />
                        ) : '' }
                    </button>
                </div>
            );
        }
    }

    renderEdicion( type ) {
        if ( type === "ldt" ) {
            const { ldtModificar } = this.state;
            return (
                <div className="container-form-staff">
                    <h2>Modificando línea de trabajo</h2>

                    <FormGroup>
                        <Label for="ldtname">Nombre de Línea de trabajo</Label>
                        <Input type="text" 
                            name="ldtname" 
                            className="input-hcm-formulario"
                            value={ ldtModificar.nombre }
                            onChange={ ( e ) => {
                                const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                ldtModificar.nombre = nuevo;
                                const dato = Object.assign( {}, ldtModificar );
                                this.setState( {
                                    modificadoLDT: dato,
                                } );
                            } }
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="ldtcodigo">Código de Línea de trabajo</Label>
                        <Input type="text" 
                            name="ldtcodigo" 
                            className="input-hcm-formulario"
                            value={ ldtModificar.codigo }
                            onChange={ ( e ) => {
                                const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                ldtModificar.codigo = nuevo;
                                const dato = Object.assign( {}, ldtModificar );
                                this.setState( {
                                    modificadoLDT: dato,
                                } );
                            } }
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="ldturl">URL de Línea de trabajo</Label>
                        <Input type="text" 
                            name="ldturl" 
                            className="input-hcm-formulario"
                            value={ ldtModificar.url }
                            onChange={ ( e ) => {
                                ldtModificar.url = e.target.value;
                                const dato = Object.assign( {}, ldtModificar );
                                this.setState( {
                                    modificadoLDT: dato,
                                } );
                            } }
                        />
                    </FormGroup>

                    <br></br>

                    <button
                        className="btn btn-feelrouk centrar-boton"
                        onClick={ () => this.guardarEdicion( 'ldt' ) }
                        disabled={ this.state.loading }>
                        Guardar LDT
                        { this.state.loading ? (
                            <Spinner />
                        ) : '' }
                    </button>
                </div>
            );
        } else if ( type === "modulo" ) {
            const { moduloModificar } = this.state;
            return (
                <div className="container-form-staff">
                    <h2>Modificando Módulo</h2>

                    <FormGroup>
                        <Label for="NombreModEdit">Nombre de módulo</Label>
                        <Input type="text" 
                            name="NombreModEdit" 
                            className="input-hcm-formulario"
                            value={ moduloModificar.nombre }
                            onChange={ ( e ) => {
                                const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                moduloModificar.nombre = nuevo;
                                const dato = Object.assign( {}, moduloModificar );
                                this.setState( {
                                    modificadoModulo: dato,
                                } );
                            } }
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="CodigoEdit">Código de módulo</Label>
                        <Input type="text" 
                            name="CodigoEdit" 
                            className="input-hcm-formulario"
                            value={ moduloModificar.codigo }
                            onChange={ ( e ) => {
                                const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                moduloModificar.codigo = nuevo;
                                const dato = Object.assign( {}, moduloModificar );
                                this.setState( {
                                    modificadoModulo: dato,
                                } );
                            } }
                        />
                    </FormGroup>

                    <br></br>

                    <button
                        className="btn btn-feelrouk centrar-boton"
                        onClick={ () => this.guardarEdicion( 'modulo' ) }
                        disabled={ this.state.loading }>
                        Guardar Modulo
                        { this.state.loading ? (
                            <Spinner />
                        ) : '' }
                    </button>
                </div>
            );
        } else if ( type === "vista" ) {
            const { vistaModificar } = this.state;
            return (
                <div className="container-form-staff">
                    <h2>Modificando Vista</h2>

                    <FormGroup>
                        <Label for="nombrevistaedit">Nombre de la vista</Label>
                        <Input type="text" 
                            name="nombrevistaedit" 
                            className="input-hcm-formulario"
                            value={ vistaModificar.nombre }
                            onChange={ ( e ) => {
                                const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                vistaModificar.nombre = nuevo;
                                const dato = Object.assign( {}, vistaModificar );
                                this.setState( {
                                    modificadaVista: dato,
                                } );
                            } }
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="codigovistaedit">Código</Label>
                        <Input type="text" 
                            name="codigovistaedit" 
                            className="input-hcm-formulario"
                            value={ vistaModificar.codigo }
                            onChange={ ( e ) => {
                                const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                vistaModificar.codigo = nuevo;
                                const dato = Object.assign( {}, vistaModificar );
                                this.setState( {
                                    modificadaVista: dato,
                                } );
                            } }
                        />
                    </FormGroup>

                    <br></br>

                    <button
                        className="btn btn-feelrouk centrar-boton"
                        onClick={ () => this.guardarEdicion( 'vista' ) }
                        disabled={ this.state.loading }>
                        Guardar Vista
                        { this.state.loading ? (
                            <Spinner />
                        ) : '' }
                    </button>
                </div>
            );
        }
    }

    guardarEdicion( type ) {
        this.closeModal( 2 );
        if ( type === "ldt" ) {
            const viejo = this.state.ldt.find( ( linea ) => {
                return linea.id === this.state.modificadoLDT.id;
            } );

            const data = {
                id: this.state.modificadoLDT.id,
                nombre: this.state.modificadoLDT.nombre,
                codigo: this.state.modificadoLDT.codigo,
                url: this.state.modificadoLDT.url,
                viejoCodigo: viejo.codigo,
            };
            axios.post( process.env.REACT_APP_DEVAPI + '/api/permisos/editarLDT', data ).then( ( res ) => {
                if ( res.data.ok ) {
                    this.setState( {
                        loading: false,
                        ldtModificar: null,
                        moduloModificar: null,
                        modificadoLDT: null,
                        modificadoModulo: null,
                        modulos: null,
                        mensajeAviso: 'Linea de trabajo editada satisfactoriamente',
                        icono: true,
                    } );
                    // obtener de nuevo todas las empresas y renderizar en la lista del tab 2
                    this.getTodosLosLDT();
                    this.closeModal( 2 );
                    this.openModal( 4 );
                }
            } ).catch( ( e ) => {
                console.log( e );
            } );
        } else if ( type === "modulo" ) {
            const viejo = this.state.allModulos.find( ( modulo ) => {
                return modulo.id === this.state.modificadoModulo.id;
            } );
            const data = {
                id: this.state.modificadoModulo.id,
                nombre: this.state.modificadoModulo.nombre,
                codigo: this.state.modificadoModulo.codigo,
                viejoCodigo: viejo.codigo,
            };
            axios.post( process.env.REACT_APP_DEVAPI + '/api/permisos/editarModulo', data ).then( ( res ) => {
                if ( res.data.ok ) {
                    this.setState( {
                        loading: false,
                        ldtModificar: null,
                        moduloModificar: null,
                        modificadoLDT: null,
                        modificadoModulo: null,
                        mensajeAviso: 'Módulo editado satisfactoriamente',
                        icono: true,
                    } );
                    // obtener de nuevo todas las empresas y renderizar en la lista del tab 2
                    this.getTodosLosLDT();
                    this.closeModal( 2 );
                    this.openModal( 4 );
                }
            } ).catch( ( e ) => {
                console.log( e );
            } );
        } else if ( type === "vista" ) {
            const data = {
                id: this.state.modificadaVista.id,
                nombre: this.state.modificadaVista.nombre,
                codigo: this.state.modificadaVista.codigo,
            };
            axios.post( process.env.REACT_APP_DEVAPI + '/api/permisos/editarVista', data ).then( ( res ) => {
                if ( res.data.ok ) {
                    this.setState( {
                        loading: false,
                        ldtModificar: null,
                        moduloModificar: null,
                        modificadoLDT: null,
                        modificadaVista: null,
                        vistaModificar: null,
                        modificadoModulo: null,
                        mensajeAviso: 'Vista editada satisfactoriamente',
                        icono: true,
                    } );
                    // obtener de nuevo todas las empresas y renderizar en la lista del tab 2
                    this.cargarModuloParaVista();
                    this.closeModal( 2 );
                    this.openModal( 4 );
                }
            } ).catch( ( e ) => {
                console.log( e );
            } );
        }
    }

    cargarLDTparaModulo( e ) {
        const id = e.value;
        const ldt = this.state.ldt.find( ( linea ) => {
            return linea.id === id;
        } );
        this.setState( {
            modificadoLDT: ldt,
        } );
    }

    cargarLDTparaVistas( e ) {
        const id = e.value;
        const ldt = this.state.ldt.find( ( linea ) => {
            return linea.id === id;
        } );
        this.setState( {
            modificadoLDT: ldt,
        }, () => {
            this.renderModulos( ldt.id, "otro" );
        } );
    }

    cargarModuloParaVista( e ) {
        if ( e ) {
            const id = e.value;
            const mod = this.state.modulos.find( ( modulo ) => {
                return modulo.id === id;
            } );
            this.setState( {
                moduloEscogido: mod,
                vistaEscogida: null,
            }, () => {
                axios.get( process.env.REACT_APP_DEVAPI + '/api/permisos/getVistas/' + mod.codigo ).then( ( res ) => {
                    if ( res.data.ok ) {
                        this.setState( {
                            vistas: res.data.data,
                        } );
                    }
                } ).catch( ( err ) => {
                    console.log( err );
                } );
            } );
        } else if ( this.state.moduloEscogido ) {
            axios.get( process.env.REACT_APP_DEVAPI + '/api/permisos/getVistas/' + this.state.moduloEscogido.codigo ).then( ( res ) => {
                if ( res.data.ok ) {
                    this.setState( {
                        vistas: res.data.data,
                    } );
                }
            } ).catch( ( errr ) => {
                console.log( errr );
            } );   
        }
    }

    crearLDT() {
        // comprobaciones
        if ( this.state.ldtNuevo.nombre.length <= 0 || this.state.ldtNuevo.codigo.length <= 0 ) {
            this.setState( {
                mensajeAviso: 'Debe ingresar todos los datos del formulario',
            } );
            this.openModal( 4 );
            return;
        }
        if ( this.state.ldtNuevo.host === "self" && this.state.ldtNuevo.url.length === 0 ) {
            this.setState( {
                mensajeAviso: 'Debe ingresar una URL para el SELF HOSTED',
            } );
            this.openModal( 4 );
            return;
        }

        const data = {
            nombre: this.state.ldtNuevo.nombre,
            codigo: this.state.ldtNuevo.codigo,
            host: this.state.ldtNuevo.host,
            url: this.state.ldtNuevo.url,
        };
        axios.post( process.env.REACT_APP_DEVAPI + '/api/permisos/nuevoLDT', data ).then( ( res ) => {
            if ( res.data.ok ) {
                this.setState( {
                    loading: false,
                    modificadoLDT: null,
                    ldtNuevo: {
                        nombre: '',
                        codigo: '',
                        host: '',
                        url: '',
                    },
                    modulos: null,
                    mensajeAviso: 'Línea de trabajo creada satisfactoriamente',
                    icono: true,
                } );
                this.getTodosLosLDT();
                this.closeModal( 3 );
                this.openModal( 4 );
            }
        } ).catch( ( e ) => {
            console.log( e );
            this.setState( {
                loading: false,
                mensajeAviso: 'Hubo un error creando la LDT. Intente de nuevo más tarde.',
                icono: false,
            } );
            this.openModal( 4 );
        } );
    }

    crearModulo() {
        // comprobaciones
        if ( this.state.moduloNuevo.nombre.length <= 0 || this.state.moduloNuevo.codigo.length <= 0 
            || this.state.modificadoLDT.codigo.length <= 0 ) {
            this.setState( {
                mensajeAviso: 'Debe ingresar todos los datos del formulario',
            } );
            this.openModal( 4 );
            return;
        }

        const data = {
            nombre: this.state.moduloNuevo.nombre,
            codigo: this.state.moduloNuevo.codigo,
            rel_ldt: this.state.modificadoLDT.codigo,
        };
        axios.post( process.env.REACT_APP_DEVAPI + '/api/permisos/nuevoModulo', data ).then( ( res ) => {
            if ( res.data.ok ) {
                this.setState( {
                    loading: false,
                    modificadoLDT: null,
                    moduloNuevo: {
                        nombre: '',
                        codigo: '',
                        rel_ldt: '',
                    },
                    modulos: null,
                    mensajeAviso: 'Módulo creado satisfactoriamente',
                    icono: true,
                } );
                // obtener de nuevo todas las empresas y renderizar en la lista del tab 2
                this.getTodosLosLDT();
                this.closeModal( 3 );
                this.openModal( 4 );
            }
        } ).catch( ( e ) => {
            console.log( e );
            this.setState( {
                loading: false,
                mensajeAviso: 'Hubo un error creando el módulo. Intente de nuevo más tarde.',
                icono: false,
            } );
            this.openModal( 4 );
        } );
    }

    crearVista() {
        // comprobaciones
        if ( this.state.vistaNueva.nombre.length <= 0 || this.state.vistaNueva.codigo.length <= 0 
            || this.state.ldtEscogido.codigo.length <= 0 || this.state.moduloEscogido.codigo.length <= 0 ) {
            this.setState( {
                mensajeAviso: 'Debe ingresar todos los datos del formulario',
            } );
            this.openModal( 4 );
            return;
        }

        const data = {
            nombre: this.state.vistaNueva.nombre,
            codigo: this.state.vistaNueva.codigo,
            rel_ldt: this.state.ldtEscogido.codigo,
            rel_mod: this.state.moduloEscogido.codigo,
            permisos: 'ninguno',
        };
        axios.post( process.env.REACT_APP_DEVAPI + '/api/permisos/nuevaVista', data ).then( ( res ) => {
            if ( res.data.ok ) {
                this.setState( {
                    loading: false,
                    vistaNueva: {
                        nombre: '',
                        codigo: '',
                        rel_ldt: '',
                        rel_mod: '',
                    },
                    mensajeAviso: 'Vista creada satisfactoriamente',
                    icono: true,
                } );
                // obtener de nuevo todas las empresas y renderizar en la lista del tab 2
                // obtener de nuevo las vistas
                this.cargarModuloParaVista();
                this.closeModal( 3 );
                this.openModal( 4 );
            }
        } ).catch( ( e ) => {
            console.log( e );
            this.setState( {
                loading: false,
                mensajeAviso: 'Hubo un error creando la vista. Intente de nuevo más tarde.',
                icono: false,
            } );
            this.openModal( 4 );
        } );
    }

    cargarVistaParaPermisologia( e ) {
        if ( e ) {
            const id = e.value;
            const vist = this.state.vistas.find( ( vista ) => {
                return vista.id === id;
            } );

            if ( vist ) {
                const permi = {};
                const permisos = vist.permisos.split( '-' );
                permisos.forEach( ( permiso ) => {
                    permi[ permiso ] = true;
                } );
                this.setState( {
                    vistaEscogida: vist,
                    editarPermisoVista: permi,
                } );
            }
        }
    }

    renderFormPermisosVistas() {
        if ( this.state.vistaEscogida ) {
            const permisos = this.state.vistaEscogida.permisos.split( '-' );

            if ( permisos ) {
                const { editarPermisoVista, nuevoPermiso } = this.state;
                return (
                    <div className="container-form-staff">
                        <div className="col-md-12 parte-con-fondo">
                            <FormGroup tag="fieldset">
                                <legend> Permisos para la vista: </legend>
                                { 
                                    Object.keys( editarPermisoVista ).map( ( propiedad ) => {
                                        return (
                                            <FormGroup check key={ propiedad }>
                                                <Label check>
                                                    <Input type="checkbox" 
                                                        id={ propiedad } 
                                                        defaultChecked={ editarPermisoVista[ propiedad ] }
                                                        onChange={ ( e ) => {
                                                            editarPermisoVista[ propiedad ] = e.target.checked;
                                                            const NuevoObj = Object.assign( {}, editarPermisoVista );
                                                            this.setState( { 
                                                                editarPermisoVista: NuevoObj,
                                                            } );
                                                        } } />{ ' ' }
                                                    { propiedad }
                                                </Label>
                                            </FormGroup>
                                        );
                                    } )
                                }
                            </FormGroup>
                        </div>
                        <br></br>
                        <div className="col-md-12 parte-con-fondo">
                            <legend>Agregar permisos</legend>
                            <div className="d-flex">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="nuevoPermiso"
                                    placeholder="Nuevo permiso"
                                    value={ nuevoPermiso }
                                    onChange={ ( e ) => {
                                        const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                        this.setState( {
                                            nuevoPermiso: nuevo,
                                        } );
                                    } }
                                />
                                <button
                                    className="btn btn-permiso justify-content-center"
                                    onClick={ () => {
                                        this.validarNuevoPermiso();
                                    } }>
                                    <img alt="agregar" src={ agregar } />
                                </button>
                            </div>
                        </div>
                        <br></br>
                        <div className="col-md-12">
                            <button
                                className="btn btn-feelrouk centrar-boton"
                                onClick={ () => this.guardarPermisosVistas() }
                                disabled={ this.state.loading }>
                                Guardar
                                { this.state.loading ? (
                                    <Spinner />
                                ) : '' }
                            </button>
                        </div>
                    </div>
                );
            }
        }
    }

    validarNuevoPermiso() {
        const { editarPermisoVista } = this.state;
        if ( this.state.nuevoPermiso ) {
            const validar = this.state.nuevoPermiso.toLowerCase();

            const tiene = this.state.editarPermisoVista.hasOwnProperty( validar );

            if ( tiene ) {
                document.getElementById( 'nuevoPermiso' ).value = '';
                this.setState( {
                    mensajeAviso: 'Ya existe un permiso registrado con ese nombre',
                    icono: false,
                } );
                this.openModal( 4 );
            } else {
                const nuevoPermiso = this.state.nuevoPermiso.toLowerCase();
                Object.defineProperty( editarPermisoVista, nuevoPermiso, {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: 'static',
                } );
                const nuevoObj = Object.assign( {}, editarPermisoVista );
                this.setState( {
                    editarPermisoVista: nuevoObj,
                } );
                document.getElementById( 'nuevoPermiso' ).value = '';
            }
        }
    }

    guardarPermisosVistas() {
        const { editarPermisoVista } = this.state;
        const arrayprops = [];

        Object.keys( editarPermisoVista ).forEach( ( propiedad ) => {
            if ( editarPermisoVista[ propiedad ] ) {
                arrayprops.push( propiedad );
            }
        } );

        const permisos = arrayprops.join( '-' );

        const data = {
            permisos: permisos,
            id: this.state.vistaEscogida.id,
        };

        axios.post( process.env.REACT_APP_DEVAPI + '/api/permisos/permisosVista', data ).then( ( res ) => {
            if ( res.data.ok ) {
                this.setState( {
                    loading: false,
                    editarPermisoVista: {},
                    nuevaPropiedad: '',
                    mensajeAviso: 'Permisos para vistas creados satisfactoriamente',
                    icono: true,
                } );
                this.openModal( 4 );
                this.cargarModuloParaVista();
            }
        } ).catch( ( e ) => {
            console.log( e );
            this.setState( {
                loading: false,
                mensajeAviso: 'Hubo un error creando los permisos de la vista. Intente de nuevo más tarde.',
                icono: false,
            } );
            this.openModal( 4 );
        } );
    }

    render() {
        if ( this.props.info.jerarquia === "administrador" ) {
            const ldt = [];
            const ldt2 = [];
            let renderldt = null;
            let modulos = null;
            let vistas = null;
            let renderInputs = null;
            let creacionModalContent = null;
            const modulosDropdown = [];
            const modulosDropdown2 = [];
            const vistasParaPermisos = [];
            let formularioPermisosVistas = null;
            let seleccioneModulo1 = null;
            let seleccioneModulo2 = null;
            let seleccioneVista = null;

            if ( this.state.ldt && this.state.ldt.length ) {
                renderldt = this.renderingDataTableLDT();

                this.state.ldt.forEach( ( linea ) => {
                    // para ver los módulos según LDT
                    ldt.push( { value: linea.id, label: linea.codigo } );
                    // para ver vistas según LDT-Módulo
                    ldt2.push( { value: linea.id, label: linea.codigo } );
                } );
            }

            if ( this.state.modulos ) {
                // renderizar módulos en la tabla de modulos (después de haber escogido la LDT por el dropdown)
                modulos = this.renderingDataTableModulos();

                this.state.modulos.forEach( ( modulo ) => {
                    modulosDropdown.push( { value: modulo.id, label: modulo.codigo } );
                    modulosDropdown2.push( { value: modulo.id, label: modulo.codigo } );
                } );

                seleccioneModulo1 = <Fragment>
                    <Select
                        className="dropdown-feelrouk"
                        name="escoja-modulo1"
                        options={ modulosDropdown2 }
                        defaultValue={ { label: "Seleccione un módulo", value: 0 } }
                        onChange={ ( e ) => {
                            this.cargarModuloParaVista( e );
                        } }
                    />
                </Fragment>;

                seleccioneModulo2 = <Fragment>
                    <Select
                        className="dropdown-feelrouk"
                        name="escoja-modulo3"
                        options={ modulosDropdown }
                        defaultValue={ { label: "Seleccione un módulo", value: 0 } }
                        onChange={ ( e ) => {
                            this.cargarModuloParaVista( e );
                        } }
                    />
                </Fragment>;
            }

            if ( this.state.vistas ) {
                vistas = this.renderingDataTableVistas();
                // renderizamos las vistas para el dropdown
                this.state.vistas.forEach( ( vista ) => {
                    vistasParaPermisos.push( { value: vista.id, label: vista.nombre } );
                } );

                seleccioneVista = <Fragment>
                    <Select
                        className="dropdown-feelrouk"
                        name="escoja-vista"
                        options={ vistasParaPermisos }
                        defaultValue={ { label: "Seleccione una vista", value: 0 } }
                        onChange={ ( e ) => {
                            this.cargarVistaParaPermisologia( e );
                        } }
                    />
                </Fragment>;
            }

            // renderizar el modal (popup) dependiendo de lo que quiero modificar (ldt, modulo o vista)
            if ( this.state.ldtModificar ) {
                renderInputs = this.renderEdicion( "ldt" );
            } else if ( this.state.moduloModificar ) {
                renderInputs = this.renderEdicion( "modulo" );
            } else if ( this.state.vistaModificar ) {
                renderInputs = this.renderEdicion( "vista" );
            }

            // renderizar el modal (popup) dependiendo de lo que se quiere crear (ldt, modulo o vista)
            if ( this.state.queEstoyCreando ) {
                const type = this.state.queEstoyCreando;
                creacionModalContent = this.renderCreacion( type );
            }

            if ( this.state.vistaEscogida ) {
                formularioPermisosVistas = this.renderFormPermisosVistas();
            }

            return (
                <Fragment>

                    <Modal isOpen={ this.state.modal } toggle={ () => { 
                        this.closeModal( 1 );
                    } 
                    }>
                        <ModalHeader
                            toggle={ () => { 
                                this.closeModal( 1 ); 
                            } 
                            }>Administración de Líneas de trabajo - Módulos - Vistas</ModalHeader>
                        <ModalBody>
                            <Row className="vertical-gap d-flex justify-content-center">
                                <Col lg="10" className="justify-content-center">
                                    <p>Se han editado todo de manera satisfactoria</p>
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
                            } }>Administración de Líneas de trabajo - Módulos - Vistas</ModalHeader>
                        <ModalBody>
                            <Row className="vertical-gap d-flex justify-content-center">
                                <Col lg="10" className="justify-content-center">
                                    { renderInputs }
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button className="btn-feelrouk-naranja" onClick={ () => this.closeModal( 2 ) }>Cerrar</Button>
                        </ModalFooter>
                    </Modal>

                    <Modal isOpen={ this.state.modal3 } toggle={ () => { 
                        this.closeModal( 3 );
                    } }>
                        <ModalHeader
                            toggle={ () => { 
                                this.closeModal( 3 );
                            } }>Administración de Líneas de trabajo - Módulos - Vistas</ModalHeader>
                        <ModalBody>
                            <Row className="vertical-gap d-flex justify-content-center">
                                <Col lg="10" className="justify-content-center">
                                    { creacionModalContent }
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button className="btn-feelrouk-naranja" onClick={ () => this.closeModal( 3 ) }>Cerrar</Button>
                        </ModalFooter>
                    </Modal>

                    <Modal isOpen={ this.state.modal4 } toggle={ () => { 
                        this.closeModal( 4 );
                    } }>
                        <ModalHeader
                            toggle={ () => { 
                                this.closeModal( 4 );
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
                            <Button className="btn-feelrouk-naranja" onClick={ () => this.closeModal( 4 ) }>Cerrar</Button>
                        </ModalFooter>
                    </Modal>

                    <Modal isOpen={ this.state.modal5 } toggle={ () => { 
                        this.closeModal( 5 );
                    } }>
                        <ModalHeader
                            toggle={ () => { 
                                this.closeModal( 5 );
                            } }>Aviso</ModalHeader>
                        <ModalBody>
                            <Row className="vertical-gap d-flex justify-content-center">
                                <Col lg="10" className="justify-content-center text-centered">
                                    <div className="icon-container">
                                        <Icon name="dizzy" />
                                    </div>
                                    <h2>¿Está seguro que desea eliminar el elemento?</h2>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button className="btn-feelrouk-naranja" onClick={ () => this.eliminarFinalmente() }>Continuar Eliminando</Button>
                            <Button className="btn-feelrouk" onClick={ () => this.closeModal( 5 ) }>No</Button>
                        </ModalFooter>
                    </Modal>

                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={ classnames( { active: this.state.activeTab === '1' } ) }
                                onClick={ () => this.toggleTabs( '1' ) }>
                                Líneas de trabajo
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={ classnames( { active: this.state.activeTab === '2' } ) }
                                onClick={ () => this.toggleTabs( '2' ) }>
                                Módulos
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={ classnames( { active: this.state.activeTab === '3' } ) }
                                onClick={ () => this.toggleTabs( '3' ) }>
                                Vistas
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={ classnames( { active: this.state.activeTab === '4' } ) }
                                onClick={ () => this.toggleTabs( '4' ) }>
                                Permisología de vistas
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={ this.state.activeTab }>
                        <TabPane tabId="1">
                            <Row className={ "vertical-gap d-flex justify-content-center" }>
                                <Col lg="10" className="d-flex flex-row-reverse">
                                    <Button onClick={ () => this.abrirCreacion( "ldt" ) } className="ml-8 mb-10 btn btn-feelrouk" >Crear nueva Línea de trabajo</Button>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    { renderldt }
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tabId="2">
                            <Row>
                                <Col lg="3">
                                    <div className="container-form-staff">
                                        <Select
                                            className="dropdown-feelrouk"
                                            name="escoja-empresa"
                                            options={ ldt }
                                            defaultValue={ { label: "Seleccione una línea de trabajo", value: 0 } }
                                            onChange={ ( e ) => {
                                                this.renderModulos( e, "event" );
                                            } }
                                        />                      
                                    </div>
                                </Col>
                                <Col lg="8" className="d-flex flex-row-reverse">
                                    <Button onClick={ () => this.abrirCreacion( "modulo" ) } className="ml-8 btn btn-feelrouk" >Crear nuevo módulo</Button>
                                </Col>
                            </Row>
                            <br></br>
                            <Row>
                                <Col>
                                    { modulos }
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tabId="3">
                            <Row>
                                <Col lg="3">
                                    <div className="container-form-staff">
                                        <Select
                                            className="dropdown-feelrouk"
                                            name="escoja-linea"
                                            options={ ldt }
                                            defaultValue={ { label: "Seleccione Línea de trabajo", value: 0 } }
                                            onChange={ ( e ) => {
                                                this.renderModulos( e, "event" );
                                            } }
                                        />
                                        { seleccioneModulo1 }
                                    </div>
                                </Col>
                                <Col lg="8" className="d-flex flex-row-reverse">
                                    <Button onClick={ () => this.abrirCreacion( "vista" ) } className="ml-8 btn btn-feelrouk" >Crear nueva vista</Button>
                                </Col>
                            </Row>
                            <br></br>
                            <Row>
                                <Col>
                                    { vistas }
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tabId="4">
                            <Row className="mt-30">
                                <Col lg="3" sm="12" xs="12">
                                    <div className="container-form-staff">
                                        <Select
                                            className="dropdown-feelrouk"
                                            name="escoja-linea"
                                            options={ ldt2 }
                                            defaultValue={ { label: "Seleccione Línea de trabajo", value: 0 } }
                                            onChange={ ( e ) => {
                                                this.renderModulos( e, "event" );
                                            } }
                                        />
                                        <div className="mt-15"></div>
                                        { seleccioneModulo2 }
                                        <div className="mt-15"></div>
                                        { seleccioneVista }
                                    </div>
                                </Col>
                                <Col lg="8" sm="12" xs="12">
                                    { formularioPermisosVistas }
                                </Col>
                            </Row>
                        </TabPane>
                    </TabContent>
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
) )( Content );
