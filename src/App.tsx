// App.tsx
import { useState } from 'react'
import { PropertyForm, PropertyData } from './PropertyForm'
import { PredictionResult } from './PredictionResult'
import { FeatureImportance } from './FeatureImportance'
import { RentalTrends } from './RentalTrends'

export default function RentalPrediction() {
  const [prediction, setPrediction] = useState<number | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handlePrediction = async (_propertyData: PropertyData) => {
    // In a real application, this would be an API call to your backend
    // For this example, we'll simulate a prediction
    const simulatedPrediction = Math.round(Math.random() * 5000 + 1000)
    setPrediction(simulatedPrediction)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-left">Brazilian Rental Price Predictor 💸</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <PropertyForm onSubmit={handlePrediction} />
        </div>
        <div>
          {prediction !== null && <PredictionResult prediction={prediction} />}
          <FeatureImportance />
          <RentalTrends />
        </div>
      </div>
    </div>
  )
}
