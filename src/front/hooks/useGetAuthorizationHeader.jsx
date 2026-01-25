import { useContext } from 'react';
import { UserContext } from './UserContextProvier';

const useGetAuthorizationHeader = () => {
    const { token } = useContext(UserContext);
    return {
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        }
    };
}

export default useGetAuthorizationHeader;
