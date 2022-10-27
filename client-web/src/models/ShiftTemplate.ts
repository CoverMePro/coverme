export interface IShiftTemplate {
    id?: string;
    name: string;
    startTimeHours: number;
    startTimeMinutes: number;
    duration: string;
}

export interface IShiftTemplateDisplay {
    id?: string;
    name: string;
    startTime: string;
    duration: string;
}
