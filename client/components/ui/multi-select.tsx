import * as React from "react";
import { X, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface MultiSelectOption {
  value: string;
  label: string;
  metadata?: Record<string, any>;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  className?: string;
  maxSelected?: number;
}

export function MultiSelect({
  options,
  value = [],
  onValueChange,
  placeholder = "Select options...",
  searchPlaceholder = "Search...",
  emptyText = "No option found.",
  disabled = false,
  className,
  maxSelected,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const selectedOptions = options.filter((option) => value.includes(option.value));

  const handleSelect = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onValueChange?.(value.filter((v) => v !== optionValue));
    } else {
      if (maxSelected && value.length >= maxSelected) {
        return;
      }
      onValueChange?.([...value, optionValue]);
    }
  };

  const handleRemove = (optionValue: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onValueChange?.(value.filter((v) => v !== optionValue));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between min-h-[40px] h-auto", className)}
          disabled={disabled}
        >
          <div className="flex flex-wrap gap-1 flex-1">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((option) => (
                <Badge
                  key={option.value}
                  variant="secondary"
                  className="text-xs h-6"
                >
                  {option.label}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={(e) => handleRemove(option.value, e)}
                  />
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = value.includes(option.value);
                const isDisabled = maxSelected && !isSelected && value.length >= maxSelected;
                
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value)}
                    disabled={isDisabled}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
