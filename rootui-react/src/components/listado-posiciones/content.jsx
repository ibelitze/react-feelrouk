/**
 * External Dependencies
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Row, Col, Button, Modal, ModalFooter, ModalHeader, ModalBody, Label, FormGroup, Input } from 'reactstrap';
import { Link } from 'react-router-dom';
import { MensajeBloqueo } from '../no-permisos';
import DataTable from 'react-data-table-component';
import Icon from '../icon';
import Select from 'react-select';

import PreguntasPostulante from '../preguntas-postulante';

import ver from '../../../common-assets/images/vcm/eye.svg';
// import search from '../../../common-assets/images/vcm/search.svg';
import borrar from '../../../common-assets/images/vcm/x-circle.svg';
import userIcon from '../../../common-assets/images/user-icon.jpg';

import { faUsers, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Editor } from "react-draft-wysiwyg";
import { EditorState } from 'draft-js';
import { convertFromHTML } from 'draft-convert';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
require( 'dotenv' ).config();

/**
 * Internal Dependencies
 */
import './style.scss';
// import Snippet from '../../components/snippet';

/**
 * Component
 */
class ListadoPosiciones extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            modal1: false,
            modal2: false,
            modal3: false,
            modal4: false,
            tituloModal: '',
            mensajeAviso: '',
            icono: false,
            dropdownOpen: false,
            dropdownOpen2: false,
            dropdownOpen3: false,
            todasLasPosiciones: null,
            todasLasPosicionesFilter: null,
            posicionAeliminar: null,
            empresas: null,
            todosLosPerfiles: null,
            empresaEscogida: null,
            posicionAvisualizar: null,
            perfilEscogido: null,
            verPostulantes: false,
        };
        this.openModal = this.openModal.bind( this );
        this.closeModal = this.closeModal.bind( this );
        this.toggle = this.toggle.bind( this );
        this.toggleDropdown = this.toggleDropdown.bind( this );
        this.formatoAobject = this.formatoAobject.bind( this );

        this.renderingDataTable = this.renderingDataTable.bind( this );
        this.renderBotonesListado = this.renderBotonesListado.bind( this );

        this.preguntarEliminar = this.preguntarEliminar.bind( this );
        this.eliminarDefinitivamente = this.eliminarDefinitivamente.bind( this );
        this.getPosiciones = this.getPosiciones.bind( this );

        this.mostrarPosicionCompleta = this.mostrarPosicionCompleta.bind( this );
        this.mostrarPostulantes = this.mostrarPostulantes.bind( this );
        this.renderVerPublicacion = this.renderVerPublicacion.bind( this );
        this.renderVerPostulantes = this.renderVerPostulantes.bind( this );

        this.getEmpresas = this.getEmpresas.bind( this );
        this.getPerfiles = this.getPerfiles.bind( this );
        this.volverAcargarTodo = this.volverAcargarTodo.bind( this );
        this.formatDate = this.formatDate.bind( this );
        this.getQueryVariable = this.getQueryVariable.bind( this );

        this.renderDescripcionCargo = this.renderDescripcionCargo.bind( this );
        this.renderDescripcionPerfil = this.renderDescripcionPerfil.bind( this );
        this.renderLocalizacion = this.renderLocalizacion.bind( this );
        this.renderBeneficios = this.renderBeneficios.bind( this );
        this.renderRequisitos = this.renderRequisitos.bind( this );
        this.renderTags = this.renderTags.bind( this );
        this.renderCuestionario = this.renderCuestionario.bind( this );
        this.renderAdjuntos = this.renderAdjuntos.bind( this );

        this.filterDataTable = this.filterDataTable.bind( this );
    }

    componentDidMount() {
        const idEmpresa = this.getQueryVariable( 'id' );

        // si existe el id de la empresa (url get) lo usamos
        if ( idEmpresa ) {
            this.getEmpresas( true, idEmpresa );
            this.getPosiciones( idEmpresa );
            this.getPerfiles( idEmpresa );
        } else {
            // si no existe, hacemos todo como antes, pidiendole al usuario que escoja empresa en el select
            this.getEmpresas( false, null );
        }
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
                todasLasPosicionesFilter: res.data.data,
            } );
        } );
    }

    // llamada API para traer todas las empresas (cuando se usa el dropdown)
    getEmpresas( variable, idEmpresa ) {
        const data = {
            id: this.props.info.id,
        };
        return axios.post( process.env.REACT_APP_DEVAPI + '/api/hcm/getEmpresas', data ).then( ( res ) => {
            // si ya existe un id de empresa, se deja como escogida en el state
            if ( variable ) {
                const empresa = res.data.empresas.find( ( emp ) => {
                    return emp.id === idEmpresa;
                } );

                if ( empresa ) {
                    this.setState( {
                        empresaEscogida: empresa,
                        empresas: res.data.empresas,
                    } );
                } else {
                    this.setState( {
                        empresas: res.data.empresas,
                    } ); 
                }
            } else {
                // si no hay id:  se hace todo normal
                this.setState( {
                    empresas: res.data.empresas,
                } );
            }
        } );
    }

    // llamada API para traer todos los permisos
    getPerfiles( idEmpresa ) {
        const data = {
            id: idEmpresa,
        };
        return axios.post( process.env.REACT_APP_DEVAPI + '/api/hcm/getPerfiles', data ).then( ( res ) => {
            this.setState( {
                todosLosPerfiles: res.data.data,
            } );
        } );
    }

    // getQueryVariable - se usa para optener algún parámetro del link
    getQueryVariable( name, url = window.location.href ) {
        name = name.replace( /[\[\]]/g, '\\$&' );
        const regex = new RegExp( '[?&]' + name + '(=([^&#]*)|&|#|$)' ),
            results = regex.exec( url );
        if ( ! results ) {
            return null;
        }
        if ( ! results[ 2 ] ) {
            return '';  
        } 
        return decodeURIComponent( results[ 2 ].replace( /\+/g, ' ' ) );
    }

    volverAcargarTodo() {
        this.setState( {
            todasLasPosiciones: null,
            empresas: null,
        } );

        this.getEmpresas();
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

            this.getPosiciones( escogida.id );
            this.getPerfiles( escogida.id );
        }
    }

    formatDate( date ) {
        const padTo2Digits = ( num ) => {
            return num.toString().padStart( 2, '0' );
        };

        return [
            padTo2Digits( date.getDate() ),
            padTo2Digits( date.getMonth() + 1 ),
            date.getFullYear(),
        ].join( '/' );
    }

    formatoAobject( dato ) {
        const final = JSON.parse( dato );
        return final.texto;
    }

    // renderizamos la tabla con toda la data de publicaciones
    renderingDataTable() {
        const columns = [
            {
                name: 'Nombre',
                selector: row => row.nombre,
                sortable: false,
            },
            {
                name: 'Localización',
                selector: row => this.formatoAobject( row.localizacion ),
                sortable: true,
            },
            {
                name: 'Inicio de publicación',
                selector: row => row.inicio,
                sortable: true,
            },
            {
                name: 'Finalización',
                selector: row => row.final,
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
                data={ this.state.todasLasPosicionesFilter }
                pagination
                paginationComponentOptions={ paginationComponentOptions }
            />
        );
    }

    mostrarPosicionCompleta( posicion ) {
        const perfil = this.state.todosLosPerfiles.find( ( perf ) => {
            return perf.id === posicion.rel_perfil;
        } );

        this.setState( {
            posicionAvisualizar: posicion,
            perfilEscogido: perfil,
        }, () => {
            this.openModal( 3 );
        } );
    }

    mostrarPostulantes( posicion ) {
        this.setState( {
            posicionAvisualizar: posicion,
            verPostulantes: true,
        }, () => {
            this.openModal( 4 );
        } );
    }

    // renderizado de los botones de acción - Perfiles
    renderBotonesListado( row ) {
        const link1 = "/editar-publicacion?id=" + row.id;
        const link2 = "/listado-postulantes?id=" + row.id;

        return (
            <Fragment>
                <Button className="btn btn-datatable" onClick={ () => {
                    this.mostrarPosicionCompleta( row );
                } } >
                    <img alt="ver" style={ { width: "25px" } } src={ ver } />
                </Button>
                <Link to={ link1 } className="btn btn-datatable users">
                    <FontAwesomeIcon icon={ faEdit } />
                </Link>
                <Button className="btn btn-datatable" onClick={ () => { 
                    this.preguntarEliminar( row ); 
                } } >
                    <img alt="borrar" style={ { width: "25px" } } src={ borrar } />
                </Button>
                <Link to={ link2 } className="btn btn-datatable users">
                    <FontAwesomeIcon icon={ faUsers } />
                </Link>
            </Fragment>
        );
    }

    renderDescripcionCargo() {
        let edadReq = 'Sin edad';

        if ( this.state.perfilEscogido ) {
            edadReq = this.state.perfilEscogido.edadMIN + ' - ' + this.state.perfilEscogido.edadMAX;
        }

        return (
            <Row className="mt-20">
                <Col lg="12" xs="12">
                    <h4>Descripción del cargo</h4>
                </Col>
                <Col lg="6" xs="12">
                    <div className="col input-visualizacion">
                        <Label>Nombre</Label>
                        <p>{ this.state.perfilEscogido ? this.state.perfilEscogido.nombre : "Sin nombre" }</p>
                    </div>
                    <div className="col input-visualizacion">
                        <Label>Modalidad</Label>
                        <p>{ this.state.perfilEscogido ? this.state.perfilEscogido.modalidad : "Sin modalidad" }</p>
                    </div>
                    <div className="col input-visualizacion">
                        <Label>Tipo de empleo</Label>
                        <p>{ this.state.perfilEscogido ? this.state.perfilEscogido.tipo_empleo : "Sin tipo" }</p>
                    </div>
                </Col>
                <Col lg="6" xs="12">
                    <div className="col input-visualizacion">
                        <Label>Edad requerida</Label>
                        <p>{ edadReq }</p>
                    </div>
                    <div className="col input-visualizacion">
                        <Label>Empresa que contrata</Label>
                        <p>{ this.state.empresaEscogida.razon_social }</p>
                    </div>
                    <div className="col input-visualizacion">
                        <Label>Tipo de sueldo</Label>
                        <p>{ this.state.perfilEscogido ? this.state.perfilEscogido.tipo_sueldo : "Sin tipo" }</p>
                    </div>
                </Col>
            </Row>
        );
    }

    renderDescripcionPerfil() {
        const contentDescripcion = EditorState.createWithContent( convertFromHTML( this.state.perfilEscogido.descripcion ) );
        return (
            <Row className="mt-30">
                <Col lg="12" sm="12" xs="12">
                    <h4>Descripción del perfil</h4>
                </Col>
                <Col lg="12" sm="12" xs="12">
                    <Editor toolbarClassName="hide-toolbar" 
                        editorClassName="editor-show" 
                        editorState={ contentDescripcion } 
                        readOnly />
                </Col>
            </Row>
        );
    }

    renderBeneficios() {
        const beneficios = this.state.perfilEscogido.beneficios.map( ( requi ) => {
            return <div key={ requi.id } className="requisitos-card">{ requi.beneficio }</div>;
        } );

        return (
            <Row className="mt-30">
                <Col lg="12" sm="12" xs="12">
                    <h4>Beneficios para el postulante</h4>
                </Col>
                <Col lg="12" sm="12" xs="12">
                    <div className="content-requisitos">
                        { beneficios }
                    </div>
                </Col>
            </Row>
        );
    }

    renderRequisitos() {
        const requisitos = this.state.perfilEscogido.requisitos.map( ( requi ) => {
            return <div key={ requi.id } className="requisitos-card">{ requi.requisito }</div>;
        } );

        return (
            <Row className="mt-30">
                <Col lg="12" sm="12" xs="12">
                    <h4>Requisitos para el postulante</h4>
                </Col>
                <Col lg="12" sm="12" xs="12">
                    <div className="content-requisitos">
                        { requisitos }
                    </div>
                </Col>
            </Row>
        );
    }

    renderTags() {
        const tags = this.state.perfilEscogido.tags.map( ( tag ) => {
            return <div key={ tag.id } className="requisitos-card">{ tag.nombre }</div>;
        } );

        return (
            <Row className="mt-30">
                <Col lg="12" sm="12" xs="12">
                    <h4>Tags</h4>
                </Col>
                <Col lg="12" sm="12" xs="12">
                    <div className="content-requisitos">
                        { tags }
                    </div>
                </Col>
            </Row>
        );
    }

    renderLocalizacion() {
        return (
            <Row className="mt-30 mb-20">
                <Col lg="12" sm="12" xs="12">
                    <h4>Localización</h4>
                </Col>
                <Col lg="12" sm="12" xs="12">
                    <div className="col input-visualizacion">
                        <p>{ this.formatoAobject( this.state.posicionAvisualizar.localizacion ) }</p>
                    </div>
                </Col>
            </Row>
        );
    }

    // renderizado del perfil completo (visualizar perfil)
    renderVerPublicacion() {
        // let edadReq = 'Sin edad';
        const rentaLiquida = null;
        let descripcionCargo = null;
        let descripcionPerfil = null;
        let localizacionMap = null;
        let beneficios = null;
        let requisitos = null;
        let tags = null;
        let cuestionario = null;
        let adjuntos = null;

        if ( this.state.perfilEscogido ) {
            // edadReq = this.state.perfilEscogido.edadMIN + ' - ' + this.state.perfilEscogido.edadMAX;
            descripcionCargo = this.renderDescripcionCargo();
            descripcionPerfil = this.renderDescripcionPerfil();
            beneficios = this.renderBeneficios();
            requisitos = this.renderRequisitos();
            tags = this.renderTags();
            localizacionMap = this.renderLocalizacion();
            cuestionario = this.renderCuestionario();
            adjuntos = this.renderAdjuntos();
        }

        return (
            <Row className="mt-20 justify-content-center">
                <Col lg="10">
                    <Row className="header-previsualizacion">
                        <Col lg="12" xs="12">
                            <div>
                                <h1>{ this.state.posicionAvisualizar.nombre }</h1>
                                { rentaLiquida }
                            </div>
                        </Col>
                    </Row>
                    { descripcionCargo }
                    { descripcionPerfil }
                    { beneficios }
                    { requisitos }
                    { tags }
                    { localizacionMap }
                    { cuestionario }
                    { adjuntos }
                </Col>
            </Row>
        );
    }

    renderCuestionario() {
        let preguntas = null;
        const final = [];

        if ( this.state.posicionAvisualizar ) {
            preguntas = this.state.posicionAvisualizar.cuestionario.filter( ( preg ) => {
                return preg.tipo !== "adjunto";
            } );

            final.push( preguntas.map( ( preg ) => {
                return (
                    <div style={ { marginBottom: '20px' } } key={ preg.id }>
                        <PreguntasPostulante pregunta={ preg } respuestas={ preg.respuestas } />
                    </div>
                );
            } ) );

            return (
                <Row className="mt-30 mb-20">
                    <Col lg="12" sm="12" xs="12">
                        <h4>Cuestionario</h4>
                    </Col>
                    <Col lg="12" sm="12" xs="12">
                        { final }
                    </Col>
                </Row>
            );
        }

        return null;
    }

    renderAdjuntos() {
        let preguntas = null;
        const final = [];

        if ( this.state.posicionAvisualizar ) {
            preguntas = this.state.posicionAvisualizar.cuestionario.filter( ( preg ) => {
                return preg.tipo === "adjunto";
            } );

            final.push( preguntas.map( ( preg ) => {
                return (
                    <div style={ { marginBottom: '20px' } } key={ preg.id }>
                        <PreguntasPostulante pregunta={ preg } />
                    </div>
                );
            } ) );

            return (
                <Row className="mt-30 mb-20">
                    <Col lg="12" sm="12" xs="12">
                        <h4>Adjuntos</h4>
                    </Col>
                    <Col lg="12" sm="12" xs="12">
                        { final }
                    </Col>
                </Row>
            );
        }

        return null;
    }

    renderVerPostulantes() {
        let postulantes = null;

        if ( this.state.posicionAvisualizar.postulaciones.length > 0 ) {
            postulantes = [];
            postulantes.push( this.state.posicionAvisualizar.postulaciones.map( ( postu ) => {
                return (
                    <div key={ postu.id } className="col-lg-5 col-xl-5 col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <div className="row vertical-gap">
                                    <div className="col-auto">
                                        <div className="rui-profile-img">
                                            <img src={ userIcon } style={ { "max-width": "45px" } } alt="" />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="rui-profile-info">
                                            <h3 className="rui-profile-info-title h4">{ postu.candidato.nombre + ' ' + postu.candidato.apellido }</h3>
                                            <small className="text-grey-6 mt-2 mb-25">Postulante</small>
                                            <p className="rui-profile-info-mail">{ postu.candidato.correo }</p>
                                            <p className="rui-profile-info-phone">{ postu.candidato.telefono }</p>
                                            <p className="rui-profile-info-phone">{ postu.candidato.direccion }</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            } ) );
        } else {
            postulantes = <h2 className="mt-40"> No se ha postulado nadie hasta el momento. </h2>;
        }

        return postulantes;
    }

    // primero preguntando antes de borrar
    preguntarEliminar( posicion ) {
        this.setState( {
            posicionAeliminar: posicion,
            modal1: true,
            mensajeAviso: '¿Está seguro que desea eliminar esta publicación?',
        } );
    }

    // eliminando. Ahora sí
    eliminarDefinitivamente() {
        const data = { id: this.state.posicionAeliminar.id };

        axios.post( process.env.REACT_APP_DEVAPI + '/api/hcm/eliminarPublicacion', data ).then( ( res ) => {
            if ( res.data.ok ) {
                this.setState( {
                    posicionAeliminar: null,
                    modal1: false,
                    mensajeAviso: '',
                } );
                this.getPosiciones( this.state.empresaEscogida.id );
            } else {
                this.setState( {
                    posicionAeliminar: null,
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
            this.setState( { modal1: false } );
            break;
        case 2:
            this.setState( { modal2: false } );
            break;
        case 3:
            this.setState( { 
                modal3: false,
                perfilShow: null,
                posicionAvisualizar: null,
                perfilEdit: null,
            } );
            break;
        case 4:
            this.setState( { modal4: false } );
            break;
        default:
            break;
        }
    }

    filterDataTable( texto ) {
        if ( texto.length > 0 ) {
            const posicionesTmp = this.state.todasLasPosicionesFilter.slice();
            const filteredItems = posicionesTmp.filter( ( emp ) => {
                return emp.nombre && emp.nombre.toLowerCase().includes( texto.toLowerCase() );
            } );
            this.setState( {
                todasLasPosicionesFilter: filteredItems,
            } );
        } else {
            const posicionesTmp = this.state.todasLasPosiciones.slice();
            this.setState( {
                todasLasPosicionesFilter: posicionesTmp,
            } );
        }
    }

    render() {
        if ( this.props.info.jerarquia !== "administrador" && this.props.info.permisos.includes( 'reclutamiento' ) ) {
            let dataTable = null;
            const empresas = [];
            let vistaPublicacion = null;
            let filtrado = null;
            let selectEmpresa = null;

            if ( this.state.todasLasPosicionesFilter ) {
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

            // renderizamos el dropdown de empresas
            if ( this.state.empresas ) {
                this.state.empresas.forEach( ( empresa ) => {
                    empresas.push( { value: empresa.id, label: empresa.razon_social } );
                } );

                if ( this.state.empresaEscogida ) {
                    selectEmpresa = <Select
                        className="dropdown-feelrouk"
                        name="escoja-empresa"
                        options={ empresas }
                        defaultValue={ { label: this.state.empresaEscogida.razon_social, value: this.state.empresaEscogida.id } }
                        onChange={ ( e ) => {
                            this.renderEmpresa( e.value );
                        } }
                    />;
                } else {
                    selectEmpresa = <Select
                        className="dropdown-feelrouk"
                        name="escoja-empresa"
                        options={ empresas }
                        defaultValue={ { label: "Seleccione una empresa", value: 0 } }
                        onChange={ ( e ) => {
                            this.renderEmpresa( e.value );
                        } }
                    />;
                }
            }
            if ( this.state.posicionAvisualizar && this.state.perfilEscogido ) {
                vistaPublicacion = this.renderVerPublicacion();
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
                            } }>{ 'Publicación' }</ModalHeader>
                        <ModalBody>
                            <Row className="vertical-gap d-flex justify-content-center">
                                <Col lg="12">
                                    { vistaPublicacion }
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button className="btn-feelrouk" onClick={ () => this.closeModal( 3 ) }>Cerrar</Button>
                        </ModalFooter>
                    </Modal>

                    <Modal className="modal-grande extra" isOpen={ this.state.modal4 } toggle={ () => { 
                        this.closeModal( 4 );
                    } }>
                        <ModalHeader
                            toggle={ () => { 
                                this.closeModal( 4 );
                            } }>{ 'Postulantes' }</ModalHeader>
                        <ModalBody>
                            <Row className="vertical-gap d-flex justify-content-center">
                                { 'Editando aquí' }
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button className="btn-feelrouk" onClick={ () => this.closeModal( 4 ) }>Cerrar</Button>
                        </ModalFooter>
                    </Modal>

                    <Row>
                        <Col>
                            <h2>Listado de Publicaciones</h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="4" sm="12" xs="12">
                            { selectEmpresa }
                        </Col>
                    </Row>
                    { filtrado }
                    <Row className="justify-content-center">
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
) )( ListadoPosiciones );
