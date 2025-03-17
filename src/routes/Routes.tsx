import { FullPageLoader } from "@/components/Loader/FullPageLoader";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RouteLazyFactory } from "./RouteLazyFactory";

const components = {
  LayoutWithSidebarLazy: RouteLazyFactory({
    factory: () =>
      import("../components/Layouts/LayoutWithSidebar").then((m) => ({
        default: m.LayoutWithSidebar,
      })),
    name: "LayoutWithSidebarLazy",
    fallback: <FullPageLoader />,
  }),
  LoginLazy: RouteLazyFactory({
    factory: () =>
      import("@/pages/Auth/LoginPage").then((m) => ({ default: m.LoginPage })),
    name: "LoginLazy",
    restrictedWhenLoggedIn: true,
    fallback: <FullPageLoader />,
  }),
  SignUpLazy: RouteLazyFactory({
    factory: () =>
      import("@/pages/Auth/Signup/SignupPage").then((m) => ({
        default: m.SignupPage,
      })),
    name: "SignUpLazy",
    restrictedWhenLoggedIn: true,
    fallback: <FullPageLoader />,
  }),

  ProfileLazy: RouteLazyFactory({
    factory: () =>
      import("@/pages/Settings/Profile").then((m) => ({ default: m.Profile })),
    name: "ProfileLazy",
    fallback: <FullPageLoader />,
  }),
  TaskManagementLazy: RouteLazyFactory({
    factory: () =>
      import("@/pages/TaskManagement/TaskManagement").then((m) => ({
        default: m.TaskManagement,
      })),
    name: "TeamManagementLzay",
    fallback: <FullPageLoader />,
  }),
  UserProfilePageLazy: RouteLazyFactory({
    factory: () =>
      import("@/pages/User/UserProfilePage").then((m) => ({
        default: m.UserProfilePage,
      })),
    name: "UserProfilePageLazy",
    fallback: <FullPageLoader />,
  }),
};

export const Routes = () => {
  const router = createBrowserRouter([
    // private routes
    {
      path: "/",
      Component: components.LayoutWithSidebarLazy,
      children: [
        {
          path: "/tasks",
          Component: components.TaskManagementLazy,
        },
        {
          path: "/profile-settings",
          Component: components.UserProfilePageLazy,
        },
      ],
    },

    // public routes
    {
      path: "/login",
      Component: components.LoginLazy,
    },
    {
      path: "/signup",
      Component: components.SignUpLazy,
    },
    {
      path: "*",
      element: <div className="h-screen bg-white">404, not found</div>,
    },
  ]);

  return <RouterProvider router={router} />;
};
