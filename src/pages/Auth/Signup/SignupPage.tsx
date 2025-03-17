import { AuthLayout } from "@/components/Layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authQueryService } from "@/service/queries/auth.queries";
import { useGlobalStore } from "@/store/global-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { signupFormSchema, SignupFormType } from "./types";

export const SignupPage = () => {
  const navigate = useNavigate();
  const { mutate: signupMutation, isPending } = authQueryService.useSignUp();
  const hydrateStore = useGlobalStore((s) => s.hydrateStore);
  const form = useForm<SignupFormType>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (values: SignupFormType) => {
    signupMutation(values, {
      onSuccess: (data) => {
        hydrateStore(data);
        navigate("/");
        return;
      },
    });
  };

  return (
    <AuthLayout title="Create your account">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      className="pl-10 h-10 border border-gray-300 rounded-md focus:border-primary focus:ring focus:ring-primary transition duration-200"
                      placeholder="you@example.com"
                      type="email"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      className="pl-10 pr-10 h-10 border border-gray-300 rounded-md focus:border-primary focus:ring focus:ring-primary transition duration-200"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...field}
                    />
                    <div
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isPending}
          >
            Create account
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center text-sm flex items-center justify-center gap-2">
        <span className="text-gray-500">Already have an account? </span>
        <div className="relative group">
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Log in
          </Link>
          <div className="absolute bottom-0 left-0 w-0 h-px bg-blue-600 transition-all duration-300 group-hover:w-full" />
        </div>
      </div>
    </AuthLayout>
  );
};
