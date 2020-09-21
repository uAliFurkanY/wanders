module.exports = function (formDataLike) {
	let cache;
	return new Proxy(formDataLike, {
		get(target, prop, receiver) {
			let cache;
			// no key
			if (!prop) return Reflect.get(...arguments);
			else if (target.has(prop)) {
				// db has key/value
				// return value
				return target.get(prop);
			} else {
				// no key/value
				return undefined;
			}
		},
		set(target, prop, value, receiver) {
			// no key
			if (!prop) return Reflect.set(...arguments);
			else {
				// set
				return target.set(prop, value);
			}
		},
	});
};
