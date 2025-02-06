/**
 * External Dependencies
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Spinner, Row, Col, Button, Modal, ModalFooter, ModalHeader, ModalBody, TabContent, TabPane, Nav, NavItem, 
    NavLink, FormGroup, Label, Input } from 'reactstrap';
import Icon from '../../components/icon';
import { MensajeBloqueo } from '../../components/no-permisos';
// import Select from 'react-select';
import classnames from 'classnames/dedupe';
import Select from 'react-select';

import DataTable from 'react-data-table-component';
import borrar from '../../../common-assets/images/vcm/x-circle.svg';
import edit from '../../../common-assets/images/vcm/edit.svg';

import CrearCategoriaTAG from '../../components/crear-categoria';
import CrearSubcategoriaTAG from '../../components/crear-subcategoria';
import CrearTAG from '../../components/crear-tag';
import { Link } from 'react-router-dom';
require( 'dotenv' ).config();
/**
 * Internal Dependencies
 */
import './style.scss';

/**
 * Component
 */
class ListadoTags extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            loading: false,
            activeTab: '1',
            icono: false,
            modal1: false,
            modal2: false,
            modal3: false,
            nombreError: '',
            relacionError: '',
            tagsGeneral: null,
            tagsCategoria: null,
            tagsSubcategoria: null,
            tagsFiltrados: null,
            todo: null,
            aModificar: null,
            aEliminar: null,
            relacion: null,
        };

        this.inputFileRef = React.createRef();
        this.openModal = this.openModal.bind( this );
        this.closeModal = this.closeModal.bind( this );
        this.toggleTabs = this.toggleTabs.bind( this );

        this.getTagsGenerales = this.getTagsGenerales.bind( this );
        this.separarTodo = this.separarTodo.bind( this );

        this.renderingDataTable = this.renderingDataTable.bind( this );
        this.renderTipo = this.renderTipo.bind( this );
        this.renderEscogida = this.renderEscogida.bind( this );
        this.renderEdicion = this.renderEdicion.bind( this );
        this.renderBotonesListado = this.renderBotonesListado.bind( this );
        this.filterDataTable = this.filterDataTable.bind( this );

        this.revisarYenviar = this.revisarYenviar.bind( this );
        this.chequearAntesDeEliminar = this.chequearAntesDeEliminar.bind( this );
        this.eliminarDefinitivamente = this.eliminarDefinitivamente.bind( this );
        this.sacarElementoDeLista = this.sacarElementoDeLista.bind( this );
    }

    componentDidMount() {
        this.getTagsGenerales();
    }

    // llamada API para traer todas las empresas
    async getTagsGenerales() {
        return axios.get( process.env.REACT_APP_DEVAPI + '/api/hcm/tags/getAll' ).then( ( res ) => {
            this.setState( { 
                todo: res.data.data,
                tagsFiltrados: res.data.data,
            }, () => {
                this.separarTodo();
            } );
        } );
    }

    separarTodo() {
        const categoria = [];
        const sub = [];
        const tags = [];

        this.state.todo.forEach( ( tag ) => {
            if ( tag.tipo === "tag" ) {
                tags.push( tag );
            } else if ( tag.tipo === "categoria" ) {
                categoria.push( tag );
            } else {
                sub.push( tag );
            }
        } );

        this.setState( {
            tagsGeneral: tags,
            tagsCategoria: categoria,
            tagsSubcategoria: sub,
        } );
    }

    toggleTabs( tab ) {
        if ( this.state.activeTab !== tab ) {
            this.setState( {
                activeTab: tab,
            } );
        }
    }

    // renderizamos la tabla con toda la data de tags seleccionados
    renderingDataTable() {
        const columns = [
            {
                name: 'Nombre',
                selector: row => row.nombre,
                sortable: true,
            },
            {
                name: 'Tipo',
                selector: row => this.renderTipo( row ),
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
                data={ this.state.tagsFiltrados }
                pagination
                paginationComponentOptions={ paginationComponentOptions }
            />
        );
    }

    renderTipo( row ) {
        if ( row.tipo === "subcategoria" ) {
            return 'Subcategoría de: ' + row.categoria.nombre;
        } else if ( row.tipo === "categoria" ) {
            return "Categoría";
        } else if ( row.tipo === "tag" ) {
            if ( row.relacion.length > 0 ) {
                return "Relación " + row.relacion[ 0 ].tipo;
            }

            return "Sin categoría";
        }
    }

    // renderizado de los botones de acción en la lista de tags (editar y eliminar)
    renderBotonesListado( row ) {
        return (
            <Fragment>
                <Button className="btn btn-datatable" onClick={ () => {
                    const temp = Object.assign( {}, row );
                    this.setState( {
                        aModificar: temp,
                        modal2: true,
                    } );
                } }>
                    <img alt="editar" style={ { width: "25px" } } src={ edit } />
                </Button>
                <Button className="btn btn-datatable" onClick={ () => {
                    const temp = Object.assign( {}, row );
                    this.setState( {
                        aEliminar: temp,
                        modal3: true,
                    } );
                } }>
                    <img alt="eliminar" style={ { width: "25px" } } src={ borrar } />
                </Button>
            </Fragment>
        );
    }

    // Aquí se revisa que todo esté bien antes de enviar a EDITAR
    revisarYenviar() {
        const data = {};

        if ( this.state.aModificar.nombre.length <= 0 ) {
            this.setState( {
                nombreError: "El nombre del tag no puede quedar vacío",
            } );
        }
        if ( this.state.relacion ) {
            data.id = this.state.aModificar.id;
            data.nombre = this.state.aModificar.nombre;
            data.rel_categoria = this.state.relacion;
            data.tipo = this.state.aModificar.tipo;
        } else {
            data.id = this.state.aModificar.id;
            data.nombre = this.state.aModificar.nombre;
            data.rel_categoria = this.state.aModificar.rel_categoria;
            data.tipo = this.state.aModificar.tipo;
        }
        this.setState( { loading: true } );

        axios.post( process.env.REACT_APP_DEVAPI + '/api/hcm/tags/editarTag', data ).then( ( res ) => {
            if ( res.data.ok ) {
                this.setState( {
                    loading: false,
                    relacion: null,
                    aModificar: null,
                    modal2: false,
                    mensajeAviso: "Tag editado satisfactoriamente.",
                    icono: true,
                }, () => {
                    this.openModal( 1 );
                    this.getTagsGenerales();
                } );
            } else {
                this.setState( { 
                    loading: false,
                    relacion: null,
                    aModificar: null,
                    modal2: false,
                    mensajeAviso: "Hubo un error editando el tag. Por favor contacte al administrador.",
                    icono: false,
                }, () => {
                    this.openModal( 1 );
                } );  
            }
        } );
    }

    chequearAntesDeEliminar() {
        this.setState( { loading: true } );
        const idCat = this.state.aEliminar.id;

        if ( this.state.aEliminar.tipo === "categoria" ) {
            let conteo = 0;
            this.state.todo.forEach( ( tag ) => {
                if ( tag.tipo === "tag" && tag.relacion.length > 0 ) {
                    if ( tag.relacion[ 0 ].tipo === "categoria" && tag.relacion[ 0 ].rel_categoria === idCat ) {
                        conteo++;
                    }
                } else if ( tag.tipo === "subcategoria" && tag.rel_categoria === idCat ) {
                    conteo++;
                }
            } );

            if ( conteo > 0 ) {
                this.setState( {
                    loading: false,
                    aEliminar: null,
                    modal3: false,
                    modal1: true,
                    mensajeAviso: "Existen otros tags usando ésta categoría. Primero elimine todas esas relaciones.",
                    icono: false,
                } );
                return;
            }

            const data = {
                id: this.state.aEliminar.id,
                tipo: this.state.aEliminar.tipo,
            };
            this.eliminarDefinitivamente( data );
        } else {
            const data = {
                id: this.state.aEliminar.id,
                tipo: this.state.aEliminar.tipo,
            };
            this.eliminarDefinitivamente( data );
        }
    }

    eliminarDefinitivamente( data ) {
        axios.post( process.env.REACT_APP_DEVAPI + '/api/hcm/tags/eliminarTag', data ).then( ( res ) => {
            if ( res.data.ok ) {
                this.setState( {
                    loading: false,
                    aEliminar: null,
                    modal3: false,
                    mensajeAviso: "Tag eliminado satisfactoriamente.",
                    icono: true,
                }, () => {
                    this.openModal( 1 );
                    if ( res.data.id ) {
                        this.sacarElementoDeLista( res.data.id );
                    } else {
                        this.getTagsGenerales();
                    }
                } );
            } else {
                this.setState( {
                    loading: false,
                    aEliminar: null,
                    modal3: false,
                    mensajeAviso: "Tag eliminado satisfactoriamente.",
                    icono: true,
                }, () => {
                    this.openModal( 1 );
                    if ( res.data.id ) {
                        this.sacarElementoDeLista( res.data.id );
                    } else {
                        this.getTagsGenerales();
                    }
                } ); 
            }
        } );
    }

    sacarElementoDeLista( id ) {
        const temp = this.state.todo.slice();
        const final = temp.filter( ( tag ) => {
            return tag.id !== id;
        } );

        this.setState( {
            todo: final,
        }, () => {
            this.separarTodo();
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
                aEliminar: null, 
            } );
            break;
        default:
            break;
        }
    }

    filterDataTable( texto ) {
        if ( texto.length > 0 ) {
            const todoTemp = this.state.todo.slice();
            const filteredItems = todoTemp.filter( ( emp ) => {
                return emp.nombre && emp.nombre.toLowerCase().includes( texto.toLowerCase() );
            } );
            this.setState( {
                tagsFiltrados: filteredItems,
            } );
        } else {
            const todoTemp = this.state.todo.slice();
            this.setState( {
                tagsFiltrados: todoTemp,
            } );
        }
    }

    renderEscogida( id ) {
        this.setState( {
            relacion: id,
            relacionError: '',
        } );
    }

    renderEdicion( tipo ) {
        if ( tipo === "categoria" ) {
            const { nombre } = this.state.aModificar;
            return (
                <Row className="mt-20 mr-10 ml-10">
                    <Col lg="12" xs="12">
                        <h2>Editar Categoría</h2>
                        <FormGroup>
                            <Label for="razonsocial">Nombre *</Label>
                            <Input type="text" 
                                name="razonsocial" 
                                className={ classnames( 'input-hcm-formulario', { 'is-invalid': this.state.nombreError } ) }
                                value={ nombre }
                                onChange={ ( e ) => {
                                    const nuevo = e.target.value.replace( /[`~!¨´@$%^&*°()¿¡_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                    const temp = Object.assign( {}, this.state.aModificar );
                                    temp.nombre = nuevo;

                                    this.setState( {
                                        aModificar: temp,
                                        nombreError: '',
                                    } );
                                } }
                            />
                            { this.state.nombreError ? (
                                <div className="invalid-feedback">{ this.state.nombreError }</div>
                            ) : '' }
                        </FormGroup>
                    </Col>
                    <Col lg="12" className="flex justify-content-center">
                        <Button className="btn-feelrouk-naranja2" 
                            onClick={ () => {
                                this.revisarYenviar();
                            } } 
                            disabled={ this.state.loading }
                        > 
                            Editar
                            { this.state.loading ? (
                                <Spinner />
                            ) : '' }
                        </Button>
                    </Col>
                </Row>
            );
        }
        if ( tipo === "subcategoria" ) {
            const { nombre } = this.state.aModificar;
            // poner todas las categorías acá
            const options = [];

            this.state.tagsCategoria.forEach( ( tag ) => {
                options.push( {
                    label: tag.nombre,
                    value: tag.id,
                } );
            } );

            const selectCategoria = <Select
                className="dropdown-feelrouk"
                name="escoja-categoria"
                options={ options }
                defaultValue={ { label: this.state.aModificar.categoria.nombre, value: this.state.aModificar.categoria.id } }
                onChange={ ( e ) => {
                    this.renderEscogida( e.value );
                } }
            />;

            return (
                <Row className="mt-20 mr-10 ml-10">
                    <Col lg="12" xs="12">
                        <h3>Editar subcategoría</h3>

                        <FormGroup>
                            <label className="carga-tag" htmlFor="creartag">
                                Nombre
                                <div>
                                    <input 
                                        className={ classnames( 'form-control', { 'is-invalid': this.state.nombreError } ) } 
                                        id="creartag" 
                                        name="crear-tag"
                                        value={ nombre }
                                        onChange={ ( e ) => {
                                            const nuevo = e.target.value.replace( /[`~!¨´@$%^&*°()¿¡_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                            const temp = Object.assign( {}, this.state.aModificar );
                                            temp.nombre = nuevo;

                                            this.setState( {
                                                aModificar: temp,
                                                nombreError: '',
                                            } );
                                        } } type="text" />
                                </div>
                            </label>
                            { this.state.nombreError ? (
                                <div className="invalid-feedback">{ this.state.nombreError }</div>
                            ) : '' }
                        </FormGroup>
                    </Col>
                    <Col lg="12" xs="12">
                        <FormGroup>
                            { selectCategoria }
                            <div className="mt-5"></div>
                            { this.state.relacionError ? (
                                <div className="invalid-feedback" style={ { display: 'block' } }>{ this.state.relacionError }</div>
                            ) : '' }
                        </FormGroup>
                    </Col>
                    <Col lg="12" className="flex justify-content-center">
                        <Button className="btn-feelrouk-naranja2" 
                            onClick={ () => {
                                this.revisarYenviar();
                            } } 
                            disabled={ this.state.loading }
                        > 
                            Editar
                            { this.state.loading ? (
                                <Spinner />
                            ) : '' }
                        </Button>
                    </Col>
                </Row>
            );
        }

        const { nombre } = this.state.aModificar;

        return (
            <Row className="mt-20 mr-10 ml-10">
                <Col lg="12" xs="12">
                    <h2>Editar Categoría</h2>
                    <FormGroup>
                        <Label for="razonsocial">Nombre *</Label>
                        <Input type="text" 
                            name="razonsocial" 
                            className={ classnames( 'input-hcm-formulario', { 'is-invalid': this.state.nombreError } ) }
                            value={ nombre }
                            onChange={ ( e ) => {
                                const nuevo = e.target.value.replace( /[`~!¨´@$%^&*°()¿¡_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                const temp = Object.assign( {}, this.state.aModificar );
                                temp.nombre = nuevo;

                                this.setState( {
                                    aModificar: temp,
                                    nombreError: '',
                                } );
                            } }
                        />
                        { this.state.nombreError ? (
                            <div className="invalid-feedback">{ this.state.nombreError }</div>
                        ) : '' }
                    </FormGroup>
                </Col>
                <Col lg="12" className="flex justify-content-center">
                    <Button className="btn-feelrouk-naranja2"
                        onClick={ () => {
                            this.revisarYenviar();
                        } } 
                        disabled={ this.state.loading }
                    > 
                        Editar
                        { this.state.loading ? (
                            <Spinner />
                        ) : '' }
                    </Button>
                </Col>
            </Row>
        );
    }

    render() {
        if ( this.props.info.jerarquia === "administrador" ) {
            let dataTable = null;
            let contenidoEdicion = null;
            let filtrado = null;

            if ( this.state.tagsFiltrados ) {
                dataTable = this.renderingDataTable();

                filtrado = <Col lg="5" sm="12" xs="12">
                    <FormGroup>
                        <Label for="razon">Búsqueda por nombre:</Label>
                        <Input type="text" 
                            name="razon" 
                            className="input-hcm-formulario"
                            onChange={ ( e ) => {
                                this.filterDataTable( e.target.value );
                            } }
                        />
                    </FormGroup>
                </Col>;
            }
            if ( this.state.aModificar ) {
                contenidoEdicion = this.renderEdicion( this.state.aModificar.tipo );
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

                    <Modal isOpen={ this.state.modal2 } toggle={ () => { 
                        this.closeModal( 2 );
                    } }>
                        <ModalHeader
                            toggle={ () => { 
                                this.closeModal( 2 );
                            } }>Edición de tags</ModalHeader>
                        <ModalBody>
                            <Row className="vertical-gap d-flex justify-content-center">
                                <div className="mt-30"></div>
                                { contenidoEdicion }
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button className="btn-feelrouk" onClick={ () => this.closeModal( 2 ) }>Cerrar</Button>
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
                                        <Icon name="dizzy" />
                                    </div>
                                    <h2>¿Está seguro que desea eliminar este elemento?</h2>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button className="btn-feelrouk-naranja" disabled={ this.state.loading } onClick={ this.chequearAntesDeEliminar }>Si</Button>
                            <Button className="btn-feelrouk" onClick={ () => this.closeModal( 3 ) }>No</Button>
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

                    <Row className="mb-20">
                        <Col className="ml-25 separador-bottom">
                            <div className="contenedor-flex">
                                <img src={ require( "../../../common-assets/images/hcm/price-tag.png" ) } alt="" />
                                <div className="contenedor-hijo">
                                    <h2>Mantenedor de Tags</h2>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row className="ml-20 mt-40">
                        <Col lg="4" sm="12" xs="12">
                            <Nav tabs>
                                <NavItem>
                                    <NavLink
                                        className={ classnames( { active: this.state.activeTab === '1' } ) }
                                        onClick={ () => this.toggleTabs( '1' ) }>
                                        Tags
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={ classnames( { active: this.state.activeTab === '2' } ) }
                                        onClick={ () => this.toggleTabs( '2' ) }>
                                        Categorías
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={ classnames( { active: this.state.activeTab === '3' } ) }
                                        onClick={ () => this.toggleTabs( '3' ) }>
                                        Subcategorías
                                    </NavLink>
                                </NavItem>
                            </Nav>
                            <TabContent activeTab={ this.state.activeTab }>
                                <TabPane tabId="1">
                                    <CrearTAG actualizarCategorias={ this.getTagsGenerales } />
                                </TabPane>
                                <TabPane tabId="2">
                                    <CrearCategoriaTAG actualizarCategorias={ this.getTagsGenerales } />
                                </TabPane>
                                <TabPane tabId="3">
                                    <CrearSubcategoriaTAG actualizarCategorias={ this.getTagsGenerales } />
                                </TabPane>
                            </TabContent>
                        </Col>
                        <Col lg="7" sm="12" xs="12">
                            <div>
                                { filtrado }
                            </div>
                            <div className="linea-central">
                                { dataTable }
                            </div>
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
) )( ListadoTags );
