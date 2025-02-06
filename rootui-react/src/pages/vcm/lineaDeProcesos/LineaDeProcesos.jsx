import React, { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { TablaProductos } from './components/TablaProductos';
import { Kanban } from './kanban/Kanban';
import { pasos } from './kanban/datosEjemplo';
import { RangoTolerancia } from './components/RangoTolerancia';
import { AsociarProducto } from './components/AsociarProducto';
import { Comentarios } from './components/Comentarios';
import { NuevoComentario } from './components/NuevoComentario';
import { LineaDeTiempo } from './components/LineaDeTiempo';
import { VistaAprobador } from './components/VistaAprobador';
import process from '../../../../common-assets/images/vcm/process.svg';
import processLine from '../../../../common-assets/images/vcm/process-line.svg';
import './_style.scss';
import { useHistory, useParams } from 'react-router-dom';
import { useComentarios } from '../../../hooks/useComentarios';
export const LineaDeProcesos = () => {
    const [ checkedColor, setCheckedColor ] = useState( true );
    const history = useHistory();
    const { id: idparam } = useParams();
    const [ productosPropuestos, setProductosPropuestos ] = useState( [] );
    const { comentarios, updateComentarios } = useComentarios( idparam );
    const activos = pasos.reduce( ( acum, paso )=>{
        const cantidad = paso.recursos.filter( recurso => recurso.tipo === "activo" ).length;
        return acum + cantidad;
    }, 0 );
    const mod = pasos.reduce( ( acum, paso )=>{
        const cantidad = paso.recursos.filter( recurso => recurso.tipo === "mod" ).length;
        return acum + cantidad;
    }, 0 );
    const total = pasos.reduce( ( acum, paso )=>{
        const cantidad = paso.recursos.length;
        return acum + cantidad;
    }, 0 );
    return (
        <div className="container-ldp">
            <div className="d-flex align-content-center mb-25">
                <img src={ process } alt="process" />
                <h1 className="linea-title">
                    Línea de procesos | Vista Principal
                    <br />
                    <span>Estás observando la línea Lorem Ipsum </span>
                </h1>
            </div>
            <h3>
                <img className="mr-15" src={ processLine } alt="process" />
                Crear Línea de Procesos
            </h3>
            <RangoTolerancia setCheckedColor={ setCheckedColor } checkedColor={ checkedColor } />
            <Tabs defaultActiveKey="ultima" id="uncontrolled-tab-example" className="mb-3">
                <Tab eventKey="ultima" title="Ultima Version">
                    <div className="container-linea mb-15">
                        <div className="version-filtrar">
                            <select className="form-control select-linea" id="recurso">
                                <option value="1">Filtrar por tipo de recurso</option>
                                <option value="2">Ejemplo</option>
                            </select>
                        </div>
                        <div className="version-resumen" >
                            <div className="version-resumen__item" >
                                <span className="text-white">Activos</span>
                                <br />
                                <span className="dato" >{ activos * 100 / total }%</span>
                            </div>
                            <div className="version-resumen__item" >
                                <span className="text-white">MOD</span>
                                <br />
                                <span className="dato" >{ mod * 100 / total }%</span>
                            </div>
                            <div className="version-resumen__velocidad" >
                                <span>Velocidad</span>
                                <br />
                                <span className="dato" >500kg/h</span>
                            </div>
                            <div className="version-resumen__velocidad" >
                                <span>Lorem Ipsum</span>
                                <br />
                                <span className="dato" >00.00</span>
                            </div>
                        </div>
                        <div className="version-colores">
                            <p><span className="version-colores__red"></span>Lorem Ipsum</p>
                            <p><span className="version-colores__yellow"></span>Lorem Ipsum</p>
                            <p><span className="version-colores__green"></span>Lorem Ipsum</p>
                        </div>
                        <div className="version-botones">
                            <button className="btn btn-white">Modo Edicion</button>
                            <button className="btn btn-blue" onClick={ ( ) =>{
                                history.push( `/vcm/ldp/crear/recursos/${ idparam }` );
                            } }>Agregar Recurso</button>
                        </div>
                    </div>
                    <Kanban checkedColor={ checkedColor } />
                </Tab>
                <Tab eventKey="versiones" title="Versiones">
                    Versiones
                </Tab>
            </Tabs>
            <h2 className="fw-900 mt-50 ">Proponer productos asociados</h2>
            <div className="row">
                <div className="col-md-6 col-xl-5">
                    <AsociarProducto setProductosPropuestos={ setProductosPropuestos } />
                    <h4 className="fw-900 mt-25">Productos propuestos</h4>
                    <div className="buscador-tabla">
                        <TablaProductos type="agregados" products={ productosPropuestos } setProductosPropuestos={ setProductosPropuestos } />
                    </div>
                    <section>
                        <h3 className="mt-30">Comentarios</h3>
                        <Comentarios comentarios={ comentarios } />
                        <NuevoComentario updateComentarios={ updateComentarios } />
                        <VistaAprobador />
                    </section>
                </div>
                <div className="col-md-6 col-xl-5 pl-50">
                    <h4 className="fw-900">Timeline</h4>
                    <LineaDeTiempo />
                </div>
            </div>
        </div>
    );
};
