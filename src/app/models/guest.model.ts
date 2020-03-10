export interface Guest {
    elder_name: string;
    id?: number;
    guest_name: string;
    contact_no: string;
    address: string;
    relationship_id: string;
    relationship_description: string;
    elder_id: number;
    time_in: string;
    time_out: string;
    created_by: number;
    updated_by: number;
    created_at?: any;
    updated_at?: any;
}

export const initialGuests: Guest = {
    guest_name: '',
    contact_no: '',
    address: '',
    relationship_id: '',
    relationship_description: '',
    elder_name: '',
    elder_id: 0,
    time_in: '',
    time_out: '',
    created_by: 0,
    updated_by: 0,
};

