import { useEffect, useState } from "react"

export const useFetch = <T>(
    url: string, 
    options: RequestInit = {}, 
    dependencies: any[] = []
) => {
    const [data, setData] = useState<T | undefined>()
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | undefined>()

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchData = async () => {
            setLoading(true)
            try {
                const response = await fetch(url, { ...options, signal })
                
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}, ${response.status}`)
                }

                const responseData: T = await response.json()
                setData(responseData)
                setError(undefined)
            } catch (err) {
                if (err instanceof Error && err.name !== 'AbortError') {
                    setError(err)
                }
            } finally {
                setLoading(false)
            }
        }

        fetchData()

        return () => controller.abort();
        
    }, dependencies)

    return { data, loading, error }
}