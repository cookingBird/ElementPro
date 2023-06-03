<template>
<span v-bind="objectOmit(options,'slot')">
	<!-- input -->
	<el-input-pro
		v-if="options.slotIs === 'input'"
		:model.sync="model"
		:valueKey="options.valueKey || options.prop"
		v-bind="objectPick(options, Object.keys(ElInput))"
		v-on="buildListeners(options)"
		:class="options.class"
		:style="options.style"
	></el-input-pro>
	<!-- select -->
	<el-select-pro
		v-else-if="options.slotIs === 'select'"
		:model.sync="model"
		:valueKey="options.valueKey || options.prop"
		v-bind="objectPick(options,Object.keys(ElSelect))"
		v-on="buildListeners(options)"
		:options="options.options"
		:effectKey="options.effectKey"
		:fetch="options.fetch"
		:class="options.class"
		:style="options.style"
	>
	</el-select-pro>
	<!-- checkbox group -->
	<el-checkbox-group-pro
		v-else-if="options.slotIs === 'checkboxGroup'"
		:model.sync="model"
		:valueKey="options.valueKey || options.prop"
		v-bind="objectPick(options, Object.keys(ElCheckboxGroup))"
		:uniqueKey="options.uniqueKey"
		v-on="buildListeners(options)"
		:options="options.options"
		:effectKey="options.effectKey"
		:fetch="options.fetch"
		:class="options.class"
		:style="options.style"
	>
	</el-checkbox-group-pro>
	<!-- radio group -->
	<el-radio-group-pro
		v-else-if="options.slotIs === 'radioGroup'"
		:model.sync="model"
		:valueKey="options.valueKey || options.prop"
		:effectKey="options.effectKey"
		:fetch="options.fetch"
		:options="options.options"
		v-bind="options"
		v-on="buildListeners(options)"
	>
	</el-radio-group-pro>
	<!-- date picker -->
	<el-date-picker-pro
		v-else-if="options.slotIs === 'datePicker'"
		:model.sync="model"
		:valueKey="options.valueKey || options.prop"
		:effectKey="options.effectKey"
		:fetch="options.fetch"
		v-bind="options"
		v-on="buildListeners(options)"
	>
	</el-date-picker-pro>
	<slot
		v-else-if="options.slotIs === 'slot'"
		:name="options.slotName || options.prop"
	></slot>
</span>
</template>

<script>
	import { objectOmit, objectPick, buildListeners, } from '../../utils/utils';
	import { getCtxValueGetter, getCtxValueSetter } from '../../mixin/tool';
	import {
		ElCheckboxGroup,
		ElCheckbox,
		ElInput,
		ElSelect,
		ElSelectOption,
		ElFormItem
	} from '../../ElementProps/Form';

	export default {
		name: "TypeNode",
		props: {
			options: Object,
			model: Object
		},
		data() {
			return {
				ElCheckboxGroup,
				ElCheckbox,
				ElInput,
				ElSelect,
				ElSelectOption,
				ElFormItem
			};
		},
		methods: {
			objectOmit,
			objectPick,
			buildListeners,
			getCtxValueGetter,
			getCtxValueSetter
		},
	}
</script>
