<template>
  <section class="wrapper-page">
    <article>
      <h3>
        <span class="yamicons mdi mdi-chart-box-outline"></span>
        {{ $t('stats.title_1') }}
      </h3>
    </article>
    <div class="main body-scroll-lock-ignore-inner">
      <article>
        <Stats></Stats>
      </article>
      <article class="container-chart">
        <div class="wrapper-chart first-chart">
          <p class="flex-center">
            <strong>{{ $t('stats.chart_1') }}</strong>
          </p>
          <div id="chart1" class="chart"></div>
          <div v-if="paginationView" class="pagination-chart flex-center">
            <p
              v-for="p in pages"
              :key="p"
              :class="['small flex-center', { active: page === p }]"
              @click="changePage(p)"
            >
              <strong>{{ p }}</strong>
            </p>
          </div>
        </div>
        <div class="wrapper-chart">
          <p class="flex-center">
            <strong>{{ $t('stats.chart_2') }}</strong>
          </p>
          <div id="chart2"></div>
        </div>
      </article>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import ApexCharts from 'apexcharts'
import cloneDeep from 'lodash/cloneDeep'
import WsMixin from '~/mixins/ws'
import {
  baseChartOpt,
  tooltipOpt,
  legendOpt,
  styleTextChart,
  colorsChart,
  colorsChart2,
  baseGrid,
  yaxisOpt,
  xaxisOpt,
  goals,
  markersOpt,
  createLabels,
} from '~/utils/baseCharts'
import ScrollMixin from '~/mixins/scroll'
import { orderCharts } from '~/lists'

