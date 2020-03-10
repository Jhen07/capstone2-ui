export interface MedReport {
    id?: number;
    medicine_name: string;
    medicine_type: string;
    action: string;
    quantity: number;
    remaining_stock: number;
    staff: any;
    created_by: number;
    updated_by: number;
}

