import { useContext } from 'react';
import { UserContext } from '../hooks/UserContextProvier'

export const useGetAuthorizationHeader = () => {
    const { token } = useContext(UserContext);
    return { 
        headers: {
            "Content-Type": "application/json", 
            'Authorization': `Bearer ${token}` 
        } 
    };
} 