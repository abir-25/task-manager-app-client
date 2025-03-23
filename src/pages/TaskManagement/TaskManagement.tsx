import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  GET_TASK_LIST,
  taskQueryService,
} from "@/service/queries/task.queries";
import { useModal } from "@ebay/nice-modal-react";
import {
  PlusCircle,
  CalendarIcon,
  DeleteIcon,
  ArrowUpDown,
} from "lucide-react";
import { CreateTaskModal } from "./components/CreateTaskModals/CreateTaskModal";
import { TaskListSkeleton } from "./components/TaskSkeletons/TaskListSkeleton";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { StatusEnum, TaskInfo, TaskList } from "@/types/types";
import dayjs from "dayjs";
import { Input } from "@/components/ui/input";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
  DragOverlay,
} from "@dnd-kit/core";
import TaskContainer from "./components/TaskContainer";
import { appQueryClient } from "@/lib/reactQueryClient";
import Task from "./components/Task";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const TaskManagement = () => {
  const [searchKey, setSearchKey] = useState<string>();
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [taskListData, setTaskListData] = useState<TaskList>();
  const [activeId, setActiveId] = useState<TaskInfo | undefined>();
  const [resetFilter, setResetFilter] = useState<boolean>(false);
  const [titleSortingAsc, setTitleSortingAsc] = useState(false);
  const [titleSortingDesc, setTitleSortingDesc] = useState(false);
  const [dueDateSortingAsc, setDueDateSortingAsc] = useState(false);
  const [dueDateSortingDesc, setDueDateSortingDesc] = useState(false);

  const createTaskModal = useModal(CreateTaskModal);
  const { data: taskList, isLoading } = taskQueryService.useGetTaskList({
    status: selectedStatus,
    dueDate: selectedDate,
    search: searchKey,
  });

  const { mutate: updateTaskPosition } =
    taskQueryService.useUpdateTaskPosition();

  useEffect(() => {
    if (taskList) {
      setTaskListData(taskList);
    }
  }, [taskList]);
  console.log(taskList);

  const handleSortChange = (sortType: string) => {
    setTitleSortingAsc(sortType === "titleAsc");
    setTitleSortingDesc(sortType === "titleDesc");
    setDueDateSortingAsc(sortType === "dueAsc");
    setDueDateSortingDesc(sortType === "dueDesc");

    setTaskListData((prev) => sortTasks(prev));
  };

  const sortTasks = (tasks: TaskList | undefined): TaskList | undefined => {
    if (!tasks) return undefined;

    return {
      todo: [...tasks.todo].sort((a, b) => sortingLogic(a, b)),
      inProgress: [...tasks.inProgress].sort((a, b) => sortingLogic(a, b)),
      done: [...tasks.done].sort((a, b) => sortingLogic(a, b)),
    };
  };

  const sortingLogic = (a: TaskInfo, b: TaskInfo) => {
    const aFirstChar = a.name.charAt(0).toLowerCase();
    const bFirstChar = b.name.charAt(0).toLowerCase();

    if (titleSortingAsc) {
      return aFirstChar.localeCompare(bFirstChar);
    }
    if (titleSortingDesc) {
      return bFirstChar.localeCompare(aFirstChar);
    }

    if (dueDateSortingAsc) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (dueDateSortingDesc) {
      return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
    }

    return 0;
  };

  const prevFilters = useRef({ searchKey, selectedStatus, selectedDate });

  useEffect(() => {
    const isReset =
      searchKey === "" && selectedStatus === "all" && selectedDate === "";

    if (isReset) {
      setResetFilter(false);
    } else if (
      prevFilters.current.searchKey !== searchKey ||
      prevFilters.current.selectedStatus !== selectedStatus ||
      prevFilters.current.selectedDate !== selectedDate
    ) {
      setResetFilter(true);
    }

    prevFilters.current = { searchKey, selectedStatus, selectedDate };
  }, [searchKey, selectedStatus, selectedDate]);

  const handleResetFilter = () => {
    setSelectedStatus("all");
    setSelectedDate("");
    setSearchKey("");
  };

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

  function handleDragStart(event: any) {
    const { active } = event;
    const { id } = active;
    if (taskListData && id) {
      const foundTask = Object.values(taskListData)
        .flat()
        .find((task) => task.id === id);
      setActiveId(foundTask);
    }
  }

  function findContainer(id: number) {
    if (taskListData && id) {
      const container = Object.keys(taskListData).find((key) =>
        taskListData[key as keyof TaskList]?.find((task) => task.id === id)
      );
      if (container) {
        return container;
      } else {
        return Object.keys(taskListData).find((key) => key === String(id));
      }
    }
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!active || !over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer) return;

    setTaskListData((prev: TaskList | undefined) => {
      if (!prev) return prev;

      const updatedTaskList = { ...prev };
      const activeGroup = [
        ...updatedTaskList[activeContainer as keyof TaskList],
      ];
      const overGroup =
        activeContainer === overContainer
          ? activeGroup
          : [...updatedTaskList[overContainer as keyof TaskList]];

      const activeIndex = activeGroup.findIndex((task) => task.id === activeId);
      if (activeIndex === -1) return prev;

      const [movedTask] = activeGroup.splice(activeIndex, 1);

      const overIndex = overGroup.findIndex((task) => task.id === overId);
      const newIndex = overIndex >= 0 ? overIndex : overGroup.length;

      overGroup.splice(newIndex, 0, movedTask);

      return {
        ...updatedTaskList,
        [activeContainer]: activeGroup,
        [overContainer]: overGroup,
      };
    });
    setActiveId(undefined);
    if (activeContainer !== overContainer || activeId !== overId) {
      updateTaskPosition(
        { activeId, overId },
        {
          onSuccess: () => {
            appQueryClient.invalidateQueries({ queryKey: [GET_TASK_LIST] });
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
            value={searchKey}
            onChange={(e) => {
              setSearchKey(e.target.value);
              debounceSearch(e.target.value);
            }}
          />
        </div>

        <div className="rounded-sm flex items-center border-1 ml-0 md:ml-2 py-[7px] px-2 cursor-pointer">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ArrowUpDown className="ml-auto h-5 w-5 opacity-50 cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuCheckboxItem
                checked={titleSortingAsc}
                onCheckedChange={() => handleSortChange("titleAsc")}
              >
                Sort Ascending By Title
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={titleSortingDesc}
                onCheckedChange={() => handleSortChange("titleDesc")}
              >
                Sort Descending By Title
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={dueDateSortingAsc}
                onCheckedChange={() => handleSortChange("dueAsc")}
              >
                Sort Ascending By Due Date
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={dueDateSortingDesc}
                onCheckedChange={() => handleSortChange("dueDesc")}
              >
                Sort Descending By Due Date
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {resetFilter && (
          <div
            className="rounded-sm flex items-center border-1 ml-0 md:ml-2 py-[6px] px-2 cursor-pointer"
            onClick={handleResetFilter}
          >
            <DeleteIcon className="ml-auto h-5 w-5 opacity-50" />
            <span className="ml-1">Reset</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <TaskListSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <DndContext
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            sensors={sensors}
          >
            <TaskContainer id="todo" tasks={taskListData?.todo || []} />
            <TaskContainer
              id="inProgress"
              tasks={taskListData?.inProgress || []}
            />
            <TaskContainer id="done" tasks={taskListData?.done || []} />
            <DragOverlay>
              {activeId ? <Task task={activeId} key={activeId.id} /> : null}
            </DragOverlay>
          </DndContext>
        </div>
      )}
    </div>
  );
};
