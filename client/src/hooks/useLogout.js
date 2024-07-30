import axios from "../api/axios";
import { useUser } from "../context/UserContext";

const useLogout = () => {
    const { setUserAuthData } = useUser();

    const logout = async () => {
        setUserAuthData({});
        try {
            const response = await axios('/logout', {
                withCredentials: true
            });
        } catch (err) {
            console.error(err);
        }
    }

    return logout;
}

export default useLogout