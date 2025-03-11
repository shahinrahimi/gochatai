"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
//import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  const [selectedModel, setSelectedModel] = useState("gpt-4o")
  const [systemPrompt, setSystemPrompt] = useState("You are a helpful AI assistant.")
  const [darkMode, setDarkMode] = useState(false)
  //const { toast } = useToast()

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedModel = localStorage.getItem("selectedModel")
    if (savedModel) setSelectedModel(savedModel)

    const savedPrompt = localStorage.getItem("systemPrompt")
    if (savedPrompt) setSystemPrompt(savedPrompt)

    // Check if dark mode is enabled
    const isDarkMode = document.documentElement.classList.contains("dark")
    setDarkMode(isDarkMode)
  }, [])

  const handleSaveSettings = () => {
    localStorage.setItem("selectedModel", selectedModel)
    localStorage.setItem("systemPrompt", systemPrompt)

    //toast({
    //  title: "Settings saved",
    //  description: "Your preferences have been updated.",
    //})
  }

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)

    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const clearConversation = () => {
    localStorage.removeItem("chatMessages")

    //toast({
    //  title: "Conversation cleared",
    //  description: "Your chat history has been deleted.",
    //})
  }

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container flex items-center h-16 gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Settings</h1>
        </div>
      </header>

      <main className="container py-8 max-w-3xl">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Model Selection</CardTitle>
              <CardDescription>Choose which AI model to use for generating responses</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedModel} onValueChange={setSelectedModel} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="gpt-4o" id="gpt-4o" />
                  <Label htmlFor="gpt-4o" className="flex flex-col">
                    <span className="font-medium">GPT-4o</span>
                    <span className="text-sm text-muted-foreground">Most capable model with advanced reasoning</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="gpt-3.5-turbo" id="gpt-3.5-turbo" />
                  <Label htmlFor="gpt-3.5-turbo" className="flex flex-col">
                    <span className="font-medium">GPT-3.5 Turbo</span>
                    <span className="text-sm text-muted-foreground">Faster responses with good capabilities</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="claude-3-opus" id="claude-3-opus" />
                  <Label htmlFor="claude-3-opus" className="flex flex-col">
                    <span className="font-medium">Claude 3 Opus</span>
                    <span className="text-sm text-muted-foreground">Anthropic's most capable model</span>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Prompt</CardTitle>
              <CardDescription>Customize how the AI assistant behaves</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="Enter a system prompt..."
                className="min-h-[100px]"
              />
              <p className="text-sm text-muted-foreground mt-2">
                The system prompt helps define the AI's personality and behavior.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of your AI assistant</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <Switch id="dark-mode" checked={darkMode} onCheckedChange={toggleDarkMode} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Manage your conversation history</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={clearConversation}>
                Clear Conversation History
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                This will delete all your chat messages. This action cannot be undone.
              </p>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} className="w-full sm:w-auto">
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
