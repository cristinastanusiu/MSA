import createDataContext from './createDataContext';

const authReducer = (state, action) => {
  switch (action.type) {
    case 'signout':
      return {token: null, phoneNumber: ''};
    case 'signin':
    case 'signup':
      return {
        token: action.payload.token,
        email: action.payload.phoneNumber,
      };
    default:
      return state;
  }
};

const signup = dispatch => {
  return ({phoneNumber, password}) => {
    console.log('Signup');
  };
};

const signin = dispatch => {
  return ({phoneNumber, password}) => {
    let token = 'null';
    // axios.post('http://192.168.0.175:8080/login',
    // {
    //   phoneNumber: phoneNumber,
    //   password: password
    // }).then(res => console.log(res));

    console.log('Signin');
    dispatch({
      type: 'signin',
      payload: {
        token: 'some access token here',
        phoneNumber,
      },
    });
  };
};

const signout = dispatch => {
  return () => {
    dispatch({type: 'signout'});
  };
};

export const {Provider, Context} = createDataContext(
  authReducer,
  {signin, signout, signup},
  {token: null, phoneNumber: ''},
);
