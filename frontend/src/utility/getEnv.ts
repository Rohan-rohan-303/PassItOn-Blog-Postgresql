/**
 * A type-safe helper to fetch Vite environment variables.
 * @param envname - The key of the environment variable (must start with VITE_ for Vite)
 * @returns The value of the environment variable or undefined
 */
export const getEnv = (envname: string): string => {
    const value = import.meta.env[envname];

    if (!value) {
        console.warn(`Environment variable ${envname} is not defined.`);
        return '';
    }

    return value as string;
};
