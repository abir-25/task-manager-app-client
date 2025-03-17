import { isTokenValid } from "@/lib/utils";
import { useGlobalStore } from "@/store/global-store";
import { FC, lazy, PropsWithChildren, Suspense } from "react";
import { Navigate } from "react-router-dom";

const RestrictedWhenLoggedIn: FC<PropsWithChildren> = ({ children }) => {
  const jwtToken = useGlobalStore((s) => s.userInfo?.jwToken);
  const isJwtValid = jwtToken ? isTokenValid(jwtToken) : false;
  const isLoggedIn = isJwtValid;

  if (isLoggedIn) {
    return <Navigate replace to="/" />;
  }

  return <>{children}</>;
};

type RouteLazyFactoryProps = {
  factory: () => Promise<{ default: FC }>;
  name: string;
  restrictedWhenLoggedIn?: boolean;
  fallback: NonNullable<React.ReactNode>;
};

export const RouteLazyFactory = ({
  factory,
  fallback,
  name,
  restrictedWhenLoggedIn,
}: RouteLazyFactoryProps) => {
  const Component = lazy(factory);

  const WrappedComp = () => {
    return (
      <>
        {restrictedWhenLoggedIn ? (
          <RestrictedWhenLoggedIn>
            <Suspense fallback={fallback}>
              <Component />
            </Suspense>
          </RestrictedWhenLoggedIn>
        ) : (
          <Suspense fallback={fallback}>
            <Component />
          </Suspense>
        )}
      </>
    );
  };

  WrappedComp.dispayName = name;

  return WrappedComp;
};
