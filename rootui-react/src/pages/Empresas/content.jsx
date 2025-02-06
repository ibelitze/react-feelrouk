/**
 * External Dependencies
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import classnames from 'classnames/dedupe';
// import { isValidEmail } from '../../utils';
import { Spinner, Row, Col, TabContent, TabPane, Nav, NavItem, 
    NavLink, Label, Input, FormGroup, Modal, ModalFooter, ModalHeader, ModalBody, Button } from 'reactstrap';

import DataTable from 'react-data-table-component';
import Icon from '../../components/icon';

import edit from '../../../common-assets/images/vcm/edit.svg';
import editPermisosEmp from '../../../common-assets/images/hcm/editPermisosEmp.svg';

import CrearDepartamento from '../../components/departamento';
import { MensajeBloqueo } from '../../components/no-permisos';

import './style.scss';

require( 'dotenv' ).config();

/**
 * Component
 */
class Content extends Component {
    constructor( props ) {
        super( props );
        this.renderingDataTable = this.renderingDataTable.bind( this );
        this.renderBotonesListado = this.renderBotonesListado.bind( this );
        this.toggleTabs = this.toggleTabs.bind( this );
        this.createCompany = this.createCompany.bind( this );
        this.sendNewCompany = this.sendNewCompany.bind( this );
        this.getAll = this.getAll.bind( this );
        this.activarDesactivarPermisos = this.activarDesactivarPermisos.bind( this );
        this.renderLDT = this.renderLDT.bind( this );
        this.renderModulo = this.renderModulo.bind( this );
        this.cargarModulo = this.cargarModulo.bind( this );
        this.cargarVista = this.cargarVista.bind( this );
        this.getTodosLosLDT = this.getTodosLosLDT.bind( this );
        this.openModal = this.openModal.bind( this );
        this.closeModal = this.closeModal.bind( this );
        this.renderFormParaModificarPermisos = this.renderFormParaModificarPermisos.bind( this );
        this.guardarPermisos = this.guardarPermisos.bind( this );
        this.mandarAeditar = this.mandarAeditar.bind( this );
        this.renderVistasEscogidas = this.renderVistasEscogidas.bind( this );
        this.editarEmpresa = this.editarEmpresa.bind( this );
        this.renderFormParaModificarEmpresa = this.renderFormParaModificarEmpresa.bind( this );
        this.guardarCambiosEmpresa = this.guardarCambiosEmpresa.bind( this );
        this.getModulosParaChecking = this.getModulosParaChecking.bind( this );
        this.getVistasParaChecking = this.getVistasParaChecking.bind( this );
        this.preguntarPorPermisos = this.preguntarPorPermisos.bind( this );
        this.getAllDepartamentos = this.getAllDepartamentos.bind( this );

        this.state = {
            ok: false,
            empresas: false,
            empresasArenderizar: null,
            nombre: '',
            rut: '',
            codigo: '',
            nombreCliente: '',
            email: '',
            cargo: '',
            categoria: '',
            section: '',
            type: '',
            loading: false,
            activeTab: "1",
            ldt: false,
            modulos: null,
            vistas: null,
            ldtEscogido: null,
            modulosEscogidos: null,
            vistasEscogidas: null,
            codigoFinal: null,
            permisosAmodificar: null,
            empresaAmodificar: null,
            modal: false,
            modal2: false,
            modal3: false,
            modal4: false,
            modal5: false,
            esCreacion: true,
            mensajeAviso: '',
            icono: true,
            permisosEditar: null,
            departamentos: null,
            departamentoEscogido: null,
            rutError: '',
            nombreError: '',
            categoriaError: '',
            nombreClienteError: '',
            emailError: '',
            cargoError: '',
        };
    }

    componentDidMount() {
        this.getTodosLosLDT();
        this.getAll();
        this.getAllDepartamentos();
    }

    getAllDepartamentos() {
        return axios.get( process.env.REACT_APP_DEVAPI + '/api/departamentos/getAll' ).then( ( res ) => {
            this.setState( { 
                ok: res.data.ok,
                departamentos: res.data.departamentos,
            } );
        } );
    }

    // llamada API para traer todas las empresas y sus permisos

    getAll() {
        return axios.get( process.env.REACT_APP_DEVAPI + '/api/company/getAll' ).then( ( res ) => {
            this.setState( { 
                ok: res.data.ok,
                empresas: res.data.data,
            } );
        } );
    }

    // llamada API para obtener de la BD todas las LDT y Módulos existentes

    getTodosLosLDT() {
        return axios.get( process.env.REACT_APP_DEVAPI + '/api/permisos/getAll' ).then( ( res ) => {
            const modulos = [];
            const vistas = [];

            res.data.data.forEach( ( lineas ) => {
                lineas.Modulos.forEach( ( mod ) => {
                    modulos.push( mod );
                } );
            } );

            res.data.data.forEach( ( linea ) => {
                linea.vistas.forEach( ( vista ) => {
                    vistas.push( vista );
                } );
            } );

            this.setState( { 
                ok: res.data.ok,
                ldt: res.data.data,
                modulos: modulos,
                vistas: vistas,
            } );
        } );
    }

