'use client'

import { useState } from 'react'

import Loader from '../Loader'

export default function PlaceTrade() {
  const [symbol, setSymbol] = useState('')
  const [trades, setTrades] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async event => {
    event.preventDefault()
    try {
      setLoading(true)
      const response = await fetch(`/api/place_trade/${symbol}`, {
        method: 'POST',
      })
      const data = await response.json()
      const hasError = data.return !== 'Trade placed' || data.detail

      if (hasError) {
        setError(data.detail || data.return)
      } else {
        const newTrade = { symbol, price: data.price, date: data.date }
        setTrades(prevTrades => [...(prevTrades || []), newTrade])
        setSymbol('')
        setError(null)
      }
    } catch (error) {
      setError(error.message || error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full pt-4 pb-20">
      <h2 className="text-2xl font-bold mb-2">Place Trade</h2>
      <form onSubmit={handleSubmit} className="flex flex-row items-center">
        <div className="flex flex-col">
          <label className="text-sm mb-2 font-medium text-gray-800">
            Symbol
          </label>
          <input
            type="text"
            value={symbol}
            onChange={e => setSymbol(e.target.value)}
            placeholder="BTC"
            className="border border-gray-300 rounded-lg p-2 mb-6 mr-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !symbol}
          className={`bg-blue-500 hover:bg-blue-700 text-white rounded-lg font-bold py-2 px-4 focus:outline-none focus:shadow-outline disabled:bg-slate-400 ${
            loading ? 'cursor-not-allowed' : ''
          }`}
        >
          {loading ? <Loader /> : 'Buy'}
        </button>
      </form>
      {error ? <p className="text-red-500 mt-4">{error}</p> : null}
      {trades ? (
        <div className="w-full flex flex-row justify-center">
          <table className="mt-4 border-collapse">
            <thead>
              <tr>
                <th className="text-lg font-medium text-gray-800 py-2 px-3 border border-gray-300">
                  Date
                </th>
                <th className="text-lg font-medium text-gray-800 py-2 px-3 border border-gray-300">
                  Symbol
                </th>
                <th className="text-lg font-medium text-gray-800 py-2 px-3 border border-gray-300">
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              {trades.map(trade => (
                <tr key={trade.date + trade.symbol}>
                  <td className="text-base py-2 px-3 border border-gray-300">
                    {trade.date}
                  </td>
                  <td className="text-base py-2 px-3 border border-gray-300">
                    {trade.symbol}
                  </td>
                  <td className="text-base py-2 px-3 border border-gray-300">
                    {trade.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}
