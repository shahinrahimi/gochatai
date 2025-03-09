import React from "react";
import { signal } from "@preact/signals-react";
import { 
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import { Model } from "@/types";
const modelSignal = signal<Model | null>(null)
const modelsSignal = signal<Model[]>([])
interface SelectModelProps {
  onFetchComplete: (defaultModel: Model | null) => void
}
const SelectModel = ({onFetchComplete}: SelectModelProps) => {
  React.useEffect(() => {
    // function to fetch model lists
    const fetchModelList = async () => {
      try {
        const url = "http://localhost:3000/list"
        const res = await fetch(url, {
          method: "GET",
          headers: {"Content-Type": "application/json"}
        })

        const data = await res.json()
        console.log(data)
        const modelData: Model[] = data.data.models
        if (modelData.length > 0 ) {
          modelsSignal.value = modelData
          modelSignal.value = modelData[0]
          onFetchComplete(modelData[0])
        }

      } catch (error) {
        console.error("Error fetching models:", error)
      }
    }

    fetchModelList()

  },[]) 
  const handleModelChange = (modelName: string) => {
    modelsSignal.value.forEach((m:Model) => {
      if (m.name == modelName) {
        modelSignal.value = m
        onFetchComplete(m)
      }
    })
  }
  return (
    <Select onValueChange={(value) => handleModelChange(value)}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="select a model" />
      </SelectTrigger>
        {modelsSignal.value.length > 0 && (
          <SelectContent >
          {modelsSignal.value.map((m: Model) => (
            <SelectItem key={m.name} value={m.name}>
              {m.name}
            </SelectItem>
          ))}
          </SelectContent>
        )}
    </Select>
    

  )
}


export default SelectModel
