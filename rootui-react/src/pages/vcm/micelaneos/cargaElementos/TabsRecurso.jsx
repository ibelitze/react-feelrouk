
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Tab, Tabs } from 'react-bootstrap';
import { getByEmpresa, getCategoriasBySeccion, getSubcategoriasByCategoria } from '../../../../service/vcm/micelaneos/micelaneos';
import { Recursos } from './Recursos';
import { Secciones } from './Secciones';
import { Categorias } from './Categorias';
import { Subcategorias } from './Subcategorias';

export const TabsRecurso = () => {
    const [ secciones, setSecciones ] = useState( [] );
    const [ categorias, setCategorias ] = useState( [] );
    const [ subcategorias, setSubcategorias ] = useState( [] );
    const [ selected, setSelected ] = useState( "secciones" );
    const updateSecciones = ( )=>{
        getSecciones();
    };
    const updateCategorias = ( categoria )=>{
        getCategorias( categoria );
    };
    const updateSubcategorias = ( subcategoria )=>{
        getSubcategorias( subcategoria );
    };
    
    const getSecciones = async()=>{
        const response = await getByEmpresa( "secciones" );
        if ( response.status === 200 ) {
            setSecciones( response.data.Secciones );
        } else {
            Swal.fire( "", "No se pudo obtener las secciones", "error" );
        }
    };
    const getCategorias = async( sec )=>{
        const response = await getCategoriasBySeccion( sec );
        if ( response.status === 200 ) {
            setCategorias( response.data.Categorias );
        } else {
            Swal.fire( "", "No se pudo obtener las categorias", "error" );
        }
    };
    const getSubcategorias = async( sub )=>{
        const response = await getSubcategoriasByCategoria( sub );
        if ( response.status === 200 ) {
            setSubcategorias( response.data.subcategorias );
        } else {
            Swal.fire( "", "No se pudo obtener las subcategorias", "error" );
        }
    };
    return (
        <Tabs onSelect={ ( k )=>{
            if ( selected === "secciones" ) {
                //dispara la actualizacion solo despues de salir de la pestaña secciones
                updateSecciones();
            }
            setSelected( k );
        } }>
            
            <Tab eventKey="secciones" title="Secciones">
                <Secciones secciones={ secciones } />
            </Tab>
            
            <Tab eventKey="categorias" title="Categorias">
                <Categorias secciones={ secciones } />
            </Tab>
            
            <Tab eventKey="subcategorias" title="Subcategorias">
                <Subcategorias updateCategorias={ updateCategorias } categorias={ categorias } secciones={ secciones } />
            </Tab>
            <Tab eventKey="recursos" title="Recursos">
                <Recursos 
                    updateCategorias={ updateCategorias } 
                    updateSecciones={ updateSecciones }  
                    updateSubcategorias={ updateSubcategorias }
                    secciones={ secciones }
                    categorias={ categorias }
                    subcategorias={ subcategorias }
                    setCategorias={ setCategorias }
                    setSubcategorias={ setSubcategorias }
                />
            </Tab>
        </Tabs>

    );
};
