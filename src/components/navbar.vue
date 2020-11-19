<template>
  <div class="wrap">
    <!-- 插槽 slot ： 占位,替换内容用的 -->
    <div class="left">
      <slot name="left"></slot>
    </div>
    <div class="center">
      <slot name="center"></slot>
    </div>
    <div class="right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "nabbar",
};
</script>

<style  scoped>
.wrap {
  display: flex;
  height: 60px;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  padding: 0 6px;
  position: relative;
  z-index: 3;
}
.left {
  width: 30px;
}
.center {
  flex: 1;
  text-align: center;
}
.right {
  width: 55px;
}
</style>
