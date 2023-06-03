<template>
<el-dialog
	:modal="false"
	:close-on-click-modal="false"
	v-bind="$attrs"
	v-on="$listeners"
>
	<slot></slot>
</el-dialog>
</template>

<script>

	export default {
		name: "ElDialogPro",
	}
</script>
