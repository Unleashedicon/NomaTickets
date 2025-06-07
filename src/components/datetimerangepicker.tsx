"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type DateTimeRangePickerProps = React.HTMLAttributes<HTMLDivElement> & {
  date: DateRange | undefined
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
  startTime: string
  setStartTime: React.Dispatch<React.SetStateAction<string>>
  endTime: string
  setEndTime: React.Dispatch<React.SetStateAction<string>>
}

export function DateTimeRangePicker({
  className,
  date,
  setDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
}: DateTimeRangePickerProps) {
  const [timeDropdownOpen, setTimeDropdownOpen] = React.useState(false)

  const toggleDropdown = () => setTimeDropdownOpen(!timeDropdownOpen)
  const closeDropdown = () => setTimeDropdownOpen(false)
  const handleSaveTime = () => closeDropdown()

  const formatDateRangeText = () => {
    if (!date?.from) return "Pick a date range"
    if (date.to) {
      return `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}`
    }
    return format(date.from, "LLL dd, y")
  }

return (
  <div className={cn("flex flex-col gap-4", className)}>
      {/* Date range picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-5 w-5" />
            {formatDateRangeText()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
<Calendar
  initialFocus
  mode="range"
  defaultMonth={date?.from}
  selected={date}
  onSelect={setDate}
  numberOfMonths={2}
  modifiersClassNames={{
    selected: "bg-blue-500 text-white",       // Start and end dates
    range_middle: "bg-blue-100",              // 👈 This is the in-between shadow
  }}
/>
        </PopoverContent>
      </Popover>
      
    {/* Time picker dropdown */}
    <div className="relative">
      <button
        type="button"
        onClick={toggleDropdown}
        className="inline-flex items-center justify-center w-[300px] rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Choose time
        <svg
          className="ml-3 h-2.5 w-2.5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {timeDropdownOpen && (
        <div className="z-10 mt-2 w-auto rounded-lg bg-white p-3 shadow-sm dark:bg-gray-700">
          <div className="grid max-w-[16rem] grid-cols-2 gap-4 mb-2 mx-auto">
            {/* Start time input */}
            <div>
              <label htmlFor="start-time" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Start time:
              </label>
              <input
                type="time"
                id="start-time"
                min="00:00"
                max="23:59"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              />
            </div>

            {/* End time input */}
            <div>
              <label htmlFor="end-time" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                End time:
              </label>
              <input
                type="time"
                id="end-time"
                min="00:00"
                max="23:59"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveTime}
            className="text-blue-700 dark:text-blue-500 text-sm hover:underline"
          >
            Save time
          </button>
        </div>
      )}
    </div>
  </div>
)
}