/**
 * External Dependencies
 */
import React, { Component } from 'react';

/**
 * Internal Dependencies
 */
import AsyncComponent from '../../components/async-component';
import PageWrap from '../../components/page-wrap';
import PageContent from '../../components/page-content';
import PageTitle from '../../components/page-title';

/**
 * Component
 */
class ReclutamientoPerfiles extends Component {
    render() {
        return (
            <PageWrap>
                <PageTitle
                    breadcrumbs={ {
                        '/': 'Human Capital',
                        '/Empresas': 'Reclutamiento',
                    } }
                >
                </PageTitle>
                <PageContent>
                    <AsyncComponent component={ () => import( './content' ) } />
                </PageContent>
            </PageWrap>
        );
    }
}

export default ReclutamientoPerfiles;
