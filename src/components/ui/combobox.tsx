
"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface ComboboxOption {
  value: string;
  label: string;
  [key: string]: any; // To allow other properties like 'document' for professionals
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptySearchMessage?: string;
  className?: string;
  disabled?: boolean;
}

export function Combobox({
  options,
  value,
  onSelect,
  placeholder = "Seleccione una opción...",
  searchPlaceholder = "Buscar...",
  emptySearchMessage = "No se encontró la opción.",
  className,
  disabled,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const selectedOption = options.find((option) => option.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between font-normal", className, !value && "text-muted-foreground")}
          disabled={disabled}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[--radix-popover-trigger-width] p-0" 
        style={{ minWidth: 'var(--radix-popover-trigger-width)' }}
        align="start"
      >
        <Command
          filter={(itemValue, search) => {
            // itemValue is the 'value' prop of CommandItem, which we set to option.label
            // search is the user's input
            // We also want to search by document for professionals
            const option = options.find(opt => opt.label.toLowerCase() === itemValue.toLowerCase());
            if (option?.document?.toLowerCase().includes(search.toLowerCase())) {
              return 1;
            }
            if (itemValue.toLowerCase().includes(search.toLowerCase())) {
              return 1;
            }
            return 0;
          }}
        >
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptySearchMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label} // cmdk uses this for searching/filtering
                  onSelect={(currentLabel) => { // currentLabel is the label of the selected item
                    // Find the option by label because cmdk gives us the label
                    const selectedOpt = options.find(opt => opt.label.toLowerCase() === currentLabel.toLowerCase());
                    if (selectedOpt) {
                        onSelect(selectedOpt.value); // Pass the actual value (ID)
                    }
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                  {option.document && <span className="ml-2 text-xs text-muted-foreground">({option.document})</span>}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
