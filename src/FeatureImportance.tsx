// src/FeatureImportance.tsx
import { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Rectangle,
} from 'recharts'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
interface FeatureImportanceData {
  feature_importances: Array<{
    Feature: string
    Importance: number
  }>
}

interface FeatureDetail {
  feature: string
  importance: number
  description?: string
}

export function FeatureImportance() {
  const [featureImportance, setFeatureImportance] = useState<FeatureDetail[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [topN, setTopN] = useState<number>(10)
  const [selectedFeature, setSelectedFeature] = useState<FeatureDetail | null>(null)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const isDesktop = useMediaQuery("(min-width: 768px)")

  useEffect(() => {
    const fetchFeatureImportance = async () => {
      setLoading(true)
      setError(null)
      try {
        const baseURL = import.meta.env.VITE_API || 'http://127.0.0.1:5000'
        const response = await fetch(`${baseURL}/feature_importance`)

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data: FeatureImportanceData = await response.json()

        const sortedData = data.feature_importances
          .sort((a, b) => b.Importance - a.Importance)
          .slice(0, topN)
          .map(item => ({
            feature: formatFeatureName(item.Feature),
            importance: item.Importance,
            description: getFeatureDescription(formatFeatureName(item.Feature)),
            fill: getFeatureColor(formatFeatureName(item.Feature)),
          }))

        setFeatureImportance(sortedData)
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

    fetchFeatureImportance()
  }, [topN])

  const formatFeatureName = (feature: string): string => {
    const featureMap: { [key: string]: string } = {
      'num__num_rooms': 'Rooms',
      'num__property_tax_brl': 'Property Tax (R$)',
      'num__area_sqm': 'Area (m²)',
      'num__fire_insurance_brl': 'Fire Insurance (R$)',
      'num__num_parking_spaces': 'Parking Spaces',
      'num__num_bathrooms': 'Bathrooms',
      'num__floor_level': 'Floor Level',
      'cat__allows_animals_not acept': 'Animals Not Allowed',
      'cat__city_São Paulo': 'City: São Paulo',
      'cat__is_furnished_not furnished': 'Not Furnished',
      'cat__city_Rio de Janeiro': 'City: Rio de Janeiro',
      'cat__city_Campinas': 'City: Campinas',
      'cat__city_Porto Alegre': 'City: Porto Alegre',
    }

    return featureMap[feature] || feature
  }

  const getFeatureDescription = (feature: string): string => {
    const descriptions: { [key: string]: string } = {
      'Rooms': 'Number of rooms in the property.',
      'Property Tax (R$)': 'Annual property tax amount in Brazilian Reais.',
      'Area (m²)': 'Total area of the property in square meters.',
      'Fire Insurance (R$)': 'Annual fire insurance cost in Brazilian Reais.',
      'Parking Spaces': 'Number of parking spaces available.',
      'Bathrooms': 'Number of bathrooms in the property.',
      'Floor Level': 'Floor level where the property is located.',
      'Animals Not Allowed': 'Whether animals are not allowed in the property.',
      'City: São Paulo': 'Property located in São Paulo.',
      'Not Furnished': 'Property is not furnished.',
      'City: Rio de Janeiro': 'Property located in Rio de Janeiro.',
      'City: Campinas': 'Property located in Campinas.',
      'City: Porto Alegre': 'Property located in Porto Alegre.',
    }

    return descriptions[feature] || 'No description available.'
  }

  const getFeatureColor = (feature: string): string => {
    const colorMap: { [key: string]: string } = {
      'Rooms': 'hsl(200, 70%, 50%)',
      'Property Tax (R$)': 'hsl(220, 70%, 50%)',
      'Area (m²)': 'hsl(240, 70%, 50%)',
      'Fire Insurance (R$)': 'hsl(260, 70%, 50%)',
      'Parking Spaces': 'hsl(280, 70%, 50%)',
      'Bathrooms': 'hsl(300, 70%, 50%)',
      'Floor Level': 'hsl(320, 70%, 50%)',
      'Animals Not Allowed': 'hsl(340, 70%, 50%)',
      'City: São Paulo': 'hsl(360, 70%, 50%)',
      'Not Furnished': 'hsl(380, 70%, 50%)', // Note: hsl values above 360 wrap around
      'City: Rio de Janeiro': 'hsl(400, 70%, 50%)',
      'City: Campinas': 'hsl(420, 70%, 50%)',
      'City: Porto Alegre': 'hsl(440, 70%, 50%)',
    }

    return colorMap[feature] || 'hsl(180, 70%, 50%)'
  }

  const handleBarClick = (data: FeatureDetail, index: number) => {
    setSelectedFeature(data)
    setIsOpen(true)
  }

  const handleTopNChange = (value: string) => {
    setTopN(Number(value))
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Feature Importance</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Control to select Top N */}
        <div className="mb-4 flex items-center">
          <Select onValueChange={handleTopNChange} value={topN.toString()}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Top N" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Number of Features</SelectLabel>
                <SelectItem value="5">Top 5</SelectItem>
                <SelectItem value="10">Top 10</SelectItem>
                <SelectItem value="15">Top 15</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Handle loading and error states */}
        {loading && <p className="text-gray-500">Loading feature importance data...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {/* Render the chart */}
        {!loading && !error && featureImportance.length > 0 && (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={featureImportance}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              onClick={(data, index) => {
                if (index && index.activeLabel) {
                  const feature = featureImportance[index.index]
                  handleBarClick(feature, index.index)
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="feature"
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                domain={[0, 1]}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as FeatureDetail
                    return (
                      <div className="bg-white border border-gray-300 p-2 rounded shadow">
                        <p><strong>{data.feature}</strong></p>
                        <p>Importance: {data.importance}</p>
                        <p>{data.description}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar
                dataKey="importance"
                fill="#8884d8"
                onClick={(data, index) => {
                  const feature = featureImportance[index.index]
                  handleBarClick(feature, index.index)
                }}
              >
                {
                  featureImportance.map((entry, index) => (
                    <Rectangle
                      key={`cell-${index}`}
                      fill={entry.fill}
                      onClick={() => handleBarClick(entry, index)}
                      cursor="pointer"
                    />
                  ))
                }
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {/* Dialog or Drawer to show feature details */}
        {selectedFeature && (
          <>
            {isDesktop ? (
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{selectedFeature.feature}</DialogTitle>
                    <DialogDescription>
                      <p><strong>Importance:</strong> {selectedFeature.importance}</p>
                      <p><strong>Description:</strong> {selectedFeature.description}</p>
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4">
                    <Button onClick={() => setIsOpen(false)}>Close</Button>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerContent>
                  <DrawerHeader className="text-left">
                    <DrawerTitle>{selectedFeature.feature}</DrawerTitle>
                    <DrawerDescription>
                      <p><strong>Importance:</strong> {selectedFeature.importance}</p>
                      <p><strong>Description:</strong> {selectedFeature.description}</p>
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
          What the model is looking at <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing top {topN} feature importances.
        </div>
      </CardFooter>
    </Card>
  )
}
