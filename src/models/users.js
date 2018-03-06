import * as userService from '../services/users';

export default {
  namespace: 'users',
  state: {
    list: [],
    total: null,
    page: 1,
  },
  reducers: {
    save(state, { payload: { data: list, total, page } }) {
      return { ...state, list, total, page }
    },    
  },
  effects: {
    *fetch({ payload: { page = 1 }}, { call, put }){
      //console.log(page);
      const { data, headers } = yield call( userService.fetch, { page });
      //console.log(data);
      yield put({ type: 'save', payload:{data: data.data, total: data.total, page:page}});
    },
    *reload( action, {put, select}){
      const page = yield select( state => state.users.page); //users 是namespace
      console.log(page);
      yield put({type:'fetch', payload:{ page : page }} );
    },

    *remove({ payload: id}, {call, put}){
      console.log(`model delete ${id}`);
      yield call( userService.remove, id );
      yield put( { type:'reload'});      
    },
    *create({ payload: values}, {call, put}){
      console.log(values);
      yield call( userService.create, values );
      yield put( { type:'reload'});      
    },
    *patch({ payload: {id, values}}, {call, put}){
      console.log(id);
      console.log(values);

      yield call( userService.patch, id, values );
      yield put( { type:'reload'});      
    },
  },
  subscriptions: {
    setup({ dispatch, history }){
      //console.log(history);
      return history.listen(( { pathname, state }) =>{
        state = state || {page: 1};
        console.log(state);
        //console.log(`${pathname} ${state}`);
        if( pathname === '/users'){
          //search = search || {page: 1};
          dispatch({type: 'fetch', payload: state});
        }
      } );
    }
  },
};
