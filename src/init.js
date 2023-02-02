import { initState } from "./state.js";
export function initMixin(Vue) {
  Vue.prototype._init = function(options) {
    const vm = this;

    // 将配置项挂载到Vue实例上
    vm.$options = options;

    initState(vm);
  }
}