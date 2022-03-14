/*
 * @Description: 描述
 * @Author: 吴文周
 * @Github: https://github.com/fodelf
 * @Date: 2022-03-10 07:00:35
 * @LastEditors: 吴文周
 * @LastEditTime: 2022-03-13 18:30:23
 */
// function test() {
//   const count = ref(0);
//   count.value = 1;
//   count.value = 2;
// }

// //虽然这两个赋值都是执行，在任务调度的时候，第一个赋值的回调并不生效
// let flag = false;
// let p = new Promise((resolve, reject) => {});
// function effect(callBack: Function) {
//   flag = true;
//   p.then(() => {
//     if (flag) {
//       return;
//     }
//   });
// }
