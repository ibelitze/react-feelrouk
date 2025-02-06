/*
 * hook para guardar modificar o eliminar elementos de la local storage
 * @param storage recibe el nombre de la local storage
 */
export function useLocalStorage( storage ) {
    // recibe el estado y setEstado local que almacena la localStorage en memoria, recibe el formulario y funcion de reseteo brindado por useForm 
    const handleSubmit = ( estado, setEstado, form, reset )=>{
        const existe = estado.find( e => e.id === form.id );
        if ( existe ) {
            const existentes = JSON.parse( window.localStorage.getItem( storage ) );
            const nuevo = existentes.map( ( e )=>{
                return e.id === form.id ? form : e;
            } );
            window.localStorage.setItem( storage, JSON.stringify( nuevo ) );
            setEstado( JSON.parse( window.localStorage.getItem( storage ) ) );
        } else {
            setEstado( [ ...estado, form ] );
            window.localStorage.setItem( storage, JSON.stringify( [ ...estado, form ] ) );
        }
        reset();
    };
    //recibe el item a eliminar y el setEstado del estado que almacena el storage de forma local
    const eliminar = ( { id }, setEstado )=>{
        const existentes = JSON.parse( window.localStorage.getItem( storage ) );
        const nuevo = existentes.filter( e => e.id !== id );
        window.localStorage.setItem( storage, JSON.stringify( nuevo ) );
        setEstado( JSON.parse( window.localStorage.getItem( storage ) ) );
    };
    return [ handleSubmit, eliminar ];
}
