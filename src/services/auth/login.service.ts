import { axiosApexGa } from "@/lib/axios-apex-ga";

export type LoginPayload = {
  username: string;
  password: string;
};

export type LoginResponse = {
  codresposta: number;
  msgresposta: string;
  token: string;
  user_id: string;
  hash: string;
  username: string;
};
export async function loginService(
  payload: LoginPayload,
): Promise<LoginResponse> {
  const { data } = await axiosApexGa.post("/ga/autentication/login", payload);
  return data;
}
