<template>
  <!-- 植保作业模板 -->
  <div class="schema">
    <ul class="sku">
      <li>
        <i class="iconfont el-icon-zuoyemianji"></i>
        <div>
          <p>{{ schemaObj.value5 }}亩</p>
          <p>作业面积</p>
        </div>
      </li>
      <li>
        <i class="iconfont el-icon-zuoyeshebei"></i>
        <div>
          <p>{{ schemaObj.value4 }}</p>
          <p>作业设备</p>
        </div>
      </li>
      <li>
        <i class="iconfont el-icon-zuoyesudu"></i>
        <div>
          <p>{{ schemaObj.value8 }} M/S</p>
          <p>作业速度</p>
        </div>
      </li>
      <li>
        <i class="iconfont el-icon-zuoyegaodu"></i>
        <div>
          <p>{{ schemaObj.value9 }}M</p>
          <p>作业高度</p>
        </div>
      </li>
      <li>
        <i class="iconfont el-icon-penshifukuan"></i>
        <div>
          <p>{{ schemaObj.value10 }}M</p>
          <p>喷施幅宽</p>
        </div>
      </li>
      <li>
        <i class="iconfont el-icon-muyongliang"></i>
        <div>
          <p>{{ schemaObj.value6 }}L</p>
          <p>亩用量</p>
        </div>
      </li>
      <li>
        <i class="iconfont el-icon-mudanjia"></i>
        <div>
          <p>{{ schemaObj.value7 }}¥</p>
          <p>亩单价</p>
        </div>
      </li>
    </ul>
    <ul class="environment">
      <li>
        <p>
          <label>飞手</label>
          <span
            >{{ record.activity[0].user.name }} {{ record.activity[0].user.no }}
          </span>
        </p>
        <p>
          <label>地勤</label>
          <span>{{ schemaObj.value20.name }} {{ schemaObj.value20.no }} </span>
        </p>
      </li>
      <li>
        <p>
          <label>环境温度（℃）</label>
          <span>{{ schemaObj.value11 }} </span>
        </p>
        <p>
          <label>环境湿度（%）</label>
          <span>{{ schemaObj.value12 }}</span>
        </p>
      </li>
      <li>
        <p>
          <label>开始时间</label>
          <span>{{ schemaObj.value2 }} </span>
        </p>
        <p>
          <label>结束时间</label>
          <span>{{ schemaObj.value3 }}</span>
        </p>
      </li>
      <li>
        <p>
          <label>风向</label>
          <span>{{ schemaObj.value14 }} </span>
        </p>
        <p>
          <label>风力</label>
          <span>{{ schemaObj.value15 }}级</span>
        </p>
      </li>
      <li>
        <p>
          <label>风速（M/S）</label>
          <span>{{ schemaObj.value16 }}</span>
        </p>
        <p>
          <label>天气</label>
          <span>{{ schemaObj.value13 }}</span>
        </p>
      </li>
    </ul>

    <div class="product-wrap">
      <label>防治用药 </label>
      <div class="product-list">
        <p v-for="item in schemaObj.value17">
          <span> {{ item.name }} </span>
          <span> {{ item.amount }}{{ item.unit }} </span>
        </p>
      </div>
    </div>
    <div>
      <label>日志记录 </label>
      <span>{{ schemaObj.value18 }}</span>
    </div>
    <el-image
      class="img"
      v-for="(r, index) in schemaObj.value1"
      :key="index"
      :src="r.thumbPath"
      :preview-src-list="[r.path]"
    >
    </el-image>
  </div>
</template>

<script>
import { formType } from "../../constant";
export default {
  props: {
    record: {},
    schema: {}
  },
  watch: {
    schema: {
      handler(newV, oldV) {
        let schemaObj = {};
        newV.map(e => {
          let value = e.value;
          if (e.type == formType.Album) {
            value = e.albumItems;
          } else if (e.type == formType.RelateUserInside) {
            value = e.data;
          } else if (e.type == formType.RelateProduct) {
            value = e.data;
          }
          schemaObj["value" + e.id] = value;
        });
        this.schemaObj = schemaObj;
      },
      immediate: true
    }
  },
  data() {
    return {
      schemaObj: {}
    };
  }
};
</script>

<style lang="scss" scoped>
@import "./archive.scss";
ul {
  list-style: none;
}
.sku {
  display: flex;
  flex-wrap: wrap;
  li {
    margin: 0 20px 20px 0;
    width: 140px;
    height: 80px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: #fdb933;
    color: #fff;
    border-radius: 4px;
    i {
      font-size: 36px;
    }
    div {
      text-align: center;
      p:first-child {
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
}
.environment {
  margin: 15px 0;
  display: flex;
  li {
    border-right: 1px solid #e6eaf3;
    padding: 0 50px;
    &:first-child {
      padding-left: 0;
    }
    &:nth-child(4) {
      border: 0;
    }
    &:last-child {
      padding-left: 0;
      border: 0;
      label {
        display: inline-block;
        width: 85px;
      }
    }
    p {
      margin: 10px 0;
      label {
        margin-right: 14px;
      }
    }
  }
}
.product-wrap {
  display: flex;
  .product-list {
    p {
      margin-bottom: 10px;
    }
  }
}
</style>
