// 巡田日志详情
<template>
  <div class="ele-body">
    <el-card shadow="never" class="never-card">
      <div slot="header" class="header">
        <h4 class="ele-text-primary">
          {{ form.name }}
        </h4>
      </div>
      <el-row :gutter="10">
        <el-col :lg="12" :md="24">
          <ul>
            <li>
              <label>方案说明</label>
              <span>{{ form.instruction }}</span>
            </li>
            <li>
              <label>适用作物</label>
              <span>{{ form.cropName }}</span>
            </li>
            <li>
              <label>作业方法</label>
              <span>{{ form.jobDescription }}</span>
            </li>
            <li>
              <label>注意事项</label>
              <span>{{ form.warnDescription }}</span>
            </li>
            <li>
              <label>方案ID</label>
              <span>{{ form.no }}</span>
            </li>
          </ul>
          <Speak
            v-if="createUser"
            class="speak"
            :position-time="'right'"
            :say-data="createUser"
          ></Speak>
          <Speak
            v-if="approveUser"
            class="speak"
            :position-time="'right'"
            :say-data="approveUser"
          ></Speak>
          <div class="btns" v-if="form.stateCode == 0">
            <el-button
              v-permission="'archive_approve'"
              type="primary"
              @click="approveSolution"
              >审核</el-button
            >
            <el-button v-permission="'archive_up'" @click="toEdit"
              >修改</el-button
            >
          </div>
        </el-col>
        <el-col :lg="12" :md="24">
          <div v-for="item in form.products" class="product">
            <h4>
              <span class="ele-text-primary"> 预防用药 </span> {{ item.name }}
            </h4>
            <ul>
              <li>
                <label>剂量</label>
                <span>{{ item.amount }}{{ item.unit }}</span>
              </li>
              <li>
                <label>规格</label>
                <span>{{ item.meterage }}{{ item.unit }}</span>
              </li>
              <li>
                <label>产品类型</label>
                <span>{{ item.typeName }}</span>
              </li>
              <li>
                <label>主要成分</label>
                <span>{{ item.ingredient }}</span>
              </li>
              <li class="ele-cell" style="align-items: flex-start;">
                <label>产品图片</label>
                <div class="ele-cell-content images">
                  <img v-for="item in item.images" :src="item.url" />
                </div>
              </li>
            </ul>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import Speak from "@/components/speak";
import { getSolution, approveSolution } from "@/api/solution";
export default {
  components: {
    Speak
  },
  data() {
    return {
      form: {},
      createUser: null,
      approveUser: null
    };
  },
  created() {
    this.getSolution();
  },
  methods: {
    async getSolution() {
      const { id } = this.$route.query;
      const { data } = await getSolution(id);
      console.log(data);
      this.form = data;
      this.getSayOptions(data);
    },
    async approveSolution() {
      await approveSolution(this.form.id);
      this.$message.success("操作成功");
      this.getSolution();
    },
    getSayOptions(e) {
      if (e.createUser) {
        this.createUser = {
          img: e.createUser.avatar,
          name: e.createUser.name,
          no: e.createUser.no,
          time: e.createAt,
          content: "创建"
        };
      }
      if (e.approveUser) {
        this.approveUser = {
          img: e.approveUser.avatar,
          name: e.approveUser.name,
          no: e.approveUser.no,
          time: e.approveAt,
          content: "审核"
        };
      }
    },
    toEdit() {
      const { id } = this.$route.query;
      console.log(111);
      this.$router.push({
        path: "/setting/solution/add?id=1",
        query: {
          id
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.never-card {
  position: relative;
  min-height: calc(100vh - 130px);
}

ul {
  margin-top: 20px;
  li {
    list-style: none;
    font-size: 16px;
    margin-bottom: 30px;
    label {
      display: inline-block;
      width: 100px;
    }
    span {
      font-weight: bold;
    }
  }
}

.speak {
  margin-top: 20px;
  .com-img {
    margin-left: 35px;
    margin-top: 5px;
    .el-image {
      width: 80px;
      height: 80px;
      margin-left: 6px;
    }
    .el-image :nth-child(1) {
      margin-left: 0;
    }
  }
}
.btns {
  margin-top: 20px;
  display: flex;
  // justify-content: end;
  align-items: center;
  span {
    margin-right: 20px;
  }
}

.product {
  width: 600px;
  margin-top: 20px;
  padding: 30px;
  background-color: rgba($color: #f0f5ed, $alpha: 0.7);
  ul {
    display: flex;
    flex-wrap: wrap;
    li {
      width: 50%;
    }
  }
}

.images {
  padding: 0;
  img {
    display: inline-block;
    margin-right: 10px;
    width: 100px;
    height: 100px;
  }
}
</style>
