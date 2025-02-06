import React, { useEffect, useState } from 'react';
import { InputGroup } from 'reactstrap';
import { getByEmpresa, getCategoriasBySeccion, getSubcategoriasByCategoria } from '../../../../../../service/vcm/micelaneos/micelaneos';
import './_styles.scss';
export const HeaderHabilitacionMOD = ( { filters, setFilters } ) => {
    const [ secciones, setSecciones ] = useState( [] );
    const [ categorias, setCategorias ] = useState( [] );
    const [ subcategorias, setSubcategorias ] = useState( [] );
    const handleChange = ( e )=>{
        setFilters( {
            ...filters,
            [ e.target.name ]: e.target.value,
        } );
    };
    useEffect( ()=>{
        getSecciones();
    }, [] );
    useEffect( ()=>{
        setSubcategorias( [] );
        setCategorias( [] );
        setFilters( {
            ...filters,
            categoria: '',
            subcategoria: '',
        } );
        if ( filters.seccion ) {
            getCategorias();
        }
    }, [ filters.seccion ] );
    useEffect( ()=>{
        getSubcategorias();
        setFilters( {
            ...filters,
            subcategoria: '',
        } );
    }, [ filters.categoria ] );
    const getSecciones = async()=>{
        const response = await getByEmpresa( 'secciones' );
        if ( response.status === 200 ) {
            setSecciones( response.data.Secciones );
        }
    };
    const getCategorias = async()=>{
        const response = await getCategoriasBySeccion( filters.seccion ); 
        if ( response.status === 200 ) {
            setCategorias( response.data.Categorias );
        }
    };
    const getSubcategorias = async()=>{
        const response = await getSubcategoriasByCategoria( filters.categoria ); 
        if ( response.status === 200 ) {
            setSubcategorias( response.data.subcategorias );
        }
    };
    return (
        <div className="header-habilitacion">
            <h3>2.2 - Habilitación MOD</h3>
            <div className="container-habilitacion">
                <InputGroup>
                    <label htmlFor="seccion-habilitacion">Sección</label>
                    <select onChange={ handleChange } id="seccion-habilitacion" className="form-select" name="seccion" aria-label="Default select example" value={ filters.seccion }>
                        <option value="">Open this select menu</option>
                        {
                            secciones.map( ( seccion )=>{
                                return <option key={ seccion._id } value={ seccion._id }>{ seccion.nombre }</option>;
                            } )
                        }
                    </select>
                </InputGroup>
                <InputGroup>
                    <label htmlFor="categoria-habilitacion">Categoría</label>
                    <select onChange={ handleChange } id="categoria-habilitacion" className="form-select" name="categoria" aria-label="Default select example" value={ filters.categoria }>
                        <option value="">Open this select menu</option>
                        {
                            categorias.map( ( categoria )=>{
                                return <option key={ categoria._id } value={ categoria._id }>{ categoria.nombre }</option>;
                            } )
                        }
                    </select>
                </InputGroup>
                <InputGroup>
                    <label htmlFor="categoria-habilitacion">Subategoría</label>
                    <select onChange={ handleChange } id="categoria-habilitacion" className="form-select" name="subcategoria" aria-label="Default select example" value={ filters.subcategoria }>
                        <option value="">Open this select menu</option>
                        {
                            subcategorias.map( ( subcategoria )=>{
                                return <option key={ subcategoria._id } value={ subcategoria._id }>{ subcategoria.nombre }</option>;
                            } )
                        }
                    </select>
                </InputGroup>
            </div>
        </div>
    );
};
