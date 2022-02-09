export const dicesTypesCabled = ['one', 'two', 'three', 'four', 'five']

export const orderCharts = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'mineleven',
  'full',
  'poker',
  'scale',
  'yam',
]

export const probablyExitNumbers = {
  one: 0,
  two: 0,
  three: 0,
  four: 0,
  five: 0,
  six: 0,
  mineleven: 0,
  full: 0,
  poker: 0,
  scale: 0,
  yam: 0,
}

const dice = () => {
  return {
    value: null,
    block: false,
    name: '',
  }
}

export const dices = {
  one: dice(),
  two: dice(),
  three: dice(),
  four: dice(),
  five: dice(),
  tot: null,
}

const getSingleMatch = (name) => {
  return {
    value: '-',
    name,
    label: `game.${name}`,
    active: false,
    icon: '',
  }
}

const getGame = () => {
  return {
    one: getSingleMatch('one'),
    two: getSingleMatch('two'),
    three: getSingleMatch('three'),
    four: getSingleMatch('four'),
    five: getSingleMatch('five'),
    six: getSingleMatch('six'),
    min: getSingleMatch('min'),
    max: getSingleMatch('max'),
    mineleven: getSingleMatch('mineleven'),
    full: getSingleMatch('full'),
    poker: getSingleMatch('poker'),
    scale: getSingleMatch('scale'),
    yam: getSingleMatch('yam'),
  }
}

export const match = () => {
  return {
    down: {
      icon: 'sort-bool-ascending-variant',
      data: getGame(),
      bonusMinMax: false,
      bonusNumber60: false,
      bonusNumber70: false,
    },
    free: {
      icon: 'order-bool-ascending-variant',
      data: getGame(),
      bonusMinMax: false,
      bonusNumber60: false,
      bonusNumber70: false,
    },
    dry: {
      icon: 'target',
      data: getGame(),
      bonusMinMax: false,
      bonusNumber60: false,
      bonusNumber70: false,
    },
    up: {
      icon: 'sort-bool-descending-variant',
      data: getGame(),
      bonusMinMax: false,
      bonusNumber60: false,
      bonusNumber70: false,
    },
  }
}

export const numberTotalGames = () => {
  return {
    down: 0,
    free: 0,
    dry: 0,
    up: 0,
  }
}

export const playedListCabled = [
  {
    id: 1,
    name: 'down',
    icon: 'sort-bool-ascending-variant',
    selected: true,
    view: ['all', 'short'],
  },
  {
    id: 2,
    name: 'free',
    icon: 'order-bool-ascending-variant',
    selected: false,
    view: ['all', 'short', 'veryshort'],
  },
  {
    id: 3,
    name: 'dry',
    icon: 'target',
    selected: false,
    view: ['all'],
  },
  {
    id: 4,
    name: 'up',
    icon: 'sort-bool-descending-variant',
    selected: false,
    view: ['all'],
  },
]

export const modelUser = {
  active_campaign: 0,
  id_doc: '',
  match: 0,
  score: 0,
  score_record_chart_1: '',
  score_record_chart_2: '',
  score_short: 0,
  score_short_record_chart_1: '',
  score_short_record_chart_2: '',
  score_veryshort: 0,
  score_veryshort_record_chart_1: '',
  score_veryshort_record_chart_2: '',
  campaigns: 0,
  campaigns_short: 0,
  campaigns_veryshort: 0,
  campaign_score: 0,
  campaign_score_record_chart_1: '',
  campaign_score_record_chart_2: '',
  campaign_score_short: 0,
  campaign_score_short_record_chart_1: '',
  campaign_score_short_record_chart_2: '',
  campaign_score_veryshort: 0,
  campaign_score_veryshort_record_chart_1: '',
  campaign_score_veryshort_record_chart_2: '',
}

export const modelResetUser = {
  score: 0,
  score_record_chart_1: '',
  score_record_chart_2: '',
  score_short: 0,
  score_short_record_chart_1: '',
  score_short_record_chart_2: '',
  score_veryshort: 0,
  score_veryshort_record_chart_1: '',
  score_veryshort_record_chart_2: '',
  campaign_score: 0,
  campaign_score_record_chart_1: '',
  campaign_score_record_chart_2: '',
  campaign_score_short: 0,
  campaign_score_short_record_chart_1: '',
  campaign_score_short_record_chart_2: '',
  campaign_score_veryshort: 0,
  campaign_score_veryshort_record_chart_1: '',
  campaign_score_veryshort_record_chart_2: '',
}

export const modelResetCampaign = {
  campaign_score: 0,
  campaign_score_record_chart_1: '',
  campaign_score_record_chart_2: '',
  campaign_score_short: 0,
  campaign_score_short_record_chart_1: '',
  campaign_score_short_record_chart_2: '',
  campaign_score_veryshort: 0,
  campaign_score_veryshort_record_chart_1: '',
  campaign_score_veryshort_record_chart_2: '',
}
