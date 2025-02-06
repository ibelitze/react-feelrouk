import React from "react";
import { Tab, Tabs } from 'react-bootstrap';
import '../_styles.scss';
import process from '../../../../../common-assets/images/vcm/process.svg';
import { CargaMasiva } from "../components/CargaMasiva";
const Historicos = () => {
    return <div className="container-carga-masiva">
        <Tabs defaultActiveKey="precios" id="uncontrolled-tab-example" className="mb-3">
            <Tab eventKey="precios" title="Precios">
                <h1 className="mt-25">
                    <img src={ process } alt="icon" />
                    Planificación de demanda | Carga Masiva de Productos / Servicios
                </h1>
                <CargaMasiva type="precios" />
            </Tab>
            <Tab eventKey="volumenes" title="Volúmenes">
                <h1 className="mt-25">
                    <img src={ process } alt="icon" />
                    Planificación de demanda | Carga Masiva de Volúmenes
                </h1>
                <CargaMasiva type="volumenes" />
            </Tab>
            <Tab eventKey="canales" title="Canales">
                <h1 className="mt-25">
                    <img src={ process } alt="icon" />
                    Planificación de demanda | Carga Masiva de Canales
                </h1>
                <CargaMasiva type="canales" />
            </Tab>
            <Tab eventKey="costos" title="Costos">
                <h1 className="mt-25">
                    <img src={ process } alt="icon" />
                    Planificación de demanda | Carga Masiva de Costos
                </h1>
                <CargaMasiva type="costos" />
            </Tab>
        </Tabs>
    </div>;
};

export default Historicos;
