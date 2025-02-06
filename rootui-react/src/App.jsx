/**
 * External Dependencies
 */
import React, { Component } from 'react';
import { withRouter, HashRouter, Route } from 'react-router-dom';
import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Cookies from 'js-cookie';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    ArcElement,
    Legend,
} from 'chart.js';
ChartJS.register(
    ArcElement, 
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

/**
 * Internal Dependencies
 */
import './components/animated-route';
import reducers from './reducers';
import Routes from './Routes';
import PageYaybar from './components/page-yaybar';
import PageNavbar from './components/page-navbar';
import PageToasts from './components/page-toasts';
import Modal2 from './components/modal2';

import { updateAuth as actionUpdateAuth } from './actions';
const createStoreWithMiddleware = applyMiddleware()( createStore );
const $html = window.jQuery( 'html' );
const $body = window.jQuery( 'body' );

/**
 * Component PageWrap
 */
class PageWrap extends Component {
    constructor( props ) {
        super( props );

        this.maybeCheckAuth = this.maybeCheckAuth.bind( this );
        this.maybeUpdateGlobalSettings = this.maybeUpdateGlobalSettings.bind( this );
        this.maybeScrollPageToTop = this.maybeScrollPageToTop.bind( this );
        this.isSignPage = this.isSignPage.bind( this );
        this.isSignUpPage = this.isSignUpPage.bind( this );
        this.getQueryVariable = this.getQueryVariable.bind( this );
        this.isRecoverPassword = this.isRecoverPassword.bind( this );
    }

    componentDidMount() {
        this.maybeCheckAuth();
        this.maybeUpdateGlobalSettings();
    }

    componentDidUpdate( prevProps ) {
        this.maybeCheckAuth( prevProps );
        this.maybeUpdateGlobalSettings( prevProps );
        this.maybeScrollPageToTop( prevProps );
    }

    getQueryVariable( variable ) {
        if ( window.location.href.indexOf( variable ) > -1 && window.location.href.indexOf( '=' ) > -1 ) {
            return true;
        }
        return false;
    }

    deleteAllCookies() {
        Cookies.set( 'id', '' );
        Cookies.set( 'jerarquia', '' );
        Cookies.set( 'email', '' );
        Cookies.set( 'nombre', '' );
        Cookies.set( 'permisos', '' );
        Cookies.set( 'permisosTotal', '' );
        Cookies.set( 'cliente', '' );
        Cookies.set( 'empresa', '' );
    }

    isSignPage( check ) {
        if ( ! check ) {
            check = window.location.hash.replace( /^#/g, '' );
        }
        return check === '/sign-in';
    }

    isSignUpPage() {
        const esHash = this.getQueryVariable( 'hash' );

        let todoBien = false;
        if ( window.location.href.indexOf( "/sign-up" ) > -1 && esHash ) {
            todoBien = true;
        }
        return todoBien;
    }

    isRecoverPassword( check ) {
        if ( ! check ) {
            check = window.location.hash.replace( /^#/g, '' );
        }
        return check === '/recuperar-password';
    }

    isSendingLink( check ) {
        if ( ! check ) {
            check = window.location.hash.replace( /^#/g, '' );
        }
        return check === '/configurar-cuenta';
    }

    maybeCheckAuth( prevProps ) {
        const {
            auth,
            updateAuth,
            history,
        } = this.props;

        let newRedirect = false;

        const referrerUrl = auth.referrer && ! this.isSignPage( auth.referrer ) && ! this.isSendingLink() ? auth.referrer : '/';

        // Redirect from Auth page.
        if ( this.isSignPage() && auth.token ) {
            newRedirect = '/';

            // Redirect to Auth page.
        } else if ( this.isSendingLink() && auth.token ) {
            this.deleteAllCookies();

            updateAuth( {
                token: '',
            } );
        } else if ( this.isRecoverPassword() && auth.token ) {
            this.deleteAllCookies();

            updateAuth( {
                token: '',
            } );
        } else if ( this.isSignUpPage() && auth.token ) {
            this.deleteAllCookies();

            updateAuth( {
                token: '',
            } );
        } else if ( ! this.isRecoverPassword() && ! this.isSignPage() && ! this.isSignUpPage() && ! this.isSendingLink() && ! auth.token ) {
            newRedirect = '/sign-in';

            // Check if use logged out or logged in.
        } else if ( this.isRecoverPassword() && auth.token ) {
            newRedirect = '/';
        } else if ( prevProps && auth.token !== prevProps.auth.token ) {
            newRedirect = auth.token ? referrerUrl : '/sign-in';
        }
        // Redirect.
        if ( newRedirect ) {
            updateAuth( {
                referrer: window.location.hash.replace( /^#/g, '' ),
            } );
            history.push( newRedirect );
        }
    }

    maybeUpdateGlobalSettings( prevProps ) {
        const { settings } = this.props;

        // night mode.
        if ( prevProps && prevProps.settings.night_mode !== settings.night_mode ) {
            if ( settings.night_mode ) {
                $html.addClass( 'rui-night-mode' );

                // eslint-disable-next-line no-unused-expressions
                import( './style-night.scss' );
            } else {
                $html.removeClass( 'rui-night-mode' );
            }
        }
        if ( ! prevProps && settings.night_mode ) {
            $html.addClass( 'rui-night-mode' );

            // eslint-disable-next-line no-unused-expressions
            import( './style-night.scss' );
        }

        // spitlight mode.
        if ( prevProps && prevProps.settings.spotlight_mode !== settings.spotlight_mode ) {
            if ( settings.spotlight_mode ) {
                $body.addClass( 'rui-spotlightmode' );
            } else {
                $body.removeClass( 'rui-spotlightmode' );
            }
        }
        if ( ! prevProps && settings.spotlight_mode ) {
            $body.addClass( 'rui-spotlightmode' );
        }

        // section lines.
        if ( prevProps && prevProps.settings.show_section_lines !== settings.show_section_lines ) {
            if ( settings.show_section_lines ) {
                $body.addClass( 'rui-section-lines' );
            } else {
                $body.removeClass( 'rui-section-lines' );
            }
        }
        if ( ! prevProps && settings.show_section_lines ) {
            $body.addClass( 'rui-section-lines' );
        }

        // sidebar small.
        if ( prevProps && prevProps.settings.sidebar_small !== settings.sidebar_small ) {
            if ( settings.sidebar_small ) {
                $body.addClass( 'yay-hide' );
            } else {
                $body.removeClass( 'yay-hide' );
            }
        }
        if ( ! prevProps && settings.sidebar_small ) {
            $body.addClass( 'yay-hide' );
        }
    }

    maybeScrollPageToTop( prevProps ) {
        if ( this.props.location.pathname !== prevProps.location.pathname ) {
            window.scrollTo( {
                top: 0,
                behavior: 'smooth',
            } );
        }
    }

    render() {
        const {
            auth,
            location,
        } = this.props;

        if ( this.isSignUpPage() && ! auth.token ) {
            location.pathname = '/sign-up';
        }

        // rutas para esconder el menú lateral
        const esVCM = this.props.location.pathname.includes( "vcm" );
        const sonPostulantes = this.props.location.pathname.includes( "listado-postulantes" );
        const listadoTags = this.props.location.pathname.includes( "listado-tags" );
        const sonPasos = this.props.location.pathname.includes( "proceso-seleccion" );
        const creacionPasos = this.props.location.pathname.includes( "agregar-pasos" );

        const comprobacion1 = esVCM || sonPostulantes || sonPasos || creacionPasos || listadoTags;

        return (
            <TransitionGroup>
                <PageToasts />
                <div className="rui-modal-container">
                    <Modal2 />
                </div>
                {
                    ( comprobacion1 ) ?
                        <Route>
                            { auth.token ? (
                                <>
                                    <Route component={ PageNavbar } />
                                </>
                            ) : '' }
                        </Route>
                        :
                        <Route>
                            { auth.token ? (
                                <>
                                    <Route component={ PageYaybar } />
                                    <Route component={ PageNavbar } />
                                </>
                            ) : '' }
                        </Route>
                }
                
                <CSSTransition
                    key={ location.pathname }
                    timeout={ 300 }
                    classNames="rui-router-transition"
                    unmountOnExit
                >
                    <Routes location={ location } />
                </CSSTransition>
            </TransitionGroup>
        );
    }
}

const PageWrapWithState = connect( ( { auth, settings } ) => (
    {
        auth,
        settings,
    }
), { updateAuth: actionUpdateAuth } )( withRouter( PageWrap ) );

/**
 * Component App
 */
class App extends Component {
    constructor( props ) {
        super( props );

        // create redux store.
        this.store = createStoreWithMiddleware( reducers );
    }

    render() {
        return (
            <Provider store={ this.store }>
                <HashRouter>
                    <PageWrapWithState />
                </HashRouter>
            </Provider>
        );
    }
}

export default App;
