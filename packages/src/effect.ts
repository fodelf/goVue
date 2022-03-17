/*
 * @Description: 描述
 * @Author: 吴文周
 * @Github: https://github.com/fodelf
 * @Date: 2022-03-15 08:56:55
 * @LastEditors: 吴文周
 * @LastEditTime: 2022-03-17 09:16:37
 */
// 所有响应式对象缓存
export let targetsMap: WeakMap<
  object,
  Map<unknown, Set<ReactiveEffect>>
> = new WeakMap()
// 收集函数数据栈
export let effectActiveFuList: Array<ReactiveEffect> = []
// 当前激活的函数
export let effectActive: ReactiveEffect | null = null
// 当前是否处理依赖收集阶段
export let isTrackActive = false
// 任务执行队列
export let jobQueue: Set<Function> = new Set()
// 微任务
export let tick = Promise.resolve()
// 劫持对象类型
export interface Target {
  [string: string]: any
}
export interface Option {
  reactiveEffect?: ReactiveEffect
  lazy?: boolean
}

/**
 * @name: ReactiveEffect
 * @description: 当前激活函数类
 */
export class ReactiveEffect {
  // 收集函数
  public fu: Function
  // 调入任务
  public scheduler: (() => void) | undefined
  constructor(fu: Function, scheduler?: () => void) {
    this.fu = fu
    if (scheduler) {
      this.scheduler = scheduler
    }
  }
  // 执行函数
  run(): void {
    this.fu()
  }
}
let isFished = false
/**
 * @name: clearQueue
 * @description: 清除任务队列
 */
export function clearQueue() {
  if (isFished) {
    return
  }
  isFished = true
  tick.then(() => {
    jobQueue.forEach(fn => {
      fn()
    })
    jobQueue.clear()
    isFished = false
  })
}

/**
 * @name: effect
 * @description: 副作用封装
 * @param {Function} fun
 */
export function effect(fun: Function, option?: Option): Function {
  // 激活对象 新增改动
  const effectObject = option?.reactiveEffect
    ? option.reactiveEffect
    : new ReactiveEffect(fun)
  effectActive = effectObject
  // 将当前收集函数放入栈中
  effectActiveFuList.push(effectObject)
  // 设置激活收集状态
  isTrackActive = true
  function effectFu(effectObject: ReactiveEffect) {
    if (!option?.lazy) {
      fun()
    } else {
      // 将执行结果返回作为值 新增
      if (effectActive?.scheduler) {
        effectActive.scheduler()
      }
      return fun()
    }
    // 嵌套收集的情况下数据是否清空
    if (effectActiveFuList.length == 0) {
      isTrackActive = false
      effectActive = null
    }
  }
  // 如果不立即执行则返回当前的执行函数 新增
  if (option?.lazy) {
    fun()
    isTrackActive = false
    effectActive = null
    return effectFu
  } else {
    effectFu(effectObject)
    return () => {}
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
  effectActive = effectActiveFuList.pop() || effectActive
  // 是否存在激活对象
  if (effectActive && isTrackActive) {
    // 当前对象的缓存map
    let effectCacheMap: Map<unknown, Set<ReactiveEffect>> | undefined =
      targetsMap.get(target)
    // 判断当前对象是否存在缓存
    if (!effectCacheMap) {
      effectCacheMap = new Map()
      targetsMap.set(target, effectCacheMap)
    }
    // 当前对象当前key的依赖列表
    // let deps: Set<Function> = new Set();
    let deps: Set<ReactiveEffect> | undefined = effectCacheMap.get(key)
    // 判读是否存在相同key的缓存列表
    if (!deps) {
      deps = new Set()
      effectCacheMap.set(key, deps)
    }
    // 添加到依赖列表
    deps.add(effectActive)
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
  const effectCacheMap = targetsMap.get(target)
  if (effectCacheMap) {
    //判断当前key是否存在依赖列表
    let deps = effectCacheMap.get(key)
    if (deps) {
      // const effects = new Set(deps);
      deps.forEach(item => {
        // 当前get和set 触发同一个收集函数不执行解决oject.count++ 的这样的问题
        if (effectActive?.fu != item.fu) {
          effectActive = item
          // 将执行结果返回作为值 新增
          if (effectActive?.scheduler) {
            effectActive.scheduler()
          }
          item.run()
          effectActive = null
        }
      })
    }
  }
}
