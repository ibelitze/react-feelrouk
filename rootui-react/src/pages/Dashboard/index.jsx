/**
 * Styles.
 */
import './style.scss';

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

/**
 * Component
 */
class Dashboard extends Component {
    render() {
        return (
            <PageWrap>
                <PageContent>
                    <AsyncComponent component={ () => import( './content' ) } />
                </PageContent>
            </PageWrap>
        );
    }
}

export default Dashboard;
