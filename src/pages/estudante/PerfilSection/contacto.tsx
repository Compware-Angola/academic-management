import { CardDescription, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { InputFormField } from "@/components/inputFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Loader2 } from "lucide-react";

const schema = z.object({
  email: z.string().email("Email inválido"),
  telefone: z.string().min(9, "Telefone inválido"),
  telefoneAlternativo: z.string().min(9, "Telefone inválido"),
});

type FormValues = z.infer<typeof schema>;

export function Contacto({
  codigoMatricula,
  value = "contacto",
}: {
  codigoMatricula: number;
  value?: string;
}) {
  // const updateStudent = useUpdateStudent();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      telefone: "",
      telefoneAlternativo: "",
    },
  });

  function onSubmit(values: FormValues) {
    console.log(values);
    // updateStudent.mutateAsync({ codigoMatricula, ...values });
  }

  return (
    <TabsContent value={value} className="space-y-4 px-4">
      <div className="flex items-center gap-2">
        <CardTitle className="text-lg">Contacto</CardTitle>
      </div>
      <CardDescription>
        Atualiza os dados de contacto do estudante.
      </CardDescription>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
              // disabled={updateStudent.isPending}
            >
              {/* {updateStudent.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />A atualizar...
                </>
              ) : (
                "Atualizar"
              )} */}
            </Button>
          </div>
        </form>
      </Form>
    </TabsContent>
  );
}
