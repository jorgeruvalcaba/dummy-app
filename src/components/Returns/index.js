'use client'

import { useEffect, useState } from 'react'

import Loader from '../Loader'

export default function Returns() {
  const [symbols, setSymbols] = useState([])

  useEffect(() => {
    async function fetchSymbols() {
      const response = await fetch('/api/top_10')
      const data = await response.json()

      const symbolDataPromises = data.top_10.map(async symbol => {
        const response = await fetch(`/api/return_${symbol}`)
        const data = await response.json()
        return { symbol, return: data.return }
      })

      const symbolData = await Promise.all(symbolDataPromises)
      setSymbols(symbolData)
    }

    fetchSymbols()
  }, [])

  return (
    <div className="w-full pt-4 pb-20">
      <h2 className="text-2xl font-bold mb-2">Returns</h2>

      <div className="w-full flex flex-col justify-center items-center">
        <h3 className="text-lg font-semibold mb-1">Top 10</h3>
        <ul className="w-1/3 divide-y divide-gray-200">
          {symbols.length > 0 ? (
            symbols.map(symbol => (
              <li key={symbol.symbol} className="py-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg">{symbol.symbol}</span>
                  <span className="text-lg">{symbol.return}</span>
                </div>
              </li>
            ))
          ) : (
            <div
              className="w-full bg-gray-200 flex justify-center items-center"
              style={{ height: '450px' }}
            >
              <Loader />
            </div>
          )}
        </ul>
      </div>
    </div>
  )
}
