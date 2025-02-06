/**
 * External Dependencies
 */
import React, { Component } from 'react';

/**
 * Styles.
 */
import './style.scss';

/**
 * Internal Dependencies
 */
import AsyncComponent from '../../components/async-component';
import PageWrap from '../../components/page-wrap';
import PageTitle from '../../components/page-title';
import PageContent from '../../components/page-content';

/**
 * Component
 */
class Empleados extends Component {
    render() {
        return (
            <PageWrap>
                <PageTitle
                    breadcrumbs={ {
                        '/': 'Home',
                        '/Empleados': {
                            title: 'Administración de Empleados',
                            sub: 'Agregue, edite y elimine empleados',
                        },
                    } }
                >
                    <h1>Administración de Empleados</h1>
                </PageTitle>
                <PageContent>
                    <AsyncComponent component={ () => import( './content' ) } />
                </PageContent>
            </PageWrap>
        );
    }
}

export default Empleados;
