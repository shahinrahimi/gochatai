
import React from "react";
import MessageList from "@/container/MessageList";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import SelectModel from "@/components/custom/SelectModel";
import { useLocalModel } from "@/hooks/useModels";
import { useCompletion } from "@/context/CompletionContext";
import { Bot } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";
const Completion = () => {
  const [showAdvanced, setShowAdvanced] = React.useState<boolean>(false)
  const navigate = useNavigate()
  const { id } = useParams<{id:string}>()
  const {open } = useSidebar()
  

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
    
  
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      {/* Settings Panel */}
      <div
        className={`${showAdvanced ? "w-full md:w-1/4 p-4 opacity-100" : "w-0 p-0 opacity-0"} transition-all duration-300 overflow-hidden bg-white border-r`}
      >
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Advanced Settings</h2>

          <div className="space-y-2">
            <label className="text-sm font-medium">Model</label>
            <SelectModel model={model} setModel={setModel} models={models} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">System Prompt</label>
            <Textarea
              value={system}
              onChange={(e) => setSystem(e.target.value)}
              className="min-h-[100px]"
              placeholder="Enter system instructions for the AI"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">Temperature: {temperature.toFixed(1)}</label>
            </div>
            <Slider
              value={[temperature]}
              min={0}
              max={2}
              step={0.1}
              onValueChange={(value) => setTemperature(value[0])}
            />
            <p className="text-xs text-gray-500">Lower values = more deterministic, higher values = more creative</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Seed (optional)</label>
            <Input
              type="number"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              placeholder="Random seed for reproducibility"
            />
            <p className="text-xs text-gray-500">Same seed + temperature = same response</p>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className={`flex-1 flex flex-col ${showAdvanced ? "md:w-2/3" : "w-full"} transition-all duration-300`}>
        {/* Header */}
        <header className="p-4 border-b flex justify-between items-center bg-white">
          <h1 className="flex text-xl justify-center align-baseline gap-8">
            <span className=""><Bot /></span>
            <span className="">{model?.name}</span>
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm">Advanced Mode</span>
            <Switch checked={showAdvanced} onCheckedChange={setShowAdvanced} />
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="max-w-7xl mx-auto">
          {currentConversation ? (
            <MessageList messages={currentConversation.messages} />
          ): (
            <MessageList messages={[]} />
          )}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-white">
          <form onSubmit={handleFormSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )

}

export default Completion;
