// src/RentalTrends.tsx

import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useMediaQuery } from "@/hooks/use-media-query"
import { TrendingUp } from "lucide-react"

// Define interfaces
interface RentalTrend {
  average_rent_brl: number
  city: string
  count: number
  max_rent_brl: number
  median_rent_brl: number
  min_rent_brl: number
}

interface RentalTrendDetail {
  city: string
  averageRent: number
  count: number
  maxRent: number
  medianRent: number
  minRent: number
}

export function RentalTrends() {
  const [rentalTrends, setRentalTrends] = useState<RentalTrendDetail[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTrend, setSelectedTrend] = useState<RentalTrendDetail | null>(null)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const isDesktop = useMediaQuery("(min-width: 768px)")

  useEffect(() => {
    const fetchRentalTrends = async () => {
      setLoading(true)
      setError(null)
      try {
        const baseURL = import.meta.env.VITE_API || 'http://127.0.0.1:5000'
        const response = await fetch(`${baseURL}/rental_trends`)

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()

        const transformedData: RentalTrendDetail[] = data.rental_trends.map((item: RentalTrend) => ({
          city: item.city,
          averageRent: parseFloat(item.average_rent_brl.toFixed(2)),
          count: item.count,
          maxRent: item.max_rent_brl,
          medianRent: item.median_rent_brl,
          minRent: item.min_rent_brl,
        }))

        setRentalTrends(transformedData)
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

    fetchRentalTrends()
  }, [])

  const handleDotClick = (data: any) => {
    setSelectedTrend(data.payload)
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
    setSelectedTrend(null)
  }

  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Rental Trends</CardTitle>
        <CardDescription>Current rental trends across Brazilian cities</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Handle loading and error states */}
        {loading && <p className="text-gray-500">Loading rental trends data...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {/* Render the chart */}
        {!loading && !error && rentalTrends.length > 0 && (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={rentalTrends}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="city"
                angle={-45}
                textAnchor="end"
                interval={0}
                height={60}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                domain={[0, 'dataMax + 5000']}
                tickFormatter={(value) => formatCurrency(value)}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as RentalTrendDetail
                    return (
                      <div className="bg-white border border-gray-300 p-2 rounded shadow">
                        <p><strong>{data.city}</strong></p>
                        <p><strong>Average Rent:</strong> {formatCurrency(data.averageRent)}</p>
                        <p><strong>Median Rent:</strong> {formatCurrency(data.medianRent)}</p>
                        <p><strong>Max Rent:</strong> {formatCurrency(data.maxRent)}</p>
                        <p><strong>Min Rent:</strong> {formatCurrency(data.minRent)}</p>
                        <p><strong>Listings:</strong> {data.count}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Line
                type="monotone"
                dataKey="averageRent"
                name="Average Rent"
                stroke="#8884d8"
                activeDot={{ r: 8, onClick: handleDotClick, cursor: 'pointer' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {/* Dialog or Drawer to show rental trend details */}
        {selectedTrend && (
          <>
            {isDesktop ? (
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{selectedTrend.city} Rental Details</DialogTitle>
                    <DialogDescription>
                      <p><strong>Average Rent:</strong> {formatCurrency(selectedTrend.averageRent)}</p>
                      <p><strong>Median Rent:</strong> {formatCurrency(selectedTrend.medianRent)}</p>
                      <p><strong>Max Rent:</strong> {formatCurrency(selectedTrend.maxRent)}</p>
                      <p><strong>Min Rent:</strong> {formatCurrency(selectedTrend.minRent)}</p>
                      <p><strong>Number of Listings:</strong> {selectedTrend.count}</p>
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4">
                    <Button onClick={handleClose}>Close</Button>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerContent>
                  <DrawerHeader className="text-left">
                    <DrawerTitle>{selectedTrend.city} Rental Details</DrawerTitle>
                    <DrawerDescription>
                      <p><strong>Average Rent:</strong> {formatCurrency(selectedTrend.averageRent)}</p>
                      <p><strong>Median Rent:</strong> {formatCurrency(selectedTrend.medianRent)}</p>
                      <p><strong>Max Rent:</strong> {formatCurrency(selectedTrend.maxRent)}</p>
                      <p><strong>Min Rent:</strong> {formatCurrency(selectedTrend.minRent)}</p>
                      <p><strong>Number of Listings:</strong> {selectedTrend.count}</p>
                    </DrawerDescription>
                  </DrawerHeader>
                  <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                      <Button variant="outline">Close</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            )}
          </>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          City rental trends <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing current rental trends across selected Brazilian cities.
        </div>
      </CardFooter>
    </Card>
  )
}
