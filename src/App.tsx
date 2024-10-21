// RentalPrediction.tsx o App.tsx
import { useState } from 'react'
import { PropertyForm, PropertyData } from './PropertyForm'
import { PredictionResult } from './PredictionResult'
import { FeatureImportance } from './FeatureImportance'
// import { RentalTrends } from './RentalTrends'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export default function RentalPrediction() {
  const [prediction, setPrediction] = useState<number | null>(null)

  // Maneja la predicción simulada
  const handlePrediction = async (_propertyData: PropertyData) => {
    // En una aplicación real, aquí iría una llamada a la API de tu backend
    // Simulamos una predicción para este ejemplo
    const simulatedPrediction = Math.round(Math.random() * 5000 + 1000)
    setPrediction(simulatedPrediction)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Encabezado */}
      <h1 className="text-3xl font-bold mb-8 text-left">Brazilian Rental Price Predictor 💸</h1>

      {/* Pestañas Principales */}
      <Tabs defaultValue="prediction" className="w-full">
        {/* Lista de Pestañas */}
        <TabsList className="grid grid-cols-2 md:grid-cols-2">
          <TabsTrigger value="prediction">Prediction</TabsTrigger>
          <TabsTrigger value="visualizations">Visualizations</TabsTrigger>
        </TabsList>

        {/* Contenido de la Pestaña: Prediction */}
        <TabsContent value="prediction" className="mt-4">
          <div className="space-y-8">
            {/* Formulario de Propiedad */}
            <PropertyForm onSubmit={handlePrediction} />

            {/* Resultado de la Predicción */}
            {prediction !== null ? (
              <PredictionResult prediction={prediction} />
            ) : (
              <p className="text-gray-500">Please submit the form to see the prediction.</p>
            )}
          </div>
        </TabsContent>

        {/* Contenido de la Pestaña: Visualizations */}
        <TabsContent value="visualizations" className="mt-4">
          <div className="space-y-8">
              <FeatureImportance />
              {/* <RentalTrends /> */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
