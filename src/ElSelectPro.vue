<template>
<el-select
	ref="item"
	:value="valueGetter(model)"
	v-on="$listeners"
	v-bind="$attrs"
	@input="handleInput"
>
	<el-option
		v-for="ops,index in selectOps"
		:key="index"
		:label="ops[optionKey.label]"
		:value="ops[optionKey.value]"
	>
	</el-option>
</el-select>
</template>

<script>
	import createGetterAndSetter from './mixin/createGetterAndSetter';
	import { passRef } from './mixin/slot'
	import dataFetch from './mixin/dataFetch';

	export default {
		name: "ElSelectPro",
		mixins: [createGetterAndSetter(''), dataFetch, passRef('item')],
		props: {
			options: Array,
			optionKey: {
				type: Object,
				default: () => ({ label: 'label', value: 'value' })
			}
		},
		data() {
			return {
				ops: [],
			};
		},
		computed: {
			selectOps: {
				get() {
					const { options, ops } = this;
					return options || ops || [];
				}
			},
		},
	}
</script>

