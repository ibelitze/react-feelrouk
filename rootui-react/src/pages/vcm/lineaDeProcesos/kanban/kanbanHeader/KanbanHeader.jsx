// import { Chart } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import React from 'react';
import settings from '../../../../../../common-assets/images/vcm/settings.svg';
import arrows from '../../../../../../common-assets/images/vcm/arrows.svg';
import filter from '../../../../../../common-assets/images/vcm/filter.svg';
import settingsRecursos from '../../../../../../common-assets/images/vcm/settings-sliders.svg';
import velocimetro from '../../../../../../common-assets/images/vcm/fastest.svg';
import "./_style.scss";
export const KanbanHeader = ( { id, moved, setInfo, title, cards, checkedColor } ) => {
    if ( moved ) {
        setInfo( info => { 
            return { ...info, moved: false };
        } );
    }
    const total = cards.length;
    const activos = cards.filter( card => card.description.tipo === "activo" ).length;
    const mods = cards.filter( card => card.description.tipo === "mod" ).length;
    const porcentajeMOD = mods * 100 / ( total || 1 ); 
    const porcentajeActivo = activos * 100 / ( total || 1 );
    const costoTotal = cards.reduce( ( acum = 0, card )=>{ 
        return acum + card.description.costo; 
    }, 0 );
    const costoActivos = cards.filter( card => card.description.tipo === "activo" ).reduce( ( acum = 0, card )=>{ 
        return acum + card.description.costo; 
    }, 0 );
    const costoMOD = cards.filter( card => card.description.tipo === "mod" ).reduce( ( acum = 0, card )=>{ 
        return acum + card.description.costo; 
    }, 0 );
    const createData = ( data, color = 'rgba(255, 205, 86, 0.2)' )=>{
        return {
            labels: [ '' ],
            datasets: [ {
                label: 'Costos',
                data: [ data ],
                backgroundColor: [
                    color,
                ],
                borderWidth: 1,
            } ],
        };
    };
    const createOptions = ( data )=>{
        return {
            indexAxis: 'y',
            responsive: true,
            layout: {
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grace: costoTotal - data,
                    ticks: {
                        callback: function() {
                            return null;
                        },
                    },
                },
            },
            plugins: {
                legend: {
                    display: false,
                },
            },
        };
    };
    const color = ( )=>{
        if ( ! checkedColor ) {
            return "blue";
        }
        if ( total < 2 ) {
            return "red";
        }
        if ( total >= 3 ) {
            return "green";
        }
        if ( total === 2 ) {
            return "yellow";
        }
    };
    return <div className="header-container">
        <h2 className={ `header-title ${ color() }` } >
            <div className="text-white">
                <button className="header-button mr-10"><img className="header-icon" alt="button" src={ arrows } /></button>
                { title }
            </div>
            <button className="header-button"><img className="header-icon" alt="button" src={ settings } /></button>
        </h2>
        <div className="header-tablero">
            <section className="header-filtros"> 
                <button className="header-button">
                    <img className="header-icon" alt="button" src={ filter } />
                </button>
                <select className="header-input">
                    <option>Tipo de Recurso</option>
                </select>
                <div className="header-search">
                    <input type="text" className="header-input" />
                    <img className="header-icon" alt="button" src="https://img.icons8.com/ios-glyphs/30/000000/search--v1.png" />
                </div>
            </section>
            <section className="header-graficos mt-10" > 
                <div className="header-porcentajes">
                    <img className="header-icon" alt="button" src={ settingsRecursos } />
                    <div className="header-porcentajes__activos m-0">
                        <small>Activos</small>
                        <h3 className="m-0">{ porcentajeActivo.toFixed( 0 ) }%</h3>
                    </div>
                    <div className="header-porcentajes__mod">
                        <small >MOD</small>
                        <h3 className="m-0">{ porcentajeMOD.toFixed( 0 ) }%</h3>
                    </div>
                </div>
                <div className="header-velocidad">
                    <img className="header-icon" alt="button" src={ velocimetro } />
                    <div className="header-porcentajes__velocidad m-0">
                        <small>Velocidad</small>
                        <h3 className="m-0">500 Kg/h</h3>
                    </div>
                </div>
            </section>
            <div className="container-costos">
                <div className="costos">
                    <h3><span className="circle" style={ { backgroundColor: '#0c0c3d' } }></span>{ costoActivos }</h3>
                    <span>costo activos</span>
                    <div className="container-canvas">
                        {
                            ! moved ?
                                <Bar datasetIdKey={ "grafico" + id } key={ "chart" + id } options={ createOptions( costoActivos ) } data={ createData( costoActivos, '#0c0c3d' ) } height={ "75px" } /> :
                                "Cargando..."
                        }
                    </div>
                </div>
                <div className="costos">
                    <h3><span className="circle" style={ { backgroundColor: "#ee8643" } }></span>{ costoMOD }</h3>
                    <span>costo MOD</span>
                    <div className="container-canvas">
                        {
                            ! moved ?
                                <Bar datasetIdKey={ "grafico" + id } key={ "chart" + id } options={ createOptions( costoMOD ) } data={ createData( costoMOD, "#ee8643" ) } height={ "75px" } /> :
                                "Cargando..."
                        }
                    </div>
                </div>
                <div className="costos">
                    <h3> <span className="circle" style={ { backgroundColor: "#00d3d3" } }></span>{ costoTotal }</h3>
                    <span>costo total</span>
                    <div className="container-canvas">
                        {
                            ! moved ?
                                <Bar datasetIdKey={ "grafico" + id } key={ "chart" + id } options={ createOptions( costoTotal ) } data={ createData( costoTotal, '#00d3d3' ) } height={ "75px" } /> :
                                "Cargando..."
                        }
                    </div>
                </div>
            </div>
        </div>
    </div>;
};
