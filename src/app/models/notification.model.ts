export interface Notification {
    id?: number;
    staff_id: number;
    staff_name: string;
    title: string;
    description: string;
    type: string;
    isNew: number;
    created_by?: number;
    updated_by?: number;
}

export const initNotif: Notification = {
    description: '',
    isNew: 1,
    staff_id: 0,
    staff_name: '',
    title: '',
    type: '',
}