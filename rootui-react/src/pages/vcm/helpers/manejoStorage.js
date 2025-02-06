export const setStorage = ( name, value )=>{
    window.localStorage.setItem( name, JSON.stringify( value ) );
};
export const getStorage = ( name )=>{
    return ( JSON.parse( window.localStorage.getItem( name ) ) );
};
export const deleteStorage = ( name )=>{
    window.localStorage.removeItem( name );
};
