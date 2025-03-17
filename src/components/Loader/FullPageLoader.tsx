import { DEFAULT_THEME_COLOR } from '@/lib/theme';
import { useGlobalStore } from '@/store/global-store';
import { Building2 } from 'lucide-react';

export const FullPageLoader = () => {
  const orgCurrentColor = useGlobalStore(s => s.currentOrganization?.color);
  const primaryColor = orgCurrentColor || DEFAULT_THEME_COLOR;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 border-4 rounded-full animate-[spin_3s_linear_infinite]" style={{ borderColor: `${primaryColor}33` }} />
          <div className="absolute w-24 h-24 border-4 rounded-full animate-[spin_2s_linear_infinite]" style={{ borderColor: `${primaryColor}66` }} />
          <div className="absolute w-16 h-16 border-4 rounded-full animate-[spin_1s_linear_infinite]" style={{ borderColor: `${primaryColor}99` }} />
        </div>

        <div className="relative z-10 animate-pulse">
          <Building2
            size={40}
            style={{ color: primaryColor }}
            strokeWidth={1.5}
          />
        </div>
      </div>

      <div className="mt-12 space-y-3 text-center">
        <div className="flex items-center justify-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full animate-[bounce_0.6s_infinite_-0.3s]" style={{ backgroundColor: primaryColor }} />
          <span className="inline-block w-2 h-2 rounded-full animate-[bounce_0.6s_infinite_-0.15s]" style={{ backgroundColor: primaryColor }} />
          <span className="inline-block w-2 h-2 rounded-full animate-[bounce_0.6s_infinite]" style={{ backgroundColor: primaryColor }} />
        </div>
        <p className="text-md text-muted-foreground animate-pulse">
          Please wait while we set things up
        </p>
      </div>
    </div>
  );
};
