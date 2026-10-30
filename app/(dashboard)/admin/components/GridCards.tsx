import {
      Clock3,
      Megaphone,
      Scissors,
      Users,
    } from "lucide-react";
    
    type Props = {
      waiting: number;
      called: number;
      inService: number;
      averageMinutes: number;
    };
    
    export function GridCards({
      waiting,
      called,
      inService,
      averageMinutes,
    }: Props) {
      const cards = [
        {
          label: "Aguardando",
          value: waiting,
          description: "Clientes na fila",
          icon: Users,
        },
        {
          label: "Chamando",
          value: called,
          description: "Aguardando comparecimento",
          icon: Megaphone,
        },
        {
          label: "Em atendimento",
          value: inService,
          description: "Atendimentos em andamento",
          icon: Scissors,
        },
        {
          label: "Duração média",
          value: `${averageMinutes} min`,
          description: "Dos serviços aguardando",
          icon: Clock3,
          highlight: true,
        },
      ];
    
      return (
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {cards.map((card) => (
            <article
              key={card.label}
              className={`rounded-2xl border p-4 font-mono shadow-sm md:p-5 ${
                card.highlight
                  ? "border-lima bg-lima"
                  : "border-zinc-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-cinzaapoio md:text-sm">
                  {card.label}
                </p>
    
                <card.icon className="size-5 opacity-60" />
              </div>
    
              <p className="mt-5 text-3xl font-black tracking-tight text-grafite md:text-5xl">
                {card.value}
              </p>
    
              <p className="mt-2 text-xs text-cinzaapoio">
                {card.description}
              </p>
            </article>
          ))}
        </div>
      );
    }