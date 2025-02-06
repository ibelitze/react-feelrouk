// "@asseinfo/react-kanban"
/**
 * External Dependencies
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Spinner, Row, Col, Modal, ModalFooter, ModalHeader, ModalBody, 
    Button, Label, Input, FormGroup, Table } from 'reactstrap';
import { MensajeBloqueo } from '../../components/no-permisos';
import CartaPostulante from '../../components/carta-postulante';
import { Link } from 'react-router-dom';
import Icon from '../../components/icon';
import Board from '@asseinfo/react-kanban';
import '@asseinfo/react-kanban/dist/styles.css';
import classnames from 'classnames/dedupe';
import FormData from 'form-data';

import Select from 'react-select';
import HeaderColumna from '../../components/header-pasos';

import { chequearDatosBasicos, chequearCV, chequearRegistro, chequearDocumentos, chequearTags } from '../../utils';
// import classnames from 'classnames/dedupe';
// import Select from 'react-select';
// import Icon from '../../components/icon';
// import DataTable from 'react-data-table-component';
// import borrar from '../../../common-assets/images/vcm/x-circle.svg';
// import edit from '../../../common-assets/images/vcm/edit.svg';

require( 'dotenv' ).config();
/**
 * Internal Dependencies
 */
import './style.scss';

/**
 * Component
 */
