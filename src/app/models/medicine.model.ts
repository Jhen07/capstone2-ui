export interface Medicine {
    id?: number;
    medicine_name: string;
    expiration_date: string;
    type_of_medicine_id: number;
    type_of_medicine_description: string;
    qty: number;
    dispense: number;
    buffer: number;
    created_by: number;
    updated_by: number;
    created_at?: any;
    updated_at?: any;
}
