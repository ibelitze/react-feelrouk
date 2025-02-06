/**
 * External Dependencies
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Chart } from 'react-chartjs-2';
import { Row, Col, Button, Modal, ModalBody } from 'reactstrap';
require( 'dotenv' ).config();

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Internal Dependencies
 */
// import Carousel from './components/carousel';
// import WidgetMemory from './components/widget-memory';
// import WidgetDisc from './components/widget-disc';
// import WidgetCPU from './components/widget-cpu';
// import WidgetTasks from './components/widget-tasks';
// import WidgetUploads from './components/widget-uploads';
// import WidgetActivity from './components/widget-activity';

/**
 * Component
 */
class Content extends Component {
    constructor( props ) {
        super( props );

        this.getChartjsOptions = this.getChartjsOptions.bind( this );
        this.getChartjsData = this.getChartjsData.bind( this );
        this.getChartistOptions = this.getChartistOptions.bind( this );
        this.openModal = this.openModal.bind( this );
        this.closeModal = this.closeModal.bind( this );
        this.renderMenuParaModulo = this.renderMenuParaModulo.bind( this );

        this.state = {
            modal: false,
            tipoModulo: null,
            bar: {
                chartData: {
                    labels: [ 'data1', 'data2', 'data3', 'data4', 'data5', 'data6' ],
                    datasets: [
                        {
                            label: 'Dummy Data',
                            data: [
                                0.4,
                                0.3,
                                0.6,
                                0.35,
                                0.85,
                                0.55,
                            ],
                            backgroundColor: [
                                process.env.REACT_APP_COLOR_AZUL,
                                process.env.REACT_APP_COLOR_NARANJA,
                                process.env.REACT_APP_COLOR_AZUL,
                                process.env.REACT_APP_COLOR_NARANJA,
                                process.env.REACT_APP_COLOR_AZUL,
                                process.env.REACT_APP_COLOR_NARANJA,
                            ],
                        },
                    ],
                },
                options: {
                    title: {
                        display: true,
                        text: 'Ejemplo 1 de chart',
                        fontSize: 20,
                    },
                    legend: {
                        display: true,
                    },
                },
            },
            Pie: {
                chartData: {
                    labels: [ 'data1', 'data2' ],
                    datasets: [
                        {
                            label: 'Dummy Data',
                            data: [
                                7,
                                3,
                            ],
                            backgroundColor: [
                                process.env.REACT_APP_COLOR_AZUL,
                                process.env.REACT_APP_COLOR_NARANJA,
                            ],
                        },
                    ],
                },
                options: {
                    title: {
                        display: true,
                        text: 'Ejemplo 2 de chart',
                        fontSize: 20,
                    },
                    legend: {
                        display: true,
                    },
                },
            },
            moduloHCM: {
                reclutamiento: {
                    nombre: "RECLUTAMIENTO",
                    path: require( '../../../common-assets/images/imagenes-modulos/reclutamiento.png' ),
                },
                seleccion: {
                    nombre: "SELECCIÓN & CONTRATACIÓN",
                    path: require( '../../../common-assets/images/imagenes-modulos/seleccion.png' ),
                },
                gestion: {
                    nombre: "GESTIÓN INTELIGENTE DE PERSONAS",
                    path: require( '../../../common-assets/images/imagenes-modulos/gestion.png' ),
                },
                biblioteca: {
                    nombre: "BIBLIOTECA ÁGIL DE PERSONAL",
                    path: require( '../../../common-assets/images/imagenes-modulos/biblioteca.png' ),
                },
                formacion: {
                    nombre: "EXPERIENCIA DEL EQUIPO & FORMACIÓN",
                    path: require( '../../../common-assets/images/imagenes-modulos/formacion.png' ),
                },
            },
        };
    }

    // Abrir/Cerrar de todos los modales

    openModal() {
        this.setState( { modal: true } );
    }
    closeModal() {
        this.setState( { modal: false } );
    }

    getChartjsOptions( label ) {
        return {
            tooltips: {
                mode: 'index',
                intersect: false,
                backgroundColor: '#393f49',
                bodyFontSize: 11,
                bodyFontColor: '#d7d9e0',
                bodyFontFamily: "'Open Sans', sans-serif",
                xPadding: 10,
                yPadding: 10,
                displayColors: false,
                caretPadding: 5,
                cornerRadius: 4,
                callbacks: {
                    title: () => {},
                    label,
                },
            },
            legend: {
                display: false,
            },
            maintainAspectRatio: true,
            spanGaps: false,
            plugins: {
                filler: {
                    propagate: false,
                },
            },
            scales: {
                xAxes: [ { display: false } ],
                yAxes: [ {
                    display: false,
                    ticks: {
                        beginAtZero: true,
                    },
                } ],
            },
        };
    }

