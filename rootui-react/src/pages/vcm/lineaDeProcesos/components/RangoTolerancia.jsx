import React, { useEffect, useState } from 'react';
import { useForm } from '../../../../hooks/useForm';
import filterBlue from '../../../../../common-assets/images/vcm/filter-blue.svg';
import "./_rangoTolerancia.scss";
import { getConfig, updateConfig } from '../../../../service/vcm/linea/lineaDeProcesos';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

export const RangoTolerancia = ( { setCheckedColor, checkedColor } ) => {
    const initialForm = {
        min: "0",
        intermedia: "0",
        calcular: checkedColor,
    };
    const { id: idparam } = useParams();

    const [ data, setData ] = useState( initialForm );
    const [ form, handleChange,, setForm ] = useForm( data );
    useEffect( ()=>{
        setCheckedColor( ! checkedColor );
    }, [ form.calcular ] );
    useEffect( ()=>{
        getData();
    }, [] );
    useEffect( ()=>{
        setForm( data );
    }, [ data ] );
    const getData = async()=>{
        const res = await getConfig( idparam );
        if ( res.status === 200 ) {
            setData( {
                _id: res.data.config[ 0 ]._id,
                min: res.data.config[ 0 ].tolerancia_min,
                intermedia: res.data.config[ 0 ].tolerancia_max,
                calcular: ! res.data.config[ 0 ].isrango,
            } );
        } else {
            Swal.fire( "", "Error al obtener la configuracion", "error" );
        }
    };
    const updateData = async()=>{
        const res = await updateConfig( {
            _id: form._id,
            tolerancia_min: form.min,
            tolerancia_max: form.intermedia,
            isrango: ! form.calcular,
        } );
        if ( res.status === 200 ) {
            Swal.fire( "", "Configuracion actualizada con exito", "success" );
        } else {
            Swal.fire( "", "Error al actualizar la configuracion", "error" );
        }
    };
    const styleMin = {
        backgroundImage: `linear-gradient(to right, #EE8643  calc(${ form.min }*1%), #0c0c3dcf 0)`,
    };
    const styleIntermedia = {
        backgroundImage: `linear-gradient(to right, #EE8643  calc(${ form.intermedia }*1%), #0c0c3dcf 0)`,
    };
    return (
        <div className="rangoTolerancia">
            <h3>
                <img className="mr-15" src={ filterBlue } alt="filter" />
                Definir Rango de Tolerancia
            </h3>
            <div className="containerRango">
                <div className="rango">
                    <label htmlFor="min">
                        Tolerancia minima ( color rojo )
                    </label>
                    <p className="text-center fs-18" > { form.min }% </p>
                    <input
                        id="min"
                        className=" form-range "
                        style={ styleMin }
                        name="min"
                        value={ form.min }
                        onChange={ handleChange }
                        placeholder=""
                        type="range"
                    />
                    <div style={ { display: "flex", width: "100%", justifyContent: "space-between" } }>
                        <span>0</span>
                        <span>100</span>
                    </div>
                </div>
                <div className="rango">
                    <label htmlFor="intermedia">
                        Tolerancia intermedia ( color rojo )
                    </label>
                    <p className="text-center fs-18" > { form.intermedia }% </p>
                    <input
                        id="intermedia"
                        className=" form-range "
                        style={ styleIntermedia }
                        name="intermedia"
                        value={ form.intermedia }
                        onChange={ handleChange }
                        placeholder=""
                        type="range"
                    />
                    <div style={ { display: "flex", width: "100%", justifyContent: "space-between" } }>
                        <span>0</span>
                        <span>100</span>
                    </div>
                </div>
                <div className="container-checkbox">
                    <input type="checkbox" id="calcular" name="calcular" onChange={ ( e )=>{ 
                        handleChange( {
                            target: {
                                name: e.target.name,
                                value: e.target.checked,
                            },
                        } );
                    } } checked={ form.calcular } />
                    <label htmlFor="calcular">No deseo definir rangos de tolerancia</label>
                </div>
                <button type="button" className="btn btn-blue" onClick={ updateData }>Guardar</button>
            </div>
        </div>
    );
};