    // renderizamos la tabla con toda la data de empresas
    renderingDataTable() {
        // renderizando todas las empresas y sus permisos

        const dataParaTable = this.state.empresas.slice();

        // hay que meterles las LDT, los módulos y las vistas al array de todas las empresas
        dataParaTable.forEach( ( empresa ) => {
            // convirtiendo el codigo de permisos en los permisos reales (para visualizar)
            const lineas = [];
            const modu = [];
            const vist = [];
            const cod = empresa.permisos[ 0 ].codigo;

            const array = cod.split( '-' );

            array.forEach( ( co ) => {
                const temp = this.state.ldt.find( ( linea ) => {
                    return linea.codigo === co;
                } );
                const temp2 = this.state.modulos.find( ( mod ) => {
                    return mod.codigo === co;
                } );
                const temp3 = this.state.vistas.find( ( vista ) => {
                    return vista.codigo === co;
                } );
                if ( temp ) {
                    lineas.push( temp.codigo );
                }
                if ( temp2 ) {
                    modu.push( temp2.codigo );
                }
                if ( temp3 ) {
                    vist.push( temp3.codigo );
                }
            } );

            empresa.lineas = lineas.join( ', ' );
            empresa.modulos = modu.join( ', ' );
            empresa.vistas = vist.join( ', ' );
        } );

        const columns = [
            {
                name: 'Nombre',
                selector: row => row.nombre,
                sortable: true,
            },
            {
                name: 'RUT',
                selector: row => row.rut,
                sortable: true,
            },
            {
                name: 'Línea de trabajo',
                selector: row => row.lineas,
                sortable: true,
            },
            {
                name: 'Módulos',
                selector: row => row.modulos,
                sortable: true,
            },
            {
                name: 'Vistas',
                selector: row => row.vistas,
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
                data={ dataParaTable }
                pagination
                paginationComponentOptions={ paginationComponentOptions }
            />
        );
    }

    // renderizado de los botones de acción - Empresas
    renderBotonesListado( row ) {
        return (
            <Fragment>
                { row.permisos[ 0 ].active ? 
                    <button onClick={ () => this.preguntarPorPermisos( row.permisos[ 0 ] ) } className="btn btn-feelrouk-naranja">Deshabilitar</button> : 
                    <button onClick={ () => this.preguntarPorPermisos( row.permisos[ 0 ] ) } className="btn btn-feelrouk">Activar</button>
                } <button onClick={ () => this.editarPermisos( { empresa: row, permisos: row.permisos[ 0 ] } ) } className="btn btn-datatable">
                    <img alt="permisos" style={ { width: "25px" } } src={ editPermisosEmp } />
                </button> <button onClick={ () => this.editarEmpresa( row ) } className="btn btn-datatable">
                    <img alt="editar" style={ { width: "25px" } } src={ edit } />
                </button>
            </Fragment>
        );
    }

    // llamada API para enviar la data al servidor (nueva empresa)
    async sendNewCompany( codigo ) {
        const data = {
            nombre: this.state.nombre,
            rut: parseInt( this.state.rut ),
            cod: codigo,
            nombreCliente: this.state.nombreCliente,
            email: this.state.email,
            cargo: this.state.cargo,
            categoria: this.state.categoria,
            section: "nada",
            type: "nada",
            active: true,
        };

        axios.post( process.env.REACT_APP_DEVAPI + '/api/company/nuevo', data ).then( ( res ) => {
            if ( res.data.ok ) {
                this.setState( {
                    nombre: '',
                    rut: '',
                    nombrePerfil: '',
                    codigo: '',
                    nombreCliente: '',
                    email: '',
                    cargo: '',
                    categoria: '',
                    section: '',
                    type: '',
                    loading: false,
                    ldtEscogido: null,
                    modulosEscogidos: null,
                    vistasEscogidas: null,
                    mensajeAviso: 'Empresa creada satisfactoriamente',
                    icono: true,
                } );
                this.openModal( 3 );
                // obtener de nuevo todas las empresas y renderizar en la lista del tab 2
                this.getAll();
            }
        } ).catch( ( e ) => {
            console.log( e );
            this.setState( {
                loading: false,
                mensajeAviso: 'La empresa no se pudo crear. Intente de nuevo más tarde.',
                icono: false,
            } );
            this.openModal( 3 );
        } );
    }

    // comprobación general del formulario de creación de empresa, antes de enviar a la API

    createCompany() {
        // añadir comprobaciones acá
        let hasVistas = null;
        let hasModulos = null;
        let errores = 0;
        const codigoFinal = [];

        if ( this.state.loading ) {
            return;
        }

        // rutError: '',
        // nombreError: '',
        // categoriaError: '',
        // nombreClienteError: '',
        // emailError: '',
        // cargoError: '',

        if ( this.state.nombre.length === 0 ) {
            errores += 1;
            this.setState( {
                nombreError: "El nombre de la empresa es obligatorio",
            } );
        }
        if ( this.state.rut <= 0 ) {
            errores += 1;
            this.setState( {
                rutError: "El RUT de la empresa es obligatorio",
            } );
        }
        if ( this.state.nombreCliente.length === 0 ) {
            errores += 1;
            this.setState( {
                nombreClienteError: "El nombre del cliente es obligatorio",
            } );
        }
        if ( this.state.email.length === 0 ) {
            errores += 1;
            this.setState( {
                emailError: "El email del cliente es obligatorio",
            } );
        }
        if ( this.state.cargo.length === 0 ) {
            errores += 1;
            this.setState( {
                cargoError: "El cargo del cliente es obligatorio",
            } );
        }
        if ( this.state.categoria.length === 0 ) {
            errores += 1;
            this.setState( {
                categoriaError: "La categoría de la empresa es obligatoria",
            } );
        }

        if ( errores > 0 ) {
            return;
        }

        // poner comprobación acá para LDT, modulos y vistas
        if ( ! this.state.ldtEscogido ) {
            this.setState( {
                mensajeAviso: 'Falta seleccionar los permisos',
                icono: false,
            } );
            this.openModal( 3 );
            return;
        }

        // chequeando que existan módulos de esa LDT y que se haya escogido una (al menos)
        if ( Array.isArray( this.state.ldtEscogido ) ) {
            this.state.ldtEscogido.forEach( ( ldt ) => {
                const foundMod = ldt.Modulos.filter( ( mod ) => {
                    return mod.rel_ldt === ldt.codigo;
                } );

                if ( foundMod.length > 0 ) {
                    hasModulos = foundMod;
                }
            } );
        } else {
            const foundMod = this.state.ldtEscogido.Modulos.filter( ( mod ) => {
                return mod.rel_ldt === this.state.ldtEscogido.codigo;
            } );
            if ( foundMod.length > 0 ) {
                hasModulos = foundMod;
            }
        }

        if ( hasModulos && ! this.state.modulosEscogidos ) {
            this.setState( {
                mensajeAviso: 'Falta seleccionar al menos un módulo',
                icono: false,
            } );
            this.openModal( 3 );
            return;
        }

        if ( ! hasModulos ) {
            this.setState( {
                mensajeAviso: 'Debe existir al menos un módulo para asignar',
                icono: false,
            } );
            this.openModal( 3 );
            return;
        }

        if ( hasModulos ) {
            hasModulos.forEach( ( mod ) => {
                const temp = this.state.vistas.find( ( vista ) => {
                    return vista.rel_mod === mod.codigo;
                } );
                if ( temp ) {
                    hasVistas = [];
                    hasVistas.push( temp );
                }
            } );
        }

        if ( ! hasVistas ) {
            this.setState( {
                mensajeAviso: 'Debe existir al menos una vista para asignar',
                icono: false,
            } );
            this.openModal( 3 );
            return;
        }

        if ( hasVistas && ! this.state.vistasEscogidas ) {
            this.setState( {
                mensajeAviso: 'Falta seleccionar al menos una vista',
                icono: false,
            } );
            this.openModal( 3 );
            return;
        }

        // ver si cada módulo tiene al menos 1 vista
        let todoBien = true;
        this.state.modulosEscogidos.forEach( ( mod ) => {
            const encontradas = this.state.vistasEscogidas.filter( ( vista ) => {
                return vista.rel_mod === mod.codigo;
            } );
            if ( encontradas.length <= 0 ) {
                todoBien = false;
            }
        } );

        if ( ! todoBien ) {
            this.setState( {
                mensajeAviso: 'Falta seleccionar al menos una vista por cada módulo',
                icono: false,
            } );
            this.openModal( 3 );
            return;
        }

        // creando el código con todos los permisos
        this.state.ldtEscogido.forEach( ( ldt ) => {
            codigoFinal.push( ldt.codigo );
        } );
        if ( hasModulos ) {
            this.state.modulosEscogidos.forEach( ( modulo ) => {
                codigoFinal.push( modulo.codigo );
            } );
        }
        if ( hasVistas ) {
            this.state.vistasEscogidas.forEach( ( vista ) => {
                codigoFinal.push( vista.codigo );
            } );
        }
        const codigoFinalFinal = codigoFinal.join( '-' );

        this.setState( {
            loading: true,
        } );

        this.sendNewCompany( codigoFinalFinal );
    }

    preguntarPorPermisos( empresa ) {
        this.setState( {
            permisosEditar: empresa,
        } );

        this.openModal( 5 );
    }

    // llamada API para activar/desactivar permisos de empresa

    activarDesactivarPermisos() {
        this.closeModal( 5 );
        const empresa = Object.assign( {}, this.state.permisosEditar );
        const newStateActive = ! empresa.active;
        const data = {
            id: empresa.id,
            active: newStateActive, 
        };
        axios.post( process.env.REACT_APP_DEVAPI + '/api/company/cambiarPermisos', data ).then( ( res ) => {
            if ( res.data.ok ) {
                this.getAll();
            }
        } );
    }

    // toggle de las tabs

    toggleTabs( tab ) {
        if ( this.state.activeTab !== tab ) {
            this.setState( {
                activeTab: tab,
            } );
        }
    }

    // función que sirve para crear el state de las LDT escogidas (creación de empresa)

    renderLDT( data ) {
        // { type: ldtr.id, checked: e.target.checked, ldt: ldtr }

        // agregando linea de trabajo
        if ( data.checked ) {
            const lineas = this.state.ldtEscogido ? this.state.ldtEscogido.slice() : [];
            lineas.push( data.ldt );
            this.setState( { ldtEscogido: lineas } );

            // quitando linea de trabajo
        } else {
            // let modulos = null;
            let lineas = this.state.ldtEscogido ? this.state.ldtEscogido.slice() : [];

            // si la ldt eran 2 o más
            if ( Array.isArray( lineas ) && lineas.length > 0 ) {
                lineas = lineas.filter( ( ldt ) => {
                    return ldt.id !== data.ldt.id;
                } );

                // ahora a quitar todo lo relacionado con la vieja data
                let nuevosMod = null;
                let nuevasVistas = null;
                if ( this.state.modulosEscogidos ) {
                    nuevosMod = this.state.modulosEscogidos.filter( ( modulo ) => {
                        return modulo.rel_ldt !== data.ldt.codigo;
                    } );
                }
                if ( this.state.vistasEscogidas ) {
                    nuevasVistas = this.state.vistasEscogidas.filter( ( vista ) => {
                        return vista.rel_ldt !== data.ldt.codigo;
                    } );
                }
                if ( lineas.length > 0 ) {
                    this.setState( { 
                        ldtEscogido: lineas,
                        modulosEscogidos: nuevosMod,
                        vistasEscogidas: nuevasVistas, 
                    } );
                } else {
                    this.setState( { 
                        ldtEscogido: null,
                        modulosEscogidos: null,
                        vistasEscogidas: null,
                    }, () => {
                        console.log( 'Eliminado' );
                    } );
                }
            } else {
                this.setState( { 
                    ldtEscogido: null,
                    modulosEscogidos: null,
                    vistasEscogidas: null,
                }, () => {
                    console.log( 'Eliminado' );
                } );
            }
        }
    }

    // función que sirve para crear el state de los modulos escogidos (creación de empresa)

    cargarModulo( data ) {
        // agregando linea de trabajo
        if ( data.checked ) {
            const lineas = this.state.modulosEscogidos !== null ? this.state.modulosEscogidos.slice() : [];
            lineas.push( data.modulo );
            this.setState( { modulosEscogidos: lineas.slice() }, () => {
                console.log( 'agregado' );
            } );

            // quitando linea de trabajo
        } else {
            let lineas = this.state.modulosEscogidos.slice();

            // si la ldt eran 2 o más
            if ( Array.isArray( lineas ) && lineas.length > 1 ) {
                lineas = lineas.filter( ( modulo ) => {
                    return modulo.id !== data.modulo.id;
                } );
                const nuevasVistas = this.state.vistasEscogidas.filter( ( vista ) => {
                    return vista.rel_mod !== data.modulo.codigo;
                } );

                this.setState( { 
                    modulosEscogidos: lineas,
                    vistasEscogidas: nuevasVistas,
                }, () => {
                    console.log( 'agregado' );
                } );
            } else {
                this.setState( { 
                    modulosEscogidos: null,
                    vistasEscogidas: null,
                } );
            }
        }
    }

    // función que sirve para crear el state de las vistas escogidas (creación de empresa)

    cargarVista( data ) {
        // agregando vista
        if ( data.checked ) {
            const vistas = this.state.vistasEscogidas ? this.state.vistasEscogidas.slice() : [];
            vistas.push( data.vista );
            this.setState( { vistasEscogidas: vistas }, () => {
                console.log( 'agregada' );
            } );

            // quitando vista de la lista
        } else {
            let vistas = this.state.vistasEscogidas.slice();

            // si la vista eran 2 o más
            if ( Array.isArray( vistas ) && vistas.length > 0 ) {
                vistas = vistas.filter( ( vista ) => {
                    return vista.id !== data.vista.id;
                } );
                this.setState( { vistasEscogidas: vistas }, () => {
                    console.log( 'agregada' );
                } );
            } else {
                this.setState( { vistasEscogidas: null } );
            }
        }
    }

    // función para renderizar el HTML de los módulos, debajo de las LDT

    renderModulo( ldtr ) {
        const final = [];

        if ( this.state.ldtEscogido ) {
            const checking = this.state.ldtEscogido.find( ( ldt ) => {
                return ldt.id === ldtr.id;
            } );

            if ( checking ) {
                ldtr.Modulos.forEach( ( modulo ) => {
                    final.push(
                        <FormGroup className="mt-5 label-modulos" check key={ modulo.id }>
                            <Label check>
                                <Input type="checkbox" id={ modulo.id } onChange={ ( e ) => this.cargarModulo( { type: modulo.id, checked: e.target.checked, modulo: modulo } ) } />{ ' ' }
                                { modulo.nombre }
                            </Label>
                            <div className="mt-5 ml-20">
                                { this.renderVistasEscogidas( modulo.codigo ) }
                            </div>
                        </FormGroup>
                    );
                } );
                return final;
            }
        }

        return null;
    }

    // función que sirve para renderizar el HTML de las vistas (según módulo)

    renderVistasEscogidas( codigo ) {
        const found = this.state.vistas.find( ( vista ) => {
            return vista.rel_mod === codigo;
        } );

        const finalRender = [];
        if ( found ) {
            if ( Array.isArray( found ) ) {
                found.forEach( ( vista ) => {
                    finalRender.push(
                        <Label className="mt-2" check key={ vista.id }>
                            <Input type="checkbox" id={ vista.id } onChange={ ( e ) => this.cargarVista( { type: vista.id, checked: e.target.checked, vista: vista } ) } />{ ' ' }
                            { vista.nombre }
                        </Label>
                    );
                } );
            } else {
                finalRender.push(
                    <Label className="mt-2" check key={ found.id }>
                        <Input type="checkbox" id={ found.id } onChange={ ( e ) => this.cargarVista( { type: found.id, checked: e.target.checked, vista: found } ) } />{ ' ' }
                        { found.nombre }
                    </Label>
                );
            }
        }
        return finalRender;
    }

    // Función para cargar vistas en la edición de permisos de empresas
    // sirve para devolver (return) las vistas tipo checkbox.
    // devuelve tanto chequeados como no chequeados según los permisos que ya traiga la empresa
    // y según el módulo

    getVistasParaChecking( modulo ) {
        const vistasVariadas = [];

        if ( this.state.modulosEscogidos ) {
            const estaElegido = this.state.modulosEscogidos.find( ( mod ) => {
                return mod.id === modulo.id;
            } );

            if ( estaElegido ) {
                const vistasSi = this.state.vistas.filter( ( vis ) => {
                    return vis.rel_mod === modulo.codigo;
                } );

                vistasSi.forEach( ( vista ) => {
                    if ( this.state.vistasEscogidas ) {
                        const encontradirijilla = this.state.vistasEscogidas.find( ( vis ) => {
                            return vis.id === vista.id;
                        } );

                        if ( encontradirijilla ) {
                            vistasVariadas.push(
                                <FormGroup className="mt-2" check key={ vista.id }>
                                    <Label check>
                                        <Input type="checkbox" id={ vista.id } defaultChecked={ true } onChange={ ( e ) => this.cargarVista( { type: vista.id, checked: e.target.checked, vista: vista } ) } />{ ' ' }
                                        { vista.nombre }
                                    </Label>
                                </FormGroup>
                            );
                        } else {
                            vistasVariadas.push(
                                <FormGroup className="mt-2" check key={ vista.id }>
                                    <Label check>
                                        <Input type="checkbox" id={ vista.id } onChange={ ( e ) => this.cargarVista( { type: vista.id, checked: e.target.checked, vista: vista } ) } />{ ' ' }
                                        { vista.nombre }
                                    </Label>
                                </FormGroup>
                            );
                        }
                    } else {
                        vistasVariadas.push(
                            <FormGroup check key={ vista.id }>
                                <Label check>
                                    <Input type="checkbox" id={ vista.id } onChange={ ( e ) => this.cargarVista( { type: vista.id, checked: e.target.checked, vista: vista } ) } />{ ' ' }
                                    { vista.nombre }
                                </Label>
                            </FormGroup>
                        );
                    }
                } );
                return vistasVariadas;
            }
        }

        return null;
    }

    // Función para cargar módulos en la edición de permisos de empresas
    // sirve para devolver (return) los módulos tipo checkbox.
    // devuelve tanto chequeados como no chequeados según los permisos que ya traiga la empresa
    // y según la LDT

    getModulosParaChecking( ldt ) {
        const modulosvariados = [];
        const ldtArender = this.state.ldt.find( ( linea ) => {
            return linea.id === ldt.id;
        } );

        if ( this.state.ldtEscogido ) {
            const estaElegido = this.state.ldtEscogido.find( ( ld ) => {
                return ld.id === ldt.id;
            } );

            if ( estaElegido ) {
                ldtArender.Modulos.forEach( ( modulo ) => {
                    if ( this.state.modulosEscogidos ) {
                        const encontradirijillo = this.state.modulosEscogidos.find( ( mod ) => {
                            return mod.id === modulo.id;
                        } );
                        if ( encontradirijillo ) {
                            modulosvariados.push(
                                <FormGroup className="mt-4" check key={ modulo.id }>
                                    <Label check>
                                        <Input type="checkbox" id={ modulo.id } defaultChecked={ true } onChange={ ( e ) => this.cargarModulo( { type: modulo.id, checked: e.target.checked, modulo: modulo } ) } />{ ' ' }
                                        { modulo.nombre }
                                    </Label>
                                    <div className="mt-4 ml-20">
                                        { this.getVistasParaChecking( modulo ) }
                                    </div>
                                </FormGroup>
                            );
                        } else {
                            modulosvariados.push(
                                <FormGroup className="mt-4" check key={ modulo.id }>
                                    <Label check>
                                        <Input type="checkbox" id={ modulo.id } onChange={ ( e ) => this.cargarModulo( { type: modulo.id, checked: e.target.checked, modulo: modulo } ) } />{ ' ' }
                                        { modulo.nombre }
                                    </Label>
                                    <div className="mt-4 ml-20">
                                        { this.renderVistasEscogidas( modulo ) }
                                    </div>
                                </FormGroup>
                            );
                        }
                    } else {
                        modulosvariados.push(
                            <FormGroup check key={ modulo.id }>
                                <Label check>
                                    <Input type="checkbox" id={ modulo.id } onChange={ ( e ) => this.cargarModulo( { type: modulo.id, checked: e.target.checked, modulo: modulo } ) } />{ ' ' }
                                    { modulo.nombre }
                                </Label>
                                <div className="ml-20">
                                    { this.renderVistasEscogidas( modulo ) }
                                </div>
                            </FormGroup>
                        );
                    }
                } );
                return modulosvariados;
            }
        }
        return null;
    }

    // función para renderizar el HTML del popup -> Editar permisos de una empresa.

    renderFormParaModificarPermisos() {
        // this.state.permisosAmodificar
        // data.permisos
        // ldtEscogido (donde se guarda la data)
        // modulosEscogidos (donde se guarda la data)
        const ldtFinal = [];

        if ( this.state.ldt && this.state.permisosAmodificar ) {
            const codigo = this.state.permisosAmodificar.permisos.codigo.split( '-' );
            this.state.ldt.forEach( ( ldt ) => {
                const encontrado = codigo.find( ( codig ) => {
                    return codig === ldt.codigo;
                } );
                if ( encontrado ) {
                    ldtFinal.push(
                        <FormGroup className="mt-10" check key={ ldt.id }>
                            <Label className="label-permisos label-ldt" check>
                                <Input type="checkbox" id={ ldt.id } defaultChecked={ true } onChange={ ( e ) => this.renderLDT( { type: ldt.id, checked: e.target.checked, ldt: ldt } ) } />{ ' ' }
                                { ldt.nombre }
                            </Label>
                            <div className="mt-5">
                                { this.getModulosParaChecking( ldt ) }
                            </div>
                        </FormGroup>
                    );
                } else {
                    ldtFinal.push(
                        <FormGroup className="mt-10" check key={ ldt.id }>
                            <Label className="label-permisos" check>
                                <Input type="checkbox" id={ ldt.id } onChange={ ( e ) => this.renderLDT( { type: ldt.id, checked: e.target.checked, ldt: ldt } ) } />{ ' ' }
                                { ldt.nombre }
                            </Label>
                            <div className="mt-5">
                                { this.renderModulo( ldt ) }
                            </div>
                        </FormGroup>
                    );
                }
            } );
        }

        // solamente si existe una empresa escogida:
        if ( this.state.permisosAmodificar ) {
            return (
                <div className="container-form-staff">
                    <h2>Asignar nuevos permisos a: { this.state.permisosAmodificar.empresa.nombre }</h2>
                    <FormGroup tag="fieldset">
                        <legend>Escoger Linea de trabajo</legend>
                        { ldtFinal }
                    </FormGroup>
                    <button
                        className="btn btn-feelrouk mt-20 centrar-boton"
                        onClick={ this.guardarPermisos }
                        disabled={ this.state.loading }>
                        Guardar Permisos
                        { this.state.loading ? (
                            <Spinner />
                        ) : '' }
                    </button>
                </div>
            );
        }

        return "No ha seleccionado ninguna empresa todavía";
    }

    // comprobación básica de los permisos (modificación) antes de enviar al servidor

    guardarPermisos() {
        let hasVistas = null;
        const codigoFinal = [];
        let hasModulos = null;
        // poner acá todo lo que se va a enviar al servidor
        // poner comprobación acá para LDT, modulos y vistas
        if ( ! this.state.ldtEscogido ) {
            this.setState( {
                mensajeAviso: 'Falta seleccionar los permisos',
                icono: false,
            } );
            this.openModal( 3 );
            return;
        }

        // chequeando que existan módulos de esa LDT y que se haya escogido una (al menos)
        if ( Array.isArray( this.state.ldtEscogido ) ) {
            this.state.ldtEscogido.forEach( ( ldt ) => {
                const foundMod = ldt.Modulos.filter( ( mod ) => {
                    return mod.rel_ldt === ldt.codigo;
                } );

                if ( foundMod.length > 0 ) {
                    hasModulos = foundMod;
                }
            } );
        } else {
            const foundMod = this.state.ldtEscogido.Modulos.filter( ( mod ) => {
                return mod.rel_ldt === this.state.ldtEscogido.codigo;
            } );
            if ( foundMod.length > 0 ) {
                hasModulos = foundMod;
            }
        }

        if ( hasModulos && ! this.state.modulosEscogidos ) {
            this.setState( {
                mensajeAviso: 'Falta seleccionar al menos un módulo',
                icono: false,
            } );
            this.openModal( 3 );
            return;
        }

        if ( ! hasModulos ) {
            this.setState( {
                mensajeAviso: 'Debe existir al menos un módulo para asignar',
                icono: false,
            } );
            this.openModal( 3 );
            return;
        }

        if ( hasModulos ) {
            hasModulos.forEach( ( mod ) => {
                const temp = this.state.vistas.find( ( vista ) => {
                    return vista.rel_mod === mod.codigo;
                } );
                if ( temp ) {
                    hasVistas = [];
                    hasVistas.push( temp );
                }
            } );
        }

        if ( ! hasVistas ) {
            this.setState( {
                mensajeAviso: 'Debe existir al menos una vista para asignar',
                icono: false,
            } );
            this.openModal( 3 );
            return;
        }

        if ( hasVistas && ! this.state.vistasEscogidas ) {
            this.setState( {
                mensajeAviso: 'Falta seleccionar al menos una vista',
                icono: false,
            } );
            this.openModal( 3 );
            return;
        }
        // ver si cada módulo tiene al menos 1 vista
        let todoBien = true;
        this.state.modulosEscogidos.forEach( ( mod ) => {
            const encontradas = this.state.vistasEscogidas.filter( ( vista ) => {
                return vista.rel_mod === mod.codigo;
            } );
            if ( encontradas.length <= 0 ) {
                todoBien = false;
            }
        } );

        if ( ! todoBien ) {
            this.setState( {
                mensajeAviso: 'Falta seleccionar al menos una vista por cada módulo',
                icono: false,
            } );
            this.openModal( 3 );
            return;
        }

        // creando el código con todos los permisos
        this.state.ldtEscogido.forEach( ( ldt ) => {
            codigoFinal.push( ldt.codigo );
        } );
        if ( hasModulos ) {
            this.state.modulosEscogidos.forEach( ( modulo ) => {
                codigoFinal.push( modulo.codigo );
            } );
        }
        if ( hasVistas ) {
            this.state.vistasEscogidas.forEach( ( vista ) => {
                codigoFinal.push( vista.codigo );
            } );
        }
        const codigoFinalFinal = codigoFinal.join( '-' );

        this.setState( {
            loading: true,
        } );
        this.mandarAeditar( codigoFinalFinal );
    }

    // llamada API para enviar la modificación de los permisos de una empresa

    mandarAeditar( codigo ) {
        const data = {
            id: this.state.permisosAmodificar.permisos.id,
            codigo: codigo,
        };

        axios.post( process.env.REACT_APP_DEVAPI + '/api/company/editarPermisos', data ).then( ( res ) => {
            if ( res.data.ok ) {
                this.setState( {
                    loading: false,
                    ldtEscogido: null,
                    modulosEscogidos: null,
                    vistasEscogidas: null,
                    modal2: false,
                    mensajeAviso: 'Permisos modificados satisfactoriamente',
                    icono: true,
                } );
                this.openModal( 3 );
                // obtener de nuevo todas las empresas y renderizar en la lista del tab 2
                this.getAll();
            }
        } ).catch( ( e ) => {
            console.log( e );
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
                mensajeAviso: '',
            } );
            break;
        case 4:
            this.setState( { modal4: false } );
            break;
        case 5:
            this.setState( { 
                modal5: false,
                permisosEditar: null,
            } );
            break;
        default:
            break;
        }
    }

