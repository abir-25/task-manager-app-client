import { EmptyPageState } from "@/components/EmptyPage/EmptyPage";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { taskQueryService } from "@/service/queries/task.queries";
import { useModal } from "@ebay/nice-modal-react";
import { PlusCircle, Users2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CreateTaskModal } from "./components/CreateTaskModals/CreateTaskModal";
import { TaskListSkeleton } from "./components/TaskSkeletons/TaskListSkeleton";

export const TaskManagement = () => {
  const navigate = useNavigate();
  const createTaskModal = useModal(CreateTaskModal);
  const { data: taskList, isLoading } = taskQueryService.useGetTaskList({
    status: "To Do",
    dueDate: "2025/03/10",
  });

  const handleCreateTask = () => {
    createTaskModal.show();
  };

  return (
    <div className="container mx-auto py-8 px-4">
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

      {isLoading ? (
        <TaskListSkeleton />
      ) : taskList?.length === 0 ? (
        <EmptyPageState
          Icon={Users2}
          title="No Task Found"
          description="Create a new task to get started"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {taskList?.map((task) => (
            <Card
              key={task.id}
              className="hover:shadow-lg transition-all duration-300 hover:border-primary/50 group"
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="group-hover:text-primary transition-colors">
                    {task.name}
                  </span>
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {task.description}
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-end">
                <Button
                  onClick={() => navigate(`/task/${task.id}`)}
                  variant="outline"
                  size="sm"
                  className="w-max hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
