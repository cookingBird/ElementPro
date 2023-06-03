<template>
<div
  class="gislife-table-container"
  v-loading="loading"
  :type="height"
  :empty="isEmpty"
>
  <div class="gislife-table__content">
    <el-table
      ref="table"
      :data="tableData || data"
      :border="border"
      v-bind="$attrs"
      v-on="$listeners"
      :height="tableHeight"
      style="max-width: 100%;"
    >
      <!-- 普通列 -->
      <template v-for="(item,index) of columns">
        <Column
          v-if="item.children && item.children.length"
          :columnsHeader="item"
          :key="item"
        >
        </Column>
        <el-table-column
          v-else-if="item.type === 'index' || item.type === 'selection'"
          :key="index"
          v-bind="item"
          :align="item.align || 'center'"
          :show-overflow-tooltip="item.overflowTooltip === void 0 ? true : item.overflowTooltip"
        >
        </el-table-column>
        <el-table-column
          v-else
          :key="index"
          v-bind="item"
          :align="item.align || 'center'"
          :show-overflow-tooltip="item.overflowTooltip === void 0 ? true : item.overflowTooltip"
        >
          <template #default="scope">
            <!-- 插槽,插槽名为对应prop,不使用可不写插槽 -->
            <span v-bind="Object.assign({}, scope.row, item)">
              <slot
                :name="item.prop"
                :column="scope.column"
                :row="scope.row"
              >
                {{
                  item.format ? item.format(scope.row[item.prop]) : scope.row[item.prop]
                }}
              </slot>
            </span>
          </template>
        </el-table-column>
      </template>
      <!-- 表格尾部插槽 -->
      <slot name="append"></slot>
      <!-- 暂无数据提示 -->
      <template v-slot:empty>
        <slot name="empty"> 暂无数据 </slot>
      </template>
    </el-table>
  </div>
  <div
    v-if="isPager"
    class="gislife-table__footer"
  >
    <pagination
      :pageParams.sync="pageParams"
      :total="total"
      :pagerConfig="pagerConfig"
      @size-change="()=>refresh()"
      @current-change="()=>refresh()"
      @prev-click="()=>refresh()"
      @next-click="()=>refresh()"
    >
    </pagination>
  </div>
</div>
</template>

<script>
  import request from '../utils/Ajax';
  import Column from './column';
  import pagination from './pagination.vue';
  import * as Utils from '../utils/utils';
  export default {
    name: 'ElTablePro',
    inheritAttrs: false,
    components: {
      Column,
      pagination,
    },
    props: {
      columns: {
        // 表头
        type: Array,
        default: () => [],
      },
      data: {
        //表格数据
        type: Array,
        default: () => [],
      },
      isPager: {
        // 是否分页
        type: Boolean,
        default: true,
      },
      border: {
        type: Boolean,
        default: true
      },
      pageNo: {
        // 分页参数
        type: Number,
        default: 1
      },
      pageSize: {
        // 分页参数
        type: Number,
        default: 10
      },
      height: {
        //表格高度
        type: String,
        default: '100%'
      },
      // pagination配置
      pagerConfig: Object,
      query: {
        // 查询参数
        Type: Object,
        default() {
          return {};
        },
      },
      //数据获取方法
      fetch: Function,
      //请求参数
      baseURL: {
        type: String,
      },
      // 获取表格数据接口Api
      url: {
        type: String,
      },
      // 请求方法（默认POST）
      reqMethods: {
        Type: String,
        default: 'POST',
      },
      // 解析表格数据
      dataCallback: {
        Type: Function,
        default() {
          return (data) => {
            return { data: data.data, total: data.totalCount };
          };
        },
      },
    },
    data() {
      return {
        total: 0,
        loading: false,
        tableData: null,
        maxHeight: 300,
        pageParams: { pageNo: this.pageNo, pageSize: this.pageSize },
        clcHeight: null,
      };
    },
    computed: {
      queryData: {
        get() {
          return { ...this.query, ...this.pageParams };
        },
        set(val) {
          this.$emit('changeQuery', val);
        },
      },
      tableHeight: {
        get() {
          return this.height === 'auto' ? this.clcHeight : this.height
        }
      },
      isEmpty() {
        return (this.tableData || this.data || []).length === 0
      }
    },
    created() {
      this.refresh();
    },
    mounted() {
      this.$nextTick(this.observeTableBody)
    },
    methods: {
      /**
       * @description 刷新数据
       * @param {object} query 查询参数 
       * @param {function} fetchDone 数据获取完成回调
       * @returns {promise} 
       */
      async refresh(query, fetchDone) {
        await new Promise((resolve) => { setTimeout(resolve) });
        try {
          const params = Object.assign({}, this.queryData, query);
          this.loading = true;
          const dataS = await this.getData(params);
          if (dataS) {
            const { data, total } = this.dataCallback(dataS);
            this.tableData = data;
            this.total = total;
            this.$emit('onData', data);
          };
        } catch (error) {
          console.error(error);
        } finally {
          fetchDone?.();
          this.loading = false;
        }
      },
      /**
       * @description 获取数据
       * @param {object} query 查询参数
       */
      async getData(query) {
        if (!this.url && !this.fetch) {
          return;
        }
        if (this.fetch) {
          return this.fetch(query)
        } else {
          const reqOps = {
            baseURL: this.baseURL,
            url: this.url,
            method: this.reqMethods
          };
          this.reqMethods.toUpperCase() === 'POST'
            ? (reqOps.data = query)
            : (reqOps.params = query)
          return request(reqOps);
        }
      },

      calcIndex(index, pgCfg = 'pageParams') {
        if (this.isPager) {
          const { pageNo, pageSize } = this[pgCfg]
          return index + (pageNo - 1) * pageSize + 1
        } else {
          return index + 1
        }
      },

      observeTableBody() {
        if (this.height !== 'auto') return;
        const tableEl = this.$refs.table.$el;
        this.__observeCancel?.();
        this.__observeCancel = Utils.observeEl(
          tableEl.querySelector('.el-table__body'),
          (target) => {
            const { isEmpty } = this;
            const headerBlock = tableEl.querySelector('.el-table__header');
            const bodyHeight = isEmpty
              ? 60
              : Number(getComputedStyle(target).height.replace('px', ''))
            this.clcHeight = (
              bodyHeight
              + Number(getComputedStyle(headerBlock).height.replace('px', ''))
              + 2
              + 'px');
            console.log("this.clcHeight", this.clcHeight);
          })
        this.$on('hook:beforeDestroy', this.__observeCancel);
      }
    },
  };
</script>

<style lang="css">
  .gislife-table-container {
    --inner-margin-top: 8px;
    --inner-border-radius: 4px;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }

  .gislife-table__content {
    flex-basis: 0;
    flex-grow: 1;
    padding: 8px 8px;
    background-color: #fff;
    overflow: hidden;
  }

  .gislife-table-container[type="auto"] {
    all: unset
  }

  .gislife-table-container[empty] .el-table {
    border-bottom: 1px solid #e5edf6;
  }

  .gislife-table-container[type="auto"]>.gislife-table__content {
    overflow: unset;
  }

  .gislife-table-container[type="auto"] .el-table::before {
    all: unset;
  }

  .gislife-table__footer {
    flex-grow: 0;
    flex-shrink: 0;
    background-color: #fff;
    flex-basis: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px 8px;
  }

  .gislife-table-container> :not(.absolute) {
    border-radius: var(--border-radius, var(--inner-border-radius));
  }

  .gislife-table-container> :not([hidden])~ :not([hidden]) {
    margin-top: var(--el-spacing-y, var(--inner-margin-top));
  }
</style>
