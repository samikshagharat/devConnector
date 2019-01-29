import axios from 'axios';

const setAutToken = token => {
    if(token) {
        // Applay to every requist
        axios.defaults.headers.common['Autorization']= token;
    }
    else{
        // Delete auth header
        delete axios.defaults.headers.common['Authorization'];
    }
};

export default setAutToken;