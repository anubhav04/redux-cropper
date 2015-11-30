import R from 'ramda';

export const conditionalAC = (cond)=>(ac)=>(obj)=>
	(dispatch, getState) => {
		if (!cond(obj, getState())) {
			return;
		}

		const acResult = ac(obj);
		if (!acResult) {
			return
		}

		dispatch(acResult);
	};


//const composeAC = ()
