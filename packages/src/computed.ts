import { effect, ReactiveEffect } from './effect'

/*
 * @Description: 计算属性
 * @Author: 吴文周
 * @Github: https://github.com/fodelf
 * @Date: 2022-03-15 08:56:55
 * @LastEditors: 吴文周
 * @LastEditTime: 2022-03-17 09:14:13
 */
interface ComputedObject {
  value: any
}
/**
 * @name: ComputedRefImpl
 * @description: compute 实体类
 * @param {type} {*}
 * @return {type} {*}
 */
class ComputedRefImpl {
  // getter 函数
  private getter: () => void
  // 副作用函数执行
  private effectFu: Function
  // 缓存数据标志位
  private isDirty: boolean = true
  // 缓存数据标志位
  private cacheData: any = undefined
  private effectObject: ReactiveEffect
  constructor(getter: () => void) {
    this.getter = getter
    this.effectObject = new ReactiveEffect(this.getter, () => {
      this.isDirty = true
    })
    this.effectFu = effect(getter, {
      lazy: true,
      reactiveEffect: this.effectObject
    })
  }
  // value 引用
  get value() {
    if (this.isDirty) {
      this.cacheData = this.effectFu(this.effectObject)
      this.isDirty = false
    }
    return this.cacheData
  }
}
/**
 * @name: computed
 * @description: 计算属性函数
 * @return {ComputedObject} ComputedObject
 * @param {function} getter
 */
export function computed(getter: () => void): ComputedObject {
  return new ComputedRefImpl(getter)
}
