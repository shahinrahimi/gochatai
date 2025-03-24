:import React from "react";
import { Button } from "@/components/ui/button";
import { Bot, Home, AlertCircle } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4 text-center">
      <div className="max-w-md space-y-8">
        {/* Animated Bot Icon */}
        <div className="relative mx-auto h-32 w-32 animate-pulse rounded-full bg-primary/10 p-4">
          <Bot className="h-full w-full text-primary" />
          <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-destructive-foreground">
            <AlertCircle className="h-5 w-5" />
          </span>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">404</h1>
          <h2 className="text-2xl font-semibold tracking-tight text-muted-foreground">Page not found</h2>
          <p className="text-muted-foreground">
            Oops! It seems our AI couldn't find the page you're looking for. The conversation might have been moved or
            doesn't exist.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Home className="mr-2 h-4 w-4" />
            <span>Back to Home</span>
          </Button>
          <Button variant="outline" size="lg">
            <Bot className="mr-2 h-4 w-4" />
            Start New Chat
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          If you believe this is an error, please contact our support team.
        </p>
      </div>
    </div>
  )
}


export default NotFoundPage
