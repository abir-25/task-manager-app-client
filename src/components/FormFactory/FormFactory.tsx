import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { UseFormRegister, UseFormReturn, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type AnyZodItem = z.ZodString | z.ZodNumber | z.ZodDate | z.ZodBoolean;

type BaseField = {
  label: string;
  name: Readonly<string>;
  className?: string;
  placeholder?: string;
  required?: boolean;
  renderChildren?: (props: {
    register: UseFormRegister<any>;
    form: UseFormReturn<any>;
  }) => React.ReactNode;
};

type StringField = BaseField & {
  type: "string";
  defaultValue?: string;
  zod: z.ZodString | z.ZodOptional<z.ZodString>;
};

type StringFieldOptional = BaseField & {
  type: "string_optional";
  defaultValue?: string;
  zod: z.ZodOptional<z.ZodString>;
};

type NumberField = BaseField & {
  type: "number";
  defaultValue?: number;
  zod: z.ZodNumber;
};

type DateField = BaseField & {
  type: "date";
  defaultValue?: Date;
  zod: z.ZodDate;
};

type BooleanField = BaseField & {
  type: "boolean";
  defaultValue?: boolean;
  zod: z.ZodBoolean;
};

type SelectOption = {
  label: string;
  value: string | number;
};

type SelectField = BaseField & {
  type: "select";
  options: SelectOption[];
  defaultValue?: string | number;
  zod: z.ZodString | z.ZodNumber;
};

type FieldTypes = {
  string: string;
  number: number;
  date: Date;
  boolean: boolean;
  string_optional: string | undefined;
  select: string | number;
};

export type FormContainer = {
  classNames: string;
  children: readonly FormField[];
};

export type FormField =
  | StringField
  | NumberField
  | DateField
  | BooleanField
  | StringFieldOptional
  | SelectField;

type InferTypeFromFromFields<T extends Readonly<FormField[]>> = {
  [K in T[number]["name"]]: FieldTypes[T[number]["type"]];
};

type ContainerToType<T extends FormContainer> = {
  [K in T["children"][number]["name"]]: InferTypeFromFromFields<
    T["children"]
  >[K];
};

type Prettify<T> = {
  [K in keyof T]: T[K];
} & NonNullable<unknown>;

type Props<T extends Readonly<FormContainer[]>> = {
  onSubmit: (data: Prettify<ContainerToType<T[number]>>) => void;
  schema: T;
  loading?: boolean;
  submitBtnText?: string;
  onCancel?: () => void;
};

export const FormFactory = <
  Schema extends Readonly<Readonly<FormContainer[]>>
>({
  onSubmit,
  schema,
  loading,
  submitBtnText,
  onCancel,
}: Props<Schema>) => {
  const zodSchema = useMemo(() => {
    const types = schema.reduce<Record<string, AnyZodItem>>((acc, current) => {
      for (const child of current.children) {
        (acc as any)[child.name] = child.zod;
      }
      return acc;
    }, {});

    return z.object(types);
  }, [schema]);

  const defaultValues = useMemo(() => {
    return schema.reduce<Record<string, unknown>>((acc, current) => {
      for (const child of current.children) {
        if (child.defaultValue !== undefined) {
          acc[child.name] = child.defaultValue;
        }
      }
      return acc;
    }, {});
  }, [schema]);

  const form = useForm<ContainerToType<Schema[number]>>({
    resolver: zodResolver(zodSchema),
    defaultValues: defaultValues as any,
  });

  const renderFormControl = (userField: FormField, field: any) => {
    if (userField.type === "select") {
      return (
        <Select
          onValueChange={field.onChange}
          defaultValue={field.value?.toString()}
        >
          <SelectTrigger className={`h-11 ${userField.className}`}>
            <SelectValue placeholder={userField.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {userField.options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value.toString()}
                className="cursor-pointer"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (userField.renderChildren) {
      return userField.renderChildren({ register: form.register, form });
    }

    return (
      <Input
        placeholder={userField.placeholder}
        className={userField.className}
        type={userField.type}
        {...field}
        style={{ borderRadius: 0, height: "44px" }}
      />
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          (data: any) => {
            onSubmit(data);
          },
          (r) => console.log("error", r)
        )}
        className="space-y-6 flex flex-col"
      >
        <div className="flex flex-col gap-4 w-full">
          {schema.map((container, i) => {
            return (
              <div key={i} className={container.classNames}>
                {container.children.map((userField) => {
                  return (
                    <div key={userField.name}>
                      <FormField
                        control={form.control}
                        name={userField.name as any}
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-[#1D2939] text-sm font-medium">
                              {userField.label}{" "}
                              {userField.required && (
                                <span className="text-red-500">*</span>
                              )}
                            </FormLabel>
                            <FormControl>
                              {renderFormControl(userField, field)}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 justify-end pt-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              className="border border-[#D0D5DD]"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
          <Button disabled={loading} type="submit">
            {submitBtnText || "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
