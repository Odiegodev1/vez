import type { MyTicketData } from "../../minhasenha/actions/get-my-ticket-action";

type Props = {
  ticket: MyTicketData["ticket"];
};

export function MeuBilhetevez({ ticket }: Props) {
  return (
    <section className="relative min-w-0 overflow-hidden rounded-[26px] bg-grafite text-white shadow-xl shadow-grafite/10">
      <div className="space-y-4 px-5 pb-6 pt-6 sm:px-7">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
          Sua senha
        </p>

        <div className="flex min-w-0 flex-wrap items-end justify-between gap-4">
          <h2 className="min-w-0 break-all font-mono text-[clamp(3.25rem,15vw,5rem)] font-extrabold leading-none tracking-[-0.08em] text-lima">
            {ticket.code}
          </h2>

          <div className="min-w-0 text-right">
            <p className="text-xs text-white/50">
              Vá para
            </p>

            <p className="mt-1 break-words text-lg font-bold text-white sm:text-2xl">
              {ticket.chairLabel ??
                "Aguarde orientação"}
            </p>
          </div>
        </div>
      </div>

      <div className="relative">
        <span className="absolute -left-3 -top-3 size-6 rounded-full bg-lima" />
        <span className="absolute -right-3 -top-3 size-6 rounded-full bg-lima" />

        <div className="mx-5 border-t-2 border-dashed border-white/20 sm:mx-7" />
      </div>

      <div className="grid grid-cols-1 gap-4 px-5 py-6 min-[360px]:grid-cols-2 sm:px-7">
        <div className="min-w-0">
          <p className="text-xs text-white/50">
            Serviço
          </p>

          <p className="mt-1 break-words text-sm font-semibold text-white">
            {ticket.serviceName}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-xs text-white/50">
            Profissional
          </p>

          <p className="mt-1 break-words text-sm font-semibold text-white">
            {ticket.professionalName}
          </p>
        </div>
      </div>
    </section>
  );
}