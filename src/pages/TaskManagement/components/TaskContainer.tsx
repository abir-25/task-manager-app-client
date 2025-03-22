import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import Task from "./Task";
import { StatusEnum, TaskInfo } from "@/types/types";

type TaskListProps = {
  id: string;
  tasks: TaskInfo[] | undefined;
};

export default function TaskContainer(props: TaskListProps) {
  const { id, tasks } = props;
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    tasks &&
    tasks.length > 0 && (
      <SortableContext
        id={String(id)}
        items={tasks}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef} key={id} className="bg-gray-100 p-3 min-h-screen">
          <p className="pt-1 mb-3 text-sm text-slate-500 uppercase">
            {id === "toDo"
              ? StatusEnum.ToDo
              : id === "inProgress"
              ? StatusEnum.InProgress
              : StatusEnum.Done}
            <span className="font-bold ml-1">{tasks?.length}</span>
          </p>
          {tasks?.map((task) => (
            <Task task={task} key={task.id} />
          ))}
        </div>
      </SortableContext>
    )
  );
}
