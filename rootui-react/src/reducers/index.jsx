/**
 * External Dependencies
 */
import { combineReducers } from 'redux';
import Cookies from 'js-cookie';
import Omit from 'object.omit';

/**
 * Internal Dependencies
 */
import { getUID } from '../utils';
import defaultSettings from '../settings';
import {
    UPDATE_AUTH,
    UPDATE_INFO,
    UPDATE_SETTINGS,
    ADD_TOAST,
    REMOVE_TOAST,
    CHANGE_MODAL,
} from '../actions';

// initial state.
const INITIAL_SETTINGS_STATE = {
    ...defaultSettings,
};

const INITIAL_USER_INFO = {
    id: Cookies.get( 'id' ),
    nombre: Cookies.get( 'nombre' ),
    email: Cookies.get( 'email' ),
    jerarquia: Cookies.get( 'jerarquia' ),
    permisos: Cookies.get( 'permisos' ),
    cliente: Cookies.get( 'cliente' ),
    permisosTotal: Cookies.get( 'permisosTotal' ),
    empresa: Cookies.get( 'empresa' ),
    init: Cookies.get( 'init' ),
    exp: Cookies.get( 'exp' ),
};

const INITIAL_AUTH_STATE = {
    token: Cookies.get( 'rui-auth-token' ),
};
const INITIAL_TOASTS_STATE = [];
const INITIAL_MODAL_STATE = false;

/**
 * Reducer
 */
const rootReducer = combineReducers( {
    auth: ( state = INITIAL_AUTH_STATE, action ) => {
        switch ( action.type ) {
        case UPDATE_AUTH:
            // save token to cookies for 3 days.
            if ( typeof action.auth.token !== 'undefined' ) {
                // aquí también se puede modificar para que la cookie dure mucho menos..
                Cookies.set( 'rui-auth-token', action.auth.token, { expires: 2 } );
            }

            return Object.assign( {}, state, action.auth );
        default:
            return state;
        }
    },
    info: ( state = INITIAL_USER_INFO, action ) => {
        switch ( action.type ) {
        case UPDATE_INFO:
            Cookies.set( 'id', action.info.id, { expires: 1 } );
            Cookies.set( 'nombre', action.info.nombre, { expires: 1 } );
            Cookies.set( 'email', action.info.email, { expires: 1 } );
            Cookies.set( 'jerarquia', action.info.jerarquia, { expires: 1 } );
            Cookies.set( 'permisos', action.info.permisos, { expires: 1 } );
            Cookies.set( 'empresa', action.info.empresa, { expires: 1 } );
            Cookies.set( 'permisosTotal', action.info.permisosTotal, { expires: 1 } );
            Cookies.set( 'cliente', action.info.cliente, { expires: 1 } );
            Cookies.set( 'init', action.info.init, { expires: 2 } );
            Cookies.set( 'exp', action.info.exp, { expires: 2 } );

            return Object.assign( {}, state, {
                id: action.info.id,
                nombre: action.info.nombre,
                email: action.info.email,
                jerarquia: action.info.jerarquia,
                permisos: action.info.permisos,
                empresa: action.info.empresa,
                permisosTotal: action.info.permisosTotal,
                cliente: action.info.cliente,
                init: action.info.init,
                exp: action.info.exp,
            } );
        default:
            return state;
        }
    },
    modal: ( state = INITIAL_MODAL_STATE, action ) => {
        switch ( action.type ) {
        case CHANGE_MODAL:
            state = ! state;
            return Object.assign( {}, state, action.changeModal );
        default:
            return state;
        }
    },
    settings: ( state = INITIAL_SETTINGS_STATE, action ) => {
        switch ( action.type ) {
        case UPDATE_SETTINGS:
            return Object.assign( {}, state, action.settings );
        default:
            return state;
        }
    },
    toasts: ( state = INITIAL_TOASTS_STATE, action ) => {
        switch ( action.type ) {
        case ADD_TOAST:
            const newData = {
                ...{
                    title: '',
                    content: '',
                    color: 'brand',
                    time: false,
                    duration: 0,
                    closeButton: true,
                },
                ...action.data,
            };

            if ( newData.time === true ) {
                newData.time = new Date();
            }

            return {
                ...state,
                [ getUID() ]: newData,
            };
        case REMOVE_TOAST:
            if ( ! action.id || ! state[ action.id ] ) {
                return state;
            }
            return Omit( state, action.id );
        default:
            return state;
        }
    },
} );

export default rootReducer;
