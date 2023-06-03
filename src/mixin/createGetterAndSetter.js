import {
	getCtxValueSetter,
	getCtxValueGetter
} from './tool';

export default function createGetterAndSetter(defaultValue = '') {
	return {
		props: {
			model: [Object, String, Number],
			valueKey: String,
		},
		computed: {
			valueSetter() {
				return getCtxValueSetter.call(this, this.model, this.valueKey)
			},
			valueGetter() {
				return getCtxValueGetter.call(this, this.valueKey, defaultValue)
			}
		},
		methods: {
			handleInput(val) {
				if (this.valueKey === void 0) {
					this.$emit('update:model', val);
				} else {
					this.valueSetter(val)
				}
			}
		},
	}
}
