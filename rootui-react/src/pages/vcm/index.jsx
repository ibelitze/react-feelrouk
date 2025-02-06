/**
 * External Dependencies
 */
import React from 'react';
/**
 * Internal Dependencies
 */
import AsyncComponent from '../../components/async-component';
import PageWrap from '../../components/page-wrap';
import PageContent from '../../components/page-content';
import PageTitle from '../../components/page-title';
/**
 * Component
 * @returns {component} returns a jsx component
 */

const ValueCM = ()=> {
    return (
        <PageWrap>
            <PageTitle
                breadcrumbs={ {
                    '/': 'Home',
                    '/VCM': {
                        title: 'Administración de VCM',
                        sub: 'Modifique Permisos VCM',              
                    },
                } }>
            </PageTitle>
            <PageContent>
                <AsyncComponent component={ () => import( './content' ) } />
            </PageContent>
        </PageWrap>
    );
};

export default ValueCM;
