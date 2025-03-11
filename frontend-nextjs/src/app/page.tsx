import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircle, Settings } from "lucide-react";
import Image from "next/image";


export default function Home() {
  return (
       <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between h-16">
          <h1 className="text-2xl font-bold">AI Assistant</h1>
          <nav className="flex items-center gap-4">
            <Link href="/chat">
              <Button variant="ghost" size="sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 container py-12">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold tracking-tight">Your Personal AI Assistant</h2>
          <p className="text-muted-foreground text-lg">
            Chat with your AI assistant, customize its behavior, and select from different models.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/chat">
              <Button size="lg" className="w-full sm:w-auto">
                <MessageCircle className="w-5 h-5 mr-2" />
                Start Chatting
              </Button>
            </Link>
            <Link href="/settings">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Settings className="w-5 h-5 mr-2" />
                Configure Settings
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} AI Assistant. All rights reserved.
        </div>
      </footer>
    </div>   
  )
}
