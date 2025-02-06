import React from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import './_rangoTolerancia.scss';
import edit from '../../../../../common-assets/images/vcm/edit.svg';
import search from '../../../../../common-assets/images/vcm/search.svg';
import ver from '../../../../../common-assets/images/vcm/eye.svg';
import borrar from '../../../../../common-assets/images/vcm/x-circle.svg';
import boxImg from '../../../../../common-assets/images/vcm/box.svg';
import { useLineas } from '../../../../hooks/useLineas';
import { deleteLineaById } from '../../../../service/vcm/linea/lineaDeProcesos';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';

export const TablaLDP = () => {
    const [ lineas, updateLineas ] = useLineas();
    const history = useHistory();
    const handleDelete = async( id )=>{
        const res = await deleteLineaById( id );
        if ( res.status === 200 ) {
            Swal.fire( "", "Linea de proceso eliminada con exito", "success" );
            updateLineas();
        } else {
            Swal.fire( "", "Error al eliminar la linea de proceso", "error" );
        }
    };
    return (
        <section className="container-section">
            <div className="title-primary">
                <h1>
                    <img src={ boxImg } alt="box" />
                    <span>Líneas de Proceso</span> 
                </h1>
                <button type="button" className="btn btn-orange" onClick={ ()=>{
                    history.push( "/vcm/ldp/crear" );
                } }>Crear Línea de Proceso</button>
            </div>
            <Tabs>
                <Tab eventKey="activas" title="Activas">
                    <div className="search-lineas">
                        <h2 className="title-versiones">Líneas de proceso - Versiones Activas</h2>
                        <div className="productos-asociados-search">
                            <input type="text" className="productos-asociados-search__input" />
                            <img alt="button" src={ search } />
                        </div>
                    </div>
                    { /* <div className="table-responsive" >
                        <table className="table" style={ { minWidth: "1200px" } }>
                            <thead>
                                <tr >
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Estado</th>
                                    <th scope="col">Velocidad</th>
                                    <th scope="col">Dotacion</th>
                                    <th scope="col">Producto</th>
                                    <th scope="col">Version</th>
                                    <th scope="col">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>
                                        <button type="button" className="btn-blue" >Copiar Versión</button>
                                        <button type="button" className="btn" ><img alt="ver" style={ { width: "25px" } } src={ ver } /></button>
                                        <button type="button" className="btn" ><img alt="editar" style={ { width: "25px" } } src={ edit } /> </button>
                                        <button type="button" className="btn" ><img style={ { width: "25px" } } alt="eliminar" src={ borrar } /></button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>
                                        <button type="button" className="btn-blue" >Copiar Versión</button>
                                        <button type="button" className="btn" ><img alt="ver" style={ { width: "25px" } } src={ ver } /></button>
                                        <button type="button" className="btn" ><img alt="editar" style={ { width: "25px" } } src={ edit } /> </button>
                                        <button type="button" className="btn" ><img style={ { width: "25px" } } alt="eliminar" src={ borrar } /></button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>
                                        <button type="button" className="btn-blue" >Copiar Versión</button>
                                        <button type="button" className="btn" ><img alt="ver" style={ { width: "25px" } } src={ ver } /></button>
                                        <button type="button" className="btn" ><img alt="editar" style={ { width: "25px" } } src={ edit } /> </button>
                                        <button type="button" className="btn" ><img style={ { width: "25px" } } alt="eliminar" src={ borrar } /></button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>
                                        <button type="button" className="btn-blue" >Copiar Versión</button>
                                        <button type="button" className="btn" ><img alt="ver" style={ { width: "25px" } } src={ ver } /></button>
                                        <button type="button" className="btn" ><img alt="editar" style={ { width: "25px" } } src={ edit } /> </button>
                                        <button type="button" className="btn" ><img style={ { width: "25px" } } alt="eliminar" src={ borrar } /></button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>
                                        <button type="button" className="btn-blue" >Copiar Versión</button>
                                        <button type="button" className="btn" ><img alt="ver" style={ { width: "25px" } } src={ ver } /></button>
                                        <button type="button" className="btn" ><img alt="editar" style={ { width: "25px" } } src={ edit } /> </button>
                                        <button type="button" className="btn" ><img style={ { width: "25px" } } alt="eliminar" src={ borrar } /></button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>
                                        <button type="button" className="btn-blue" >Copiar Versión</button>
                                        <button type="button" className="btn" ><img alt="ver" style={ { width: "25px" } } src={ ver } /></button>
                                        <button type="button" className="btn" ><img alt="editar" style={ { width: "25px" } } src={ edit } /> </button>
                                        <button type="button" className="btn" ><img style={ { width: "25px" } } alt="eliminar" src={ borrar } /></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div> */ }
                    <div className="table-responsive" >
                        <table className="table" style={ { minWidth: "1200px" } }>
                            <thead>
                                <tr >
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Localizacion</th>
                                    <th scope="col">Moneda</th>
                                    <th scope="col">Unidad</th>
                                    <th scope="col">Descripcion</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    lineas.map( ( linea )=>{
                                        return <tr key={ linea._id }>
                                            <td> { linea.nombre }</td>
                                            <td> { linea.rel_localizacion.nombre }</td>
                                            <td> { linea.rel_moneda.codigo }</td>
                                            <td> { linea.rel_unidades.nombre }</td>
                                            <td> { linea.descripcion }</td>
                                            <td>
                                                <button type="button" className="btn" onClick={ ()=>{
                                                    history.push( `/vcm/ldp/${ linea._id }` );
                                                } } >
                                                    <img alt="ver" style={ { width: "25px" } } src={ ver } />
                                                </button>
                                                <button type="button" className="btn" onClick={ ()=>handleDelete( linea._id ) } >
                                                    <img style={ { width: "25px" } } alt="eliminar" src={ borrar } />
                                                </button>
                                            </td>
                                        </tr>;
                                    } )
                                }
                            </tbody>
                        </table>
                    </div>
                </Tab>
                <Tab eventKey="inactivas" title="Inactivas">
                    <div className="table-responsive">
                        <table className="table" style={ { minWidth: "1200px" } }>
                            <thead>
                                <tr >
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Estado</th>
                                    <th scope="col">Velocidad</th>
                                    <th scope="col">Dotacion</th>
                                    <th scope="col">Producto</th>
                                    <th scope="col">Version</th>
                                    <th scope="col">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>
                                        <button type="button" className="btn-blue" >Copiar Versión</button>
                                        <button type="button" className="btn" ><img alt="ver" style={ { width: "25px" } } src={ ver } /></button>
                                        <button type="button" className="btn" ><img alt="editar" style={ { width: "25px" } } src={ edit } /> </button>
                                        <button type="button" className="btn" ><img style={ { width: "25px" } } alt="eliminar" src={ borrar } /></button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>
                                        <button type="button" className="btn-blue" >Copiar Versión</button>
                                        <button type="button" className="btn" ><img alt="ver" style={ { width: "25px" } } src={ ver } /></button>
                                        <button type="button" className="btn" ><img alt="editar" style={ { width: "25px" } } src={ edit } /> </button>
                                        <button type="button" className="btn" ><img style={ { width: "25px" } } alt="eliminar" src={ borrar } /></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Tab>
            </Tabs>
        </section>
    );
};
