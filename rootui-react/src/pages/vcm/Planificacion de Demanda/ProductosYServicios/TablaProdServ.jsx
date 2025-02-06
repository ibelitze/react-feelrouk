import React from 'react';
import '../_styles.scss';
import process from '../../../../../common-assets/images/vcm/process.svg';
import clip from '../../../../../common-assets/images/vcm/clip.png';
import search from '../../../../../common-assets/images/vcm/search.svg';
import { Tab, Tabs } from 'react-bootstrap';
import { TablaProductosDemanda } from './TablaProductosDemanda';
export const TablaProdServ = () => {
    return (
        <div className="container-carga-masiva">
            <div className="container-title">
                <h1>
                    <img src={ process } alt="icon" />
                    Planificación de demanda | Productos / Servicios
                </h1>
                <div>
                    <button className="btn btn-orange" type="button" >Carga Masiva</button>
                    <small> 
                        <img src={ clip } alt="clip" />
                        Descargar archivo de ejemplo
                    </small>
                </div>
            </div>
            <Tabs defaultActiveKey="productos" id="uncontrolled-tab-example" className="mb-3">
                <Tab eventKey="productos" title="Productos">
                    <div className="d-flex justify-content-between align-items-center w-100">
                        <h2 className="title-versiones">Lista de Productos</h2>
                        <div className="productos-asociados-search">
                            <input type="text" className="productos-asociados-search__input" />
                            <img alt="button" src={ search } />
                        </div>
                    </div>
                    <TablaProductosDemanda />
                </Tab>
                <Tab eventKey="servicios" title="Servicios">
                    <div className="d-flex justify-content-between align-items-center w-100">
                        <h2 className="title-versiones">Lista de Servicios</h2>
                        <div className="productos-asociados-search">
                            <input type="text" className="productos-asociados-search__input" />
                            <img alt="button" src={ search } />
                        </div>
                    </div>
                    <TablaProductosDemanda />
                </Tab>
            </Tabs>
        </div>
    );
};
