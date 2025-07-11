'use client';

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface DateRange {
  from?: Date;
  to?: Date;
}

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
}

export function DateRangePicker({
  value,
  onChange,
  label = "Date Range",
  placeholder = "Pick a date range",
  helperText,
  error = false,
  errorMessage,
  disabled = false,
  className,
  minDate,
  maxDate,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);

  const formatDateForInput = (date: Date | undefined) => {
    if (!date) return "";
    return date.toISOString().split('T')[0];
  };

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return placeholder;
    if (range.from && !range.to) return format(range.from, "MMM dd, yyyy");
    if (range.from && range.to) {
      return `${format(range.from, "MMM dd, yyyy")} - ${format(range.to, "MMM dd, yyyy")}`;
    }
    return placeholder;
  };

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value ? new Date(e.target.value) : undefined;
    onChange?.({ from: newDate, to: value?.to });
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value ? new Date(e.target.value) : undefined;
    onChange?.({ from: value?.from, to: newDate });
  };

  const isInvalidRange = value?.from && value?.to && value.from > value.to;
  const displayError = error || isInvalidRange;
  const displayErrorMessage = isInvalidRange
    ? "End date must be after start date"
    : errorMessage;

  return (
    <div className={cn("grid gap-2", className)}>
      {label && (
        <Label
          htmlFor="date-range-picker"
          className={cn(displayError && "text-destructive")}
        >
          {label}
        </Label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date-range-picker"
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              !value?.from && "text-muted-foreground",
              displayError && "border-destructive focus:ring-destructive"
            )}
            aria-label={`${label}: ${formatDateRange(value)}`}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange(value)}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className={cn(
            "w-auto p-4 rounded-md shadow-md border border-border",
            "bg-white text-black",
            "dark:bg-zinc-900 dark:text-white"
          )}
          align="start"
          side="bottom"
          sideOffset={4}
        >
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="start-date" className="text-sm font-medium">
                Start Date
              </Label>
              <input
                id="start-date"
                type="date"
                value={formatDateForInput(value?.from)}
                onChange={handleFromDateChange}
                disabled={disabled}
                min={minDate ? formatDateForInput(minDate) : undefined}
                max={maxDate ? formatDateForInput(maxDate) : undefined}
                className={cn(
                  "flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background",
                  "bg-white text-black dark:bg-zinc-800 dark:text-white",
                  "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                  "placeholder:text-muted-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50"
                )}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="end-date" className="text-sm font-medium">
                End Date
              </Label>
              <input
                id="end-date"
                type="date"
                value={formatDateForInput(value?.to)}
                onChange={handleToDateChange}
                disabled={disabled}
                min={value?.from ? formatDateForInput(value.from) : minDate ? formatDateForInput(minDate) : undefined}
                max={maxDate ? formatDateForInput(maxDate) : undefined}
                className={cn(
                  "flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background",
                  "bg-white text-black dark:bg-zinc-800 dark:text-white",
                  "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                  "placeholder:text-muted-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50"
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button size="sm" onClick={() => setOpen(false)} className="text-sm">
                Done
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {(helperText || displayErrorMessage) && (
        <p
          className={cn(
            "text-sm",
            displayError ? "text-destructive" : "text-muted-foreground"
          )}
        >
          {displayError ? displayErrorMessage : helperText}
        </p>
      )}
    </div>
  );
}
