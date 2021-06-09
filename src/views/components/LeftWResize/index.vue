<template>
  <div class="flex w100 h100-calc">

    <div class="left-div base-shadow h100" id="left">
      <slot name="left"></slot>
    </div>

    <div class="mid-line h100" @mousedown="mousedown($event)"></div>

    <div class="right-div h100 m-l-10">
      <slot name="right"></slot>
    </div>

  </div>
</template>

<script>
export default {
  methods: {
    // 鼠标按下侧边栏
    mousedown (e) {
      // 左边div的宽度
      let swidth = document.getElementById('left').offsetWidth
      // 鼠标点击时的位置
      let snum = e.clientX
      document.onmousemove = (e) => {
        document.getElementById('left').style.width = swidth + (e.clientX - snum) + 'px'
      }
      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
      }
    },
  }
}
</script>

<style scope>
/* .left-div { */
/* background-color: red; */
/* overflow-y: overlay; */
/* height: calc(100vh - 90px); */
/* padding-right: 6px; */
/* } */
.mid-line {
  width: 5px;
  /* margin-left: -px; */
  cursor: w-resize;
  /* height: calc(100vh - 90px); */
}
.right-div {
  /* background-color: blue; */
  flex: 1;
  /* margin-left: 10px; */
  /* height: calc(100vh - 90px); */
}
</style>
