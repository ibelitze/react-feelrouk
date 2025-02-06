/**
 * External Dependencies
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Col, Row, Label } from "reactstrap";
// import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from 'draft-js';
import { convertFromHTML } from 'draft-convert';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import PreguntasPostulante from '../preguntas-postulante';

import './style.scss';

/**
 * Component
 */
class CuartoPaso extends Component {
    constructor( props ) {
        super( props );

        // Set the intiial input values
        this.state = {
            checked: false,
            checked2: false,
            dropdownOpen: false,
            base: null,
            preguntas: null,
            adjuntos: null,
        };

        this.handleChange = this.handleChange.bind( this );
        this.toggle = this.toggle.bind( this );
        this.renderInfo = this.renderInfo.bind( this );
        this.renderDescripcionCargo = this.renderDescripcionCargo.bind( this );
        this.renderDescripcionPerfil = this.renderDescripcionPerfil.bind( this );
        this.renderLocalizacion = this.renderLocalizacion.bind( this );
        this.renderBeneficios = this.renderBeneficios.bind( this );
        this.renderRequisitos = this.renderRequisitos.bind( this );
        this.renderTags = this.renderTags.bind( this );
        this.renderCuestionario = this.renderCuestionario.bind( this );
        this.renderAdjuntos = this.renderAdjuntos.bind( this );
    }

    componentDidMount() {
        this.renderInfo();
    }

    handleChange( e ) {
        // se necesita añadir el segundo switch (o varios)
        this.setState( { checked: e.target.checked } );
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

    renderInfo() {
        const formulario1 = this.props.formulario1;
        const formulario2 = this.props.formulario2;
        const formulario3 = this.props.formulario3;

        this.setState( {
            base: formulario1,
            preguntas: formulario2.preguntas,
            adjuntos: formulario3.adjuntos,
        } );
    }

    renderDescripcionCargo() {
        let edadReq = 'Sin edad';

        if ( this.props.formulario1.perfil ) {
            edadReq = this.props.formulario1.perfil.edadMIN + ' - ' + this.props.formulario1.perfil.edadMAX;
        }

        return (
            <Row className="mt-20">
                <Col lg="12" xs="12">
                    <h4>Descripción del cargo</h4>
                </Col>
                <Col lg="6" xs="12">
                    <div className="col input-visualizacion">
                        <Label>Nombre</Label>
                        <p>{ this.props.formulario1.perfil ? this.props.formulario1.perfil.nombre : "Sin nombre" }</p>
                    </div>
                    <div className="col input-visualizacion">
                        <Label>Modalidad</Label>
                        <p>{ this.props.formulario1.perfil ? this.props.formulario1.perfil.modalidad : "Sin modalidad" }</p>
                    </div>
                    <div className="col input-visualizacion">
                        <Label>Tipo de empleo</Label>
                        <p>{ this.props.formulario1.perfil ? this.props.formulario1.perfil.tipo_empleo : "Sin tipo" }</p>
                    </div>
                </Col>
                <Col lg="6" xs="12">
                    <div className="col input-visualizacion">
                        <Label>Edad requerida</Label>
                        <p>{ edadReq }</p>
                    </div>
                    <div className="col input-visualizacion">
                        <Label>Empresa que contrata</Label>
                        <p>{ this.props.formulario1.empresa.razon_social }</p>
                    </div>
                    <div className="col input-visualizacion">
                        <Label>Tipo de sueldo</Label>
                        <p>{ this.props.formulario1.perfil ? this.props.formulario1.perfil.tipo_sueldo : "Sin tipo" }</p>
                    </div>
                </Col>
            </Row>
        );
    }

    renderDescripcionPerfil() {
        const contentDescripcion = EditorState.createWithContent( convertFromHTML( this.props.formulario1.perfil.descripcion ) );
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
        const beneficios = this.props.formulario1.perfil.beneficios.map( ( requi ) => {
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
        const requisitos = this.props.formulario1.perfil.requisitos.map( ( requi ) => {
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
        const tags = this.props.formulario1.perfil.tags.map( ( tag ) => {
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
                        <p>{ this.props.formulario1.localizacion.texto }</p>
                    </div>
                </Col>
            </Row>
        );
    }

    renderCuestionario( data ) {
        let preguntas = null;
        const final = [];

        if ( this.state.formulario2 ) {
            preguntas = data.slice();

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

    renderAdjuntos( data ) {
        let preguntas = null;
        const final = [];

        if ( this.state.formulario3 ) {
            preguntas = data.slice();

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

    render() {
        if ( this.props.currentStep !== 4 ) {
            return null;
        }

        const rentaLiquida = null;
        let descripcionCargo = null;
        let descripcionPerfil = null;
        let localizacionMap = null;
        let beneficios = null;
        let requisitos = null;
        let tags = null;
        // let cuestionario = null;
        // let adjuntos = null;

        if ( this.props.formulario1.perfil ) {
            descripcionCargo = this.renderDescripcionCargo();
            descripcionPerfil = this.renderDescripcionPerfil();
            beneficios = this.renderBeneficios();
            requisitos = this.renderRequisitos();
            tags = this.renderTags();
        }
        // if ( this.props.formulario2.preguntas && this.props.formulario3.adjuntos ) {
        //     cuestionario = this.renderCuestionario( this.props.formulario2.preguntas );
        //     adjuntos = this.renderAdjuntos( this.props.formulario3.adjuntos );
        // }
        if ( this.props.formulario1.localizacionMap ) {
            localizacionMap = this.renderLocalizacion();
        }

        return (
            <Fragment>
                <Row className="justify-content-center">
                    <Col className="vista-previa" lg="11" sm="12" xs="12">
                        <Row className="pt-20 pl-10 pr-10 align-middle">
                            <Col lg="5" className="content-vistaprevia">
                                <img className="img-vcm" 
                                    src={ require( '../../../common-assets/images/icon-vista-previa.png' ) } 
                                    alt={ "Imagen para vista previa" } />
                                <h1>VISTA PREVIA</h1>
                            </Col>
                        </Row>
                        <Row className="mt-20 justify-content-center">
                            <Col lg="10">
                                <Row className="header-previsualizacion">
                                    <Col lg="12" xs="12">
                                        <div>
                                            <h1>{ this.props.formulario1.nombre }</h1>
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
                    </Col>
                </Row>
            </Fragment>
        );
    }
}

export default connect( ( { settings } ) => (
    {
        settings,
    }
) )( CuartoPaso );