    // esta es la función que abre el modal de modificación de permisos (y manda al state la info que se va a usar)

    editarPermisos( perfil ) {
        // servirá para modificar el state con los permisos actuales de la empresa
        const lineasAnt = [];
        const modAnt = [];
        const vistaAnt = [];

        const codigo = perfil.permisos.codigo.split( '-' );

        codigo.forEach( ( cod ) => {
            const lt = this.state.ldt.find( ( linea ) => {
                return linea.codigo === cod;
            } );
            const mod = this.state.modulos.find( ( modulo ) => {
                return modulo.codigo === cod;
            } );
            const vis = this.state.vistas.find( ( vista ) => {
                return vista.codigo === cod;
            } );

            if ( lt ) {
                lineasAnt.push( lt );
            } else if ( mod ) {
                modAnt.push( mod );
            } else if ( vis ) {
                vistaAnt.push( vis );
            }
        } );
        this.setState( { 
            permisosAmodificar: perfil,
            ldtEscogido: lineasAnt,
            modulosEscogidos: modAnt,
            vistasEscogidas: vistaAnt,
        } );
        this.openModal( 2 );
    }

    // esta es la función que abre el modal de modificación de empresas (y manda al state la info que se va a usar)

    editarEmpresa( empresa ) {
        this.setState( { 
            empresaAmodificar: empresa,
        } );
        this.openModal( 4 );
    }