    getChartjsData( canvas, data, color = '#8e9fff' ) {
        const ctx = canvas.getContext( '2d' );
        const gradient = ctx.createLinearGradient( 0, 0, 0, 90 );
        gradient.addColorStop( 0, Chart.helpers.color( color ).alpha( 0.1 ).rgbString() );
        gradient.addColorStop( 1, Chart.helpers.color( color ).alpha( 0 ).rgbString() );

        return {
            labels: data,
            datasets: [
                {
                    backgroundColor: gradient,
                    borderColor: color,
                    borderWidth: 2,
                    pointHitRadius: 5,
                    pointBorderWidth: 0,
                    pointBackgroundColor: 'transparent',
                    pointBorderColor: 'transparent',
                    pointHoverBorderWidth: 0,
                    pointHoverBackgroundColor: color,
                    data,
                },
            ],
        };
    }

    getChartistOptions() {
        return {
            type: 'Pie',
            options: {
                donut: true,
                showLabel: false,
                donutWidth: 4,
                width: 150,
                height: 150,
            },
            listener: {
                created( ctx ) {
                    const defs = ctx.svg.elem( 'defs' );
                    defs.elem( 'linearGradient', {
                        id: 'gradient',
                        x1: 0,
                        y1: 1,
                        x2: 0,
                        y2: 0,
                    } ).elem( 'stop', {
                        offset: 0,
                        'stop-color': '#8e9fff',
                    } ).parent().elem( 'stop', {
                        offset: 1,
                        'stop-color': '#2bb7ef',
                    } );
                },
            },
        };
    }

    renderMenuParaModulo() {
        if ( this.state.tipoModulo ) {
            let pathImage = "";
            let titulo = "";
            let modulosRenderizados = null;

            if ( this.state.tipoModulo === "HCM" ) {
                pathImage = this.props.settings.img_feelrouk.hcm_modulo;
                titulo = "HUMAN CAPITAL ";

                modulosRenderizados = Object.keys( this.state.moduloHCM ).map( ( mod ) => {
                    const modulito =
                        <div key={ this.state.moduloHCM[ mod ].nombre } className="modulito">
                            <img src={ this.state.moduloHCM[ mod ].path } alt="Nombre de la sección" />
                            <h4>{ this.state.moduloHCM[ mod ].nombre }</h4>
                        </div>;

                    return modulito;
                } );
            } else if ( this.state.tipoModulo === "VCM" ) {
                pathImage = require( '../../../common-assets/images/ilustracion-value.png' );
                titulo = "VALUE CHAIN ";
            } else if ( this.state.tipoModulo === "DM" ) {
                pathImage = require( '../../../common-assets/images/ilustracion-digital.png' );
                titulo = "DIGITAL ";
            } else if ( this.state.tipoModulo === "RM" ) {
                pathImage = require( '../../../common-assets/images/ilustracion-revenue.png' );
                titulo = "REVENUE ";
            }

            return (
                <div>
                    <Row>
                        <Col lg="4">
                            <Button className="boton-volver" onClick={ this.closeModal }>
                                <div className="contenedor-volver">
                                    <FontAwesomeIcon icon={ faArrowLeft } />
                                    <p>Volver</p>
                                </div>
                            </Button>
                        </Col>
                        <Col lg="8">
                            <div className="container-titulo">
                                <h2>{ titulo }</h2> <h2 className="titulo-naranja">MANAGEMENT</h2>
                            </div>
                        </Col>
                    </Row>
                    <Row className="vertical-gap d-flex justify-content-center">
                        <Col className="contenedor-imagen" lg="4">
                            <img className="imagen-modulo" src={ pathImage } alt="Imagen del módulo seleccionado - Feelrouk" />
                        </Col>
                        <Col lg="8">
                            <p>Selecciona un módulo</p>
                            <div className="container-modulitos">
                                { modulosRenderizados }
                            </div>
                        </Col>
                    </Row>
                </div>
            );
        }

        return null;
    }

