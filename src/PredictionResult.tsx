// PredictionResult.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PredictionResultProps {
  prediction: number
}

export function PredictionResult({ prediction }: PredictionResultProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Predicted Rental Price</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold text-center">R$ {prediction.toFixed(2)}</p>
      </CardContent>
    </Card>
  )
}
