/**
 * External Dependencies
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Spinner, Row, Col, Button, FormGroup, Label, Input, Dropdown, DropdownToggle, DropdownItem, DropdownMenu, Modal, 
    ModalFooter, ModalHeader, ModalBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
// faPlusSquare
import Select from 'react-select';

import './style.scss';
import Icon from '../icon';
import agregar from '../../../common-assets/images/vcm/plus-circle.svg';
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import classnames from 'classnames/dedupe';

/**
 * Internal Dependencies
 */
// import Snippet from '../../components/snippet';

/**
 * Component
 */
class CrearPerfilHCM extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            loading: false,
            activeTab: "1",
            icono: false,
            modal1: false,
            mensaje: '',
            dropdownOpen: false,
            dropdownOpen2: false,
            dropdownOpen3: false,
            dropdownOpen4: false,
            dropDownValue: false,
            editorState: EditorState.createEmpty(),
            textoFinal: '',
            nomprePerfil: '',
            rangoBool: false,
            sueldoMin: 0,
            sueldoMax: 0,
            edadMin: 18,
            edadMax: 0,
            empresas: null,
            todoTags: null,
            categorias: null,
            subcategorias: null,
            textoArea: '',
            textoHabilidad: '',
            categoriasFiltradas: [],
            subFiltradas: [],
            active: null,
            todosLosPerfiles: null,
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
            nombreError: '',
            edadError: '',
            nivelError: '',
            tipoEmpleoError: '',
            modalidadError: '',
            tipoSueldoError: '',
            areaTrabajoError: '',
        };

        this.guardarPerfil = this.guardarPerfil.bind( this );
        this.returnOptionsForEditor = this.returnOptionsForEditor.bind( this );
        this.onEditorStateChange = this.onEditorStateChange.bind( this );
        this.toggleDropdown = this.toggleDropdown.bind( this );
        this.toggleTabs = this.toggleTabs.bind( this );
        this.toggle = this.toggle.bind( this );
        this.renderRangoSueldo = this.renderRangoSueldo.bind( this );
        this.revisarIngreso = this.revisarIngreso.bind( this );
        this.renderOpciones = this.renderOpciones.bind( this );
        this.removerOpcion = this.removerOpcion.bind( this );
        this.getEmpresas = this.getEmpresas.bind( this );
        this.getAllPerfiles = this.getAllPerfiles.bind( this );
        this.getAllTags = this.getAllTags.bind( this );
        this.renderCreacionPerfil = this.renderCreacionPerfil.bind( this );
        this.anadirAreaHabilidad = this.anadirAreaHabilidad.bind( this );
        this.renderAutocompletado = this.renderAutocompletado.bind( this );
        this.filtrarResultado = this.filtrarResultado.bind( this );
        this.renderCategorias = this.renderCategorias.bind( this );
    }

    componentDidMount() {
        this.getAllTags();
        this.getEmpresas();
        this.getAllPerfiles();
    }

    // llamada API para traer todas las empresas
    async getEmpresas() {
        const data = {
            id: this.props.info.id,
        };
        return axios.post( process.env.REACT_APP_LOCAL + '/api/hcm/getEmpresas', data ).then( ( res ) => {
            this.setState( {
                empresas: res.data.empresas,
            } );
        } );
    }
    // llamada API para traer todas las empresas
    async getAllPerfiles() {
        return axios.get( process.env.REACT_APP_LOCAL + '/api/hcm/getAllPerfiles' ).then( ( res ) => {
            this.setState( {
                todosLosPerfiles: res.data.data,
            } );
        } );
    }

    async getAllTags() {
        return axios.get( process.env.REACT_APP_LOCAL + '/api/hcm/tags/getAll' ).then( ( res ) => {
            const categorias = [];
            const subcategorias = [];
            const tags = [];
            res.data.data.forEach( ( tag ) => {
                if ( tag.tipo === "categoria" ) {
                    categorias.push( tag );
                }
                if ( tag.tipo === "subcategoria" ) {
                    subcategorias.push( tag );
                }
                if ( tag.tipo === "tag" ) {
                    tags.push( tag );
                }
            } );

            this.setState( {
                todoTags: tags,
                categorias: categorias,
                categoriasFiltradas: categorias,
                subcategorias: subcategorias,
                subFiltradas: subcategorias,
            } );
        } );
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

    guardarPerfil() {
        // comprobaciones
        let count = 0;

        if ( this.state.nomprePerfil.length <= 0 ) {
            this.setState( {
                nombreError: 'Debe rellenar el campo de Nombre',
            } );
            count += 1;
        }

        if ( parseInt( this.state.edadMin ) <= 0 || this.state.edadMin.length <= 0 ) {
            this.setState( {
                edadError: 'Debe rellenar todos los campos de edad',
            } );
            count += 1;
        }
        if ( parseInt( this.state.edadMax ) <= 0 || this.state.edadMax.length <= 0 ) {
            this.setState( {
                edadError: 'Debe rellenar todos los campos de edad',
            } );
            count += 1;
        }

        if ( ! this.state.perfilEscogido ) {
            this.setState( {
                nivelError: 'Debe escoger un tipo de nivel de perfil',
            } );
            count += 1;
        }
        if ( ! this.state.tipoEmpleoEscogido ) {
            this.setState( {
                tipoEmpleoError: 'Debe escoger un tipo de empleo',
            } );
            count += 1;
        }
        if ( ! this.state.modalidadEscogida ) {
            this.setState( {
                modalidadError: 'Debe escoger una modalidad laboral para el perfil',
            } );
            count += 1;
        }

        if ( parseInt( this.state.sueldoMin ) < 0 || this.state.sueldoMin.length <= 0 ) {
            this.setState( {
                rangoError: 'Debe rellenar los dos campos de rango de sueldo',
            } );
            count += 1;
        }
        if ( parseInt( this.state.sueldoMax ) <= 0 || this.state.sueldoMax.length <= 0 ) {
            this.setState( {
                rangoError: 'Debe rellenar los dos campos de rango de sueldo',
            } );
            count += 1;
        }

        if ( ! this.state.tipoSueldo ) {
            this.setState( {
                tipoSueldoError: 'Debe escoger 1 tipo de sueldo a pagar',
            } );
            count += 1;
        }

        if ( ! this.state.empresaEscogida ) {
            this.setState( {
                mensajeAviso: 'Debe escoger la empresa a la cual asociar el perfil.',
                icono: false,
            } );
            this.openModal( 1 );
            return;
        }

        if ( this.state.tags.length <= 0 ) {
            this.setState( {
                areaTrabajoError: 'Debe escoger al menos 1 área de trabajo',
                mensajeAviso: 'Debe escoger al menos 1 área de trabajo o habilidad asociada.',
                icono: false,
            } );
            this.openModal( 1 );
            return;
        }

        const perfilesDeEmpresa = this.state.todosLosPerfiles.filter( ( perfil ) => {
            return perfil.rel_empresa === this.state.empresaEscogida.id;
        } );

        if ( perfilesDeEmpresa ) {
            const foundPerfil = perfilesDeEmpresa.find( ( perfil ) => {
                return perfil.nombre === this.state.nomprePerfil;
            } );

            if ( foundPerfil ) {
                this.setState( {
                    nombreError: 'Ya existe otro perfil usando este nombre',
                } );
                count += 1;
            }
        }

        if ( count > 0 ) {
            return;
        }

        if ( this.state.textoFinal.length <= 0 ) {
            this.setState( {
                mensajeAviso: 'Debe ingresar una descripción para el perfil',
                icono: false,
            } );
            this.openModal( 1 );
            return;
        }

        if ( this.state.requisitos.length <= 0 || this.state.beneficios.length <= 0 ) {
            this.setState( {
                mensajeAviso: 'Debe ingresar al menos 1 requisito y 1 beneficio por perfil',
                icono: false,
            } );
            this.openModal( 1 );
            return;
        }

        let requisitosDone = [];
        let beneficiosDone = [];
        let tagsDone = null;

        requisitosDone.push( this.state.requisitos.map( ( req ) => {
            return req.nombre;
        } ) );
        beneficiosDone.push( this.state.beneficios.map( ( bene ) => {
            return bene.nombre;
        } ) );

        requisitosDone = requisitosDone.join( ',' );
        beneficiosDone = beneficiosDone.join( ',' );

        if ( this.state.tags.length > 0 ) {
            const temp = this.state.tags.slice();
            tagsDone = JSON.stringify( temp );
        }

        // guardado
        const data = {
            relEmpresa: this.state.empresaEscogida.id,
            nombre: this.state.nomprePerfil,
            edadMIN: parseInt( this.state.edadMin ),
            edadMAX: parseInt( this.state.edadMax ),
            nivelPerfil: this.state.perfilEscogido.nombre,
            tipoEmpleo: this.state.tipoEmpleoEscogido.nombre,
            modalidad: this.state.modalidadEscogida.nombre,
            rangoSueldoBool: this.state.rangoBool,
            sueldoMIN: parseInt( this.state.sueldoMin ),
            sueldoMAX: parseInt( this.state.sueldoMax ),
            tipoSueldo: this.state.tipoSueldo,
            descripcion: this.state.textoFinal,
            requisitos: requisitosDone,
            beneficios: beneficiosDone,
            tags: tagsDone,
        };

        this.setState( { loading: true } );

        // llamada aquí - finalmente
        axios.post( process.env.REACT_APP_LOCAL + '/api/hcm/nuevoPerfil', data ).then( ( res ) => {
            if ( res.data ) {
                this.setState( {
                    nombrePerfil: '',
                    edadMin: 18,
                    edadMax: 0,
                    editorState: EditorState.createEmpty(),
                    perfilEscogido: null,
                    tipoEmpleoEscogido: null,
                    modalidadEscogida: null,
                    rangoBool: false,
                    sueldoMin: 0,
                    sueldoMax: 0,
                    tipoSueldo: null,
                    textoFinal: '',
                    requisitos: [],
                    beneficios: [],
                    tags: [],
                    loading: false,
                    mensajeAviso: 'Perfil creado satisfactoriamente',
                    icono: true,
                } );
                this.props.volverAcargarTodo();
                this.closeModal( 2 );
                this.setState( {
                    loading: false,
                    mensajeAviso: 'Perfil creado satisfactoriamente.',
                    icono: true,
                } );
                this.openModal( 1 );
            }
        } ).catch( ( e ) => {
            console.log( e );
            this.setState( {
                loading: false,
                mensajeAviso: 'No se pudo crear el perfil. Intente de nuevo más tarde.',
                icono: false,
            } );
            this.openModal( 1 );
        } );
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

    // toggle de las tabs
    toggleTabs( tab ) {
        if ( this.state.activeTab !== tab ) {
            this.setState( {
                activeTab: tab,
            } );
        }
    }

    // para los dropdowns
    toggle( number ) {
        let state = null;
        switch ( number ) {
        case 1:
            state = ! this.state.dropdownOpen;
            this.setState( { 
                dropdownOpen: state, 
                nivelError: '',
            } );
            break;
        case 2:
            state = ! this.state.dropdownOpen2;
            this.setState( { 
                dropdownOpen2: state,
                tipoEmpleoError: '', 
            } );
            break;
        case 3:
            state = ! this.state.dropdownOpen3;
            this.setState( { 
                dropdownOpen3: state, 
                modalidadError: '',
            } );
            break;
        case 4:
            state = ! this.state.dropdownOpen4;
            this.setState( { dropdownOpen4: state } );
            break;
        default:
            break;
        }
    }

    renderRangoSueldo() {
        const { rangoError } = this.state;
        return (
            <FormGroup>
                <Label for="rangoSueldo">Rango de sueldo *</Label>
                <Row>
                    <Col md="5" xs="5">
                        <Label for="min">Min</Label>
                        <Input type="text" 
                            name="sueldo-min" 
                            className={ classnames( 'input-hcm-formulario', { 'is-invalid': rangoError } ) }
                            value={ this.state.sueldoMin }
                            onChange={ ( e ) => {
                                this.setState( {
                                    sueldoMin: e.target.value,
                                    rangoError: '',
                                } );
                            } }
                        />
                        { rangoError ? (
                            <div className="invalid-feedback">{ rangoError }</div>
                        ) : '' }
                    </Col>
                    <Col md="5" xs="5">
                        <Label for="min">Max</Label>
                        <Input type="text" 
                            name="sueldo-max" 
                            className={ classnames( 'input-hcm-formulario', { 'is-invalid': rangoError } ) }
                            value={ this.state.sueldoMax }
                            onChange={ ( e ) => {
                                this.setState( {
                                    sueldoMax: e.target.value,
                                    rangoError: '',
                                } );
                            } }
                        />
                    </Col>
                </Row>
            </FormGroup>
        );
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
            let tiene2 = false;
            tiene = this.state.tags.forEach( ( tag ) => {
                if ( tag.nombre === this.state.nuevoTag ) {
                    return true;
                }
            } );
            tiene2 = this.state.todoTags.forEach( ( tg ) => {
                if ( tg.nombre.toLowerCase() === this.state.nuevoTag.toLowerCase() ) {
                    return true;
                }
            } );
            if ( this.state.nuevoTag.length <= 0 ) {
                return;
            }
            if ( tiene || tiene2 ) {
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

    // renderizado de los requisitos una vez que se llenan en el input
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
        }
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

    renderCreacionPerfil() {
        const {
            nomprePerfil,
            edadMin,
            edadMax,
            nuevoRequisito,
            nuevoBeneficio,
            nuevoTag,
            nombreError,
            edadError,
            nivelError,
            tipoEmpleoError,
            modalidadError,
            tipoSueldoError,
            areaTrabajoError,
            textoArea,
            textoHabilidad,
        } = this.state;

        const empresas = [];

        // esto es para renderizar el mensaje previo de todos los dropdowns (antes de escoger alguna opción)
        const mensajePrevio = <div> Seleccionar <FontAwesomeIcon icon={ faCaretDown } /> </div>;

        // renderizando las optiones/settings del editor de texto
        const editorOptions = this.returnOptionsForEditor();
        const { editorState } = this.state;

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

        // esto renderiza el resultado del checkbox (true or false), devuelve los inputs o null
        const rangoSueldo = this.renderRangoSueldo();

        // render de requisitos, beneficios y tags actuales (en el state)
        const requisitosRenderizados = this.renderOpciones( "requisitos" );
        const beneficiosRenderizados = this.renderOpciones( "beneficios" );
        const tagsRenderizados = this.renderOpciones( "tags" );

        // renderizamos el dropdown de empresas
        if ( this.state.empresas ) {
            this.state.empresas.forEach( ( emp ) => {
                empresas.push( { value: emp.id, label: emp.razon_social } );
            } );
        }

        return (
            <Fragment>
                <div className="mt-30"></div>
                <Row className="mr-10 ml-10">
                    <Col lg="6" xs="12">
                        <h2>Datos del perfil</h2>
                        <FormGroup>
                            <Label for="nombreperfil">Nombre de perfil *</Label>
                            <Input type="text" 
                                name="nombreperfil" 
                                className={ classnames( 'input-hcm-formulario', { 'is-invalid': nombreError } ) }
                                value={ nomprePerfil }
                                onChange={ ( e ) => {
                                    this.setState( {
                                        nomprePerfil: e.target.value,
                                        nombreError: '',
                                    } );
                                } }
                            />
                            { nombreError ? (
                                <div className="invalid-feedback">{ nombreError }</div>
                            ) : '' }
                        </FormGroup>
                        <FormGroup>
                            <Label for="rut">Rango de edad *</Label>
                            <Row>
                                <Col md="5" xs="5">
                                    <Label for="edad-min">Min</Label>
                                    <Input type="text" 
                                        name="edad-min" 
                                        className={ classnames( 'input-hcm-formulario', { 'is-invalid': edadError } ) }
                                        value={ edadMin }
                                        onChange={ ( e ) => {
                                            this.setState( {
                                                edadMin: e.target.value,
                                                edadError: '',
                                            } );
                                        } }
                                    />
                                    { edadError ? (
                                        <div className="invalid-feedback">{ edadError }</div>
                                    ) : '' }
                                </Col>
                                <Col md="5" xs="5">
                                    <Label for="edad-max">Max</Label>
                                    <Input type="text" 
                                        name="edad-max" 
                                        className={ classnames( 'input-hcm-formulario', { 'is-invalid': edadError } ) }
                                        value={ edadMax }
                                        onChange={ ( e ) => {
                                            this.setState( {
                                                edadMax: e.target.value,
                                                edadError: '',
                                            } );
                                        } }
                                    />
                                </Col>
                            </Row>
                            { edadError.length > 0 ? (
                                <div className="invalid-feedback">{ edadError }</div>
                            ) : '' }
                        </FormGroup>
                        <div className="mt-35"></div>
                        <FormGroup>
                            <Label for="Dropdown1">Nivel del perfil *</Label>
                            <Dropdown className={ classnames( 'reclutamiento-dropdown', { 'is-invalid': nivelError } ) } isOpen={ this.state.dropdownOpen } toggle={ () => this.toggle( 1 ) }>
                                <DropdownToggle caret>
                                    { this.state.perfilEscogido ? this.state.perfilEscogido.nombre : mensajePrevio }
                                </DropdownToggle>
                                <DropdownMenu>
                                    { nivelesPerfil }
                                </DropdownMenu>
                            </Dropdown>
                            { nivelError.length > 0 ? (
                                <div className="invalid-feedback">{ nivelError }</div>
                            ) : '' }
                        </FormGroup>
                        <FormGroup>
                            <Label for="Dropdown2">Tipo de empleo *</Label>
                            <Dropdown className={ classnames( 'reclutamiento-dropdown', { 'is-invalid': tipoEmpleoError } ) } isOpen={ this.state.dropdownOpen2 } toggle={ () => this.toggle( 2 ) }>
                                <DropdownToggle caret>
                                    { this.state.tipoEmpleoEscogido ? this.state.tipoEmpleoEscogido.nombre : mensajePrevio }
                                </DropdownToggle>
                                <DropdownMenu>
                                    { tipoDeEmpleo }
                                </DropdownMenu>
                            </Dropdown>
                            { tipoEmpleoError.length > 0 ? (
                                <div className="invalid-feedback">{ tipoEmpleoError }</div>
                            ) : '' }
                        </FormGroup>
                        <FormGroup>
                            <Label for="Dropdown3">Modalidad Laboral *</Label>
                            <Dropdown className={ classnames( 'reclutamiento-dropdown', { 'is-invalid': modalidadError } ) } isOpen={ this.state.dropdownOpen3 } toggle={ () => this.toggle( 3 ) }>
                                <DropdownToggle caret>
                                    { this.state.modalidadEscogida ? this.state.modalidadEscogida.nombre : mensajePrevio }
                                </DropdownToggle>
                                <DropdownMenu>
                                    { modalidadLaboral }
                                </DropdownMenu>
                            </Dropdown>
                            { modalidadError.length > 0 ? (
                                <div className="invalid-feedback">{ modalidadError }</div>
                            ) : '' }
                        </FormGroup>

                        { rangoSueldo }

                        <div className="mt-35"></div>
                        <p>Tipo de sueldo</p>
                        <Col>
                            <FormGroup className={ classnames( { invalid: tipoSueldoError } ) } >
                                <Label check>
                                    <Input type="radio" 
                                        value="Liquido" 
                                        name="tipoSueldo"
                                        className={ classnames( { invalid: tipoSueldoError } ) }
                                        onChange={ ( e ) => {
                                            this.setState( {
                                                tipoSueldo: e.target.value,
                                                tipoSueldoError: '',
                                            } );
                                        } }
                                    />{ ' ' }
                                    Líquido
                                </Label>
                            </FormGroup>
                            <FormGroup className={ classnames( { invalid: tipoSueldoError } ) } >
                                <Label check>
                                    <Input type="radio" 
                                        value="Bruto" 
                                        name="tipoSueldo"
                                        onChange={ ( e ) => {
                                            this.setState( {
                                                tipoSueldo: e.target.value,
                                                tipoSueldoError: '',
                                            } );
                                        } }
                                    />{ ' ' }
                                    Bruto
                                </Label>
                            </FormGroup>
                        </Col>
                    </Col>
                    <Col lg="6" xs="12">
                        <div>
                            <Select
                                className="dropdown-feelrouk"
                                name="escoja-empresa"
                                options={ empresas }
                                defaultValue={ { label: "Seleccione una empresa", value: 0 } }
                                onChange={ ( e ) => {
                                    this.renderEmpresa( e.value );
                                } }
                            />
                        </div>
                        <div className="mb-30"></div>
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
                                <Label>¿Desea añadir más habilidades?</Label>
                                <div className="d-flex">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nuevoTag"
                                        placeholder="Nueva habilidad"
                                        value={ nuevoTag }
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
                                editorState={ editorState }
                                toolbarClassName="toolbarClassName"
                                wrapperClassName="wrapperClassName"
                                editorClassName="editor-estilos"
                                onEditorStateChange={ this.onEditorStateChange }
                                toolbar={ editorOptions }
                            />
                        </FormGroup>
                        <Row>
                            <Col>
                                <Label>Requisitos *</Label>
                                <div className="d-flex">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nuevoRequisito"
                                        placeholder="Nuevo requisito"
                                        value={ nuevoRequisito }
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
                        <br></br>
                        <Row>
                            <Col>
                                <Label>Beneficios *</Label>
                                <div className="d-flex">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nuevoBeneficio"
                                        placeholder="Nuevo beneficio"
                                        value={ nuevoBeneficio }
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
                    <Col lg="12" className="flex justify-content-end">
                        <Button className="btn-feelrouk-naranja2" 
                            onClick={ this.guardarPerfil }
                            disabled={ this.state.loading }
                        > 
                            Crear
                            { this.state.loading ? (
                                <Spinner />
                            ) : '' }
                        </Button>
                    </Col>
                </Row>
            </Fragment>
        );
    }

    render() {
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
                        <Button className="btn-feelrouk" onClick={ () => this.closeModal( 1 ) }>Cerrar</Button>
                    </ModalFooter>
                </Modal>

                <Modal className="modal-grande" isOpen={ this.state.modal2 } toggle={ () => { 
                    this.closeModal( 2 );
                } }>
                    <ModalHeader
                        toggle={ () => { 
                            this.closeModal( 2 );
                        } }>Creación de perfil</ModalHeader>
                    <ModalBody>
                        <Row className="vertical-gap d-flex justify-content-center">
                            { this.renderCreacionPerfil() }
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button className="btn-feelrouk" onClick={ () => this.closeModal( 2 ) }>Cerrar</Button>
                    </ModalFooter>
                </Modal>

                <Button className="btn-feelrouk"
                    onClick={ () => this.openModal( 2 ) }
                >Crear nuevo Perfil</Button>
            </Fragment>
        );
    }
}

export default connect( ( { settings, info } ) => (
    {
        settings,
        info,
    }
) )( CrearPerfilHCM );
