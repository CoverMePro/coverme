export interface IScheduleStaff {
    id: string;
    // TODO: employeeType: string; so we can have groups based on type (full time - part time ect.)
    teams: string[];
    userId: string;
    userName: string;
    title: string;
    employeeType: string;
}
