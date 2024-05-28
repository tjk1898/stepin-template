<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-form>
      <a-form-item
        :label="t('title')"
        label-col="{span: 7}"
        wrapper-col="{span: 10}"
      >
        <a-input :placeholder="t('titleInput')" />
      </a-form-item>
      <a-form-item
        :label="t('date')"
        label-col="{span: 7}"
        wrapper-col="{span: 10}"
      >
        <a-range-picker style="width: 100%" />
      </a-form-item>
      <a-form-item
        :label="t('describe')"
        label-col="{span: 7}"
        wrapper-col="{span: 10}"
      >
        <a-textarea rows="4" :placeholder="t('describeInput')"/>
      </a-form-item>
      <a-form-item
        :label="t('metrics')"
        label-col="{span: 7}"
        wrapper-col="{span: 10}"
      >
        <a-textarea rows="4" :placeholder="t('metricsInput')"/>
      </a-form-item>
      <a-form-item
        :label="t('customer')"
        label-col="{span: 7}"
        wrapper-col="{span: 10}"
        :required="false"
      >
        <a-input :placeholder="t('customerInput')"/>
      </a-form-item>
      <a-form-item
        :label="t('critics')"
        label-col="{span: 7}"
        wrapper-col="{span: 10}"
        :required="false"
      >
        <a-input :placeholder="t('criticsInput')"/>
      </a-form-item>
      <a-form-item
        :label="t('weight')"
        label-col="{span: 7}"
        wrapper-col="{span: 10}"
        :required="false"
      >
        <a-input-number :min="0" :max="100"/>
        <span>%</span>
      </a-form-item>
      <a-form-item
        :label="t('disclosure')"
        label-col="{span: 7}"
        wrapper-col="{span: 10}"
        :required="false"
        :help="t('disclosureDesc')"
      >
        <a-radio-group v-model:value="value">
          <a-radio :value="1">{{t('public')}}</a-radio>
          <a-radio :value="2">{{t('partially')}}</a-radio>
          <a-radio :value="3">{{t('private')}}</a-radio>
        </a-radio-group>
        <a-select v-if="value === 2" mode="multiple">
          <a-select-option value="4">{{t('colleague1')}}</a-select-option>
          <a-select-option value="5">{{t('colleague2')}}</a-select-option>
          <a-select-option value="6">{{t('colleague3')}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item style="margin-top: 24px" wrapper-col="{span: 10, offset: 7}">
        <a-button type="primary">{{t('submit')}}</a-button>
        <a-button style="margin-left: 8px">{{t('save')}}</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
  import { ref } from 'vue';
  import i18n from './i18n.ts';

  export default {
    name: 'BasicForm',
    setup() {
      const value = ref(1);
      const t = i18n.global.t;

      return { value, t };
    }
  }
</script>

<style scoped>

</style>
