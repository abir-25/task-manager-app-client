import { EmptyPageState } from "@/components/EmptyPage/EmptyPage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { taskQueryService } from "@/service/queries/task.queries";
import { useModal } from "@ebay/nice-modal-react";
import {
  PlusCircle,
  Users2,
  Calendar as CalIcon,
  CalendarIcon,
} from "lucide-react";
import { CreateTaskModal } from "./components/CreateTaskModals/CreateTaskModal";
import { TaskListSkeleton } from "./components/TaskSkeletons/TaskListSkeleton";
import { useCallback, useState } from "react";
import debounce from "lodash-es/debounce";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusEnum } from "@/types/types";
import dayjs from "dayjs";
import { Input } from "@/components/ui/input";

export const TaskManagement = () => {
  const [searchKey, setSearchKey] = useState<string>();
  const [selectedStatus, setSelectedStatus] = useState<string>();
  const [selectedDate, setSelectedDate] = useState<string>();
  const [calendarOpen, setCalendarOpen] = useState(false);

  const createTaskModal = useModal(CreateTaskModal);
  const { data: taskList, isLoading } = taskQueryService.useGetTaskList({
    status: selectedStatus,
    dueDate: selectedDate,
    search: searchKey,
  });

  const debounceSearch = useCallback(
    debounce((val: string) => {
      setSearchKey(val);
    }, 500),
    []
  );

  const handleCreateTask = () => {
    createTaskModal.show();
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(dayjs(date).format("YYYY-MM-DD"));
  };

  return (
    <div className="container mx-auto py-5 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage tasks in one place
          </p>
        </div>
        <Button onClick={handleCreateTask}>
          <PlusCircle className="h-5 w-5" />
          Create Task
        </Button>
      </div>
      <div className="flex itemc-center justify-start mb-3">
        <div className="mr-3">
          <Select
            value={selectedStatus}
            onValueChange={(value) => setSelectedStatus(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={"all"}>All Status</SelectItem>
                {Object.values(StatusEnum)?.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="mr-3">
          <Popover onOpenChange={setCalendarOpen} open={calendarOpen}>
            <PopoverTrigger
              asChild
              onClick={() => setCalendarOpen((prev) => !prev)}
            >
              <Button
                variant={"outline"}
                className="w-[240px] pl-3 text-left font-normal"
              >
                {selectedDate ? (
                  format(selectedDate, "PPP")
                ) : (
                  <span>Pick due date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate ? new Date(selectedDate) : undefined}
                onSelect={(date) => {
                  if (date) {
                    handleDateSelect(date);
                  }
                  setCalendarOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Input
            type="text"
            placeholder="Search by task name"
            onChange={(e) => debounceSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <TaskListSkeleton />
      ) : taskList?.length === 0 ? (
        <EmptyPageState
          Icon={Users2}
          title="No Task Found"
          description="Create a new task to get started"
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {taskList?.map((task, index) => (
            <div key={index} className="bg-gray-100 p-3 min-h-screen">
              <p className="pt-1 mb-3 text-sm text-slate-500 uppercase">
                {index === 0
                  ? StatusEnum.ToDo
                  : index === 1
                  ? StatusEnum.InProgress
                  : StatusEnum.Done}
                <span className="font-bold ml-1">{task.length}</span>
              </p>
              {task?.map((item) => (
                <Card
                  key={item.id}
                  className="p-2 rounded-sm mb-2 border-0 shadow-xs transition-all duration-300 group"
                >
                  <CardContent className="px-1">
                    <h3 className="text-sm">{item.name}</h3>
                    <p className="text-xs mt-1">{item.description}</p>
                    <p className="text-xs mt-1 flex items-center text-gray-700">
                      <CalIcon size={12} />
                      <span className="ml-1">{item.dueDate}</span>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
