import debounce from 'lodash/debounce';
import {
	effectFingerprint,
	request,
	validateEffect
} from './tool';

export default {
	props: {
		fetch: Function,
		effectKey: [String, Array],
		wait: Number,
		URL: String,//支持模板语法
		method: String,
		params: Object, //支持.访问符
		data: Object, //支持.访问符
	},
	data() {
		return {
			ops: [],
		};
	},
	computed: {
		isEffect() {
			return effectFingerprint(this.model, this.effectKey, this.getCtxValue)
		}
	},
	watch: {
		isEffect: {
			immediate: true,
			handler(val, oldValue) {
				if (val != oldValue && validateEffect(val)) {
					if (this.model && this.fetch) {
						this.modelEffectHandler(this.model)
					}
					if (this.URL) {
						request(this.model, this)
							.then(({ data, code }) => {
								if (code === 200) {
									this.ops = data;
								} else {
									throw Error('request error')
								}
							})
					}
				}
			}
		}
	},
	created() {
		this.modelEffectHandler = debounce(
			this.modelEffectHandler,
			this.wait || 700,
			{ trailing: true, leading: true }
		)
	},
	methods: {
		async modelEffectHandler(val) {
			try {
				this.loading = true;
				this.ops = await this.fetch(val);
				this.loading = false;
			} catch (error) {
				this.loading = false;
			}
		},
	}
}
