<template>
<el-radio-group
	:value="valueGetter(model)"
	@input="handleInput"
>
	<el-radio
		v-for="item,index in options"
		:key="index"
		:label="item.value"
	>
		{{ item.label }}
	</el-radio>
</el-radio-group>
</template>


<script>
	import createGetterAndSetter from './mixin/createGetterAndSetter';

	export default {
		name: "ElRadioGroupPro",
		mixins: [createGetterAndSetter('')],
		props: {
			options: Array,
		},
	}
</script>
