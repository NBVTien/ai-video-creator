import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api-client";
import { useRouter } from "next/navigation";

export type LoginCredentials = {
  username: string;
  password: string;
};

export type RegisterCredentials = {
  username: string;
  email: string;
  password: string;
};

export const useLogin = () => {
  const router = useRouter();
  
  return useMutation({
    mutationFn: (data: LoginCredentials) => authApi.login(data),
    onSuccess: (data) => {
      localStorage.setItem("token", data.access_token);
      router.push("/");
    },
  });
};

export const useRegister = () => {
  const router = useRouter();
  
  return useMutation({
    mutationFn: (data: RegisterCredentials) => authApi.register(data),
    onSuccess: () => {
      router.push("/login");
    },
  });
};
