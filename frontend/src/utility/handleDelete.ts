/**
 * Deletes data from a specific endpoint.
 * Returns true if deletion was successful, false otherwise.
 */
export const deleteData = async (endpoint: string): Promise<boolean> => {
    // browser confirm returns a boolean
    const confirmed: boolean = window.confirm('Are you sure to delete this data?');

    if (!confirmed) {
        return false;
    }

    try {
        const response = await fetch(endpoint, {
            method: 'DELETE', // Using uppercase for standard HTTP methods
            credentials: 'include'
        });

        if (!response.ok) {
            // Log the error status for easier debugging
            console.error(`Delete failed: ${response.status} ${response.statusText}`);
            throw new Error(response.statusText);
        }

        // Even if we don't use 'data', we wait for the JSON if the API sends a message
        await response.json();
        
        return true;
    } catch (error) {
        // In TS, 'error' in a catch block is typed as 'unknown' by default
        if (error instanceof Error) {
            console.error('Fetch Error:', error.message);
        } else {
            console.error('An unknown error occurred during deletion');
        }
        return false;
    }
};