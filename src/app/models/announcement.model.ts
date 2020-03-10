export interface AnnouncementService {
    doctor_name: any;
    id?: number;
    event: string;
    date: string;
    created_by: number;
    updated_by: number;
    created_at?: string;
    updated_at?: string;
}

export const initAnnounce = {
    event: '',
    date: '',
    created_by: 0,
    updated_by: 0,
};
