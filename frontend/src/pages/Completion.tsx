
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input";

import SelectModel from "@/components/custom/SelectModel";
import { useLocalModel } from "@/hooks/useModels";
import { useCompletion } from "@/context/CompletionContext";
import { Bot } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import ConversationView from "@/container/CoversationView";
import Header from "@/global/Header";
import { CornerDownLeft } from "lucide-react";
import { Label } from "@/components/ui/label";
const Completion = () => {
  const [showAdvanced, setShowAdvanced] = React.useState<boolean>(false)
  const navigate = useNavigate()
  const { id } = useParams<{id:string}>()
  

  const {model, models, setModel} = useLocalModel("completion-lab")
  const {
    handleSubmit,
    isLoading,
    currentConversation,
    createConversation,
    setCurrentId,

    input,
    setInput,
    system,
    setSystem,
    temperature,
    setTemperature,
    seed,
    setSeed,

  } = useCompletion()

  const hasCreatedRef = React.useRef(false)

  React.useEffect(() => {
    if (!id && !hasCreatedRef.current) {
      hasCreatedRef.current = true // block recreate new chat
      const newId = createConversation("New Completion") 
      navigate(`/completion/${newId}`)
    } else if (id) {
      setCurrentId(id)
    }
  },[id])


  const handleFormSubmit = (e:React.FormEvent) => {
    if (model){
      handleSubmit(e, model.name)
    }
      
  }

  const isActive = (!isLoading) && (input.trim() !== "") && model 
    
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      
      {/* Chat Interface */}
      <div className={`flex-1 flex flex-col ${showAdvanced ? "md:w-2/3" : "w-full"} transition-all duration-300`}>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="max-w-7xl mx-auto">
          {currentConversation ? (
            <ConversationView c={currentConversation} />
          ):null}
          </div>
        </div>

      <div className="p-4 border-t space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="system-prompt">System Prompt</Label>
            <Textarea
              id="system-prompt"
              value={system}
              onChange={(e) => setSystem(e.target.value)}
              placeholder="Enter system prompt..."
              className="resize-none h-20"
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="temperature">Temperature: {temperature.toFixed(1)}</Label>
              </div>
              <Slider
                id="temperature"
                min={0}
                max={1}
                step={0.1}
                value={[temperature]}
                onValueChange={(value) => setTemperature(value[0])}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seed">Seed</Label>
              <Input
                id="seed"
                type="number"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                placeholder="Enter seed (optional)"
              />
            </div>
          </div>
        </div>
        </div>
        {/* Input */}
<div className="p-4 border-t bg-white">
          <form onSubmit={handleFormSubmit} className="flex-col">

            <Switch checked={showAdvanced} onCheckedChange={setShowAdvanced} />
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 mb-4 focus-visible:ring-0 min-h-24"
              disabled={isLoading}
            />
            <div className="flex justify-between gap-4">
              <SelectModel 
                model={model} 
                setModel={setModel} 
                models={models} 
                className="flex-1 focus:ring-0 h-12 focus:outline-none"
              />
            
              <Button
                className={`flex bg-gray-300 text-gray-600 px-4 py-6 ${isActive ? "bg-cyan-500 text-white": ""}`}
                disabled={!isActive}
                type="submit"
              > 
                <span className="">Run</span>
                <span className={`py-0.5 px-2 border-gray-400 border-1 flex justify-center items-center rounded-sm ${isActive ? "border-white": ""}`}>
                  <CornerDownLeft className="" />  
                </span>
              </Button>
            </div>
          </form>
        </div>

      </div>
    </div>
  )

}

export default Completion;
