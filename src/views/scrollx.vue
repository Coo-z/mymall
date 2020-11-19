<template>
  <div>
    <div class="wrap2" ref="personWrap">
      <ul class="content2" ref="personTab">
        <li class="person-item">1</li>
        <li class="person-item">2</li>
        <li class="person-item">3</li>
        <li class="person-item">4</li>
        <li class="person-item">5</li>
      </ul>
    </div>
  </div>
</template>
<script>
import BScroll from "better-scroll";
export default {
  data() {
    return {};
  },
  mounted() {
    this.personScroll();
  },
  methods: {
    personScroll() {
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.personWrap, {
            startX: 0,
            click: true,
            scrollX: true,
            // 忽略竖直方向的滚动
            scrollY: false,
          });
        }
      });
    },
  },
};
</script>
<style>
.wrap2 {
  width: 100%;
  height: 50px;
  overflow: hidden;
}
.content2 {
  width: 650px;
}
.wrap2 li {
  display: inline-block;
  background: #ff0;
  width: 120px;
  text-align: center;
  line-height: 40px;
  margin: 0 5px;
}
</style>