/**
 * External Dependencies
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import classnames from 'classnames/dedupe';
import { isValidEmail } from '../../utils';
import { Row, Col, Spinner, Label, Input, FormGroup, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import DataTable from 'react-data-table-component';
import { MensajeBloqueo } from '../../components/no-permisos';
require( 'dotenv' ).config();

/**
 * Internal Dependencies
 */
// import Snippet from '../../components/snippet';

/**
 * Component
 */
class Content extends Component {
    constructor( props ) {
        super( props );
        this.toggleTabs = this.toggleTabs.bind( this );
        this.renderingDataTable = this.renderingDataTable.bind( this );
        this.checkEmail = this.checkEmail.bind( this );
        this.checkNombre = this.checkNombre.bind( this );
        this.checkJerarquia = this.checkJerarquia.bind( this );
        this.createStaff = this.createStaff.bind( this );
        this.sendNewStaff = this.sendNewStaff.bind( this );
        this.getAll = this.getAll.bind( this );
        this.state = {
            activeTab: '1',
            ok: false,
            usuarios: false,
            nombre: '',
            email: '',
            jerarquia: '',
            emailError: '',
            nombreError: '',
            jerarquiaError: '',
            loading: false,
        };
    }

    componentDidMount() {
        this.getAll();
    }

    getAll() {
        return axios.get( process.env.REACT_APP_DEVAPI + '/api/staffs/getAll' ).then( ( res ) => {
            this.setState( { 
                ok: res.data.ok,
                usuarios: res.data.staffs,
            } );
        } );
    }

    // renderizamos la tabla con toda la data de perfiles
    renderingDataTable() {
        const columns = [
            {
                name: 'Nombre',
                selector: row => row.nombre,
                sortable: true,
            },
            {
                name: 'Email',
                selector: row => row.email,
                sortable: true,
            },
            {
                name: 'Jerarquía',
                selector: row => row.jerarquia,
                sortable: true,
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
                data={ this.state.usuarios }
                pagination
                paginationComponentOptions={ paginationComponentOptions }
            />
        );
    }

    async sendNewStaff() {
        const email = this.state.email.toLowerCase();
        const jerar = this.state.jerarquia.toLowerCase();

        const data = { 
            nombre: this.state.nombre,
            email: email,
            jerarquia: jerar,
        };
        axios.post( process.env.REACT_APP_DEVAPI + '/api/staffs/nuevo', data ).then( ( res ) => {
            if ( res.data.ok ) {
                this.setState( {
                    loading: false,
                } );
                this.setState( {
                    nombre: '',
                    email: '',
                    jerarquia: '',
                } );
                this.getAll();
            }
        } ).catch( ( e ) => {
            console.log( e );
        } );
    }

    checkEmail() {
        const isValid = this.state.email && isValidEmail( this.state.email );

        this.setState( {
            emailError: isValid ? '' : 'Formato de email inválido',
        } );

        return isValid;
    }

    checkNombre() {
        const isValid = this.state.nombre.length > 0;

        this.setState( {
            nombreError: isValid ? '' : 'Debe escribir un nombre',
        } );

        return isValid;
    }

    checkJerarquia() {
        const isValid = this.state.jerarquia.length > 0;

        this.setState( {
            jerarquiaError: isValid ? '' : 'Debe escribir un cargo o jerarquia',
        } );

        return isValid;
    }

    createStaff() {
        if ( this.state.loading ) {
            return;
        }

        const isValid = this.checkEmail() && this.checkNombre() && this.checkJerarquia();
        // Form is not valid.
        if ( ! isValid ) {
            return;
        }
        this.setState( {
            loading: true,
        } );

        this.sendNewStaff();
    }

    // toggle de las tabs
    toggleTabs( tab ) {
        if ( this.state.activeTab !== tab ) {
            this.setState( {
                activeTab: tab,
            } );
        }
    }

    render() {
        if ( this.props.info.jerarquia === "administrador" ) {
            const {
                email,
                nombre,
                jerarquia,
            } = this.state;

            let dataTable = null;

            if ( this.state.usuarios ) {
                dataTable = this.renderingDataTable();
            }

            return (
                <Fragment>
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={ classnames( { active: this.state.activeTab === '1' } ) }
                                onClick={ () => this.toggleTabs( '1' ) }>
                                Crear Staff
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={ classnames( { active: this.state.activeTab === '2' } ) }
                                onClick={ () => this.toggleTabs( '2' ) }>
                                Ver miembros Staff
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={ this.state.activeTab }>
                        <TabPane tabId="1">
                            <Row className="vertical-gap d-flex">
                                <Col lg="6" className="justify-content-center">
                                    <div>
                                        <h2>Crear nuevo Staff</h2>
                                    </div>
                                    <div className="mb-5">
                                        <FormGroup>
                                            <Label for="telefono">Correo electrónico</Label>
                                            <Input type="email" 
                                                name="email" 
                                                className={ classnames( 'input-hcm-formulario', { 'is-invalid': this.state.emailError } ) }
                                                value={ email }
                                                onChange={ ( e ) => {
                                                    this.setState( {
                                                        email: e.target.value,
                                                    }, this.state.emailError ? this.checkEmail : () => {} );
                                                } }
                                                onBlur={ this.checkEmail }
                                            />
                                            { this.state.emailError.length > 0 ? (
                                                <div className="invalid-feedback">{ this.state.emailError }</div>
                                            ) : '' }
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="nombreUsuario">Nombre de usuario</Label>
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
                                            <Label for="jerarquia">Jerarquía</Label>
                                            <Input type="text" 
                                                name="jerarquia" 
                                                className={ classnames( 'input-hcm-formulario', { 'is-invalid': this.state.jerarquiaError } ) }
                                                value={ jerarquia }
                                                onChange={ ( e ) => {
                                                    const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                                                    this.setState( {
                                                        jerarquia: nuevo,
                                                        jerarquiaError: '',
                                                    } );
                                                } }
                                            />
                                            { this.state.jerarquiaError.length > 0 ? (
                                                <div className="invalid-feedback">{ this.state.jerarquiaError }</div>
                                            ) : '' }
                                        </FormGroup>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="justify-content-end">
                                <Col lg="4" sm="6" xs="12">
                                    <button
                                        className="btn btn-feelrouk"
                                        onClick={ this.createStaff }
                                        disabled={ this.state.loading }
                                    >
                                        Crear Staff
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
                                    <h2>Miembros de Staff registrados</h2>
                                </Col>
                            </Row>
                            <Row className="mb-20">
                                <Col>
                                    { dataTable }
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
