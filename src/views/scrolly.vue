<template>
  <div>
    <div ref="personWrap" class="wrap">
      <ul ref="personTab" class="content">
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
  name: "ReserveInfo",
  data() {
    return {};
  },
  mounted() {
    this.personScroll();
  },
  methods: {
    personScroll() {
      this.$nextTick(() => {
        if (!this.$refs.personWrap) {
          return;
        }
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.personWrap, {
            click: true,
            scrollY: true,
            probeType: 2, //scroll事件生效
          });
          // scroll 事件
          // this.scroll.on("scroll", (pos) => {
          //   console.log(pos.y);
          // });
          // 下拉刷新
          this.scroll.on("touchEnd", (pos) => {
            // 下拉动作
            if (pos.y > 50) {
              console.log("下拉刷新");
            }
          });
        } else {
          this.scroll.refresh();
        }
      });
    },
  },
};
</script>
<style>
.wrap {
  width: 100%;
  height: 300px;
  overflow: hidden;
}
.wrap content {
  height: 1260px;
}
.wrap li {
  width: 200px;
  height: 200px;
  background: #f60;
  margin: 5px;
}
</style>