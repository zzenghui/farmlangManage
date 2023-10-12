<template>
  <el-card shadow="never">
    <div slot="header" class="header ele-cell">
      <span class="ele-cell-content">问题记录</span>
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
import { getQuestionChart } from "@/api/dashboard";
import dayjs from "dayjs";

export default {
  components: { EleChart, empty },
  props: {
    value: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {
      data: [],
      year: ""
    };
  },
  watch: {
    value(newV) {
      this.data = newV;
    }
  },
  computed: {
    chartOption() {
      return {
        dataZoom:
          this.data.length > 6
            ? [
                {
                  type: "slider",
                  xAxisIndex: [0],
                  start: 0,
                  end: (6 / this.data.length) * 100,
                  zoomLock: true
                }
              ]
            : [],
        color: "#66974D",
        tooltip: {
          trigger: "axis"
        },
        grid: {
          bottom: "20%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: this.data.map(d => d.type),
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
        series: [
          {
            type: "bar",
            barWidth: 30,
            data: this.data.map(d => d.num)
          }
        ]
      };
    }
  },
  mounted() {
    this.getQuestionChart();
  },
  methods: {
    async getQuestionChart() {
      const { data } = await getQuestionChart({
        year: this.year || dayjs().format("YYYY")
      });
      this.data = data;
    },
    change(value) {
      this.getQuestionChart();
    }
  }
};
</script>
<style lang="scss" scoped>
.chart {
  height: 250px;
}
</style>
