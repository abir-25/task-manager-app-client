import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  GET_TASK_INFO_BY_ID,
  GET_TASK_LIST,
  taskQueryService,
} from "@/service/queries/task.queries";
import { TaskInfo } from "@/types/types";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { createTaskFormSchema, CreateTaskFormType } from "./types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { CustomCalendarPicker } from "@/components/CustomCalendarPicker/CustomCalendarPicker";

type Props = {
  taskId?: number;
  isUpdating?: boolean;
  initialData?: TaskInfo;
};

const status = ["To Do", "In Progress", "Done"];

export const CreateTaskModal = NiceModal.create(
  ({ taskId, isUpdating = false, initialData }: Props) => {
    const queryClient = useQueryClient();
    const modal = useModal();
    const [calendarOpen, setCalendarOpen] = useState(false);

    const { mutate: createTask, isPending: isCreatePending } =
      taskQueryService.useCreateTask();
    const { mutate: updateTask, isPending: isUpdatePending } =
      taskQueryService.useUpdateTask();

    const form = useForm<CreateTaskFormType>({
      resolver: zodResolver(createTaskFormSchema),
      mode: "onSubmit",
      defaultValues: {
        name: initialData?.name || "",
        description: initialData?.description || "",
        status: initialData?.status || "",
      },
    });

    const handleCloseModal = () => {
      form.reset();
      modal.remove();
    };

    const handleSubmit = (data: CreateTaskFormType) => {
      const onSuccess = () => {
        queryClient.invalidateQueries({
          queryKey: isUpdating
            ? [GET_TASK_INFO_BY_ID, initialData?.id]
            : [GET_TASK_LIST],
        });
        handleCloseModal();
      };

      if (isUpdating && taskId) {
        updateTask({ ...data, id: taskId }, { onSuccess });
        return;
      }

      createTask(data, { onSuccess });
    };

    const isBtnDisabled =
      !form.formState.isDirty || isCreatePending || isUpdatePending;

    return (
      <Dialog open={modal.visible} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isUpdating ? "Update Task" : "Create New Task"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Description <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Status <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      value={String(field.value)}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select supervisor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {status.map((statusItem: string) => (
                          <SelectItem
                            key={statusItem}
                            value={statusItem}
                            className="cursor-pointer"
                          >
                            {statusItem}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      Due Date <span className="text-destructive">*</span>
                    </FormLabel>
                    <Popover
                      modal
                      onOpenChange={setCalendarOpen}
                      open={calendarOpen}
                    >
                      <PopoverTrigger
                        asChild
                        onClick={() => setCalendarOpen((prev) => !prev)}
                      >
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              dayjs(field.value).format("DD MMM, YYYY")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0"
                        align="start"
                        style={{ zIndex: 99999 }}
                      >
                        <CustomCalendarPicker
                          date={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => {
                            field.onChange(dayjs(date).format("YYYY-MM-DD"));
                            setCalendarOpen(false);
                          }}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isBtnDisabled}>
                  {isUpdating ? "Update Task" : "Create Task"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }
);
