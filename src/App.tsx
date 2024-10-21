// src/RentalPrediction.tsx
"use client"

import { useState } from 'react'
import { PropertyForm, PropertyData } from './PropertyForm'
import { PredictionResult } from './PredictionResult'
import { FeatureImportance } from './FeatureImportance'
import { RentalTrends } from './RentalTrends'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

// Import the types
export interface PredictionResponse {
  total_monthly_cost_brl: number
}

export default function RentalPrediction() {
  const [prediction, setPrediction] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)


  // Handle the prediction by making a POST request to /predict
  const handlePrediction = async (propertyData: PropertyData) => {
    setLoading(true)
    setError(null)
    setPrediction(null) // Reset previous prediction

    try {
      const baseURL = import.meta.env.VITE_API || 'http://127.0.0.1:5000'
      const response = await fetch(`${baseURL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      })

      if (!response.ok) {
        // Extract error message from response if available
        const errorData = await response.json()
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
      }

      const data: PredictionResponse = await response.json()
      setPrediction(data.total_monthly_cost_brl)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-8 text-left">Brazilian Rental Price Predictor 💸</h1>

      {/* Main Tabs */}
      <Tabs defaultValue="prediction" className="w-full">
        {/* Tabs List */}
        <TabsList className="grid grid-cols-2 md:grid-cols-2">
          <TabsTrigger value="prediction">Prediction</TabsTrigger>
          <TabsTrigger value="visualizations">Visualizations</TabsTrigger>
        </TabsList>

        {/* Tab Content: Prediction */}
        <TabsContent value="prediction" className="mt-4">
          <div className="space-y-8">
            {/* Property Form */}
            <PropertyForm onSubmit={handlePrediction} disabled={loading}/>

            {/* Prediction Result */}
            {loading && <p className="text-gray-500">Predicting rental price...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            {prediction !== null && !loading && !error && (
              <PredictionResult prediction={prediction} />
            )}
          </div>
        </TabsContent>

        {/* Tab Content: Visualizations */}
        <TabsContent value="visualizations" className="mt-4">
          <div className="space-y-8">
            <div className='rounded-md shadow-sm p-4 border'>
              ℹ️ Note: You can interact with the charts below to see more details.
            </div>
            <FeatureImportance />
            <RentalTrends />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
