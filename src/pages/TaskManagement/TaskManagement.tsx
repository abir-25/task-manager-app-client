import { EmptyPageState } from "@/components/EmptyPage/EmptyPage";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  GET_TASK_LIST,
  taskQueryService,
} from "@/service/queries/task.queries";
import { useModal } from "@ebay/nice-modal-react";
import { PlusCircle, Users2, CalendarIcon } from "lucide-react";
import { CreateTaskModal } from "./components/CreateTaskModals/CreateTaskModal";
import { TaskListSkeleton } from "./components/TaskSkeletons/TaskListSkeleton";
import { useCallback, useEffect, useState } from "react";
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
import { StatusEnum, TaskList } from "@/types/types";
import dayjs from "dayjs";
import { Input } from "@/components/ui/input";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
} from "@dnd-kit/core";
import TaskContainer from "./components/TaskContainer";
import { appQueryClient } from "@/lib/reactQueryClient";

export const TaskManagement = () => {
  const [searchKey, setSearchKey] = useState<string>();
  const [selectedStatus, setSelectedStatus] = useState<string>();
  const [selectedDate, setSelectedDate] = useState<string>();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [taskListData, setTaskListData] = useState<TaskList>();

  const createTaskModal = useModal(CreateTaskModal);
  const { data: taskList, isLoading } = taskQueryService.useGetTaskList({
    status: selectedStatus,
    dueDate: selectedDate,
    search: searchKey,
  });
  // console.log(taskList);

  const { mutate: updateTaskPosition } =
    taskQueryService.useUpdateTaskPosition();

  useEffect(() => {
    if (taskList) {
      setTaskListData(taskList);
    }
  }, [taskList]);

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

  // function handleDragStart(event: any) {
  //   const { active } = event;
  //   const { id } = active;

  //   setActiveId(id);
  // }
  // console.log(taskListData);

  function findContainer(id: number) {
    if (taskListData && id) {
      // if (id in taskListData) {
      //   return id;
      // }

      return Object.keys(taskListData).find((key) =>
        taskListData[key as keyof TaskList]?.find((task) => task.id === id)
      );
    }
  }

  // function handleDragOver(event: any) {
  //   console.log(4324);
  //   const { active, over, draggingRect } = event;

  //   if (active && over) {
  //     const { id: activeId } = active;
  //     const { id: overId } = over;

  //     // Find the containers
  //     const activeContainer = findContainer(activeId);
  //     const overContainer = findContainer(overId);

  //     if (
  //       !activeContainer ||
  //       !overContainer ||
  //       activeContainer === overContainer
  //     ) {
  //       return;
  //     }

  //     setTaskListData((prev: TaskList | undefined) => {
  //       if (!prev) return prev;
  //       // Get the task lists directly from the object
  //       const activeGroup = prev[activeContainer as keyof TaskList];
  //       const overGroup = prev[overContainer as keyof TaskList];

  //       if (!activeGroup || !overGroup) return prev;

  //       // Find the task being moved
  //       const activeIndex = activeGroup.findIndex(
  //         (task) => task.id === activeId
  //       );
  //       const overIndex = overGroup.findIndex((task) => task.id === overId);

  //       if (activeIndex === -1) return prev; // Ensure the task exists

  //       // Extract the task being moved
  //       const [movedTask] = activeGroup.splice(activeIndex, 1);

  //       let newIndex = overIndex >= 0 ? overIndex : overGroup.length;
  //       newIndex = Math.min(newIndex, overGroup.length); // Ensure index is within bounds

  //       // Insert into the new column
  //       overGroup.splice(newIndex, 0, movedTask);

  //       // Return the updated state object
  //       return {
  //         ...prev,
  //         [activeContainer]: [...activeGroup], // Update source column
  //         [overContainer]: [...overGroup], // Update target column
  //       };
  //     });
  //   }
  // }

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!active || !over) return;

    const { id: activeId } = active;
    const { id: overId } = over;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer) return;

    setTaskListData((prev: TaskList | undefined) => {
      if (!prev) return prev;

      const activeGroup = [...prev[activeContainer as keyof TaskList]];
      const overGroup =
        activeContainer === overContainer
          ? activeGroup
          : [...prev[overContainer as keyof TaskList]];

      const activeIndex = activeGroup.findIndex((task) => task.id === activeId);
      if (activeIndex === -1) return prev;

      const [movedTask] = activeGroup.splice(activeIndex, 1);

      const overIndex = overGroup.findIndex((task) => task.id === overId);
      const newIndex = overIndex >= 0 ? overIndex : overGroup.length;

      overGroup.splice(newIndex, 0, movedTask);

      return {
        ...prev,
        [activeContainer]: activeGroup,
        [overContainer]: overGroup,
      };
    });

    if (activeId !== overId || activeContainer !== overContainer) {
      updateTaskPosition(
        { activeId, overId },
        {
          onSuccess: () => {
            appQueryClient.invalidateQueries({
              queryKey: [GET_TASK_LIST],
            });
          },
        }
      );
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 30,
        delay: 100,
      },
    }),
    useSensor(TouchSensor)
  );

  return (
    <div className="container mx-auto py-5 px-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage tasks in one place
          </p>
        </div>
        <Button onClick={handleCreateTask} className="mt-2 md:mt-0">
          <PlusCircle className="h-5 w-5" />
          Create Task
        </Button>
      </div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-start mb-3">
        <div className="mr-3">
          <Select
            value={selectedStatus}
            onValueChange={(value) => setSelectedStatus(value)}
          >
            <SelectTrigger className="w-90 md:w-[240px]">
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

        <div className="mr-3 mt-2 md:mt-0">
          <Popover onOpenChange={setCalendarOpen} open={calendarOpen}>
            <PopoverTrigger
              asChild
              onClick={() => setCalendarOpen((prev) => !prev)}
            >
              <Button
                variant={"outline"}
                className="w-90 md:w-[240px] pl-3 text-left font-normal"
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

        <div className="mt-2 md:mt-0">
          <Input
            className=" w-90 md:w-[240px]"
            type="text"
            placeholder="Search by task name"
            onChange={(e) => debounceSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <TaskListSkeleton />
      ) : taskListData && Object.keys(taskListData)?.length === 0 ? (
        <EmptyPageState
          Icon={Users2}
          title="No Task Found"
          description="Create a new task to get started"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <DndContext
            collisionDetection={closestCenter}
            // onDragOver={handleDragOver}
            // onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            sensors={sensors}
          >
            <TaskContainer id="toDo" tasks={taskListData?.todo} />
            <TaskContainer id="inProgress" tasks={taskListData?.inProgress} />
            <TaskContainer id="done" tasks={taskListData?.done} />
            {/* {taskListData?.map((tasks, index) => (
              <TaskContainer id={index} tasks={tasks} />
            ))} */}
          </DndContext>
        </div>
      )}
    </div>
  );
};
