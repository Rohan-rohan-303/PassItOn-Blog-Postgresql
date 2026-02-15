import React, { useState, type ChangeEvent, type FormEvent } from 'react'
import { Input } from './ui/input'
import { useNavigate } from 'react-router-dom'
import { RouteSearch } from '@/utility/RouteName'

const SearchBox: React.FC = () => {
    const navigate = useNavigate()
    

    const [query, setQuery] = useState<string>('')

    const getInput = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value)
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (query.trim()) {
            navigate(RouteSearch(query))
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <Input 
                name="q" 
                value={query} 
                onChange={getInput} 
                placeholder="Search here..." 
                className="h-9 rounded-full bg-gray-50" 
            />
        </form>
    )
}

export default SearchBox