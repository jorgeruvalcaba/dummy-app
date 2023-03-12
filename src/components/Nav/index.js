'use client'

import { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import moment from 'moment'

import Loader from '../Loader'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
)

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Historic Navs',
    },
  },
}

const TIME_FRAMES = {
  DAY: '24h',
  WEEK: '7d',
  MONTH: '30d',
  ALL: 'all',
}

export default function Nav() {
  const [navData, setNavData] = useState(null)
  const [chartData, setChartData] = useState(null)
  const [timeFrame, setTimeFrame] = useState(TIME_FRAMES.DAY)

  const formatData = (data, timeFrame) => {
    const hourlyNavs = data.hourly_navs['1']
    const dailyNavs = data.daily_navs['1']
    let chartLabels = []
    let chartValues = []

    switch (timeFrame) {
      case TIME_FRAMES.DAY:
        chartLabels = Object.keys(hourlyNavs)
          .filter(date => moment(date, 'YYYY-MM-DD HH').isValid())
          .sort(
            (a, b) =>
              moment(a, 'YYYY-MM-DD HH').valueOf() -
              moment(b, 'YYYY-MM-DD HH').valueOf(),
          )
          .slice(-24)
          .map(date => moment(date, 'YYYY-MM-DD HH').format('YYYY-MM-DD HH'))
        chartValues = chartLabels.map(label => hourlyNavs[label])
        break
      case TIME_FRAMES.WEEK:
        chartLabels = Object.keys(dailyNavs)
          .filter(date => moment(date, 'YYYY-MM-DD').isValid())
          .sort(
            (a, b) =>
              moment(a, 'YYYY-MM-DD').valueOf() -
              moment(b, 'YYYY-MM-DD').valueOf(),
          )
          .slice(-7)
          .map(date => moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD'))
        chartValues = chartLabels.map(label => dailyNavs[label])
        break
      case TIME_FRAMES.MONTH:
        chartLabels = Object.keys(dailyNavs)
          .filter(date => moment(date, 'YYYY-MM-DD').isValid())
          .sort(
            (a, b) =>
              moment(a, 'YYYY-MM-DD').valueOf() -
              moment(b, 'YYYY-MM-DD').valueOf(),
          )
          .slice(-30)
          .map(date => moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD'))
        chartValues = chartLabels.map(label => dailyNavs[label])
        break
      default:
        const formattedHourlyNavs = Object.keys(hourlyNavs)
          .filter(date => moment(date, 'YYYY-MM-DD HH').isValid())
          .sort(
            (a, b) =>
              moment(a, 'YYYY-MM-DD HH').valueOf() -
              moment(b, 'YYYY-MM-DD HH').valueOf(),
          )
          .slice(-24)
          .map(date => moment(date, 'YYYY-MM-DD HH').format('YYYY-MM-DD HH'))
        const formattedDailyNavs = Object.keys(dailyNavs)
          .filter(date => moment(date, 'YYYY-MM-DD').isValid())
          .sort(
            (a, b) =>
              moment(a, 'YYYY-MM-DD').valueOf() -
              moment(b, 'YYYY-MM-DD').valueOf(),
          )
        const allDates = [...formattedDailyNavs, ...formattedHourlyNavs]
        chartLabels = allDates.map(label =>
          moment(label, 'YYYY-MM-DD').format('YYYY-MM-DD'),
        )
        chartValues = chartLabels.map(label => {
          const hourlyNav = hourlyNavs[label] || 0
          const dailyNav = dailyNavs[label] || 0
          return hourlyNav + dailyNav
        })
    }

    return { chartLabels, chartValues }
  }

  useEffect(() => {
    fetch('/api/navs')
      .then(response => response.json())
      .then(data => setNavData(data))
  }, [])

  useEffect(() => {
    if (navData) {
      setChartData({
        labels: formatData(navData, timeFrame).chartLabels,
        datasets: [
          {
            label: `Navs`,
            data: formatData(navData, timeFrame).chartValues,
            fill: false,
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 2,
          },
        ],
      })
    }
  }, [navData, timeFrame])

  const handleTimePeriodChange = e => {
    setTimeFrame(e.target.value)
  }

  return (
    <div className="w-full pt-4 pb-20">
      <h2 className="text-2xl font-bold">Navs</h2>
      <div>
        <label htmlFor="timeRange">Time Range: </label>
        <select id="timeRange" onChange={handleTimePeriodChange}>
          <option value="24h">24 Hours</option>
          <option value="7d">7 Days</option>
          <option value="30d">30 Days</option>
          <option value="all">All Time</option>
        </select>
      </div>
      {chartData ? (
        <Line data={chartData} options={options} />
      ) : (
        <div
          style={{ height: '703px' }}
          className="w-full flex justify-center items-center bg-gray-200"
        >
          <Loader />
        </div>
      )}
    </div>
  )
}
