<template>
  <el-card shadow="never">
    <div slot="header" class="header ele-cell">
      <span class="ele-cell-content">巡田日志</span>
      <el-date-picker
        v-model="year"
        type="year"
        placeholder="选择年"
        format="yyyy年"
        value-format="yyyy"
        @change="change"
      >
      </el-date-picker>
    </div>
    <ele-chart v-if="data.length > 0" :option="chartOption" class="chart" />
    <empty v-else class="chart" />
  </el-card>
</template>

<script>
import EleChart from "ele-admin/packages/ele-chart";
import empty from "@/components/empty";
import { getArchiveChart } from "@/api/dashboard";
import dayjs from "dayjs";

export default {
  components: { EleChart, empty },
  data() {
    return {
      data: [],
      year: ""
    };
  },
  computed: {
    chartOption() {
      return {
        dataZoom:
          this.data.length > 10
            ? [
                {
                  type: "slider",
                  xAxisIndex: [0],
                  start: 0,
                  end: (10 / this.data.length) * 100,
                  zoomLock: true
                }
              ]
            : [],
        color: ["#7ED321", "#FF8F00", "#FFCC41"],
        tooltip: {
          trigger: "axis"
        },
        legend: {
          top: "top",
          left: "center",
          itemWidth: 10,
          itemHeight: 10,
          icon: "circle"
        },
        xAxis: [
          {
            type: "category",
            data: [
              "1月",
              "2月",
              "3月",
              "4月",
              "5月",
              "6月",
              "7月",
              "8月",
              "9月",
              "10月",
              "11月",
              "12月"
            ],
            axisLabel: {
              interval: 0
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            minInterval: 1
          }
        ],
        series: this.data.map(d => {
          return { name: d.name, type: "bar", data: d.data };
        })
      };
    }
  },
  mounted() {
    this.getArchiveChart();
  },
  methods: {
    async getArchiveChart() {
      const { data } = await getArchiveChart({
        year: this.year || dayjs().format("YYYY")
      });
      this.data = data;
    },
    change(value) {
      this.getArchiveChart();
    }
  }
};
</script>

<style lang="scss" scoped>
.chart {
  height: 250px;
}
</style>
