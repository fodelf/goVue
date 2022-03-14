/*
 * @Description: 描述
 * @Author: 吴文周
 * @Github: https://github.com/fodelf
 * @Date: 2022-03-14 23:37:19
 * @LastEditors: 吴文周
 * @LastEditTime: 2022-03-14 23:43:40
 */
interface Target {
  [string: string]: any;
}
// 正在执行的副作用函数
export let effectActiveFu: null | Function = null;
// 所有响应式对象缓存
export let targetsMap: WeakMap<
  object,
  Map<unknown, Set<Function>>
> = new WeakMap();
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
  effectActiveFu = null;
}
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
function trigger(target: Target, key: unknown) {
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
/**
 * @name: createReactiveObject
 * @description: 创建响应式对象
 * @param {type} {*}
 * @return {type} {*}
 * @param {Target} target
 */
export function createReactiveObject(target: Target) {
  return new Proxy(target, {
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
}
