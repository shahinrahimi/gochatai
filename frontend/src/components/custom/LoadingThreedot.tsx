
const LoadingThreedot = () => {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-muted rounded-lg px-4 py-2">
        <div className="flex gap-1">
          <div className="h-1 w-1 rounded-full bg-current animate-bounce" />
          <div className="h-1 w-1 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
          <div className="h-1 w-1 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
        </div>
      </div>
    </div>

  )
}

export default LoadingThreedot;
