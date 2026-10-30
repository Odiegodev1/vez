type Props = {
    customerName: string;
    professionalName: string;
    status: string;
  };
  
  export function CtaVez({
    customerName,
    professionalName,
    status,
  }: Props) {
    const firstName =
      customerName.trim().split(/\s+/)[0] || customerName;
  
    if (status === "IN_SERVICE") {
      return (
        <section className="space-y-3">
          <h1 className="font-mono text-[clamp(2.5rem,10vw,4.5rem)] font-extrabold leading-[1.05] tracking-[-0.06em]">
            Bom atendimento,
            <br />
            {firstName}!
          </h1>
  
          <p className="max-w-md text-sm leading-relaxed sm:text-base">
            Seu atendimento com{" "}
            <strong>{professionalName}</strong> já começou.
          </p>
        </section>
      );
    }
  
    if (status === "COMPLETED") {
      return (
        <section className="space-y-3">
          <h1 className="font-mono text-[clamp(2.5rem,10vw,4.5rem)] font-extrabold leading-[1.05] tracking-[-0.06em]">
            Tudo pronto,
            <br />
            {firstName}!
          </h1>
  
          <p className="text-sm sm:text-base">
            Seu atendimento foi concluído.
          </p>
        </section>
      );
    }
  
    if (status !== "CALLED") {
      return (
        <section className="space-y-3">
          <h1 className="font-mono text-4xl font-extrabold tracking-tight">
            Senha encerrada
          </h1>
  
          <p className="text-sm">
            Consulte o estabelecimento para mais informações.
          </p>
        </section>
      );
    }
  
    return (
      <section className="min-w-0 space-y-3">
        <h1 className="max-w-full break-words font-mono text-[clamp(2.5rem,10vw,4.5rem)] font-extrabold leading-[1.05] tracking-[-0.06em]">
          É a sua vez,
          <br />
          <span className="break-words">{firstName}!</span>
        </h1>
  
        <p className="max-w-md text-sm leading-relaxed text-grafite/80 sm:text-base">
          Pode vir até a cadeira.{" "}
          <strong className="text-grafite">
            {professionalName}
          </strong>{" "}
          já está te esperando.
        </p>
      </section>
    );
  }