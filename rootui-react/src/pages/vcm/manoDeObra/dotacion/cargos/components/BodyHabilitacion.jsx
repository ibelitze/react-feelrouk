import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getRecursos } from '../../../../../../service/vcm/micelaneos/micelaneos';
import { getStorage, setStorage } from '../../../../helpers/manejoStorage';
import "./_styles.scss";
export const BodyHabilitacion = ( { filters, cargo, setHabilitaciones } ) => {
    const { id: idLinea } = useParams();
    const [ cantidad, setCantidad ] = useState( 0 );
    const [ recursos, setRecursos ] = useState( [ ] );
    useEffect( ()=>{
        getRecursos();
    }, [] );
    useEffect( ()=>{
        getRecursosFiltered();
    }, [ filters ] );
    const getRecursosFiltered = async( ) => {
        let response;
        setRecursos( [] );
        if ( filters.subcategoria ) {
            response = await getRecursos( "subcategoria", filters.subcategoria );
        } else if ( filters.categoria ) {
            response = await getRecursos( "categoria", filters.categoria );
        } else if ( filters.seccion ) {
            response = await getRecursos( "seccion", filters.seccion );
        }
        if ( response?.status === 200 ) {
            setRecursos( response.data.Recursos );
        }
    };
    const handleAddRecurso = ( recurso ) => {
        const cargados = getStorage( `${ idLinea } - habilitaciones` );
        if ( cantidad > 0 ) {
            if ( cargados?.length ) {
                const recursoCargado = cargados.filter( ( habilitacion ) => habilitacion.cargo.id === cargo.id && habilitacion.recurso._id === recurso._id );
                if ( recursoCargado.length ) {
                    const habilitacionesActualizadas = cargados.map( ( habilitacion )=>{
                        if ( habilitacion.recurso._id === recurso._id && habilitacion.cargo.id === cargo.id ) {
                            return {
                                recurso,
                                cantidad,
                                cargo: habilitacion.cargo,
                            };
                        }
                        return habilitacion;
                    } );
                    setStorage( `${ idLinea } - habilitaciones`, habilitacionesActualizadas );
                    setHabilitaciones( habilitacionesActualizadas );
                } else {
                    setStorage( `${ idLinea } - habilitaciones`, [ ...cargados, { recurso, cargo, cantidad } ] );
                    setHabilitaciones( [ ...cargados, { recurso, cargo, cantidad } ] );
                }
            } else {
                console.log( "entra siempre" );
                setStorage( `${ idLinea } - habilitaciones`, [ { recurso, cargo, cantidad } ] );
                setHabilitaciones( [ { recurso, cargo, cantidad } ] );
            }
            Swal.fire( "", "El recurso ha sido agregado correctamente", "success" );
        } else {
            Swal.fire( "", "Debe ingresar una cantidad correcta", "warning" );
        }
    };
    return (
        <div className="container-body-habilitacion">
            <div className="search-body-habilitacion">
                <h3>Listado de activos disponibles para asignación</h3>
                <div className="habilitacion-mod-search">
                    <input type="text" className="habilitacion-mod-search__input" />
                    <img className="header-icon" alt="button" src="https://img.icons8.com/ios-glyphs/30/000000/search--v1.png" />
                </div>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Nombre</th>
                        <th scope="col">Modelo</th>
                        <th scope="col">Cantidad</th>
                        <th scope="col">Costo Mensual</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        recursos.map( ( recurso )=>{
                            return <tr key={ recurso._id }>
                                <td> { recurso.nombre } </td>
                                <td>{ recurso.modelo }  </td>
                                <td>
                                    <input className="form-control" type="number" name={ recurso.id } min="0" value={ cantidad } onChange={
                                        ( e )=>{
                                            setCantidad( e.target.value );
                                        }
                                    } id="" />
                                </td>
                                <td>
                                    { recurso.costo }
                                    <button type="btn" className="btn" onClick={
                                        ()=>{
                                            handleAddRecurso( recurso );
                                        }
                                    }>
                                        <img alt="button" src="https://img.icons8.com/material-outlined/24/undefined/add.png" />
                                    </button>
                                </td>
                            </tr>;
                        } )
                    }
                </tbody>
            </table>
        </div>
    );
};
