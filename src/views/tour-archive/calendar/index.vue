// 添加巡田日志
<template>
  <div class="tour-archive ele-body">
    <div class="search ele-cell">
      <el-tag
        v-for="(item, index) in archives"
        :key="item.id"
        :effect="current === index ? 'plain' : 'dark'"
        @click="changeArchive(index)"
        >{{ item.name }} {{ item.count }}</el-tag
      >
      <el-input
        v-model="form.no"
        placeholder="请输入巡田ID"
        clearable
      ></el-input>
      <el-button
        type="primary"
        @click="getArchiveCalendarItems"
        class="ele-btn-icon"
        >查询
      </el-button>
    </div>
    <el-row :gutter="10">
      <el-col :lg="12" :md="24">
        <el-card class="style-schedule">
          <div class="date-header">
            <h1>当前日期{{ date }}</h1>
            <div v-if="schedule" class="div-button">
              <button @click="schedule.prevYearFun()">上一年</button>
              <button @click="schedule.prevMonthFun()">上个月</button>
              <button @click="schedule.nextMonthFun()">下个月</button>
              <button @click="schedule.nextYearFun()">下一年</button>
              <button @click="schedule.renderToday()">返回今天</button>
            </div>
          </div>
          <div v-schedule:loadSchedule></div>
          <div class="marker-bottom">
            <div class="box">
              <p>标记图例</p>
              <!-- <div>
                <p></p>
                <span>种植季</span>
              </div> -->
              <div>
                <p></p>
                <span>当天</span>
              </div>
              <div>
                <p></p>
                <span>选中</span>
              </div>
              <div>
                <p></p>
                <span>有活动</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :lg="12" :md="24" class="card-wrap">
        <template v-if="records.length">
          <div
            class="card ele-cell ele-bg-white"
            v-for="item in records"
            :key="item.id"
            @click="toDetail(item)"
          >
            <div class="ele-bg-primary card-type">{{ item.archiveName }}</div>
            <div class="ele-cell ele-cell-content card-content">
              <div class="ele-cell-content">
                <div class="ele-cell">
                  <el-avatar :src="item.userCustome.avatar"></el-avatar>
                  <div class="ele-cell-content">
                    <div class="ele-cell-title">
                      {{ item.userCustome.name }}
                    </div>
                    <div class="ele-cell-desc">
                      {{ item.userCustome.no }}
                    </div>
                  </div>
                </div>
                <p>
                  <span class="ele-text-primary">{{ item.cycleName }}</span>
                  <span>{{ item.no }}</span>
                </p>
                <p>
                  <span>{{ item.field.areaName }}</span>
                  <span>{{ item.field.fieldName }}</span>
                  <span>{{ item.field.cropName }}</span>
                </p>
                <p
                  style="word-wrap: break-word;word-break: break-all;white-space: normal"
                >
                  {{ item.description }}
                </p>
                <p class="ele-text-secondary">
                  {{ item.userInside.name }} {{ item.createAt }}
                  <span>
                    <i class="el-icon-chat-line-square"></i>
                    {{ item.messageCount }}</span
                  >
                </p>
              </div>
              <img class="archive-image" :src="item.imagePath" />
            </div>
          </div>
        </template>
        <Empty v-else />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  getArchiveCalendarCount,
  getArchiveCalendarItems,
  getArchiveCalendarTotalByMonth
} from "@/api/archiveCalendar";

import Schedule from "../../../../public/schedule/schedule.js";
import Empty from "@/components/empty.vue";

