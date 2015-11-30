import { conditionalAC } from './utils';
export const enabledAC = conditionalAC((obj, state)=> {
	return !state.options.get('isDisabled')
});
