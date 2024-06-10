<script setup>
import VueApexCharts from "vue3-apexcharts";
import VueApexChart from "vue3-apexcharts";
const props = defineProps({
  series: {
    type: Array,
    required: true,
    default: [],
  },
  xAxisVariables: {
    type: Array,
    required: false,
    default: [],
  },
  colors: {
    type: Array,
    required: false,
    default: [],
  },
});

const chartOptions = ref({
  chart: {
    type: "bar",
    stacked: true,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: true,
    },
    background: "transparent",
  },
  grid: {
    show: false,
  },
  dataLabels: {
    enabled: true,
    formatter: function (val) {
      if (val < 0) {
        return -1 * val + "%";
      }
      return val + "%";
    },
    offsetY: -20,
    style: {
      fontSize: "0",
      colors: ["#304758"],
    },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        legend: {
          position: "bottom",
          offsetX: -10,
          offsetY: 0,
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 10,
      columnWidth: "20px",
      borderRadiusApplication: "end",
      borderRadiusWhenStacked: "all",
      dataLabels: {
        position: "top", // top, center, bottom
      },
    },
  },
  xaxis: {
    type: "category",
    categories: props.xAxisVariables,
  },
  yaxis: {
    show: false,
  },
  legend: {
    position: "top",
    offsetY: 0,
  },
  fill: {
    opacity: 53,
    colors: props.colors,
  },
  colors: props.colors,
  tooltip: {
    enabled: true,
    style: {
      fontSize: "12px",
      fontFamily: undefined,
    },

    x: {
      show: true,
      format: "dd MMM",
    },
  },
});
</script>
<template>
  <div class="w-full h-full">
    <VueApexChart
      type="bar"
      :options="chartOptions"
      :series="series"
      class="w-full min-h-[100px] h-full"
    ></VueApexChart>
  </div>
</template>
