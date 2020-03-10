export interface Hospital {
    id?: number;
    hospital_name: string;
    address: string;
    contact_doctors: any[];
    hospital_contact_no: string;
    about: string;
    service_offer: any[];
    archived: number;
    created_by?: number;
    updated_by?: number;
    created_at?: string;
    updated_at?: string;
}

export const initHospital: Hospital = {
    id: 0,
    hospital_name: '',
    address: '',
    hospital_contact_no: '',
    about: '',
    service_offer: [],
    contact_doctors: [],
    archived: 0,
    created_by: 0,
    updated_by: 0,
    created_at: '',
    updated_at: '',
};
