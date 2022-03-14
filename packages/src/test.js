/*
 * @Description: 描述
 * @Author: 吴文周
 * @Github: https://github.com/fodelf
 * @Date: 2022-03-12 07:29:25
 * @LastEditors: 吴文周
 * @LastEditTime: 2022-03-12 07:29:26
 */
const dom = {
  methods: {
    handleCilck: () => {
      alert("Hello Word");
    },
  },
  render() {
    h(div, { onClick: handleCilck }, "点我");
  },
};
