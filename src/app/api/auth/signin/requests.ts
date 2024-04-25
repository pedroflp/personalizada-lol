import { fetchApi } from "@/utils/fetchApi";
import { SignInResponseDTO } from "./types";

export async function signIn(username: string, password: string): Promise<SignInResponseDTO> {
  try {
    const response = await fetchApi('auth/signin', {
      method: 'POST',
      body: JSON.stringify({username, password}),
    });

    const data = await response.json();
    
    return data;
  } catch (error) {
    return null;
  }
}