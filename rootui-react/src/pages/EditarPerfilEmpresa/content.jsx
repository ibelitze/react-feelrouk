/**
 * External Dependencies
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import classnames from 'classnames/dedupe';
// import { isValidEmail } from '../../utils';
import { Spinner, Button, Row, Col, TabContent, TabPane, Nav, NavItem, NavLink, 
    Label, Input, FormGroup, Modal, ModalFooter, ModalHeader, ModalBody } from 'reactstrap';

import Icon from '../../components/icon';
import { MensajeBloqueo } from '../../components/no-permisos';

import DataTable from 'react-data-table-component';
import edit from '../../../common-assets/images/vcm/edit.svg';
import borrar from '../../../common-assets/images/vcm/x-circle.svg';

require( 'dotenv' ).config();

/**
 * Component
 */
class Content extends Component {
    constructor( props ) {
        super( props );

        this.renderingDataTable = this.renderingDataTable.bind( this );
        this.renderBotonesListado = this.renderBotonesListado.bind( this );
        this.createProfile = this.createProfile.bind( this );
        this.sendNewProfile = this.sendNewProfile.bind( this );
        this.getAllPermisos = this.getAllPermisos.bind( this );
        this.getTodosLosLDT = this.getTodosLosLDT.bind( this );
        this.getAllEmpleados = this.getAllEmpleados.bind( this );
        this.getProfilesById = this.getProfilesById.bind( this );
        this.editarPerfil = this.editarPerfil.bind( this );
        this.guardarEdicionPerfil = this.guardarEdicionPerfil.bind( this );
        this.openModal = this.openModal.bind( this );
        this.closeModal = this.closeModal.bind( this );
        this.cargarLDT = this.cargarLDT.bind( this );
        this.cargarModulo = this.cargarModulo.bind( this );
        this.cargarVista = this.cargarVista.bind( this );
        this.cargarPermisosVista = this.cargarPermisosVista.bind( this );
        this.catchPermisos = this.catchPermisos.bind( this );
        this.renderFormParaModificarPerfiles = this.renderFormParaModificarPerfiles.bind( this );
        this.renderLDTParaCreacion = this.renderLDTParaCreacion.bind( this );
        this.renderModulo = this.renderModulo.bind( this );
        this.renderVistasEscogidas = this.renderVistasEscogidas.bind( this );
        this.renderPermisosVista = this.renderPermisosVista.bind( this );
        this.eliminarDefinitivamente = this.eliminarDefinitivamente.bind( this );

        this.state = {
            ok: false,
            empresa: null,
            permisos: null,
            perfiles: null,
            empleados: null,
            nombre: '',
            codigo: '',
            clienteEscogido: null,
            perfilEscogido: null,
            ldt: false,
            modulos: false,
            vistas: false,
            lineasPermitidas: false,
            modulosPermitidos: false,
            vistasPermitidas: false,
            loading: false,
            dropDownValue: false,
            dropDownValue2: false,
            dropDownValue3: false,
            activeTab: "1",
            modal: false,
            modal2: false,
            modal3: false,
            modal4: false,
            perfilModificado: null,
            ldtEscogido: null,
            modulosEscogidos: null,
            vistasEscogidas: null,
            permisosEscogidos: null,
            mensajeAviso: '',
            icono: false,
            perfilAEliminar: null,
            empleadoAEliminar: null,
            nombreError: '',
        };
    }

    componentDidMount() {
        this.getAllPermisos().then( () => {
            this.getTodosLosLDT();
            this.getProfilesById();
            this.getAllEmpleados();
        } );
    }

    getAllPermisos() {
        const email = this.props.info.email;
        return new Promise( ( resolve ) => {
            axios.get( process.env.REACT_APP_DEVAPI + '/api/clientes/getByEmail/' + email ).then( ( res ) => {
                if ( res.data.ok ) {
                    this.setState( { 
                        ok: res.data.ok,
                        permisos: res.data.data,
                        empresa: res.data.data.empresa,
                    } );
                    return resolve( true );
                }
            } );
        } );
    }

