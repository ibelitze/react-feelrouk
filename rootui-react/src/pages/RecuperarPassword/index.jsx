/**
 * Styles
 */
import './style.scss';

/**
 * External Dependencies
 */
import React, { Component } from 'react';
// import FirebaseContext from '../../components/auth-component/content2';

/**
 * Internal Dependencies
 */
import AsyncComponent from '../../components/async-component';

/**
 * Component
 */
class RecuperarPassword extends Component {
    render() {
        return (
            <div className="content-fluid bg-mobile">
                { /* <div className="rui-sign align-items-center justify-content-center"> */ }
                <AsyncComponent component={ () => import( './content' ) } />
                { /* </div> */ }
            </div>
        );
    }
}

export default RecuperarPassword;
