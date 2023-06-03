
/**@description pick object fileds */
export const objectPick = (obj, fileds) => {
	if (!obj) return {};
	const res = {};
	fileds.forEach(key => {
		res[key] = obj[key];
		if (res[key] === void 0) {
			delete res[key]
		}
	})
	return res;
}

/**@description object map */
export function objectMap(obj, cb) {
	const res = {}
	for (const key in obj) {
		if (Object.hasOwnProperty.call(obj, key)) {
			const element = obj[key];
			res[key] = (cb && cb(key, element) || res[key]);
		}
	}
	return res;
}

/**@description object omit */
export function objectOmit(obj, ...fileds) {
	fileds = fileds.flat();
	return Object.entries(obj).reduce((pre, cur) => {
		const [key, value] = cur;
		if (fileds.includes(key)) return pre;
		return {
			...pre,
			[key]: value
		}
	}, {})
}


/**
* @deprecated 当watch一个对象时，value,oldValue并不准确
* @param {*} newVal 
* @param {*} oldVal 
*/
export function isChange(newVal, oldVal = {}) {
	const { effectKey, getCtxValue } = this;
	if (effectKey === void 0) return true;
	if (Array.isArray(effectKey)) {
		const cur = effectKey.map(keyLike => getCtxValue(newVal, keyLike));
		const pre = effectKey.map(keyLike => getCtxValue(oldVal, keyLike));
		return cur.reduce((isChange, cur, index) => {
			return isChange || cur !== pre[index]
		}, false)
	} else if (typeof effectKey === 'string') {
		const cur = effectKey.split(',').map(keyLike => getCtxValue(newVal, keyLike));
		const pre = effectKey.split(',').map(keyLike => getCtxValue(oldVal, keyLike));
		return cur.reduce((isChange, cur, index) => {
			return isChange || cur !== pre[index]
		}, false)
	} else {
		throw Error('effectKey type error')
	}
}


export function callValue(val, cb, fallback = true) {
	return val === void 0 ? fallback : cb(val)
}


export function buildListeners(item, listenersBuildCb = (event, val) => val, eventsDataCb = () => this.getModel) {
	const { listeners = {}, events = {} } = item;
	return {
		...Object.entries(listeners)
			.reduce((pre, cur) => {
				const [event, callback] = cur;
				return {
					...pre,
					[event]: (e) => listenersBuildCb(event, callback, e)
				}
			}, {}),
		...Object.keys(events)
			.reduce((pre, cur) => {
				return { ...pre, [cur]: () => this.$emit(events[cur], eventsDataCb()) }
			}, {})
	}
}


export function isObject(t) {
	return Object.prototype.toString.call(t) === '[object Object]'
}

export function isArray(t) {
	return Array.isArray(t)
}


export function observeEl(el, cb) {
	const observer = new ResizeObserver(
		entries => {
			for (const entry of entries) {
				cb?.(entry.target);
			}
		}
	);
	observer.observe(el);
	return () => { observer.unobserve(el); observer.disconnect() }
}