export default {
  components: { Empty },
  data() {
    return {
      date: null,
      schedule: new Schedule(),
      archives: {},
      form: {
        archiveId: "",
        no: "",
        pageIndex: 0,
        pageSize: 10,
        pageCount: 0
      },
      current: 0,
      records: [],
      loading: false
    };
  },
  created() {
    this.getArchiveCalendarCount();
    this.getArchiveCalendarItems();
  },
  mounted() {
    document
      .querySelector(".card-wrap")
      .addEventListener("scroll", this.scroll);
  },
  methods: {
    loadSchedule(el) {
      this.schedule.init({
        el,
        //自定义当前日期
        // date: '2021-02-21',
        // 是否开启阴历转换
        isCalendar: true,
        // 是否显示其他月份信息
        isOtherMonth: true,
        //disabledBefore: '2022-02-20',	//禁用此日期之前
        //disabledAfter: '2022-03-10',	//禁用此日期之后
        //disabledDate: ['2022-02-21', '2022-02-22', '2022-02-23'],	//禁用的日期
        // 当前月份回调函数
        callback: async date => {
          this.date = date;
          const { data } = await getArchiveCalendarTotalByMonth(date);
          if (data.length === 0) return;
          for (let r of data) {
            const archives = [];
            for (let v in r.archives) {
              archives.push({
                // 标题
                title: r.archives[v].slice(0, 2),
                // key
                key: v,
                // 类样式
                className: `aside-style${v}`
              });
            }
            this.schedule.setClounm({
              // 当前列样式 td
              className: "activity-style",
              date: r.date.split(" ")[0],
              formatter: e => {
                return archives;
              }
            });
          }
        }
        //点击获取当前点击日期
        // selectCallback: e => {
        //   console.log(e);
        // }
      });
      //当前日期年月
      // console.log(this.schedule.getDate);
      //当前年月日
      // console.log(this.schedule.today);
    },
    async getArchiveCalendarCount() {
      const { data } = await getArchiveCalendarCount();
      const all = {
        id: null,
        name: "全部"
      };
      this.archives = [all, ...data];
    },
    async getArchiveCalendarItems(refresh) {
      if (refresh) {
        this.form.pageIndex = 0;
        this.records = [];
      }
      const {
        data: { data, meta }
      } = await getArchiveCalendarItems(this.form);
      this.records = [...this.records, ...data];
      this.form.pageCount = meta.pageCount;
      this.loading = false;
    },
    scroll() {
      let obj = document.querySelector(".card-wrap");
      var scrollHeight = obj.scrollHeight;
      var scrollTop = obj.scrollTop;
      var objHeight = obj.offsetHeight;
      if (
        scrollHeight <= scrollTop + objHeight + 100 &&
        !this.loading &&
        this.form.pageIndex + 1 < this.form.pageCount
      ) {
        this.loading = true;
        this.form.pageIndex++;
        this.getArchiveCalendarItems();
      }
    },
    changeArchive(index) {
      this.current = index;
      this.form.archiveId = this.archives[index].id;
      this.getArchiveCalendarItems(true);
    },
    toDetail(item) {
      this.$router.push({
        path: `/customer/information/tour-field/detail`,
        query: {
          id: item.id,
          customerId: item.userCustome.id,
          fieldId: item.field.id
        }
      });
    }
  }
};
</script>

