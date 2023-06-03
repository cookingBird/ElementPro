<template>
<el-form-item
  v-bind="objectPick(options.formItem, Object.keys(ElFormItem))"
  :class="options.formItem && options.formItem.class"
  :style="options.formItem && options.formItem.style"
  :prop=" options.formItem && options.formItem.prop || options.prop"
  :label="options.formItem && options.formItem.label || options.label"
>
  <template v-slot:label>
    <span v-bind="objectOmit(options,'slot')">
      <slot :name="(options.slotName || options.prop)+'Label'">
        {{ options.label }}
      </slot>
    </span>
  </template>

  <TypeNode
    ref="typeNode"
    :options="options"
    :model="model"
    v-on="$listeners"
  ></TypeNode>

</el-form-item>
</template>

<script>
  import {
    ElFormItem
  } from '../../ElementProps/Form';

  import { objectOmit, objectPick } from '../../utils/utils';
  import TypeNode from './TypeNode.vue';

  export default {
    components: { TypeNode },
    props: {
      options: {
        type: Object,
        required: true
      },
      model: {
        type: Object,
        required: true
      }
    },

    data() {
      return {
        ElFormItem
      };
    },
    mounted() {
      this.$nextTick(() => {
        const vNode = this.$refs.typeNode;
        vNode.$slots = this.$slots;
        vNode.$scopedSlots = this.$scopedSlots;
        vNode.$nextTick(vNode.$forceUpdate)
      })
    },
    updated() {
      this.$nextTick(() => {
        const vNode = this.$refs.typeNode;
        vNode.$slots = this.$slots;
        vNode.$scopedSlots = this.$scopedSlots;
        vNode.$nextTick(vNode.$forceUpdate)
      })
    },
    methods: {
      objectOmit,
      objectPick,
      getModel() {
        return this.model
      },
    }
  }
</script>
