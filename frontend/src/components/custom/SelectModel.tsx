import React from "react";
import { 
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import { LocalModel } from "@/api/types";


interface SelectModelProps {
  model: LocalModel | null,
  models: LocalModel[],
  setModel: (Model: LocalModel) => void; 
}
const SelectModel = ({model, models, setModel}:SelectModelProps) => {
    const handleChangeValue = (value:string) => {
      models.forEach((me:LocalModel) => {
        if (me.name == value) setModel(me)
      })
    } 

    return (
    <Select value={model?.name} onValueChange={(value) => handleChangeValue(value)}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
        {models.length > 0 && (
          <SelectContent >
          {models.map((m: LocalModel) => (
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
