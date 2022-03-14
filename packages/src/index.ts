/*
 * @Description: 描述
 * @Author: 吴文周
 * @Github: https://github.com/fodelf
 * @Date: 2022-03-13 18:05:07
 * @LastEditors: 吴文周
 * @LastEditTime: 2022-03-14 09:32:01
 */
// 原始数据
const obj = {
  text: "hello world",
  text1: "hello world tex1",
};
const obj1 = {
  text: "obj1 hello world",
  text1: "obj1 hello world tex1",
};
export interface Target {
  [string: string]: any;
}
// 正在执行的副作用函数
let effectActiveFu: null | Function = null;
// 所有响应式对象缓存
let targetsMap: WeakMap<object, Map<unknown, Set<Function>>> = new WeakMap();
/**
 * @name: track
 * @description: 收集依赖函数
 * @param {type} {*}
 * @return {type} {*}
 * @param {any} target 响应式的原始数据
 * @param {unknown} key 触发读取的key
 */
function track(target: object, key: unknown) {
  // 是否存在激活方法
  if (effectActiveFu) {
    // 当前对象的缓存map
    let effectCacheMap: Map<unknown, Set<Function>> = new Map();
    // 当前对象当前key的依赖列表
    let deps: Set<Function> = new Set();

    // 判断当前对象是否存在缓存
    if (targetsMap.has(target)) {
      effectCacheMap = targetsMap.get(target);
    } else {
      targetsMap.set(target, effectCacheMap);
    }
    // 判读是否存在相同key的缓存列表
    if (effectCacheMap.has(key)) {
      deps = effectCacheMap.get(key);
    } else {
      effectCacheMap.set(key, deps);
    }
    // 添加到依赖列表
    deps.add(effectActiveFu);
  }
}
/**
 * @name: trigger
 * @description: 触发函数
 * @param {type} {*}
 * @return {type} {*}
 * @param {object} target
 * @param {unknown} key
 */
function trigger(target: object, key: unknown) {
  // 如果对象是否在对象WeakMap的缓存池中存在
  if (targetsMap.has(target)) {
    const effectCacheMap = targetsMap.get(target);
    //判断当前key是否存在依赖列表
    if (effectCacheMap.has(key)) {
      let deps = effectCacheMap.get(key);
      deps.forEach((item) => {
        item();
      });
    }
  }
}
function createReactiveObject() {}
// 将原数据转换为代理数据使它具有响应式的特性
let objProxy = new Proxy(obj, {
  get(target: Target, key: string, receiver: unknown) {
    // 创建收集
    track(target, key);
    return Reflect.get(target, key, receiver);
  },
  set(target: Target, key: string, value: string, receiver: unknown) {
    // 先设值在执行回调
    Reflect.set(target, key, value, receiver);
    trigger(target, key);
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
