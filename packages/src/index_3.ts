// /*
//  * @Description: 描述
//  * @Author: 吴文周
//  * @Github: https://github.com/fodelf
//  * @Date: 2022-03-05 05:19:02
//  * @LastEditors: 吴文周
//  * @LastEditTime: 2022-03-13 17:19:38
//  */

// // /**
// //  * @name: ref
// //  * @description: 响应式函数
// //  * @param {type} {*}
// //  * @return {type} {*}
// //  * @param {unknown} value
// //  */
// // function ref(value: unknown){
// //    return  new RefImpl(value);
// // }

// // function trackEffect<RefImpl>(ref: RefImpl) {
// //   const deps = new Set();
// //   // ref.
// // }
// // /**
// //  * @name: RefImpl
// //  * @description: 响应式实现
// //  * @param {type} {*}
// //  * @return {type} {*}
// //  */
// // class RefImpl<T> {
// //   private _value: T;
// //   public deps!: Set<any>
// //   constructor(value: T) {
// //     this._value = value;
// //   }
// //   get value() {
// //     console.log("get");
// //     return this._value
// //   }
// //   set value(value: T) {
// //     console.log("set");
// //     this._value = value;
// //   }
// // }
// // /**
// //  * @name: setup
// //  * @description: 初始化方式
// //  * @param {type} {*}
// //  * @return {type} {*}
// //  */
// // const setup = () => {
// //   const counter = ref(1);
// //   console.log("counter", counter);
// //   setTimeout(() => {
// //     counter.value = 10
// //   },  200)
// //   return {
// //     counter: counter.value
// //   }
// // }

// // setup()

// // console.log("sxxxsss")
// // const bucket = new Set();
// // const data = { key: "hello world" }

// // const object = new Proxy(data, {
// //   get(target: any, key: string) {

// //     return target[key]
// //   },
// //   set(target,key,newValue) {
// //     target[key] = newValue
// //     return true
// //   }
// // })

// function reactive<T>(target: T) {
//   return createReactiveObject(target);
// }
// let depsMap = new Map();
// export let activeEffect: ReactiveEffect | undefined;
// export class ReactiveEffect<T = any> {
//   // active = true
//   deps: any[] = [];
//   constructor(
//     public fn: () => T // public scheduler: EffectScheduler | null = null, // scope?: EffectScope
//   ) {
//     // recordEffectScope(this, scope)
//   }

//   run() {
//     //   if (!this.active) {
//     return this.fn();
//     //   }
//     //   let parent: ReactiveEffect | undefined = activeEffect
//     //   let lastShouldTrack = shouldTrack
//     //   while (parent) {
//     //     if (parent === this) {
//     //       return
//     //     }
//     //     parent = parent.parent
//     //   }
//     //   try {
//     //     this.parent = activeEffect
//     //     activeEffect = this
//     //     shouldTrack = true

//     //     trackOpBit = 1 << ++effectTrackDepth

//     //     if (effectTrackDepth <= maxMarkerBits) {
//     //       initDepMarkers(this)
//     //     } else {
//     //       cleanupEffect(this)
//     //     }
//     //     return this.fn()
//     //   } finally {
//     //     if (effectTrackDepth <= maxMarkerBits) {
//     //       finalizeDepMarkers(this)
//     //     }

//     //     trackOpBit = 1 << --effectTrackDepth

//     //     activeEffect = this.parent
//     //     shouldTrack = lastShouldTrack
//     //     this.parent = undefined
//     //   }
//   }

//   // stop() {
//   //   if (this.active) {
//   //     cleanupEffect(this)
//   //     if (this.onStop) {
//   //       this.onStop()
//   //     }
//   //     this.active = false
//   //   }
//   // }
// }
// function trackEffects(dep: any) {
//   if (activeEffect) {
//     dep.add(activeEffect!);
//     activeEffect!.deps.push(dep);
//   }
// }
// function track(target: any, key: string) {
//   const dep = new Set();
//   depsMap.set(key, dep);
//   trackEffects(dep);
// }
// export function triggerEffects(dep: any | ReactiveEffect[]) {
//   // spread into array for stabilization
//   for (const effect of dep) {
//     // debugger
//     //   if (effect.scheduler) {
//     //     effect.scheduler()
//     //   } else {
//     effect.run();
//     //   }
//     // }
//   }
// }
// export function trigger(
//   target: object,
//   key?: unknown,
//   newValue?: unknown,
//   oldValue?: unknown,
//   oldTarget?: Map<unknown, unknown> | Set<unknown>
// ) {
//   const dep = depsMap.get(key);
//   // deps.push(depsMap.get(ITERATE_KEY))
//   triggerEffects(dep);
// }

// function createReactiveObject<T extends Object>(target: T) {
//   // 创建代理对象实现数据劫持
//   const proxy = new Proxy(target, {
//     get(target: any, key: string) {
//       // 依赖收集
//       track(target, key);
//       return target[key];
//     },
//     set<T>(target: any, key: string, value: T) {
//       const oldValue = target[key];
//       target[key] = value;
//       trigger(target, key, value, oldValue);
//       return true;
//     },
//   });
//   return proxy;
// }

// function effect(fu: () => void) {
//   activeEffect = new ReactiveEffect(fu);
//   fu();
// }
// const counter = reactive({
//   count: 1,
// });
// effect(() => {
//   console.log(counter.count);
//   (document.getElementById("container") as unknown as HTMLElement).innerHTML =
//     counter.count;
// });
// setTimeout(() => {
//   counter.count = 2;
// });
