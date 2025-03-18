import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GetDashboardDataApiResponse } from "@/types/api-response.types";
import { PieChart as PieChartIcon } from "lucide-react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface MonthlyLeaveUsageProps {
  leavesCountThisMonth: GetDashboardDataApiResponse["leavesCountThisMonth"];
}

// Distinct colors for different leave types
const COLORS = [
  "#22c55e", // Green
  "#3b82f6", // Blue
  "#f97316", // Orange
  "#8b5cf6", // Purple
  "#ec4899", // Pink
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border rounded-lg shadow-lg p-2 text-sm">
        <p className="font-medium">{data.name}</p>
        <p className="text-muted-foreground">{data.value} days</p>
      </div>
    );
  }
  return null;
};

export const MonthlyLeaveUsage = ({ leavesCountThisMonth }: MonthlyLeaveUsageProps) => {
  const chartData = leavesCountThisMonth.map((leave) => ({
    name: leave.title,
    value: leave.count,
  }));

  const totalLeaves = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="shadow-md h-full">
      <CardHeader>
        <div className="flex items-center gap-2 mb-4">
          <PieChartIcon className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Monthly Leave Usage</h2>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 && totalLeaves > 0 ? (
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  dataKey="value"
                  paddingAngle={2}
                >
                  {chartData.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="white"
                      strokeWidth={2}
                      pointerEvents='none'
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={<CustomTooltip />}
                  wrapperStyle={{ outline: "none" }}
                />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  iconType="circle"
                  iconSize={10}
                  formatter={(value: string) => (
                    <span className="text-sm font-medium">{value}</span>
                  )}
                />
                {/* Center Label */}
                <text
                  x="50%"
                  y="45%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-muted-foreground text-sm font-medium"
                >
                  Total Days
                </text>
                <text
                  x="50%"
                  y="55%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-foreground text-2xl font-bold"
                >
                  {totalLeaves}
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[380px] flex flex-col items-center justify-center text-muted-foreground">
            <PieChartIcon className="w-10 h-10 mb-2 text-primary/40" />
            <p className="font-medium text-sm">No Leave Usage Data</p>
            <p className="text-xs">No leave usage records for this month</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 