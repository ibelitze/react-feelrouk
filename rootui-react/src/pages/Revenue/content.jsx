/**
 * External Dependencies
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
// import { Row, Col } from 'reactstrap';

/**
 * Internal Dependencies
 */
// import Snippet from '../../components/snippet';

/**
 * Component
 */
class Content extends Component {
    render() {
        return (
            <Fragment>
                <h2 id="gridBase">Revenue Management</h2>
                <p>
                    Solo un ejemplo..
                </p>
            </Fragment>
        );
    }
}

export default connect( ( { settings } ) => (
    {
        settings,
    }
) )( Content );
