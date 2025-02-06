import axios from 'axios';
import Cookies from 'js-cookie';
require( 'dotenv' ).config();

const axio = axios.create( {
    baseURL: process.env.REACT_APP_DEVAPI,
} );

const token = Cookies.get( 'rui-auth-token' );

if ( token ) {
    axio.defaults.headers.common.token = token;
}

export default axio;

