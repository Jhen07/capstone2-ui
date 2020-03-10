export interface Userlogs {
    id?: string;
    name: string;
    time: string;
    action: string;
    archived: number;
    role: number;
    created_by: number;
    updated_by: number;
}

export const initUserLogs: Userlogs = {
    role: 0,
    name: '',
    time: '',
    action: 'Time in',
    archived: 0,
    created_by: 0,
    updated_by: 0
};
