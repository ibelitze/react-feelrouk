/**
 * External Dependencies
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import ContentIframe from '../../components/value-iframe';
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
        this.getAllPermisos = this.getAllPermisos.bind( this );

        this.state = {
            ok: false,
            permisos: null,
        };
    }

    componentDidMount() {
        this.getAllPermisos().then( () => {
        } );
    }

    getAllPermisos() {
        const email = this.props.info.email;
        return new Promise( ( resolve ) => {
            axios.get( process.env.REACT_APP_LOCAL + '/api/clientes/getByEmail/' + email ).then( ( res ) => {
                if ( res.data.ok ) {
                    this.setState( { 
                        ok: res.data.ok,
                        permisos: res.data.data,
                    } );
                    return resolve( true );
                }
            } );
        } );
    }
    // `http://vcm.feelrouk.com?compania={id}&modulo=VCM_DB`
    // http://www.youtube.com/embed/xDMP3i36naA

    render() {
        return (
            <Fragment>
                <ContentIframe modulo="VCM_DB"></ContentIframe>
            </Fragment>
        );
    }
}

export default connect( ( { settings, info } ) => (
    {
        settings,
        info,
    }
) )( Content );