    render() {
        const contenidoModulo = this.renderMenuParaModulo();

        return (
            <Fragment>
                { /* <Row className="vertical-gap">
                    <Col lg="6">
                        <Bar data={ this.state.bar.chartData } options={ this.state.bar.options } />
                    </Col>

                    <Col lg="6">
                        <Pie data={ this.state.Pie.chartData } options={ this.state.Pie.options } />
                    </Col>
                </Row> */ }

                <Modal className="modal-modulo" isOpen={ this.state.modal } toggle={ this.closeModal }>
                    <ModalBody>
                        { contenidoModulo }
                    </ModalBody>
                </Modal>

                <div className="rui-gap-2" />

                <Row>
                    <Col lg="5" sm="6" xs="12" className="content-div-right">
                        <div className="recuadro-hcm-modulo">
                            <Col md="6" className="container-flex">
                                <img className="img-hcm" src={ this.props.settings.img_feelrouk.hcm_modulo } alt={ "Imagen para modulo HCM" } />
                            </Col>
                            <Col className="content-col" md="6">
                                <div>
                                    <h2 className="titulo-blanco">HUMAN CAPITAL</h2>
                                    <h2 className="titulo-naranja">MANAGEMENT</h2>
                                    <Button onClick={ () => {
                                        this.setState( { tipoModulo: "HCM" } );
                                        this.openModal();
                                    } } className="btn-feelrouk-naranja2">ABRIR</Button>
                                </div>
                            </Col>
                        </div>
                    </Col>
                    <Col lg="5" sm="6" xs="12" className="content-div-left">
                        <div className="recuadro-hcm-modulo">
                            <Col md="6" className="container-flex">
                                <img className="img-vcm" src={ require( '../../../common-assets/images/ilustracion-value.png' ) } alt={ "Imagen para modulo VCM" } />
                            </Col>
                            <Col className="content-col" md="6">
                                <div>
                                    <h2 className="titulo-blanco">VALUE CHAIN</h2>
                                    <h2 className="titulo-celeste">MANAGEMENT</h2>
                                    <Button onClick={ () => {
                                        this.setState( { tipoModulo: "VCM" } );
                                        this.openModal();
                                    } } className="btn-feelrouk-naranja2">ABRIR</Button>
                                </div>
                            </Col>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col lg="5" sm="6" xs="12" className="content-div-right">
                        <div className="recuadro-hcm-modulo">
                            <Col md="6" className="container-flex">
                                <img className="img-revenue" src={ require( '../../../common-assets/images/ilustracion-revenue.png' ) } alt={ "Imagen para modulo RM" } />
                            </Col>
                            <Col className="content-col" md="6">
                                <div>
                                    <h2 className="titulo-blanco">REVENUE</h2>
                                    <h2 className="titulo-celeste">MANAGEMENT</h2>
                                    <Button onClick={ () => {
                                        this.setState( { tipoModulo: "RM" } );
                                        this.openModal();
                                    } } className="btn-feelrouk-naranja2">ABRIR</Button>
                                </div>
                            </Col>
                        </div>
                    </Col>
                    <Col lg="5" sm="6" xs="12" className="content-div-left">
                        <div className="recuadro-hcm-modulo">
                            <Col md="6" className="container-flex">
                                <img src={ require( '../../../common-assets/images/ilustracion-digital.png' ) } alt={ "Imagen para modulo DM" } />
                            </Col>
                            <Col className="content-col" md="6">
                                <div>
                                    <h2 className="titulo-blanco">DIGITAL</h2>
                                    <h2 className="titulo-naranja">MANAGEMENT</h2>
                                    <Button onClick={ () => {
                                        this.setState( { tipoModulo: "DM" } );
                                        this.openModal();
                                    } } className="btn-feelrouk-naranja2">ABRIR</Button>
                                </div>
                            </Col>
                        </div>
                    </Col>
                </Row>

                { /* Swiper */ }
                { /*
                    <Carousel
                        getChartjsData={ this.getChartjsData }
                        getChartjsOptions={ this.getChartjsOptions }
                        getChartistOptions={ this.getChartistOptions }
                    />
                */ }

                { /* Latest Actions */ }
                { /*
                    <Row className="vertical-gap">
                        <Col lg="4">
                            <WidgetTasks />
                        </Col>
                        <Col lg="4">
                            <WidgetUploads />
                        </Col>
                        <Col lg="4">
                            <WidgetActivity />
                        </Col>
                    </Row>
                */ }

                { /* Server Data */ }
                { /*
                    <Row className="vertical-gap">
                        <Col lg="4">
                            <WidgetMemory
                                getChartjsData={ this.getChartjsData }
                                getChartjsOptions={ this.getChartjsOptions }
                            />
                        </Col>
                        <Col lg="4">
                            <WidgetDisc
                                getChartjsData={ this.getChartjsData }
                                getChartjsOptions={ this.getChartjsOptions }
                            />
                        </Col>
                        <Col lg="4">
                            <WidgetCPU
                                getChartjsData={ this.getChartjsData }
                                getChartjsOptions={ this.getChartjsOptions }
                            />
                        </Col>
                    </Row>
                */ }

                { /* Earnings by countries and map */ }
                { /* <h2>Earnings by Countries</h2>
                <Row className="vertical-gap">
                    <Col lg="8">
                        <Map />
                    </Col>
                    <Col lg="4">
                        <WidgetCountries />
                    </Col>
                </Row> */ }
            </Fragment>
        );
    }
}

export default connect( ( { settings } ) => (
    {
        settings,
    }
) )( Content );
