
import React from 'react';
import { useParams } from 'react-router-dom';
import { useLogs } from '../../../../hooks/useLogs';
import { ItemLinea } from './ItemLinea';
export const LineaDeTiempo = () => {
    const { id: lineaID } = useParams();
    const { logs } = useLogs( lineaID );
    
    return (
        <div className="container-linea">
            <div className="linea-tiempo">
                {
                    logs.map( ( { event, date, author, id } )=>{
                        return <ItemLinea key={ id } event={ event } date={ date } author={ author } />;
                    } )
                }
            </div>
        </div>
    );
};
