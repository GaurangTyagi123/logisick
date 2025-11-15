import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-ls-bg-500/50 dark:bg-ls-bg-dark-500/50 animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
