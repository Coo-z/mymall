<template>
  <div class="history" v-if="historys.length">
    <div class="title">
      <h4 class="history-title">历史搜索</h4>
      <a href="javascript:;" class="history-btn" @click="clear">
        <i
          class="iconfont icon-changyonggoupiaorenshanchu"
          style="font-size: 23px"
        ></i>
      </a>
    </div>
    <transition-group class="g-list" name="list" tag="ul">
      <li class="g-list-item" v-for="item in historys" :key="item">
        <p class="g-list-text" @click="serachName(item)">{{ item }}</p>
        <i class="iconfont icon-guanbi" @click.stop="removeItem(item)"></i>
      </li>
    </transition-group>
    <div class="title">
      <h4 class="history-title">搜索发现</h4>
    </div>
    <div>
      <transition-group class="g-list" name="list" tag="ul">
        <li class="g-list-item" v-for="(item, items) in hot" :key="items">
          <p class="img"><img :src="item.img" /></p>
          <p class="g-list-text" @click="serachName(item.title)">
            {{ item.title }}
          </p>
          <p class="g-list-p">{{ item.p }}</p>
        </li>
      </transition-group>
    </div>
  </div>
</template>

<script>
import { MessageBox } from "mint-ui";
import storage from "@/assets/js/storage.js"; // set(),get(),remove(),clear()
export default {
  name: "SearchHistory",
  data() {
    return {
      historys: [],
      hot: [
        {
          img: require("@/assets/images/p1.png"),
          title: "伴手礼回礼",
          p: "热门",
        },
        {
          img: require("@/assets/images/p2.png"),
          title: "迎亲堵门工具",
          p: "热闹",
        },
        {
          img: require("@/assets/images/p3.png"),
          title: "16种品牌喜糖任选",
          p: "一站购齐",
        },
        {
          img: require("@/assets/images/p4.png"),
          title: "精致婚房布置",
          p: "必看",
        },
      ],
    };
  },
  created() {
    this.getKeyword();
  },
  methods: {
    serachName(item) {
      this.$emit("keywordEnd", item);
    },
    update() {
      this.getKeyword();
    },
    getKeyword() {
      this.historys = storage.get("historys") || [];
    },
    removeItem(item) {
      this.historys = this.historys.filter((val) => val !== item);
      storage.set("historys", this.historys);
    },
    clear() {
      MessageBox.alert("清空历史数据成功").then((action) => {
        storage.remove("historys");
        location.reload();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.history {
  padding-bottom: 200px;
  background-color: #fff;
}
.title {
  display: flex;
}
.history-title {
  height: auto;
  line-height: 34px;
  padding: 15px 0 15px 15px;
  font-size: 25px;
  font-weight: 700;
  text-align: left;
  margin-right: 55%;
}
.history-btn {
  text-align: center;
  justify-items: center;
  width: 10%;
  height: 40px;
  margin-top: 15px;
  color: grey;
}
.iconfont {
  margin-left: 10px;
  font-size: 10px;
}
.g-list {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
  font-size: 20px;
  padding: 0 15px;
}
.img {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}
.g-list-item {
  display: flex;
  width: auto;
  padding: 5px 10px 5px 10px;
  font-size: 16px;
  height: auto;
  background-color: rgb(241, 241, 241);
  border-radius: 15px;
  margin-right: 10px;
  margin-bottom: 5px;
  font-weight: 600;
}
.g-list-p {
  color: rgb(255, 115, 0);
  font-size: 12px;
  margin-left: 5px;
  font-weight: 600;
}
.g-list-item .iconfont {
  width: auto;
  height: auto;
  margin-top: 8px;
  margin-left: 3px;
}
.list-enter-active,
.list-leave-active {
  transition: height 0.1s;
}
.list-enter,
.list-leave-to {
  height: 0;
}
</style>
