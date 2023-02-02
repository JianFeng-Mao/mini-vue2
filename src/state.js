import { observe } from "./observer.js";

export function initState(vm) {
  const opts = vm.$options;

  /* 对 props、data、methods、computed、watch属性进行初始化
  *  初始化顺序为：props >> data >> methods >> computed >> watch
  *  主要实现的功能是
  *       1、将各属性的值代理到Vue实例，可以直接通过this.xxx的方式进行访问
  *       2、监听各属性的值（methods除外）
  */
  if(opts.props) {
    initProps();
  }
  if(opts.data) {
    initData(vm);
  }
  if(opts.methods) {
    initMethod();
  }
  if(opts.computed) {
    initComputed();
  }
  if(opts.watch) {
    initWatch();
  }
}

function initData(vm) {
  let data = vm.$options.data;
  // Vue实例的_data属性就是传入的data。
  // 区分 data 传入的是函数还是对象，推荐 data 使用函数，防止数据在组件之间共享
  data = vm._data = typeof data === 'function' ? data.call(vm) : data || {};

  
  for (const key in data) {
    proxy(vm, '_data', key);
  }

  // 数据监听
  observe(data);
}

// 数据代理 将 this.data.xxx 代理到 this.xxx
function proxy(vm, sourceKey, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[sourceKey][key];
    },
    set(val) {
      vm[sourceKey][key] = val;
    }
  })
}