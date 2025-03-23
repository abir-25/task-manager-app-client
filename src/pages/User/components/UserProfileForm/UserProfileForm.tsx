import { GoBackBtn } from "@/components/GoBackBtn/GoBackBtn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  GET_USER_INFO,
  userQueryService,
} from "@/service/queries/user.queries";
import { useGlobalStore } from "@/store/global-store";
import { UserInfo } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { XCircle } from "lucide-react";
import { ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { UpdateUserProfileFormType, updateUserProfileSchema } from "./types";

type UserProfileFormProps = {
  data: UserInfo;
  onCancel: () => void;
};

export const UserProfileForm = ({ data, onCancel }: UserProfileFormProps) => {
  const queryClient = useQueryClient();
  const form = useForm<UpdateUserProfileFormType>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      name: data.name || "",
      phone: data.phone || "",
      profileImg: data.profileImgUrl || null,
    },
  });

  const { mutate: updateUser, isPending } =
    userQueryService.useUpdateUserProfile();
  const updateUserInfo = useGlobalStore((s) => s.updateUserInfo);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1048576) {
        form.setError("profileImg", {
          type: "manual",
          message: "Image size should not exceed 1MB",
        });
        e.target.value = "";
        return;
      }
      form.setValue("profileImg", file, { shouldDirty: true });
      form.clearErrors("profileImg");
    }
  };

  const onSubmit = (values: UpdateUserProfileFormType) => {
    const payload: UpdateUserProfileFormType = { ...values };
    console.log(payload);
    updateUser(payload, {
      onSuccess: (data) => {
        updateUserInfo(data);
        queryClient.invalidateQueries({ queryKey: [GET_USER_INFO] });
        onCancel();
      },
    });
  };

  const isButtonDisabled = !form.formState.isDirty || isPending;

  const watchedProfileImg = form.watch("profileImg");
  const profileImgSrc =
    watchedProfileImg instanceof File
      ? URL.createObjectURL(watchedProfileImg as File)
      : (watchedProfileImg as string) || undefined;

  const watchedName = form.watch("name");
  const displayName = watchedName || data.username || "User";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="h-[250px] bg-gradient-to-br from-primary via-primary/95 to-primary/90 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5" />
        </div>

        <svg
          className="absolute -bottom-px w-full text-slate-50"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            fillOpacity="0.2"
            d="M0,128L34.3,133.3C68.6,139,137,149,206,144C274.3,139,343,117,411,128C480,139,549,181,617,186.7C685.7,192,754,160,823,144C891.4,128,960,128,1029,144C1097.1,160,1166,192,1234,197.3C1302.9,203,1371,181,1406,170.7L1440,160L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"
          />
          <path
            fill="currentColor"
            d="M0,192L34.3,186.7C68.6,181,137,171,206,170.7C274.3,171,343,181,411,192C480,203,549,213,617,202.7C685.7,192,754,160,823,144C891.4,128,960,128,1029,144C1097.1,160,1166,192,1234,186.7C1302.9,181,1371,139,1406,117.3L1440,96L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"
          />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-[170px] relative z-10">
        <div className="flex justify-end mb-6">
          <GoBackBtn onGoback={onCancel} />
        </div>

        <Card className="bg-white/95 backdrop-blur-sm shadow-xl rounded-3xl border-0">
          <CardHeader className="space-y-1 pb-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                  <AvatarImage src={profileImgSrc} className="object-cover" />
                  <AvatarFallback className="text-4xl capitalize">
                    {data.name?.[0] || data?.username[0]}
                  </AvatarFallback>
                </Avatar>
                {profileImgSrc && (
                  <XCircle
                    onClick={() => form.setValue("profileImg", null)}
                    className="absolute top-0 right-0 w-6 h-6 text-red-500 hover:text-red-600 
                               cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300"
                  />
                )}
                <Label
                  htmlFor="profileImage"
                  className="absolute bottom-0 right-0 bg-primary hover:bg-primary/90 
                           text-white rounded-full p-2 cursor-pointer shadow-lg 
                           transition-all duration-300 group-hover:scale-110"
                >
                  <input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </Label>
              </div>
              {form.formState.errors.profileImg && (
                <p className="text-center mt-2 text-destructive">
                  {form.formState.errors.profileImg.message}
                </p>
              )}
              <CardTitle
                className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 
                                  bg-clip-text text-transparent"
              >
                {displayName}
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Update profile information below
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">
                          Name <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="rounded-xl border-gray-200 focus:border-primary/50 
                                     focus:ring-primary/50 transition-all duration-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Phone</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value || ""}
                            className="rounded-xl border-gray-200 focus:border-primary/50 
                                     focus:ring-primary/50 transition-all duration-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-4 pt-6">
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isButtonDisabled}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
