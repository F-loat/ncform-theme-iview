<template>

  <div class="__array-form-item">

    <legend v-if="schema.ui.legend && schema.ui.showLegend" @click="collapse()">
      {{_analyzeVal(schema.ui.legend)}}
      <template v-if="!mergeConfig.disableCollapse">
        <Icon v-if="collapsed" type="md-arrow-dropdown" />
        <Icon v-else type="md-arrow-dropup" />
      </template>
    </legend>

    <div v-show="!collapsed" v-for="(dataItem, idx) in schema.value" :key="dataItem.__dataSchema.__id" class="list-item">

      <div class="list-item-label">
        <label>{{_analyzeVal(dataItem.__dataSchema.ui.label)}} {{idx + 1}} </label>

        <!-- 项控制按钮 -->
        <ButtonGroup>
          <Button
            @click="collapseItem(dataItem.__dataSchema)"
            v-show="dataItem.__dataSchema._expand"
            v-if="!mergeConfig.disableItemCollapse"
            size="small"
            icon="md-arrow-dropdown"
          />
          <Button
            @click="collapseItem(dataItem.__dataSchema)"
            v-show="!dataItem.__dataSchema._expand"
            v-if="!mergeConfig.disableItemCollapse"
            size="small"
            icon="md-arrow-dropup"
          />
          <Button
            @click="delItem(idx, mergeConfig.requiredDelConfirm, mergeConfig.delConfirmText.item || $nclang('delItemTips'))"
            v-if="(!mergeConfig.disableDel && !isDelExceptionRow(dataItem.__dataSchema)) || (mergeConfig.disableDel && isDelExceptionRow(dataItem.__dataSchema))"
            type="error"
            size="small"
            icon="md-remove-circle"
          />
          <Button
            @click="itemUp(idx)"
            v-show="idx !== 0"
            v-if="!mergeConfig.disableReorder"
            size="small"
            icon="md-arrow-round-up"
          />
          <Button
            @click="itemDown(idx)"
            v-show="idx !== schema.value.length - 1"
            v-if="!mergeConfig.disableReorder"
            size="small"
            icon="md-arrow-round-down"
          />
        </ButtonGroup>
      </div>

      <!-- array item 是 正常的 object 类型 -->
      <template v-if="isNormalObjSchema(dataItem.__dataSchema)">
        <ncform-object v-show="mergeConfig.disableItemCollapse || dataItem.__dataSchema._expand" :schema="dataItem.__dataSchema" :form-data="formData" :idx-chain="(idxChain ? idxChain + ',' : '') + idx" :config="dataItem.__dataSchema.ui.widgetConfig" :show-legend="false">

          <template v-for="(fieldSchema, fieldName) in (dataItem.__dataSchema.properties || {__notObjItem: dataItem.__dataSchema})" :slot="fieldName"><!-- 注意：__notObjItem 这个Key为与form-item约定好的值，其它名字不生效 -->
            <slot :name="fieldName" :schema="fieldSchema" :idx="idx"></slot>
          </template>

        </ncform-object>
      </template>

      <!-- array item 是 非正常的 object 类型 以及 其它类型 -->
      <div v-else class="normal-item">
        <div v-show="mergeConfig.disableItemCollapse || dataItem.__dataSchema._expand">
          <slot name="__notObjItem" :schema="dataItem.__dataSchema" :idx="idx"></slot> <!-- 注意：__notObjItem 和 __dataSchema 都是约定好的值，其它名字不生效 -->
        </div>
      </div>

    </div>

    <!-- 列表控制按钮 -->
    <ButtonGroup v-show="!collapsed" class="ivu-button-group" v-if="!mergeConfig.disableAdd || !mergeConfig.disableDel">
      <Button
        @click="addItem()"
        v-if="!mergeConfig.disableAdd"
        size="small"
        icon="md-add-circle"
      >
        {{mergeConfig.addTxt || $nclang('add')}}
      </Button>
      <Button
        @click="delAllItems(mergeConfig.requiredDelConfirm, mergeConfig.delConfirmText.all || $nclang('delAllTips'))"
        v-if="!mergeConfig.disableDel"
        type="error"
        size="small"
        icon="md-remove-circle"
      >
        {{mergeConfig.delAllTxt || $nclang('delAll')}}
      </Button>
    </ButtonGroup>

  </div>

</template>

<style lang="scss">
  .__array-form-item {

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
        line-height: 22px;
        cursor: pointer;
      }
    }

    .list-item {
      // border: 1px solid #d8dce5;
      margin: 0px 0px 8px;
      .list-item-label {
        padding: 8px 8px 4px 8px;
        label {
          font-size: 14px;
        }
      }
    }
    .normal-item {
      padding: 4px 8px 8px 8px;
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
        add: 'Add',
        delAll: 'Delete All',
        delItemTips: 'Are you sure to delete this item?',
        delAllTips: 'Are you sure to delete all?'
      },
      zh_cn: {
        add: '增加',
        delAll: '删除全部',
        delItemTips: '确定要删除该项吗？',
        delAllTips: '确定要删除全部吗？'
      }
    },

    created() {
      this._supportItemsCollapse();
    },

    methods: {
      collapseItem(dataSchema) {
        dataSchema._expand = !dataSchema._expand;
      },

      _supportItemsCollapse() {
        if (!this.mergeConfig.disableItemCollapse) {
          this.schema.value.forEach(dataItem => {
            if (dataItem.__dataSchema && dataItem.__dataSchema._expand === undefined)
              this.$set(dataItem.__dataSchema, '_expand', !this.mergeConfig.itemCollapse);
          })
        }
      }
    },

    watch: {
      'schema.value.length': {
        handler(newVal, oldVal) {
          if (newVal > oldVal) { // add item
            this._supportItemsCollapse();
          }
        }
      }
    }

  }
</script>
