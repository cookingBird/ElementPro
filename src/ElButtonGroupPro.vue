<template>
<div class="inline">
	<Auth
		v-for="item,index in buttons"
		:key="index"
		:funCode="item.funCode"
	>
		<el-button
			v-if="callValue(item.if, (val)=>typeof val === 'function' ? val(item,scope) : val)"
			v-show="callValue(item.show, (val)=>typeof val === 'function' ? val(item,scope) : val)"
			:loading="loading[item.code]"
			v-bind="item"
			v-on="buildListeners(item)"
		>
			<slot :name="(item.code || item.value)">
				{{ callValue(item.label, (val)=>typeof val === 'function' ? val(item,scope) : val) }}
			</slot>
		</el-button>
	</Auth>
</div>
</template>

<script>
	import { callValue, buildListeners } from './utils/utils';
	export default {
		name: "ElButtonGroupPro",
		props: {
			buttons: Array,
			scope: Object
		},
		data() {
			return {
				loading: this.buttons.reduce((pre, cur) => {
					return {
						...pre,
						[cur.code]: false
					}
				}, {})
			}
		},
		methods: {
			callValue,
			buildListeners(item) {
				const { code } = item;
				return buildListeners(item, (event, callback, e) => {
					const { scope, loading } = this
					e.stopPropagation();
					if (event === 'click') {
						loading[code] = true;
						const done = () => loading[code] = false;
						callback(done, scope);
					} else {
						throw Error('button do not support other events')
					}
				})
			}
		},
	}
</script>
