import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { TaskInfo } from "@/types/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type TaskInfoProps = {
  task: TaskInfo;
};

export const Task = (props: TaskInfoProps) => {
  const { task } = props;
  const { id, name, description, dueDate } = task;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        key={id}
        className="p-2 rounded-sm mb-2 border-0 shadow-xs transition-all duration-300 group"
      >
        <CardContent className="px-1">
          <h3 className="text-sm">{name}</h3>
          <p className="text-xs mt-1">{description}</p>
          <p className="text-xs mt-2 flex items-center text-gray-700">
            <Calendar size={12} />
            <span className="ml-1">{dueDate}</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Task;
