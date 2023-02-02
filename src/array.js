
const arrayProto = Array.prototype;

export const arrayMethods = Object.create(arrayProto);

// 重写会改变原数组的方法
const methods = ['push', 'pop', 'unshift', 'shift', 'splice', 'sort', 'reserve'];

methods.forEach(method => {
  arrayMethods[method] = function(...args) {
    // 执行源数组方法，确保重写后的方法与源方法行为一致
    const res = arrayProto[method].apply(this, args);

    // this 就是调用方法的数据本身， __ob__属性是 Observer 中添加的 实例对象
    const ob = this.__ob__;

    // 要向原数组中添加的数据
    let inserted;

    switch(method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        // splice 接收的第三个参数表示需要新增的数据
        inserted = args.slice(2);
      default:
        break;
    }

    // 向原数组添加了数据，则需要对新数据进行监听
    if(inserted) {
      ob.observeArray(inserted);
    }

    // 返回源数组方法的结果
    return res
  }
})