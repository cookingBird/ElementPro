

/**
 * 
 * @param {object} option 
 * @param {string} option.method 
 * @param {string} option.url 
 * @param {object} option.headers 
 * @param {boolean} option.withCredentials 
 * @param {object} option.params 
 * @param {object} option.data 
 * @returns 
 */
export default function request(option) {
	if (typeof XMLHttpRequest === 'undefined') {
		return;
	}

	const xhr = new XMLHttpRequest();
	const action = option.url;
	const method = (option.method || 'post').toLowerCase().trim();

	if (method === 'get') {
		const url = action + '?'
			+ Object.entries(option.params).reduce((pre, cur) => {
				const [key, value] = cur;
				return pre + '&' + key + '=' + value
			}, '')
		xhr.open(method, url, true);
	} else {
		xhr.open(method, action, true);
	}

	if (option.withCredentials && 'withCredentials' in xhr) {
		xhr.withCredentials = true;
	}

	const headers = option.headers || {};

	for (let item in headers) {
		if (headers.hasOwnProperty(item) && headers[item] !== null) {
			xhr.setRequestHeader(item, headers[item]);
		}
	}


	return new Promise((resolve, reject) => {
		xhr.onerror = function error(e) {
			reject(e)
		};

		xhr.onload = function onload() {
			if (xhr.status < 200 || xhr.status >= 300) {
				return reject(getError(action, option, xhr));
			}

			resolve(getBody(xhr));
		};

		if (method === 'post') {
			try {
				xhr.send(JSON.stringify(option.data));
			} catch (error) {
				xhr.send();
			}
		}
		else if (method === 'get') {
			xhr.send();
		}
	});
}


function getError(action, option, xhr) {
	let msg;
	if (xhr.response) {
		msg = `${ xhr.response.error || xhr.response }`;
	} else if (xhr.responseText) {
		msg = `${ xhr.responseText }`;
	} else {
		msg = `fail to post ${ action } ${ xhr.status }`;
	}

	const err = new Error(msg);
	err.status = xhr.status;
	err.method = option.method || 'post';
	err.url = action;
	return err;
}

function getBody(xhr) {
	const text = xhr.responseText || xhr.response;
	if (!text) {
		return text;
	}

	try {
		return JSON.parse(text);
	} catch (e) {
		return text;
	}
}
