// RentalTrends.tsx
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export function RentalTrends() {
  const [rentalTrends, setRentalTrends] = useState<ChartData<'line', number[], string> | null>(null)

  useEffect(() => {
    // In a real application, this would be an API call to your backend
    // For this example, we'll use mock data
    const mockData: ChartData<'line', number[], string> = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'São Paulo',
          data: [2000, 2100, 2150, 2200, 2250, 2300],
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'Rio de Janeiro',
          data: [1800, 1850, 1900, 1950, 2000, 2050],
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
      ],
    }
    setRentalTrends(mockData)
  }, [])

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Rental Trends in Brazilian Cities',
      },
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rental Trends</CardTitle>
      </CardHeader>
      <CardContent>
        {rentalTrends && <Line options={options} data={rentalTrends} />}
      </CardContent>
    </Card>
  )
}
