<template>
  <!--实时热销navbar 导航-->
  <div>
    <nav-bar class="nav">
      <div slot="left">
        <i class="iconfont icon-fanhui" @click="goback()"></i>
      </div>
      <div slot="center">酒店婚礼必备婚品</div>
    </nav-bar>
    <Scroll class="contentS">
      <div>
        <div class="title">
          <img src="@/assets/images/model2bg.jpg" alt="" />
        </div>
        <div class="p1">
          <p>很多新娘不知道在酒店迎亲办婚礼</p>
          <p>需要的物品是不一样，不一小心变土俗，</p>
          <p>真是对不起昂贵的婚宴和布置的花费呀！</p>
          <p>快让小希告诉你！酒店婚礼必备婚品是什么才够洋气</p>
        </div>
        <div class="content">
          <div class="title-big">婚礼必备门面</div>
          <div class="title-small">细节体现质感</div>
          <div class="part">
            <div class="p2">
              <div class="p2-title">
                “NO.1<span style="font-size: 25px">桌糖</span>
              </div>
              <div class="p2-content">
                酒店婚礼的精致之处就在于宾客一上桌就能发现属于自己的喜糖，等待婚礼时享受新人传达的喜悦。
                用搭配好的成品喜糖事最轻松的选择
                <img src="@/assets/images/t2.jpg" /><img
                  src="@/assets/images/t1.jpg"
                /><img src="@/assets/images/t3.jpg" />
              </div>
            </div>
            <ul class="part-goods">
              <li v-for="(item, key) in result[0]" :key="key">
                <router-link :to="'/productDetail/' + item._id">
                  <div class="img">
                    <img :src="url + item.goods_img" />
                  </div>
                  <div class="title">{{ item.title }}</div>
                  <div class="price">￥{{ item.market_price }}</div>
                  <button>立即选购</button>
                </router-link>
              </li>
            </ul>
          </div>
          <div class="part">
            <div class="p2">
              <div class="p2-title">
                “NO.2<span style="font-size: 25px">伴手礼</span>
              </div>
              <div class="p2-content">
                宾客带着满满的祝福送给新人，通常新人也会将祝福转化为伴手礼在回馈给宾客。选择精致的伴手礼也是获得好评的酒店婚礼王牌。
                <img src="@/assets/images/l3.jpg" />
                <img src="@/assets/images/l2.jpg" /><img
                  src="@/assets/images/l1.jpg"
                />
              </div>
            </div>
            <ul class="part-goods">
              <li v-for="(item, key) in result[1]" :key="key">
                <router-link :to="'/productDetail/' + item._id">
                  <div class="img">
                    <img :src="url + item.goods_img" />
                  </div>
                  <div class="title">{{ item.title }}</div>
                  <div class="price">￥{{ item.market_price }}</div>
                  <button>立即选购</button>
                </router-link>
              </li>
            </ul>
          </div>
          <div class="part">
            <div class="p2">
              <div class="p2-title">
                “NO.3<span style="font-size: 25px">签到本</span>
              </div>
              <div class="p2-content">
                看似不起眼的小物却非常重要！宾客递上自己的红包也希望能被记下自己的心意，好看的签到台不准备精美的签到本是不完美。
                <img src="@/assets/images/b2.jpg" />
                <img src="@/assets/images/b1.jpg" /><img
                  src="@/assets/images/b3.jpg"
                />
              </div>
            </div>
            <ul class="part-goods">
              <li v-for="(item, key) in result[2]" :key="key">
                <router-link :to="'/productDetail/' + item._id">
                  <div class="img">
                    <img :src="url + item.goods_img" />
                  </div>
                  <div class="title">{{ item.title }}</div>
                  <div class="price">￥{{ item.market_price }}</div>
                  <button>立即选购</button>
                </router-link>
              </li>
            </ul>
          </div>
          <div class="part">
            <div class="p2">
              <div class="p2-title">
                “NO.4<span style="font-size: 25px">气球</span>
              </div>
              <div class="p2-content">
                越来越多的新娘因为各式的原因选择从酒店出门，婚房布置成为苦恼，害怕高端的酒店房间变成图为婚房，其实一套完美的布置套装就搞得定！
                <img src="@/assets/images/q2.jpg" />
                <img src="@/assets/images/q3.jpg" /><img
                  src="@/assets/images/q1.jpg"
                />
              </div>
            </div>
            <ul class="part-goods">
              <li v-for="(item, key) in result[3]" :key="key">
                <router-link :to="'/productDetail/' + item._id">
                  <div class="img">
                    <img :src="url + item.goods_img" />
                  </div>
                  <div class="title">{{ item.title }}</div>
                  <div class="price">￥{{ item.market_price }}</div>
                  <button>立即选购</button>
                </router-link>
              </li>
            </ul>
          </div>
          <div class="part">
            <div class="p2">
              <div class="p2-title">
                “NO.5<span style="font-size: 25px">喜字</span>
              </div>
              <div class="p2-content">
                有新娘因为撕喜字坏酒店墙纸赔了500元！但是喜字不能不贴这种时候一定要推荐大家使用精致好看的静电贴，沾水就能贴非常好撕。
                <img src="@/assets/images/x2.jpg" />
                <img src="@/assets/images/x1.jpg" /><img
                  src="@/assets/images/x3.jpg"
                />
              </div>
            </div>
            <ul class="part-goods">
              <li v-for="(item, key) in result[4]" :key="key">
                <router-link :to="'/productDetail/' + item._id">
                  <div class="img">
                    <img :src="url + item.goods_img" />
                  </div>
                  <div class="title">{{ item.title }}</div>
                  <div class="price">￥{{ item.market_price }}.00</div>
                  <button>立即选购</button>
                </router-link>
              </li>
            </ul>
          </div>
          <div class="part">
            <div class="p2">
              <div class="p2-title">
                “NO.6<span style="font-size: 25px">团扇</span>
              </div>
              <div class="p2-content">
                如果是穿和秀服或者龙袍挂出门，一定要准备精致的团扇，
                不管是拍照或者是新浪结亲的时候都用得上！古韵典雅的没人值得拥有。
                <img src="@/assets/images/s2.jpg" />
                <img src="@/assets/images/s3.jpg" /><img
                  src="@/assets/images/s1.jpg"
                />
              </div>
            </div>
            <ul class="part-goods">
              <li v-for="(item, key) in result[5]" :key="key">
                <router-link :to="'/productDetail/' + item._id">
                  <div class="img">
                    <img :src="url + item.goods_img" />
                  </div>
                  <div class="title">{{ item.title }}</div>
                  <div class="price">￥{{ item.market_price }}.00</div>
                  <button>立即选购</button>
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
      console.log(res.data.data);
      this.elseArr = res.data.data; // 第一次加载的数据
      this.sliceArray(this.elseArr, 2);
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
// 导航
.nav {
  background-color: white;
  color: black;
  font-size: 20px;
}
// 图片
.title {
  width: 100%;
  height: auto;
}
// 粉红色背景文字
.p1 {
  width: 100%;
  height: 124px;
  background-color: #fa6a73;
  color: white;
  text-align: center;
  padding: 20px 0;
}
.p1 p {
  margin-bottom: 5px;
  font-size: 9px;
  letter-spacing: 2px;
  text-decoration: underline;
}
// 正文部分
.content {
  width: 100%;
  height: auto;
  background-color: #ffeee6;
  padding-top: 30px;
}
.content .title-big {
  height: auto;
  width: 100%;
  text-align: center;
  font-size: 30px;
  font-family: STYaoti;
  font-weight: 700;
  letter-spacing: 8px;
  background: -webkit-linear-gradient(top, #df9d6b, #fcbf93, #df9d6b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
  position: relative;
}
.content .title-big::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  width: 20%;
  height: 1px;
  background: #df9d6b;
}
.content .title-big::before {
  content: "";
  position: absolute;
  top: 50%;
  right: 0;
  width: 22%;
  height: 1px;
  background: #df9d6b;
}
.content .title-small {
  height: auto;
  width: 100%;
  text-align: center;
  font-size: 15px;
  letter-spacing: 6px;
  font-family: STYaoti;
  background: -webkit-linear-gradient(top, #df9d6b, #fcbf93, #df9d6b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.part {
  width: 100%;
  height: auto;
  margin-top: 20px;
}
.p2 {
  width: 90%;
  margin: 0 auto;
  height: auto;
  column-count: 2;
}
.p2 .p2-title {
  font-size: 30px;
  font-family: STYaoti;
  font-weight: 700;
  letter-spacing: 0px;
  color: #df9d6b;
  position: relative;
  margin-bottom: 10px;
}
.p2 .p2-title::after {
  content: "";
  position: absolute;
  top: 110%;
  left: 20px;
  width: 90%;
  height: 2px;
  background: #df9d6b;
}
.p2 .p2-content {
  font-weight: 100;
  line-height: 25px;
  text-indent: 2em;
}
// 商品
.part-goods {
  width: 94%;
  height: auto;
  margin: 20px auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.part-goods li {
  width: 48%;
  height: auto;
  background-color: white;
  border-radius: 10px;
}
.part-goods li .title {
  width: 90%;
  height: auto;
  margin: 10px auto;
  font-size: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  line-clamp: 2;
  display: -webkit-box;
  text-overflow: -o-ellipsis-lastline;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.part-goods li .price {
  width: 90%;
  height: auto;
  margin: 0 auto;
  color: red;
}
.part-goods li button {
  width: 90%;
  height: auto;
  margin-left: 5%;
  margin-bottom: 10px;
  border: 1px solid red;
  border-radius: 20px;
  background-color: white;
}
</style>