    // función para renderizar el HTML del popup -> modificación de datos de empresa

    renderFormParaModificarEmpresa() {
        const { empresaAmodificar } = this.state;

        if ( empresaAmodificar ) {
            return (
                <div className="container-form-staff">
                    <h2>Modificación de datos de la empresa</h2>
                    <div className="form-group">
                        <Label for="Nombre">Nombre de la empresa</Label>
                        <input
                            type="text"
                            className="form-control"
                            id="Nombre"
                            value={ empresaAmodificar.nombre }
                            onChange={ ( e ) => {
                                const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                empresaAmodificar.nombre = nuevo;
                                const dato = Object.assign( {}, empresaAmodificar );
                                this.setState( {
                                    empresaAmodificar: dato,
                                } );
                            } }
                        />
                    </div>
                    <div className="form-group">
                        <Label for="Nombre">RUT</Label>
                        <input
                            type="number"
                            className="form-control"
                            id="Nombre"
                            value={ empresaAmodificar.rut }
                            onChange={ ( e ) => {
                                empresaAmodificar.rut = e.target.value;
                                const dato = Object.assign( {}, empresaAmodificar );
                                this.setState( {
                                    empresaAmodificar: dato,
                                } );
                            } }
                        />
                    </div>
                    <br></br><br></br>
                    <button
                        className="btn btn-feelrouk centrar-boton"
                        onClick={ this.guardarCambiosEmpresa }
                        disabled={ this.state.loading }>
                        Guardar cambios
                        { this.state.loading ? (
                            <Spinner />
                        ) : '' }
                    </button>
                </div>
            );
        }
    }

