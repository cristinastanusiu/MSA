import createDataContext from './createDataContext';
import axios from 'axios';
import Toast from 'react-native-toast-message';

const authReducer = (state, action) => {
  switch (action.type) {
    case 'signout':
      return {token: null, phoneNumber: '', message: "You've been logged out."};
    case 'signin':
      return {
        token: action.payload.token,
        phoneNumber: action.payload.phoneNumber,
        message: action.payload.message
      };
    case 'signup':
      return {
        token: action.payload.token,
        phoneNumber: action.payload.phoneNumber,
        message: action.payload.message
      };
    default:
      return state;
  }
};

const signup = dispatch => {
  return ({phoneNumber, password, firstName, lastName}) => {
    console.log('Signup');
    let token='';
    let message='';

    axios.post('http://ec2-3-10-56-236.eu-west-2.compute.amazonaws.com:8080/addUser',
    {
      phoneNumber: phoneNumber,
      firstName: firstName,
      lastName: lastName,
      password: password
    }).then(res => {
              token=res.status;
              message=res.data;
              dispatch({
                type: 'signup',
                payload: {
                  token,//this should be a token, but currently not using token based auth
                  phoneNumber,
                  message,
                },
              });
              Toast.show({
                text1: 'Welcome',
                text2: message +'👋'
              });
            },
            err => {
              token=err.response.status;
              message=err.response.data;
              dispatch({
                type: 'signup',
                payload: {
                  token,//this should be a token, but currently not using token based auth
                  phoneNumber,
                  message,
                },
            });
            Toast.show({
              text1: 'Oops..',
              text2: message +'👋',
              type: "error"
            });
          });
  };
};

const signin = dispatch => {
  return ({phoneNumber, password}) => {
    let token='';
    let message='';

    axios.post('http://ec2-3-10-56-236.eu-west-2.compute.amazonaws.com:8080/login',
    {
      phoneNumber: phoneNumber,
      password: password
    }).then(res => {
              token=res.status;
              message=res.data;
              dispatch({
                type: 'signin',
                payload: {
                  token,//this should be a token, but currently not using token based auth
                  phoneNumber,
                  message,
                },
              });
              Toast.show({
                text1: 'Hello',
                text2: message +'👋'
              });
            },
            err => {
              token=err.response.status;
              message=err.response.data;
              dispatch({
                type: 'signin',
                payload: {
                  token,//this should be a token, but currently not using token based auth
                  phoneNumber,
                  message,
                },
            });
            Toast.show({
              text1: 'Oops..',
              text2: message +'👋',
              type: "error"
            });
          });
    console.log('Signin');
  };
};

const signout = dispatch => {
  return () => {
    Toast.show({
    text1: 'Goodbye!',
    text2: 'Hope to see you soon...' +'🥺'
  });
    dispatch({type: 'signout'});
  };
};

export const {Provider, Context} = createDataContext(
  authReducer,
  {signin, signout, signup},
  {token: null, phoneNumber: '', message:''},
);
