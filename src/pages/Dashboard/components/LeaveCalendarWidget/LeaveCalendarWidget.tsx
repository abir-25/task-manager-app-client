import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LeaveRequestDayEntity } from "@/types/api-response.types";
import { addDays, format as formatDate } from "date-fns";
import { getDay } from "date-fns/getDay";
import { enUS } from 'date-fns/locale';
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { CalendarDays } from "lucide-react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./leave-calendar-styles.css";

interface LeaveCalendarWidgetProps {
  latestLeaves: LeaveRequestDayEntity[][] | undefined;
}

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format: formatDate,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface EventType {
  title: string;
  start: Date;
  end: Date;
  name: string;
  leaveType: string;
  isHalfDay: boolean;
}

const EventPopoverContent = ({ event }: { event: EventType }) => (
  <div className="w-full space-y-3">
    <div>
      <h4 className="text-xs font-medium text-muted-foreground">Employee</h4>
      <p className="text-sm font-semibold mt-0.5">{event.name}</p>
    </div>
    <div>
      <h4 className="text-xs font-medium text-muted-foreground">Date</h4>
      <p className="text-sm font-medium mt-0.5">
        {event.start.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
    </div>
    <div className="flex items-center justify-between">
      <div>
        <h4 className="text-xs font-medium text-muted-foreground">Leave Type</h4>
        <p className="text-sm font-medium mt-0.5">{event.leaveType}</p>
      </div>
      <Badge variant="default" className="text-xs">
        {event.isHalfDay ? "Half Day" : "Full Day"}
      </Badge>
    </div>
  </div>
);

export const LeaveCalendarWidget = ({ latestLeaves }: LeaveCalendarWidgetProps) => {

  const events = latestLeaves?.flat().map((leave) => ({
    title: leave.name,
    start: new Date(leave.leaveDate),
    end: new Date(leave.leaveDate),
    name: leave.name,
    leaveType: leave.title,
    isHalfDay: leave.isHalfDay === 1,
  })) || [];



  const today = new Date();
  const sevenDaysLater = addDays(today, 7);
  const dateRange = `Today - ${formatDate(sevenDaysLater, 'MMM d, yyyy')}`;

  return (
    <Card className="shadow-md h-full">
      <CardContent className="p-6">
        <div className="flex flex-row items-center gap-0 mb-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Latest Leaves</h2>
          </div>
          <p className="text-sm text-muted-foreground pl-1">({dateRange})</p>
        </div>
        <div>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            className="compact-calendar"
            views={["month"]}
            toolbar={false}
            components={{
              event: (props) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="calendar-event w-full truncate">
                      {props.title}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="p-4" align="start">
                    <EventPopoverContent event={props.event as EventType} />
                  </PopoverContent>
                </Popover>
              ),
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}; 