    guardarCambiosEmpresa() {
        const { empresaAmodificar } = this.state;

        const data = {
            id: empresaAmodificar.id,
            nombre: empresaAmodificar.nombre,
            rut: empresaAmodificar.rut,
        };

        axios.post( process.env.REACT_APP_DEVAPI + '/api/company/editarEmpresa', data ).then( ( res ) => {
            if ( res.data.ok ) {
                this.setState( {
                    loading: false,
                    empresaAmodificar: null,
                    modal4: false,
                    mensajeAviso: 'Empresa modificada satisfactoriamente',
                    icono: true,
                } );
                this.openModal( 3 );
                // obtener de nuevo todas las empresas y renderizar en la lista del tab 2
                this.getAll();
            }
        } ).catch( ( e ) => {
            console.log( e );
        } );
    }

    render() {
        if ( this.props.info.jerarquia === "administrador" ) {
            const {
                nombre,
                rut,
                nombreCliente,
                email,
                cargo,
                categoria,
            } = this.state;

            let ldt = null;
            let mensaje = null;
            let empresas = null;

            if ( this.state.ldt ) {
                ldt = this.state.ldt.map( ( ldtr ) => {
                    return (
                        <FormGroup className="mt-10" check key={ ldtr.id }>
                            <Label className="label-permisos label-ldt" check>
                                <Input type="checkbox" id={ ldtr.id } onChange={ ( e ) => this.renderLDT( { type: ldtr.id, checked: e.target.checked, ldt: ldtr } ) } />{ ' ' }
                                { ldtr.nombre }
                            </Label>
                            <div className="container-opciones">
                                { this.renderModulo( ldtr ) }
                            </div>
                        </FormGroup>
                    );
                } );
            }

            if ( this.state.mensajeAviso.length > 0 ) {
                mensaje = this.state.mensajeAviso;
            }

            if ( this.state.empresas && this.state.ldt ) {
                empresas = this.renderingDataTable();
            }

            return (
                <Fragment>

                    <Modal isOpen={ this.state.modal } toggle={ () => this.closeModal( 1 ) }>
                        <ModalHeader
                            toggle={ () => this.closeModal( 1 ) }>Administración de empresas</ModalHeader>
                        <ModalBody>
                            <Row className="vertical-gap d-flex justify-content-center">
                                <Col lg="10" className="justify-content-center">
                                    { this.state.esCreacion ? 
                                        <p>Se agregado la empresa junto con sus permisos de manera satisfactoria</p> :
                                        <p>Se han editado los permisos de manera satisfactoria</p>
                                    }
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button className="btn-feelrouk-naranja" onClick={ () => this.closeModal( 1 ) }>Cerrar</Button>
                        </ModalFooter>
                    </Modal>

                    <Modal isOpen={ this.state.modal2 } toggle={ () => this.closeModal( 2 ) }>
                        <ModalHeader
                            toggle={ () => this.closeModal( 2 ) }>Editando Permisos de empresa</ModalHeader>
                        <ModalBody>
                            <Row className="vertical-gap d-flex justify-content-center">
                                <Col lg="10" className="justify-content-center">
                                    { this.renderFormParaModificarPermisos() }
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button className="btn-feelrouk-naranja" onClick={ () => this.closeModal( 2 ) }>Cerrar</Button>
                        </ModalFooter>
                    </Modal>

                    <Modal isOpen={ this.state.modal3 } toggle={ () => this.closeModal( 3 ) }>
                        <ModalHeader
                            toggle={ () => this.closeModal( 3 ) }>Aviso</ModalHeader>
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

                    <Modal isOpen={ this.state.modal4 } toggle={ () => this.closeModal( 4 ) }>
                        <ModalHeader
                            toggle={ () => this.closeModal( 4 ) }>Editando datos de la empresa</ModalHeader>
                        <ModalBody>
                            <Row className="vertical-gap d-flex justify-content-center">
                                <Col lg="10" className="justify-content-center">
                                    { this.renderFormParaModificarEmpresa() }
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
                                    <h2>¿Está seguro que desea modificar el status de esta empresa?</h2>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button className="btn-feelrouk-naranja" onClick={ () => {
                                this.activarDesactivarPermisos();
                            } }>Continuar</Button>
                            <Button className="btn-feelrouk" onClick={ () => this.closeModal( 5 ) }>No</Button>
                        </ModalFooter>
                    </Modal>

                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={ classnames( { active: this.state.activeTab === '1' } ) }
                                onClick={ () => this.toggleTabs( '1' ) }>
                                Crear empresa
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={ classnames( { active: this.state.activeTab === '2' } ) }
                                onClick={ () => this.toggleTabs( '2' ) }>
                                Ver empresas registradas
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={ this.state.activeTab }>
                        <TabPane tabId="1">
                            <Row className="justify-content-end">
                                <Col lg="3">
                                    <CrearDepartamento />
                                </Col>
                            </Row>
                            <Row className={ "vertical-gap d-flex justify-content-center mt-20" }>
                                <Col lg="6" className="justify-content-center">
                                    <div>
                                        <h2>Crear nueva empresa</h2>
                                    </div>                           
                                    <div>
                                        <FormGroup>
                                            <Label for="RUT">RUT de empresa</Label>
                                            <Input type="number" 
                                                name="RUT" 
                                                className={ classnames( 'input-hcm-formulario', { 'is-invalid': this.state.rutError } ) }
                                                value={ rut }
                                                onChange={ ( e ) => {
                                                    const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡_|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                                    this.setState( {
                                                        rut: nuevo,
                                                        rutError: '',
                                                    } );
                                                } }
                                            />
                                            { this.state.rutError.length > 0 ? (
                                                <div className="invalid-feedback">{ this.state.rutError }</div>
                                            ) : '' }
                                        </FormGroup>

                                        <FormGroup>
                                            <Label for="nombreEmpresa">Nombre de empresa</Label>
                                            <Input type="text" 
                                                name="nombreEmpresa" 
                                                className={ classnames( 'input-hcm-formulario', { 'is-invalid': this.state.nombreError } ) }
                                                value={ nombre }
                                                onChange={ ( e ) => {
                                                    const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡_|+\=?;:'",<>\{\}\[\]\\\/]/gi, '' );
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

                                        <FormGroup>
                                            <Label for="categoria">Categoría de la empresa</Label>
                                            <Input type="text" 
                                                name="categoria" 
                                                className={ classnames( 'input-hcm-formulario', { 'is-invalid': this.state.categoriaError } ) }
                                                value={ categoria }
                                                onChange={ ( e ) => {
                                                    const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡_|+\=?;:'",<>\{\}\[\]\\\/]/gi, '' );
                                                    this.setState( {
                                                        categoria: nuevo,
                                                        categoriaError: '',
                                                    } );
                                                } }
                                            />
                                            { this.state.categoriaError.length > 0 ? (
                                                <div className="invalid-feedback">{ this.state.categoriaError }</div>
                                            ) : '' }
                                        </FormGroup>

                                        <FormGroup>
                                            <Label for="clienteAdmin">Nombre del cliente Admin</Label>
                                            <Input type="text" 
                                                name="clienteAdmin" 
                                                className={ classnames( 'input-hcm-formulario', { 'is-invalid': this.state.nombreClienteError } ) }
                                                value={ nombreCliente }
                                                onChange={ ( e ) => {
                                                    const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡_|+\=?;:'",<>\{\}\[\]\\\/]/gi, '' );
                                                    this.setState( {
                                                        nombreCliente: nuevo,
                                                        nombreClienteError: '',
                                                    } );
                                                } }
                                            />
                                            { this.state.nombreClienteError.length > 0 ? (
                                                <div className="invalid-feedback">{ this.state.nombreClienteError }</div>
                                            ) : '' }
                                        </FormGroup>

                                        <FormGroup>
                                            <Label for="emailCliente">Email del cliente admin</Label>
                                            <Input type="email" 
                                                name="emailCliente" 
                                                className={ classnames( 'input-hcm-formulario', { 'is-invalid': this.state.emailError } ) }
                                                value={ email }
                                                onChange={ ( e ) => {
                                                    this.setState( {
                                                        email: e.target.value,
                                                        emailError: '',
                                                    } );
                                                } }
                                            />
                                            { this.state.emailError.length > 0 ? (
                                                <div className="invalid-feedback">{ this.state.emailError }</div>
                                            ) : '' }
                                        </FormGroup>

                                        <FormGroup>
                                            <Label for="Cargo">Cargo del cliente</Label>
                                            <Input type="text" 
                                                name="Cargo" 
                                                className={ classnames( 'input-hcm-formulario', { 'is-invalid': this.state.cargoError } ) }
                                                value={ cargo }
                                                onChange={ ( e ) => {
                                                    const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡|+\=?;:'"<>\{\}\[\]\\\/]/gi, '' );
                                                    this.setState( {
                                                        cargo: nuevo,
                                                        cargoError: '',
                                                    } );
                                                } }
                                            />
                                            { this.state.cargoError.length > 0 ? (
                                                <div className="invalid-feedback">{ this.state.cargoError }</div>
                                            ) : '' }
                                        </FormGroup>

                                    </div>
                                </Col>
                                <Col lg="6" className="justify-content-center pl-30">
                                    <div>
                                        <h2>Escoger Linea de trabajo</h2>
                                    </div>
                                    <div>
                                        <FormGroup tag="fieldset">
                                            { ldt }
                                        </FormGroup>  
                                    </div>
                                </Col>
                            </Row>
                            <Row className="justify-content-end">
                                <Col lg="3" sm="12" xs="12">
                                    <button
                                        className="btn btn-feelrouk justify-content-center"
                                        onClick={ this.createCompany }
                                        disabled={ this.state.loading }
                                    >
                                        Crear Empresa
                                        { this.state.loading ? (
                                            <Spinner />
                                        ) : '' }
                                    </button>
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tabId="2">
                            <Row>
                                <Col lg="12" xs="12" className="mt-30 mb-20">
                                    <h2>Empresas registradas</h2>
                                </Col>
                                { empresas }
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
