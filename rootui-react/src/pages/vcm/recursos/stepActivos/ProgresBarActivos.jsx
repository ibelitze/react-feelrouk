import React, { useEffect } from "react";
import "./_progresBarActivos.scss";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";

export const ProgresBarActivos = ( { currentStep = 1 } ) => {
    const stepPercentage = ( 100 / 4 ) * ( currentStep - 1 );
    const calcularPorcentaje = ()=>{
        if ( currentStep === 3 ) {
            return "width: 25%";
        } else if ( currentStep === 4 ) {
            return "width: 50%";
        } else if ( currentStep === 5 ) {
            return "width: 75%";
        }
        return "width: 0%";
    };
    useEffect( ()=>{
        const html = document.querySelector( ".RSPBprogressBar" );
        const div = document.createElement( "div" );
        div.className = "RSPBprogression bg-blue edit-progress";
        div.style = calcularPorcentaje();
        html.appendChild( div );
    }, [] );
    useEffect( ()=>{
        const div = document.querySelector( ".edit-progress" );
        div.style = calcularPorcentaje();
    }, [ currentStep ] );
    return (
        <>  
            <ProgressBar percent={ stepPercentage }>
                <Step>
                    { ( { accomplished, index } ) => (
                        <div
                            className={ `indexedStep ${ accomplished ? "accomplished" : null } ${ currentStep > ( index + 1 ) ? "bg-blue" : null }` }
                        >
                            { index + 1 }
                            
                            <p className={ `label-step ${ accomplished ? "txt-orange" : null } ${ currentStep > ( index + 1 ) ? "txt-blue" : null }` }>Datos básicos</p>
                        </div>
                    ) }
                </Step>
                <Step>
                    { ( { accomplished, index } ) => (
                        <div
                            className={ `indexedStep ${ accomplished ? "accomplished" : null } ${ currentStep > ( index + 1 ) ? "bg-blue" : null }` }
                        >
                            { index + 1 }
                            <p className={ `label-step ${ accomplished ? "txt-orange" : null } ${ currentStep > ( index + 1 ) ? "txt-blue" : null }` }>Suministros</p>
                        </div>
                    ) }
                </Step>
                <Step>
                    { ( { accomplished, index } ) => (
                        <div
                            className={ `indexedStep ${ accomplished ? "accomplished" : null } ${ currentStep > ( index + 1 ) ? "bg-blue" : null }` }
                        >
                            { index + 1 }
                            <p className={ `label-step ${ accomplished ? "txt-orange" : null } ${ currentStep > ( index + 1 ) ? "txt-blue" : null }` }>Cap. Nominal</p>
                        </div>
                    ) }
                </Step>
                <Step>
                    { ( { accomplished, index } ) => (
                        <div
                            className={ `indexedStep ${ accomplished ? "accomplished" : null } ${ currentStep > ( index + 1 ) ? "bg-blue" : null }` }
                        >
                            { index + 1 }
                            <p className={ `label-step ${ accomplished ? "txt-orange" : null } ${ currentStep > ( index + 1 ) ? "txt-blue" : null }` }>Cap. Esperada</p>
                        </div>
                    ) }
                </Step>
                <Step>
                    { ( { accomplished, index } ) => (
                        <div
                            className={ `indexedStep ${ accomplished ? "accomplished" : null } ${ currentStep > ( index + 1 ) ? "bg-blue" : null }` }
                        >
                            { index + 1 }
                            <p className={ `label-step ${ accomplished ? "txt-orange" : null } ${ currentStep > ( index + 1 ) ? "txt-blue" : null }` }>Revisión</p>
                        </div>
                    ) }
                </Step>
            </ProgressBar> 
        </>
    );
};
