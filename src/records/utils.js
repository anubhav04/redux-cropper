export const limitRecordOffset = (record)=> {
	let newRecord = record;
	if (isCoordOverflow('x')(newRecord)) {
		newRecord = newRecord.updateIn(['offset', 'x'], ()=>newRecord.get('oldLeft'))
	}

	if (isCoordOverflow('y')(newRecord)) {
		newRecord = newRecord.updateIn(['offset', 'y'], ()=>newRecord.get('oldTop'))
	}
	return record
};

export const isCoordOverflow = (coord)=>(record)=> {
	const size = record.get('size');
	const maxSize = record.get('maxSize');
	const minSize = record.get('minSize');
	if(!maxSize || !minSize){
		return false;
	}

	return size.get(coord) > maxSize.get(coord) || size.get(coord) < minSize.get(coord);
};

export const limitRecordSize = (record)=> {
	if(!record.get('minSize') || !record.get('maxSize')){
		return record;
	}

	return record.update('size', (size)=>size.max(record.get('minSize')).min(record.get('maxSize')));
};

export const limitRecordPoint = (propName)=> {
	let minProp, maxProp;
	const postfix = propName.slice(1);
	const camelLetter = propName[0].toUpperCase();
	minProp = `min${camelLetter}${postfix}`;
	maxProp = `max${camelLetter}${postfix}`;
	return (record)=>{
		if(!record.get(minProp) || !record.get(maxProp)){
			return record;
		}
		return record.update(propName, (prop)=>prop.max(record.get(minProp)).min(record.get(maxProp)));
	}
};