export default {
  mixins: [WsMixin, ScrollMixin],
  middleware: ['authenticated'],
  data() {
    return {
      chart_1: null,
      chart_2: null,
      records: [],
      recordMan: [],
      page: 1,
      view: 13,
      pages: [],
      categoryChartsList: [
        this.$t('game.one'),
        this.$t('game.two'),
        this.$t('game.three'),
        this.$t('game.four'),
        this.$t('game.five'),
        this.$t('game.six'),
        this.$t('game.mineleven'),
        this.$t('game.full'),
        this.$t('game.poker'),
        this.$t('game.scale'),
        this.$t('game.yam'),
      ],
      optChart1: {
        chart: Object.assign({}, baseChartOpt, {
          type: 'area',
        }),
        colors: colorsChart,
        tooltip: tooltipOpt,
        legend: Object.assign({}, legendOpt, {
          markers: markersOpt,
        }),
        grid: baseGrid,
        dataLabels: {
          enabled: true,
          offsetY: -5,
          background: {
            enabled: false,
          },
          style: Object.assign({}, styleTextChart, {
            fontWeight: 600,
          }),
        },
        markers: {
          size: 4,
        },
        series: [
          {
            name: this.$t('stats.legend_3'),
            data: [],
          },
          {
            name: this.$t('stats.legend_2'),
            data: [],
          },
          {
            name: this.$t('stats.legend_1'),
            data: [],
          },
        ],
        xaxis: Object.assign(
          {},
          {
            position: 'top',
            categories: [],
          },
          xaxisOpt
        ),
        yaxis: yaxisOpt,
        noData: {
          text: this.$t('stats.no_data_chart_1'),
          style: Object.assign({}, styleTextChart, {
            fontSize: '0.8rem',
          }),
        },
      },
      optChart2: {
        chart: Object.assign({}, baseChartOpt, {
          type: 'bar',
        }),
        colors: colorsChart2,
        tooltip: tooltipOpt,
        legend: Object.assign({}, legendOpt, {
          showForSingleSeries: true,
          customLegendItems: [
            this.$t('stats.legend_1'),
            this.$t('stats.legend_2'),
          ],
          markers: Object.assign({}, markersOpt, {
            fillColors: ['#00A676', '#FB8600'],
          }),
        }),
        grid: baseGrid,
        dataLabels: {
          enabled: true,
          offsetY: -10,
          style: Object.assign({}, styleTextChart, {
            fontWeight: 600,
          }),
        },
        plotOptions: {
          bar: {
            columnWidth: '80%',
            borderRadius: 10,
            dataLabels: {
              position: 'top',
            },
          },
        },
        series: [
          {
            name: this.$t('stats.legend_1'),
            data: [],
          },
        ],
        xaxis: Object.assign(
          {},
          {
            position: 'bottom',
            categories: [],
          },
          xaxisOpt
        ),
      },
    }
  },
  computed: {
    ...mapState('game', {
      probablyExitNumbers: (state) => state.probablyExitNumbers,
      totalHistorical: (state) => state.totalHistorical,
      currentGame: (state) => state.currentGame,
    }),
    ...mapState('firebase', {
      userDetailsFirebase: (state) => state.userDetailsFirebase,
    }),
    ...mapGetters('firebase', ['getTypeChampions']),
    paginationView() {
      return (
        this.records.length > 0 ||
        this.recordMan.length > 0 ||
        this.totalHistorical.length > 0
      )
    },
  },
  beforeMount() {
    this.pages =
      this.currentGame === 'veryshort'
        ? []
        : this.currentGame === 'short'
        ? [1, 2]
        : [1, 2, 3, 4]
  },
  mounted() {
    this.initChartTotal()
    this.initChartProbably()
  },
  methods: {
    getKeyChart(chart) {
      return this.currentGame === 'veryshort'
        ? `score_veryshort_record_chart_${chart}`
        : this.currentGame === 'short'
        ? `score_short_record_chart_${chart}`
        : `score_record_chart_${chart}`
    },
    getKeyScore() {
      return this.currentGame === 'veryshort'
        ? `score_veryshort`
        : this.currentGame === 'short'
        ? `score_short`
        : `score`
    },
    getArrayTotal(list) {
      const tmp = []
      list.map((r, k) => {
        if (k === 0) {
          tmp.push(r)
        } else {
          tmp.push(r + tmp[k - 1])
        }
      })
      return tmp
    },
    initChartTotal() {
      const key = this.getKeyChart('1')
      const score = this.getKeyScore()

      if (
        this.userDetailsFirebase[key] &&
        this.userDetailsFirebase[key] !== ''
      ) {
        this.records = this.getArrayTotal(
          JSON.parse(this.userDetailsFirebase[key])
        )
      } else {
        this.records = []
      }
      if (
        this.getTypeChampions(score)[0][key] &&
        this.getTypeChampions(score)[0][key] !== ''
      ) {
        this.recordMan = this.getArrayTotal(
          JSON.parse(this.getTypeChampions(score)[0][key])
        )
      } else {
        this.recordMan = []
      }

      this.chart_1 = new ApexCharts(
        document.querySelector('#chart1'),
        this.optChart1
      )
      this.chart_1.render()
      this.updateChart(this.chart_1)
    },
    changePage(page) {
      this.page = page
      this.updateChart(this.chart_1)
    },
    updateChart(chart) {
      const start = (this.page - 1) * this.view
      const end = this.view * this.page
      const labels = createLabels(start, end)
      const data = this.getArrayTotal(this.totalHistorical)
      const records =
        this.records.length > 0 ? cloneDeep(this.records).slice(start, end) : []
      const recordMan =
        this.recordMan.length > 0
          ? cloneDeep(this.recordMan).slice(start, end)
          : []

      chart.updateSeries([
        {
          data: recordMan,
        },
        {
          data: records,
        },
        {
          data,
        },
      ])
      chart.updateOptions(
        {
          xaxis: Object.assign(
            {},
            {
              position: 'top',
              categories: labels,
            },
            xaxisOpt
          ),
        },
        true
      )
    },
    initChartProbably() {
      const key = this.getKeyChart('2')
      let records = []
      if (
        this.userDetailsFirebase[key] &&
        this.userDetailsFirebase[key] !== ''
      ) {
        records = JSON.parse(this.userDetailsFirebase[key])
      }
      const data = []
      orderCharts.map((v, k) => {
        if (Object.keys(records).length > 0) {
          data.push({
            x: this.categoryChartsList[k],
            y: this.probablyExitNumbers[v],
            goals: [Object.assign({}, { value: records[v] }, goals)],
          })
        } else {
          data.push({
            x: this.categoryChartsList[k],
            y: this.probablyExitNumbers[v],
          })
        }
      })

      this.chart_2 = new ApexCharts(
        document.querySelector('#chart2'),
        this.optChart2
      )
      this.chart_2.render()
      this.chart_2.updateSeries([
        {
          data,
        },
      ])
      this.chart_2.updateOptions({
        xaxis: Object.assign(
          {},
          {
            position: 'bottom',
            categories: this.categoryChartsList,
          },
          xaxisOpt
        ),
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.container-chart {
  .wrapper-chart {
    &.first-chart {
      > p {
        @include margin(1.3rem null null);
      }
    }
    &:last-child {
      @include margin(1.7rem null null);
    }
    .chart {
      @include position(relative, null);
      z-index: 0;
    }
    .pagination-chart {
      @include position(relative, null);
      @include margin(-1rem null 0);
      z-index: 1;
      p {
        @include size(20px);
        background: $color-2;
        border-bottom: $border-base-tab;
        border-top: $border-base-tab;
        border-right: $border-base-tab;
        &.active {
          background: $primary;
          color: $white;
        }
        &:first-child {
          border-radius: $rounded-small 0 0 $rounded-small;
          border-left: $border-base-tab;
        }
        &:last-child {
          border-radius: 0 $rounded-small $rounded-small 0;
        }
      }
    }
  }
}
</style>
