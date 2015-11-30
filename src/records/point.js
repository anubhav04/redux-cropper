/* @flow weak */
/*eslint no-new:0*/
/*eslint no-use-before-define:0*/
/*eslint new-cap:0*/

import R from 'ramda'
import {Record} from 'immutable'

const shallowCopyImToObj = (schema, imObj)=>
	R.fromPairs(R.map((key)=>[key, imObj.get(key)])(R.keys(schema)));

const schema = {
	x: undefined,
	y: undefined
};

const _PointRecord = Record(schema);
export const imPointFct = (obj)=> new PointRecord(shallowCopyImToObj(schema, obj));

class PointRecord extends _PointRecord {
	getSize() {
		return {
			width: this.get('x'),
			height: this.get('y')
		}
	}

	getOffset() {
		return {
			left: this.get('x'),
			top: this.get('y')
		}
	}

	setCoord(coordType, val) {
		return imPointFct(this.update(coordType, ()=>val))
	}

	updateCoordsOnTransform(funcX, funcY) {
		return imPointFct(this.update('x', funcX).update('y', (funcY ? funcY : funcX)))
	}

	updatePoint(coordOp, point) {
		return imPointFct(this.updateCoordsOnTransform(
			(x)=>coordOp(x, point.get('x')),
			(y)=>coordOp(y, point.get('y')))
		);
	}

	add(otherPoint) {
		return imPointFct(this.updatePoint(R.add, otherPoint))
	}

	subtract(otherPoint) {
		return imPointFct(this.updatePoint(R.add, otherPoint.negate()))
	}

	divide(otherPoint) {
		return imPointFct(this.updatePoint(R.multiply, otherPoint.inverse()))
	}

	scale(otherPoint) {
		return imPointFct(this.updatePoint(R.multiply, otherPoint))
	}

	normalizeByAspectRatio(aspectRatio) {
		let point = this;

		if (point.get('x') && point.get('y')) {
			if (point.get('y') * aspectRatio > point.get('x')) {
				point = point.set('y', point.get('x') / aspectRatio);
			} else {
				point = point.set('x', point.get('y') * aspectRatio);
			}
		} else if (point.get('x')) {
			point.set('y', point.get('x') / aspectRatio);
		} else if (point.get('y')) {
			point.set('x', point.get('y') * aspectRatio);
		}

		return imPointFct(point)
	}

	getAspectRatio() {
		return this.get('x') / this.get('y');
	}

	max(otherPoint) {
		return new PointRecord({
			x: Math.max(otherPoint.get('x'), this.get('x')),
			y: Math.max(otherPoint.get('y'), this.get('y'))
		})
	}

	min(otherPoint) {
		return new PointRecord({
			x: Math.min(otherPoint.get('x'), this.get('x')),
			y: Math.min(otherPoint.get('y'), this.get('y'))
		})
	}

	addScalar(val) {
		return imPointFct(this.updatePoint(R.add, pointFromScalarFct(val)))
	}

	scaleScalar(val) {
		return imPointFct(this.updatePoint(R.multiply, pointFromScalarFct(val)))
	}

	divideScalar(val) {
		return imPointFct(this.scaleScalar(1/val))
	}

	negate() {
		return imPointFct(this.updateCoordsOnTransform((coord)=>-coord));
	}

	inverse() {
		return imPointFct(this.updateCoordsOnTransform((coord)=>1 / coord));
	}
}

export const pointFct = ({x, y}) => new PointRecord({x, y});
export const pointFromScalarFct = (scalar) => new PointRecord({x:scalar, y:scalar});
export const pointFromSize = ({width, height}) => new PointRecord({x: width, y: height});
export const pointFromOffset = ({top, left}) => new PointRecord({x: left, y: top});
export const zero = pointFct({x: 0, y: 0});
export const one = pointFct({x: 1, y: 1});
