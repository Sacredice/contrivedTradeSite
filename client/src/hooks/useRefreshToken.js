import axios from '../api/axios';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const useRefreshToken = () => {
    const { setUserAuthData, setIsLoggedIn, isLoggedIn } = useUser();
    const navigate = useNavigate();

    const refresh = async () => {
        try {
            const response = await axios.get('/refresh', {
                withCredentials: true
            });
            setIsLoggedIn(true)
            setUserAuthData(prev => {
                return { ...prev, accessToken: response.data.accessToken, username: response.data.username, creditBalance: response.data.creditBalance }
                
            });
            return response.data.accessToken;
        } catch (err) {
            console.error(err);
            setIsLoggedIn(false)
            console.log("refresh token error. isLoggedIn: ", isLoggedIn);
        }
        

    }
    return refresh;
};

export default useRefreshToken;