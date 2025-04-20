import React, { forwardRef, ReactNode, useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { CommandGroup, CommandInput, CommandItem, CommandList } from "./command";
import { Skeleton } from "./skeleton";

export type Option = {
  value: string;
  label: string;
  [key: string]: string;
};

type AutoCompleteProps = {
  options: Array<Option>;
  emptyMessage: string;
  value?: Option;
  onValueChange?: (value: Option) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  showClearButton?: boolean;
  renderOption?: (option: Option) => ReactNode;
  renderSelectedValue?: (option: Option) => ReactNode;
};

const AutoComplete = forwardRef<HTMLInputElement, AutoCompleteProps>((
  {
    options,
    placeholder,
    emptyMessage,
    value,
    onValueChange,
    disabled,
    isLoading = false,
    className,
    showClearButton = true,
    renderOption,
    renderSelectedValue,
  },
  ref,
) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState<Option | undefined>(value);
  const [inputValue, setInputValue] = useState<string>(value?.label ?? "");

  useEffect(() => {
    setSelected(value);
    setInputValue(value?.label ?? "");
  }, [value]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (!input) {
        return;
      }

      if (!isOpen) {
        setOpen(true);
      }

      if (event.key === "Enter" && input.value.trim() !== "") {
        const exactMatches = options.filter((option) => option.label.toLowerCase() === input.value.trim().toLowerCase());

        if (exactMatches.length >= 1) {
          setSelected(exactMatches[0]);
          onValueChange?.(exactMatches[0]);
          setOpen(false);
        }
      }

      if (event.key === "Escape") {
        input.blur();
      }
    },
    [isOpen, options, onValueChange],
  );

  const handleBlur = useCallback(() => {
    setOpen(false);
    setInputValue(selected?.label ?? "");
  }, [selected]);

  const handleSelectOption = useCallback(
    (selectedOption: Option) => {
      setInputValue(selectedOption.label);
      setSelected(selectedOption);
      onValueChange?.(selectedOption);
      setOpen(false);

      setTimeout(() => {
        inputRef?.current?.blur();
      }, 0);
    },
    [onValueChange],
  );

  const handleClearSelection = useCallback(() => {
    const emptyOption: Option = { value: "", label: "" };
    setSelected(undefined);
    setInputValue("");
    onValueChange?.(emptyOption);
    inputRef.current?.focus();
  }, [onValueChange]);

  const handleScrollCapture = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }, []);

  const handleCommandClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const SelectedValueDisplay = () => {
    if (!selected) {
      return null;
    }

    if (renderSelectedValue) {
      return <div className="flex-1 overflow-hidden text-ellipsis">
        {renderSelectedValue(selected)}
      </div>;
    }

    return <div className="flex-1 overflow-hidden text-ellipsis capitalize">
      {selected.label}
    </div>;
  };

  return (
    <CommandPrimitive onKeyDown={handleKeyDown}>
      <div className="relative" onClick={handleCommandClick}>
        {selected && renderSelectedValue ? (
          <div className="flex items-center border rounded-md pl-3 pr-8 py-2 h-10 bg-white dark:bg-slate-800 relative capitalize">
            <SelectedValueDisplay />
            {showClearButton && (
              <Button
                type="button"
                variant={"icon"}
                size={"icon"}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-600"
                onClick={handleClearSelection}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : (
          <>
            <CommandInput
              ref={ref}
              value={inputValue}
              onValueChange={isLoading ? undefined : setInputValue}
              onBlur={handleBlur}
              onFocus={() => setOpen(true)}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(className, "capitalize")}
              showBorder
            />
            {selected && showClearButton && (
              <Button
                type="button"
                size={"icon"}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-600"
                onClick={handleClearSelection}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </>
        )}
      </div>

      <div className={cn("relative", isOpen ? "mt-1" : "mt-0", className)}>
        {isOpen && (
          <div
            className="fixed inset-0 z-40 bg-transparent"
            onMouseDown={() => {
              setOpen(false);
            }}
          />
        )}
        <div
          className={cn(
            "absolute top-0 z-50 w-full rounded-xl border border-input bg-white dark:bg-slate-800 shadow outline-none animate-in fade-in-0 zoom-in-95",
            isOpen ? "block" : "hidden",
          )}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="max-h-[300px] overflow-y-auto" onScrollCapture={handleScrollCapture}>
            <CommandList
              className="h-full rounded-lg capitalize bg-white dark:bg-slate-800"
              onMouseDown={(e) => {
                e.preventDefault();
              }}
            >
              {isLoading && (
                <CommandPrimitive.Loading>
                  <div className="p-1">
                    <Skeleton className="h-8 w-full" />
                  </div>
                </CommandPrimitive.Loading>
              )}
              {!isLoading && options.length > 0 && (
                <CommandGroup>
                  {options.map((option) => {
                    const isSelected = selected?.value === option.value;
                    return (
                      <CommandItem
                        key={option.value}
                        value={option.label}
                        onMouseDown={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                        }}
                        onSelect={() => handleSelectOption(option)}
                        className={cn("flex w-full items-center gap-2 ", !isSelected ? "pl-8" : null)}
                      >
                        {isSelected && <Check className="w-4" />}
                        {renderOption ? renderOption(option) : option.label}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}
              {!isLoading && options.length === 0 && (
                <CommandPrimitive.Empty className="select-none rounded-sm px-2 py-3 text-center text-sm">
                  {emptyMessage}
                </CommandPrimitive.Empty>
              )}
            </CommandList>
          </div>
        </div>
      </div>
    </CommandPrimitive>
  );
});

AutoComplete.displayName = "AutoComplete";

export { AutoComplete };
