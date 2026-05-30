import { useState, useMemo } from "react"
import * as Icons from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronDown } from "lucide-react"

interface IconPickerProps {
  selectedIconName: string
  onSelectIcon: (iconName: string) => void
}

export function IconPicker({
  selectedIconName,
  onSelectIcon,
}: IconPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  // 1. Extract valid icon names from library
  const iconNames = useMemo(() => {
    return Object.keys(Icons).filter((key) => {
      return (
        typeof (Icons as any)[key] === "object" ||
        typeof (Icons as any)[key] === "function"
      )
    })
  }, [])

  // 2. Filter icons based on search query (showing top 70)
  const filteredIcons = useMemo(() => {
    const cleanSearch = search.toLowerCase().trim()
    if (!cleanSearch) return iconNames.slice(0, 70)

    return iconNames
      .filter((name) => name.toLowerCase().includes(cleanSearch))
      .slice(0, 70)
  }, [search, iconNames])

  // Resolve current active icon for the dropdown display button row
  const CurrentIcon = (Icons as any)[selectedIconName] || Icons.HelpCircle

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* Dropdown Trigger Button */}
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-10 w-full justify-between overflow-hidden rounded-md border-border/60 bg-background/50 px-3 text-sm hover:bg-muted/30 focus:ring-1 focus:ring-primary/30"
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <CurrentIcon className="h-4 w-4" />
            </div>
            <span className="truncate font-medium text-foreground">
              {selectedIconName || "Select icon..."}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      {/* Floating Dropdown Drawer Canvas */}
      <PopoverContent
        className="w-[320px] rounded-xl border-border/80 p-3 shadow-xl backdrop-blur-md"
        align="start"
      >
        <div className="space-y-3">
          {/* Internal Input Frame */}
          <Input
            type="text"
            placeholder="Search 1,400+ icons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 bg-background/50 text-xs focus-visible:ring-1 focus-visible:ring-primary/20"
          />

          {/* Grid Canvas */}
          <ScrollArea className="h-50 w-full rounded-lg border border-border/40 bg-muted/10 p-1.5 shadow-inner">
            <div className="grid grid-cols-6 gap-1">
              {filteredIcons.map((name) => {
                const IconComponent = (Icons as any)[name]
                console.log(IconComponent, name)
                const isSelected = selectedIconName === name

                if (!IconComponent) return null

                return (
                  <Button
                    key={name}
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      onSelectIcon(name)
                      setOpen(false) // Smoothly auto-close dropdown canvas on selection
                    }}
                    title={name}
                    className={`relative flex aspect-square h-9 w-9 items-center justify-center rounded-lg p-0 transition-all duration-150 ${
                      isSelected
                        ? "scale-105 bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground"
                        : "text-muted-foreground/80 hover:scale-105 hover:bg-muted hover:text-foreground"
                    } `}
                  >
                    <IconComponent className="h-4 w-4" />
                  </Button>
                )
              })}
            </div>

            {filteredIcons.length === 0 && (
              <div className="flex h-40 flex-col items-center justify-center text-center">
                <p className="text-xs font-semibold text-muted-foreground">
                  No matches
                </p>
              </div>
            )}
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  )
}
