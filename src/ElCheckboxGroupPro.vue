<template>
<el-checkbox-group
	v-bind="$attrs"
	v-model="valueList"
>
	<el-checkbox
		v-for="item,index in selectOps"
		:key="index"
		v-bind="objectPick(item, Object.keys(ElCheckbox))"
	>
	</el-checkbox>
</el-checkbox-group>
</template>

<script>
	import createGetterAndSetter from './mixin/createGetterAndSetter';
	import dataFetch from './mixin/dataFetch';
	import { objectPick } from './utils/utils';

	export default {
		name: "ElCheckboxGroupPro",
		mixins: [createGetterAndSetter([]), dataFetch],
		props: {
			options: Array,
			uniqueKey: {
				type: String,
				default: 'id'
			},
		},
		data() {
			return {
				ElCheckbox,
				ops: [],
			}
		},
		computed: {
			valueList: {
				get() {
					const { options, ops, uniqueKey, valueKey } = this;
					const model = this.valueGetter(this.model, valueKey);
					const res = model
						.map(id => ((options || ops).find(op => (op[uniqueKey] === id)) || {}))
						.map(i => i.label)
					return res;
				},
				set(val) {
					const { options, uniqueKey, ops } = this;
					const models = val
						.map(label => (options || ops).find(op => op.label == label) || {})
						.map(v => v[uniqueKey])
					this.handleInput(models)
				}
			},
			selectOps: {
				get() {
					const { options, ops } = this;
					return options || ops || [];
				}
			},
		},
		methods: {
			objectPick
		},
	}
</script>
