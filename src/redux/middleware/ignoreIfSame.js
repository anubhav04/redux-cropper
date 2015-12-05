import { createAction } from 'redux-actions';
import Immutable from 'immutable';

const checkAction = (next, action)=>{
  if (!action) {
    next(action);
    return false;
  }

  const { IGNORE_IF_SAME } = action;
  if (!IGNORE_IF_SAME) {
    next(action);
    return false;
  }
  return true;
}

export default store => next => action => { 
  if(!checkAction(next, action)) {
    return;
  }

  const {actionName, params, selector, reducer} = action.IGNORE_IF_SAME;

  const oldState = store.getState();
  const oldSelectedState = selector(oldState)
  const newSelectedState = reducer(oldSelectedState, {payload:params})

  if(Immutable.is(newSelectedState, oldSelectedState))
  {
    return;
  }

  next(createAction(actionName)(params))  
};