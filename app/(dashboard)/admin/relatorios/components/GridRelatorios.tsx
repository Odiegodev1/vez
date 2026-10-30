import {
   Clock3,
   Scissors,
   Timer,
   UserRoundX,
 } from "lucide-react";
 
 import type { RelatoriosData } from "../actions/get-relatorios-action";
 
 type Props = {
   data: RelatoriosData;
 };
 
 function formatMinutes(value: number | null) {
   if (value === null) {
     return "—";
   }
 
   return `${value.toLocaleString("pt-BR", {
     maximumFractionDigits: 1,
   })} min`;
 }
 
 export function GridRelatorios({ data }: Props) {
   const cards = [
     {
       label: "Atendimentos",
       value: data.atendimentos.toLocaleString("pt-BR"),
       description: "Atendimentos concluídos",
       icon: Scissors,
       highlight: false,
     },
     {
       label: "Espera média",
       value: formatMinutes(data.esperaMediaMinutos),
       description: "Tempo médio até iniciar",
       icon: Clock3,
       highlight: false,
     },
     {
       label: "Tempo por atendimento",
       value: formatMinutes(data.tempoMedioAtendimentoMinutos),
       description: "Duração média dos atendimentos",
       icon: Timer,
       highlight: false,
     },
     {
       label: "Desistências",
       value: `${data.percentualDesistencias.toLocaleString(
         "pt-BR"
       )}%`,
       description: `${data.desistencias} de ${data.entradas} clientes`,
       icon: UserRoundX,
       highlight: true,
     },
   ];
 
   return (
     <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
       {cards.map((card) => (
         <article
           key={card.label}
           className={`flex min-h-44 flex-col justify-between rounded-2xl border p-5 font-mono shadow-sm md:p-6 ${
             card.highlight
               ? "border-lima bg-lima"
               : "border-zinc-200/80 bg-white"
           }`}
         >
           <div className="flex items-start justify-between gap-3">
             <p
               className={`text-sm font-semibold ${
                 card.highlight
                   ? "text-grafite"
                   : "text-cinzaapoio"
               }`}
             >
               {card.label}
             </p>
 
             <card.icon className="size-5 shrink-0 text-grafite" />
           </div>
 
           <div className="mt-5">
             <h2 className="text-3xl font-extrabold tracking-tight text-grafite md:text-4xl">
               {card.value}
             </h2>
 
             <p className="mt-2 text-xs text-cinzaapoio">
               {card.description}
             </p>
           </div>
         </article>
       ))}
     </div>
   );
 }