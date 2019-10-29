# ncform theme iview

> Forked from [ncform-theme-elementui](https://github.com/ncform/ncform/tree/master/packages/ncform-theme-elementui)

![vue 2.x](https://img.shields.io/badge/vue-2.x-green.svg)
![view-design 4.x](https://img.shields.io/badge/iview-4.x-blue.svg)

[ncform](https://github.com/ncform/ncform) theme widgets -> [iview](https://www.iviewui.com/)

## How to use

* install

```
npm i @ncform/ncform view-design ncform-theme-iview
```

* use

``` js
// main.js
import Vue from 'vue';
import App from './App.vue';
import vueNcform from '@ncform/ncform';

import ncformStdComps from 'ncform-theme-iview';

import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';

Vue.use(ViewUI);
Vue.use(vueNcform, {
  extComponents: ncformStdComps,
  lang: "zh-cn" // you can try 'en' or 'zh-cn'
});

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
```

``` vue
<template>
  <div>
    <ncform
      :form-schema="formSchema"
      form-name="your-form-name"
      v-model="formSchema.value"
      @submit="submit"
    />
    <div style="text-align: center">
      <Button @click="submit">Submit</Button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formSchema: {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          }
        }
      }
    }
  },
  methods: {
    submit() {
      this.$ncformValidate("your-form-name").then(data => {
        if (data.result) {
          alert(JSON.stringify(this.$data.formSchema.value, null, 2));
          console.log(this.$data.formSchema.value);
          // do what you like to do
        }
      });
    }
  }
};
</script>
```

## Others

* [demo](https://f-loat.github.io/ncform-theme-iview)

* [document](https://github.com/ncform/ncform)

* dev

```
git clone https://github.com/F-loat/ncform-theme-iview.git

npm i

npm run dev
```
