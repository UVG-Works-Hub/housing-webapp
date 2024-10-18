// FeatureImportance.tsx
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export function FeatureImportance() {
  const [featureImportance, setFeatureImportance] = useState<ChartData<'bar', number[], string> | null>(null)

  useEffect(() => {
    // In a real application, this would be an API call to your backend
    // For this example, we'll use mock data
    const mockData: ChartData<'bar', number[], string> = {
      labels: ['Area', 'Rooms', 'Bathrooms', 'Parking', 'Floor', 'HOA', 'Property Tax', 'Fire Insurance'],
      datasets: [{
        label: 'Feature Importance',
        data: [0.3, 0.2, 0.15, 0.1, 0.05, 0.1, 0.05, 0.05],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      }]
    }
    setFeatureImportance(mockData)
  }, [])

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Feature Importance',
      },
    },
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Feature Importance</CardTitle>
      </CardHeader>
      <CardContent>
        {featureImportance && <Bar options={options} data={featureImportance} />}
      </CardContent>
    </Card>
  )
}
