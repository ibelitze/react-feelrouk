import React from "react";
// import { compose, withProps } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";

const MyMapTemp = withScriptjs( withGoogleMap( ( props ) =>
    <GoogleMap
        defaultZoom={ 8 }
        defaultCenter={ { lat: props.centro.lat, lng: props.centro.lng } }
        onClick={ props.ponerMarcador }
    >
        { props.isMarkerShown && <Marker position={ { lat: props.markerData.position.lat, lng: props.markerData.position.lng } } /> }
    </GoogleMap>
) );

const MyMapComponent = ( props ) =>
    <MyMapTemp
        isMarkerShown={ props.isMarkerShown }
        markerData={ props.markerData }
        ponerMarcador={ props.ponerMarcador }
        centro={ props.centro }
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCVyB7xjfw1zZ-ZIuHM5G7pyENo5_lwk_A&v=3.exp&libraries=geometry,drawing,places"
        loadingElement={ <div style={ { height: `100%` } } /> }
        containerElement={ <div style={ { height: `400px`, width: '600px' } } /> }
        mapElement={ <div style={ { height: `100%` } } /> }
    />;

export default MyMapComponent;
