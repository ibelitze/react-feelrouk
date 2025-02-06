/**
 * External Dependencies
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import classnames from 'classnames/dedupe';
// import { isValidEmail } from '../../utils';
import { Spinner, Row, Col, Label, TabContent, Input, FormGroup, 
    TabPane, Nav, NavItem, NavLink, Modal, ModalFooter, ModalHeader, ModalBody, Button } from 'reactstrap';
import Select from 'react-select';
import { MensajeBloqueo } from '../../components/no-permisos';

import DataTable from 'react-data-table-component';
import Icon from '../../components/icon';
import edit from '../../../common-assets/images/vcm/edit.svg';

require( 'dotenv' ).config();

/**
 * Component
 */
class Content extends Component {
    constructor( props ) {
        super( props );

        this.renderingDataTable = this.renderingDataTable.bind( this );
        this.renderBotonesListado = this.renderBotonesListado.bind( this );
        this.crearNuevoUsuario = this.crearNuevoUsuario.bind( this );
        this.getAllCompanies = this.getAllCompanies.bind( this );
        this.getAllClientes = this.getAllClientes.bind( this );
        this.getAllDepartamentos = this.getAllDepartamentos.bind( this );
        this.getUsersByCompany = this.getUsersByCompany.bind( this );
        this.addEmpresa = this.addEmpresa.bind( this );
        this.addPerfil = this.addPerfil.bind( this );
        this.createUser = this.createUser.bind( this );
        this.activarDesactivarUsuario = this.activarDesactivarUsuario.bind( this );
        this.toggleDropdown = this.toggleDropdown.bind( this );
        this.toggleDropdown2 = this.toggleDropdown2.bind( this );
        this.toggleDropdown3 = this.toggleDropdown3.bind( this );
        this.toggleDropdown4 = this.toggleDropdown4.bind( this );
        this.toggleDropdown5 = this.toggleDropdown5.bind( this );
        this.openModal = this.openModal.bind( this );
        this.closeModal = this.closeModal.bind( this );
        this.editarCliente = this.editarCliente.bind( this );
        this.renderEdicionCliente = this.renderEdicionCliente.bind( this );
        this.guardarCambios = this.guardarCambios.bind( this );
        this.preguntarPorPermisos = this.preguntarPorPermisos.bind( this );
        this.setEmpresa = this.setEmpresa.bind( this );
        this.escogerDepartamento = this.escogerDepartamento.bind( this );

        this.state = {
            ok: false,
            modal1: false,
            modal2: false,
            modal3: false,
            empresaEscogida: '',
            empresaEscogida1: '',
            empresaEscogidaparaCarta: null,
            empresaEscogidaparaCarta2: null,
            perfilEscogido: '',
            perfilEscogido2: '',
            empresas: false,
            usuarios: null,
            perfiles: null,
            allClientes: false,
            clientes: false,
            nombre: '',
            cargo: '',
            codigoEmpresa: '',
            email: '',
            company: '',
            escogida: '',
            escogida2: '',
            perfil: '',
            relCompany: '',
            loading: false,
            dropDownValue: false,
            dropDownValue2: false,
            dropDownValue3: false,
            dropDownValue4: false,
            dropDownValue5: false,
            clienteEditado: null,
            activeTab: "1",
            mensajeAviso: '',
            icono: false,
            permisosEditar: null,
            departamentos: null,
            departamentoEscogido: null,
            nombreError: '',
            cargoError: '',
            correoError: '',
        };
    }

    componentDidMount() {
        this.getAllCompanies();
        this.getAllClientes();
    }

    getAllCompanies() {
        return axios.get( process.env.REACT_APP_DEVAPI + '/api/company/getAll' ).then( ( res ) => {
            this.setState( { 
                ok: res.data.ok,
                empresas: res.data.data,
            } );
        } );
    }

