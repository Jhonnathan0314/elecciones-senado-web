export class ErrorMessage {
    code: number = 0;
    title: string = '';
    detail: string = ''

    constructor(error: ErrorMessage) {
        this.code = error.code;
        this.title = error.title;
        this.detail = error.detail;
    }
}

export class ApiResponse<T> {
    data: T;
    error: ErrorMessage;
}