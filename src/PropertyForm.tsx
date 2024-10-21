// PropertyForm.tsx
import { useState, ChangeEvent, FormEvent } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface PropertyData {
  city: string
  allows_animals: boolean
  is_furnished: boolean
  area_sqm: number
  num_rooms: number
  num_bathrooms: number
  num_parking_spaces: number
  floor_level: number
  property_tax_brl: number
  fire_insurance_brl: number
}

interface PropertyFormProps {
  onSubmit: (data: PropertyData) => void
}

interface FormErrors {
  [key: string]: string
}

const cityOptions = ['São Paulo', 'Porto Alegre', 'Rio de Janeiro', 'Campinas', 'Belo Horizonte']

export function PropertyForm({ onSubmit }: PropertyFormProps) {
  const [formData, setFormData] = useState({
    city: '',
    allows_animals: false,
    is_furnished: false,
    area_sqm: '',
    num_rooms: '',
    num_bathrooms: '',
    num_parking_spaces: '',
    floor_level: '',
    property_tax_brl: '',
    fire_insurance_brl: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData(prevData => ({
      ...prevData,
      city: value
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    if (!formData.city) newErrors.city = 'City is required'
    if (!formData.area_sqm || isNaN(Number(formData.area_sqm))) newErrors.area_sqm = 'Valid area is required'
    if (!formData.num_rooms || isNaN(Number(formData.num_rooms))) newErrors.num_rooms = 'Valid number of rooms is required'
    if (!formData.num_bathrooms || isNaN(Number(formData.num_bathrooms))) newErrors.num_bathrooms = 'Valid number of bathrooms is required'
    if (!formData.num_parking_spaces || isNaN(Number(formData.num_parking_spaces))) newErrors.num_parking_spaces = 'Valid number of parking spaces is required'
    if (!formData.floor_level || isNaN(Number(formData.floor_level))) newErrors.floor_level = 'Valid floor level is required'
    if (!formData.property_tax_brl || isNaN(Number(formData.property_tax_brl))) newErrors.property_tax_brl = 'Valid property tax amount is required'
    if (!formData.fire_insurance_brl || isNaN(Number(formData.fire_insurance_brl))) newErrors.fire_insurance_brl = 'Valid fire insurance amount is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validateForm()) {
      const data: PropertyData = {
        city: formData.city,
        allows_animals: formData.allows_animals,
        is_furnished: formData.is_furnished,
        area_sqm: Number(formData.area_sqm),
        num_rooms: Number(formData.num_rooms),
        num_bathrooms: Number(formData.num_bathrooms),
        num_parking_spaces: Number(formData.num_parking_spaces),
        floor_level: Number(formData.floor_level),
        property_tax_brl: Number(formData.property_tax_brl),
        fire_insurance_brl: Number(formData.fire_insurance_brl),
      }
      onSubmit(data)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Ciudad Dropdown usando Select personalizado */}
      <div>
        <Label htmlFor="city">City</Label>
        <Select onValueChange={handleSelectChange} value={formData.city}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a city" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Cities</SelectLabel>
              {cityOptions.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
      </div>

      {/* Switches para Características Categóricas */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="allows_animals"
            name="allows_animals"
            checked={formData.allows_animals}
            onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, allows_animals: checked }))}
          />
          <Label htmlFor="allows_animals">Animals Allowed</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="is_furnished"
            name="is_furnished"
            checked={formData.is_furnished}
            onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, is_furnished: checked }))}
          />
          <Label htmlFor="is_furnished">Furnished</Label>
        </div>
      </div>

      {/* Campos Numéricos en Filas con Múltiples Columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Área (m²) */}
        <div>
          <Label htmlFor="area_sqm">Area (m²)</Label>
          <Input
            type="number"
            id="area_sqm"
            name="area_sqm"
            value={formData.area_sqm}
            onChange={handleChange}
          />
          {errors.area_sqm && <p className="text-red-500 text-sm">{errors.area_sqm}</p>}
        </div>

        {/* Número de Habitaciones */}
        <div>
          <Label htmlFor="num_rooms">Number of Rooms</Label>
          <Input
            type="number"
            id="num_rooms"
            name="num_rooms"
            value={formData.num_rooms}
            onChange={handleChange}
          />
          {errors.num_rooms && <p className="text-red-500 text-sm">{errors.num_rooms}</p>}
        </div>

        {/* Número de Baños */}
        <div>
          <Label htmlFor="num_bathrooms">Number of Bathrooms</Label>
          <Input
            type="number"
            id="num_bathrooms"
            name="num_bathrooms"
            value={formData.num_bathrooms}
            onChange={handleChange}
          />
          {errors.num_bathrooms && <p className="text-red-500 text-sm">{errors.num_bathrooms}</p>}
        </div>

        {/* Espacios de Estacionamento */}
        <div>
          <Label htmlFor="num_parking_spaces">Parking Spaces</Label>
          <Input
            type="number"
            id="num_parking_spaces"
            name="num_parking_spaces"
            value={formData.num_parking_spaces}
            onChange={handleChange}
          />
          {errors.num_parking_spaces && <p className="text-red-500 text-sm">{errors.num_parking_spaces}</p>}
        </div>

        {/* Nível do Piso */}
        <div>
          <Label htmlFor="floor_level">Floor Level</Label>
          <Input
            type="number"
            id="floor_level"
            name="floor_level"
            value={formData.floor_level}
            onChange={handleChange}
          />
          {errors.floor_level && <p className="text-red-500 text-sm">{errors.floor_level}</p>}
        </div>

        {/* Taxa de Propriedade (R$) */}
        <div>
          <Label htmlFor="property_tax_brl">Property Tax (R$)</Label>
          <Input
            type="number"
            id="property_tax_brl"
            name="property_tax_brl"
            value={formData.property_tax_brl}
            onChange={handleChange}
          />
          {errors.property_tax_brl && <p className="text-red-500 text-sm">{errors.property_tax_brl}</p>}
        </div>

        {/* Seguro contra Incêndio (R$) */}
        <div>
          <Label htmlFor="fire_insurance_brl">Fire Insurance (R$)</Label>
          <Input
            type="number"
            id="fire_insurance_brl"
            name="fire_insurance_brl"
            value={formData.fire_insurance_brl}
            onChange={handleChange}
          />
          {errors.fire_insurance_brl && <p className="text-red-500 text-sm">{errors.fire_insurance_brl}</p>}
        </div>
      </div>

      {/* Botón de Envío */}
      <Button type="submit" className="w-full">Predict Rental Price</Button>
    </form>
  )
}
