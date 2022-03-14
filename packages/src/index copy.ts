/*
 * @Description: 描述
 * @Author: 吴文周
 * @Github: https://github.com/fodelf
 * @Date: 2022-03-13 18:05:07
 * @LastEditors: 吴文周
 * @LastEditTime: 2022-03-13 22:12:46
 */
// 原始数据
const obj = {
  text: "hello world",
  text1: "hello world tex1",
};
// 正在执行的副作用函数
let effectActiveFu: null | Function = null;

// 所有key的缓存map
let effectCacheMap: Map<string, Set<Function>> = new Map();

// // 副作用函数的缓存池子，现在就定义了一个
// let effectCacheFu: Set<Function> = new Set();

// 将原数据转换为代理数据使它具有响应式的特性
let objProxy = new Proxy(obj, {
  get(target: any, key: string, receiver: any) {
    // 是否存在激活方法
    if (effectActiveFu) {
      let effectList: Set<Function> = new Set();
      // 判读是否存在相同key的缓存列表
      if (effectCacheMap.has(key)) {
        effectList = effectCacheMap.get(key) as Set<Function>;
      } else {
        effectCacheMap.set(key, effectList);
      }
      // 添加到依赖列表
      effectList.add(effectActiveFu);
    }
    return Reflect.get(target, key, receiver);
  },
  set(target: any, key: string, value: string, receiver: any) {
    // 先设值在执行回调
    Reflect.set(target, key, value, receiver);
    // 设值你的操作触发副作用函数
    // 如果缓存池中存在
    if (effectCacheMap.has(key)) {
      let effectList = effectCacheMap.get(key);
      effectList!.forEach((item) => {
        item();
      });
    }
    return true;
  },
});
/**
 * @name: effectAction
 * @description: 副作用函数的行为改变dom
 * @param {type} {*}
 * @return {type} {*}
 */
function effectAction() {
  document.body.innerHTML = objProxy.text;
}
/**
 * @name: effectAction
 * @description: 副作用函数的行为弹出弹窗
 * @param {type} {*}
 * @return {type} {*}
 */
function effectAction1() {
  console.log(objProxy.text);
}
/**
 * @name: effectAction
 * @description: 副作用函数的行为弹出弹窗
 * @param {type} {*}
 * @return {type} {*}
 */
function effectAction2() {
  console.log(objProxy.text1);
}
/**
 * @name: effect
 * @description: 副作用封装
 * @param {Function} fun
 */
export function effect(fun: Function) {
  // 当前活跃的副作用函数就是此函数
  effectActiveFu = fun;
  // 触发收集
  fun();
  //
  effectActiveFu = null;
}
// 触发text 两个场景副作用的收集依赖
effect(effectAction);
effect(effectAction1);
// 触发text2的收集
effect(effectAction2);
setTimeout(() => {
  // 改变数据
  objProxy.text = "hello 吴文周 大帅哥";
}, 500);
setTimeout(() => {
  // 改变数据
  objProxy.text1 = "hello text1 吴文周 大帅哥";
}, 600);
