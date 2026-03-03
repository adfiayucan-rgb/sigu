import * as React from 'react'
import { VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Definimos la interfaz extendiendo directamente de los tipos de React y CVA
interface LoadingButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  loadingText?: string
  asChild?: boolean
}

export const LoadingButton = ({
  children,
  isLoading,
  loadingText,
  className,
  variant,
  size,
  disabled,
  ...props
}: LoadingButtonProps) => {
  return (
    <Button
      variant={variant}
      size={size}
      disabled={isLoading || disabled}
      className={cn("gap-2", className)}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="size-4 animate-spin shrink-0" />
          <span>{loadingText || children}</span>
        </>
      ) : (
        children
      )}
    </Button>
  )
}