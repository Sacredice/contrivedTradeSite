import { useCallback } from "react";
import useAxiosPrivate from "./useAxiosPrivate";

const useUserDataReactQuery = () => {
    const axiosPrivate = useAxiosPrivate();

    const getUserProfile = useCallback(async (username) => {
        const response = await axiosPrivate.get(`/${username}`);
        return response.data;
    }, [axiosPrivate]);
    
    const updateUserProfile = useCallback(async ({ username, patchData }) => {
        const response = await axiosPrivate.patch(`/${username}`, patchData);
        return response.data;
    }, [axiosPrivate]);
    
    return { getUserProfile, updateUserProfile }
}

export default useUserDataReactQuery;
