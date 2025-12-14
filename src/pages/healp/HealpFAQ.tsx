import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Home, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function HealpFAQ() {
  const faqs = [
    { pergunta: "Como registar um pagamento?", resposta: "Aceda ao menu Área Financeira > Pagamentos por Referência e insira os dados do pagamento." },
    { pergunta: "Como emitir uma nota de crédito?", resposta: "Aceda ao menu Serv. Tributários (AGT) > Nota de Crédito e clique em 'Emitir Nota de Crédito'." },
    { pergunta: "Como atribuir um desconto?", resposta: "Aceda ao menu Gestão de Descontos > Atribuição de Desconto e seleccione o estudante e tipo de desconto." },
    { pergunta: "Como fazer o fecho de caixa diário?", resposta: "Aceda ao menu Fecho de Caixa > Fecho Caixa Diário e clique em 'Fechar Caixa'." },
    { pergunta: "Como gerar o ficheiro SAFT?", resposta: "Aceda ao menu Serv. Tributários (AGT) > Gerar SAFT, seleccione o período e clique em 'Gerar SAFT'." },
  ];

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink asChild><Link to="/"><Home className="h-4 w-4" /></Link></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Finanças</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Ajuda</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Ajuda / FAQ Geral</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-3">
        <HelpCircle className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Central de Ajuda - Módulo Financeiro</h1>
          <p className="text-muted-foreground">Perguntas frequentes e guias de utilização.</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Perguntas Frequentes</CardTitle></CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{faq.pergunta}</AccordionTrigger>
                <AccordionContent>{faq.resposta}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Contacto de Suporte</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Para questões adicionais, contacte a equipa de suporte:</p>
          <ul className="mt-2 space-y-1">
            <li>Email: suporte@universidade.ao</li>
            <li>Telefone: +244 930333042</li>
            <li>Horário: Segunda a Sexta, 08:00 - 17:00</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
