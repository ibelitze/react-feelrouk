/**
 * Styles
 */
import './style.scss';

/**
 * External Dependencies
 */
import React, { Component, Fragment } from 'react';
import classnames from 'classnames/dedupe';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import { Link, NavLink } from 'react-router-dom';
import { Row, Col, Modal, ModalFooter, ModalHeader, ModalBody, Button } from 'reactstrap';
// import moment from 'moment';
// import { useJwt } from "react-jwt";
// import axio from '../instancia-axios';

/**
 * Internal Dependencies
 */
import '../../../common-assets/js/yaybar/yaybar';
import { initPluginYaybar } from '../../../common-assets/js/rootui-parts/initPluginYaybar';
// import Dropdown from '../bs-dropdown';
import Icon from '../icon';
import IdleTimer from 'react-idle-timer';

import { updateAuth as actionUpdateAuth, updateInfo as actionUpdateInfo } from '../../actions';
import { getStorage, setStorage } from '../../pages/vcm/helpers/manejoStorage';

window.RootUI.initPluginYaybar = initPluginYaybar;

/**
 * Component
 */
class PageYaybar extends Component {
    constructor( props ) {
        if ( props.info.jerarquia ) {
            setStorage( "propsYaybar", props );
        }
        super( props );
        this.renderSubmenus = this.renderSubmenus.bind( this );
        this.logOut = this.logOut.bind( this );
        this.checkForImages = this.checkForImages.bind( this );
        this.deleteAllCookies = this.deleteAllCookies.bind( this );
        this.handleOnAction = this.handleOnAction.bind( this );
        this.handleOnActive = this.handleOnActive.bind( this );
        this.handleOnIdle = this.handleOnIdle.bind( this );
        this.idleTimer = null;
        this.idletimerreturner = this.idletimerreturner.bind( this );
        this.checkToken = this.checkToken.bind( this );
        this.handleClose = this.handleClose.bind( this );
        this.handleOpen = this.handleOpen.bind( this );
        this.returnData = this.returnData.bind( this );

        this.state = {
            modal: false,
            time: 0,
            permisos: null,
        };
        this.timer = null;
    }

    // abrir/cerrar modal
    // abrir/cerrar modal
    handleClose() {
        this.setState( { modal: false } );
    }
    handleOpen() {
        this.setState( { modal: true } );
    }

    // se activa cada vez que el usuario hace algo
    handleOnAction() {
    }

    handleOnActive() {
    }

    handleOnIdle() {
        this.handleClose();
        this.logOut();
    }

    async checkToken() {
        // const token = this.props.auth.token;
        // if ( token ) {
        //     const ahora = moment().format( 'LTS' );
        //     const expira = this.props.info.exp;
        //     if ( ahora > expira ) {
        //         const data = {
        //             id: this.props.info.id,
        //             nombre: this.props.info.nombre,
        //         };
        //         axio.post( '/api/auth/renovarToken', data ).then( ( res ) => {
        //             if ( res.data.ok ) {
        //                 this.props.updateAuth( {
        //                     token: res.data.token,
        //                 }, () => {
        //                     Cookies.set( 'rui-auth-token', res.data.token, { expires: 2 } );
        //                 } );
        //             }
        //         } );
        //     }
        // }
    }

    componentDidMount() {
        const { auth } = this.props;

        window.RootUI.initPluginYaybar();
        if ( auth.token ) {
            this.setState( { time: this.idleTimer.getRemainingTime() / 1000 } );
            this.timer = setInterval( () => {
                this.setClock();
                // this.checkToken();
            }, 5000 );
        }
    }

    componentWillUnmount() {
        this.deleteAllCookies();
        clearInterval( this.timer );
    }

    setClock() {
        const temp = this.idleTimer.getRemainingTime() / 1000;
        const final = Math.trunc( temp );

        this.setState( { time: final } );

        if ( temp < 30 ) {
            this.handleOpen();
        }

        if ( temp < 1 ) {
            this.handleClose();
            this.logOut();
        }
    }

    logOut() {
        const {
            updateAuth,
        } = this.props;

        this.deleteAllCookies();

        updateAuth( {
            token: '',
        } );
    }

