<template>

  <div class="__array-tabs-form-item">

    <legend v-if="schema.ui.legend && schema.ui.showLegend" @click="collapse()">
      {{_analyzeVal(schema.ui.legend)}}
      <template v-if="!mergeConfig.disableCollapse">
        <Icon v-if="collapsed" type="md-arrow-dropdown" />
        <Icon v-else type="md-arrow-dropup" />
      </template>
    </legend>

    <Tabs
      @on-tab-remove="handleTabRemove"
      :animated="false"
      type="card"
      v-show="!collapsed"
      v-model="activeName"
    >
      <TabPane
        v-for="(dataItem, idx) in schema.value"
        :key="dataItem.__dataSchema.__id"
        :label="_analyzeVal(dataItem.__dataSchema.ui.label) + ' ' + (idx + 1)"
        :closable="(!mergeConfig.disableDel && !isDelExceptionRow(dataItem.__dataSchema)) || (mergeConfig.disableDel && isDelExceptionRow(dataItem.__dataSchema))"
        :name="'' + idx"
      >

        <!-- array item 是 正常的 object 类型 -->
        <template v-if="isNormalObjSchema(dataItem.__dataSchema)">
          <ncform-object :schema="dataItem.__dataSchema" :form-data="formData" :idx-chain="(idxChain ? idxChain + ',' : '') + idx" :config="dataItem.__dataSchema.ui.widgetConfig" :show-legend="false">

            <template v-for="(fieldSchema, fieldName) in (dataItem.__dataSchema.properties || {__notObjItem: dataItem.__dataSchema})" :slot="fieldName"><!-- 注意：__notObjItem 这个Key为与form-item约定好的值，其它名字不生效 -->
              <slot :name="fieldName" :schema="fieldSchema" :idx="idx"></slot>
            </template>

          </ncform-object>
        </template>

        <!-- array item 是 非正常的 object 类型 以及 其它类型 -->
        <template v-else>
          <slot name="__notObjItem" :schema="dataItem.__dataSchema" :idx="idx"></slot> <!-- 注意：__notObjItem 和 __dataSchema 都是约定好的值，其它名字不生效 -->
        </template>
      </TabPane>

      <Button v-if="!mergeConfig.disableAdd" @click="handleTabAdd" size="small" slot="extra">增加</Button>
    </Tabs>

  </div>

</template>

<style lang="scss">
  .__array-tabs-form-item {

    // margin-top: 8px;

    & > legend {
      display: block;
      border-left: 6px solid #878D99;
      padding: 6px;
      background-color: #d8dce5;
      color: #5a5e66;
      font-size: 14px;
      margin-bottom: 0px;
      border-radius: 4px 4px 0 0;

      .ivu-collapse-item__arrow {
        cursor: pointer;
        line-height: 22px;
      }
    }

    .ivu-tabs {
      margin-top: 6px;
      &.ivu-tabs--left {
        .ivu-tabs__new-tab {
          margin-left: 0;
          .ivu-icon-plus {
            width: 100%;
          }
        }
      }
    }

    .ivu-tab-pane > .__object-form-item > .ivu-row {
      border: none;
      margin-top: -8px
    }
    .ivu-tabs__header {
      margin: 0 0 8px;
    }
  }
</style>

<script>

  import ncformCommon from '@ncform/ncform-common';

  const layoutArrayMixin = ncformCommon.mixins.vue.layoutArrayMixin;

  export default {

    mixins: [layoutArrayMixin],

    i18nData: {
      en: {
        delItemTips: 'Are you sure to delete this item?',
      },
      zh_cn: {
        delItemTips: '确定要删除该项吗？',
      }
    },

    data() {
      return {
        activeName: '0',
        defaultConfig: {
          tabPosition: 'top',
        },
      }
    },

    methods: {
      handleTabAdd() {
        this.addItem();
        this.$data.activeName = (this.schema.value.length - 1) + '';
      },
      handleTabRemove(target) {
        this.delItem(target, this.mergeConfig.requiredDelConfirm, this.mergeConfig.delConfirmText.item || this.$nclang('delItemTips'));
        this.$nextTick(() => {
          let tabIdx = parseInt(target);
          if (target === this.$data.activeName) { // Remote item is the active item
            if (tabIdx === 0) { // First item
              this.$data.activeName = '0'
            } else {
              this.$data.activeName = (tabIdx - 1) + '';
            }
          } else {
            let activeIdx = parseInt(this.$data.activeName);
            if (activeIdx > tabIdx) { // active item at the right side
              this.$data.activeName = (activeIdx - 1) + '';
            }
          }
        })
      }
    }

  }
</script>
