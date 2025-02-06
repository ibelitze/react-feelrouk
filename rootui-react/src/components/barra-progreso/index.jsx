/**
 * External Dependencies
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import "./style.scss";
import { ProgressBar, Step } from "react-step-progress-bar";
import "react-step-progress-bar/styles.css";

/**
 * Component
 */
class BarraProgresoStepper extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            stepPercentage: 0,
        };
    }

    componentDidMount() {
        if ( this.props.currentStep === 1 ) {
            this.setState( { stepPercentage: 0 } );
        } else if ( this.props.currentStep === 2 ) {
            this.setState( { stepPercentage: 35 } );
        } else if ( this.props.currentStep === 3 ) {
            this.setState( { stepPercentage: 67 } );
        } else if ( this.props.currentStep === 4 ) {
            this.setState( { stepPercentage: 100 } );
        } else {
            this.setState( { stepPercentage: 0 } );
        }
    }

    componentDidUpdate( prevProps ) {
        if ( this.props.currentStep !== prevProps.currentStep ) {
            if ( this.props.currentStep === 1 ) {
                this.setState( { stepPercentage: 0 } );
            } else if ( this.props.currentStep === 2 ) {
                this.setState( { stepPercentage: 35 } );
            } else if ( this.props.currentStep === 3 ) {
                this.setState( { stepPercentage: 67 } );
            } else if ( this.props.currentStep === 4 ) {
                this.setState( { stepPercentage: 100 } );
            } else {
                this.setState( { stepPercentage: 0 } );
            }
        }
    }

    render() {
        return (
            <ProgressBar percent={ this.state.stepPercentage }>
                <Step>
                    { ( { accomplished, index } ) => (
                        <div className={ `indexedStep ${ accomplished ? 'accomplished' : null }` }>
                            { index + 1 }

                            <div className="dataLabel">
                                <p>Datos iniciales</p>
                            </div>
                        </div>
                    ) }
                </Step>
                <Step>
                    { ( { accomplished, index } ) => (
                        <div className={ `indexedStep ${ accomplished ? 'accomplished' : null }` }>
                            { index + 1 }

                            <div className="dataLabel2">
                                <p>Cuestionario</p>
                            </div>
                        </div>
                    ) }
                </Step>
                <Step>
                    { ( { accomplished, index } ) => (
                        <div className={ `indexedStep ${ accomplished ? 'accomplished' : null }` }>
                            { index + 1 }

                            <div className="dataLabel1">
                                <p>Adjuntos</p>
                            </div>
                        </div>
                    ) }
                </Step>
                <Step>
                    { ( { accomplished, index } ) => (
                        <div className={ `indexedStep ${ accomplished ? 'accomplished' : null }` }>
                            { index + 1 }

                            <div className="dataLabel3">
                                <p>Revisar y publicar</p>
                            </div>
                        </div>
                    ) }
                </Step>
            </ProgressBar>
        );
    }
}

export default connect( ( { settings } ) => (
    {
        settings,
    }
) )( BarraProgresoStepper );
