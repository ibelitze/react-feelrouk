import React from 'react';
import { OverlayTrigger } from 'react-bootstrap';
import { renderTooltip } from '../../../../helpers/renderToolTip';
import alert from '../../../../../../../common-assets/images/vcm/alert-circle.png';

export const RelacionMOD = ( { form, setForm, activos = [], setSelected } ) => {
    const handleSelect = ( { target } )=>{
        setForm( ( f )=>{
            return {
                ...f,
                relacion: { tipo: target.id, _id: "" },
            };
        } );
    };
    const handleChange = ( { target } )=>{
        let horas = "00:00";
        let tipoHorario = "";
        if ( target.value !== "" ) {
            horas = activos.find( ( a )=>a._id === target.value ).total_horas;
            tipoHorario = activos.find( ( a )=>a._id === target.value ).tipo_horario;
        }
        setSelected( tipoHorario );
        setForm( ( f )=>{
            console.log(
                {
                    ...f,
                    relacion: { ...f.relacion, _id: target.value },
                    horas,
                }
            );
            return {
                ...f,
                relacion: { ...f.relacion, _id: target.value },
                horas,
            };
        } );
    };
    return (
        <div>
            <h2 className="mt-20">
                Relación de la Mano de Obra
                <OverlayTrigger
                    placement="right"
                    delay={ { show: 250, hide: 400 } }
                    overlay={ props => renderTooltip( { props, texto: "Tooltip" } ) }
                >
                    <img alt="informacion" src={ alert } />
                </OverlayTrigger>
            </h2>
            <div className="form-check">
                <input onChange={ handleSelect } checked={ "No relacionada" === form.relacion.tipo } className="form-check-input" type="radio" name="rel" id="No relacionada" />
                <label className="form-check-label" htmlFor="No relacionada">
                    No relacionada
                </label>
            </div>
            <div className="form-check">
                <input onChange={ handleSelect } checked={ "Relacionada" === form.relacion.tipo } className="form-check-input" type="radio" name="rel" id="Relacionada" />
                <label className="form-check-label" htmlFor="Relacionada">
                    Relacionada
                </label>
                <br />
                <select onChange={ handleChange } onBlur={ ( )=>{ } } hidden={ "Relacionada" !== form.relacion.tipo } value={ form.relacion._id } className="form-select">
                    <option value="" selected>Selecciona una opcion</option>
                    {
                        activos.map( ( activo )=>{
                            return (
                                <option key={ activo._id } value={ activo._id }>{ activo.nombre }</option>
                            );
                        } )
                    }
                </select>
            </div>
            <div className="form-check">
                <input onChange={ handleSelect } checked={ "Indirecta" === form.relacion.tipo } className="form-check-input" type="radio" name="rel" id="Indirecta" />
                <label className="form-check-label" htmlFor="Indirecta">
                    Indirecta
                </label>
                <br />
                <select onChange={ handleChange } onBlur={ ( )=>{ } } hidden={ "Indirecta" !== form.relacion.tipo } value={ form.relacion._id } className="form-select" >
                    <option value="" selected>Selecciona una opcion</option>
                    {
                        activos.map( ( activo )=>{
                            return (
                                <option key={ activo._id } value={ activo._id }>{ activo.nombre }</option>
                            );
                        } )
                    }
                </select>
            </div>
            <div className="form-check">
                <input onChange={ handleSelect } checked={ "Supervision" === form.relacion.tipo } className="form-check-input" type="radio" name="rel" id="Supervision" />
                <label className="form-check-label" htmlFor="Supervision">
                    Supervisión
                </label>
                <br />
                <select onChange={ handleChange } onBlur={ ( )=>{ } } hidden={ "Supervision" !== form.relacion.tipo } value={ form.relacion._id } className="form-select" >
                    <option value="" selected>Selecciona una opcion</option>
                    {
                        activos.map( ( activo )=>{
                            return (
                                <option key={ activo._id } value={ activo._id }>{ activo.nombre }</option>
                            );
                        } )
                    }
                </select>
            </div>
        </div>
    );
};
