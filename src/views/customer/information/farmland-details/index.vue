<template>
  <div class="farmland-detail ele-body">
    <el-row :gutter="10">
      <el-col :lg="16" :md="24">
        <el-card>
          <div v-if="schedules" class="cycle ele-cell">
            <h5 class="ele-cell-content">{{ cycle.name }}</h5>
            <div>
              <el-button
                type="primary"
                size="mini"
                plain
                :disabled="!cycle.prevId"
                @click="getCycle(cycle.prevId)"
                >上季</el-button
              >
              <el-button
                type="primary"
                size="mini"
                plain
                @click="getCycle(null)"
                prevId
                >当季</el-button
              >
              <el-button
                type="primary"
                size="mini"
                plain
                :disabled="!cycle.nextId"
                @click="getCycle(cycle.nextId)"
                >下季</el-button
              >
            </div>
          </div>
          <ul class="calendars" v-if="schedules.length > 0">
            <li v-for="item in schedules" :key="item.date">
              <p>{{ item.date }}</p>
              <div v-schedule:loadSchedule="item"></div>
            </li>
          </ul>
          <div class="marker-bottom">
            <div class="box">
              <p>标记图例</p>
              <div>
                <p></p>
                <span>种植季</span>
              </div>
              <!-- <div>
                <p></p>
                <span>当天</span>
              </div> -->
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
        <div class="search ele-cell">
          <div class="ele-cell-content">
            <el-tag
              v-for="(item, index) in activityTotal"
              :key="item.id"
              :effect="current === index ? 'plain' : 'dark'"
              :class="`tag-${item.typeCode}`"
              @click="changeActivity(index)"
              >{{ item.type }} {{ item.count }}</el-tag
            >
          </div>
          <p v-if="form.date">显示日期：{{ form.date }}</p>
        </div>
        <div v-show="records.length" class="card-wrap">
          <div
            class="card ele-cell ele-bg-white"
            v-for="(item, index) in records"
            :key="index"
            @click="toDetail(item)"
          >
            <div class="card-type" :class="`tag-${item.typeCode}`">
              {{ item.type }}
            </div>
            <div class="ele-cell ele-cell-content card-content">
              <div class="ele-cell-content">
                <div class="ele-cell">
                  <div class="ele-cell-content">
                    <div class="ele-cell-title">
                      <span v-if="item.typeCode == 0">{{ item.title }} </span>
                      <span v-if="item.typeCode == 1"
                        >{{ item.questionType }}
                        <i
                          class="iconfont question-icon"
                          :class="item.questionTypeIcon"
                          :style="{ backgroundColor: item.questionLevelColor }"
                        ></i>
                      </span>
                      <span v-if="item.typeCode == 2"
                        >{{ item.cropWorkTypeId }}
                      </span>
                    </div>
                    <p v-if="item.typeCode == 0">{{ item.description }}</p>
                    <p v-if="item.typeCode == 1">{{ item.description }}</p>
                    <p v-if="item.typeCode == 2">
                      预约时间：{{ item.reserveDate }}，
                      <template v-if="item.user">
                        联系方式：{{ item.user.phone }}，备注：
                        {{ item.content }}
                      </template>
                    </p>
                  </div>
                </div>

                <p class="ele-cell ele-text-secondary">
                  <el-avatar
                    v-if="item.user"
                    class="avatar"
                    :src="item.user.avatar"
                  ></el-avatar>
                  <span>
                    <template v-if="item.user">{{ item.user.name }}</template>
                    {{ item.createAt }}
                    <i class="el-icon-chat-line-square"></i>
                    {{ item.commentCount }}</span
                  >
                  <i
                    class="iconfont "
                    :class="getStateIcon(item.typeCode, item.state)"
                    style="font-size: 36px;"
                  ></i>
                </p>
              </div>
              <!-- 预约服务没有图片 -->
              <el-image
                v-if="item.typeCode != 2"
                class="archive-image"
                :src="item.imageThumb"
              >
              </el-image>
            </div>
          </div>
        </div>
        <Empty v-show="!records.length" />
      </el-col>
      <el-col :lg="8" :md="24">
        <user-field-map
          :isFieldRecore="isRecord"
          :fieldRecores="fieldRecordList"
        ></user-field-map>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import userFieldMap from "@/components/user-field-map.vue";
