/**
 * Styles
 */
import React, { Component } from 'react';
import { Input } from 'reactstrap';
import './style.scss';

/**
 * Component
 */
class HeaderColumna extends Component {
    render() {
        return (
            <div>
                <Input type="text" 
                    name="filtrado-columna"
                    placeholder="Filtrar candidatos.."
                    className="input-hcm-formulario"
                    onChange={ ( e ) => {
                        const nuevo = e.target.value.replace( /[`~!¨´@#$%^&*°()¿¡_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '' );
                        if ( nuevo.length > 0 ) {
                            this.props.filtrar( this.props.columna, nuevo );
                        } else {
                            this.props.filtrar( this.props.columna );
                        }
                    } }
                />
            </div>
        );
    }
}

export default HeaderColumna;
