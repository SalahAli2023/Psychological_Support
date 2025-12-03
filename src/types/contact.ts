export interface Contact {
    id: number;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message_type: 'inquiry' | 'complaint' | 'suggestion' | 'support' | 'other';
    message: string;
    status: 'new' | 'in_progress' | 'resolved' | 'closed';
    admin_notes?: string;
    created_at: string;
    updated_at: string;
}

export interface ContactFormData {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message_type: string;
    message: string;
}

export interface ContactStats {
    total: number;
    new: number;
    in_progress: number;
    resolved: number;
    by_type: Record<string, number>;
}

export interface ContactResponse {
    success: boolean;
    message: string;
    data: Contact;
}

export interface ContactsListResponse {
    success: boolean;
    data: Contact[];
    pagination: {
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
    };
}

export interface ContactDeleteResponse {
    success: boolean;
    message: string;
}