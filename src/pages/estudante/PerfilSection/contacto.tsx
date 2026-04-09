import { CardDescription, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { InputFormField } from "@/components/inputFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import {
  useStudentDetail,
  useUpdateContacts,
} from "@/hooks/tudents/use-query-students";
import { useEffect } from "react";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  telefone: z.string().min(9, "Telefone inválido").optional().or(z.literal("")),
  telefoneAlternativo: z
    .string()
    .min(9, "Telefone inválido")
    .optional()
    .or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

type ContactoProps = {
  codigoMatricula: number;
  value?: string;
};

export function Contacto({
  codigoMatricula,
  value = "contacto",
}: ContactoProps) {
  const { data: student, isLoading } = useStudentDetail(codigoMatricula);
  const updateContacts = useUpdateContacts();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: student?.email ?? "",
      telefone: student?.contacto ?? "",
      telefoneAlternativo: student?.contacto_alternativo ?? "",
    },
  });

  useEffect(() => {
    if (student) {
      form.reset({
        email: student.email,
        telefone: student.contacto,
        telefoneAlternativo: student.contacto_alternativo,
      });
    }
  }, [form, student]);

  const watched = form.watch();
  const isDirty =
    student?.email !== watched.email ||
    student?.contacto !== watched.telefone ||
    student?.contacto_alternativo !== watched.telefoneAlternativo;

  if (isLoading) return <div>A carregar dados do estudante...</div>;

  function onSubmit(values: FormValues) {
    updateContacts.mutateAsync({
      codigoMatricula,
      email: student?.email === values.email ? undefined : values.email,
      contacto:
        student?.contacto === values.telefone ? undefined : values.telefone,
      contactoAlternativo:
        student?.contacto_alternativo === values.telefoneAlternativo
          ? undefined
          : values.telefoneAlternativo,
    });
  }

  return (
    <TabsContent value={value} className="space-y-4 px-4">
      <CardTitle className="text-lg">Contacto</CardTitle>
      <CardDescription>
        Atualiza os dados de contacto do estudante.
      </CardDescription>
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.stopPropagation();
            form.handleSubmit(onSubmit)(e);
          }}
          className="space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <InputFormField
                type="email"
                control={form.control}
                name="email"
                placeholder="Email"
                label="Email"
              />
            </div>
            <InputFormField
              control={form.control}
              name="telefone"
              placeholder="+244 923 456 789"
              label="Telefone"
            />
            <InputFormField
              control={form.control}
              name="telefoneAlternativo"
              placeholder="+244 923 456 789"
              label="Telefone Alternativo"
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              className="w-full md:w-auto"
              disabled={updateContacts.isPending || !isDirty}
            >
              {updateContacts.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />A atualizar...
                </>
              ) : (
                "Atualizar"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </TabsContent>
  );
}
