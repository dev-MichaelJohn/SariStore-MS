export const isObjectEmpty = (data: Record<string, unknown>) => {
    const keys = Object.keys(data);
    return keys.length === 0;
};
