import { useEffect, useState } from "react";
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { useNavigate } from "react-router-dom";

import { cn } from "../lib/utils"
import { Button } from "../components/ui/Button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../components/ui/Command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/Popover"

    const relations = [
    {
        value: "playerdoctor",
        label: "Player - Doctor",
    },
    // {
    //     value: "sveltekit",
    //     label: "SvelteKit",
    // },
    ]

export function SearchRelation() {

    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
    const navigate = useNavigate();






  return (

    <div className = "w-full p-5 flex justify-center z-10">
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between"
        >
          {value
            ? relations.find((relations) => relations.value === value)?.label
            : "Select relations..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0 bg-white bg-opacity-100">
        <Command>
          <CommandInput placeholder="Search relations..." />
          <CommandList>
            <CommandEmpty>No relations found.</CommandEmpty>
            <CommandGroup>
              {relations.map((relations) => (
                <CommandItem
                  key={relations.value}
                  value={relations.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    navigate(`/relation/${currentValue}`);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === relations.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {relations.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
    </div>
  )
}
