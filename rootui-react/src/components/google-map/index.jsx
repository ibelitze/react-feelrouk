import React, { Component } from 'react';
import MyMapComponent from './content';

class MyGoogleMap extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            isMarkerShown: false,
            data: {
                title: "Ubicación",
                name: "",
                position: { 
                    lat: -33.4394, 
                    lng: -70.71402,
                },
            },
        };

        this.delayedShowMarker = this.delayedShowMarker.bind( this );
        this.ponerMarcador = this.ponerMarcador.bind( this );
    }

    componentDidMount() {
        this.delayedShowMarker();
    }

    delayedShowMarker() {
        setTimeout( () => {
            this.setState( { isMarkerShown: true } );
        }, 300 );
    }

    ponerMarcador( data ) {
        this.setState( { isMarkerShown: false } );
        this.delayedShowMarker();
        const { latLng } = data;
        const lat = latLng.lat();
        const lng = latLng.lng();

        this.setState( {
            data: {
                title: "Ubicación",
                name: "",
                position: { 
                    lat: lat, 
                    lng: lng,
                },
            },
        } );

        this.props.obtenerDireccion( lat, lng );
    }

    render() {
        return (
            <MyMapComponent
                isMarkerShown={ this.state.isMarkerShown }
                ponerMarcador={ this.ponerMarcador }
                markerData={ this.state.data }
                lat={ this.state.lat }
                lng={ this.state.lng }
                centro={ this.state.position }
            />
        );
    }
}

export default MyGoogleMap;