    async getAllEmpleados() {
        if ( this.state.permisos ) {
            const idEmpresa = this.state.permisos.empresa.id;
            return axios.get( process.env.REACT_APP_DEVAPI + '/api/clientes/getEmpleados/' + idEmpresa ).then( ( res ) => {
                const final = res.data.data.filter( ( trabajador ) => {
                    return ! trabajador.cliente[ 0 ].is_admin;
                } );
                this.setState( { 
                    ok: res.data.ok,
                    empleados: final,
                } );
            } );
        }
    }

    async getProfilesById() {
        if ( this.state.permisos ) {
            const id = this.state.permisos.empresa.id;
            return axios.get( process.env.REACT_APP_DEVAPI + '/api/clientes/getProfiles/' + id ).then( ( res ) => {
                this.setState( { 
                    ok: res.data.ok,
                    perfiles: res.data.data,
                } );
            } );
        }
    }

    // renderizamos la tabla con toda la data de perfiles
    renderingDataTable() {
        const columns = [
            {
                name: 'Nombre de empresa',
                selector: row => row.empresa[ 0 ].nombre,
                sortable: true,
            },
            {
                name: 'Nombre de perfil',
                selector: row => row.nombre,
                sortable: true,
            },
            {
                name: 'Permisos',
                selector: row => row.codigo.split( '-' ).join( ' , ' ),
                sortable: true,
            },
            {
                name: 'Acciones',
                sortable: false,
                cell: ( row ) => this.renderBotonesListado( row ),
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
                data={ this.state.perfiles }
                pagination
                paginationComponentOptions={ paginationComponentOptions }
            />
        );
    }

    // renderizado de los botones de acción - Perfiles
    renderBotonesListado( row ) {
        return (
            <Fragment>
                <button onClick={ () => this.eliminarPerfil( row.id ) } className="btn btn-datatable">
                    <img alt="ver" style={ { width: "25px" } } src={ borrar } />
                </button>
                <button onClick={ () => this.editarPerfil( row ) } className="btn btn-datatable">
                    <img alt="editar" style={ { width: "25px" } } src={ edit } />
                </button>
            </Fragment>
        );
    }

    // llamada API para obtener de la BD todas las LDT y Módulos existentes

    getTodosLosLDT() {
        return axios.get( process.env.REACT_APP_DEVAPI + '/api/permisos/getAll' ).then( ( res ) => {
            const allModulos = [];
            const allVistas = [];
            res.data.data.forEach( ( ldt ) => {
                if ( ldt.Modulos.length > 0 ) {
                    ldt.Modulos.forEach( ( modulo ) => {
                        allModulos.push( modulo );
                    } );
                }
                if ( ldt.vistas.length > 0 ) {
                    ldt.vistas.forEach( ( vista ) => {
                        allVistas.push( vista );
                    } );
                }
            } );
            this.setState( { 
                ldt: res.data.data,
                modulos: allModulos,
                vistas: allVistas,
            } );
            this.catchPermisos();
        } );
    }

    catchPermisos() {
        if ( this.state.permisos && this.state.ldt && this.state.modulos && this.state.vistas ) {
            const lineas = [];
            const modulos = [];
            const vistas = [];
            let permisosCod = this.state.permisos.permisos.codigo;
            permisosCod = permisosCod.split( '-' );

            permisosCod.forEach( ( cod ) => {
                const lin = this.state.ldt.find( ( linea ) => {
                    return linea.codigo === cod;
                } );
                const mod = this.state.modulos.find( ( modulo ) => {
                    return modulo.codigo === cod;
                } );
                const vis = this.state.vistas.find( ( vista ) => {
                    return vista.codigo === cod;
                } );

                if ( lin ) {
                    lineas.push( lin );
                } else if ( mod ) {
                    modulos.push( mod );
                } else if ( vis ) {
                    vistas.push( vis );
                }
            } );

            this.setState( {
                lineasPermitidas: lineas,
                modulosPermitidos: modulos,
                vistasPermitidas: vistas,
            } );
        }
    }

    renderLDTParaCreacion() {
        const todo = this.state.lineasPermitidas.map( ( ldtr ) => {
            return (
                <FormGroup className="mt-10" check key={ ldtr.id }>
                    <Label className="label-permisos label-ldt" check>
                        <Input type="checkbox" id={ ldtr.id } onChange={ ( e ) => this.cargarLDT( { type: ldtr.id, checked: e.target.checked, ldt: ldtr } ) } />{ ' ' }
                        { ldtr.nombre }
                    </Label>
                    <div>
                        { this.renderModulo( ldtr ) }
                    </div>
                </FormGroup>
            );
        } );
        return todo;
    }

    renderModulo( ldtr ) {
        const final = [];

        if ( this.state.ldtEscogido ) {
            const checking = this.state.ldtEscogido.find( ( ldt ) => {
                return ldt.id === ldtr.id;
            } );

            if ( checking ) {
                this.state.modulosPermitidos.forEach( ( modulo ) => {
                    if ( modulo.rel_ldt === ldtr.codigo ) {
                        final.push(
                            <FormGroup className="mt-5 label-modulos" check key={ modulo.id }>
                                <Label check>
                                    <Input type="checkbox" id={ modulo.id } onChange={ ( e ) => this.cargarModulo( { type: modulo.id, checked: e.target.checked, modulo: modulo } ) } />{ ' ' }
                                    { modulo.nombre }
                                </Label>
                                <div className="mt-5 ml-20">
                                    { ( this.state.modulosEscogidos && this.state.modulosEscogidos.length ) ? this.renderVistasEscogidas( modulo.codigo ) : null }
                                </div>
                            </FormGroup>
                        );
                    }
                } );
                return final;
            }
        }

        return null;
    }

    renderVistasEscogidas( codigo ) {
        const found = this.state.vistasPermitidas.filter( ( vista ) => {
            return vista.rel_mod === codigo;
        } );

        const finalRender = [];
        if ( found ) {
            if ( Array.isArray( found ) ) {
                found.forEach( ( vista ) => {
                    finalRender.push(
                        <Label check key={ vista.id }>
                            <Input type="checkbox" id={ vista.id } onChange={ ( e ) => this.cargarVista( { type: vista.id, checked: e.target.checked, vista: vista } ) } />{ ' ' }
                            { vista.nombre }
                            <div className="mt-4 ml-20">
                                { ( this.state.vistasEscogidas && this.state.vistasEscogidas.length ) ? this.renderPermisosVista( vista.id ) : null }
                            </div>
                        </Label>
                    );
                } );
            } else {
                finalRender.push(
                    <Label check key={ found.id }>
                        <Input type="checkbox" id={ found.id } onChange={ ( e ) => this.cargarVista( { type: found.id, checked: e.target.checked, vista: found } ) } />{ ' ' }
                        { found.nombre }
                        <div className="mt-4 ml-20">
                            { ( this.state.vistasEscogidas && this.state.vistasEscogidas.length ) ? this.renderPermisosVista( found.id ) : null }
                        </div>
                    </Label>
                );
            }
        }
        return finalRender;
    }

    renderPermisosVista( vistaId ) {
        const permis = [];

        if ( this.state.vistasEscogidas ) {
            const found = this.state.vistasEscogidas.find( ( vista ) => {
                return vista.id === vistaId;
            } );
            if ( found ) {
                const permisos = found.permisos.split( '-' );
                permisos.forEach( ( permiso ) => {
                    permis.push(
                        <div key={ permiso }>
                            <Label check>
                                <Input type="checkbox" id={ permiso } onChange={ ( e ) => this.cargarPermisosVista( { type: permiso, checked: e.target.checked } ) } />{ ' ' }
                                { permiso }
                            </Label>   
                        </div>
                    );
                } );
            } 
        }
        return permis;
    }

    // función que sirve para crear el state de las LDT escogidas (creación de perfil)

    cargarLDT( data ) {
        // { type: ldtr.id, checked: e.target.checked, ldt: ldtr }

        // agregando linea de trabajo
        if ( data.checked ) {
            const lineas = this.state.ldtEscogido ? this.state.ldtEscogido.slice() : [];
            lineas.push( data.ldt );
            this.setState( { ldtEscogido: lineas } );

            // quitando linea de trabajo - ARREGLAR
        } else {
            // let modulos = null;
            let lineas = this.state.ldtEscogido ? this.state.ldtEscogido.slice() : [];

            // si la ldt eran 2 o más
            if ( Array.isArray( lineas ) && lineas.length > 0 ) {
                lineas = lineas.filter( ( ldt ) => {
                    return ldt.id !== data.ldt.id;
                } );
                this.setState( { ldtEscogido: lineas } );
            } else {
                this.setState( { ldtEscogido: null } );
            }
        }
    }

    // función que sirve para crear el state de los modulos escogidos (creación de empresa)

    cargarModulo( data ) {
        // agregando linea de trabajo
        if ( data.checked ) {
            const lineas = this.state.modulosEscogidos ? this.state.modulosEscogidos.slice() : [];
            lineas.push( data.modulo );
            this.setState( { modulosEscogidos: lineas } );

            // quitando linea de trabajo
        } else {
            // let modulos = null;
            let lineas = this.state.modulosEscogidos.slice();

            // si la ldt eran 2 o más
            if ( Array.isArray( lineas ) && lineas.length > 0 ) {
                lineas = lineas.filter( ( modulo ) => {
                    return modulo.id !== data.modulo.id;
                } );
                this.setState( { modulosEscogidos: lineas } );
            } else {
                this.setState( { modulosEscogidos: null } );
            }
        }
    }

    // función que sirve para crear el state de los modulos escogidos (creación de empresa)

    cargarVista( data ) {
        // agregando vista
        if ( data.checked ) {
            const vistas = this.state.vistasEscogidas ? this.state.vistasEscogidas.slice() : [];
            vistas.push( data.vista );
            this.setState( { vistasEscogidas: vistas } );

            // quitando vista de la lista
        } else {
            // let modulos = null;
            let vistas = this.state.vistasEscogidas.slice();

            // si la vista eran 2 o más
            if ( Array.isArray( vistas ) && vistas.length > 0 ) {
                vistas = vistas.filter( ( vista ) => {
                    return vista.id !== data.vista.id;
                } );
                this.setState( { vistasEscogidas: vistas } );
            } else {
                this.setState( { 
                    vistasEscogidas: null,
                    permisosEscogidos: null,
                } );
            }
        }
    }

    cargarPermisosVista( data ) {
        if ( this.state.vistasEscogidas ) {
            if ( data.checked ) {
                const permis = this.state.permisosEscogidos ? this.state.permisosEscogidos.slice() : [];
                permis.push( data.type );
                this.setState( { permisosEscogidos: permis } );
            } else {
                let permis = this.state.permisosEscogidos.slice();

                if ( Array.isArray( permis ) && permis.length > 0 ) {
                    permis = permis.filter( ( vista ) => {
                        return vista.id !== data.vista.id;
                    } );
                    this.setState( { permisosEscogidos: permis } );
                } else {
                    this.setState( { permisosEscogidos: null } );
                }
            }
        }
    }

    async sendNewProfile() {
        const codigoFinal = [];

        this.state.ldtEscogido.forEach( ( ldt ) => {
            codigoFinal.push( ldt.codigo );
        } );

        this.state.modulosEscogidos.forEach( ( mod ) => {
            codigoFinal.push( mod.codigo );
        } );

        this.state.vistasEscogidas.forEach( ( vista ) => {
            codigoFinal.push( vista.codigo );
        } );

        this.state.permisosEscogidos.forEach( ( permiso ) => {
            codigoFinal.push( permiso );
        } );

        const data = { 
            cod: codigoFinal.join( '-' ),
            nombre: this.state.nombre,
            rel_company: this.state.empresa.id,
        };

        axios.post( process.env.REACT_APP_DEVAPI + '/api/company/nuevoPerfil', data ).then( ( res ) => {
            if ( res.data.ok ) {
                this.setState( {
                    loading: false,
                    nombre: '',
                    mensajeAviso: "Perfil creado satisfactoriamente",
                    icono: true,
                    ldtEscogido: null,
                    modulosEscogidos: null,
                    vistasEscogidas: null,
                    permisosEscogidos: null,
                } );
                this.openModal( 3 );
                this.getProfilesById();
            }
        } ).catch( ( e ) => {
            console.log( e );
        } );
    }

    createCompany() {
        if ( this.state.loading ) {
            return;
        }
        this.setState( {
            loading: true,
        } );

        this.sendNewCompany();
    }

    createProfile() {
        if ( this.state.loading ) {
            return;
        }

        if ( this.state.nombre.length === 0 ) {
            this.setState( { 
                nombreError: "Debe asignarle un nombre al perfil",
            } );
            return;
        }

        if ( ! this.state.permisosEscogidos || ! this.state.ldtEscogido
        || ! this.state.modulosEscogidos || ! this.state.vistasEscogidas ) {
            this.setState( { 
                mensajeAviso: "Debe completar la permisología",
                icono: false,
            } );
            this.openModal( 3 );
            return;
        }

        this.setState( {
            loading: true,
        } );
        this.sendNewProfile();
    }

    editarPerfil( perfil ) {
        this.setState( { 
            perfilModificado: perfil,
        } );
        this.openModal( 2 );
    }

    // Abrir/Cerrar de todos los modales
    openModal( number ) {
        switch ( number ) {
        case 1:
            this.setState( { modal: true } );
            break;
        case 2:
            this.setState( { 
                modal2: true,
                ldtEscogido: null,
                modulosEscogidos: null,
                vistasEscogidas: null,
                permisosEscogidos: null,
            } );
            break;
        case 3:
            this.setState( { modal3: true } );
            break;
        case 4:
            this.setState( { modal4: true } );
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
            this.setState( { 
                modal2: false,
                ldtEscogido: null,
                modulosEscogidos: null,
                vistasEscogidas: null,
                permisosEscogidos: null,
                perfilModificado: null,
            } );
            break;
        case 3:
            this.setState( { 
                modal3: false,
                mensajeAviso: '',
            } );
            break;
        case 4:
            this.setState( { 
                modal4: false,
                perfilAEliminar: null,
            } );
            break;
        default:
            break;
        }
    }

    toggleTabs( tab ) {
        if ( this.state.activeTab !== tab ) {
            this.setState( {
                activeTab: tab,
            } );
        }
    }

    // llamada API para eliminar empleado

    eliminarPerfil( id ) {
        // comprobación acá
        let found = false;

        if ( Array.isArray( this.state.empleados ) ) {
            found = this.state.empleados.find( ( trabajador ) => {
                return trabajador.permisos[ 0 ].id === id;
            } );
        } else {
            found = this.state.empleados.permisos[ 0 ].id === id ? true : false;
        }

        if ( found ) {
            this.setState( { 
                mensajeAviso: "Todavía hay clientes usando este perfil. Debe desocupar este perfil para eliminarlo",
                icono: false,
            } );
            this.openModal( 3 );
            return;
        }

        this.setState( {
            perfilAEliminar: id,
        } );
        this.openModal( 4 );
    }

    eliminarDefinitivamente() {
        if ( this.state.perfilAEliminar ) {
            const data = {
                id: this.state.perfilAEliminar,
            };
            axios.post( process.env.REACT_APP_DEVAPI + '/api/clientes/eliminarPerfil', data ).then( ( res ) => {
                if ( res.data.ok ) {
                    this.closeModal( 4 );
                    this.getProfilesById();
                }
            } );
        }
    }

    renderFormParaModificarPerfiles() {
        const {
            perfilModificado,
        } = this.state;
        if ( this.state.perfilModificado ) {
            return (
                <div className="container-form-staff">

                    <FormGroup>
                        <Label for="nombrePerfilEdit">Nombre del perfil</Label>
                        <Input type="text" 
                            name="nombrePerfilEdit" 
                            className="input-hcm-formulario"
                            value={ perfilModificado.nombre }
                            onChange={ ( e ) => {
                                const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                perfilModificado.nombre = nuevo;
                                const data = Object.assign( {}, perfilModificado );
                                this.setState( {
                                    perfilEscogido: data,
                                } );
                            } }
                        />
                        { this.state.jerarquiaError.length > 0 ? (
                            <div className="invalid-feedback">{ this.state.jerarquiaError }</div>
                        ) : '' }
                    </FormGroup>

                    <br></br>

                    <Label>Escoger nuevos Permisos</Label>
                    { this.renderLDTParaCreacion() }

                    <br></br><br></br>
                    <button
                        className="btn btn-feelrouk centrar-boton"
                        onClick={ this.guardarEdicionPerfil }
                        disabled={ this.state.loading }>
                        Guardar Perfil
                        { this.state.loading ? (
                            <Spinner />
                        ) : '' }
                    </button>
                </div>
            );
        } 

        return "No ha seleccionado ningún perfil todavía";
    }

    guardarEdicionPerfil() {
        const codigoFinal = [];

        if ( this.state.permisosEscogidos.length === 0 || this.state.ldtEscogido.length === 0 
        || this.state.modulosEscogidos.length === 0 || this.state.vistasEscogidas.length === 0 ) {
            this.setState( { 
                mensajeAviso: "Debe completar la permisología",
                icono: false,
            } );
            this.openModal( 3 );
            return;
        }
        if ( this.state.perfilModificado.nombre.length === 0 ) {
            this.setState( { 
                mensajeAviso: "Debe asignarle un nombre al perfil",
                icono: false,
            } );
            this.openModal( 3 );
            return;
        }

        this.state.ldtEscogido.forEach( ( ldt ) => {
            codigoFinal.push( ldt.codigo );
        } );

        this.state.modulosEscogidos.forEach( ( mod ) => {
            codigoFinal.push( mod.codigo );
        } );

        this.state.vistasEscogidas.forEach( ( vista ) => {
            codigoFinal.push( vista.codigo );
        } );

        this.state.permisosEscogidos.forEach( ( permiso ) => {
            codigoFinal.push( permiso );
        } );

        const data = { 
            codigo: codigoFinal.join( '-' ),
            nombre: this.state.perfilModificado.nombre,
            id: this.state.perfilModificado.id,
        };

        axios.post( process.env.REACT_APP_DEVAPI + '/api/company/editarPerfil', data ).then( ( res ) => {
            if ( res.data.ok ) {
                this.setState( {
                    perfilModificado: null,
                    ldtEscogido: null,
                    modulosEscogidos: null,
                    vistasEscogidas: null,
                    permisosEscogidos: null,
                    mensajeAviso: "Perfil editado satisfactoriamente",
                    icono: true,
                } );
                this.closeModal( 2 );
                this.openModal( 3 );
                this.getProfilesById();
            }
        } );
    }

    render() {
        if ( this.props.info.jerarquia !== "administrador" ) {
            const {
                nombre,
            } = this.state;
            let perfiles = null;
            let permisos = null;
            let renderInputs = null;
            let mensaje = null;

            // renderizando las tablas con los perfiles
            if ( this.state.perfiles ) {
                perfiles = this.renderingDataTable();
            }

            if ( this.state.permisos && this.state.lineasPermitidas ) {
                permisos = this.renderLDTParaCreacion();
            }
            if ( this.state.perfilModificado ) {
                renderInputs = this.renderFormParaModificarPerfiles();
            }
            if ( this.state.mensajeAviso.length > 0 ) {
                mensaje = this.state.mensajeAviso;
            }

            return (
                <Fragment>

                    <Modal isOpen={ this.state.modal } toggle={ () => this.closeModal( 1 ) }>
                        <ModalHeader
                            toggle={ () => this.closeModal( 1 ) }>Editando</ModalHeader>
                        <ModalBody>
                            <Row className="vertical-gap d-flex justify-content-center">
                                <Col lg="10" className="justify-content-center">
                                    { this.renderFormParaModificarPerfiles() }
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
                            } }>Edición de perfiles</ModalHeader>
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
                            } }>Aviso</ModalHeader>
                        <ModalBody>
                            <Row className="vertical-gap d-flex justify-content-center">
                                <Col lg="10" className="justify-content-center text-centered">
                                    <div className="icon-container">
                                        { 
                                            this.state.icono ? <Icon name="check-circle" /> : <Icon name="dizzy" />
                                        }
                                    </div>
                                    <h2>{ mensaje }</h2>
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
                                        <Icon name="dizzy" />
                                    </div>
                                    <h2>¿Está seguro que desea eliminar el elemento?</h2>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button className="btn-feelrouk-naranja" onClick={ () => { 
                                this.eliminarDefinitivamente();
                            } }>Continuar Eliminando</Button>
                            <Button className="btn-feelrouk" onClick={ () => this.closeModal( 4 ) }>No</Button>
                        </ModalFooter>
                    </Modal>

                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={ classnames( { active: this.state.activeTab === '1' } ) }
                                onClick={ () => this.toggleTabs( '1' ) }>
                                Crear Perfiles
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={ classnames( { active: this.state.activeTab === '2' } ) }
                                onClick={ () => this.toggleTabs( '2' ) }>
                                Editar Perfiles
                            </NavLink>
                        </NavItem>
                    </Nav>

