// import createContactsContext from './createContactsContext';
// import axios from 'axios';
//
// const agendaReducer = (state, action) => {
//   switch (action.type) {
//     case 'updateState':
//       return {agenda: action.payload.agenda};
//     default:
//       return state;
//   }
// };
//
// const updateState = dispatch => {
//   return (agenda) => {
//
//     dispatch({
//       type: 'updateState',
//       payload: {
//         agenda
//       },
//     });
//   };
// };
//
// const intialState = [{phone:"", name:""}]
//
// export const {Provider, Context} = createContactsContext(
//   agendaReducer,
//   {updateState},
//   {agenda: intialState},
// );
