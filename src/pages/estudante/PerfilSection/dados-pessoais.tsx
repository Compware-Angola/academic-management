import { TabsContent } from "@/components/ui/tabs";
type Props = {
  codigoMatricula: number;
  value?: string;
};
export function DadosPessoais({
  codigoMatricula,
  value = "dados-pessoais",
}: Props) {
  return (
    <TabsContent value={value}>
      <h1>Dados Pessoais</h1>
    </TabsContent>
  );
}
