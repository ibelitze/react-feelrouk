/**
 * External Dependencies
 */
import React, { Component } from 'react';
import { Row } from 'reactstrap';
import Iframe from 'react-iframe';

import './style.scss';

/**
 * Internal Dependencies
 */
// import Snippet from '../../components/snippet';

/**
 * Component
 */
class ContentIframe extends Component {
    render() {
        // const hash = "95ba737a4287086420f2952ebe93d94f246a2201def215717a8cb92012718d8b";
        // const permisos = 'crear-editar-eliminar';
        // const url = `http://vcm.feelrouk.com/Modulo.aspx?compania=${ this.state.permisos.empresa.id }&idCliente=${ this.state.permisos.cliente.id }&modulo=VCM_DB&permisos=${ permisos }&hash=${ hash }`;
        const url = `https://vcm.feelrouk.com/Modulo.aspx?modulo=${ this.props.modulo }`;
        const iframe = <Iframe url={ url }
            width="100%"
            height="900px"
            id="myId"
            className="iframe-feelrouk"
            display="initial"
            position="relative" />;

        return (
            <Row>
                { iframe }
            </Row>
        );
    }
}

export default ContentIframe;
