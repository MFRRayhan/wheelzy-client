import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useRole = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { isLoading: roleLoading, data: role } = useQuery({
    queryKey: ["user-role", user?.email],
    queryFn: async () => {
      if (!user?.email) return "user";
      const res = await axiosSecure(`/users/${user.email}/role`);
      return res.data?.role || "user";
    },
    enabled: !!user?.email,
  });

  return { roleLoading, role: role || "user" };
};

export default useRole;
