import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar as CalcIcon,
  ChevronLeft,
  ChevronRight,
  Trash,
} from "lucide-react";
import { TaskInfo } from "@/types/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import {
  GET_TASK_LIST,
  optimisticUpdateSubTask,
  taskQueryService,
} from "@/service/queries/task.queries";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import dayjs from "dayjs";
import { Calendar } from "@/components/ui/calendar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { appQueryClient } from "@/lib/reactQueryClient";

type TaskInfoProps = {
  task: TaskInfo;
};

export const Task = (props: TaskInfoProps) => {
  const { task } = props;
  const { id, name, status, description, dueDate } = task;
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [taskName, setTaskName] = useState<string>(name);
  const [taskDescription, setTaskDescription] = useState<string>(description);
  const [taskDueDate, setTaskDueDate] = useState<string>(dueDate);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isDragging ? "grab" : "pointer",
  };

  const { mutate: updateTask } = taskQueryService.useUpdateTask();
  const { mutate: deleteTask } = taskQueryService.useDeleteTask();

  useEffect(() => {
    if (calendarOpen && dueDate !== taskDueDate) {
      handleUpdateInfo();
    }
  }, [taskDueDate]);

  const handleUpdateInfo = () => {
    if (isEditingName && name === taskName) {
      setIsEditingName(false);
      return;
    } else if (isEditingDescription && description === taskDescription) {
      setIsEditingDescription(false);
      return;
    } else if (
      !isEditingName &&
      !isEditingDescription &&
      dueDate === taskDueDate
    ) {
      return;
    }
    setIsEditingName(false);
    setIsEditingDescription(false);
    setCalendarOpen(false);

    const newTask = {
      ...props.task,
      name: taskName,
      description: taskDescription,
      dueDate: taskDueDate,
    };
    optimisticUpdateSubTask(newTask);

    const payload = {
      id,
      name: taskName,
      status,
      dueDate: taskDueDate,
      description: taskDescription,
    };
    updateTask(payload, {
      onSuccess: () => {
        appQueryClient.invalidateQueries({ queryKey: [GET_TASK_LIST] });
      },
    });
  };

  const handleTaskDelete = (id: number) => {
    deleteTask(id, {
      onSuccess: () => {
        appQueryClient.invalidateQueries({ queryKey: [GET_TASK_LIST] });
      },
    });
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        key={id}
        className="p-2 rounded-sm mb-2 border-0 shadow-xs transition-all duration-300 group"
      >
        <CardContent className="px-1 flex items-start">
          <div className="w-90">
            {isEditingName ? (
              <Input
                type="text"
                defaultValue={name}
                onChange={(event) => {
                  setTaskName(event.target.value);
                }}
                onBlur={handleUpdateInfo}
                onKeyDown={(event) => {
                  if (event.key == "Enter") {
                    handleUpdateInfo();
                  }
                }}
                name="name"
                style={{ userSelect: "none" }}
                autoFocus={true}
              />
            ) : (
              <h3
                className="text-sm"
                onDoubleClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setIsEditingName(true);
                }}
              >
                {name}
              </h3>
            )}

            {isEditingDescription ? (
              <Input
                type="text"
                defaultValue={description}
                onChange={(event) => {
                  setTaskDescription(event.target.value);
                }}
                onBlur={handleUpdateInfo}
                onKeyDown={(event) => {
                  if (event.key == "Enter") {
                    handleUpdateInfo();
                  }
                }}
                name="description"
                style={{ userSelect: "none" }}
                autoFocus={true}
              />
            ) : (
              <p
                className="text-xs my-1"
                onDoubleClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setIsEditingDescription(true);
                }}
              >
                {description}
              </p>
            )}

            <Popover modal open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <p
                  className="text-xs mt-2 flex items-center text-gray-700 cursor-pointer"
                  onDoubleClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setCalendarOpen(true);
                  }}
                >
                  <CalcIcon size={12} />
                  <span className="ml-1">{taskDueDate}</span>
                </p>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0"
                align="center"
                side="top"
                sideOffset={10}
                style={{
                  zIndex: 99999,
                  backgroundColor: "#ffffff",
                }}
              >
                <Calendar
                  mode="single"
                  selected={taskDueDate ? new Date(taskDueDate) : undefined}
                  onSelect={(date: any) => {
                    if (date) {
                      setTaskDueDate(dayjs(date).format("YYYY-MM-DD"));
                    }
                  }}
                  className="rounded-md border"
                  classNames={{
                    months:
                      "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                    month: "space-y-4",
                    caption: "flex justify-center pt-1 relative items-center",
                    caption_label: "text-sm font-medium",
                    nav: "space-x-1 flex items-center",
                    nav_button:
                      "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border rounded-md flex items-center justify-center",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell:
                      "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                    row: "flex w-full mt-2",
                    cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                    day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md hover:bg-accent hover:text-accent-foreground",
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
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Trash className="ms-1 cursor-pointer h-4 w-4 opacity-50" />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your taks and remove data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      handleTaskDelete(id);
                    }}
                  >
                    Proceed
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Task;
