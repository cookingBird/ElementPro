<template>
<el-input
	ref="item"
	:value="valueGetter(model)"
	@input="handleInput"
	v-on="$listeners"
	v-bind="$attrs"
>
</el-input>
</template>

<script>
	import createGetterAndSetter from './mixin/createGetterAndSetter';
	import { passRef } from './mixin/slot';

	export default {
		name: "ElInputPro",
		mixins: [createGetterAndSetter(''), passRef('item')],
		props: {
			model: [Object, String, Number],
			valueKey: String,
		}
	}
</script>

