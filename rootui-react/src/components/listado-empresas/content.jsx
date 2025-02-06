/**
 * External Dependencies
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Spinner, Row, Col, Button, Modal, ModalFooter, ModalHeader, ModalBody, FormGroup, Input, Label } from 'reactstrap';
import { MensajeBloqueo } from '../no-permisos';
import Icon from '../icon';
import FormData from 'form-data';

import DataTable from 'react-data-table-component';
import ver from '../../../common-assets/images/vcm/eye.svg';
import edit from '../../../common-assets/images/vcm/edit.svg';

import CrearEmpresaHCM from '../crear-empresa';
require( 'dotenv' ).config();

/**
 * Internal Dependencies
 */
import './style.scss';
// import Snippet from '../../components/snippet';

/**
 * Component
 */
class ListadoEmpresas extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            modal1: false,
            modal2: false,
            modal3: false,
            tituloModal: '',
            mensajeAviso: '',
            icono: false,
            empresas: null,
            empresasFiltrado: null,
            empresaEditar: null,
            logo: null,
            logoNombre: '',
            logoError: null,
        };

        this.inputFileRef = React.createRef();
        this.openModal = this.openModal.bind( this );
        this.closeModal = this.closeModal.bind( this );
        this.getEmpresas = this.getEmpresas.bind( this );
        this.renderingDataTable = this.renderingDataTable.bind( this );
        this.renderBotonesListado = this.renderBotonesListado.bind( this );
        this.editarEmpresa = this.editarEmpresa.bind( this );
        this.renderEdicion = this.renderEdicion.bind( this );
        this.revisarEmpresaEdicion = this.revisarEmpresaEdicion.bind( this );
        this.mostrarDatosEmpresa = this.mostrarDatosEmpresa.bind( this );
        this.filterDataTable = this.filterDataTable.bind( this );
        this.subirLogo = this.subirLogo.bind( this );
        this.botonActivarSubida = this.botonActivarSubida.bind( this );
    }

    componentDidMount() {
        this.getEmpresas();
    }

    // llamada API para traer todas las empresas
    getEmpresas() {
        const data = {
            id: this.props.info.id,
        };
        return axios.post( process.env.REACT_APP_DEVAPI + '/api/hcm/getEmpresas', data ).then( ( res ) => {
            this.setState( { 
                ok: res.data.ok,
                empresas: res.data.empresas,
                empresasFiltrado: res.data.empresas,
            } );
        } );
    }

    // renderizamos la tabla con toda la data de perfiles
    renderingDataTable() {
        const columns = [
            {
                name: 'Razón Social',
                selector: row => row.razon_social,
                sortable: true,
            },
            {
                name: 'RUT',
                selector: row => row.rut,
                sortable: true,
            },
            {
                name: 'Nombre',
                selector: row => row.nombre,
                sortable: true,
            },
            {
                name: 'Apellido',
                selector: row => row.apellido,
                sortable: true,
            },
            {
                name: 'Cargo',
                selector: row => row.cargo,
                sortable: true,
            },
            {
                name: 'Correo',
                selector: row => row.correo,
                sortable: true,
            },
            {
                name: 'Telefono',
                selector: row => row.telefono,
                sortable: false,
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
                data={ this.state.empresasFiltrado }
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
                    this.mostrarDatosEmpresa( row );
                } } >
                    <img alt="ver" style={ { width: "25px" } } src={ ver } />
                </Button>
                <Button className="btn btn-datatable" onClick={ () => {
                    this.editarEmpresa( row );
                } } >
                    <img alt="editar" style={ { width: "25px" } } src={ edit } />
                </Button>
            </Fragment>
        );
    }

    mostrarDatosEmpresa( empresa ) {
        this.setState( {
            empresaVer: empresa,
        } );
        this.openModal( 3 );
    }

    renderVerEmpresa() {
        if ( this.state.empresaVer ) {
            return (
                <Fragment>
                    <Row>
                        <Col lg="6" sm="12" xs="12">
                            <h2>Datos de la empresa</h2>
                            <div className="mb-30"></div>
                            <div>
                                <h3>Razón social: </h3>
                                <p>{ this.state.empresaVer.razon_social }</p>
                            </div>
                            <div>
                                <h3>RUT de la empresa: </h3>
                                <p>{ this.state.empresaVer.rut }</p>
                            </div>
                            <div>
                                <h3>URL de la página web: </h3>
                                <p>{ this.state.empresaVer.url }</p>
                            </div>
                            <div>
                                <h3>Logo de la empresa: </h3>
                                <img style={ { 'max-width': '70%' } } alt="logotipo de empresa HCM" src={ this.state.empresaVer.logo } />
                            </div>
                        </Col>
                        <Col lg="6" sm="12" xs="12">
                            <h2>Datos de contacto principal</h2>
                            <div className="mb-30"></div>
                            <div>
                                <h3>Nombre: </h3>
                                <p>{ this.state.empresaVer.nombre }</p>
                            </div>
                            <div>
                                <h3>Apellido: </h3>
                                <p>{ this.state.empresaVer.apellido }</p>
                            </div>
                            <div>
                                <h3>Cargo: </h3>
                                <p>{ this.state.empresaVer.cargo }</p>
                            </div>
                            <div>
                                <h3>Correo electrónico: </h3>
                                <p>{ this.state.empresaVer.correo }</p>
                            </div>
                            <div>
                                <h3>Teléfono: </h3>
                                <p>{ this.state.empresaVer.telefono }</p>
                            </div>
                        </Col>
                    </Row>
                </Fragment>
            );
        }
    }

    editarEmpresa( empresa ) {
        const emp = Object.assign( {}, empresa );
        this.setState( {
            empresaEditar: emp,
        } );

        this.openModal( 2 );
    }

    subirLogo( file ) {
        // const form = new FormData();

        if ( ! file ) {
            return;
        }

        if ( file.type !== 'image/jpeg' && file.type !== 'image/png' ) {
            this.setState( {
                logoError: 'El logo solo puede ser jpeg o png',
            } );
            return;
        }

        if ( file.size > 10485760 ) {
            this.setState( {
                logoError: 'El logo no debe pesar más de 10 MB',
            } );
        }

        this.setState( {
            logo: file,
            logoNombre: file.name,
        } );
    }

    botonActivarSubida() {
        this.setState( {
            logoError: null,
        } );
        this.inputFileRef.current.click();
    }

    renderEdicion() {
        const {
            rut,
            nombre,
            url,
            apellido,
            cargo,
            correo,
            telefono,
        } = this.state.empresaEditar;

        return (
            <Fragment>
                <Row>
                    <Col lg="6" sm="12" xs="12">
                        <h2>Datos de la empresa</h2>
                        <div className="mb-30"></div>
                        <FormGroup>
                            <Label for="razon">Razón Social *</Label>
                            <Input type="text" 
                                name="razon" 
                                className="input-hcm-formulario"
                                value={ this.state.empresaEditar.razon_social }
                                onChange={ ( e ) => {
                                    const dato = Object.assign( {}, this.state.empresaEditar );
                                    dato.razon_social = e.target.value;
                                    this.setState( {
                                        empresaEditar: dato,
                                    } );
                                } }
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="rut">RUT de la empresa *</Label>
                            <Input type="text"
                                name="rut" 
                                className="input-hcm-formulario"
                                value={ rut }
                                onChange={ ( e ) => {
                                    const dato = Object.assign( {}, this.state.empresaEditar );
                                    dato.rut = e.target.value;
                                    this.setState( {
                                        empresaEditar: dato,
                                    } );
                                } }
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="rut">URL de la página web (opcional)</Label>
                            <Input type="text"
                                name="rut" 
                                className="input-hcm-formulario"
                                value={ url }
                                onChange={ ( e ) => {
                                    const dato = Object.assign( {}, this.state.empresaEditar );
                                    dato.url = e.target.value;
                                    this.setState( {
                                        empresaEditar: dato,
                                    } );
                                } }
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="rut">Editar logo de la empresa</Label>
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
                                    } } className="boton-adjuntar">Adjuntar logo</Button>
                                    { this.state.logo ? <span>Logo cargado</span> : null }
                                    { this.state.logoError ? <span className="error">{ this.state.logoError }</span> : null }
                                </Col>
                                <Col lg="7">
                                    <div>
                                        Imagen logo: Debe ser un JPEG o PNG no mayor a 10 MB. Las imagenes deben tener como mínimo 1000 x 1000 píxeles.
                                    </div>
                                </Col>
                            </Row>
                        </FormGroup>
                    </Col>
                    <Col lg="6" sm="12" xs="12">
                        <h2>Datos de contacto principal</h2>
                        <div className="mb-30"></div>
                        <FormGroup>
                            <Label for="nombre">Nombre *</Label>
                            <Input type="text"
                                name="nombre" 
                                className="input-hcm-formulario"
                                value={ nombre }
                                onChange={ ( e ) => {
                                    const dato = Object.assign( {}, this.state.empresaEditar );
                                    dato.nombre = e.target.value;
                                    this.setState( {
                                        empresaEditar: dato,
                                    } );
                                } }
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="apellido">Apellido *</Label>
                            <Input type="text"
                                name="apellido" 
                                className="input-hcm-formulario"
                                value={ apellido }
                                onChange={ ( e ) => {
                                    const dato = Object.assign( {}, this.state.empresaEditar );
                                    dato.apellido = e.target.value;
                                    this.setState( {
                                        empresaEditar: dato,
                                    } );
                                } }
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="cargo">Cargo *</Label>
                            <Input type="text"
                                name="cargo" 
                                className="input-hcm-formulario"
                                value={ cargo }
                                onChange={ ( e ) => {
                                    const dato = Object.assign( {}, this.state.empresaEditar );
                                    dato.cargo = e.target.value;
                                    this.setState( {
                                        empresaEditar: dato,
                                    } );
                                } }
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="correo">Correo electrónico *</Label>
                            <Input type="text"
                                name="correo" 
                                className="input-hcm-formulario"
                                value={ correo }
                                onChange={ ( e ) => {
                                    const dato = Object.assign( {}, this.state.empresaEditar );
                                    dato.correo = e.target.value;
                                    this.setState( {
                                        empresaEditar: dato,
                                    } );
                                } }
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="telefono">Telefono *</Label>
                            <Input type="text"
                                name="telefono" 
                                className="input-hcm-formulario"
                                value={ telefono }
                                onChange={ ( e ) => {
                                    const dato = Object.assign( {}, this.state.empresaEditar );
                                    dato.telefono = e.target.value;
                                    this.setState( {
                                        empresaEditar: dato,
                                    } );
                                } }
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row className="mt-30">
                    <Col lg="12" xs="12" className="flex justify-content-center">
                        <div className="mt-20"></div>
                        <Button
                            className="btn-feelrouk-naranja2" 
                            disabled={ this.state.loading }
                            onClick={ () => {
                                this.revisarEmpresaEdicion();
                            } }>
                            Guardar Edición
                            { this.state.loading ? (
                                <Spinner />
                            ) : '' }
                        </Button>
                    </Col>
                </Row>
            </Fragment>
        );
    }

    revisarEmpresaEdicion() {
        // primero:  comprobación de que todos los inputs fueron llenados
        this.setState( {
            loading: true,
        } );

        if ( this.state.empresaEditar.razon_social.length <= 0 || this.state.empresaEditar.rut.length <= 0 
            || this.state.empresaEditar.nombre.length <= 0 || this.state.empresaEditar.apellido.length <= 0 
            || this.state.empresaEditar.cargo.length <= 0 
            || this.state.empresaEditar.correo.length <= 0 || this.state.empresaEditar.telefono.length <= 0 ) {
            this.setState( {
                loading: false,
                mensajeAviso: 'Debe llenar todos los campos del formulario',
                icono: false,
            } );
            this.openModal( 1 );
            return;
        }

        // si el usuario escogió un archivo diferente como logo
        // si el usuario escogió un archivo diferente como logo
        if ( this.state.logo ) {
            // subir acá el logo - una vez que todo esté lleno en el formulario
            const formData = new FormData();
            formData.append( 'image', this.state.logo );
            formData.append( 'ldt', 'hcm' );

            // llamada aquí - finalmente
            axios.post( process.env.REACT_APP_DEVAPI + '/api/hcm/bucketgoogle', formData ).then( ( res ) => {
                if ( res.data.ok ) {
                    const data = {
                        id: this.state.empresaEditar.id,
                        razonSocial: this.state.empresaEditar.razon_social,
                        rut: this.state.empresaEditar.rut,
                        nombre: this.state.empresaEditar.nombre,
                        apellido: this.state.empresaEditar.apellido,
                        cargo: this.state.empresaEditar.cargo,
                        correo: this.state.empresaEditar.correo,
                        telefono: this.state.empresaEditar.telefono,
                        logo: res.data.url,
                    };

                    // llamada a editar la empresa aquí
                    axios.post( process.env.REACT_APP_DEVAPI + '/api/hcm/editarEmpresa', data ).then( ( res2 ) => {
                        if ( res2.data ) {
                            this.setState( {
                                empresaEditar: false, 
                                loading: false,
                                mensajeAviso: 'Empresa editada satisfactoriamente.',
                                icono: true,
                            } );
                            this.closeModal( 2 );
                            this.openModal( 1 );
                            this.getEmpresas();
                        }
                    } ).catch( ( e ) => {
                        console.log( e );
                        this.setState( {
                            empresaEditar: false,
                            loading: false,
                            logo: null,
                            logoNombre: '',
                            logoError: '',
                            mensajeAviso: 'La empresa no se pudo editar. Contacte con el administrador.',
                            icono: false,
                        } );
                        this.closeModal( 2 );
                        this.openModal( 1 );
                    } );
                } else {
                    this.setState( {
                        empresaEditar: false,
                        loading: false,
                        logo: null,
                        logoNombre: '',
                        logoError: '',
                        mensajeAviso: 'El logo de la empresa no se pudo editar. Contacte con el administrador.',
                        icono: false,
                    } );
                    this.closeModal( 2 );
                    this.openModal( 1 );
                }
            } ).catch( ( e ) => {
                console.log( e );
                this.setState( {
                    empresaEditar: false,
                    loading: false,
                    logo: null,
                    logoNombre: '',
                    logoError: '',
                    mensajeAviso: 'La empresa no se pudo editar. Contacte con el administrador.',
                    icono: false,
                } );
                this.closeModal( 2 );
                this.openModal( 1 );
            } );
        } else {
            // si no subió logo, simplemente se llama a editar los datos normales (sin subir archivos al bucket)
            // si no subió logo, simplemente se llama a editar los datos normales (sin subir archivos al bucket)
            const data = {
                id: this.state.empresaEditar.id,
                razonSocial: this.state.empresaEditar.razon_social,
                rut: this.state.empresaEditar.rut,
                nombre: this.state.empresaEditar.nombre,
                apellido: this.state.empresaEditar.apellido,
                cargo: this.state.empresaEditar.cargo,
                correo: this.state.empresaEditar.correo,
                telefono: this.state.empresaEditar.telefono,
                logo: this.state.empresaEditar.logo,
            };

            // llamada a editar la empresa aquí
            axios.post( process.env.REACT_APP_DEVAPI + '/api/hcm/editarEmpresa', data ).then( ( res ) => {
                if ( res.data ) {
                    this.setState( {
                        empresaEditar: false, 
                        loading: false,
                        mensajeAviso: 'Empresa editada satisfactoriamente.',
                        icono: true,
                    } );
                    this.closeModal( 2 );
                    this.openModal( 1 );
                    this.getEmpresas();
                }
            } ).catch( ( e ) => {
                console.log( e );
                this.setState( {
                    empresaEditar: false,
                    loading: false,
                    logo: null,
                    logoNombre: '',
                    logoError: '',
                    mensajeAviso: 'La empresa no se pudo editar. Contacte con el administrador.',
                    icono: false,
                } );
                this.closeModal( 2 );
                this.openModal( 1 );
            } );
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
                empresaVer: null, 
            } );
            break;
        default:
            break;
        }
    }

    filterDataTable( texto ) {
        if ( texto.length > 0 ) {
            const empresasTmp = this.state.empresasFiltrado.slice();
            const filteredItems = empresasTmp.filter( ( emp ) => {
                return emp.razon_social && emp.razon_social.toLowerCase().includes( texto.toLowerCase() );
            } );
            this.setState( {
                empresasFiltrado: filteredItems,
            } );
        } else {
            const empresasTmp = this.state.empresas.slice();
            this.setState( {
                empresasFiltrado: empresasTmp,
            } );
        }
    }

    render() {
        if ( this.props.info.jerarquia !== "administrador" && this.props.info.permisos.includes( 'reclutamiento' ) ) {
            let dataTable = null;
            let dataEdicion = null;
            let datosEmpresa = null;
            let filtrado = null;

            if ( this.state.empresasFiltrado ) {
                dataTable = this.renderingDataTable();
                filtrado = <Row>
                    <Col lg="3" sm="12" xs="12">
                        <FormGroup>
                            <Label for="razon">Busque por Razón Social:</Label>
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

            if ( this.state.empresaEditar ) {
                dataEdicion = this.renderEdicion();
            }

            if ( this.state.empresaVer ) {
                datosEmpresa = this.renderVerEmpresa();
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
                            <Button className="btn-feelrouk-naranja" onClick={ () => this.closeModal( 1 ) }>Cerrar</Button>
                        </ModalFooter>
                    </Modal>

                    <Modal className="modal-grande" isOpen={ this.state.modal2 } toggle={ () => { 
                        this.closeModal( 2 );
                    } }>
                        <ModalHeader
                            toggle={ () => { 
                                this.closeModal( 2 );
                            } }>Edición de empresa</ModalHeader>
                        <ModalBody>
                            { dataEdicion }
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
                            } }>Ver datos de la empresa</ModalHeader>
                        <ModalBody>
                            { datosEmpresa }
                        </ModalBody>
                        <ModalFooter>
                            <Button className="btn-feelrouk" onClick={ () => this.closeModal( 3 ) }>Cerrar</Button>
                        </ModalFooter>
                    </Modal>

                    <Row>
                        <Col>
                            <h2>Listado de Empresas</h2>
                        </Col>
                    </Row>
                    <Row className="justify-content-end">
                        <Col lg="2" sm="12" xs="12">
                            <CrearEmpresaHCM getEmpresas={ this.getEmpresas } empresas={ this.state.empresas } />
                        </Col>
                    </Row>
                    { filtrado }
                    <Row>
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
) )( ListadoEmpresas );
