export interface Notes {
    id?: number;
    text: string;
    type?: string;
    created_by?: number;
    updated_by?: number;
    staff_id?: number;
    stadd_name?: string;
    updated_at?: string;
    created_at?: string;
    isChecked?: boolean;
}

export const initNote: Notes = {
    text: '',
    created_by: 0,
    updated_by: 0,
};

