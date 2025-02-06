/**
 * External Dependencies
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import classnames from 'classnames/dedupe';
// import { isValidEmail } from '../../utils';
import { Spinner, Row, Col, TabContent, TabPane, Nav, NavItem, 
    NavLink, Label, FormGroup, Input, Modal, ModalFooter, ModalHeader, ModalBody, Button } from 'reactstrap';
import Icon from '../../components/icon';
import Select from 'react-select';
import DataTable from 'react-data-table-component';
import edit from '../../../common-assets/images/vcm/edit.svg';
import borrar from '../../../common-assets/images/vcm/x-circle.svg';
import { MensajeBloqueo } from '../../components/no-permisos';

require( 'dotenv' ).config();
/**
 * Component
 */
class Content extends Component {
    constructor( props ) {
        super( props );
        this.renderingDataTable = this.renderingDataTable.bind( this );
        this.renderBotonesListado = this.renderBotonesListado.bind( this );
        this.toggleTabs = this.toggleTabs.bind( this );
        this.createEmpleado = this.createEmpleado.bind( this );
        this.sendNewEmpleado = this.sendNewEmpleado.bind( this );
        this.getAllPermisos = this.getAllPermisos.bind( this );
        this.getAllProfiles = this.getAllProfiles.bind( this );
        this.eliminarEmpleado = this.eliminarEmpleado.bind( this );
        this.eliminarFinalmente = this.eliminarFinalmente.bind( this );
        this.openModal = this.openModal.bind( this );
        this.closeModal = this.closeModal.bind( this );
        this.renderPerfiles = this.renderPerfiles.bind( this );
        this.editarTrabajador = this.editarTrabajador.bind( this );
        this.renderFormParaModificarTrabajador = this.renderFormParaModificarTrabajador.bind( this );
        this.guardarEmpleadoEditado = this.guardarEmpleadoEditado.bind( this );
        this.activarDesactivarPermisos = this.activarDesactivarPermisos.bind( this );
        this.preguntarPorPermisos = this.preguntarPorPermisos.bind( this );
        this.escogerPerfil = this.escogerPerfil.bind( this );

        this.state = {
            ok: false,
            dropDownValue: false,
            dropDownValue2: false,
            permisos: false,
            perfiles: false,
            empleados: null,
            nombreCliente: '',
            emailCliente: '',
            cargoCliente: '',
            perfilEscogido: false,
            loading: false,
            activeTab: "1",
            modal: false,
            modal2: false,
            modal3: false,
            modal4: false,
            esCreacion: true,
            mensajeAviso: '',
            icono: true,
            admins: null,
            todo: null,
            permisoEmpleado: {},
            clienteModificado: null,
            clienteAEliminar: null,
            actions: [
                'crear',
                'editar',
                'eliminar',
            ],
            nombreClienteError: '',
            correoError: '',
            cargoError: '',
        };
    }

    componentDidMount() {
        this.getAllPermisos().then( () => {
            this.getAllEmpleados();
            this.getAllProfiles();
        } );
    }

    getAllPermisos() {
        const email = this.props.info.email;
        return new Promise( ( resolve ) => {
            axios.get( process.env.REACT_APP_LOCAL + '/api/clientes/getByEmail/' + email ).then( ( res ) => {
                if ( res.data.ok ) {
                    this.setState( { 
                        ok: res.data.ok,
                        permisos: res.data.data,
                    } );
                    return resolve( true );
                }
            } );
        } );
    }

    getAllEmpleados() {
        if ( this.state.permisos.empresa ) {
            const idEmpresa = this.state.permisos.empresa.id;
            return axios.get( process.env.REACT_APP_LOCAL + '/api/clientes/getEmpleados/' + idEmpresa ).then( ( res ) => {
                const empleados = [];
                const admins = [];
                const todo = [];
                res.data.data.forEach( ( trabajador ) => {
                    if ( ! trabajador.cliente[ 0 ].is_admin ) {
                        empleados.push( trabajador );
                    } else {
                        admins.push( trabajador );
                    }
                    todo.push( trabajador );
                } );
                this.setState( { 
                    ok: res.data.ok,
                    empleados: empleados,
                    admins: admins,
                    todo: todo,
                } );
            } );
        }
    }