import { getCycle, getCycleActivity } from "@/api/cycle";
import Schedule from "../../../../../public/schedule/schedule.js";
import dayjs from "dayjs";
import activity from "./activity";
import { getFieldRecordList } from "@/api/fieldRecord/fieldRecord.js";
import Empty from "@/components/empty.vue";
export default {
  name: "index",
  components: {
    userFieldMap,
    Empty
  },
  data() {
    return {
      cycle: {},
      schedules: [],
      activityTotal: [],
      form: {
        cycleId: null,
        type: null, //0,1,2,3
        date: "",
        pageIndex: 0,
        pageSize: 10,
        pageCount: 0
      },
      current: 0,
      records: [],
      loading: false,
      fieldRecordList: [],
      isRecord: false
    };
  },
  mounted() {
    this.getCycle();
    this.getFieldRecordList();

    document
      .querySelector(".card-wrap")
      .addEventListener("scroll", this.scroll);
  },
  methods: {
    loadSchedule(el, item) {
      item.schedule.init({
        el,
        date: item.date,
        // 当前月份回调函数
        callback: date => {},
        selectCallback: e => {
          this.form.date = e.date;
          this.getCycle(this.form.cycleId, e.date, false);
          // this.getCycleActivity(this.form);
          // 清楚其它日历的高亮
          this.schedules
            .filter(e => e.date != item.date)
            .map(e => {
              e.schedule.clearClassNames();
            });
        }
      });
      item.activityDate.forEach(date => {
        item.schedule.setClounm({
          // 当前列样式 td
          className: "activity-style",
          date: dayjs(date).format("YYYY-MM-DD")
        });
      });
      item.plantDate.forEach(date => {
        item.schedule.setClounm({
          // 当前列样式 td
          className: "plant-style",
          date
        });
      });
    },
    async getCycle(id, date, refreshCalendar = true) {
      this.form.date = date;
      const { fieldId } = this.$route.query;
      const { data } = await getCycle(fieldId, {
        id: id,
        date
      });
      console.log(data);
      this.cycle = data;
      const all = {
        typeCode: null,
        type: "全部"
      };
      this.activityTotal = [all, ...data.activityTotal];
      this.form.cycleId = data.id;
      this.getCycleActivity(true);
      // 选日期时不重置日历
      if (!refreshCalendar) return;
      this.schedules = [];
      const start = dayjs(data.start);
      const diffDays = dayjs(data.end).diff(data.start, "days");
      const diffMonths = dayjs(data.end).diff(data.start, "month");
      const dates = [start.format("YYYY-MM")];
      const days = [start.format("YYYY-MM-DD")];
      // 种植季
      for (let index = 1; index <= diffDays; index++) {
        days.push(
          dayjs(data.start)
            .add(index, "day")
            .format("YYYY-MM-DD")
        );
      }
      // 活动
      for (let index = 1; index <= diffMonths; index++) {
        dates.push(
          dayjs(data.start)
            .add(index, "month")
            .format("YYYY-MM")
        );
      }
      setTimeout(() => {
        dates.forEach(date => {
          this.schedules.push({
            date: date,
            schedule: new Schedule(),
            activityDate: data.activityDate,
            plantDate: days
          });
        });
      });
    },
    async getCycleActivity(refresh) {
      if (refresh) {
        this.form.pageIndex = 0;
        this.records = [];
      }
      const { fieldId } = this.$route.query;
      const {
        data: { data, meta }
      } = await getCycleActivity(fieldId, this.form);
      this.records = [...this.records, ...data];
      this.form.pageCount = meta.pageCount;
      this.loading = false;
      console.log(data);
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
        this.getCycleActivity();
      }
    },
    changeActivity(index) {
      this.current = index;
      this.form.type = this.activityTotal[index].typeCode;
      this.getCycleActivity(true);
    },
    toDetail(item) {
      let path;
      let query = {
        id: item.id,
        customerId: this.$route.query.customerId,
        fieldId: item.fieldId,
        no: item.no
      };
      switch (item.typeCode) {
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
    },
    getStateIcon(typeCode, state) {
      return activity.get(typeCode).find(e => e[0] == state)[1];
    },
    async getFieldRecordList() {
      const { fieldId } = this.$route.query;
      const {
        data: { data, meta }
      } = await getFieldRecordList({ parentNo: fieldId });
      console.log(data);
      this.fieldRecordList = data;
      data.length > 0 ? (this.isRecord = true) : "";
    }
  }
};
</script>

