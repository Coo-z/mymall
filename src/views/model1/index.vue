<template>
  <!--实时热销navbar 导航-->
  <div class="body">
    <nav-bar class="nav">
      <div slot="left">
        <i class="iconfont icon-fanhui" @click="goback()"></i>
      </div>
      <div slot="center">必买清单集合页</div>
    </nav-bar>
    <Scroll class="contentS">
      <div>
        <div class="title">
          <div class="p1"><h3>结婚什么值的买</h3></div>
          <div class="p2"><h1>必买清单</h1></div>
        </div>
        <div class="content">
          <div class="con">
            <div class="p3">
              100元搞定颜值婚房，必买清单在此
              <button>查看更多</button>
            </div>
            <ul>
              <li v-for="(item, key) in result[0]" :key="key">
                <router-link :to="'/productDetail/' + item._id">
                  <img :src="url + item.goods_img" />
                  <div class="name">{{ item.title }}</div>
                </router-link>
              </li>
            </ul>
          </div>
          <div class="con">
            <div class="p3">
              红色嫁妆清单，这些缺一不可！
              <button>查看更多</button>
            </div>
            <ul>
              <li v-for="(item, key) in result[1]" :key="key">
                <router-link :to="'/productDetail/' + item._id">
                  <img :src="url + item.goods_img" />
                  <div class="name">{{ item.title }}</div>
                </router-link>
              </li>
            </ul>
          </div>
          <div class="con">
            <div class="p3">
              给婚礼宾客准备什么，才不是礼数？
              <button>查看更多</button>
            </div>
            <ul>
              <li v-for="(item, key) in result[2]" :key="key">
                <router-link :to="'/productDetail/' + item._id">
                  <img :src="url + item.goods_img" />
                  <div class="name">{{ item.title }}</div>
                </router-link>
              </li>
            </ul>
          </div>
          <div class="con">
            <div class="p3">
              让堵门热闹又舒适，买他们准没错！
              <button>查看更多</button>
            </div>
            <ul>
              <li v-for="(item, key) in result[3]" :key="key">
                <router-link :to="'/productDetail/' + item._id">
                  <img :src="url + item.goods_img" />
                  <div class="name">{{ item.title }}</div>
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Scroll>
  </div>
</template>

<script>
import navBar from "@/components/navbar.vue";
import Scroll from "@/components/Scroll";
import { vuexData } from "@/assets/js/mixin";
import config from "@/assets/js/config.js";
export default {
  name: "hot-sale",
  mixins: [vuexData],
  components: {
    navBar,
    Scroll,
  },
  data() {
    return {
      elseArr: [],
      result: [],
      url: config.api,
    };
  },
  methods: {
    // 其他类的所有商品
    async else(flag) {
      let res = await this.Api.else(this.page);
      this.elseArr = res.data.data; // 第一次加载的数据
      console.log(this.elseArr);
      this.sliceArray(this.elseArr, 3);
    },
    async sliceArray(array, size) {
      for (var x = 0; x < Math.ceil(array.length / size); x++) {
        var start = x * size;
        var end = start + size;
        this.result.push(array.slice(start, end));
      }
      console.log(this.result);
    },
  },
  mounted() {
    this.ChangTabbarShow(false);
    this.else(false);
  },
  destroyed() {
    this.ChangTabbarShow(true);
  },
};
</script>

<style lang="scss" scoped>
.contentS {
  height: 600px;
  overflow: hidden;
  background-color: white;
}
.nav {
  background-color: white;
  color: black;
  font-size: 20px;
}
.title {
  width: 100%;
  height: auto;
  background-image: url("../../assets/images/model1bg.jpg");
  padding: 15px 0;
}
.title .p1 {
  width: 30%;
  height: auto;
  margin: 0 35% 10px 35%;
  font-size: 16px;
  color: rgba(248, 232, 142, 0.973);
  font-weight: bold;
}
.title .p2 {
  width: 60%;
  margin: 0 auto;
  height: auto;
  text-align: center;
  font-size: 50px;
  font-family: STHupo;
  color: rgba(248, 232, 142, 0.973);
  font-weight: 500;
}
.content {
  width: 100%;
  height: 1000px;
  background-color: #c62332;
}
.content .con {
  width: 94%;
  height: 180px;
  margin: 0 3% 15px 3%;
  background-color: white;
  border-radius: 8px;
  padding: 10px 10px;
}
.content .con .p3 {
  margin-bottom: 10px;
}
.content .con .p3 button {
  background-color: rgb(175, 15, 15);
  color: white;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 100;
  width: 22%;
  height: 20px;
  float: right;
}
.content .con ul {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
.content .con ul li {
  width: 32%;
  height: auto;
  box-shadow: 0px -1px 2px 2px #dbd9d9;
}
.content .con ul li img {
  width: 100%;
  height: 105px;
}
.name {
  text-align: center;
  font-size: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  line-clamp: 1;
  display: -webkit-box;
  text-overflow: -o-ellipsis-lastline;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
</style>
