"use client"

import * as React from "react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DateRangePicker, DateRange } from "@/components/ui/calendar"

interface DateTimeRangePickerProps {
  date: DateRange | undefined
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
  startTime: string
  setStartTime: React.Dispatch<React.SetStateAction<string>>
  endTime: string
  setEndTime: React.Dispatch<React.SetStateAction<string>>
}

export function DateTimeRangePicker({
  date,
  setDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
}: DateTimeRangePickerProps) {
  const [timeDropdownOpen, setTimeDropdownOpen] = React.useState(false)

  const toggleTimeDropdown = () => setTimeDropdownOpen((prev) => !prev)
  const closeTimeDropdown = () => setTimeDropdownOpen(false)
  const clearDate = () => setDate(undefined)

  const formattedRange = () => {
    if (!date?.from) return "Pick a date range"
    if (date?.to) {
      return `${format(date.from, "PPP")} – ${format(date.to, "PPP")}`
    }
    return format(date.from, "PPP")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Date & Time Range</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Date Range Picker */}
        <DateRangePicker
          value={date}
          onChange={setDate}
          label="Event Dates"
          placeholder="Select a date range"
          helperText="Choose the event's start and end dates"
        />

        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={clearDate}>
            Clear Dates
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={toggleTimeDropdown}>
            {timeDropdownOpen ? "Hide Time Picker" : "Set Time"}
          </Button>
        </div>

        {/* Time Range Picker */}
        {timeDropdownOpen && (
          <div className="rounded-lg border p-4 space-y-4 bg-muted">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="start-time" className="text-sm font-medium">
                  Start Time
                </label>
                <input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                />
              </div>
              <div>
                <label htmlFor="end-time" className="text-sm font-medium">
                  End Time
                </label>
                <input
                  id="end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="default" size="sm" onClick={closeTimeDropdown}>
                Done
              </Button>
            </div>
          </div>
        )}

        {/* Preview Summary */}
        {date?.from && (
          <div className="p-3 rounded-md bg-muted text-sm">
            <p>
              <span className="font-medium">Date:</span> {formattedRange()}
            </p>
            <p>
              <span className="font-medium">Time:</span>{" "}
              {startTime || "--:--"} to {endTime || "--:--"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
