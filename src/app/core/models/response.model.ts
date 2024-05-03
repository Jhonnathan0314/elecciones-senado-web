export interface ErrorMessage {
    code: number,
    title: string,
    detail: string
}

export interface ApiResponse<T> {
    data: T,
    error: ErrorMessage
}