class PasosPub extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            loading: false,
            icono: false,
            mensajeAviso: '',
            nombre: '',
            apellido: '',
            correo: '',
            telefono: '',
            cv: null,
            nombreError: '',
            apellidoError: '',
            correoError: '',
            telefonoError: '',
            cvError: '',
            modal1: false,
            modal2: false,
            modal3: false,
            modal4: false,
            backup: null,
            board: null,
            empresas: null,
            publicaciones: null,
            publicacionTotal: null,
            empresaEscogida: null,
            publicacionEscogida: null,
            postulantes: null,
            archivo: null,
            array: null,
            candidatoPonderacion: null,
            subirCVcandidato: null,
            rangeValues: [ 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100 ],
            currentRangeDatos: 20,
            currentRangeRegistro: 20,
            currentRangeCV: 20,
            currentRangeDocumentos: 20,
            currentRangeTags: 20,
            alertaPorcentaje: false,
            porcentajes: null,
            idPorcentaje: null,
        };

        this.inputFileRef = React.createRef();
        this.openModal = this.openModal.bind( this );
        this.closeModal = this.closeModal.bind( this );
        this.subirLogo = this.subirLogo.bind( this );
        this.botonActivarSubida = this.botonActivarSubida.bind( this );
        this.getEmpresas = this.getEmpresas.bind( this );
        this.transferirPostulante = this.transferirPostulante.bind( this );
        this.eliminarPostulante = this.eliminarPostulante.bind( this );
        this.escogerEmpresa = this.escogerEmpresa.bind( this );
        this.renderizarContenido = this.renderizarContenido.bind( this );
        this.getPublicaciones = this.getPublicaciones.bind( this );
        this.renderizarPostulantes = this.renderizarPostulantes.bind( this );
        this.filtrarCandidatos = this.filtrarCandidatos.bind( this );
        this.encontrarIndexColumna = this.encontrarIndexColumna.bind( this );
        this.revisarCandidato = this.revisarCandidato.bind( this );
        this.csvFileToArray = this.csvFileToArray.bind( this );
        this.guardarCSV = this.guardarCSV.bind( this );
        this.guardarCandidatos = this.guardarCandidatos.bind( this );
        this.guardarCVcandidato = this.guardarCVcandidato.bind( this );
        this.mostrarRegistroCandidato = this.mostrarRegistroCandidato.bind( this );
        this.darPorcentajeCandidato = this.darPorcentajeCandidato.bind( this );
        this.renderCandidatoPonderacion = this.renderCandidatoPonderacion.bind( this );
        this.renderCandidatoCV = this.renderCandidatoCV.bind( this );
        this.returnHTMLpopup = this.returnHTMLpopup.bind( this );
        this.renderEcualizadores = this.renderEcualizadores.bind( this );
        this.manejarEcualizadores = this.manejarEcualizadores.bind( this );
        this.calcularMax = this.calcularMax.bind( this );
        this.renderOptions = this.renderOptions.bind( this );
        this.conteoDeCurrent = this.conteoDeCurrent.bind( this );
        this.guardarPorcentajes = this.guardarPorcentajes.bind( this );
        this.getPorcentajes = this.getPorcentajes.bind( this );
    }

    componentDidMount() {
        this.getEmpresas();
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
            this.setState( { modal3: false } );
            break;
        case 4:
            this.setState( { 
                modal4: false,
                candidatoPonderacion: null,
                subirCVcandidato: null,
            } );
            break;
        default:
            break;
        }
    }

    // llamada API para traer todas las empresas
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

    // llamada API para traer una publicación por id
    getPublicaciones() {
        return axios.get( process.env.REACT_APP_LOCAL + '/api/hcm/getPublicacionById/' + this.state.publicacionEscogida.id ).then( ( res ) => {
            this.setState( { 
                postulantes: res.data.data.postulaciones,
                publicacionTotal: res.data.data,
            }, () => {
                this.getPorcentajes();
                this.renderizarPostulantes();
            } );
        } );
    }

    // llamada API para traer una publicación por id
    getPorcentajes() {
        return axios.get( process.env.REACT_APP_LOCAL + '/api/hcm/getPorcentajePublicacion/' + this.state.publicacionEscogida.id ).then( ( res ) => {
            if ( res.data.ok ) {
                const temp = JSON.parse( res.data.data.datos );
                this.setState( { 
                    porcentajes: temp,
                    idPorcentaje: res.data.data.id,
                } );
            }
        } );
    }

    escogerEmpresa( id ) {
        const encontrada = this.state.empresas.find( ( empresa ) => {
            return empresa.id === id;
        } );

        const data = {
            id,
        };

        return axios.post( process.env.REACT_APP_LOCAL + '/api/hcm/getByEmpresa', data ).then( ( res ) => {
            this.setState( { 
                empresaEscogida: encontrada,
                publicaciones: res.data.data,
            } );
        } );
    }

    escogerPublicacion( id ) {
        const found = this.state.publicaciones.find( ( pub ) => {
            return pub.id === id;
        } );
        this.setState( {
            publicacionEscogida: found,
        }, () => {
            this.getPublicaciones();
        } );
    }

    subirLogo( file ) {
        if ( ! file ) {
            return;
        }

        if ( file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'application/pdf' ) {
            this.setState( {
                cvError: 'El CV solo puede ser jpeg, png o PDF',
            } );
            return;
        }

        if ( file.size > 10485760 ) {
            this.setState( {
                cvError: 'El CV no debe pesar más de 10 MB',
            } );
            return;
        }

        this.setState( {
            cv: file,
            cvError: file.name,
        }, () => {
            console.log( this.state.cv );
        } );
    }

    csvFileToArray( texto ) {
        const csvHeader = texto.slice( 0, texto.indexOf( "\n" ) ).split( "," );
        const csvRows = texto.slice( texto.indexOf( "\n" ) + 1 ).split( "\n" );

        const array = csvRows.map( i => {
            const values = i.split( "," );
            const obj = csvHeader.reduce( ( object, header, index ) => {
                object[ header ] = values[ index ];
                return object;
            }, {} );

            return obj;
        } );

        return array;
    }

    guardarCSV( e ) {
        this.setState( {
            archivo: e.target.files[ 0 ],
        }, () => {
            const fileReader = new window.FileReader();
            fileReader.onload = ( event ) => {
                const texto = event.target.result;
                const temp = this.csvFileToArray( texto );
                this.setState( {
                    array: temp,
                } );
            };

            fileReader.readAsText( this.state.archivo );
        } );
    }

    botonActivarSubida() {
        this.setState( {
            cvError: null,
        } );
        this.inputFileRef.current.click();
    }

    renderizarPostulantes() {
        // postulantesRender
        const array = [];

        const data = {
            board: {
                columns: [
                    {
                        id: 1,
                        title: 'Paso 0 - Postulantes',
                        cards: [],
                    },
                    {
                        id: 2,
                        title: 'Paso 2',
                        cards: [],
                    },
                    {
                        id: 3,
                        title: 'Paso 3',
                        cards: [],
                    },
                    {
                        id: 4,
                        title: 'Paso 4',
                        cards: [],
                    },
                ],
            },
        };

        const that = this;
        this.state.postulantes.forEach( ( postu ) => {
            const temp = {
                id: postu.candidato.id,
                content: {
                    id: postu.candidato.id,
                    nombre: postu.candidato.nombre + ' ' + postu.candidato.apellido,
                    correo: postu.candidato.correo,
                    telefono: postu.candidato.telefono,
                    direccion: postu.candidato.direccion,
                    registrado: that.mostrarRegistroCandidato( postu.candidato.registrado ),
                    porcentaje: that.darPorcentajeCandidato( postu ) + "%",
                },
                sort: that.darPorcentajeCandidato( postu ),
            };
            array.push( temp );
        } );

        const final = array.sort( ( a, b ) => {
            if ( a.sort < b.sort ) {
                return 1;
            }
            if ( a.sort > b.sort ) {
                return -1;
            }
            return 0;
        } );

        data.board.columns[ 0 ].cards = final.slice();
        const board1 = JSON.parse( JSON.stringify( data.board ) );
        const board2 = JSON.parse( JSON.stringify( data.board ) );

        this.setState( { board: board1 } );
        this.setState( { backup: board2 } );
    }

    mostrarRegistroCandidato( registrado ) {
        const temp = registrado ? "Sí" : "No";
        return temp;
    }

    darPorcentajeCandidato( postu ) {
        let porcentaje = 0;

        const datosBasicos = chequearDatosBasicos( postu.candidato, this.state.currentRangeDatos );
        const registro = chequearRegistro( postu.candidato, this.state.currentRangeRegistro );
        const cv = chequearCV( postu.candidato, this.state.currentRangeCV );

        const adjuntos = this.state.publicacionTotal.cuestionario.filter( ( pregunta ) => {
            return pregunta.tipo === "adjunto";
        } );
        const documentos = chequearDocumentos( postu.documentos, adjuntos, this.state.currentRangeDocumentos );
        const tags = chequearTags( postu.tags, this.state.publicacionTotal.perfil.tags, this.state.currentRangeTags );

        porcentaje = datosBasicos + registro + cv + documentos + tags;

        return parseInt( porcentaje );
    }

    transferirPostulante( source, destination ) {
        const posicionCarta = source.fromPosition;
        const columnaInicio = source.fromColumnId;
        const columnaFinal = destination.toColumnId;
        const posicionFinal = destination.toPosition;

        let indexColumnaPrima = null;
        let indexColumnaFinal = null;

        // clonar las columnas para poder trabajarlas por separado
        const columnasTemp = this.state.board.columns.slice();

        // conseguir la posición de la columna inicial
        columnasTemp.forEach( ( columna, index ) => {
            const found = columna.id === columnaInicio;
            if ( found ) {
                indexColumnaPrima = index;
            }
        } );
        // conseguir la posición de la columna final
        columnasTemp.forEach( ( columna, index ) => {
            const found = columna.id === columnaFinal;
            if ( found ) {
                indexColumnaFinal = index;
            }
        } );

        // extraer en la columna correcta la carta y guardarla en una variable
        const carta = Object.assign( {}, columnasTemp[ indexColumnaPrima ].cards[ posicionCarta ] );

        // eliminar la carta de la lista
        columnasTemp[ indexColumnaPrima ].cards.splice( posicionCarta, 1 );

        // ponerla en la columna correcta
        columnasTemp[ indexColumnaFinal ].cards.splice( posicionFinal, 0, carta );

        const data = {
            columns: columnasTemp,
        };
        const data2 = {
            columns: columnasTemp,
        };

        this.setState( { board: data } );
        this.setState( { backup: data2 } );
    }

    encontrarIndexColumna( id ) {
        const columnasTemp = JSON.parse( JSON.stringify( this.state.board.columns ) );
        let columnaIndex = 0;
        for ( const index in columnasTemp ) {
            if ( columnasTemp[ index ].id === id ) {
                columnaIndex = index;
            }
        }
        return columnaIndex;
    }

    eliminarPostulante( idCarta ) {
        // clonar las columnas para poder trabajarlas por separado
        const columnasTemp = JSON.parse( JSON.stringify( this.state.board.columns ) );
        let columnaIndex = 0;

        columnasTemp.forEach( ( columna, index ) => {
            const found = columna.cards.find( ( card ) => {
                return card.id === idCarta;
            } );

            if ( found ) {
                columnaIndex = index;
            }
        } );

        // eliminar la carta de la columna y lista correspondiente
        const final = columnasTemp[ columnaIndex ].cards.filter( ( postulante ) => {
            return postulante.id !== idCarta;
        } );
        columnasTemp[ columnaIndex ].cards = final;

        const data = JSON.parse( JSON.stringify( columnasTemp ) );
        const data2 = JSON.parse( JSON.stringify( columnasTemp ) );

        this.setState( {
            board: {
                columns: data,
            }, 
        } );
        this.setState( {
            backup: {
                columns: data2,
            }, 
        } );
    }

    filtrarCandidatos( columna, data ) {
        const texto = data;
        if ( texto && texto.length > 0 ) {
            const filteredItems = columna.cards.filter( ( card ) => {
                return card.content.nombre && card.content.nombre.toLowerCase().includes( texto.toLowerCase() );
            } );
            const index = this.encontrarIndexColumna( columna.id );
            const columnasTemp = JSON.parse( JSON.stringify( this.state.board.columns ) );
            columnasTemp[ index ].cards = filteredItems;

            const data1 = JSON.parse( JSON.stringify( columnasTemp ) );

            this.setState( {
                board: {
                    columns: data1,
                }, 
            }, () => {
                console.log( this.state.backup );
            } );
        } else {
            const columnasTemp = this.state.backup.columns.slice();
            const data2 = {
                columns: columnasTemp,
            };
            this.setState( { 
                board: data2,
            } );
        }
    }

    renderizarContenido() {
        let botonEcualizadorNaranja = null;

        if ( this.state.porcentajes ) {
            botonEcualizadorNaranja = <Button className="btn-feelrouk-naranja2" onClick={
                () => {
                    this.setState( {
                        modal4: true,
                    } );
                } 
            }>Editar porcentajes</Button>;
        }

        return (
            <>
                <Row className="mt-40">
                    <Col className="ml-25 separador-bottom">
                        <div className="contenedor-flex">
                            <div className="contenedor-info">
                                <h2>Empresa: </h2>
                                <p className="p-grande">{ this.state.empresaEscogida.razon_social }</p>
                            </div>
                            <div className="contenedor-info">
                                <h2>Publicación: </h2>
                                <p className="p-grande">{ this.state.publicacionEscogida.nombre }</p>
                            </div>
                        </div>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </Col>
                    <Col lg="2">
                        { botonEcualizadorNaranja }
                    </Col>
                </Row>
                <Row>
                    <Col className="ml-20">
                        <Board
                            renderColumnHeader={ ( columna ) => (
                                <HeaderColumna columna={ columna } filtrar={ this.filtrarCandidatos } />
                            ) }
                            disableColumnDrag={ true }
                            onCardDragEnd={ ( board, source, destination ) => {
                                this.transferirPostulante( source, destination );
                            } }
                            renderCard={ ( { id, content }, { dragging } ) => (
                                <CartaPostulante 
                                    dragging={ dragging } 
                                    id={ id } 
                                    eliminarPostulante={ this.eliminarPostulante }
                                    verPonderacion={ this.renderCandidatoPonderacion }
                                    subirCV={ this.renderCandidatoCV }>
                                    { content }
                                </CartaPostulante>
                            ) }
                        >
                            { this.state.board }
                        </Board>
                    </Col>
                </Row>
            </>
        );
    }

    revisarCandidato() {
        let count = 0;

        if ( this.state.nombre.length <= 0 ) {
            this.setState( {
                loading: false,
                nombreError: 'Debe llenar el nombre del nuevo candidato',
            } );
            count += 1;
        }
        if ( this.state.apellido.length <= 0 ) {
            this.setState( {
                loading: false,
                apellidoError: 'Debe llenar el apellido del nuevo candidato',
            } );
            count += 1;
        }
        if ( this.state.correo.length <= 0 ) {
            this.setState( {
                loading: false,
                correoError: 'Debe proporcionar el correo del nuevo candidato',
            } );
            count += 1;
        }
        if ( this.state.telefono.length <= 0 ) {
            this.setState( {
                loading: false,
                correoError: 'Debe proporcionar el telefono del nuevo candidato',
            } );
            count += 1;
        }
        if ( this.state.direccion.length <= 0 ) {
            this.setState( {
                loading: false,
                direccionError: 'Debe proporcionar la dirección del nuevo candidato',
            } );
            count += 1;
        }

        if ( count > 0 ) {
            return;
        }

        if ( ! this.state.cv ) {
            this.setState( {
                cvError: 'Debe incluir el CV',
                loading: false,
            } );
            return;
        }

        this.setState( {
            loading: true,
        } );

        // subir acá el logo - una vez que todo esté lleno en el formulario
        const formData = new FormData();
        formData.append( 'cv', this.state.cv );

        // llamada aquí - finalmente
        axios.post( process.env.REACT_APP_LOCAL + '/api/hcm/subirCVcandidato', formData ).then( ( res ) => {
            if ( res.data.ok && res.data.url ) {
                // grabar aquí el nuevo candidato con su CV

                const data = {
                    nombre: this.state.nombre,
                    apellido: this.state.apellido,
                    correo: this.state.correo,
                    telefono: this.state.telefono,
                    direccion: this.state.direccion,
                    id_publicacion: this.state.publicacionEscogida.id,
                    cv: res.data.url,
                };

                axios.post( process.env.REACT_APP_LOCAL + '/api/hcm/candidatoPorFormulario', data ).then( ( res2 ) => {
                    if ( res2.data.ok ) {
                        this.setState( {
                            loading: false,
                            nombre: '',
                            nombreError: '',
                            apellido: '',
                            apellidoError: '',
                            correo: '',
                            correoError: '',
                            telefono: '',
                            telefonoError: '',
                            direccion: '',
                            direccionError: '',
                            cv: null,
                            cvError: '',
                            modal1: false,
                            modal3: true,
                            icono: true,
                            mensajeAviso: "Candidato añadido satisfactoriamente",
                        }, () => {
                            this.getPublicaciones();
                        } );
                    }
                } );
            } else {
                this.setState( {
                    loading: false,
                    nombre: '',
                    nombreError: '',
                    apellido: '',
                    apellidoError: '',
                    correo: '',
                    correoError: '',
                    telefono: '',
                    telefonoError: '',
                    direccion: '',
                    direccionError: '',
                    cv: null,
                    cvError: '',
                    modal1: false,
                    modal3: true,
                    icono: false,
                    mensajeAviso: "Error con el archivo subido. No se guardó nada",
                }, () => {
                    this.getPublicaciones();
                } );
            }
        } ).catch( ( e ) => {
            console.log( e );
            this.setState( {
                loading: false,
                nombre: '',
                nombreError: '',
                apellido: '',
                apellidoError: '',
                correo: '',
                correoError: '',
                telefono: '',
                telefonoError: '',
                direccion: '',
                direccionError: '',
                cv: null,
                cvError: '',
                modal1: false,
                modal3: true,
                icono: false,
                mensajeAviso: "Candidato ya añadido anteriormente.",
            }, () => {
                this.getPublicaciones();
            } );
        } );
    }

    guardarCandidatos() {
        if ( this.state.array ) {
            const finalArray = [];

            this.state.array.forEach( ( item ) => {
                if ( item.Nombre && item[ 'Correo electronico' ] && item.Telefono ) {
                    const nombreCompleto = item.Nombre;
                    const nombre = nombreCompleto.split( ' ' ).shift();
                    const apellidos = nombreCompleto.split( ' ' ).pop();

                    const temp = {
                        nombre: nombre,
                        apellido: apellidos,
                        correo: item[ 'Correo electronico' ],
                        telefono: item.Telefono,
                    };

                    finalArray.push( temp );
                }
            } );

            const texto = JSON.stringify( finalArray );
            const data = {
                id_publicacion: this.state.publicacionEscogida.id,
                postulantes: texto,
            };

            this.setState( {
                loading: true,
            } );

            axios.post( process.env.REACT_APP_LOCAL + '/api/hcm/crearPostulacionCSV', data ).then( ( res ) => {
                if ( res.data.ok ) {
                    this.setState( {
                        loading: false,
                        modal2: false,
                        modal3: true,
                        icono: true,
                        mensajeAviso: "Los candidatos fueron registrados satisfactoriamente.",
                    }, () => {
                        this.getPublicaciones();
                    } );
                } else {
                    this.setState( {
                        loading: false,
                        modal2: false,
                        modal3: true,
                        icono: false,
                        mensajeAviso: "Hubo un error guardando los candidatos. Por favor, contacte al administrador.",
                    }, () => {
                        this.getPublicaciones();
                    } );
                }
            } );
        }
    }

    guardarCVcandidato() {
        if ( ! this.state.cv ) {
            this.setState( {
                cvError: 'Debe incluir el CV',
                loading: false,
            } );
            return;
        }

        this.setState( {
            loading: true,
        } );

        // subir acá el logo - una vez que todo esté lleno en el formulario
        const formData = new FormData();
        formData.append( 'cv', this.state.cv );
        formData.append( 'id', this.state.subirCVcandidato.candidato.id );

        axios( {
            method: "post",
            url: process.env.REACT_APP_LOCAL + '/api/hcm/primerCVcandidato',
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
        } ).then( ( res ) => {
            if ( res.data.ok ) {
                this.closeModal( 4 );
                this.setState( {
                    loading: false,
                    modal3: true,
                    icono: true,
                    mensajeAviso: "El CV del candidato fue guardado satisfactoriamente.",
                }, () => {
                    this.getPublicaciones();
                } );
            } else {
                this.closeModal( 4 );
                this.setState( {
                    loading: false,
                    modal3: true,
                    icono: false,
                    mensajeAviso: "Hubo un error guardando el CV del candidato. Por favor, contacte al administrador.",
                }, () => {
                    this.getPublicaciones();
                } );
            }
        } ).catch( () => {
            this.closeModal( 4 );
            this.setState( {
                loading: false,
                modal3: true,
                icono: false,
                mensajeAviso: "Hubo un error guardando el CV del candidato. Por favor, contacte al administrador.",
            }, () => {
                this.getPublicaciones();
            } );
        } );
    }

    renderCandidatoPonderacion( candidatoID ) {
        const candidato = this.state.postulantes.find( ( candi ) => {
            return candi.rel_candidato === candidatoID;
        } );
        const adjuntos = this.state.publicacionTotal.cuestionario.filter( ( pregunta ) => {
            return pregunta.tipo === "adjunto";
        } );

        const datos = {
            nombre: candidato.candidato.nombre + ' ' + candidato.candidato.apellido,
            basico: chequearDatosBasicos( candidato.candidato, this.state.currentRangeDatos ),
            registro: chequearRegistro( candidato.candidato, this.state.currentRangeRegistro ),
            cv: chequearCV( candidato.candidato, this.state.currentRangeCV ),
            documentos: chequearDocumentos( candidato.documentos, adjuntos, this.state.currentRangeDocumentos ),
            tags: chequearTags( candidato.tags, this.state.publicacionTotal.perfil.tags, this.state.currentRangeTags ),
        };

        this.setState( {
            candidatoPonderacion: datos,
            modal4: true,
        } );
    }

    renderCandidatoCV( candidatoID ) {
        const candidato = this.state.postulantes.find( ( candi ) => {
            return candi.rel_candidato === candidatoID;
        } );

        if ( candidato.candidato.cv.includes( "https://storage.googleapis.com/" ) ) {
            this.setState( {
                modal3: true,
                icono: false,
                mensajeAviso: "El candidato seleccionado ya tiene un CV registrado.",
            } );
        } else {
            this.setState( {
                subirCVcandidato: candidato,
                modal4: true,
            } );
        }
    }

    returnHTMLpopup() {
        if ( this.state.candidatoPonderacion ) {
            const html = <div>
                <h2>{ this.state.candidatoPonderacion.nombre }</h2>
                <Table>
                    <thead>
                        <tr>
                            <th>Evaluación</th>
                            <th>Porcentaje máximo</th>
                            <th>Candidato</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">Datos básicos</th>
                            <td>{ this.setState.currentRangeDatos }</td>
                            <td>{ parseInt( this.state.candidatoPonderacion.basico ) }%</td>
                        </tr>
                        <tr>
                            <th scope="row">Registro</th>
                            <td>{ this.setState.currentRangeRegistro }</td>
                            <td>{ parseInt( this.state.candidatoPonderacion.registro ) }%</td>
                        </tr>
                        <tr>
                            <th scope="row">CV</th>
                            <td>{ this.setState.currentRangeCV }</td>
                            <td>{ parseInt( this.state.candidatoPonderacion.cv ) }%</td>
                        </tr>
                        <tr>
                            <th scope="row">Documentos</th>
                            <td>{ this.setState.currentRangeDocumentos }</td>
                            <td>{ parseInt( this.state.candidatoPonderacion.documentos ) }%</td>
                        </tr>
                        <tr>
                            <th scope="row">Tags</th>
                            <td>{ this.setState.currentRangeTags }</td>
                            <td>{ parseInt( this.state.candidatoPonderacion.tags ) }%</td>
                        </tr>
                    </tbody>
                </Table>
            </div>;

            return html;
        }

        const nombre = this.state.subirCVcandidato.candidato.nombre + ' ' + this.state.subirCVcandidato.candidato.apellido;

        const html = <div>
            <h2>Agregar CV de { nombre }</h2>
            <input
                type={ "file" }
                id={ "cvInput" }
                onChange={ ( e ) => {
                    this.setState( {
                        logoError: null,
                    } );
                    this.subirLogo( e.target.files[ 0 ] );
                } } />
            <button className="btn btn-feelrouk2" 
                disabled={ this.state.loading } 
                onClick={ this.guardarCVcandidato }>Subir</button>
            { this.state.cv ? <span>CV cargado</span> : null }
            { this.state.cvError ? <span className="error">{ this.state.cvError }</span> : null }
        </div>;
        return html;
    }

    manejarEcualizadores( e, tipo ) {
        const sumatoria = this.conteoDeCurrent( tipo );
        if ( tipo === 'datos' ) {
            const total = parseInt( sumatoria ) + parseInt( e.target.value );
            if ( total <= 100 ) {
                if ( this.state.porcentajes ) {
                    const temp = Object.assign( {}, this.state.porcentajes );
                    temp.datosBasicos = parseInt( e.target.value );
                    this.setState( {
                        alertaPorcentaje: false,
                        porcentajes: temp,
                    } );
                } else {
                    this.setState( {
                        alertaPorcentaje: false,
                        currentRangeDatos: parseInt( e.target.value ),
                    } );
                }
            }
        }
        if ( tipo === 'cv' ) {
            const total = parseInt( sumatoria ) + parseInt( e.target.value );
            if ( total <= 100 ) {
                if ( this.state.porcentajes ) {
                    const temp = Object.assign( {}, this.state.porcentajes );
                    temp.cv = parseInt( e.target.value );
                    this.setState( {
                        alertaPorcentaje: false,
                        porcentajes: temp,
                    } );
                } else {
                    this.setState( {
                        alertaPorcentaje: false,
                        currentRangeCV: parseInt( e.target.value ),
                    } );
                }
            }
        }
        if ( tipo === 'documentos' ) {
            const total = parseInt( sumatoria ) + parseInt( e.target.value );
            if ( total <= 100 ) {
                if ( this.state.porcentajes ) {
                    const temp = Object.assign( {}, this.state.porcentajes );
                    temp.documentos = parseInt( e.target.value );
                    this.setState( {
                        alertaPorcentaje: false,
                        porcentajes: temp,
                    } );
                } else {
                    this.setState( {
                        alertaPorcentaje: false,
                        currentRangeDocumentos: parseInt( e.target.value ),
                    } );
                }
            }
        }
        if ( tipo === 'registro' ) {
            const total = parseInt( sumatoria ) + parseInt( e.target.value );
            if ( total <= 100 ) {
                if ( this.state.porcentajes ) {
                    const temp = Object.assign( {}, this.state.porcentajes );
                    temp.registro = parseInt( e.target.value );
                    this.setState( {
                        alertaPorcentaje: false,
                        porcentajes: temp,
                    } );
                } else {
                    this.setState( {
                        alertaPorcentaje: false,
                        currentRangeRegistro: parseInt( e.target.value ),
                    } );
                }
            }
        }
        if ( tipo === 'tags' ) {
            const total = parseInt( sumatoria ) + parseInt( e.target.value );
            if ( total <= 100 ) {
                if ( this.state.porcentajes ) {
                    const temp = Object.assign( {}, this.state.porcentajes );
                    temp.tags = parseInt( e.target.value );
                    this.setState( {
                        alertaPorcentaje: false,
                        porcentajes: temp,
                    } );
                } else {
                    this.setState( {
                        alertaPorcentaje: false,
                        currentRangeTags: parseInt( e.target.value ),
                    } );
                }
            }
        }
    }

    conteoDeCurrent( tipo ) {
        let total = 0;
        const datos = this.state.porcentajes ? this.state.porcentajes.datosBasicos : this.state.currentRangeDatos;
        const cv = this.state.porcentajes ? this.state.porcentajes.cv : this.state.currentRangeCV;
        const registro = this.state.porcentajes ? this.state.porcentajes.registro : this.state.currentRangeRegistro;
        const documentos = this.state.porcentajes ? this.state.porcentajes.documentos : this.state.currentRangeDocumentos;
        const tags = this.state.porcentajes ? this.state.porcentajes.tags : this.state.currentRangeTags;

        if ( tipo === 'datos' ) {
            total = cv + registro + tags + documentos;
        }
        if ( tipo === 'registro' ) {
            total = cv + datos + tags + documentos;
        }
        if ( tipo === 'cv' ) {
            total = datos + registro + tags + documentos;
        }
        if ( tipo === 'documentos' ) {
            total = cv + registro + tags + datos;
        }
        if ( tipo === 'tags' ) {
            total = cv + registro + datos + documentos;
        }
        if ( tipo === 'todo' ) {
            total = cv + registro + tags + documentos + datos;
        }

        return parseInt( total );
    }

    calcularMax( tipo ) {
        const total = parseInt( this.conteoDeCurrent( tipo ) );
        return parseInt( 100 - total );
    }

    renderOptions() {
        const data = [];
        for ( let step = 0; step <= 20; step++ ) {
            data.push( <option>{ step }</option> );
        }

        return data;
    }

    renderEcualizadores() {
        let alerta = null;
        const datosBasicos = this.state.porcentajes ? this.state.porcentajes.datosBasicos : this.state.currentRangeDatos;
        const cv = this.state.porcentajes ? this.state.porcentajes.cv : this.state.currentRangeCV;
        const registro = this.state.porcentajes ? this.state.porcentajes.registro : this.state.currentRangeRegistro;
        const documentos = this.state.porcentajes ? this.state.porcentajes.documentos : this.state.currentRangeDocumentos;
        const tags = this.state.porcentajes ? this.state.porcentajes.tags : this.state.currentRangeTags;
        const final = this.state.porcentajes ? "Editar" : "Guardar";

        if ( this.state.alertaPorcentaje ) {
            alerta = <span className="alerta-ecualizador">Debe completar el 100% entre todas las opciones</span>;
        }

        const porcentajeDatos = datosBasicos + ' %';
        const porcentajeCV = cv + ' %';
        const porcentajeRegistro = registro + ' %';
        const porcentajeDocumentos = documentos + ' %';
        const porcentajeTags = tags + ' %';

        const html = <div className="popup-porcentajes">
            <FormGroup>
                <Label>Datos básicos</Label>
                <Input
                    onChange={ ( e ) => this.manejarEcualizadores( e, 'datos' ) }
                    type={ 'range' }
                    min={ 0 }
                    defaultValue={ datosBasicos }
                    max={ this.calcularMax( 'datos' ) }
                    step={ 5 }
                    list={ "tick-list" } />
                <datalist id="tick-list">
                    { this.renderOptions() }
                </datalist>
                <span id="output">{ porcentajeDatos }</span>
            </FormGroup>
            <FormGroup>
                <Label>CV</Label>
                <Input
                    onChange={ ( e ) => this.manejarEcualizadores( e, 'cv' ) }
                    type={ 'range' }
                    min={ 0 }
                    defaultValue={ cv }
                    max={ this.calcularMax( 'cv' ) }
                    step={ 5 }
                    list={ "tick-list" } />
                <datalist id="tick-list">
                    { this.renderOptions() }
                </datalist>
                <span id="output">{ porcentajeCV }</span>
            </FormGroup>
            <FormGroup>
                <Label>Registro TakenJobs</Label>
                <Input
                    onChange={ ( e ) => this.manejarEcualizadores( e, 'registro' ) }
                    type={ 'range' }
                    min={ 0 }
                    defaultValue={ registro }
                    max={ this.calcularMax( 'registro' ) }
                    step={ 5 }
                    list={ "tick-list" } />
                <datalist id="tick-list">
                    { this.renderOptions() }
                </datalist>
                <span id="output">{ porcentajeRegistro }</span>
            </FormGroup>
            <FormGroup>
                <Label>Documentos solicitados</Label>
                <Input
                    onChange={ ( e ) => this.manejarEcualizadores( e, 'documentos' ) }
                    type={ 'range' }
                    min={ 0 }
                    defaultValue={ documentos }
                    max={ this.calcularMax( 'documentos' ) }
                    step={ 5 }
                    list={ "tick-list" } />
                <datalist id="tick-list">
                    { this.renderOptions() }
                </datalist>
                <span id="output">{ porcentajeDocumentos }</span>
            </FormGroup>
            <FormGroup>
                <Label>Match de Tags</Label>
                <Input
                    onChange={ ( e ) => this.manejarEcualizadores( e, 'tags' ) }
                    type={ 'range' }
                    min={ 0 }
                    defaultValue={ tags }
                    max={ this.calcularMax( 'tags' ) }
                    step={ 5 }
                    list={ "tick-list" } />
                <datalist id="tick-list">
                    { this.renderOptions() }
                </datalist>
                <span id="output">{ porcentajeTags }</span>
            </FormGroup>
            <Row className="mt-10 mb-20 justify-content-center">
                <Col lg="10">
                    <span>Recuerde que al presionar -Guardar- estará grabando los porcentajes en la base de datos.</span>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Button className="btn-feelrouk-naranja2" onClick={ () => {
                    const total = this.conteoDeCurrent( 'todo' );
                    if ( total < 100 ) {
                        this.setState( {
                            alertaPorcentaje: true,
                        } );
                    } else {
                        this.setState( {
                            modal2: false,
                        }, () => {
                            this.guardarPorcentajes();
                        } );
                    }
                } }>{ final }</Button>  
            </Row>
            <Row className="justify-content-center mt-20">
                { alerta }
            </Row>
        </div>;

        return html;
    }

    guardarPorcentajes() {
        if ( this.state.porcentajes ) {
            const final = JSON.stringify( this.state.porcentajes );

            const aEnviar = {
                id: this.state.idPorcentaje,
                datos: final, 
            };
            axios.post( process.env.REACT_APP_LOCAL + '/api/hcm/editarPorcentajes', aEnviar ).then( ( res ) => {
                if ( res.data.ok ) {
                    const temp = JSON.parse( res.data.data.datos );
                    this.setState( {
                        porcentajes: temp,
                        icono: true,
                        modal4: false,
                        modal3: true,
                        mensajeAviso: "Porcentajes editados satisfactoriamente.",
                    } );
                }
            } );
        }
    }

    render() {
        if ( this.props.info.jerarquia !== "administrador" && this.props.info.permisos.includes( 'seleccion' ) ) {
            const empresas = [];
            const publicaciones = [];
            let pasos = null;
            let selectPublicacion = null;
            let agregarCandidato = null;
            let agregarPorCSV = null;
            let candidatoTotal = null;
            let HeaderTitulo = '';

            const {
                nombre,
                nombreError,
                apellido,
                apellidoError,
                correo,
                correoError,
                telefono,
                telefonoError,
                direccion,
                direccionError,
            } = this.state;

            // renderizamos el dropdown de empresas
            if ( this.state.empresas ) {
                this.state.empresas.forEach( ( emp ) => {
                    empresas.push( { value: emp.id, label: emp.razon_social } );
                } );
            }
            if ( this.state.publicaciones ) {
                this.state.publicaciones.forEach( ( emp ) => {
                    publicaciones.push( { value: emp.id, label: emp.nombre } );
                } );
            }
            if ( this.state.empresaEscogida ) {
                selectPublicacion = <Col lg="4" sm="12" xs="12">
                    <Select
                        className="dropdown-feelrouk"
                        name="escoja-empresa"
                        options={ publicaciones }
                        defaultValue={ { label: "Seleccione una publicación", value: 0 } }
                        onChange={ ( e ) => {
                            this.escogerPublicacion( e.value );
                        } }
                    />
                </Col>;
            }
            if ( this.state.board ) {
                pasos = this.renderizarContenido();
                agregarCandidato = <button className="ml-20 btn btn-feelrouk2" onClick={ () => this.openModal( 1 ) }>Agregar candidato</button>;
                agregarPorCSV = <button className="ml-20 btn btn-feelrouk2" onClick={ () => this.openModal( 2 ) }>Agregar por CSV</button>;
            }
            if ( this.state.candidatoPonderacion || this.state.subirCVcandidato ) {
                candidatoTotal = this.returnHTMLpopup();
                HeaderTitulo = this.state.candidatoPonderacion ? 'Ver resultado de Candidato' : 'Subir CV de candidato';
            }
            if ( ! this.state.candidatoPonderacion && ! this.state.subirCVcandidato ) {
                candidatoTotal = this.renderEcualizadores();
                HeaderTitulo = "Cambiar porcentajes de evaluación";
            }

            return (
                <Fragment>

                    <Modal isOpen={ this.state.modal1 } toggle={ () => { 
                        this.closeModal( 1 );
                    } }>
                        <ModalHeader
                            toggle={ () => { 
                                this.closeModal( 1 );
                            } }>Crear</ModalHeader>
                        <ModalBody>
                            <Row className="vertical-gap d-flex justify-content-center">
                                <Col lg="10" className="justify-content-center">
                                    <h2>Agregar nuevo candidato</h2>
                                    <FormGroup>
                                        <Label for="nombre">Nombres *</Label>
                                        <Input type="text" 
                                            name="nombre" 
                                            className={ classnames( 'input-hcm-formulario', { 'is-invalid': nombreError } ) } 
                                            value={ nombre }
                                            onChange={ ( e ) => {
                                                const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                                this.setState( {
                                                    nombre: nuevo,
                                                    nombreError: '',
                                                } );
                                            } }
                                        />
                                        { nombreError ? (
                                            <div className="invalid-feedback">{ nombreError }</div>
                                        ) : '' }
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="nombre">Apellidos *</Label>
                                        <Input type="text" 
                                            name="apellido" 
                                            className={ classnames( 'input-hcm-formulario', { 'is-invalid': apellidoError } ) } 
                                            value={ apellido }
                                            onChange={ ( e ) => {
                                                const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                                this.setState( {
                                                    apellido: nuevo,
                                                    apellidoError: '',
                                                } );
                                            } }
                                        />
                                        { apellidoError ? (
                                            <div className="invalid-feedback">{ apellidoError }</div>
                                        ) : '' }
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="nombre">Correo *</Label>
                                        <Input type="email" 
                                            name="correo" 
                                            className={ classnames( 'input-hcm-formulario', { 'is-invalid': correoError } ) } 
                                            value={ correo }
                                            onChange={ ( e ) => {
                                                const nuevo = e.target.value.replace( /[`~!¨´#$%^&*°()¿¡|+\=?;:'",<>\{\}\[\]\\\/]/gi, '' );
                                                this.setState( {
                                                    correo: nuevo,
                                                    correoError: '',
                                                } );
                                            } }
                                        />
                                        { correoError ? (
                                            <div className="invalid-feedback">{ correoError }</div>
                                        ) : '' }
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="nombre">Telefono *</Label>
                                        <Input type="text" 
                                            name="telefono" 
                                            className={ classnames( 'input-hcm-formulario', { 'is-invalid': telefonoError } ) } 
                                            value={ telefono }
                                            onChange={ ( e ) => {
                                                // const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                                const nuevo = e.target.value.replace( /[^0-9]+/g, '' );
                                                this.setState( {
                                                    telefono: nuevo,
                                                    telefonoError: '',
                                                } );
                                            } }
                                        />
                                        { telefonoError ? (
                                            <div className="invalid-feedback">{ telefonoError }</div>
                                        ) : '' }
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="nombre">Dirección *</Label>
                                        <Input type="text" 
                                            name="direccion" 
                                            className={ classnames( 'input-hcm-formulario', { 'is-invalid': direccionError } ) } 
                                            value={ direccion }
                                            onChange={ ( e ) => {
                                                const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡_|+\=?;:'"<>\{\}\[\]\\\/]/gi, '' );
                                                this.setState( {
                                                    direccion: nuevo,
                                                    direccionError: '',
                                                } );
                                            } }
                                        />
                                        { direccionError ? (
                                            <div className="invalid-feedback">{ direccionError }</div>
                                        ) : '' }
                                    </FormGroup>
                                    <FormGroup>
                                        <Row>
                                            <Col className="align-center">
                                                <input className="boton-adjuntar-file" 
                                                    name="adjuntar_logo" 
                                                    type="file"
                                                    ref={ this.inputFileRef }
                                                    onChange={ ( e ) => {
                                                        this.setState( {
                                                            logoError: null,
                                                        } );
                                                        this.subirLogo( e.target.files[ 0 ] );
                                                    } } />
                                                <Button onClick={ () => {
                                                    this.botonActivarSubida();
                                                } } className="boton-adjuntar">Adjuntar CV</Button>
                                                { this.state.cv ? <span>CV cargado</span> : null }
                                                { this.state.cvError ? <span className="error">{ this.state.cvError }</span> : null }
                                            </Col>
                                            <Col lg="7">
                                                <div>
                                                    CV: Debe ser un JPEG, PNG o PDF no mayor a 10 MB.
                                                </div>
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                    <Row className="mt-30">
                                        <Col lg="12" xs="12" className="flex justify-content-center">
                                            <div className="mt-20"></div>
                                            <Button
                                                className="btn-feelrouk-naranja2" 
                                                disabled={ this.state.loading }
                                                onClick={ () => {
                                                    this.revisarCandidato();
                                                } }>
                                                Guardar candidato
                                                { this.state.loading ? (
                                                    <Spinner />
                                                ) : '' }
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button className="btn-feelrouk" onClick={ () => this.closeModal( 1 ) }>Cerrar</Button>
                        </ModalFooter>
                    </Modal>

                    <Modal isOpen={ this.state.modal2 } toggle={ () => { 
                        this.closeModal( 2 );
                    } }>
                        <ModalHeader
                            toggle={ () => { 
                                this.closeModal( 2 );
                            } }>Agregar</ModalHeader>
                        <ModalBody>
                            <Row className="vertical-gap d-flex justify-content-center">
                                <Col lg="10" className="justify-content-center text-centered">
                                    <h2>Agregar candidatos por CSV</h2>
                                    <input
                                        type={ "file" }
                                        id={ "csvFileInput" }
                                        accept={ ".csv" }
                                        onChange={ this.guardarCSV }
                                    />
                                    <button className="btn btn-feelrouk2" disabled={ this.state.loading } onClick={ this.guardarCandidatos }>Subir</button>
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
                                    <h2>{ this.state.mensajeAviso }</h2>
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
                            } }>{ HeaderTitulo }
                        </ModalHeader>
                        <ModalBody>
                            <Row className="vertical-gap d-flex justify-content-center">
                                <Col lg="10" className="justify-content-center text-centered">
                                    { candidatoTotal }
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button className="btn-feelrouk-naranja" onClick={ () => this.closeModal( 4 ) }>Cerrar</Button>
                        </ModalFooter>
                    </Modal>

                    <Row className="mb-30 mt-20">
                        <Col lg="4" sm="4" xs="12">
                            <Link to={ '/' } style={ { display: 'flex', 'align-items': 'center' } }>
                                <img style={ { height: '25px', 'margin-right': '20px' } } src={ require( "../../../common-assets/images/hcm/back-arrow.png" ) } alt="" />
                                <h3 className="texto-back">Volver atrás</h3>
                            </Link>
                        </Col>
                    </Row>
                    <Row className="mb-20 separador-bottom">
                        <Col lg="9" className="ml-25">
                            <div className="contenedor-flex">
                                <img src={ require( "../../../common-assets/images/hcm/price-tag.png" ) } alt="" />
                                <div className="contenedor-hijo">
                                    <h2>Selección - Estado actual</h2>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="3" sm="12" xs="12">
                            <Select
                                className="dropdown-feelrouk"
                                name="escoja-empresa"
                                options={ empresas }
                                defaultValue={ { label: "Seleccione una empresa", value: 0 } }
                                onChange={ ( e ) => {
                                    this.escogerEmpresa( e.value );
                                } }
                            />
                        </Col>
                        { selectPublicacion }
                        { agregarCandidato }
                        { agregarPorCSV }
                    </Row>
                    { pasos }
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
) )( PasosPub );
