<template>
  <div>
    <div ref="personWrap" class="wrap">
      <ul ref="personTab" class="content">
        <li v-for="(item,key) in datas" :key="key">{{key}}</li>
      </ul>
    </div>
  </div>
</template>
<script>
import BScroll from "better-scroll";
export default {
  data() {
    return {
      page: 1,
      datas: [],
    };
  },
  mounted() {
    this.personScroll();
  },
  methods: {
    async personScroll() {
      let res = await this.Api.recommend(this.page);
      this.datas = res.data.data.concat(this.datas);

      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.personWrap, {
          click: true,
          scrollY: true,
        });
        // 触发上拉刷新事件
        this.scroll.on("scrollEnd", (pos) => {
          // 下拉动作
          this.page++;
          this.personScroll();

          console.log(pos.y);
        });
      } else {
        this.scroll.refresh();
      }
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