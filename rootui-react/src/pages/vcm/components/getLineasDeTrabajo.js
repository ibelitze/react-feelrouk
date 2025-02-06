import axios from "axios";
const getTodosLosLDT = async() => {
    const { data: { data } } = await axios.get( 'https://testing-nodefeelrouk.herokuapp.com/api/permisos/getAll' );
    return data;
};
export default getTodosLosLDT;
