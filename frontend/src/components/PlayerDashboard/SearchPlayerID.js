import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/Button"; // Assuming you have a Button component
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/Popover";
import {
  Command,
  CommandList,
  CommandInput,
  CommandItem,
  CommandGroup,
  CommandEmpty,
} from "../../components/ui/Command";
import { Check, ChevronsUpDown } from "lucide-react";

export default function SearchPlayerId({
  selectedPlayerId,
  setSelectedPlayerId,
}) {
  const [players, setPlayers] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await fetch("http://localhost:5000/Players");
        const data = await res.json();
        const playerData = data.map((player) => ({
          value: player.player_id,
          label: `${player.first_name} ${player.last_name}`,
        }));
        setPlayers(playerData);
      } catch (err) {
        console.error("Error fetching players:", err);
      }
    };
    fetchPlayers();
  }, []);

  return (
    <div className="w-full p-5 flex justify-center z-10">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[250px] justify-between">
            {selectedPlayerId
              ? players.find((player) => player.value === selectedPlayerId)
                  ?.label
              : "Select player..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0 bg-white bg-opacity-100">
          <Command>
            <CommandInput placeholder="Search player..." />
            <CommandList>
              <CommandEmpty>No player found.</CommandEmpty>
              <CommandGroup>
                {players.map((player) => (
                  <CommandItem
                    key={player.value}
                    value={player.value}
                    onSelect={(currentValue) => {
                      setSelectedPlayerId(player.value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        selectedPlayerId === player.value
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />
                    {player.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
