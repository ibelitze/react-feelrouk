import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { createActivo } from '../../../../service/vcm/linea/activo/activos';
import { getStorage } from '../../helpers/manejoStorage';
import TablaDetenciones from '../capacidadEsperada/detenciones/components/Tabla';
import TablaSuministros from '../suministros/components/Tabla';
import './_styles.scss';
export const Revision = ( { currentStep, prev } ) => {
    const { id: idparam } = useParams();
    const history = useHistory();
    const [ suministros, setSuministros ] = useState( getStorage( `${ idparam } - suministros` ) );
    const [ detencionesProgramadas, setProgramadas ] = useState( getStorage( `${ idparam } - programadas` ) );
    const [ detencionesRelacionadas, setRelacionadas ] = useState( getStorage( `${ idparam } - relacionadas` ) );
    const [ datosBasicos, setBasicos ] = useState( getStorage( `${ idparam } - datos basicos` ) );
    const [ capacidadNominal, setNominal ] = useState( );
    const [ capacidadEsperada, setEsperada ] = useState( );
    useEffect( ()=>{
        setSuministros( getStorage( `${ idparam } - suministros` ) );
        setProgramadas( getStorage( `${ idparam } - programadas` ) );
        setRelacionadas( getStorage( `${ idparam } - relacionadas` ) );
        setBasicos( getStorage( `${ idparam } - datos basicos` ) );
        setNominal( getStorage( `${ idparam } - capacidad nominal` ) );
        setEsperada( getStorage( `${ idparam } - capacidad esperada` ) );
    }, [ currentStep ] );
    const handleCreateActivo = async()=>{
        const response = await createActivo( idparam );
        if ( response.status === 200 ) {
            Swal.fire( "", "Activo creado correctamente", "success" );
            history.push( `/vcm/ldp/${ idparam }` );
        }
        if ( response.status === 500 ) {
            Swal.fire( "", "Error al crear el activo", "error" );
        }
    };
    if ( currentStep !== 5 ) {
        return null;
    }

    return (
        <div className="container-revision">
            <h2>5 - Revisar Activo</h2>
            <p>
                Nombre: { datosBasicos.nombre } <br />
                Paso: { datosBasicos.ubicacion } <br />
                Criticidad: { datosBasicos.criticidad } <br />
                Eficiencia: { datosBasicos.eficiencia }
            </p>
            <div className="separador">
                <h4 className="fw-900 txt-orange" >Horario Semanal</h4>
                <strong>Total Horas Semanales: { datosBasicos.horas } Horas</strong>
            </div>
            { /* <div className="separador">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Pasos</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Lorem Ipsum</td>
                        </tr>
                    </tbody>
                </table>
            </div> */ }
            <div className="separador">
                <h4 className="fw-900 txt-orange" >Suministros</h4>
                <TablaSuministros className="mt-2" hide={ true } id={ null } suministros={ suministros } />
            </div>
            <div className="separador">
                <h4 className="fw-900 txt-orange" >Capacidad Nominal</h4>
                <p>
                    Funcionamiento: { capacidadNominal?.funcionamiento }<br />
                    Unidad de tiempo: { capacidadNominal?.tiempo.codigo }<br />
                    Ciclo Productivo: { capacidadNominal?.ciclo }<br />
                    Unidad de medida: { capacidadNominal?.medida.codigo }<br />
                    Capacidad: { capacidadNominal?.capacidad }<br />
                    Total Horas Semanales 0 Horas<br />
                    <strong>Producción por ciclo 0 Kilos/Hora</strong>
                </p>
            </div>
            <div className="separador">
                <h4 className="fw-900 txt-orange" >Detenciones Programadas</h4>
                <TablaDetenciones className="mt-2" detenciones={ detencionesProgramadas } hide={ true } />
            </div>
            <div className="separador">
                <h4 className="fw-900 txt-orange" >Detenciones Relacionadas</h4>
                <TablaDetenciones className="mt-2" detenciones={ detencionesRelacionadas } hide={ true } />
            </div>
            <div className="separador">
                <h4 className="fw-900 txt-orange" >Capacidad Esperada</h4>
                <p>
                    Funcionamiento: { capacidadEsperada.funcionamiento }<br />
                    Unidad de tiempo: { capacidadEsperada.tiempo.codigo }<br />
                    Ciclo Productivo: { capacidadEsperada.ciclo }<br />
                    Unidad de medida: { capacidadEsperada.medida.codigo }<br />
                    Capacidad: { capacidadEsperada.capacidad }<br />
                </p>
            </div>
            <div className="d-flex justify-content-between w-100">
                <button onClick={ ()=>{
                    prev();
                } } type="button" className="btn btn-feelrouk-naranja2 btn-blue">Volver</button>
                <button onClick={ ()=>{
                    handleCreateActivo();
                } } type="button" className="btn btn-feelrouk-naranja2">Confirmar</button>
            </div>
        </div>
    );
};