<style lang="scss">
.tour-archive {
  .style-schedule {
    overflow-y: scroll;
    // height: calc(100vh - 180px);
  }
  .date-header {
    height: 66px;
    display: flex;
    align-items: center;
    border-radius: 6px;
    justify-content: space-between;
    background-color: #e6eaf3;
    h1 {
      font-size: 22px;
      margin-left: 10px;
    }
    .div-button {
      button {
        width: 60px;
        height: 40px;
        border: 0;
        cursor: pointer;
        color: white;
        background-color: #66974d;
      }
      button:nth-last-child(1) {
        width: 102px;
        height: 40px;
        margin-right: 10px;
      }
      button:nth-last-child(2) {
        margin-right: 10px;
      }
    }
  }
  .marker-bottom {
    margin-top: 20px;
    height: 70px;
    position: relative;
    .box {
      position: absolute;
      right: 0;
      display: flex;
      p {
        color: #777777;
      }
      div {
        width: 40px;
        text-align: center;
        p {
          width: 30px;
          height: 20px;
          margin: auto;
          border-radius: 4px;
        }
        span {
          color: #777777;
          font-size: 10px;
        }
      }
      //div:nth-of-type(1) p {
      //  background-color: #dee9fe;
      //}
      div:nth-of-type(1) p {
        background-color: #4bc4ee;
      }
      div:nth-of-type(2) p {
        background-color: #ff8100;
      }
      div:nth-of-type(3) p {
        background-color: #66974d;
      }
    }
  }
  //表格样式
  .tb-style {
    width: 100%;
    border-spacing: 0;
    border-radius: 1px;
  }
  .tb-style > thead > tr > th {
    font-size: 14px;
    color: black;
    text-align: center;
    height: 38px;
    background-color: #e6eaf3;
    border-top: 2px solid #fff;
    border-bottom: 1px solid #fff;
  }
  .tb-style > thead > tr > th:nth-of-type(1) {
    border-radius: 6px 0 0 6px;
  }
  .tb-style > thead > tr > th:nth-last-of-type(1) {
    border-radius: 0 6px 6px 0;
  }
  .tb-style > tbody tr:nth-of-type(1) td {
    border-top: 1px solid #fff;
  }
  .tb-style > tbody > tr > td > p:nth-of-type(1) {
    margin-top: -50px;
  }
  .tb-style > tbody > tr > td > p:nth-of-type(2) {
    margin-top: -15px;
  }
  .tb-style > tbody tr td {
    padding-left: 10px;
    padding-right: 10px;
    font-size: 12px;
    height: 102px;
    border: 1px solid #fff;
    border-radius: 6px;
    position: relative;
    background-color: #dee9fe;
  }
  .tb-style > tbody tr td:nth-last-child(1) {
    border-right: 0;
  }

  .tb-style > tbody tr > td.current {
    color: #fff;
    background: #ff8100 !important;
  }
  .tb-style > tbody tr td.dayStyle {
    line-height: 35px;
    cursor: pointer;
  }
  .tb-style > tbody > tr > td.other-month {
    pointer-events: none;
    color: #999;
  }
  .tb-style > tbody tr td.plant-style {
    background: #dee9fe;
    color: #fff;
  }

  /*  活动颜色*/
  .tb-style > tbody tr td.activity-style {
    background: #66974d;
    color: #fff;
  }

  //.tb-style>tbody tr>td.disabled {
  //  pointer-events: none;
  //background-color: #eeeeee;
  //color: #999999;
  //}
  .tb-style > tbody tr td.today-flag {
    background: #4bc4ee;
    color: #fff;
  }
  .aside-style0 {
    top: 18px;
    position: absolute;
    left: calc(103% + 15px);
    width: 100px;
    height: 30px;
    line-height: 30px;
    transform: translate(-50%, -50%);
  }

  .aside-style0::after {
    content: "";
    position: absolute;
    left: -10px;
    top: 11px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #fff;
  }

  .aside-style1 {
    position: absolute;
    left: calc(103% + 15px);
    top: calc(18% + 20px);
    width: 100px;
    height: 30px;
    line-height: 30px;
    transform: translate(-50%, -50%);
  }

  .aside-style1::after {
    content: "";
    position: absolute;
    left: -10px;
    top: 11px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #fff;
  }
  .aside-style2 {
    position: absolute;
    left: calc(103% + 15px);
    top: calc(18% + 40px);
    width: 100px;
    height: 30px;
    line-height: 30px;
    transform: translate(-50%, -50%);
  }

  .aside-style2::after {
    content: "";
    position: absolute;
    left: -10px;
    top: 11px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #fff;
  }
  .aside-style3 {
    position: absolute;
    left: calc(103% + 15px);
    top: calc(18% + 60px);
    width: 100px;
    height: 30px;
    line-height: 30px;
    transform: translate(-50%, -50%);
  }

  .aside-style3::after {
    content: "";
    position: absolute;
    left: -10px;
    top: 11px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #fff;
  }
}
</style>

<style lang="scss" scoped>
.search {
  margin-bottom: 10px;
  justify-content: end;

  .el-input {
    margin: 0 10px;
    width: 200px;
  }
}

.card-wrap {
  height: calc(100vh - 180px);
  overflow-y: scroll;

  .card {
    height: 200px;
    cursor: pointer;
    &:not(:last-child) {
      margin-bottom: 20px;
    }

    .card-type {
      box-sizing: border-box;
      padding: 16px;
      width: 44px;
      height: 100%;
      display: flex;
      align-items: center;
      color: #fff;
    }

    p {
      margin-top: 10px;

      span {
        margin-right: 30px;
      }
    }

    .card-content {
      padding: 0 20px;

      .avatar {
        width: 40px;
        height: 40px;
      }

      .archive-image {
        width: 200px;
        height: 100px;
      }
    }
  }
}

.el-tag--medium {
  height: 36px;
  line-height: 36px;
  text-align: center;
  cursor: pointer;
}
</style>
