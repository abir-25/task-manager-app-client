import { LucideIcon } from "lucide-react";

type Props = {
  Icon: LucideIcon;
  title: string;
  description?: string;
}

export const EmptyPageState = ({ Icon, title, description }: Props) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center py-12">
      <div className="bg-muted/30 p-4 rounded-full">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      {description &&
        <p className="text-muted-foreground text-center mt-1">
          {description}
        </p>
      }
    </div>
  );
}; 