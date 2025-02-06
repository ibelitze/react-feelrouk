/**
 * External Dependencies
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { MensajeBloqueo } from '../no-permisos';
import { Spinner, Row, Col, Button, Modal, ModalFooter, ModalHeader, ModalBody, FormGroup, Label, Input, 
    DropdownItem, DropdownToggle, DropdownMenu, Dropdown } from 'reactstrap';
import DataTable from 'react-data-table-component';
import Icon from '../icon';
import Select from 'react-select';

import agregar from '../../../common-assets/images/vcm/plus-circle.svg';
import { faCaretDown, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ver from '../../../common-assets/images/vcm/eye.svg';
import edit from '../../../common-assets/images/vcm/edit.svg';
import borrar from '../../../common-assets/images/vcm/x-circle.svg';

import { Editor } from "react-draft-wysiwyg";
import { EditorState } from 'draft-js';
import { convertToHTML, convertFromHTML } from 'draft-convert';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import CrearPerfilHCM from '../crear-perfil';
require( 'dotenv' ).config();
import classnames from 'classnames/dedupe';
/**
 * Internal Dependencies
 */
import './style.scss';
// import Snippet from '../../components/snippet';

/**
 * Component
 */
class ListadoPerfiles extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            modal1: false,
            modal2: false,
            modal3: false,
            tituloModal: '',
            mensajeAviso: '',
            icono: false,
            dropdownOpen: false,
            dropdownOpen2: false,
            dropdownOpen3: false,
            todosLosPerfiles: null,
            todosLosPerfilesFiltrado: null,
            todasLasPosiciones: null,
            perfilAeliminar: null,
            editorState: EditorState.createEmpty(),
            rangoBool: false,
            sueldoMIN: 0,
            sueldoMAX: 0,
            textoFinal: '',
            categorias: null,
            subcategorias: null,
            textoArea: '',
            textoHabilidad: '',
            categoriasFiltradas: [],
            subFiltradas: [],
            perfilShow: null,
            perfilEdit: null,
            perfiles: [
                { id: 1, nombre: 'Básico' },
                { id: 2, nombre: 'Medio' },
                { id: 3, nombre: 'Alto' },
            ],
            perfilEscogido: null,
            tipoEmpleo: [
                { id: 4, nombre: 'Contrato fijo' },
                { id: 5, nombre: 'A plazo' },
                { id: 6, nombre: 'Indefinido' },
                { id: 7, nombre: 'Outsourcing' },
            ],
            tipoEmpleoEscogido: null,
            modalidadLaboral: [
                { id: 8, nombre: 'Remoto' },
                { id: 9, nombre: 'Presencial' },
                { id: 10, nombre: 'Híbrido' },
            ],
            modalidadEscogida: null,
            tipoSueldo: null,
            nuevoRequisito: '',
            requisitos: [],
            nuevoBeneficio: '',
            beneficios: [],
            nuevoTag: '',
            tags: [],
            empresas: null,
            empresaEscogida: null,
            areaTrabajoError: '',
        };
        this.openModal = this.openModal.bind( this );
        this.closeModal = this.closeModal.bind( this );
        this.toggle = this.toggle.bind( this );
        this.toggleDropdown = this.toggleDropdown.bind( this );
        this.renderingDataTable = this.renderingDataTable.bind( this );
        this.renderBotonesListado = this.renderBotonesListado.bind( this );
        this.preguntarEliminar = this.preguntarEliminar.bind( this );
        this.eliminarDefinitivamente = this.eliminarDefinitivamente.bind( this );
        this.getPerfiles = this.getPerfiles.bind( this );
        this.getPosiciones = this.getPosiciones.bind( this );
        this.editarPerfil = this.editarPerfil.bind( this );
        this.mostrarPerfilCompleto = this.mostrarPerfilCompleto.bind( this );
        this.renderVerPerfilCompleto = this.renderVerPerfilCompleto.bind( this );
        this.renderEditarPerfil = this.renderEditarPerfil.bind( this );
        this.renderRangoSueldo = this.renderRangoSueldo.bind( this );
        this.revisarIngreso = this.revisarIngreso.bind( this );
        this.renderOpciones = this.renderOpciones.bind( this );
        this.removerOpcion = this.removerOpcion.bind( this );
        this.guardarPerfil = this.guardarPerfil.bind( this );
        this.returnOptionsForEditor = this.returnOptionsForEditor.bind( this );
        this.onEditorStateChange = this.onEditorStateChange.bind( this );
        this.getEmpresas = this.getEmpresas.bind( this );
        this.volverAcargarTodo = this.volverAcargarTodo.bind( this );

        this.filterDataTable = this.filterDataTable.bind( this );
        this.renderAutocompletado = this.renderAutocompletado.bind( this );
        this.filtrarResultado = this.filtrarResultado.bind( this );
        this.renderCategorias = this.renderCategorias.bind( this );
        this.anadirAreaHabilidad = this.anadirAreaHabilidad.bind( this );
    }

    componentDidMount() {
        this.getEmpresas();
        this.getAllTags();
    }

    // llamada API para traer todos los permisos
    async getPerfiles( idEmpresa ) {
        const data = {
            id: idEmpresa,
        };
        return axios.post( process.env.REACT_APP_DEVAPI + '/api/hcm/getPerfiles', data ).then( ( res ) => {
            this.setState( { 
                ok: res.data.ok,
                todosLosPerfiles: res.data.data,
                todosLosPerfilesFiltrado: res.data.data,
            } );
        } );
    }

    async getAllTags() {
        return axios.get( process.env.REACT_APP_DEVAPI + '/api/hcm/tags/getAll' ).then( ( res ) => {
            const categorias = [];
            const subcategorias = [];
            res.data.data.forEach( ( tag ) => {
                if ( tag.tipo === "categoria" ) {
                    categorias.push( tag );
                }
                if ( tag.tipo === "subcategoria" ) {
                    subcategorias.push( tag );
                }
            } );

            this.setState( {
                categorias: categorias,
                categoriasFiltradas: categorias,
                subcategorias: subcategorias,
                subFiltradas: subcategorias,
            } );
        } );
    }

    // llamada API para traer todos los permisos
    getPosiciones( idEmpresa ) {
        const data = {
            id: idEmpresa,
        };

        return axios.post( process.env.REACT_APP_DEVAPI + '/api/hcm/getByEmpresa', data ).then( ( res ) => {
            this.setState( { 
                ok: res.data.ok,
                todasLasPosiciones: res.data.data,
            } );
        } );
    }

    // llamada API para traer todas las empresas (cuando se usa el dropdown)
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

    filtrarResultado( tipo ) {
        if ( tipo === "categorias" ) {
            if ( this.state.textoArea.length > 0 ) {
                const texto = this.state.textoArea;
                const filtrado = this.state.categorias.filter( ( cat ) => {
                    return cat.nombre.toLowerCase().includes( texto.toLowerCase() );
                } );

                this.setState( {
                    categoriasFiltradas: filtrado,
                } );
            } else {
                const temp = this.state.categorias.slice();
                this.setState( {
                    categoriasFiltradas: temp,
                } );
            }
        }

        if ( tipo === "subcategorias" ) {
            if ( this.state.textoHabilidad.length > 0 ) {
                const texto = this.state.textoHabilidad;
                const filtrado = this.state.subFiltradas.filter( ( cat ) => {
                    return cat.nombre.toLowerCase().includes( texto.toLowerCase() );
                } );

                this.setState( {
                    subFiltradas: filtrado,
                } );
            } else {
                const temp = this.state.subcategorias.slice();
                this.setState( {
                    subFiltradas: temp,
                } );
            }
        }
    }

    renderCategorias( tipo ) {
        const temp = this.state.tags.slice();
        let aRenderizar = null;

        if ( tipo === "categorias" ) {
            aRenderizar = temp.filter( ( tag ) => {
                return tag.tipo === "categoria";
            } );
        } else if ( tipo === "subcategorias" ) {
            aRenderizar = temp.filter( ( tag ) => {
                return tag.tipo === "subcategoria";
            } );
        }

        if ( aRenderizar ) {
            const renderizado = aRenderizar.map( ( cat ) => {
                return (
                    <div key={ cat.id } className="div-requisitos">
                        <p> { cat.nombre } </p>
                        <button
                            className="btn btn-add-permiso justify-content-center"
                            onClick={ () => {
                                this.removerOpcion( cat.id, tipo );
                            } }>
                            <FontAwesomeIcon icon={ faTrashAlt } />
                        </button>
                    </div>
                );
            } );

            return renderizado;
        }

        return null;
    }

    renderAutocompletado( tipo ) {
        if ( tipo === "categorias" && this.state.textoArea.length > 0 ) {
            return (
                <ul className="autocomplete">
                    { this.state.categoriasFiltradas.map( ( categoria ) => {
                        // let className;
                        // if ( index === active ) {
                        //     className = "active";
                        // }
                        return (
                            <li 
                                role="presentation"
                                key={ categoria.id }
                                onClick={ () => {
                                    this.anadirAreaHabilidad( categoria );
                                } }>
                                { categoria.nombre }
                            </li>
                        );
                    } ) }
                </ul>
            );
        }
        if ( tipo === "subcategorias" && this.state.textoHabilidad.length > 0 ) {
            return (
                <ul className="autocomplete">
                    { this.state.subFiltradas.map( ( categoria ) => {
                        // let className;
                        // if ( index === active ) {
                        //     className = "active";
                        // }
                        return (
                            <li 
                                role="presentation"
                                key={ categoria.id }  
                                onClick={ () => {
                                    this.anadirAreaHabilidad( categoria );
                                } }>
                                { categoria.nombre }
                            </li>
                        );
                    } ) }
                </ul>
            );
        }

        return null;
    }

    anadirAreaHabilidad( value ) {
        const temp = this.state.tags.slice();
        const encontrado = temp.find( ( tg ) => {
            return tg.id === value.id;
        } );

        if ( ! encontrado ) {
            temp.push( value );

            const cats = this.state.categorias.slice();
            const subs = this.state.subcategorias.slice();
            this.setState( {
                tags: temp,
                textoArea: '',
                textoHabilidad: '',
                categoriasFiltradas: cats,
                subFiltradas: subs,
            } );
        } else {
            const cats = this.state.categorias.slice();
            const subs = this.state.subcategorias.slice();
            this.setState( {
                textoArea: '',
                textoHabilidad: '',
                categoriasFiltradas: cats,
                subFiltradas: subs,
            } );
        }
    }

    volverAcargarTodo() {
        this.setState( {
            todosLosPerfilesFiltrado: null,
            empresaEscogida: null,
        } );
        // if ( this.state.empresaEscogida ) {
        //     this.getPerfiles( this.state.empresaEscogida.id );
        //     this.getPosiciones( this.state.empresaEscogida.id );
        // }
    }

    returnOptionsForEditor() {
        return (
            {
                options: [ 'inline', 'fontSize', 'list', 'textAlign', 'emoji', 'remove', 'history' ],
            }
        );
    }

    onEditorStateChange( editorState ) {
        const currentContentAsHTML = convertToHTML( editorState.getCurrentContent() );
        this.setState( {
            editorState: editorState,
            textoFinal: currentContentAsHTML,
        } );
    }

    guardarPerfil() {
        // comprobaciones
        // const rangoEsTrue = this.state.rangoBool && ( this.state.perfilEdit.sueldoMIN <= 0 || this.state.perfilEdit.sueldoMAX <= 0 );

        if ( this.state.perfilEdit.nombre.length <= 0 || ! this.state.perfilEdit.tipo_sueldo ) {
            this.setState( {
                mensajeAviso: 'Debe rellenar todos los campos',
                icono: false,
            } );
            this.openModal( 2 );
            return;
        }
        if ( parseInt( this.state.perfilEdit.sueldoMIN ) <= 0 || parseInt( this.state.perfilEdit.sueldoMAX ) <= 0 ) {
            this.setState( {
                mensajeAviso: 'Debe ingresar un rango de sueldo mínimo y máximo.',
                icono: false,
            } );
            this.openModal( 2 );
            return;
        }
        if ( this.state.textoFinal.length <= 0 ) {
            this.setState( {
                mensajeAviso: 'Debe ingresar una descripción para el perfil',
                icono: false,
            } );
            this.openModal( 2 );
            return;
        }
        if ( ! this.state.perfilEscogido ) {
            this.setState( {
                mensajeAviso: 'Debe escoger al menos 1 tipo de perfil',
                icono: false,
            } );
            this.openModal( 2 );
            return;
        }
        if ( ! this.state.tipoEmpleoEscogido ) {
            this.setState( {
                mensajeAviso: 'Debe escoger 1 tipo de empleo para el perfil',
                icono: false,
            } );
            this.openModal( 2 );
            return;
        }
        if ( ! this.state.modalidadEscogida ) {
            this.setState( {
                mensajeAviso: 'Debe escoger al menos 1 tipo de modalidad laboral para el perfil',
                icono: false,
            } );
            this.openModal( 2 );
            return;
        }
        if ( this.state.tags.length <= 0 ) {
            this.setState( {
                areaTrabajoError: 'Debe escoger al menos 1 área de trabajo',
                mensajeAviso: 'Debe escoger al menos 1 área de trabajo o habilidad asociada.',
                icono: false,
            } );
            this.openModal( 2 );
            return;
        }
        if ( this.state.requisitos.length <= 0 || this.state.beneficios.length <= 0 ) {
            this.setState( {
                mensajeAviso: 'Debe ingresar al menos 1 requisito y 1 beneficio por perfil',
                icono: false,
            } );
            this.openModal( 2 );
            return;
        }

        const foundIguales = this.state.todosLosPerfiles.find( ( perfil ) => {
            return ( perfil.nombre === this.state.perfilEdit.nombre && perfil.id !== this.state.perfilEdit.id );
        } );

        if ( foundIguales ) {
            this.setState( {
                mensajeAviso: 'Ya existe un perfil usando ese mismo nombre.',
                icono: false,
            } );
            this.openModal( 2 );
            return;
        }

        let requisitosDone = [];
        let beneficiosDone = [];
        let tagsDone = null;

        this.state.requisitos.forEach( ( req ) => {
            requisitosDone.push( req.nombre );
        } );

        this.state.beneficios.forEach( ( bene ) => {
            beneficiosDone.push( bene.nombre );
        } );

        requisitosDone = requisitosDone.filter( ( item, index ) => {
            return requisitosDone.indexOf( item ) === index;
        } );
        beneficiosDone = beneficiosDone.filter( ( item, index ) => {
            return beneficiosDone.indexOf( item ) === index;
        } );

        requisitosDone = requisitosDone.join( ',' );
        beneficiosDone = beneficiosDone.join( ',' );

        if ( this.state.tags.length > 0 ) {
            const temp = this.state.tags.slice();
            tagsDone = JSON.stringify( temp );
        }

        // guardado
        const data = {
            id: this.state.perfilEdit.id,
            nombre: this.state.perfilEdit.nombre,
            edadMIN: parseInt( this.state.perfilEdit.edadMIN ),
            edadMAX: parseInt( this.state.perfilEdit.edadMAX ),
            nivelPerfil: this.state.perfilEscogido.nombre,
            tipoEmpleo: this.state.tipoEmpleoEscogido.nombre,
            modalidad: this.state.modalidadEscogida.nombre,
            rangoSueldoBool: this.state.rangoBool,
            sueldoMIN: parseInt( this.state.perfilEdit.sueldoMIN ),
            sueldoMAX: parseInt( this.state.perfilEdit.sueldoMAX ),
            tipoSueldo: this.state.perfilEdit.tipo_sueldo,
            descripcion: this.state.textoFinal,
            requisitos: requisitosDone,
            beneficios: beneficiosDone,
            tags: tagsDone,
            relEmpresa: this.state.perfilEdit.rel_empresa,
        };

        // llamada aquí - finalmente
        axios.post( process.env.REACT_APP_DEVAPI + '/api/hcm/editarPerfil', data ).then( ( res ) => {
            if ( res.data.ok ) {
                this.setState( {
                    editorState: EditorState.createEmpty(),
                    perfilEscogido: null,
                    tipoEmpleoEscogido: null,
                    modalidadEscogida: null,
                    rangoBool: false,
                    tipoSueldo: null,
                    sueldoMIN: 0,
                    sueldoMAX: 0,
                    edadMAX: 0,
                    edadMIN: 0,
                    nombre: '',
                    textoFinal: '',
                    requisitos: [],
                    beneficios: [],
                    tags: [],
                    loading: false,
                    mensajeAviso: 'Perfil editado satisfactoriamente',
                    icono: true,
                } );
                this.closeModal( 3 );
                this.openModal( 2 );
            }
        } ).catch( ( e ) => {
            console.log( e );
            this.setState( {
                loading: false,
                mensajeAviso: 'No se pudo editar el perfil. Intente de nuevo más tarde.',
                icono: false,
            } );
            this.openModal( 2 );
        } );

        this.volverAcargarTodo();
    }

    // para los dropdowns
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
        case 4:
            state = ! this.state.dropdownOpen4;
            this.setState( { dropdownOpen4: state } );
            break;
        default:
            break;
        }
    }

    // Abrir/Cerrar dropdown
    toggleDropdown( number ) {
        let stat = null;
        switch ( number ) {
        case 1:
            stat = ! this.state.dropDownValue;
            this.setState( { dropDownValue: stat } );
            break;
        case 2:
            stat = ! this.state.dropDownValue2;
            this.setState( { dropDownValue2: stat } );
            break;
        default:
            break;
        }
    }

    // renderizamos la cajita con la empresa escogida para ver sus perfiles
    renderEmpresa( emp ) {
        if ( emp ) {
            let escogida = null;
            this.state.empresas.forEach( ( empresa ) => {
                if ( empresa.id === emp ) {
                    escogida = Object.assign( {}, empresa );
                }
            } );
            this.setState( {
                empresaEscogida: escogida,
            } );

            this.getPerfiles( escogida.id );
            this.getPosiciones( escogida.id );
        }
    }

    // renderizamos la tabla con toda la data de perfiles
    renderingDataTable() {
        const columns = [
            {
                name: 'Nombre',
                selector: row => row.nombre,
                sortable: false,
            },
            {
                name: 'Nivel de perfil',
                selector: row => row.nivel_perfil,
                sortable: true,
            },
            {
                name: 'Tipo de empleo',
                selector: row => row.tipo_empleo,
                sortable: true,
            },
            {
                name: 'Modalidad',
                selector: row => row.modalidad,
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
                data={ this.state.todosLosPerfilesFiltrado }
                pagination
                paginationComponentOptions={ paginationComponentOptions }
            />
        );
    }

    // renderizado de los botones de acción - Perfiles
    renderBotonesListado( row ) {
        return (
            <Fragment>
                <Button className="btn btn-datatable" onClick={ () => {
                    this.mostrarPerfilCompleto( row );
                } } >
                    <img alt="ver" style={ { width: "25px" } } src={ ver } />
                </Button>
                <Button className="btn btn-datatable" onClick={ () => { 
                    this.editarPerfil( row ); 
                } } >
                    <img alt="editar" style={ { width: "25px" } } src={ edit } />
                </Button>
                <Button className="btn btn-datatable" onClick={ () => { 
                    this.preguntarEliminar( row ); 
                } } >
                    <img alt="editar" style={ { width: "25px" } } src={ borrar } />
                </Button>
            </Fragment>
        );
    }

    renderRangoSueldo() {
        return (
            <FormGroup>
                <Label for="rangoSueldo">Rango de sueldo *</Label>
                <Row>
                    <Col md="6" xs="6">
                        <Label for="min">Min</Label>
                        <Input type="text" 
                            name="sueldo-min" 
                            className="input-hcm-formulario"
                            value={ this.state.perfilEdit.sueldoMIN }
                            onChange={ ( e ) => {
                                const dato = Object.assign( {}, this.state.perfilEdit );
                                dato.sueldoMIN = e.target.value;
                                this.setState( {
                                    perfilEdit: dato,
                                } );
                            } }
                        />
                    </Col>
                    <Col md="6" xs="6">
                        <Label for="min">Max</Label>
                        <Input type="text" 
                            name="sueldo-max" 
                            className="input-hcm-formulario"
                            value={ this.state.perfilEdit.sueldoMAX }
                            onChange={ ( e ) => {
                                const dato = Object.assign( {}, this.state.perfilEdit );
                                dato.sueldoMAX = e.target.value;
                                this.setState( {
                                    perfilEdit: dato,
                                } );
                            } }
                        />
                    </Col>
                </Row>
            </FormGroup>
        );
    }

    // renderizado del perfil completo (visualizar perfil)
    renderVerPerfilCompleto() {
        let beneficios = null;
        let requisitos = null;
        let tags = null;

        if ( this.state.perfilShow.beneficios ) {
            beneficios = [];
            beneficios.push( this.state.perfilShow.beneficios.map( ( bene ) => {
                return (
                    <div key={ bene.id } className="div-requisitos">
                        <p> { bene.beneficio } </p>
                    </div>
                );
            } ) );
        }
        if ( this.state.perfilShow.requisitos ) {
            requisitos = [];
            requisitos.push( this.state.perfilShow.requisitos.map( ( requi ) => {
                return (
                    <div key={ requi.id } className="div-requisitos">
                        <p> { requi.requisito } </p>
                    </div>
                );
            } ) );
        }
        if ( this.state.perfilShow.tags ) {
            tags = [];
            tags.push( this.state.perfilShow.tags.map( ( tag ) => {
                return (
                    <div key={ tag.id } className="div-requisitos">
                        <p> { tag.nombre } </p>
                    </div>
                );
            } ) );
        }

        const mostrarSueldo = <Fragment>
            <Row>
                <Col lg="6">
                    <p>Sueldo mínimo: <span className="bolder">{ this.state.perfilShow.sueldoMIN }</span></p>
                </Col>
                <Col lg="6">
                    <p>Sueldo máximo: <span className="bolder">{ this.state.perfilShow.sueldoMAX }</span></p>
                </Col>
            </Row>
        </Fragment>;

        const mostrarRequisitos = <div className="div-listas">
            <h3>Requisitos: </h3>
            { requisitos }
        </div>;
        const mostrarBeneficios = <div className="div-listas">
            <h3>Beneficios: </h3>
            { beneficios }
        </div>;
        const mostrarTags = <div className="div-listas">
            <h3>Tags y Habilidades: </h3>
            { tags }
        </div>;

        const contentDescripcion = EditorState.createWithContent( convertFromHTML( this.state.perfilShow.descripcion ) );

        return (
            <Fragment>
                <Row>
                    <Col lg="6" sm="12" xs="12">
                        <h2>{ this.state.perfilShow.nombre }</h2>
                        <div className="mb-30"></div>
                        <div>
                            <h3>Nivel de perfil: </h3>
                            <p>{ this.state.perfilShow.nivel_perfil }</p>
                        </div>
                        <div>
                            <h3>Modalidad: </h3>
                            <p>{ this.state.perfilShow.modalidad }</p>
                        </div>
                        <div>
                            <h3>Tipo de empleo: </h3>
                            <p>{ this.state.perfilShow.tipo_empleo }</p>
                        </div>
                        <div>
                            <h3>Tipo de sueldo: </h3>
                            <p>{ this.state.perfilShow.tipo_sueldo }</p>
                        </div>
                        <Row>
                            <Col lg="6">
                                <p>Edad mínima: <span className="bolder">{ this.state.perfilShow.edadMIN }</span></p>
                            </Col>
                            <Col lg="6">
                                <p>Edad máxima: <span className="bolder">{ this.state.perfilShow.edadMAX }</span></p>
                            </Col>
                        </Row>
                        { mostrarSueldo }
                    </Col>
                    <Col lg="6" sm="12" xs="12">
                        <div className="mb-40"></div>
                        { this.state.perfilShow.requisitos.length > 0 ? mostrarRequisitos : null }
                        { this.state.perfilShow.beneficios.length > 0 ? mostrarBeneficios : null }
                        { this.state.perfilShow.tags.length > 0 ? mostrarTags : null }
                    </Col>
                </Row>
                <Row>
                    <Col lg="12" sm="12" xs="12">
                        <Editor toolbarClassName="hide-toolbar" 
                            editorClassName="editor-show" 
                            editorState={ contentDescripcion } 
                            readOnly />
                    </Col>
                </Row>
            </Fragment>
        );
    }

    renderEditarPerfil() {
        const {
            textoArea,
            textoHabilidad,
            areaTrabajoError,
        } = this.state;

        // renderizando las opciones del dropdown: niveles del perfil
        const nivelesPerfil = this.state.perfiles.map( ( perfil ) => {
            return (
                <DropdownItem 
                    onClick={ () => {
                        const clon = Object.assign( {}, perfil );
                        this.setState( {
                            perfilEscogido: clon,
                        } );
                    } } 
                    key={ perfil.id }>
                    { perfil.nombre }
                </DropdownItem>
            );
        } );

        // renderizando las opciones del dropdown: Tipo de empleo
        const tipoDeEmpleo = this.state.tipoEmpleo.map( ( empleo ) => {
            return (
                <DropdownItem 
                    onClick={ () => {
                        const clon = Object.assign( {}, empleo );
                        this.setState( {
                            tipoEmpleoEscogido: clon,
                        } );
                    } } 
                    key={ empleo.id }>
                    { empleo.nombre }
                </DropdownItem>
            );
        } );

        // renderizando las opciones del dropdown: modalidad laboral
        const modalidadLaboral = this.state.modalidadLaboral.map( ( modalidad ) => {
            return (
                <DropdownItem 
                    onClick={ () => {
                        const clon = Object.assign( {}, modalidad );
                        this.setState( {
                            modalidadEscogida: clon,
                        } );
                    } } 
                    key={ modalidad.id }>
                    { modalidad.nombre }
                </DropdownItem>
            );
        } );

        const mensajePrevio = <div> Seleccionar <FontAwesomeIcon icon={ faCaretDown } /> </div>;

        // render de requisitos, beneficios y tags actuales (en el state)
        const requisitosRenderizados = this.renderOpciones( "requisitos" );
        const beneficiosRenderizados = this.renderOpciones( "beneficios" );
        const tagsRenderizados = this.renderOpciones( "tags" );

        // esto renderiza el resultado del checkbox (true or false), devuelve los inputs o null
        const rangoSueldo = this.renderRangoSueldo();

        // state del editor (descripción)
        const editorOptions = this.returnOptionsForEditor();

        return (
            <Fragment>
                <Row>
                    <Col lg="6" sm="12" xs="12">
                        <FormGroup>
                            <Label for="nombreperfil">Nombre de perfil *</Label>
                            <Input type="text" 
                                name="nombreperfil" 
                                className="input-hcm-formulario"
                                value={ this.state.perfilEdit.nombre }
                                onChange={ ( e ) => {
                                    const dato = Object.assign( {}, this.state.perfilEdit );
                                    dato.nombre = e.target.value;
                                    this.setState( {
                                        perfilEdit: dato,
                                    } );
                                } }
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="rut">Rango de edad *</Label>
                            <Row>
                                <Col md="5" xs="5">
                                    <Label for="edad-min">Min</Label>
                                    <Input type="text" 
                                        name="edad-min" 
                                        className="input-hcm-formulario"
                                        value={ this.state.perfilEdit.edadMIN }
                                        onChange={ ( e ) => {
                                            const dato = Object.assign( {}, this.state.perfilEdit );
                                            dato.edadMIN = e.target.value;
                                            this.setState( {
                                                perfilEdit: dato,
                                            } );
                                        } }
                                    />
                                </Col>
                                <Col md="5" xs="5">
                                    <Label for="edad-max">Max</Label>
                                    <Input type="text" 
                                        name="edad-max" 
                                        className="input-hcm-formulario"
                                        value={ this.state.perfilEdit.edadMAX }
                                        onChange={ ( e ) => {
                                            const dato = Object.assign( {}, this.state.perfilEdit );
                                            dato.edadMAX = e.target.value;
                                            this.setState( {
                                                perfilEdit: dato,
                                            } );
                                        } }

                                    />
                                </Col>
                            </Row>
                        </FormGroup>
                        <div className="mt-35"></div>
                        <FormGroup>
                            <Label for="Dropdown1">Nivel del perfil *</Label>
                            <Dropdown className="reclutamiento-dropdown" isOpen={ this.state.dropdownOpen } toggle={ () => this.toggle( 1 ) }>
                                <DropdownToggle caret>
                                    { this.state.perfilEscogido ? this.state.perfilEscogido.nombre : mensajePrevio }
                                </DropdownToggle>
                                <DropdownMenu>
                                    { nivelesPerfil }
                                </DropdownMenu>
                            </Dropdown>
                        </FormGroup>
                        <FormGroup>
                            <Label for="Dropdown2">Tipo de empleo *</Label>
                            <Dropdown className="reclutamiento-dropdown" isOpen={ this.state.dropdownOpen2 } toggle={ () => this.toggle( 2 ) }>
                                <DropdownToggle caret>
                                    { this.state.tipoEmpleoEscogido ? this.state.tipoEmpleoEscogido.nombre : mensajePrevio }
                                </DropdownToggle>
                                <DropdownMenu>
                                    { tipoDeEmpleo }
                                </DropdownMenu>
                            </Dropdown>
                        </FormGroup>
                        <FormGroup>
                            <Label for="Dropdown3">Modalidad Laboral *</Label>
                            <Dropdown className="reclutamiento-dropdown" isOpen={ this.state.dropdownOpen3 } toggle={ () => this.toggle( 3 ) }>
                                <DropdownToggle caret>
                                    { this.state.modalidadEscogida ? this.state.modalidadEscogida.nombre : mensajePrevio }
                                </DropdownToggle>
                                <DropdownMenu>
                                    { modalidadLaboral }
                                </DropdownMenu>
                            </Dropdown>
                        </FormGroup>

                        { rangoSueldo }

                        <div className="mt-35"></div>
                        <p>Tipo de sueldo</p>
                        <Col>
                            <FormGroup>
                                <Label check>
                                    <Input type="radio" 
                                        value="Liquido" 
                                        name="tipoSueldo"
                                        checked={ this.state.perfilEdit.tipo_sueldo === "Liquido" ? true : false }
                                        onChange={ ( e ) => {
                                            const dato = Object.assign( {}, this.state.perfilEdit );
                                            dato.tipo_sueldo = e.target.value;
                                            this.setState( {
                                                perfilEdit: dato,
                                            } );
                                        } }
                                    />{ ' ' }
                                    Líquido
                                </Label>
                            </FormGroup>
                            <FormGroup>
                                <Label check>
                                    <Input type="radio" 
                                        value="Bruto" 
                                        name="tipoSueldo"
                                        checked={ this.state.perfilEdit.tipo_sueldo === "Bruto" ? true : false }
                                        onChange={ ( e ) => {
                                            const dato = Object.assign( {}, this.state.perfilEdit );
                                            dato.tipo_sueldo = e.target.value;
                                            this.setState( {
                                                perfilEdit: dato,
                                            } );
                                        } }
                                    />{ ' ' }
                                    Bruto
                                </Label>
                            </FormGroup>
                        </Col>
                    </Col>

                    <Col lg="6" sm="12" xs="12">
                        <FormGroup>
                            <Label for="area-categoria">Escoger áreas de trabajo:</Label>
                            <Input type="text" 
                                name="area-categoria" 
                                className={ classnames( 'input-hcm-formulario', { invalid: areaTrabajoError } ) }
                                value={ textoArea }
                                onChange={ ( e ) => {
                                    const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                    this.setState( {
                                        textoArea: nuevo,
                                    }, () => {
                                        this.filtrarResultado( 'categorias' );
                                    } );
                                } }
                            />
                            { this.renderAutocompletado( "categorias" ) }
                            { areaTrabajoError.length > 0 ? (
                                <div className="invalid-feedback">{ areaTrabajoError }</div>
                            ) : '' }
                        </FormGroup>
                        <Row>
                            <Col>
                                { this.renderCategorias( 'categorias' ) }
                            </Col>
                        </Row>
                        <div className="mb-30"></div>
                        <div className="form-group-input" style={ { marginBottom: '5px' } }>
                            <Label for="autocomplete">Escoger Habilidades específicas:</Label>
                            <Input type="text" 
                                name="area-categoria" 
                                className="input-hcm-formulario"
                                value={ textoHabilidad }
                                onChange={ ( e ) => {
                                    const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                    this.setState( {
                                        textoHabilidad: nuevo,
                                    }, () => {
                                        this.filtrarResultado( 'subcategorias' );
                                    } );
                                } }
                            />
                            { this.renderAutocompletado( "subcategorias" ) }
                        </div>
                        <Row>
                            <Col>
                                { this.renderCategorias( 'subcategorias' ) }
                            </Col>
                        </Row>
                        <div className="mb-30"></div>
                        <Row>
                            <Col>
                                <Label>Más habilidades:</Label>
                                <div className="d-flex">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nuevoTag"
                                        placeholder="Nueva habilidad"
                                        value={ this.state.nuevoTag }
                                        onChange={ ( e ) => {
                                            let nuevo = e.target.value.replace( /[`~!¨´$%^&*°()¿¡_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                            nuevo = nuevo.split( ' ' ).join( '' );
                                            this.setState( {
                                                nuevoTag: nuevo,
                                            } );
                                        } }
                                    />
                                    <button
                                        className="btn btn-permiso justify-content-center"
                                        onClick={ () => {
                                            this.setState( {
                                                nuevoTag: '',
                                            } );
                                            this.revisarIngreso( "tags" );
                                        } }>
                                        <img alt="agregar" src={ agregar } />
                                    </button>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                { tagsRenderizados }
                            </Col>
                        </Row>
                        <div className="mb-30"></div>
                        <FormGroup>
                            <Label for="editor">Descripción:</Label>
                            <Editor
                                editorState={ this.state.editorState }
                                toolbarClassName="toolbarClassName"
                                wrapperClassName="wrapperClassName"
                                editorClassName="editor-estilos"
                                onEditorStateChange={ this.onEditorStateChange }
                                toolbar={ editorOptions }
                            />
                        </FormGroup>
                        <div className="mb-30"></div>
                        <Row>
                            <Col>
                                <Label>Requisitos *</Label>
                                <div className="d-flex">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nuevoRequisito"
                                        placeholder="Nuevo requisito"
                                        value={ this.state.nuevoRequisito }
                                        onChange={ ( e ) => {
                                            const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                            this.setState( {
                                                nuevoRequisito: nuevo,
                                            } );
                                        } }
                                    />
                                    <button
                                        className="btn btn-permiso justify-content-center"
                                        onClick={ () => {
                                            this.setState( {
                                                nuevoRequisito: '',
                                            } );
                                            this.revisarIngreso( "requisito" );
                                        } }>
                                        <img alt="agregar" src={ agregar } />
                                    </button>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                { requisitosRenderizados }
                            </Col>
                        </Row>
                        <div className="mb-30"></div>
                        <Row>
                            <Col>
                                <Label>Beneficios *</Label>
                                <div className="d-flex">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nuevoBeneficio"
                                        placeholder="Nuevo beneficio"
                                        value={ this.state.nuevoBeneficio }
                                        onChange={ ( e ) => {
                                            const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                            this.setState( {
                                                nuevoBeneficio: nuevo,
                                            } );
                                        } }
                                    />
                                    <button
                                        className="btn btn-permiso justify-content-center"
                                        onClick={ () => {
                                            this.setState( {
                                                nuevoBeneficio: '',
                                            } );
                                            this.revisarIngreso( "beneficios" );
                                        } }>
                                        <img alt="agregar" src={ agregar } />
                                    </button>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                { beneficiosRenderizados }
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className="mt-30">
                    <Col lg="12" className="flex justify-content-center">
                        <Button className="btn-feelrouk-naranja2" 
                            onClick={ this.guardarPerfil }
                            disabled={ this.state.loading }
                        > 
                            Guardar
                            { this.state.loading ? (
                                <Spinner />
                            ) : '' }
                        </Button>
                    </Col>
                </Row>
            </Fragment>
        );
    }

    // renderizado de los requisitos (perfil) una vez que se llenan en el input
    renderOpciones( type ) {
        // variables que van a cambiar
        let variableChequear = null;
        let paraMapear = null;

        if ( type === "requisitos" ) {
            variableChequear = this.state.requisitos;
            paraMapear = this.state.requisitos.slice();
        } else if ( type === "beneficios" ) {
            variableChequear = this.state.beneficios;
            paraMapear = this.state.beneficios.slice();
        } else if ( type === "tags" ) {
            variableChequear = this.state.tags;
            paraMapear = this.state.tags.filter( ( tag ) => {
                return tag.tipo === "tag";
            } );
        }

        if ( variableChequear.length > 0 ) {
            const renderizado = paraMapear.map( ( req ) => {
                return (
                    <div key={ req.id } className="div-requisitos">
                        <p> { req.nombre } </p>
                        <button
                            className="btn btn-add-permiso justify-content-center"
                            onClick={ () => {
                                this.removerOpcion( req.id, type );
                            } }>
                            <FontAwesomeIcon icon={ faTrashAlt } />
                        </button>
                    </div>
                );
            } );

            return renderizado;
        }

        return null;
    }

    removerOpcion( id, type ) {
        if ( type === "requisitos" ) {
            let clon = this.state.requisitos.slice();

            clon = clon.filter( ( req ) => {
                return req.id !== id;
            } );

            this.setState( {
                requisitos: clon,
            } );
        } else if ( type === "beneficios" ) {
            let clon = this.state.beneficios.slice();

            clon = clon.filter( ( ben ) => {
                return ben.id !== id;
            } );

            this.setState( {
                beneficios: clon,
            } );
        } else if ( type === "tags" || type === "categorias" || type === "subcategorias" ) {
            let clon = this.state.tags.slice();

            clon = clon.filter( ( tag ) => {
                return tag.id !== id;
            } );

            this.setState( {
                tags: clon,
            } );
        }
    }

    // esta función acepta un "type" como parámetro, así puede funcionar con cualquiera de los 3 inputs:
    // requisitos, beneficios y tags (cuando se agrega algo nuevo)
    revisarIngreso( type ) {
        if ( type === "requisito" ) {
            // revisamos primero que no exista otro requisito igual (que al menos no esté escrito exactamente igual)
            let tiene = false;
            tiene = this.state.requisitos.forEach( ( req ) => {
                if ( req.nombre === this.state.nuevoRequisito ) {
                    return true;
                }
            } );

            if ( this.state.nuevoRequisito.length <= 0 ) {
                return;
            }
            if ( tiene ) {
                this.setState( {
                    mensajeAviso: 'Ya existe un requisito registrado con ese nombre',
                    icono: false,
                } );
                this.openModal( 1 );
            } else {
                const requisitosActuales = this.state.requisitos.slice();
                const nuevoID = Math.ceil( Math.random() * ( ( 9999 - 1 ) + 1 ) );
                const nuevoRequisito = { id: nuevoID, nombre: this.state.nuevoRequisito };

                requisitosActuales.push( nuevoRequisito );

                this.setState( {
                    requisitos: requisitosActuales,
                } );
            }
        } else if ( type === "beneficios" ) {
            // revisamos primero que no exista otro beneficio igual (que al menos no esté escrito exactamente igual)
            let tiene = false;
            tiene = this.state.beneficios.forEach( ( bene ) => {
                if ( bene.nombre === this.state.nuevoBeneficio ) {
                    return true;
                }
            } );
            if ( this.state.nuevoBeneficio.length <= 0 ) {
                return;
            }
            if ( tiene ) {
                this.setState( {
                    mensajeAviso: 'Ya existe un beneficio registrado con ese nombre',
                    icono: false,
                } );
                this.openModal( 1 );
            } else {
                const beneficiosActuales = this.state.beneficios.slice();
                const nuevoID = Math.ceil( Math.random() * ( ( 9999 - 1 ) + 1 ) );

                const nuevoBeneficio = { id: nuevoID, nombre: this.state.nuevoBeneficio };

                beneficiosActuales.push( nuevoBeneficio );

                this.setState( {
                    beneficios: beneficiosActuales,
                } );
            }
        } else if ( type === "tags" ) {
            let tiene = false;
            tiene = this.state.tags.forEach( ( tag ) => {
                if ( tag.nombre === this.state.nuevoTag ) {
                    return true;
                }
            } );
            if ( this.state.nuevoTag.length <= 0 ) {
                return;
            }
            if ( tiene ) {
                this.setState( {
                    mensajeAviso: 'Ya existe un Tag o Categoría registrada con ese nombre',
                    icono: false,
                } );
                this.openModal( 1 );
            } else {
                const nuevoID = Math.ceil( Math.random() * ( ( 9999 - 1 ) + 1 ) );
                const nuevoTag = { id: nuevoID, nombre: this.state.nuevoTag, tipo: "tag" };

                const tagsActuales = this.state.tags.slice();
                tagsActuales.push( nuevoTag );

                this.setState( {
                    tags: tagsActuales,
                } );
            }
        }
    }

    // renderiza la información y abre el popup para ver toda la información del perfil seleccionado
    mostrarPerfilCompleto( perfil ) {
        this.setState( {
            perfilShow: perfil,
            modal3: true,
            tituloModal: 'Ver Perfil completo',
        } );
    }

    // renderiza la información y abre el popup para editar el perfil
    editarPerfil( perfil ) {
        // Recopilando la data actual del perfil y la metemos al state

        // aquii
        // niveles de perfil, tipo de empleo y modalidad (actuales), directo al state
        const perfilEscogidoState = this.state.perfiles.find( ( obj ) => {
            return obj.nombre === perfil.nivel_perfil;
        } );
        const tipoEmpleoEscogidoState = this.state.tipoEmpleo.find( ( obj ) => {
            return obj.nombre === perfil.tipo_empleo;
        } );
        const modalidadState = this.state.modalidadLaboral.find( ( obj ) => {
            return obj.nombre === perfil.modalidad;
        } );

        // ahora: beneficios, requisitos y tags (actuales), directo al state
        const beneficiosState = [];
        const requisitosState = [];
        const tagsState = [];
        const categorias = [];
        const habilidades = [];

        perfil.beneficios.forEach( ( bene ) => {
            const nuevoBene = { id: bene.id, nombre: bene.beneficio };
            beneficiosState.push( nuevoBene );
        } );
        perfil.requisitos.forEach( ( requi ) => {
            const nuevoRequi = { id: requi.id, nombre: requi.requisito };
            requisitosState.push( nuevoRequi );
        } );
        perfil.tags.forEach( ( tag ) => {
            tagsState.push( tag );
        } );

        // Ahora si metemos todo al state (para luego poder editar el perfil)
        this.setState( {
            perfilEdit: perfil,
            modal3: true,
            tituloModal: 'Editar perfil',
            perfilEscogido: perfilEscogidoState,
            tipoEmpleoEscogido: tipoEmpleoEscogidoState,
            modalidadEscogida: modalidadState,
            requisitos: requisitosState,
            beneficios: beneficiosState,
            tags: tagsState,
            perfilCategorias: categorias,
            perfilSubs: habilidades,
            nombre: perfil.nombre,
            rangoBool: perfil.rango_sueldo_bool,
            editorState: EditorState.createWithContent( convertFromHTML( perfil.descripcion ) ),
            textoFinal: perfil.descripcion,
        } );
    }

    // primero preguntando antes de borrar
    preguntarEliminar( perfil ) {
        const found = this.state.todasLasPosiciones.find( ( pos ) => {
            return pos.rel_perfil === perfil.id;
        } );

        if ( found ) {
            this.setState( {
                modal2: true,
                mensajeAviso: 'No puede eliminar este perfil mientras lo esté usando para una publicación',
            } );
        } else {
            this.setState( {
                perfilAeliminar: perfil,
                modal1: true,
                mensajeAviso: '¿Está seguro que desea eliminar este perfil?',
            } );
        }
    }

    // eliminando. Ahora sí
    eliminarDefinitivamente() {
        const data = { id: this.state.perfilAeliminar.id };

        axios.post( process.env.REACT_APP_DEVAPI + '/api/hcm/eliminarPerfil', data ).then( ( res ) => {
            if ( res.data.ok ) {
                this.setState( {
                    perfilAeliminar: null,
                    modal1: false,
                    mensajeAviso: '',
                } );
                this.getPerfiles( this.state.empresaEscogida.id );
            } else {
                this.setState( {
                    perfilAeliminar: null,
                    modal2: true,
                    mensajeAviso: 'Hubo un problema eliminando el perfil, Por favor intente más tarde.',
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
            this.setState( { modal1: false } );
            break;
        case 2:
            this.setState( { modal2: false } );
            break;
        case 3:
            this.setState( { 
                modal3: false,
                perfilShow: null,
                perfilEdit: null,
            } );
            break;
        default:
            break;
        }
    }

    filterDataTable( texto ) {
        if ( texto.length > 0 ) {
            const perfilesTmp = this.state.todosLosPerfilesFiltrado.slice();
            const filteredItems = perfilesTmp.filter( ( emp ) => {
                return emp.nombre && emp.nombre.toLowerCase().includes( texto.toLowerCase() );
            } );
            this.setState( {
                todosLosPerfilesFiltrado: filteredItems,
            } );
        } else {
            const perfilesTmp = this.state.todosLosPerfiles.slice();
            this.setState( {
                todosLosPerfilesFiltrado: perfilesTmp,
            } );
        }
    }

    render() {
        if ( this.props.info.jerarquia !== "administrador" && this.props.info.permisos.includes( 'reclutamiento' ) ) {
            let dataTable = null;
            let contenidoModal = null;
            const empresas = [];
            let filtrado = null;

            if ( this.state.todosLosPerfilesFiltrado ) {
                dataTable = this.renderingDataTable();

                filtrado = <Row className="mt-40">
                    <Col lg="3" sm="12" xs="12">
                        <FormGroup>
                            <Label for="razon">Busque por nombre:</Label>
                            <Input type="text" 
                                name="razon" 
                                className="input-hcm-formulario"
                                onChange={ ( e ) => {
                                    this.filterDataTable( e.target.value );
                                } }
                            />
                        </FormGroup>
                    </Col>
                </Row>;
            }

            if ( this.state.perfilShow ) {
                contenidoModal = this.renderVerPerfilCompleto();
            }
            if ( this.state.perfilEdit ) {
                contenidoModal = this.renderEditarPerfil();
            }

            // renderizamos el dropdown de empresas
            if ( this.state.empresas ) {
                this.state.empresas.forEach( ( emp ) => {
                    empresas.push( { value: emp.id, label: emp.razon_social } );
                } );
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
                            <Button className="btn-feelrouk-naranja" onClick={ () => this.eliminarDefinitivamente() }>Si</Button>
                            <Button className="btn-feelrouk" onClick={ () => this.closeModal( 1 ) }>No</Button>
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
                                        { 
                                            this.state.icono ? <Icon name="check-circle" /> : <Icon name="dizzy" />
                                        }
                                    </div>
                                    <h2>{ this.state.mensajeAviso }</h2>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button className="btn-feelrouk" onClick={ () => this.closeModal( 2 ) }>Cerrar</Button>
                        </ModalFooter>
                    </Modal>

                    <Modal className="modal-grande" isOpen={ this.state.modal3 } toggle={ () => { 
                        this.closeModal( 3 );
                    } }>
                        <ModalHeader
                            toggle={ () => { 
                                this.closeModal( 3 );
                            } }>{ this.state.tituloModal }</ModalHeader>
                        <ModalBody>
                            <Row className="vertical-gap d-flex justify-content-center">
                                <Col lg="12">
                                    { contenidoModal }
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button className="btn-feelrouk" onClick={ () => this.closeModal( 3 ) }>Cerrar</Button>
                        </ModalFooter>
                    </Modal>

                    <Row>
                        <Col>
                            <h2>Listado de Perfiles HCM</h2>
                        </Col>
                    </Row>
                    <Row className="justify-content-end">
                        <Col lg="2">
                            <CrearPerfilHCM volverAcargarTodo={ this.volverAcargarTodo } />
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="4" sm="12" xs="12">
                            <Select
                                className="dropdown-feelrouk"
                                name="escoja-empresa"
                                options={ empresas }
                                defaultValue={ { label: "Seleccione una empresa", value: 0 } }
                                onChange={ ( e ) => {
                                    this.getPerfiles( e.value );
                                } }
                            />
                        </Col>
                    </Row>
                    { filtrado }
                    <Row className="justify-content-end">
                        <Col>
                            { dataTable }
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
) )( ListadoPerfiles );
