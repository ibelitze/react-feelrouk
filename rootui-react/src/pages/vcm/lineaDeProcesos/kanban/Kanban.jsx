import React, { useState, useEffect } from 'react';
import Board, { moveCard, moveColumn } from "@asseinfo/react-kanban";
import "@asseinfo/react-kanban/dist/styles.css";
import { KanbanHeader } from './kanbanHeader/KanbanHeader';
import { CardHeader } from './kanbanCards/cardsHeader/CardHeader';
import "./_style.scss";
import { CardBody } from './kanbanCards/cardsBody/CardBody';
import { useDataKanban } from '../../../../hooks/useDataKanban';
import { useParams } from 'react-router-dom';
import { updateActivo, updateMods } from '../../../../service/vcm/linea/activo/activos';
import { updatePaso } from '../../../../service/vcm/linea/lineaDeProcesos';
import { moveMods, verificarDependencias } from './utils';

export const Kanban = ( { checkedColor } ) => {
    const { id: idparam } = useParams();
    const [ dataKanban ] = useDataKanban( idparam );
    const [ info, setInfo ] = useState( [] );
    let controlledBoard = {
        columns: info?.columns?.map(
            ( { id, cards, title } )=>{
                return {
                    id,
                    title: <KanbanHeader checkedColor={ checkedColor } cards={ cards } title={ title } id={ id } setInfo={ setInfo } moved={ info.moved } key={ id } />,
                    cards: cards.map( ( card )=>{
                        return {
                            id: card.id,
                            title: <CardHeader checkedColor={ checkedColor } length={ cards.length } title={ card.title } key={ card.id } />,
                            description: <CardBody description={ card.description } key={ card.id } /> };
                    } ),
                };
            }
        ),
    };
    useEffect( ()=>{
        if ( dataKanban.columns ) {
            setInfo( dataKanban );
        }
    }, [ dataKanban ] );
    const actualizarBoard = ( updatedBoard )=>{
        const columnas = updatedBoard.columns?.map(
            ( { id, cards, title } )=>{
                return {
                    id,
                    title: <KanbanHeader checkedColor={ checkedColor } cards={ cards } title={ title } setInfo={ setInfo } moved={ updatedBoard.moved } id={ id } key={ id } board={ updatedBoard } />,
                    cards: cards.map(
                        ( card )=>{
                            return {
                                id: [ card.id ],
                                title: <CardHeader checkedColor={ checkedColor } title={ card.title } key={ card.id } />,
                                description: <CardBody description={ card.description } key={ card.id } />,
                            };
                        }
                    ),
                };
            }
        );
        controlledBoard = { columns: columnas, moved: true };
    };

    const actualizarData = ( updatedBoard, modId )=>{
        return {
            ...updatedBoard,
            columns: updatedBoard.columns.map( ( column, index )=>{
                updatePaso( column.id, { posicion: index + 1 } ).then( console.log ).catch( console.log );
                return {
                    posicion: index + 1,
                    id: column.id,
                    title: column.title,
                    cards: column.cards.map( ( card )=>{
                        if ( card.description.tipo === "activo" ) {
                            updateActivo( card.id, { rel_paso: column.id } ).then( console.log ).catch( console.log );
                        } else {
                            const body = {
                                rel_paso: column.id,
                            };
                            if ( card.id === modId ) {
                                body.rel_modulo = modId;
                                updateMods( card.id, {
                                    ...body,
                                    tipo_relacion: {
                                        _id: "",
                                        tipo: "No relacionada",
                                    },
                                } ).then( console.log ).catch( console.log );
                            } else {
                                updateMods( card.id, body ).then( console.log ).catch( console.log );
                            }
                        }
                        return {
                            id: card.id,
                            title: card.title,
                            description: { ...card.description,
                                rel_paso: column.id,
                            },
                        };
                    } ),
                };
            } ),
        };
    };

    const handleCardMove = async( _card, source, destination ) => {
        console.log( source, destination, info );
        const resp = await verificarDependencias( _card, info, source );
        if ( resp?.isConfirmed || resp === true ) {
            let updateData = moveCard( info, source, destination );
            resp.events?.forEach( ( cardId )=>{
                updateData = moveMods( updateData, source, destination, cardId, moveCard );
            } );

            const updatedBoard = actualizarData( updateData, _card.id );
            actualizarBoard( updatedBoard );
            setInfo( updatedBoard );
        }
    };
    const handleColumnMove = ( _column, source, destination ) => {
        const updatedBoard = actualizarData( moveColumn( info, source, destination ), _column.id );
        updatedBoard.moved = true;
        actualizarBoard( updatedBoard );
        setInfo( updatedBoard );
    };
    if ( ! info.columns ) {
        return null;
    }
    return (
        <Board onCardDragEnd={ handleCardMove } onColumnDragEnd={ handleColumnMove }>
            { controlledBoard }
        </Board>
    );
};
