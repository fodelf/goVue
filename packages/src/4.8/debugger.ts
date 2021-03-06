/*
 * @Description: 描述
 * @Author: 吴文周
 * @Github: https://github.com/fodelf
 * @Date: 2022-03-16 22:45:02
 * @LastEditors: 吴文周
 * @LastEditTime: 2022-03-23 16:20:05
 */
import { reactive, effect, computed } from './index'
// // 原始数据
const obj = {
  count: 0
}
// // 将原数据转换为代理数据使它具有响应式的特性
let objProxy = reactive(obj)
const plusOne = computed(() => objProxy.count + 1)
const plusOne1 = computed(() => plusOne.value + 1)

setTimeout(() => {
  // console.log(plusOne.value)
  // console.log(plusOne.value)
  console.log(plusOne.value)
  console.log(plusOne.value)
  console.log(plusOne.value)
  // 修改赋值
  objProxy.count = 7
  // objProxy.count++
  // 打印计算变化
  console.log(plusOne1.value)
  console.log(plusOne.value)
}, 500)
