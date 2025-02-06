/**
 * External Dependencies
 */
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

/**
 * Internal Dependencies
 */
import RoutesList from './pages';
import NotFoundPage from './pages/404';

/**
 * Component
 */
class Routes extends Component {
    render() {
        const {
            location,
        } = this.props;

        return (
            <Switch
                location={ location }
            >
                { Object.keys( RoutesList ).map( ( path ) => {
                    const RouteInner = RoutesList[ path ];

                    if ( path === '/empresas' || path === '/staff' || path === '/usuarios' || path === 'lineas' ) {
                        if ( this.props.info.jerarquia === "administrador" ) {
                            return (
                                <Route
                                    key={ path }
                                    path={ path }
                                    exact
                                    render={ () => (
                                        <RouteInner />
                                    ) }
                                />
                            );
                        }
                    } else {
                        return (
                            <Route
                                key={ path }
                                path={ path }
                                exact
                                render={ () => (
                                    <RouteInner />
                                ) }
                            />
                        );
                    }
                } ) }

                { /* 404 */ }
                <Route
                    render={ () => (
                        <NotFoundPage />
                    ) }
                />
            </Switch>
        );
    }
}

export default connect( ( { info } ) => (
    {
        info,
    }
) )( Routes );

// sexport default Routes;
