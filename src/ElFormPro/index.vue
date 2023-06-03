<template>
<el-form
  v-bind="options"
  :model="model"
  :rules="rules"
  v-on="options.listeners"
>
  <template v-if="options.inline">
    <Auth
      v-for="col of options.columns"
      :funCode="col.funCode"
      :key="col.prop"
      :store="authStore"
    >
      <FormNode
        ref="formNode"
        v-if="callValue(col.if,(val)=>typeof val === 'function' ? val(col,model) : val)"
        v-show="callValue(col.show,(val)=>typeof val === 'function' ? val(col,model) : val)"
        :options="col"
        :model="model"
        v-on="$listeners"
      >
      </FormNode>
    </Auth>
  </template>
  <template v-else>
    <el-row v-bind="options.row">
      <template v-for="col of options.columns">
        <el-col
          v-if="callValue(col.if, (val) => typeof val === 'function' ? val(col,model) : val)"
          v-show="callValue(col.show,(val)=>typeof val === 'function' ? val(col,model) : val)"
          v-bind="col.col"
          :key="col.prop"
        >
          <Auth
            :funCode="col.funCode"
            :store="authStore"
          >
            <FormNode
              ref="formNode"
              :options="col"
              :model="model"
              v-on="$listeners"
            >
            </FormNode>
          </Auth>
        </el-col>
      </template>
    </el-row>
  </template>
  <template v-if="options.footer">
    <footer
      v-if="Array.isArray(options.footer)"
      v-show="options.footerOption ? options.footerOption.visible === void 0 ? true : options.footerOption.visible : true"
      v-bind="options.footerOption"
    >
      <template v-for="item, index of options.footer">
        <el-button
          :key="index"
          v-bind="item"
          v-on="buildListeners(item)"
        >
          {{ item.label }}
        </el-button>
      </template>
    </footer>
    <footer
      v-else
      v-show="options.footer.visible === void 0 ? true : options.footer.visible"
      v-bind="options.footer"
    >
      <template v-for="item, index of options.footer.columns">
        <el-button
          :key="index"
          v-bind="item"
          v-on="buildListeners(item)"
        >
          {{ item.label }}
        </el-button>
      </template>
    </footer>

  </template>
</el-form>
</template>

<script>
  import FormNode from "./components/FormItem.vue";
  import { passRefList } from "../mixin/slot";
  import {
    objectPick,
    callValue,
    buildListeners,
    isArray,
    isObject
  } from '../utils/utils';
  export default {
    name: "ElFormPro",
    components: { FormNode },
    mixins: [passRefList('formNode')],
    props: {
      options: {
        type: Object,
        required: true,
      },
      model: {
        type: Object,
        required: true,
      },
      rules: {
        type: Object
      },
      authStore: Object
    },
    methods: {
      objectPick,
      isObject,
      isArray,
      buildListeners,
      callValue,
      getModel() {
        return this.model
      },
    }
  }
</script>
