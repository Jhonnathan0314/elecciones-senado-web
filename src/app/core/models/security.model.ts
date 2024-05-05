export class DocumentType {
    id: number = 0;
    prefix: string = '';
    name: string = '';
}

export class Role {
    id: number = 0;
    name: string = "";
}

export class User {
    id: number = 0;
    documentNumber: number = 0;
    documentType: DocumentType = new DocumentType();
    username: string = "";
    name: string = "";
    lastName: string = "";
    role: Role = new Role();
}