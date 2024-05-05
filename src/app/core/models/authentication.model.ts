import { DocumentType } from "./security.model"

export class LoginRequest {
    username: string = '';
    password: string = '';
}

export class RegisterRequest {
    documentType: DocumentType = new DocumentType();
    documentNumber: number = 0;
    name: string = '';
    lastName: string = '';
    username: string = '';
    password: string = '';
}

export interface AuthResponse {
    token: string
}