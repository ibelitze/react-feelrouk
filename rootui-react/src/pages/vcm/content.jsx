import React from 'react';
import { Route, Switch } from "react-router-dom";
import { CrearLinea } from './crearLDP/CrearLinea';
// import Cargos from './manoDeObra/dotacion/cargos/Cargos';
import { LineaDeProcesos } from './lineaDeProcesos/LineaDeProcesos';
import { CargaProducto } from './micelaneos/cargaProducto/CargaProducto';
import { CargarMoneda } from './micelaneos/cargaMoneda/CargarMoneda';
import { CreacionDeCargos } from './micelaneos/creacionCargos/CreacionCargos';
import { TablaLDP } from './lineaDeProcesos/components/TablaLDP';
import './_styles.scss';
import footerImage from '../../../common-assets/images/footer.png';
import { CrearRecurso } from './lineaDeProcesos/CrearRecurso';
import { ProductosYServicios } from './Planificacion de Demanda/ProductosYServicios/ProductosYServicios';
import Historicos from './Planificacion de Demanda/historicos/Historicos';
import { TablaProdServ } from './Planificacion de Demanda/ProductosYServicios/TablaProdServ';
import { CargaDeCanales } from './Planificacion de Demanda/cargaDeCanales/CargaDeCanales';
import { UnidadesDeMedida } from './micelaneos/unidadesDeMedida/UnidadesDeMedida';
import { Localizaciones } from './micelaneos/localizaciones/localizaciones';
import { SuministroTipo } from './micelaneos/suministrotipo/SuministroTipo';
import { TabsRecurso } from './micelaneos/cargaElementos/TabsRecurso';
const componentes = {
    '/vcm': TablaLDP,
    '/vcm/ldp/crear/recursos/:id': CrearRecurso,
    '/vcm/ldp/crear': CrearLinea,
    '/vcm/ldp/:id': LineaDeProcesos,
    '/vcm/mantenedores/productos': CargaProducto,
    '/vcm/mantenedores/cargos': CreacionDeCargos,
    '/vcm/mantenedores/monedas': CargarMoneda,
    '/vcm/mantenedores/recursos': TabsRecurso,
    '/vcm/mantenedores/unidades': UnidadesDeMedida,
    '/vcm/mantenedores/localizaciones': Localizaciones,
    '/vcm/mantenedores/suministro-tipo': SuministroTipo,
    '/vcm/demanda/productos': TablaProdServ,
    '/vcm/demanda/carga/productos': ProductosYServicios,
    '/vcm/demanda/carga/canales': CargaDeCanales,
    '/vcm/demanda/historicos': Historicos,

};
const Content = () => {
    return (
        <Switch>
            {
                Object.keys( componentes ).map( ( path )=>{
                    const Component = componentes[ path ];
                    return <Route
                        key={ path }
                        path={ path }
                        exact
                        render={ () => (
                        
                            <div className="layout-vcm"> 
                                {
                                    <Component />
                                }
                                <div className="fixing" ></div>
                                <img src={ footerImage } alt="footer" />
                            </div>
                        ) }
                    />;
                } )
            }
        </Switch>
    );
};
export default Content;
