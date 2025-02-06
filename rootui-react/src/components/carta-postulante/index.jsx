/**
 * External Dependencies
 */
import React, { Component } from 'react';
import { Dropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap';
// import BsDropdown from '../bs-dropdown';
import classnames from 'classnames/dedupe';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import Icon from '../icon';
/**
 * Styles
 */
import './style.scss';

/**
 * Dropdown Component
 */
class CartaPostulante extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            dropdownOpen: false,
            invalido: false,
            id: 0,
            statusBox: false,
        };

        this.toggle = this.toggle.bind( this );
    }

    toggle() {
        const nuevo = ! this.state.dropdownOpen;
        this.setState( {
            dropdownOpen: nuevo,
        } );
    }

    render() {
        return (
            <div className="recuadro-postulante">
                <Dropdown className={ classnames( 'reclutamiento-dropdown', { 'is-invalid': this.state.invalido } ) } isOpen={ this.state.dropdownOpen } toggle={ () => this.toggle() }>
                    <DropdownToggle
                        tag="span"
                        onClick={ this.toggle }
                        data-toggle="dropdown"
                        aria-expanded={ this.state.dropdownOpen }
                    >
                        <FontAwesomeIcon icon={ faCaretDown } />
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={ () => this.props.subirCV( this.props.children.id ) } >Agregar CV</DropdownItem>
                        <DropdownItem>Enviar Mensaje</DropdownItem>
                        <DropdownItem onClick={ () => this.props.verPonderacion( this.props.children.id ) }>Ver Ponderación</DropdownItem>
                        <DropdownItem onClick={ () => this.props.eliminarPostulante( this.props.id ) }>Descartar Postulante</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <h2>{ this.props.children.nombre }</h2>
                <p className="correo">{ this.props.children.correo }</p>
                <p>{ this.props.children.telefono }</p>
                <p>{ this.props.children.direccion }</p>
                <p>{ "Registrado: " } <span className="cargo">{ this.props.children.registrado }</span></p>
                <p>{ "Porcentaje: " + this.props.children.porcentaje } 
                    <Icon className="circle-info" name="info" onClick={ () => this.props.verPonderacion( this.props.children.id ) } />
                </p>
            </div>
        );
    }
}

export default CartaPostulante;