<style lang="scss">
.farmland-detail {
  .cycle {
    box-sizing: border-box;
    padding: 10px;
    height: 40px;
    background-color: #e6eaf3;
  }

  .calendars {
    margin-top: 16px;
    display: flex;
    list-style: none;
    overflow-x: scroll;
    li {
      margin-right: 6px;
      > p {
        margin-bottom: 6px;
        text-align: center;
      }
    }
    .tb-style {
      width: 222px;
      border-spacing: 2px;
    }

    .tb-style > thead > tr {
      background-color: #e6eaf3;
      border-radius: 4px;
    }

    .tb-style > thead > tr > th {
      font-size: 12px;
      color: #999;
      text-align: center;
      width: 30px;
      height: 20px;
    }

    .tb-style > tbody tr {
      background: #ffffff;
      cursor: pointer;
      color: #000;
      position: relative;
    }

    .tb-style > tbody > tr > td.other-month {
      color: #999;
    }

    .tb-style > tbody tr > td.current {
      color: #fff !important;
      background: #ff8100 !important;
    }

    .tb-style > tbody tr td {
      width: 30px;
      height: 20px;
      font-size: 12px;
      text-align: center;
      position: relative;
      border-radius: 4px;
    }

    // .tb-style > tbody tr td.today-flag {
    //   background: #4bc4ee;
    //   color: #fff;
    // }

    .tb-style > tbody tr td.dayStyle {
      /*  text-align: center;*/
      // line-height: 35px;
      cursor: pointer;
    }

    .tb-style > tbody tr td.plant-style {
      background: #dee9fe;
      color: #666;
    }

    /*  活动颜色*/
    .tb-style > tbody tr td.activity-style {
      background: #66974d;
      color: #fff;
    }

    .tb-style > tbody tr > td.disabled {
      pointer-events: none;
      background-color: #eeeeee;
      color: #999999;
    }
  }

  .marker-bottom {
    margin-top: 10px;
    .box {
      display: flex;
      justify-content: flex-end;
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
      div:nth-of-type(1) p {
        background-color: #dee9fe;
      }
      // div:nth-of-type(2) p {
      //   background-color: #4bc4ee;
      // }
      div:nth-of-type(2) p {
        background-color: #ff8100;
      }
      div:nth-of-type(3) p {
        background-color: #66974d;
      }
    }
  }

  .search {
    margin: 20px 0;
  }

  .el-tag--medium {
    height: 36px;
    line-height: 36px;
    text-align: center;
    cursor: pointer;
  }
  .el-tag--plain {
    background-color: transparent !important;
  }
  .tag-0 {
    background-color: #fdb933;
    border-color: transparent;
  }
  .tag-0.el-tag--plain {
    color: #fdb933;
    border-color: #fdb933;
  }
  .tag-1 {
    background-color: #fca052;
    border-color: transparent;
  }
  .tag-1.el-tag--plain {
    color: #fca052;
    border-color: #fca052;
  }
  .tag-2 {
    background-color: #23d494;
    border-color: transparent;
  }
  .tag-2.el-tag--plain {
    color: #23d494;
    border-color: #23d494;
  }
  .tag-3 {
    background-color: #4bc4ee;
    border-color: transparent;
  }
  .tag-3.el-tag--plain {
    color: #4bc4ee;
    border-color: #4bc4ee;
  }
  .card-wrap {
    height: calc(100vh - 470px);
    overflow-y: scroll;

    .card {
      height: 130px;
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

      .question-icon {
        width: 20px;
        height: 20px;
        color: white;
        font-size: 12px;
        margin-left: 10px;
        text-align: center;
        line-height: 20px;
        border-radius: 50%;
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
          width: 20px;
          height: 20px;
          margin-right: 5px;
        }

        .archive-image {
          width: 200px;
          height: 100px;
        }
      }
    }
  }
}
</style>
