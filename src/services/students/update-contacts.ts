import { axiosNestGa } from "@/lib/axios-nest-ga";
export type UpdateContactsPayload = {
  codigoMatricula: number;
  email: string;
  contacto: string;
  contactoAlternativo: string;
};
export async function updateContacts(data: UpdateContactsPayload) {
  const response = await axiosNestGa.put(`/students/contactos`, data);
  return response.data;
}