import createDataContext from './createDataContext';
import axios from 'axios';

const agendaReducer = (state, action) => {
  switch (action.type) {
    case 'updateState':
      return {
        agenda: action.payload.agenda
      };
    default:
      return state;
  }
};

const updateState = dispatch => {
  return ({agenda}) => {
    dispatch({
      type: 'updateState',
      payload: {
        agenda
      },
    });
  };
};

export const {Provider, Context} = createDataContext(
  agendaReducer,
  {updateState},
  {agenda: []},
);
