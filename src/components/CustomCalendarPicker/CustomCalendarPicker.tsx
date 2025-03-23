import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface CustomCalendarPickerProps {
  date?: Date;
  onSelect?: (date?: Date) => void;
  disabled?: (date: Date) => boolean;
  className?: string;
}

export function CustomCalendarPicker({
  date,
  onSelect,
  disabled,
  className,
}: CustomCalendarPickerProps) {
  const [calendar, setCalendar] = useState<Date>(date || new Date());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const handleMonthChange = (month: string) => {
    const newDate = new Date(calendar);
    newDate.setMonth(monthNames.indexOf(month));
    setCalendar(newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = new Date(calendar);
    newDate.setFullYear(parseInt(year));
    setCalendar(newDate);
  };

  return (
    <div className={cn("p-3 shadow-sm", className)}>
      <div className="flex gap-4 mb-3">
        <Select
          value={monthNames[calendar.getMonth()]}
          onValueChange={handleMonthChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent className="max-h-[200px] overflow-y-auto" style={{ zIndex: 99999 }}>
            {monthNames.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={calendar.getFullYear().toString()}
          onValueChange={handleYearChange}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent className="max-h-[200px] overflow-y-auto" style={{ zIndex: 99999 }}>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Calendar
        mode="single"
        selected={date}
        onSelect={onSelect}
        month={calendar}
        onMonthChange={setCalendar}
        disabled={disabled}
        className="rounded-md border"
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
            "border rounded-md flex items-center justify-center"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: cn(
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
            "rounded-md hover:bg-accent hover:text-accent-foreground"
          ),
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside: "text-muted-foreground opacity-50",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
        }}
        components={{
          IconLeft: () => <ChevronLeft className="h-4 w-4" />,
          IconRight: () => <ChevronRight className="h-4 w-4" />,
        }}
      />
    </div>
  );
} 