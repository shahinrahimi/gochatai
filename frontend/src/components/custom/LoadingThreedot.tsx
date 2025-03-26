import React from "react";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";

const LoadingThreedot = () => {
  return (
    <div className="flex items-start gap-3">
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
      </Avatar>
      <div className="bg-muted rounded-lg px-4 py-2">
        <div className="flex gap-1">
          <div className="h-2 w-2 rounded-full bg-current animate-bounce" />
          <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
          <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
        </div>
      </div>
    </div>

  )
}

export default LoadingThreedot;
