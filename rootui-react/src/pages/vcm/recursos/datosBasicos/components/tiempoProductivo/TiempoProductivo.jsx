import React, { useState, useEffect } from 'react';
import { OverlayTrigger } from 'react-bootstrap';
import { getStorage } from '../../../../helpers/manejoStorage';
import { renderTooltip } from '../../../../helpers/renderToolTip';
import { aHorasYMinutos, aMinutos } from '../../../capacidadEsperada/detenciones/helpers/convertirMinutosHoras';
import { HorarioPersonalizado } from '../horarioPerzonalizado/HorarioPersonalizado';
import info from '../../../../../../../common-assets/images/vcm/alert-circle.png';
import "./_style.scss";

export const TiempoProductivo = ( { selected = "", setSelected, storage, setHoras, horas: horasSemanales } ) => {
    const [ toggle, setToggle ] = useState( true );
    const handleSelect = ( { target } )=>{
        setSelected( target.id );
    };
    const calcularHoras = ()=>{
        let horas = "";
        if ( selected !== "personalizado" ) {
            horas = `${ selected.split( " " )[ 0 ] * 5 }:00`;
        } else {
            const personalizado = getStorage( storage );
            horas = Object.entries( personalizado ).reduce( ( acum, [ , horario ] )=>{
                return acum + ( aMinutos( horario.fin ) - aMinutos( horario.inicio ) );
            }, 0 );
            horas = aHorasYMinutos( horas );
        }
        setHoras( horas );
    };
    useEffect( ()=>{
        if ( selected !== "personalizado" ) {
            setToggle( true );
        }
        calcularHoras();
    }, [ selected ] );
    const inputs = {
        input1: "6 horas diarias",
        input2: "8 horas diarias",
        input3: "12 horas diarias",
        input4: "24 horas diarias",
    };
    return <>
        <h2 className="mt-20">
            Tiempo Productivo
            <OverlayTrigger
                placement="right"
                delay={ { show: 250, hide: 400 } }
                overlay={ props => renderTooltip( { props, texto: "Tooltip" } ) }
            >
                <img alt="informacion" src={ info } />
            </OverlayTrigger>
        </h2>
        <p>Tiempos predeterminados <b>expresados en horas por día.</b> </p>
        {
            Object.entries( inputs ).map( ( i )=>{
                return <div key={ i[ 0 ] } className="form-check">
                    <input onChange={ handleSelect } checked={ i[ 1 ] === selected } className="form-check-input" type="radio" name="horas" id={ i[ 1 ] } />
                    <label className="form-check-label" htmlFor={ i[ 1 ] }>
                        { i[ 1 ] }
                    </label>
                </div>;
            } )
        }
        <div className="form-check">
            <input onChange={ handleSelect } checked={ "personalizado" === selected } className="form-check-input" type="radio" name="horas" id="personalizado" />
            <label className="form-check-label" htmlFor="personalizado">
                Horario personalizado secuencia semanal
            </label>
        </div>
        <div hidden={ selected !== "personalizado" }>
            <button type="button" className={ `btn btn-focus ${ toggle ? "btn-invert-feelrouk" : "btn-feelrouk-naranja2" }` }onClick={ ()=>{ 
                setToggle( ! toggle );
            } } >Personalizar Horario </button>
            <div hidden={ toggle } >
                <div className="container-horario">
                    <HorarioPersonalizado horas={ horasSemanales } setHoras={ setHoras } storage={ storage } />
                </div>
            </div>
        </div>
        <h4 className="mt-20 mb-0"> Total horas semanales: { horasSemanales } </h4>
    </>;
};
