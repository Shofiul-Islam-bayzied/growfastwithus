import * as React from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CarouselProps = {
  orientation?: "horizontal" | "vertical"
}

type CarouselContextProps = {
  containerRef: React.RefObject<HTMLDivElement | null>
  orientation: "horizontal" | "vertical"
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
}

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)
  if (!context) throw new Error("useCarousel must be used within a <Carousel />")
  return context
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(({ orientation = "horizontal", className, children, ...props }, ref) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)

  const updateScrollState = React.useCallback(() => {
    const el = containerRef.current
    if (!el) return
    if (orientation === "horizontal") {
      setCanScrollPrev(el.scrollLeft > 0)
      setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
    } else {
      setCanScrollPrev(el.scrollTop > 0)
      setCanScrollNext(el.scrollTop + el.clientHeight < el.scrollHeight - 1)
    }
  }, [orientation])

  const scrollByAmount = React.useCallback(
    (sign: 1 | -1) => {
      const el = containerRef.current
      if (!el) return
      const amount = (orientation === "horizontal" ? el.clientWidth : el.clientHeight) * 0.9
      if (orientation === "horizontal") {
        el.scrollBy({ left: sign * amount, behavior: "smooth" })
      } else {
        el.scrollBy({ top: sign * amount, behavior: "smooth" })
      }
    },
    [orientation]
  )

  const scrollPrev = React.useCallback(() => scrollByAmount(-1), [scrollByAmount])
  const scrollNext = React.useCallback(() => scrollByAmount(1), [scrollByAmount])

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault(); scrollPrev()
      } else if (event.key === "ArrowRight") {
        event.preventDefault(); scrollNext()
      }
    },
    [scrollPrev, scrollNext]
  )

  React.useEffect(() => {
    updateScrollState()
    const el = containerRef.current
    if (!el) return
    const handler = () => updateScrollState()
    el.addEventListener("scroll", handler, { passive: true })
    window.addEventListener("resize", handler)
    return () => {
      el.removeEventListener("scroll", handler)
      window.removeEventListener("resize", handler)
    }
  }, [updateScrollState])

  return (
    <CarouselContext.Provider
      value={{ containerRef, orientation, scrollPrev, scrollNext, canScrollPrev, canScrollNext }}
    >
      <div
        ref={ref}
        onKeyDownCapture={handleKeyDown}
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
})
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { containerRef, orientation } = useCarousel()
  return (
    <div
      ref={containerRef}
      className={cn(
        "overflow-auto scroll-smooth momentum-scroll no-scrollbar",
        orientation === "horizontal" ? "snap-x snap-mandatory" : "snap-y snap-mandatory",
      )}
    >
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full snap-center",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()
  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel()
  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-right-12 top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
})
CarouselNext.displayName = "CarouselNext"

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext }
