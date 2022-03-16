/*
 * @Description: 描述
 * @Author: 吴文周
 * @Github: https://github.com/fodelf
 * @Date: 2022-03-15 08:56:55
 * @LastEditors: 吴文周
 * @LastEditTime: 2022-03-16 08:58:40
 */
// 所有响应式对象缓存
export let targetsMap: WeakMap<
  object,
  Map<unknown, Set<Function>>
> = new WeakMap();
// 收集函数数据栈
export let effectActiveFuList: Array<Function> = [];
// 当前激活的函数
export let effectActiveFu: null | Function = null;
// 当前是否处理依赖收集阶段
export let isTrackActive = false;
// 劫持对象类型
export interface Target {
  [string: string]: any;
}
/**
 * @name: effect
 * @description: 副作用封装
 * @param {Function} fun
 */
export function effect(fun: Function) {
  // 将当前收集函数放入栈中
  effectActiveFuList.push(fun);
  // 设置激活收集状态 新增改动
  isTrackActive = true;
  function effectFu(fun: Function) {
    effectActiveFu = fun;
    fun();
    // 嵌套收集的情况下数据是否清空 新增改动
    if (effectActiveFuList.length == 0) {
      isTrackActive = false;
      effectActiveFu = null;
    }
  }
  effectFu(fun);
}
/**
 * @name: track
 * @description: 收集依赖函数
 * @param {any} target 响应式的原始数据
 * @param {unknown} key 触发读取的key
 */
export function track(target: object, key: unknown) {
  // 从数组中去除最后面那一个 或者 是否是依赖收集函数触发的 新增改动
  effectActiveFu = effectActiveFuList.pop() || effectActiveFu;
  // 是否存在激活方法 新增改动
  if (effectActiveFu && isTrackActive) {
    // 当前对象当前key的依赖列表
    let deps: Set<Function> = new Set();
    // 当前对象的缓存map
    let effectCacheMap: Map<unknown, Set<Function>> = new Map();
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
export function trigger(target: Target, key: unknown) {
  // 如果对象是否在对象WeakMap的缓存池中存在
  if (targetsMap.has(target)) {
    const effectCacheMap = targetsMap.get(target);
    //判断当前key是否存在依赖列表
    if (effectCacheMap.has(key)) {
      let deps = effectCacheMap.get(key);
      // const effects = new Set(deps);
      deps.forEach((item) => {
        // 当前get和set 触发同一个收集函数不执行解决oject.count++ 的这样的问题   新增改动
        if (effectActiveFu != item) {
          effectActiveFu = item;
          item();
          effectActiveFu = null;
        }
      });
    }
  }
}