    getAllDepartamentos( id ) {
        const data = {
            empresa: id,
        };
        return axios.post( process.env.REACT_APP_DEVAPI + '/api/departamentos/getAll', data ).then( ( res ) => {
            this.setState( { 
                ok: res.data.ok,
                departamentos: res.data.departamentos,
            } );
        } );
    }

    getAllClientes() {
        return axios.get( process.env.REACT_APP_DEVAPI + '/api/clientes/getAll' ).then( ( res ) => {
            const allClientes = res.data.data;
            const finalResult = allClientes.filter( ( cliente ) => {
                return cliente.cliente[ 0 ].is_admin;
            } );
            this.setState( { 
                ok: res.data.ok,
                allClientes: finalResult,
            } );
            if ( this.state.empresas && this.state.empresaEscogida ) {
                const id = this.state.empresaEscogida;
                this.getUsersByCompany( id );
            }
        } );
    }

    renderingDataTable() {
        const columns = [
            {
                name: 'Nombre de la empresa',
                selector: row => row.empresa[ 0 ].nombre,
                sortable: true,
            },
            {
                name: 'Cliente',
                selector: row => row.cliente[ 0 ].nombre,
                sortable: true,
            },
            {
                name: 'Email',
                selector: row => row.cliente[ 0 ].email,
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
                data={ this.state.clientes }
                pagination
                paginationComponentOptions={ paginationComponentOptions }
            />
        );
    }

    renderBotonesListado( row ) {
        return (
            <Fragment>
                { row.cliente[ 0 ].active ? 
                    <button onClick={ () => this.preguntarPorPermisos( Object.assign( {}, row ) ) } className="btn btn-feelrouk-naranja">Deshabilitar</button> : 
                    <button onClick={ () => this.preguntarPorPermisos( Object.assign( {}, row ) ) } className="btn btn-feelrouk">Habilitar</button> 
                } <button onClick={ () => this.editarCliente( Object.assign( {}, row ) ) } className="btn btn-datatable">
                    <img alt="editar" style={ { width: "25px" } } src={ edit } />
                </button>
            </Fragment>
        );
    }

    setEmpresa( empress ) {
        const empr = this.state.empresas.find( ( emp ) => {
            return emp.id === empress.value;
        } );

        if ( empr ) {
            this.setState( {
                empresaEscogida1: empr.id,
                departamentoEscogido: null,
            } );
        }

        this.getAllDepartamentos( empress.value );
    }

    getUsersByCompany( e ) {
        if ( e !== 0 ) {
            const empr = this.state.empresas.find( ( emp ) => {
                return emp.id === e.value;
            } );

            if ( empr ) {
                this.setState( {
                    empresaEscogida: empr.id,
                } );
            }

            if ( this.state.allClientes && this.state.allClientes.length > 0 ) {
                const clientes = this.state.allClientes.filter( ( cliente ) => {
                    return cliente.rel_company === e.value;
                } );

                this.setState( {
                    clientes: clientes,
                } );
            }
        }
    }

    addEmpresa( company ) {
        this.setState( { 
            relCompany: company.id,
            company: company.id,
            escogida: company.nombre,
            empresaEscogida1: company.id,
        } );
        // poner acá renderización de perfiles
        this.getProfilesById( company.id );
    }

    addPerfil( perfil ) {
        this.setState( { 
            perfilEscogido: perfil.nombre,
            perfil: perfil,
            codigoPerfil: perfil.cod,
        } );
    }

    crearNuevoUsuario() {
        // generar aquí el id de los permisos de la empresa
        const emp = this.state.empresas.filter( ( empresa ) => {
            return empresa.id === this.state.empresaEscogida1;
        } );

        const email = this.state.email.toLowerCase();
        const carg = this.state.cargo.toLowerCase();

        const data = {
            company_id: this.state.empresaEscogida1,
            rel_profile: emp[ 0 ].permisos[ 0 ].id,
            departamento: this.state.departamentoEscogido.id,
            nombre: this.state.nombre,
            cargo: carg,
            email: email,
            isAdmin: true,
            section: 'nada',
            type: 'nada',
        };

        axios.post( process.env.REACT_APP_DEVAPI + '/api/clientes/nuevoCliente', data ).then( ( res ) => {
            if ( res.data.ok ) {
                this.setState( {
                    loading: false,
                    empresas: false,
                    allClientes: false,
                    departamentoEscogido: null,
                    company_id: '',
                    rel_profile: '',
                    nombre: '',
                    cargo: '',
                    email: '',
                    mensajeAviso: 'Usuario creado satisfactoriamente',
                    icono: true,
                } );
                this.openModal( 1 );
                this.getAllCompanies();
                this.getAllClientes();
            }
        } ).catch( ( e ) => {
            console.log( e );
            this.setState( {
                loading: false,
                mensajeAviso: 'Usuario no se pudo crear. Intente de nuevo más tarde',
                icono: false,
            } );
            this.openModal( 1 );
        } );
    }

    createUser() {
        // todas las comprobaciones acá
        let errores = 0;

        if ( this.state.loading ) {
            return;
        }
        if ( this.state.nombre.length <= 0 ) {
            errores += 1;
            this.setState( {
                nombreError: 'El nombre del nuevo cliente es obligatorio',
            } );
        }
        if ( this.state.email.length <= 0 ) {
            errores += 1;
            this.setState( {
                correoError: 'El correo del nuevo cliente es obligatorio',
            } );
        }
        if ( this.state.cargo.length <= 0 ) {
            errores += 1;
            this.setState( {
                cargoError: 'El cargo del nuevo cliente es obligatorio',
            } );
        }

        if ( errores > 0 ) {
            return;
        }

        if ( this.state.empresaEscogida1.length <= 0 ) {
            this.setState( {
                mensajeAviso: 'Por favor, escoja una empresa',
                icono: false,
            } );
            this.openModal( 1 );
            return;
        }
        if ( ! this.state.departamentoEscogido ) {
            this.setState( {
                mensajeAviso: 'Por favor, escoja un departamento. Si no existe ningún departamento en la lista entonces debe crear uno primero.',
                icono: false,
            } );
            this.openModal( 1 );
            return;
        }
        const found = this.state.allClientes.find( ( cliente ) => {
            return cliente.cliente[ 0 ].email === this.state.email;
        } );

        if ( found ) {
            this.setState( {
                mensajeAviso: 'El email ya está usado, por favor escoja otro',
                icono: false,
            } );
            this.openModal( 1 );
            return;
        }

        this.setState( {
            loading: true,
        } );

        this.crearNuevoUsuario();
    }

    getProfilesById( id ) {
        this.setState( {
            empresaEscogida1: id,
        } );
        return axios.get( process.env.REACT_APP_DEVAPI + '/api/company/getProfiles/' + id ).then( ( res ) => {
            this.setState( { 
                ok: res.data.ok,
                perfiles: res.data.profiles,
            } );
        } );
    }

    preguntarPorPermisos( cliente ) {
        this.setState( {
            permisosEditar: cliente,
        } );

        this.openModal( 3 );
    }

    activarDesactivarUsuario() {
        const cliente = Object.assign( {}, this.state.permisosEditar.cliente[ 0 ] );
        const newStateActive = ! cliente.is_admin;
        const data = {
            id: cliente.id,
            active: newStateActive,
        };
        axios.post( process.env.REACT_APP_DEVAPI + '/api/clientes/editarCliente', data ).then( ( res ) => {
            if ( res.data.ok ) {
                this.closeModal( 3 );
                this.setState( {
                    allClientes: false,
                    loading: false,
                    permisosEditar: null,
                    mensajeAviso: 'El Usuario ha dejado de ser admin de esta empresa. Ya no se listará dentro de los admins.',
                    icono: true,
                } );
                this.openModal( 1 );
                this.getAllCompanies();
                this.getAllClientes();
            }
        } );
    }

    editarCliente( cliente ) {
        this.setState( { clienteModificado: cliente.cliente[ 0 ] } );
        this.openModal( 2 );
    }

    renderEdicionCliente() {
        const { clienteModificado } = this.state;

        return (
            <div className="container-form-staff">
                <h2>Modificación de datos del cliente</h2>

                <FormGroup>
                    <Label for="Nombre">Nombre del cliente</Label>
                    <Input type="text" 
                        name="Nombre" 
                        className="input-hcm-formulario"
                        value={ clienteModificado.nombre }
                        onChange={ ( e ) => {
                            const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                            clienteModificado.nombre = nuevo;
                            const dato = Object.assign( {}, clienteModificado );
                            this.setState( {
                                clienteModificado: dato,
                            } );
                        } }
                    />
                </FormGroup>

                <FormGroup>
                    <Label for="Cargo">Cargo</Label>
                    <Input type="text" 
                        name="Cargo" 
                        className="input-hcm-formulario"
                        value={ clienteModificado.cargo }
                        onChange={ ( e ) => {
                            const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                            clienteModificado.cargo = nuevo;
                            const dato = Object.assign( {}, clienteModificado );
                            this.setState( {
                                clienteModificado: dato,
                            } );
                        } }
                    />
                </FormGroup>

                <FormGroup>
                    <Label for="email">Email</Label>
                    <Input type="email" 
                        name="email" 
                        className="input-hcm-formulario"
                        value={ clienteModificado.email }
                        onChange={ ( e ) => {
                            clienteModificado.email = e.target.value;
                            const dato = Object.assign( {}, clienteModificado );
                            this.setState( {
                                clienteModificado: dato,
                            } );
                        } }
                    />
                </FormGroup>

                <br></br>

                <button
                    className="btn btn-feelrouk centrar-boton"
                    onClick={ this.guardarCambios }
                    disabled={ this.state.loading }>
                    Guardar cambios
                    { this.state.loading ? (
                        <Spinner />
                    ) : '' }
                </button>
            </div>
        );
    }

    guardarCambios() {
        const nombre = this.state.clienteModificado.nombre.toLowerCase();
        const carg = this.state.clienteModificado.cargo.toLowerCase();
        const ema = this.state.clienteModificado.email.toLowerCase();

        const data = {
            id: this.state.clienteModificado.id,
            nombre: nombre,
            cargo: carg,
            email: ema,
        };
        axios.post( process.env.REACT_APP_DEVAPI + '/api/clientes/editarDatosCliente', data ).then( ( res ) => {
            if ( res.data.ok ) {
                this.setState( {
                    loading: false,
                    modal2: false,
                    clienteModificado: null,
                    mensajeAviso: 'Cliente editado satisfactoriamente',
                    icono: true,
                } );
                this.openModal( 1 );
                this.getAllCompanies();
                this.getAllClientes();
            }
        } ).catch( ( e ) => {
            console.log( e );
            this.setState( {
                loading: false,
                modal2: false,
                clienteModificado: null,
                mensajeAviso: 'Cliente no se pudo editar. Intente de nuevo más tarde',
                icono: false,
            } );
            this.openModal( 1 );
        } );
    }

    toggleDropdown() {
        const stat = ! this.state.dropDownValue;
        this.setState( { dropDownValue: stat } );
    }
    toggleDropdown2() {
        const stat = ! this.state.dropDownValue2;
        this.setState( { dropDownValue2: stat } );
    }
    toggleDropdown3() {
        const stat = ! this.state.dropDownValue3;
        this.setState( { dropDownValue3: stat } );
    }
    toggleDropdown4() {
        const stat = ! this.state.dropDownValue4;
        this.setState( { dropDownValue4: stat } );
    }

    toggleDropdown5() {
        const stat = ! this.state.dropDownValue5;
        this.setState( { dropDownValue5: stat } );
    }

    toggleTabs( tab ) {
        if ( this.state.activeTab !== tab ) {
            this.setState( {
                activeTab: tab,
            } );
        }
    }

    openModal( number ) {
        switch ( number ) {
        case 1:
            this.setState( { modal: true } );
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
            this.setState( { 
                modal: false,
                mensajeAviso: '',
            } );
            break;
        case 2:
            this.setState( { modal2: false } );
            break;
        case 3:
            this.setState( { 
                modal3: false,
                permisosEditar: null,
            } );
            break;
        default:
            break;
        }
    }

    escogerDepartamento( depart ) {
        const departamento = this.state.departamentos.find( ( depa ) => {
            return depa.id === depart.value;
        } );
        if ( departamento ) {
            this.setState( {
                departamentoEscogido: departamento,
            } );
        }
    }

    render() {
        if ( this.props.info.jerarquia === "administrador" ) {
            const {
                nombre,
                email,
                cargo,
            } = this.state;

            const empresasParaVerUsuarios = [];
            let clientes = null;
            const empresasParaCrearUsuario = [];
            let edicionCliente = null;
            const departamentos = [];
            let escogerDepartamento = null;

            // renderizando los dropdowns
            if ( this.state.empresas ) {
                // array empresas para obtener perfiles y activarlos / desactivarlos
                this.state.empresas.forEach( ( empresa ) => {
                    empresasParaVerUsuarios.push( { value: empresa.id, label: empresa.nombre } );
                    empresasParaCrearUsuario.push( { value: empresa.id, label: empresa.nombre } );
                } );
            }

            // renderizando las tablas con los clientes en general (todas las empresas primero)
            if ( this.state.clientes ) {
                clientes = this.renderingDataTable();
            }
            // renderizado de la edición del cliente (popup)
            if ( this.state.clienteModificado ) {
                edicionCliente = this.renderEdicionCliente();
            }
            // 
            if ( this.state.departamentos ) {
                this.state.departamentos.forEach( ( depa ) => {
                    departamentos.push( { value: depa.id, label: depa.nombre } );
                } );
            }
            // renderizado del select de los departamentos (una vez escogida la empresa)
            if ( this.state.empresaEscogida1 ) {
                escogerDepartamento = <Fragment>
                    <Select
                        className="dropdown-feelrouk"
                        name="escoja-empresa"
                        options={ departamentos }
                        defaultValue={ { label: "Seleccione un departamento", value: 0 } }
                        onChange={ ( e ) => {
                            this.escogerDepartamento( e );
                        } }
                    />
                </Fragment>;
            }

            return (
                <Fragment>

                    <Modal isOpen={ this.state.modal } toggle={ () => this.closeModal( 1 ) }>
                        <ModalHeader
                            toggle={ () => this.closeModal( 1 ) }>Aviso</ModalHeader>
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
                            } }>Editar cliente admin</ModalHeader>
                        <ModalBody>
                            <Row className="vertical-gap d-flex justify-content-center">
                                <Col lg="10" className="justify-content-center">
                                    { edicionCliente }
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
                                    <h2>¿Está seguro que desea modificar el status de este cliente?</h2>
                                    <p>Si hace click en continuar el usuario a dejará de ser admin de la empresa y se eliminará de la tabla.</p>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button className="btn-feelrouk-naranja" onClick={ () => {
                                this.activarDesactivarUsuario();
                            } }>Continuar</Button>
                            <Button className="btn-feelrouk" onClick={ () => this.closeModal( 3 ) }>No</Button>
                        </ModalFooter>
                    </Modal>

                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={ classnames( { active: this.state.activeTab === '1' } ) }
                                onClick={ () => this.toggleTabs( '1' ) }>
                                Crear Clientes
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={ classnames( { active: this.state.activeTab === '2' } ) }
                                onClick={ () => this.toggleTabs( '2' ) }>
                                Ver clientes
                            </NavLink>
                        </NavItem>
                    </Nav>

                    <TabContent activeTab={ this.state.activeTab }>
                        <TabPane tabId="1">
                            <Row className="vertical-gap d-flex">
                                <Col lg="7">
                                    <div>
                                        <h2>Crear nuevo Cliente de Feelrouk</h2>
                                    </div>
                                    <div>
                                        <FormGroup>
                                            <Label for="nombreUsuario">Nombre del cliente</Label>
                                            <Input type="text" 
                                                name="nombreUsuario" 
                                                className={ classnames( 'input-hcm-formulario', { 'is-invalid': this.state.nombreError } ) }
                                                value={ nombre }
                                                onChange={ ( e ) => {
                                                    const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                                    this.setState( {
                                                        nombre: nuevo,
                                                        nombreError: '',
                                                    } );
                                                } }
                                            />
                                            { this.state.nombreError.length > 0 ? (
                                                <div className="invalid-feedback">{ this.state.nombreError }</div>
                                            ) : '' }
                                        </FormGroup>

                                        <FormGroup>
                                            <Label for="cargo">Cargo que desempeña</Label>
                                            <Input type="text" 
                                                name="cargo" 
                                                className={ classnames( 'input-hcm-formulario', { 'is-invalid': this.state.cargoError } ) }
                                                value={ cargo }
                                                onChange={ ( e ) => {
                                                    const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                                    this.setState( {
                                                        cargo: nuevo,
                                                        cargoError: '',
                                                    } );
                                                } }
                                            />
                                            { this.state.cargoError.length > 0 ? (
                                                <div className="invalid-feedback">{ this.state.cargoError }</div>
                                            ) : '' }
                                        </FormGroup>

                                        <FormGroup>
                                            <Label for="Email">Correo electrónico</Label>
                                            <Input type="text" 
                                                name="Email" 
                                                className={ classnames( 'input-hcm-formulario', { 'is-invalid': this.state.correoError } ) }
                                                value={ email }
                                                onChange={ ( e ) => {
                                                    const nuevo = e.target.value.replace( /[`~!¨´#$%^&*°()¿¡|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '' );
                                                    this.setState( {
                                                        email: nuevo,
                                                        correoError: '',
                                                    } );
                                                } }
                                            />
                                            { this.state.correoError.length > 0 ? (
                                                <div className="invalid-feedback">{ this.state.correoError }</div>
                                            ) : '' }
                                        </FormGroup>
                                    </div>
                                </Col>

                                <Col lg="3" className="justify-content-center">
                                    <div>
                                        <Label for="empleados-crear">Escoja la empresa</Label>
                                        <Select
                                            className="dropdown-feelrouk"
                                            name="escoja-empresa"
                                            options={ empresasParaCrearUsuario }
                                            defaultValue={ { label: "Seleccione una empresa", value: 0 } }
                                            onChange={ ( e ) => {
                                                this.setEmpresa( e );
                                            } }
                                        />
                                        <br></br>
                                        { escogerDepartamento }
                                    </div>
                                </Col>
                            </Row>
                            <Row className="justify-content-end">
                                <Col lg="3" sm="12" xs="12">
                                    <button
                                        className="btn btn-feelrouk mt-8 justify-content-center"
                                        onClick={ this.createUser }
                                        disabled={ this.state.loading }>
                                        Crear Cliente
                                        { this.state.loading ? (
                                            <Spinner />
                                        ) : '' }
                                    </button>
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tabId="2">
                            <Row>
                                <Col>
                                    <h2>Información de clientes admin registrados</h2>
                                </Col>
                            </Row>
                            <Row className="vertical-gap d-flex">
                                <Col lg="4" sm="12" xs="12" className="justify-content-center">
                                    <Label for="empleados-ver">Escoja la empresa</Label>
                                    <Select
                                        className="dropdown-feelrouk"
                                        name="escoja-empresa"
                                        options={ empresasParaVerUsuarios }
                                        defaultValue={ { label: "Seleccione una empresa", value: 0 } }
                                        onChange={ ( e ) => {
                                            this.getUsersByCompany( e );
                                        } }
                                    />
                                </Col>
                            </Row>
                            <br></br>
                            <Row>
                                { clientes }
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
