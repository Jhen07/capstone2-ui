export interface Doctor {
    doc_id: number;
    id?: number;
    doc_name: string;
    contact_no: string;
    schedules: string;
    specialization: string;
    archived: number;
    created_by: number;
    updated_by: number;
    created_at?: string;
    updated_at?: string;
}

export const initDoc: Doctor = {
    doc_name: '',
    contact_no: '',
    schedules: '',
    specialization: '',
    doc_id: 0,
    archived: 0,
    created_by: 0,
    updated_by: 0,
};
