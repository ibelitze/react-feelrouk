/**
 * External Dependencies
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Row, Col, Button, Modal, ModalFooter, ModalHeader, ModalBody } from 'reactstrap';
import { MensajeBloqueo } from '../no-permisos';
import DataTable from 'react-data-table-component';
import Icon from '../icon';
import { Link } from 'react-router-dom';

import ver from '../../../common-assets/images/vcm/eye.svg';
import userIcon from '../../../common-assets/images/user-icon.jpg';

require( 'dotenv' ).config();

/**
 * Internal Dependencies
 */
import './style.scss';
// import Snippet from '../../components/snippet';

/**
 * Component
 */
class ListadoPostulantes extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            modal1: false,
            modal2: false,
            tituloModal: '',
            mensajeAviso: '',
            icono: false,
            todosLosPostulantes: null,
            todosLosPostulantesFilter: null,
            empresas: null,
            idPublicacion: null,
            publicacion: null,
            empresaEscogida: null,
            postulanteAvisualizar: null,
            verPostulantes: false,
            postulante: null,
        };
        this.openModal = this.openModal.bind( this );
        this.closeModal = this.closeModal.bind( this );

        this.getQueryVariable = this.getQueryVariable.bind( this );

        this.formatoAobject = this.formatoAobject.bind( this );
        this.renderingDataTable = this.renderingDataTable.bind( this );
        this.renderBotonesListado = this.renderBotonesListado.bind( this );
        this.getPublicaciones = this.getPublicaciones.bind( this );

        this.renderPostulantes = this.renderPostulantes.bind( this );
        this.renderVerPostulante = this.renderVerPostulante.bind( this );

        this.getEmpresas = this.getEmpresas.bind( this );
        this.volverAcargarTodo = this.volverAcargarTodo.bind( this );
        this.formatDate = this.formatDate.bind( this );

        this.filterDataTable = this.filterDataTable.bind( this );
    }

    componentDidMount() {
        const idPublicacion = this.getQueryVariable( 'id' );

        if ( idPublicacion ) {
            this.setState( {
                idPublicacion: idPublicacion,
            }, () => {
                this.getPublicaciones();
            } );
        } else {
            // no se pudo cargar el id o no existe. Muestro mensaje
            this.setState( {
                mensajeAviso: 'Publicación no encontrada o URL dañada. Por favor, intente nuevamente desde la página anterior.',
            } );
            this.openModal( 1 );
        }
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

    // llamada API para traer una publicación por id
    getPublicaciones() {
        return axios.get( process.env.REACT_APP_DEVAPI + '/api/hcm/getPublicacionById/' + this.state.idPublicacion ).then( ( res ) => {
            this.setState( { 
                ok: res.data.ok,
                publicacion: res.data.data,
                todosLosPostulantes: res.data.data.postulaciones,
                todosLosPostulantesFilter: res.data.data.postulaciones,
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

    volverAcargarTodo() {
        this.setState( {
            publicaciones: null,
            empresas: null,
        } );

        this.getEmpresas();
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

            this.getPublicaciones( escogida.id );
        }
    }

    renderPostulantes( idPublicacion ) {
        const publi = this.state.publicaciones.find( ( pub ) => {
            return pub.id === idPublicacion;
        } );

        if ( publi ) {
            const postu = publi.postulaciones.slice();

            this.setState( {
                todosLosPostulantes: postu,
                todosLosPostulantesFilter: postu,
            } );
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

    renderNombre( row ) {
        return ( row.candidato.nombre + ' ' + row.candidato.apellido );
    }

    // renderizamos la tabla con toda la data de perfiles
    renderingDataTable() {
        const columns = [
            {
                name: 'Nombre',
                selector: row => this.renderNombre( row ),
                sortable: false,
            },
            {
                name: 'Correo',
                selector: row => row.candidato.correo,
                sortable: true,
            },
            {
                name: 'Teléfono',
                selector: row => row.candidato.telefono,
                sortable: true,
            },
            {
                name: 'Dirección',
                selector: row => row.candidato.direccion,
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
                data={ this.state.todosLosPostulantesFilter }
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
                    this.setState( {
                        postulante: row,
                    }, () => {
                        this.openModal( 2 );
                    } );
                } } >
                    <img alt="ver" style={ { width: "25px" } } src={ ver } />
                </Button>
            </Fragment>
        );
    }

    renderVerPostulante( postu ) {
        const documentos = [];

        documentos.push( postu.documentos.map( ( docu ) => {
            return (
                <a key={ docu.id }  
                    rel="noreferrer" 
                    style={ { display: 'block' } }
                    href={ docu.link } 
                    target="_blank">{ docu.titulo }</a>
            );
        } ) );

        return (
            <div key={ postu.candidato.id } className="col-lg-12 col-xl-12 col-md-12">
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
                            <div className="col-auto">
                                <div className="rui-profile-info">
                                    <small className="text-grey-6 mt-2 mb-25">Documentos</small>
                                </div>
                                <div>
                                    { documentos }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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

    filterDataTable( texto ) {
        if ( texto.length > 0 ) {
            const posicionesTmp = this.state.todosLosPostulantesFilter.slice();
            const filteredItems = posicionesTmp.filter( ( emp ) => {
                return emp.nombre && emp.nombre.toLowerCase().includes( texto.toLowerCase() );
            } );
            this.setState( {
                todosLosPostulantesFilter: filteredItems,
            } );
        } else {
            const postulantesTmp = this.state.todosLosPostulantes.slice();
            this.setState( {
                todosLosPostulantesFilter: postulantesTmp,
            } );
        }
    }

    render() {
        if ( this.props.info.jerarquia !== "administrador" && this.props.info.permisos.includes( 'reclutamiento' ) ) {
            let dataTable = null;
            let idEmpresa = null;
            let postulante = null;

            if ( this.state.todosLosPostulantesFilter ) {
                dataTable = this.renderingDataTable();
                idEmpresa = this.state.publicacion.empresa[ 0 ].id;
            }
            if ( this.state.postulante ) {
                postulante = this.renderVerPostulante( this.state.postulante );
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
                            <Link to="/listado-publicaciones" className="btn btn-feelrouk">
                                Cerrar
                            </Link>
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
                                <Col lg="12" className="justify-content-center text-centered">
                                    { postulante }
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button className="btn-feelrouk" onClick={ () => this.closeModal( 2 ) }>Cerrar</Button>
                        </ModalFooter>
                    </Modal>

                    <Row className="mb-30 mt-20">
                        <Col lg="4" sm="4" xs="12">
                            <Link to={ '/listado-publicaciones?id=' + idEmpresa } style={ { display: 'flex', 'align-items': 'center' } }>
                                <img style={ { height: '25px', 'margin-right': '20px' } } src={ require( "../../../common-assets/images/hcm/back-arrow.png" ) } alt="" />
                                <h3 className="texto-back">Volver al listado de publicaciones</h3>
                            </Link>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <h2>Listado de Postulantes</h2>
                        </Col>
                    </Row>
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
) )( ListadoPostulantes );
