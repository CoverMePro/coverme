import { StatusType } from "./Types";

export interface ISickRequest {
    id?: string;
    requestDate?: Date;
    userId?: string;
    shiftId?: string;
    status?: StatusType;
}
