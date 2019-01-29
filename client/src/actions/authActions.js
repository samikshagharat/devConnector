import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

import {GET_ERRORS, SET_CURRENT_USER} from './types';

// Register User
export const registerUser = (userData, history) => dispatch  => {
    console.log(userData)
        axios
        .post('/user/register',userData)
       .then(res => history.push('/login')) 
       .catch(err=>
        dispatch ({
            type: GET_ERRORS,
            payload: err.response.data
        })
        ); 
};

// Log-In Get user token

export const loginUser = userData=> dispatch => {
    console.log(userData);
    axios.post('/user/login',userData)
    .then(res => {
        // save to local storage
        const{ token } =res.data;
        // set token to ls
        localStorage.setItem('jwtToken', token);
        // set token to auth header
        setAuthToken(token);
        // decode token to get user data
        const decoded = jwt_decode(token);
        // set current user
        dispatch(setCurrentUser(decoded));
    })
    .catch(err=> 
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
        
    );
};

// Set logged in user
export const setCurrentUser = (decoded)=> {
    return {
        type: SET_CURRENT_USER,
        payload:decoded
    }
}

// log user out
export const logoutUser =() => dispatch => {
    // remove tokn from local storage
    localStorage.removeItem('jwtToken')
    // remove auth header fro futre requests
    setAuthToken(false);
    // set current user to {} which will set isAuthenticated to false
    dispatch(setCurrentUser({}));
}