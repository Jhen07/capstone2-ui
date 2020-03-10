export interface Accomplishments {
    id?: number;
    date: string;
    task_description: string;
    problems_encountered: string;
    remarks: string;
    time_in: string;
    time_out: string;
    submitted_by: any;
    archived: number;
    created_by?: number;
    updated_by?: number;
    created_at?: string;
    updated_at?: string;
}

export const initAccomp = {
    id: 0,
    date: '',
    task_description: '',
    problems_encountered: '',
    remarks: '',
    time_in: '',
    time_out: '',
    submitted_by: null,
    archived: 0,
};
