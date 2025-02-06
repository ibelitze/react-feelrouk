/**
 * External Dependencies
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
// import PageTitleFeelrouk from '../../components/page-title-feelrouk';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames/dedupe';

import StepperForm from '../../components/stepper-form';
import ListadoPerfiles from '../../components/listado-perfiles';
import ListadoEmpresas from '../../components/listado-empresas';
import ListadoPosiciones from '../../components/listado-posiciones';

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

        this.state = {
            activeTab: "1",
            renderListado: true,
            renderListado2: false,
        };
    }

    // toggle de las tabs
    toggleTabs( tab ) {
        if ( this.state.activeTab !== tab ) {
            if ( tab === '1' ) {
                this.setState( {
                    activeTab: tab,
                    renderListado: true,
                    renderListado2: false,
                } );
            } else if ( tab === '2' ) {
                this.setState( {
                    activeTab: tab,
                    renderListado: false,
                    renderListado2: true,
                } );
            } else if ( tab === '3' ) {
                this.setState( {
                    activeTab: tab,
                    renderListado: false,
                    renderListado2: true,
                } );
            } else {
                this.setState( {
                    activeTab: tab,
                    renderListado: false,
                    renderListado2: false,
                } );
            }
        }
    }

    render() {
        return (
            <Fragment>
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={ classnames( { active: this.state.activeTab === '1' } ) }
                            onClick={ () => this.toggleTabs( '1' ) }>
                            Ver Empresas
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={ classnames( { active: this.state.activeTab === '2' } ) }
                            onClick={ () => this.toggleTabs( '2' ) }>
                            Ver Perfiles
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={ classnames( { active: this.state.activeTab === '3' } ) }
                            onClick={ () => this.toggleTabs( '3' ) }>
                            Crear Publicación
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={ classnames( { active: this.state.activeTab === '4' } ) }
                            onClick={ () => this.toggleTabs( '4' ) }>
                            Ver Publicaciones
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={ this.state.activeTab }>
                    <TabPane tabId="1">
                        { this.state.renderListado ? <ListadoEmpresas /> : null }
                    </TabPane>
                    <TabPane tabId="2">
                        { this.state.renderListado2 ? <ListadoPerfiles /> : null }
                    </TabPane>
                    <TabPane tabId="3">
                        <StepperForm />
                    </TabPane>
                    <TabPane tabId="4">
                        <ListadoPosiciones />
                    </TabPane>
                </TabContent>
            </Fragment>
        );
    }
}

export default connect( ( { settings } ) => (
    {
        settings,
    }
) )( Content );