                    <TabContent activeTab={ this.state.activeTab }>
                        <TabPane tabId="1">
                            <Row className="mt-30">
                                <Col>
                                    <h2>Crear nuevo perfil</h2>
                                </Col>
                            </Row>
                            <Row className="d-flex mt-5">
                                <Col lg="4">
                                    <div className="container-form-staff">

                                        <FormGroup>
                                            <Label for="nombrePerfil">Nombre del perfil</Label>
                                            <Input type="text" 
                                                name="nombrePerfil" 
                                                className={ classnames( 'input-hcm-formulario', { 'is-invalid': this.state.nombreError } ) }
                                                value={ nombre }
                                                onChange={ ( e ) => {
                                                    const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                                    this.setState( {
                                                        nombre: nuevo,
                                                        nombreError: '',
                                                    } );
                                                } }
                                            />
                                            { this.state.nombreError.length > 0 ? (
                                                <div className="invalid-feedback">{ this.state.nombreError }</div>
                                            ) : '' }
                                        </FormGroup>

                                        <br></br>

                                        <button
                                            className="btn btn-primary justify-content-center btn-feelrouk"
                                            onClick={ this.createProfile }
                                            disabled={ this.state.loading }>
                                            Crear Perfil
                                            { this.state.loading ? (
                                                <Spinner />
                                            ) : '' }
                                        </button>
                                    </div>
                                </Col>
                                <Col lg="6" className="justify-content-center">
                                    <FormGroup tag="fieldset">
                                        <legend>Escoger Permisos</legend>
                                        { permisos }
                                    </FormGroup>
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tabId="2">
                            <Row className="mt-30">
                                <Col>
                                    <h2>Listado de perfiles</h2>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    { perfiles }
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
