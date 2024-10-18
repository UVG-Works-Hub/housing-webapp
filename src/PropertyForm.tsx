// PropertyForm.tsx
import { useState, ChangeEvent, FormEvent } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export interface PropertyData {
  city: string
  area: number
  rooms: number
  bathroom: number
  parkingSpaces: number
  floor: number
  animal: boolean
  furniture: boolean
  hoa: number
  propertyTax: number
  fireInsurance: number
}

interface PropertyFormProps {
  onSubmit: (data: PropertyData) => void
}

interface FormErrors {
  [key: string]: string
}

export function PropertyForm({ onSubmit }: PropertyFormProps) {
  const [formData, setFormData] = useState({
    city: '',
    area: '',
    rooms: '',
    bathroom: '',
    parkingSpaces: '',
    floor: '',
    animal: false,
    furniture: false,
    hoa: '',
    propertyTax: '',
    fireInsurance: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    if (!formData.city) newErrors.city = 'City is required'
    if (!formData.area || isNaN(Number(formData.area))) newErrors.area = 'Valid area is required'
    if (!formData.rooms || isNaN(Number(formData.rooms))) newErrors.rooms = 'Valid number of rooms is required'
    if (!formData.bathroom || isNaN(Number(formData.bathroom))) newErrors.bathroom = 'Valid number of bathrooms is required'
    if (!formData.parkingSpaces || isNaN(Number(formData.parkingSpaces))) newErrors.parkingSpaces = 'Valid number of parking spaces is required'
    if (!formData.floor || isNaN(Number(formData.floor))) newErrors.floor = 'Valid floor number is required'
    if (!formData.hoa || isNaN(Number(formData.hoa))) newErrors.hoa = 'Valid HOA amount is required'
    if (!formData.propertyTax || isNaN(Number(formData.propertyTax))) newErrors.propertyTax = 'Valid property tax amount is required'
    if (!formData.fireInsurance || isNaN(Number(formData.fireInsurance))) newErrors.fireInsurance = 'Valid fire insurance amount is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validateForm()) {
      const data: PropertyData = {
        city: formData.city,
        area: Number(formData.area),
        rooms: Number(formData.rooms),
        bathroom: Number(formData.bathroom),
        parkingSpaces: Number(formData.parkingSpaces),
        floor: Number(formData.floor),
        animal: formData.animal,
        furniture: formData.furniture,
        hoa: Number(formData.hoa),
        propertyTax: Number(formData.propertyTax),
        fireInsurance: Number(formData.fireInsurance),
      }
      onSubmit(data)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="city">City</Label>
        <Input type="text" id="city" name="city" value={formData.city} onChange={handleChange} />
        {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
      </div>
      <div>
        <Label htmlFor="area">Area (m²)</Label>
        <Input type="number" id="area" name="area" value={formData.area} onChange={handleChange} />
        {errors.area && <p className="text-red-500 text-sm">{errors.area}</p>}
      </div>
      <div>
        <Label htmlFor="rooms">Number of Rooms</Label>
        <Input type="number" id="rooms" name="rooms" value={formData.rooms} onChange={handleChange} />
        {errors.rooms && <p className="text-red-500 text-sm">{errors.rooms}</p>}
      </div>
      <div>
        <Label htmlFor="bathroom">Number of Bathrooms</Label>
        <Input type="number" id="bathroom" name="bathroom" value={formData.bathroom} onChange={handleChange} />
        {errors.bathroom && <p className="text-red-500 text-sm">{errors.bathroom}</p>}
      </div>
      <div>
        <Label htmlFor="parkingSpaces">Parking Spaces</Label>
        <Input type="number" id="parkingSpaces" name="parkingSpaces" value={formData.parkingSpaces} onChange={handleChange} />
        {errors.parkingSpaces && <p className="text-red-500 text-sm">{errors.parkingSpaces}</p>}
      </div>
      <div>
        <Label htmlFor="floor">Floor</Label>
        <Input type="number" id="floor" name="floor" value={formData.floor} onChange={handleChange} />
        {errors.floor && <p className="text-red-500 text-sm">{errors.floor}</p>}
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="animal"
          name="animal"
          checked={formData.animal}
          onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, animal: checked }))}
        />
        <Label htmlFor="animal">Animals Allowed</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="furniture"
          name="furniture"
          checked={formData.furniture}
          onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, furniture: checked }))}
        />
        <Label htmlFor="furniture">Furnished</Label>
      </div>
      <div>
        <Label htmlFor="hoa">HOA (R$)</Label>
        <Input type="number" id="hoa" name="hoa" value={formData.hoa} onChange={handleChange} />
        {errors.hoa && <p className="text-red-500 text-sm">{errors.hoa}</p>}
      </div>
      <div>
        <Label htmlFor="propertyTax">Property Tax (R$)</Label>
        <Input type="number" id="propertyTax" name="propertyTax" value={formData.propertyTax} onChange={handleChange} />
        {errors.propertyTax && <p className="text-red-500 text-sm">{errors.propertyTax}</p>}
      </div>
      <div>
        <Label htmlFor="fireInsurance">Fire Insurance (R$)</Label>
        <Input type="number" id="fireInsurance" name="fireInsurance" value={formData.fireInsurance} onChange={handleChange} />
        {errors.fireInsurance && <p className="text-red-500 text-sm">{errors.fireInsurance}</p>}
      </div>
      <Button type="submit" className="w-full">Predict Rental Price</Button>
    </form>
  )
}
