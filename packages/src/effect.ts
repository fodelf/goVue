/*
 * @Description: 描述
 * @Author: 吴文周
 * @Github: https://github.com/fodelf
 * @Date: 2022-03-15 08:56:55
 * @LastEditors: 吴文周
 * @LastEditTime: 2022-03-16 22:33:04
 */
// 所有响应式对象缓存
export let targetsMap: WeakMap<
  object,
  Map<unknown, Set<ReactiveEffect>>
> = new WeakMap();
// 收集函数数据栈
export let effectActiveFuList: Array<ReactiveEffect> = [];
// 当前激活的函数
export let effectActive: ReactiveEffect | null = null;
// 当前是否处理依赖收集阶段
export let isTrackActive = false;
// 任务执行队列
export let jobQueue: Set<Function> = new Set();
// 微任务
export let tick = Promise.resolve();
// 劫持对象类型
export interface Target {
  [string: string]: any;
}
export interface Option {
  scheduler?: boolean;
  lazy?: boolean;
}

/**
 * @name: ReactiveEffect
 * @description: 当前激活函数类
 */
export class ReactiveEffect {
  // 收集函数
  public fu: Function;
  // 配置参数
  public option: Option | undefined;
  constructor(fu: Function, option?: Option) {
    this.fu = fu;
    if (option) {
      this.option = option;
    }
  }
  // 执行函数
  run(): void {
    this.fu();
  }
}
let isFished = false;
/**
 * @name: clearQueue
 * @description: 清除任务队列
 */
export function clearQueue() {
  if (isFished) {
    return;
  }
  isFished = true;
  tick.then(() => {
    jobQueue.forEach((fn) => {
      fn();
    });
    jobQueue.clear();
    isFished = false;
  });
}

/**
 * @name: effect
 * @description: 副作用封装
 * @param {Function} fun
 */
export function effect(fun: Function, option?: Option): Function {
  debugger;
  // 激活对象 新增改动
  const effectObject = new ReactiveEffect(fun, option);
  // 将当前收集函数放入栈中
  effectActiveFuList.push(effectObject);
  // 设置激活收集状态
  isTrackActive = true;
  function effectFu(effectObject: ReactiveEffect) {
    effectActive = effectObject;
    if (!option?.lazy) {
      fun();
    } else {
      return fun();
    }
    // 嵌套收集的情况下数据是否清空
    if (effectActiveFuList.length == 0) {
      isTrackActive = false;
      effectActive = null;
    }
  }
  if (option?.lazy) {
    return effectFu;
  } else {
    effectFu(effectObject);
    return () => {};
  }
}
/**
 * @name: track
 * @description: 收集依赖函数
 * @param {any} target 响应式的原始数据
 * @param {unknown} key 触发读取的key
 */
export function track(target: object, key: unknown) {
  // 从数组中去除最后面那一个 或者 是否是依赖收集函数触发的 新增改动
  effectActive = effectActiveFuList.pop() || effectActive;
  // 是否存在激活对象
  if (effectActive && isTrackActive) {
    // 当前对象的缓存map
    let effectCacheMap: Map<unknown, Set<ReactiveEffect>> | undefined =
      targetsMap.get(target);
    // 判断当前对象是否存在缓存
    if (!effectCacheMap) {
      effectCacheMap = new Map();
      targetsMap.set(target, effectCacheMap);
    }
    // 当前对象当前key的依赖列表
    // let deps: Set<Function> = new Set();
    let deps: Set<ReactiveEffect> | undefined = effectCacheMap.get(key);
    // 判读是否存在相同key的缓存列表
    if (!deps) {
      deps = new Set();
      effectCacheMap.set(key, deps);
    }
    // 添加到依赖列表
    deps.add(effectActive);
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
  const effectCacheMap = targetsMap.get(target);
  if (effectCacheMap) {
    //判断当前key是否存在依赖列表
    let deps = effectCacheMap.get(key);
    if (deps) {
      // const effects = new Set(deps);
      deps.forEach((item) => {
        // 当前get和set 触发同一个收集函数不执行解决oject.count++ 的这样的问题
        if (effectActive?.fu != item.fu) {
          effectActive = item;
          //判断是否需要修改执行逻辑   新增改动
          if (item?.option?.scheduler) {
            jobQueue.add(item.fu);
            clearQueue();
          } else {
            item.run();
          }
          effectActive = null;
        }
      });
    }
  }
}
