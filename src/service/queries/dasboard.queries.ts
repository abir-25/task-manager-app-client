import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../dashboard.service';

export const GET_DASHBOARD_DATA = 'GET_DASHBOARD_DATA';
export const GET_LEAVES_COUNT_THIS_MONTH = 'GET_LEAVES_COUNT_THIS_MONTH';
export const GET_REMAINING_LEAVE_BALANCE = 'GET_REMAINING_LEAVE_BALANCE';
export const GET_TODAYS_LEAVES = 'GET_TODAYS_LEAVES';
export const GET_LATEST_LEAVES = 'GET_LATEST_LEAVES';

const useGetDashboardData = () => {
  return useQuery({
    queryKey: [GET_DASHBOARD_DATA],
    queryFn: () => dashboardService.getDashboardData(),
  });
};

const useGetLeavesCountThisMonth = () => {
  return useQuery({
    queryKey: [GET_LEAVES_COUNT_THIS_MONTH],
    queryFn: () => dashboardService.getLeavesCountThisMonth(),
  });
};

const useGetRemainingLeaveBalance = () => {
  return useQuery({
    queryKey: [GET_REMAINING_LEAVE_BALANCE],
    queryFn: () => dashboardService.getRemainingLeaveBalance(),
  });
};

const useGetTodaysLeaves = () => {
  return useQuery({
    queryKey: [GET_TODAYS_LEAVES],
    queryFn: () => dashboardService.getTodaysLeaves(),
  });
};

const useGetLatestLeaves = () => {
  return useQuery({
    queryKey: [GET_LATEST_LEAVES],
    queryFn: () => dashboardService.getLatestLeave(),
  });
};

export const dashboardQueries = {
  useGetDashboardData,
  useGetLeavesCountThisMonth,
  useGetRemainingLeaveBalance,
  useGetTodaysLeaves,
  useGetLatestLeaves,
};
