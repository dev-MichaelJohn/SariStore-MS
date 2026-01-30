export type AppResponse = {
    message: string,
    success: boolean,
    statusCode: number,
    errors?: Record<string, unknown>,
    data?: Record<string, unknown>,
    name: string
};
