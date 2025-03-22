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
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { appQueryClient } from "@/lib/reactQueryClient";

type Props = {
  taskId?: number;
  isUpdating?: boolean;
  initialData?: TaskInfo;
};

const status = ["To Do", "In Progress", "Done"];

export const CreateTaskModal = NiceModal.create(
  ({ taskId, isUpdating = false, initialData }: Props) => {
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
        appQueryClient.invalidateQueries({
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
                    <FormLabel>Description</FormLabel>
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
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
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
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) => {
                            field.onChange(dayjs(date).format("YYYY-MM-DD"));
                            setCalendarOpen(false);
                          }}
                          className="rounded-md border"
                          classNames={{
                            months:
                              "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                            month: "space-y-4",
                            caption:
                              "flex justify-center pt-1 relative items-center",
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
                            head_cell:
                              "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
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
                            IconRight: () => (
                              <ChevronRight className="h-4 w-4" />
                            ),
                          }}
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
