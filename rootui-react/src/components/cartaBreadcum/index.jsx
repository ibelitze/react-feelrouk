/**
 * External Dependencies
 */
import React, { Component } from 'react';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
/**
 * Styles
 */
import './style.scss';

/**
 * Dropdown Component
 */
class Breadcum extends Component {
    render() {
        return (
            <div className="container-cards">
                <div className="recuadro-breadcum">
                    <h2>{ this.props.titulo }</h2>
                </div>
                { this.props.tieneSiguiente ? <FontAwesomeIcon icon={ faCaretRight } /> : null }
            </div>

        );
    }
}

export default Breadcum;