    idletimerreturner() {
        return (
            <IdleTimer
                ref={ ref => {
                    this.idleTimer = ref;
                } }
                timeout={ 1000 * 60 * 10 }
                onActive={ this.handleOnActive }
                onIdle={ this.handleOnIdle }
                onAction={ this.handleOnAction }
                debounce={ 250 }
            />
        );
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
        Cookies.set( 'init', '' );
        Cookies.set( 'exp', '' );
    }

    checkForImages( text ) {
        const {
            settings,
        } = this.props;

        switch ( text ) {
        case 'revenue':
            return settings.icons.revenue;
        case 'human':
            return settings.icons.human;
        case 'digital':
            return settings.icons.digital;
        case 'value':
            return settings.icons.value;
        }
    }

    renderSubmenus( nav, returnObject = false ) {
        let thereIsActive = false;

        const result = Object.keys( nav ).map( ( url ) => {
            const data = nav[ url ];
            const isActive = window.location.hash === `#${ url }`;
            let isOpened = false;

            if ( isActive ) {
                thereIsActive = true;
            }

            let sub = '';
            if ( data.sub ) {
                const subData = this.renderSubmenus( data.sub, true );

                sub = (
                    <ul className="yay-submenu dropdown-triangle">
                        { subData.content }
                    </ul>
                );

                if ( subData.thereIsActive ) {
                    isOpened = true;
                    thereIsActive = true;
                }
            }

            return (
                <React.Fragment key={ `${ url }-${ data.name }` }>
                    { data.label ? (
                        <li className="yay-label">{ data.label }</li>
                    ) : '' }
                    <li className={ classnames( {
                        'yay-item-active': isActive,
                        'yay-submenu-open': isOpened,
                    } ) }>
                        { data.name ? (
                            <NavLink
                                to={ data.sub ? '#' : url }
                                className={ data.sub ? 'yay-sub-toggle' : '' }
                            >
                                { data.icon ? (
                                    <>
                                        <span className="yay-icon">
                                            <img src={ this.checkForImages( data.icon ) } alt={ 'iconos de yaybar' } />
                                        </span>
                                        <span>{ data.name }</span>
                                    </>
                                ) : (
                                    data.name
                                ) }
                                { data.sub ? (
                                    <span className="yay-icon-collapse">
                                        <Icon name="chevron-right" strokeWidth="1" className="rui-icon-collapse" />
                                    </span>
                                ) : '' }
                            </NavLink>
                        ) : '' }
                        { sub }
                    </li>
                </React.Fragment>
            );
        } );

        if ( returnObject ) {
            return {
                content: result,
                thereIsActive,
            };
        }

        return result;
    }

    returnData( obj ) {
        return obj[ Object.keys( obj )[ 0 ] ];
    }

