import React from 'react';
import ver from '../../../../../common-assets/images/vcm/eye.svg';
import edit from '../../../../../common-assets/images/vcm/edit.svg';
import borrar from '../../../../../common-assets/images/vcm/x-circle.svg';
export const TablaProductosDemanda = () => {
    return (
        <table className="table">
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
    );
};
