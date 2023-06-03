import Ajax from '../utils/Ajax';

/**@description 以.访问符获取一个ctx中的某一字段值 */
export function getCtxValueGetter(path, fallbackValue) {
	const segments = path?.split('.');
	return (ctx) => {
		console.log('get value');
		if (!segments) return ctx;
		if (!ctx) return fallbackValue;
		const fileds = segments;
		let val = ctx;
		fileds.forEach((key, index) => {
			if (index < fileds.length - 1) {
				val = (val[key] === void 0
					? this.$set(val, key, {})
					: val[key]);
			} else {
				val = (val[key] === void 0
					? this.$set(val, key, fallbackValue)
					: val[key]);
			}
		});
		return val;
	}
}

/**@description 以.访问符设置一个ctx中的某些字段值 */
export function getCtxValueSetter(ctx, filedLike) {
	if (filedLike) {
		const fileds = filedLike.split('.');
		const length = fileds.length;
		return value => {
			let context = ctx;
			fileds.forEach((key, index) => {
				if (index < length - 1) {
					context = context[key];
				} else {
					context[key] = value;
				}
			});
		};
	} else {
		(value) => ctx = value;
	}
}


/**
 * @description 获取effectFingerprint
 * @param {object} model 
 * @param {string} effectKey 
 * @param {function} getCtxValue 
 * @returns 
 */
export function effectFingerprint(model, effectKey, getCtxValue) {
	if (effectKey === void 0) return '';
	if (Array.isArray(effectKey)) {
		const cur = effectKey.map(keyLike => getCtxValue(model, keyLike));
		return cur.join(',')
	} else if (typeof effectKey === 'string') {
		const cur = effectKey.split(',').map(keyLike => getCtxValue(model, keyLike));
		return cur.join(',')
	}
}

/**@description 判断当前effectFingerprint是否有效 */
export function validateEffect(effectFingerprint = '') {
	if (effectFingerprint === '') return true;
	return effectFingerprint.split(',').reduce((pre, cur) => {
		return pre && Boolean(cur)
	}, true)
}

/**
 * @description 根据配置参数请求字典
 * @param {object} model 
 * @param {vueComponent} ctx 
 * @returns 
 */
export function request(model, ctx) {
	const { URL, method, getCtxValue, params, data, objectMap } = ctx;
	const urlParams = URL?.matchAll(/\[(.+?)\]/g).map(res => res[1]);
	const urlParamsValue = urlParams.map(key => getCtxValue(model, key));
	if (method === 'get') {
		const parsedPrams = objectMap(params, (key, value) => getCtxValue(model, value))
		return Ajax({
			url: urlParams.reduce((pre, key, index) => {
				return pre.replace(key, urlParamsValue[index])
			}, URL),
			method: method,
			params: parsedPrams
		})
	} else if (method === 'post') {
		const parsedData = objectMap(data, (key, value) => getCtxValue(model, value))
		return Ajax({
			url: urlParams.reduce((pre, key, index) => {
				return pre.replace(key, urlParamsValue[index])
			}, URL),
			method: method,
			data: parsedData
		})
	}
}
