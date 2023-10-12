// 农机-农机统计
<template>
  <div class="ele-body ele-body-card">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="15">
      <el-col :sm="6" :xs="24">
        <el-card
          shadow="never"
          class="monitor-count-card"
          style="background: #FDB933"
        >
          <section class="monitor-count-card-content">
            <div>
              <div class="monitor-count-card-text">
                巡田日志
              </div>
              <div class="monitor-count-card-num">
                <span>{{ data.archive }}</span>
                <div>
                  <img src="../../assets/up.svg" />
                  <span>+{{ data.archiveNew }}</span>
                </div>
              </div>
            </div>
            <i class="el-icon--dakuaixuntianbaitubiao"></i>
          </section>
        </el-card>
      </el-col>
      <el-col :sm="6" :xs="24">
        <el-card
          shadow="never"
          class="monitor-count-card"
          style="background: #FAA05A"
        >
          <section class="monitor-count-card-content">
            <div>
              <div class="monitor-count-card-text">
                问题记录
              </div>
              <div class="monitor-count-card-num">
                <span>{{ data.question }}</span>
                <div>
                  <img src="../../assets/up.svg" />
                  <span>+{{ data.questionNew }}</span>
                </div>
              </div>
            </div>
            <i class="el-icon--dakuaiwentibaitubiao"></i>
          </section>
        </el-card>
      </el-col>
      <el-col :sm="6" :xs="24">
        <el-card
          shadow="never"
          class="monitor-count-card"
          style="background: #32D296"
        >
          <section class="monitor-count-card-content">
            <div>
              <div class="monitor-count-card-text">
                预约/订单
              </div>
              <div class="monitor-count-card-num">
                <span>{{ data.order }}</span>
                <div>
                  <img src="../../assets/up.svg" />
                  <span>+{{ data.orderNew }}</span>
                </div>
              </div>
            </div>
            <i class="el-icon--dakuaidingdanbaitubiao"></i>
          </section>
        </el-card>
      </el-col>
      <el-col :sm="6" :xs="24">
        <el-card
          shadow="never"
          class="monitor-count-card"
          style="background: #52C5EC"
        >
          <section class="monitor-count-card-content">
            <div>
              <div class="monitor-count-card-text">
                农田数量
              </div>
              <div class="monitor-count-card-num">
                <span>{{ data.field }}</span>
                <div>
                  <img src="../../assets/up.svg" />
                  <span>+{{ data.fieldNew }}</span>
                </div>
              </div>
            </div>
            <i class="el-icon--dakuainongtianbaitubiao"></i>
          </section>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="15" type="flex">
      <el-col :sm="18" :xs="24">
        <!-- 统计图 -->
        <el-row :gutter="15">
          <el-col :sm="16" :xs="24">
            <archive />
          </el-col>
          <el-col :sm="8" :xs="24">
            <crop :value="cropChart" />
          </el-col>
          <el-col :sm="12" :xs="24">
            <question />
          </el-col>
          <el-col :sm="12" :xs="24">
            <order />
          </el-col>
        </el-row>
      </el-col>
      <el-col :sm="6" :xs="24">
        <el-card shadow="never" class="task-card">
          <div slot="header" class="header">
            <span>待处理事项</span>
          </div>
          <div class="tags">
            <div
              v-for="(item, index) in tags"
              :key="item.type"
              class="tag"
              :class="index == tagIndex ? 'tag-active' : ''"
              @click="changeTask(index)"
            >
              {{ item.name }}
            </div>
          </div>
          <div
            class="ele-cell task"
            v-for="(item, index) in tasks"
            :key="index"
            @click="toDetail(item)"
          >
            <i v-if="item.type == 0" class="el-icon--daichuli-rizhi"></i>
            <i v-if="item.type == 1" class="el-icon--daichuli-wenti"></i>
            <i v-if="item.type == 2" class="el-icon--daichuli-dingdan"></i>
            <div class="ele-cell ele-cell-content">
              <el-tooltip effect="dark" :content="item.name">
                <span class="ele-elip">{{ item.name }}</span>
              </el-tooltip>

              <span>{{ item.value }}</span>
            </div>
            <span>{{ item.createAt }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import EleChart from "ele-admin/packages/ele-chart";
import empty from "@/components/empty";
import archive from "./archive.vue";
import crop from "./crop.vue";
import question from "./question.vue";
import order from "./order.vue";
import { getStatistics, getTodoTask } from "@/api/dashboard";

export default {
  components: {
    EleChart,
    empty,
    archive,
    crop,
    question,
    order
  },
  data() {
    return {
      data: {},
      tasks: [],
      cropChart: null,
      tags: [
        {
          type: null,
          name: "全部"
        },
        {
          type: 0,
          name: "巡田日志"
        },
        {
          type: 1,
          name: "问题记录"
        },
        {
          type: 2,
          name: "预约/订单"
        }
      ],
      tagIndex: 0
    };
  },
  created() {
    this.getStatistics();
    this.getTodoTask();
  },
  methods: {
    async getStatistics() {
      const { data } = await getStatistics();
      console.log(data);
      this.data = data;
      const { pieChart: cropChart } = data;
      this.cropChart = cropChart;
    },
    async getTodoTask() {
      const { data } = await getTodoTask({
        size: 20,
        type: this.tags[this.tagIndex].type
      });
      this.tasks = data;
    },
    changeTask(index) {
      this.tagIndex = index;
      this.getTodoTask();
    },
    toDetail(item) {
      let path;
      let query = {
        id: item.id,
        customerId: item.userId,
        fieldId: item.fieldId
      };
      switch (item.type) {
        case 0:
          path = `/customer/information/tour-field/detail`;
          break;
        case 1:
          path = `/question/detail`;
          break;
        case 2:
          path = `/order/detail-page`;
          break;
      }
      this.$router.push({
        path,
        query
      });
    }
  }
};
</script>

<style lang="scss" scoped>
/* 统计卡片 */
// .monitor-count-card ::v-deep .el-card__body {
//   padding: 0;
//   position: relative;
// }
.monitor-count-card {
  box-sizing: border-box;
  padding: 20px 5%;
  color: #fff;
  .monitor-count-card-content {
    display: flex;
    align-items: center;
    height: 100%;
    div {
      flex: 1;
    }
    i {
      font-size: 100px;
    }
  }
  .monitor-count-card-num {
    display: flex;
    span:first-child {
      font-weight: 500;
      font-size: 32px;
    }
    div {
      display: flex;
    }
    img {
      width: 18px;
      height: 9px;
      margin: 0 10px;
    }
  }
  .monitor-count-card-text {
    margin-bottom: 24px;
  }
}
.monitor-count-card .monitor-count-card ::v-deep .ele-cell {
  padding: 10px 0;
}

.header {
  padding: 8px 0;
}

.task-card {
  height: 700px;
  ::v-deep .el-card__body {
    padding: 15px 10px;
    height: 620px;
    overflow: scroll;
  }
  .task {
    cursor: pointer;
    &:not(:last-child) {
      margin-bottom: 20px;
    }
    .ele-cell-content {
      span:first-child {
        width: 100px;
      }
    }
  }
  .tags {
    display: flex;
    margin-bottom: 20px;
    .tag {
      margin-right: 1px;
      width: 80px;
      line-height: 30px;
      text-align: center;
      background-color: #e7e7e7;
      border-radius: 10px 10px 0 0;
      cursor: pointer;
    }
    .tag-active {
      background-color: #66974d;
      color: #fff;
    }
  }
}
</style>
