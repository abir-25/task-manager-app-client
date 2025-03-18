import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetDashboardDataApiResponse } from "@/types/api-response.types";
import { Wallet } from "lucide-react";

interface LeaveBalanceWidgetProps {
  remainingLeaveBalance: GetDashboardDataApiResponse["remainingLeaveBalance"];
}

export const LeaveBalanceWidget = ({ remainingLeaveBalance }: LeaveBalanceWidgetProps) => {
  return (
    <Card className="shadow-md h-[300px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Wallet className="w-4 h-4 text-primary" />
          Leave Balance
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto">
        {remainingLeaveBalance.length > 0 ? (
          <div className="space-y-3">
            {remainingLeaveBalance.map((leave) => (
              <div
                key={leave.leaveId}
                className="p-3 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors border border-border/50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{leave.title}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-primary">
                      {leave.balance}
                    </span>
                    <span className="text-xs text-muted-foreground">days</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[200px] flex flex-col items-center justify-center text-muted-foreground">
            <Wallet className="w-10 h-10 mb-2 text-primary/40" />
            <p className="font-medium text-sm">No Leave Balance</p>
            <p className="text-xs">No leave balance information available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 