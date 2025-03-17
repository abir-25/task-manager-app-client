import { FC, PropsWithChildren } from "react";

type Props = {
  title?: string;
  subtitle?: string;
}

export const AuthLayout: FC<PropsWithChildren<Props>> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            {
              title &&
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                {title}
              </h1>
            }
            {subtitle && (
              <p className="text-sm text-gray-500">
                {subtitle}
              </p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
