import React from 'react';

export const Subtotal = ( { suministros = [ ] } ) => {
    return <>
        <h3>Sub Total</h3>
        <table className="table">
            <thead>
                <tr>
                    <th>Moneda</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{ suministros[ 0 ]?.moneda.codigo }</td>
                    <td> 
                        {
                            suministros.reduce( ( acum, suministro ) => {
                                return acum + ( suministro.costo * suministro.consumo );
                            }, 0 )
                        }
                    </td>
                </tr>
            </tbody>
        </table>
    </>;
};
