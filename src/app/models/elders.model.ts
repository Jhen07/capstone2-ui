export interface Elders {
    id: number;
    first_name: string;
    middle_name: string;
    last_name: string;
    nickname: string;
    gender: string;
    image: string;
    nationality: string;
    age: number;
    birth_place: string;
    provincial_address: string;
    birth_date: any;
    sabbath: any;
    civil_status: string;
    date_stay_in_orphanage: any;
    bed_no: number;
    cp_first_name: string;
    cp_middle_name: string;
    cp_surname: string;
    cp_contact_no: string;
    cp_relationship: string;
    cp_nationality: string;
    cp_provincial_add: string;
    cp_work: string;
    oi_phil_health: string;
    oi_sss_id: string;
    oi_senior_citizen_id: string;
    oi_pagibig: string;
    archived: number,
    status: number,
    created_by: number;
    updated_by: number;
    created_at?: any;
    updated_at?: any;
}

export interface MedicalHistory {
    id?: number;
    elder_id: number;
    type: string;
    illness: string;
    description: string;
    assigned_doctor_id: number;
    assigned_doctor_name: string;
    duration_from: any;
    duration_to: any;
    created_by: number;
    updated_by: number;
}

export const initialElder: Elders = {
    id: 0,
    first_name: '',
    middle_name: '',
    last_name: '',
    nickname: '',
    gender: 'Male',
    image: 'assets/images/default.jpeg',
    nationality: '',
    age: 0,
    birth_place: '',
    provincial_address: '',
    birth_date: '',
    sabbath: '',
    civil_status: 'Single',
    date_stay_in_orphanage: '',
    bed_no: 0,
    cp_first_name: '',
    cp_middle_name: '',
    cp_surname: '',
    cp_contact_no: '',
    cp_relationship: '',
    cp_nationality: '',
    cp_provincial_add: '',
    cp_work: '',
    oi_phil_health: '',
    oi_sss_id: '',
    oi_senior_citizen_id: '',
    oi_pagibig: '',
    archived: 0,
    status: 0,
    created_by: 0,
    updated_by: 0
};

export const initalMedHistory: MedicalHistory = {
    elder_id: 0,
    type: 'present',
    illness: '',
    description: '',
    assigned_doctor_id: 0,
    assigned_doctor_name: '',
    duration_from: null,
    duration_to: null,
    created_by: 0,
    updated_by: 0,
};


