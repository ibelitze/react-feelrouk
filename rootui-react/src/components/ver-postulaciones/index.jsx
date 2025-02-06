/**
 * External Dependencies
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Row, Col, Button, Modal, ModalFooter, ModalHeader, ModalBody, Label } from 'reactstrap';
import Icon from '../icon';
// import { faCaretDown, faTrash, faFile } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Editor } from "react-draft-wysiwyg";
import { EditorState } from 'draft-js';
import { convertFromHTML } from 'draft-convert';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

require( 'dotenv' ).config();
import StepperPostulante from '../stepper-postulante';

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
            todasLasPosiciones: null,
            empresas: null,
            todosLosPerfiles: null,
            empresaEscogida: null,
            perfilEscogido: null,
            posicionAvisualizar: null,
        };
        this.openModal = this.openModal.bind( this );
        this.closeModal = this.closeModal.bind( this );
        this.toggle = this.toggle.bind( this );

        this.getEmpresas = this.getEmpresas.bind( this );
        this.getPosiciones = this.getPosiciones.bind( this );
        this.getPerfiles = this.getPerfiles.bind( this );

        this.renderDescripcionCargo = this.renderDescripcionCargo.bind( this );
        this.renderDescripcionPerfil = this.renderDescripcionPerfil.bind( this );
        this.renderBeneficios = this.renderBeneficios.bind( this );
        this.renderRequisitos = this.renderRequisitos.bind( this );
        this.renderTags = this.renderTags.bind( this );
        this.renderLocalizacion = this.renderLocalizacion.bind( this );
        this.renderPublicacion = this.renderPublicacion.bind( this );
        this.renderCuestionario = this.renderCuestionario.bind( this );
    }

    componentDidMount() {
        this.getEmpresas();
        this.getPosiciones( "979bf4d0-1273-43ed-b60f-e7b662e02ff4" );
        this.getPerfiles( "979bf4d0-1273-43ed-b60f-e7b662e02ff4" );
    }

    // llamada API para traer todas las empresas (cuando se usa el dropdown)
    getEmpresas() {
        const data = {
            id: this.props.info.id,
        };
        return axios.post( process.env.REACT_APP_LOCAL + '/api/hcm/getEmpresas', data ).then( ( res ) => {
            this.setState( {
                empresas: res.data.empresas,
            } );
        } );
    }

    // llamada API para traer todos los permisos
    getPosiciones( idEmpresa ) {
        const data = {
            id: idEmpresa,
        };

        return axios.post( process.env.REACT_APP_LOCAL + '/api/hcm/getByEmpresa', data ).then( ( res ) => {
            this.setState( { 
                ok: res.data.ok,
                todasLasPosiciones: res.data.data,
            }, () => {
                this.mostrarPosicionCompleta();
            } );
        } );
    }

    // llamada API para traer todos los permisos
    getPerfiles( idEmpresa ) {
        const data = {
            id: idEmpresa,
        };
        return axios.post( process.env.REACT_APP_LOCAL + '/api/hcm/getPerfiles', data ).then( ( res ) => {
            this.setState( {
                todosLosPerfiles: res.data.data,
            }, () => {
                this.mostrarPosicionCompleta();
            } );
        } );
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

    mostrarPosicionCompleta() {
        const posicionId = "9eff2ae9-0b91-4b7f-a4b3-7c5af11aadb3";

        if ( this.state.todasLasPosiciones && this.state.todosLosPerfiles && this.state.empresas ) {
            const posicion = this.state.todasLasPosiciones.find( ( poss ) => {
                return poss.id === posicionId;
            } );
            const perfil = this.state.todosLosPerfiles.find( ( perf ) => {
                return perf.id === posicion.rel_perfil;
            } );
            const empresa = this.state.empresas.find( ( emp ) => {
                return emp.id === posicion.rel_empresa;
            } );

            this.setState( {
                posicionAvisualizar: posicion,
                perfilEscogido: perfil,
                empresaEscogida: empresa,
            } );
        }
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
                        <p>{ this.state.posicionAvisualizar.localizacion }</p>
                    </div>
                </Col>
            </Row>
        );
    }

    // renderizado de la postulación (info)
    renderPublicacion() {
        const rentaLiquida = null;
        let descripcionCargo = null;
        let descripcionPerfil = null;
        let localizacionMap = null;
        let beneficios = null;
        let requisitos = null;
        let tags = null;

        if ( this.state.perfilEscogido ) {
            // edadReq = this.state.perfilEscogido.edadMIN + ' - ' + this.state.perfilEscogido.edadMAX;
            descripcionCargo = this.renderDescripcionCargo();
            descripcionPerfil = this.renderDescripcionPerfil();
            beneficios = this.renderBeneficios();
            requisitos = this.renderRequisitos();
            tags = this.renderTags();
            localizacionMap = this.renderLocalizacion();
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
                </Col>
            </Row>
        );
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

    renderCuestionario() {
        if ( this.state.posicionAvisualizar.cuestionario ) {
            // render aquí del stepper-postulante
            // meterle props (todo el cuestionario)
            return (
                <div>Stepper aquí</div>
            );
        }

        return null;
    }

    render() {
        let publicacion = null;
        let cuestionario = null;

        if ( this.state.empresaEscogida && this.state.perfilEscogido && this.state.posicionAvisualizar ) {
            publicacion = this.renderPublicacion();
            cuestionario = <StepperPostulante cuestionario={ this.state.posicionAvisualizar.cuestionario } />;
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
                        <Button className="btn-feelrouk-naranja">Si</Button>
                        <Button className="btn-feelrouk" onClick={ () => this.closeModal( 1 ) }>No</Button>
                    </ModalFooter>
                </Modal>

                { publicacion }

                <Row className="justify-content-center">
                    <Col lg="10" xs="12">
                        <h1>Postula completando los siguientes datos</h1>
                    </Col>
                </Row>
                <div className="mb-50"></div>
                <Row>
                    { cuestionario }
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
) )( ListadoPosiciones );
