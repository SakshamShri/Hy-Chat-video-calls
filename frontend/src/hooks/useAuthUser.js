import React from 'react'
import { useQuery } from '@tanstack/react-query';
import { getAuthUser } from '../lib/api.js';

const useAuthUser = () => {
    const authUser = useQuery({
      queryKey: ["authUser"],
      queryFn: getAuthUser,
      retry: 0,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
    return {isLoading : authUser.isLoading, authUser: authUser.data?.user}
}

export default useAuthUser
