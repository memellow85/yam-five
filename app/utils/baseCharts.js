import { getLocalStorageKey } from '~/utils'

export const getColorFont = () => {
  return !getLocalStorageKey('theme') ||
    getLocalStorageKey('theme').indexOf('dark') !== -1
    ? '#DEE2E6'
    : '#6C757D'
}

export const baseChartOpt = {
  fontFamily: 'Nunito, sans-serif',
  parentHeightOffset: 0,
  height: 300,
  toolbar: {
    show: false,
  },
  zoom: {
    enabled: false,
  },
}

export const baseGrid = {
  padding: {
    right: 10,
    left: 10,
    top: 0,
    bottom: 0,
  },
}

export const tooltipOpt = {
  enabled: false,
  x: {
    show: false,
  },
  marker: {
    show: false,
  },
}

export const legendOpt = {
  position: 'bottom',
  horizontalAlign: 'right',
  fontSize: '13rem',
  fontWeight: 300,
  offsetY: -15,
  onItemClick: {
    toggleDataSeries: false,
  },
  onItemHover: {
    highlightDataSeries: false,
  },
}

export const styleTextChart = {
  fontSize: '0.6rem',
  fontWeight: 300,
  /* colors:
    !getLocalStorageKey('theme') || getLocalStorageKey('theme') === 'default'
      ? ['#6C757D']
      : ['#DEE2E6'], */
}

export const yaxisOpt = {
  show: false,
}

export const xaxisOpt = {
  axisTicks: {
    show: false,
  },
  /* labels: {
    style: styleTextChart,
  }, */
}

export const colorsChart = [
  '#15BDFF',
  '#FB8600',
  '#00A676',
  '#DF1A1A',
  '#D10EE9',
  '#7046FF',
]

export const colorsChart2 = [
  '#00A676',
  '#FB8600',
  '#15BDFF',
  '#DF1A1A',
  '#D10EE9',
  '#7046FF',
]

export const goals = {
  name: 'Records',
  strokeWidth: 3,
  strokeColor: '#FB8600',
}

export const markersOpt = {
  width: 10,
  height: 10,
  radius: 10,
}

export const createLabels = (from, to) => {
  const tmp = []
  let i = from + 1
  while (i !== to + 1) {
    tmp.push(i.toString())
    i++
  }
  return tmp
}