    getAllProfiles() {
        if ( this.state.permisos.empresa ) {
            const idEmpresa = this.state.permisos.empresa.id;
            return axios.get( process.env.REACT_APP_LOCAL + '/api/clientes/getProfiles/' + idEmpresa ).then( ( res ) => {
                this.setState( { 
                    ok: res.data.ok,
                    perfiles: res.data.data,
                } );
            } );
        }
    }

    // renderizamos la tabla con toda la data de perfiles
    renderingDataTable() {
        const columns = [
            {
                name: 'Nombre',
                selector: row => row.cliente[ 0 ].nombre,
                sortable: true,
            },
            {
                name: 'Email',
                selector: row => row.cliente[ 0 ].email,
                sortable: true,
            },
            {
                name: 'Cargo',
                selector: row => row.cliente[ 0 ].cargo,
                sortable: true,
            },
            {
                name: 'Permisos',
                selector: row => row.permisos[ 0 ].codigo.split( '-' ).join( ' ' ),
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
                data={ this.state.empleados }
                pagination
                paginationComponentOptions={ paginationComponentOptions }
            />
        );
    }

    // renderizado de los botones de acción - Perfiles
    renderBotonesListado( row ) {
        return (
            <Fragment>
                { row.cliente[ 0 ].active ? 
                    <button onClick={ () => this.preguntarPorPermisos( row.cliente[ 0 ] ) } className="btn btn-feelrouk-naranja">Deshabilitar</button> : 
                    <button onClick={ () => this.preguntarPorPermisos( row.cliente[ 0 ] ) } className="btn btn-feelrouk">Activar</button>
                }
                <button onClick={ () => this.eliminarEmpleado( row.cliente[ 0 ].id ) } className="btn btn-datatable">
                    <img alt="ver" style={ { width: "25px" } } src={ borrar } />
                </button> 
                <button onClick={ () => this.editarTrabajador( row ) } className="btn btn-datatable">
                    <img alt="editar" style={ { width: "25px" } } src={ edit } />
                </button>
            </Fragment>
        );
    }

    // llamada API para enviar la data al servidor (nueva empresa)

    async sendNewEmpleado() {
        // enviar finalmente toda la data
        // crear acá un hash para registrarlo con el código de una vez
        const data = {
            nombre: this.state.nombreCliente,
            email: this.state.emailCliente,
            cargo: this.state.cargoCliente,
            hash: this.state.emailCliente,
            active: true,
            isAdmin: false,
            rel_profile: this.state.perfilEscogido.id,
            rel_profileEmpresa: this.state.permisos.permisos.id,
            rel_company: this.state.permisos.empresa.id,
            section: 'trabajador',
            type: 'trabajador',
        };

        axios.post( process.env.REACT_APP_LOCAL + '/api/clientes/nuevoEmpleado', data ).then( ( res ) => {
            if ( res.data ) {
                this.setState( {
                    nombreCliente: '',
                    emailCliente: '',
                    cargoCliente: '',
                    section: '',
                    type: '',
                    loading: false,
                    mensajeAviso: 'Empleado creado satisfactoriamente',
                    icono: true,
                } );
                this.openModal( 1 );
                this.getAllEmpleados();
                // obtener de nuevo todas las empresas y renderizar en la lista del tab 2
            }
        } ).catch( ( e ) => {
            console.log( e );
            this.setState( {
                loading: false,
                mensajeAviso: 'No se pudo registrar el empleado. Intente de nuevo más tarde.',
                icono: false,
            } );
            this.openModal( 1 );
        } );
    }

    // comprobación general del formulario de creación de empresa, antes de enviar a la API

    createEmpleado() {
        // añadir comprobaciones acá
        let errores = 0;

        if ( this.state.loading ) {
            return;
        }

        if ( this.state.nombreCliente.length <= 0 ) {
            errores += 1;
            this.setState( {
                nombreClienteError: 'El nombre del empleado es obligatorio',
            } );
        }
        if ( this.state.cargoCliente.length <= 0 ) {
            errores += 1;
            this.setState( {
                cargoError: 'El cargo del empleado es obligatorio',
            } );
        }
        if ( this.state.emailCliente.length <= 0 ) {
            errores += 1;
            this.setState( {
                correoError: 'El correo del empleado es obligatorio',
            } );
        }
        if ( errores > 0 ) {
            return;
        }

        if ( ! this.state.perfilEscogido ) {
            this.setState( {
                mensajeAviso: 'Falta asignarle un perfil al empleado',
                icono: false,
            } );
            this.openModal( 1 );
            return;
        }

        // chequeamos que no exista otro usuario con el mismo correo
        const existe = this.state.todo.find( ( cliente ) => {
            return cliente.cliente[ 0 ].email === this.state.emailCliente;
        } );

        if ( existe ) {
            this.setState( {
                mensajeAviso: 'Ya existe otro usuario con el mismo correo',
                icono: false,
            } );
            this.openModal( 1 );
            // return;
        }

        // this.setState( {
        //     loading: true,
        // } );

        // this.sendNewEmpleado();
    }

    // llamada API para eliminar empleado

    eliminarEmpleado( idCliente ) {
        this.setState( {
            clienteAEliminar: idCliente,
        } );
        this.openModal( 3 );
    }

    eliminarFinalmente() {
        if ( this.state.clienteAEliminar ) {
            const data = {
                id: this.state.clienteAEliminar,
            };
            axios.post( process.env.REACT_APP_LOCAL + '/api/clientes/eliminarEmpleado', data ).then( ( res ) => {
                if ( res.data.ok ) {
                    this.closeModal( 3 );
                    this.getAllEmpleados();
                }
            } );
        }
    }

    preguntarPorPermisos( cliente ) {
        this.setState( {
            permisosEditar: cliente,
        } );

        this.openModal( 4 );
    }

    activarDesactivarPermisos() {
        this.closeModal( 4 );
        const cliente = Object.assign( {}, this.state.permisosEditar );
        const newStateActive = ! cliente.active;
        const data = {
            id: cliente.id,
            active: newStateActive, 
        };

        axios.post( process.env.REACT_APP_LOCAL + '/api/clientes/editarClienteActive', data ).then( ( res ) => {
            if ( res.data.ok ) {
                this.getAllEmpleados();
            }
        } );
    }

    // toggle de las tabs de empresas

    toggleTabs( tab ) {
        if ( this.state.activeTab !== tab ) {
            this.setState( {
                activeTab: tab,
            } );
        }
    }

    // Abrir/Cerrar modales (popup)

    // Abrir/Cerrar de todos los modales
    openModal( number ) {
        switch ( number ) {
        case 1:
            this.setState( { modal: true } );
            break;
        case 2:
            this.setState( { 
                modal2: true,
            } );
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
            this.setState( { 
                modal: false,
                mensajeAviso: '',
            } );

            break;
        case 2:
            this.setState( { 
                modal2: false,
            } );
            break;
        case 3:
            this.setState( { 
                modal3: false,
            } );
            break;
        case 4:
            this.setState( { 
                modal4: false,
                permisosEditar: null,
            } );
            break;
        default:
            break;
        }
    }

    renderPerfiles() {
        const { permisoEmpleado } = this.state;
        return (
            <FormGroup tag="fieldset">
                <legend>Permisos para el perfil:</legend>
                { 
                    this.state.actions.map( ( propiedad, index ) => {
                        return (
                            <FormGroup check key={ index + 12 }>
                                <Label check>
                                    <Input type="checkbox" id={ propiedad } onChange={ ( e ) => {
                                        permisoEmpleado[ propiedad ] = e.target.checked;
                                        const NuevoObj = Object.assign( {}, permisoEmpleado );
                                        this.setState( { permisoEmpleado: NuevoObj } );
                                    } } />{ ' ' }
                                    { propiedad }
                                </Label>
                            </FormGroup>
                        );
                    } )
                }
            </FormGroup>
        );
    }

    editarTrabajador( clienteAll ) {
        this.setState( { 
            clienteModificado: clienteAll,
        } );
        this.openModal( 2 );
    }

    renderFormParaModificarTrabajador() {
        const {
            clienteModificado,
        } = this.state;
        const perfiles = [];

        if ( this.state.clienteModificado && this.state.perfiles ) {
            this.state.perfiles.forEach( ( perfil ) => {
                perfiles.push( { value: perfil.id, label: perfil.nombre } );
            } );

            return (
                <Fragment>
                    <div>
                        <Select
                            className="dropdown-feelrouk"
                            name="escoja-perfil"
                            options={ perfiles }
                            defaultValue={ { label: "Seleccione un perfil", value: 0 } }
                            onChange={ ( e ) => {
                                this.escogerPerfil( e );
                            } }
                        />
                    </div>
                    <br></br>
                    <Row>
                        <Col lg="12">

                            <FormGroup>
                                <Label for="editEmpleadonombre">Nombre del empleado</Label>
                                <Input type="text" 
                                    name="editEmpleadonombre" 
                                    className="input-hcm-formulario"
                                    value={ clienteModificado.cliente[ 0 ].nombre }
                                    onChange={ ( e ) => {
                                        const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                        clienteModificado.cliente[ 0 ].nombre = nuevo;
                                        const data = Object.assign( {}, clienteModificado );
                                        this.setState( {
                                            clienteModificado: data,
                                        } );
                                    } }
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label for="clienteCorreoEdit">Email</Label>
                                <Input type="email"
                                    name="clienteCorreoEdit" 
                                    className="input-hcm-formulario"
                                    value={ clienteModificado.cliente[ 0 ].email }
                                    onChange={ ( e ) => {
                                        clienteModificado.cliente[ 0 ].email = e.target.value;
                                        const data = Object.assign( {}, clienteModificado );
                                        this.setState( {
                                            clienteModificado: data,
                                        } );
                                    } }
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label for="CargoEmpleadoEdit">Cargo del empleado</Label>
                                <Input type="text" 
                                    name="CargoEmpleadoEdit" 
                                    className="input-hcm-formulario"
                                    value={ clienteModificado.cliente[ 0 ].cargo }
                                    onChange={ ( e ) => {
                                        const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                        clienteModificado.cliente[ 0 ].cargo = nuevo;
                                        const data = Object.assign( {}, clienteModificado );
                                        this.setState( {
                                            clienteModificado: data,
                                        } );
                                    } }
                                />
                            </FormGroup>

                            <button
                                className="btn btn-feelrouk centrar-boton"
                                onClick={ this.guardarEmpleadoEditado }
                                disabled={ this.state.loading }
                            >
                                Guardar cambios
                                { this.state.loading ? (
                                    <Spinner />
                                ) : '' }
                            </button>
                        </Col> 
                    </Row> 
                </Fragment>
            );
        }
    }

    guardarEmpleadoEditado() {
        if ( ! this.state.perfilEscogido ) {
            this.setState( {
                mensajeAviso: 'Falta asignarle un perfil al empleado',
                icono: false,
            } );
            this.openModal( 1 );
            return;
        }
        if ( this.state.clienteModificado.cliente[ 0 ].nombre.length === 0 || 
            this.state.clienteModificado.cliente[ 0 ].email.length === 0 || 
            this.state.clienteModificado.cliente[ 0 ].cargo.length === 0 ) {
            this.setState( {
                mensajeAviso: 'Falta llenar todos los campos del formulario',
                icono: false,
            } );
            this.openModal( 1 );
            return;
        }
        const carg = this.state.clienteModificado.cliente[ 0 ].cargo.toLowerCase();
        const email = this.state.clienteModificado.cliente[ 0 ].email.toLowerCase();

        const data = {
            id: this.state.clienteModificado.cliente[ 0 ].id,
            nombre: this.state.clienteModificado.cliente[ 0 ].nombre,
            email: email,
            cargo: carg,
            nuevoPerfil: this.state.perfilEscogido.id,
        };
        axios.post( process.env.REACT_APP_LOCAL + '/api/clientes/editarEmpleado', data ).then( ( res ) => {
            if ( res.data.ok ) {
                this.setState( {
                    mensajeAviso: 'Empleado editado satisfactoriamente',
                    icono: true,
                } );
                this.closeModal( 2 );
                this.openModal( 1 );
                this.getAllEmpleados();
            }
        } );
    }

    escogerPerfil( e ) {
        const perfilId = e.value;
        const found = this.state.perfiles.find( ( perfil ) => {
            return perfil.id === perfilId;
        } );
        if ( found ) {
            this.setState( {
                perfilEscogido: found,
            } );
        }
    }

    render() {
        if ( this.props.info.jerarquia !== "administrador" ) {
            const { nombreCliente, emailCliente, cargoCliente } = this.state;
            let mensaje = null;
            const perfiles = [];
            // let perfilChosen = null;
            let empleados = null;
            let renderInputs = null;

            if ( this.state.mensajeAviso.length > 0 ) {
                mensaje = this.state.mensajeAviso;
            }
            if ( this.state.perfiles ) {
                this.state.perfiles.forEach( ( perfil ) => {
                    perfiles.push( { value: perfil.id, label: perfil.nombre } );
                } );
            }

            if ( this.state.empleados ) {
                empleados = this.renderingDataTable();
            }
            if ( this.state.clienteModificado ) {
                renderInputs = this.renderFormParaModificarTrabajador();
            }

            return (
                <Fragment>

                    <Modal isOpen={ this.state.modal } toggle={ this.closeModal }>
                        <ModalHeader
                            toggle={ this.closeModal }>Aviso</ModalHeader>
                        <ModalBody>
                            <Row className="vertical-gap d-flex justify-content-center">
                                <Col lg="10" className="justify-content-center text-centered">
                                    <div className="icon-container">
                                        { 
                                            this.state.icono ? <Icon name="check-circle" /> : <Icon name="dizzy" />
                                        }
                                    </div>
                                    <h2>{ mensaje }</h2>
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
                            } }>Edición de Empleados</ModalHeader>
                        <ModalBody>
                            <Row className="vertical-gap d-flex justify-content-center">
                                <Col lg="10" className="justify-content-center">
                                    { renderInputs }
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
                                        <Icon name="dizzy" />
                                    </div>
                                    <h2>¿Está seguro que desea eliminar el elemento?</h2>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button className="btn-feelrouk-naranja" onClick={ () => {
                                this.eliminarFinalmente();
                            } }>Continuar Eliminando</Button>
                            <Button className="btn-feelrouk" onClick={ () => this.closeModal( 3 ) }>No</Button>
                        </ModalFooter>
                    </Modal>

                    <Modal isOpen={ this.state.modal4 } toggle={ () => { 
                        this.closeModal( 4 );
                    } }>
                        <ModalHeader
                            toggle={ () => { 
                                this.closeModal( 4 );
                            } }>Aviso</ModalHeader>
                        <ModalBody>
                            <Row className="vertical-gap d-flex justify-content-center">
                                <Col lg="10" className="justify-content-center text-centered">
                                    <div className="icon-container">
                                        <Icon name="dizzy" />
                                    </div>
                                    <h2>¿Está seguro que desea modificar el permiso de este usuario?</h2>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button className="btn-feelrouk-naranja" onClick={ () => {
                                this.closeModal( 4 );
                                this.activarDesactivarPermisos();
                            } }>Continuar</Button>
                            <Button className="btn-feelrouk" onClick={ () => this.closeModal( 4 ) }>No</Button>
                        </ModalFooter>
                    </Modal>

                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={ classnames( { active: this.state.activeTab === '1' } ) }
                                onClick={ () => this.toggleTabs( '1' ) }>
                                Crear empleado
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={ classnames( { active: this.state.activeTab === '2' } ) }
                                onClick={ () => this.toggleTabs( '2' ) }>
                                Ver empleados registrados
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={ this.state.activeTab }>
                        <TabPane tabId="1">
                            <Row className="mt-30 d-flex">
                                <Col lg="6" className="justify-content-center">
                                    <h2>Crear nuevo empleado</h2>

                                    <div className="container-form-staff">

                                        <FormGroup>
                                            <Label for="nombreEmpresa">Nombre del empleado</Label>
                                            <Input type="text" 
                                                name="jerarquia" 
                                                className={ classnames( 'input-hcm-formulario', { 'is-invalid': this.state.nombreClienteError } ) }
                                                value={ nombreCliente }
                                                onChange={ ( e ) => {
                                                    const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                                    this.setState( {
                                                        nombreCliente: nuevo,
                                                        nombreClienteError: '',
                                                    } );
                                                } }
                                            />
                                            { this.state.nombreClienteError.length > 0 ? (
                                                <div className="invalid-feedback">{ this.state.nombreClienteError }</div>
                                            ) : '' }
                                        </FormGroup>

                                        <FormGroup>
                                            <Label for="clienteEmail">Email</Label>
                                            <Input type="email" 
                                                name="clienteEmail" 
                                                className={ classnames( 'input-hcm-formulario', { 'is-invalid': this.state.correoError } ) }
                                                value={ emailCliente }
                                                onChange={ ( e ) => {
                                                    this.setState( {
                                                        emailCliente: e.target.value,
                                                        correoError: '',
                                                    } );
                                                } }
                                            />
                                            { this.state.correoError.length > 0 ? (
                                                <div className="invalid-feedback">{ this.state.correoError }</div>
                                            ) : '' }
                                        </FormGroup>

                                        <FormGroup>
                                            <Label for="CargoEmpleado">Cargo del empleado</Label>
                                            <Input type="text" 
                                                name="CargoEmpleado" 
                                                className={ classnames( 'input-hcm-formulario', { 'is-invalid': this.state.cargoError } ) }
                                                value={ cargoCliente }
                                                onChange={ ( e ) => {
                                                    const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                                    this.setState( {
                                                        cargoCliente: nuevo,
                                                        cargoError: '',
                                                    } );
                                                } }
                                            />
                                            { this.state.cargoError.length > 0 ? (
                                                <div className="invalid-feedback">{ this.state.cargoError }</div>
                                            ) : '' }
                                        </FormGroup>

                                        <button
                                            className="btn btn-primary justify-content-center btn-feelrouk"
                                            onClick={ this.createEmpleado }
                                            disabled={ this.state.loading }
                                        >
                                            Crear Empleado
                                            { this.state.loading ? (
                                                <Spinner />
                                            ) : '' }
                                        </button>
                                    </div>
                                </Col>
                                <Col lg="3" className="justify-content-center">
                                    <Select
                                        className="dropdown-feelrouk"
                                        name="escoja-empresa"
                                        options={ perfiles }
                                        defaultValue={ { label: "Seleccione un perfil", value: 0 } }
                                        onChange={ ( e ) => {
                                            this.escogerPerfil( e );
                                        } }
                                    />
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tabId="2">
                            <Row className="mt-30">
                                <Col>
                                    <h2>Lista de empleados registrados</h2>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    { empleados }
                                </Col>
                            </Row>
                        </TabPane>
                    </TabContent>
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
) )( Content );
