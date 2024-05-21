<script setup>
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
  fillColors: {
    type: Array,
    required: false,
    default: ["#FBFBFB", "#FBFBFB"],
  },
});

const chartOptions = ref({
  chart: {
    height: 350,
    type: "area",
    toolbar: {
      show: false,
    },
    background: "transparent",
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    position: "top",
    offsetY: 0,
    show: false,
  },
  stroke: {
    curve: "smooth",
  },
  grid: {
    show: false,
  },
  xaxis: {
    type: "datetime",
    categories: props.xAxisVariables,
    show: false,
  },
  yaxis: {
    show: false,
  },
  tooltip: {
    x: {
      format: "dd/MM/yy HH:mm",
    },
  },
  colors: props.colors,
  fill: {
    colors: props.fillColors,
  },
});

console.log(props);
</script>
<template>
  <div>
    <VueApexChart
      type="area"
      :options="chartOptions"
      :series="series"
      class="w-full h-[100px]"
    ></VueApexChart>
  </div>
</template>
