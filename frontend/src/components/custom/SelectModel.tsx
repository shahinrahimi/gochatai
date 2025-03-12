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
import { fetchModels } from "@/api";
const modelSignal = signal<Model | null>(null)
const modelsSignal = signal<Model[]>([])

interface SelectModelProps {
  onFetchComplete: (defaultModel: Model | null) => void
}
const SelectModel = ({onFetchComplete}: SelectModelProps) => {
  
  React.useEffect(() => {
    const handleFetchModels = async () => {
      await fetchModels((ms) => {
        if (ms.length > 0) {
          modelsSignal.value = ms 
          modelSignal.value = ms[0]
          onFetchComplete(ms[0])
        }
      },(err: any) => {
        console.log("Error in fethcing models list: ", err)
      })} 
    handleFetchModels()
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
