import axios from 'axios';
const API_URL = 'https://api.coindesk.com/v1/bpi';

export default{
    
    constructor(){},
    prueba1() {},
    getRate(){
        const url = `${API_URL}/currentprice.json`;
        return axios.get(url);        
    }
}