    render() {
        const {
            settings,
        } = this.props;
        if ( this.props?.info?.cliente?.id ) {
            window.localStorage.setItem( "props", JSON.stringify( this.props ) );
        }
        let permisos = null;
        let permisos1 = null;
        if ( this.props?.info?.jerarquia || getStorage( "propsYaybar" )?.info?.jerarquia ) {
            if ( this.props?.info?.jerarquia === "administrador" || getStorage( "propsYaybar" )?.info?.jerarquia === "administrador" ) {
                permisos = this.renderSubmenus( settings.navigation_sidebar_staff );
            } else if ( this.props.info.jerarquia === "clienteAdmin" || getStorage( "propsYaybar" ).info.jerarquia === "clienteAdmin" ) {
                // creando el menú según los permisos del cliente ( administración )
                const permisosNormales = Object.assign( {}, settings.navigation_sidebar_cliente );
                permisos1 = this.renderSubmenus( permisosNormales );

                const nuevoArray = Object.assign( {}, settings.navigation_sidebar_lineas );
                nuevoArray[ '#' ].sub = {};

                // este object puede ser creado dinámicamente más adelante.
                // por ahora se crea manual hasta que se tengan módulos adaptables a nuevas funciones
                const opciones = {
                    HCM: {
                        '#': {
                            name: "Human Capital",
                            icon: 'human',
                            sub: {
                                '/reclutamiento': {},
                                '/seleccion': {},
                            },
                        },
                    },
                    VCM: {
                        '#': {
                            name: 'Value Chain',
                            icon: 'value',
                            sub: {
                                '/ldp': {
                                    name: 'linea de procesos',
                                    sub: {
                                        '/vcm': {
                                            name: 'lineas',
                                        },
                                        '/vcm/ldp/crear': {
                                            name: 'crear linea',
                                        },
                                    },
                                },
                                '/mantenedores': {
                                    name: 'Mantenedores',
                                    sub: {
                                        '/vcm/mantenedores/productos': {
                                            name: 'Productos',
                                        },
                                        '/vcm/mantenedores/cargos': {
                                            name: 'Cargos',
                                        },
                                        '/vcm/mantenedores/monedas': {
                                            name: 'Monedas',
                                        },
                                        '/vcm/mantenedores/recursos': {
                                            name: 'Recursos',
                                        },
                                        '/vcm/mantenedores/unidades': {
                                            name: 'Unidades de Medida',
                                        },
                                        '/vcm/mantenedores/localizaciones': {
                                            name: 'Localizaciones',
                                        },
                                        '/vcm/mantenedores/suministro-tipo': {
                                            name: 'Tipo de Suministros',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    DM: {
                        '/digital': {
                            name: 'Digital Management',
                            icon: 'digital',
                        },
                    },
                    RM: {
                        '/revenue': {
                            name: 'Revenue',
                            icon: 'revenue',
                        },
                    },
                };
                const permisosCliente = this.props?.info?.permisos?.split( '-' )[ 0 ] !== '' ? this.props?.info?.permisos?.split( '-' ) : getStorage( "propsYaybar" )?.info?.permisos.split( '-' );
                const that = this;
                permisosCliente?.forEach( ( permiso ) => {
                    if ( opciones.hasOwnProperty( permiso ) ) {
                        Object.defineProperty( nuevoArray[ '#' ].sub, permiso, {
                            enumerable: true,
                            configurable: true,
                            writable: true,
                            value: that.returnData( opciones[ permiso ] ),
                        } );
                    }
                } );
                if ( this.props?.info?.permisos?.includes( 'reclutamiento' ) ) {
                    nuevoArray[ '#' ].sub.HCM.sub[ '/reclutamiento' ] = {
                        name: "Reclutamiento",
                        sub: {
                            '/listado-empresas': {
                                name: 'Empresas',
                            },
                            '/listado-perfiles': {
                                name: 'Perfiles',
                            },
                            '/crear-publicacion': {
                                name: 'Crear Publicación',
                            },
                            '/listado-publicaciones': {
                                name: 'Ver Publicaciones',
                            },
                        },
                    };
                }
                if ( this.props?.info?.permisos?.includes( 'seleccion' ) ) {
                    nuevoArray[ '#' ].sub.HCM.sub[ '/seleccion' ] = {
                        name: "Selección",
                        sub: {
                            '/agregar-pasos': {
                                name: 'Agregar pasos a selección',
                            },
                            '/proceso-seleccion': {
                                name: 'Ver Procesos de Selección',
                            },
                        },
                    };
                }
                permisos = this.renderSubmenus( nuevoArray );
            } else if ( this.props?.info?.jerarquia === "empleado" || getStorage( "propsYaybar" ).info.jerarquia === "empleado" ) {
                const nuevoArray = Object.assign( {}, settings.navigation_sidebar_lineas );
                nuevoArray[ '#' ].sub = {};

                // este object puede ser creado dinámicamente más adelante.
                // por ahora se crea manual hasta que se tengan módulos adaptables a nuevas funciones
                const opciones = {
                    HCM: {
                        '#': {
                            name: "Human Capital",
                            icon: 'human',
                            sub: {
                                '/reclutamiento': {},
                                '/seleccion': {},
                            },
                        },
                    },
                    VCM: {
                        '#': {
                            name: 'Value Chain',
                            icon: 'value',
                            sub: {
                                '/ldp': {
                                    name: 'linea de procesos',
                                    sub: {
                                        '/vcm': {
                                            name: 'lineas',
                                        },
                                        '/vcm/ldp/crear': {
                                            name: 'crear linea',
                                        },
                                    },
                                },
                                '/mantenedores': {
                                    name: 'Mantenedores',
                                    sub: {
                                        '/vcm/mantenedores/productos': {
                                            name: 'Productos',
                                        },
                                        '/vcm/mantenedores/cargos': {
                                            name: 'Cargos',
                                        },
                                        '/vcm/mantenedores/monedas': {
                                            name: 'Monedas',
                                        },
                                        '/vcm/mantenedores/secciones': {
                                            name: 'Secciones',
                                        },
                                        '/vcm/mantenedores/recursos': {
                                            name: 'Recursos',
                                        },
                                        '/vcm/mantenedores/subcategorias': {
                                            name: 'Subcategorias',
                                        },
                                        '/vcm/mantenedores/unidades': {
                                            name: 'Unidades de Medida',
                                        },
                                        '/vcm/mantenedores/localizaciones': {
                                            name: 'Localizaciones',
                                        },
                                        '/vcm/mantenedores/suministro-tipo': {
                                            name: 'Tipo de Suministros',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    DM: {
                        '/digital': {
                            name: 'Digital Management',
                            icon: 'digital',
                        },
                    },
                    RM: {
                        '/revenue': {
                            name: 'Revenue',
                            icon: 'revenue',
                        },
                    },
                };
                const permisosCliente = this.props.info.permisos.split( '-' )[ 0 ] !== '' ? this.props.info.permisos.split( '-' ) : getStorage( "propsYaybar" ).info.permisos.split( '-' );
                const that = this;
                permisosCliente.forEach( ( permiso ) => {
                    if ( opciones.hasOwnProperty( permiso ) ) {
                        Object.defineProperty( nuevoArray[ '#' ].sub, Object.keys( opciones[ permiso ] )[ 0 ], {
                            enumerable: true,
                            configurable: true,
                            writable: true,
                            value: that.returnData( opciones[ permiso ] ),
                        } );
                    }
                } );
                if ( this.props.info.permisos.includes( 'reclutamiento' ) ) {
                    nuevoArray[ '#' ].sub.HCM.sub[ '/reclutamiento' ] = {
                        name: "Reclutamiento",
                        sub: {
                            '/listado-empresas': {
                                name: 'Empresas',
                            },
                            '/listado-perfiles': {
                                name: 'Perfiles',
                            },
                            '/crear-publicacion': {
                                name: 'Crear Publicación',
                            },
                            '/listado-publicaciones': {
                                name: 'Ver Publicaciones',
                            },
                        },
                    };
                }
                if ( this.props.info.permisos.includes( 'seleccion' ) ) {
                    nuevoArray[ '#' ].sub.HCM.sub[ '/seleccion' ] = {
                        name: "Selección",
                        sub: {
                            '/agregar-pasos': {
                                name: 'Agregar pasos a selección',
                            },
                            '/proceso-seleccion': {
                                name: 'Ver Procesos de Selección',
                            },
                        },
                    };
                }
                permisos = this.renderSubmenus( nuevoArray );
            } else {
                permisos = <li>No tiene permisos para ver submenus</li>;
            }
        }

        return (
            <Fragment>

                <IdleTimer
                    ref={ ref => {
                        this.idleTimer = ref;
                    } }
                    timeout={ 1000 * 60 * 10 }
                    onActive={ this.handleOnActive }
                    onIdle={ this.handleOnIdle }
                    onAction={ this.handleOnAction }
                    debounce={ 250 }
                />

                <Modal isOpen={ this.state.modal } toggle={ this.handleClose } keyboard={ false } className="feelrouk-modal">
                    <ModalHeader className="header-blanco">
                        <img src={ settings.img_feelrouk.modal } alt={ "logo, tiempo de sesion" } className="tiempo-sesion" />
                    </ModalHeader>
                    <ModalBody>
                        <h1>TU SESIÓN EXPIRA EN POCOS SEGUNDOS</h1>
                    </ModalBody>
                    <ModalFooter>
                        <Button className="seguir-sesion" variant="primary" onClick={ this.handleClose }>
                            CONTINUAR TRABAJANDO
                        </Button>
                        <Button className="cerrar-sesion" variant="secondary" onClick={ this.logOut }>
                            SALIR
                        </Button>
                    </ModalFooter>
                </Modal>

                <div className={
                    classnames(
                        'yaybar rui-yaybar yay-hide-to-small yay-gestures',
                        settings.sidebar_dark && ! settings.night_mode ? 'rui-yaybar-dark' : '',
                        settings.sidebar_static ? 'yay-static' : '',
                        settings.sidebar_effect ? `yay-${ settings.sidebar_effect }` : '',
                    )
                }
                >
                    <div className="yay-wrap-menu">
                        <div className="yaybar-wrap">
                            <div className="yaybar-info">
                                <p>Business Solutions Workspace</p>
                                <img src={ settings.img_feelrouk.barra } alt={ 'Barra color' } />
                            </div>
                            <ul>
                                { /*<li>
                                    <a href="../dashboard.html">
                                        <span
                                            className="yay-icon"
                                            dangerouslySetInnerHTML={ { __html: require( '!svg-inline-loader!../../../common-assets/images/logo-html-inherit.svg' ) } }
                                        />
                                        <span>Switch to HTML</span>
                                        <span className="rui-yaybar-circle"></span>
                                    </a>
                                </li>*/ }
                                {
                                    permisos1
                                }
                                {
                                    permisos
                                }

                                { /*<li className="yay-label">Sign</li>
                                <li>
                                    <NavLink
                                        to="#"
                                        onClick={ this.logOut }
                                    >
                                        <span className="yay-icon">
                                            <Icon name="log-out" />
                                        </span>
                                        <span>Log Out</span>
                                        <span className="rui-yaybar-circle"></span>
                                    </NavLink>
                                </li>*/ }
                            </ul>

                        </div>

                        <div className="yaybar-info2">
                            <p>BETTER BUSSINESS</p>
                            <span>WORKING TOGETHER</span>
                        </div>
                    </div>
                    <div className="rui-yaybar-icons">
                        <Row className="no-gutters justify-content-around">
                            { /*
                            <Col xs="auto">
                                <Link to={ settings.home_url } className="btn btn-custom-round">
                                    <Icon name="settings" />
                                </Link>
                            </Col>
                            <Col xs="auto">
                                <Link to={ settings.home_url } className="btn btn-custom-round">
                                    <Icon name="bell" />
                                </Link>
                            </Col>
                            */ }

                            { /* <Col xs="auto" className="d-flex mt-3">
                                <Dropdown tag="li" direction="up" openOnHover showTriangle>
                                    <Dropdown.Toggle className="btn btn-custom-round">
                                        <Icon name="plus-circle" />
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu tag="ul" className="dropdown-menu nav" modifiers={ { offset: { offset: '-30px' }, flip: false } }>
                                        <li>
                                            <Link to="#" className="nav-link">
                                                <Icon name="plus-circle" />
                                                <span>Create new Post</span>
                                                <span className="rui-nav-circle" />
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="#" className="nav-link">
                                                <Icon name="book" />
                                                <span>Project</span>
                                                <span className="rui-nav-circle" />
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="#" className="nav-link">
                                                <Icon name="message-circle" />
                                                <span>Message</span>
                                                <span className="rui-nav-circle" />
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="#" className="nav-link">
                                                <Icon name="mail" />
                                                <span>Mail</span>
                                                <span className="rui-nav-circle" />
                                            </Link>
                                        </li>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col> */ }
                            <Col xs="auto">
                                <Link onClick={ this.logOut } className="btn btn-custom-round">
                                    <Icon name="log-out" />
                                </Link>
                            </Col>
                        </Row>
                    </div>
                </div>
                <div className="rui-yaybar-bg" />
            </Fragment>
        );
    }
}

export default connect( ( { settings, auth, info } ) => (
    {
        settings,
        auth,
        info,
    }
), { updateAuth: actionUpdateAuth,
    updateInfo: actionUpdateInfo,
} )( PageYaybar );

