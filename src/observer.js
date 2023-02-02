import { arrayMethods } from './array.js'

class Observer {
  constructor(value) {
    // 向需要监听的数据中添加不可枚举的属性 __ob__，防止重复监听，浪费性能
    Object.defineProperty(value, '__ob__', {
      value: this,
      writable: true,
      configurable: true,
      enumerable: false
    })
    
    if(Array.isArray(value)) { // 监听数组
      // 数组监听不使用 Object.defineProperty(), 
      // 因为通过下标更新数组影响性能，且性能代价和获得的用户体验收益不成正比。详见：https://github.com/vuejs/vue/issues/8562
      
      // 重写数组方法
      value.__proto__ = arrayMethods;

      this.observeArray(value)
    } else { // 监听对象
      this.walk(value);
    }
  }

  walk(data) {
    Object.keys(data).forEach(key => {
      defineReactive(data, key, data[key]);
    })
  }

  observeArray(data) {
    for (let i = 0; i < data.length; i++) {
      observe(data[i]);
    }
  }
}

// **重点** 实现数据劫持，兼容ie9及以上
function defineReactive(data, key, value) {
  // 递归 -- 嵌套的值为数组或对象也要进行监听
  observe(value);

  Object.defineProperty(data, key, {
    get() {
      console.log(`取值=======`);
      return value;
    },
    set(newValue) {
      if(value === newValue) {
        return;
      }
      console.log(`设值=======`);
      value = newValue;
    }
  })
}


export function observe(value) {
  // __ob__属性表示该数据已被监听，直接返回即可
  if(value.__ob__) {
    return value.__ob__;
  }

  if(Object.prototype.toString.call(value) === '[object Object]' || Array.isArray(value)) {
    return new Observer(value);
  }
}