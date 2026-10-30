"use client"
import {
  ArrowRight,
  Bell,
  Check,
  ChevronRight,
  Clock3,
  Eye,
  Menu,
  Monitor,
  QrCode,
  Scissors,
  Smartphone,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import {signIn} from "next-auth/react"
const benefits = [
  "Cliente não baixa nenhum app",
  "Aviso automático por WhatsApp",
  "Funciona no celular, tablet ou PC",
];

const audiences = [
  {
    title: "Barbearias",
    description:
      "Corte, barba, sobrancelha. Fila geral ou por barbeiro, com o tempo médio de cada serviço já calculado.",
    code: "B-12",
    icon: Scissors,
    tags: ["Fila por barbeiro", "Sem hora marcada"],
  },
  {
    title: "Unhas",
    description:
      "Manicure, pedicure, alongamento. Defina a duração de cada técnica e ninguém fica esperando de pé.",
    code: "N-04",
    icon: Sparkles,
    tags: ["Duração por técnica", "Encaixes"],
  },
  {
    title: "Cílios",
    description:
      "Extensão, lifting, manutenção. Serviços longos pedem previsão certa: a Vez calcula e avisa na hora.",
    code: "L-03",
    icon: Eye,
    tags: ["Serviços longos", "Previsão de espera"],
  },
];

const steps = [
  {
    number: "01",
    title: "Escaneie o QR do balcão",
    description:
      "O cliente aponta a câmera e abre a sua fila no navegador. Sem cadastro longo, sem app.",
    icon: QrCode,
  },
  {
    number: "02",
    title: "Escolha o serviço e entre",
    description:
      "Nome, WhatsApp e serviço. A Vez mostra a posição e quanto tempo falta, na hora.",
    icon: Clock3,
  },
  {
    number: "03",
    title: "Receba o aviso e chegue",
    description:
      "Quando a vez se aproxima, o cliente é avisado por WhatsApp. Ele espera onde quiser.",
    icon: Bell,
  },
];

const plans = [
  {
    name: "Começo",
    description: "Para quem atende sozinho.",
    price: "R$ [00]",
    features: [
      "1 profissional",
      "QR code e link da fila",
      "Aviso por WhatsApp (até [N] por mês)",
    ],
    button: "Começar",
    featured: false,
  },
  {
    name: "Profissional",
    description: "Para equipes pequenas.",
    price: "R$ [00]",
    features: [
      "Até [N] profissionais",
      "Telão para a sala de espera",
      "Relatórios de atendimento",
    ],
    button: "Testar grátis",
    featured: true,
  },
  {
    name: "Salão",
    description: "Para equipes e várias unidades.",
    price: "R$ [00]",
    features: [
      "Profissionais ilimitados",
      "Várias unidades",
      "Suporte prioritário",
    ],
    button: "Falar com a equipe",
    featured: false,
  },
];

const questions = [
  {
    question: "O cliente precisa baixar um app?",
    answer:
      "Não. Ele escaneia o QR code ou abre o link e entra na fila direto pelo navegador do celular.",
  },
  {
    question: "Como o cliente é avisado?",
    answer:
      "Por WhatsApp e pela tela de acompanhamento, que atualiza sozinha quando a fila anda.",
  },
  {
    question: "Funciona para atendimento sem hora marcada?",
    answer:
      "Sim. A Vez foi pensada para ordem de chegada e também organiza quem já tem horário.",
  },
  {
    question: "Posso ter uma fila por profissional?",
    answer:
      "Pode. Cada profissional tem a sua fila e o cliente escolhe com quem quer ser atendido ou entra na fila geral.",
  },
];

function Logo() {
  return (
    <a href="#topo" className="inline-flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-xl bg-grafite font-mono text-[23px] font-extrabold text-lima">
        v
      </span>

      <span className="font-mono text-[28px] font-extrabold tracking-[-0.04em]">
        vez
      </span>
    </a>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 text-xs font-bold tracking-[0.14em] text-grafite uppercase">
      <span className="h-[3px] w-7 rounded-full bg-lima ring-1 ring-grafite" />
      {children}
    </div>
  );
}
async function handleLogin (){
await signIn("google", {redirectTo: "/admin"})
}

function Header() {
  return (
    <header className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-6 md:px-8">
      <Logo />

      <nav className="hidden items-center gap-7 text-sm font-semibold text-cinzaapoio lg:flex">
        <a href="#para-quem" className="hover:text-grafite">
          Para quem
        </a>
        <a href="#como-funciona" className="hover:text-grafite">
          Como funciona
        </a>
        <a href="#painel" className="hover:text-grafite">
          Painel
        </a>
        <a href="#planos" className="hover:text-grafite">
          Planos
        </a>
        <a href="#duvidas" className="hover:text-grafite">
          Dúvidas
        </a>
      </nav>

      <div className="flex items-center gap-3">
        <a
          href="#topo"
          className="hidden rounded-full px-5 py-3 text-sm font-semibold hover:bg-white sm:inline-flex"
        >
          Entrar
        </a>

        <a
         
          onClick={handleLogin}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-grafite px-5 text-sm font-bold text-nevoa hover:bg-cinzaapoio"
        >
          Testar grátis
        </a>
      </div>
    </header>
  );
}

function QueuePreview() {
  const queue = [
    {
      code: "B-05",
      name: "Lucas",
      initials: "LA",
      status: "Atendendo",
      active: false,
    },
    {
      code: "B-06",
      name: "Pedro",
      initials: "PH",
      status: "Aguardando",
      active: false,
    },
    {
      code: "B-07",
      name: "Você",
      initials: "VC",
      status: "Na fila",
      active: true,
    },
  ];

  return (
    <div className="relative mx-auto h-[620px] w-[320px] max-w-full sm:h-[640px]">
      <div className="absolute top-0 left-5 h-[600px] w-[280px] rounded-[48px] bg-grafite p-2.5 shadow-[0_40px_70px_-24px_rgba(17,20,18,0.45)]">
        <div className="flex h-full flex-col gap-3 overflow-hidden rounded-[38px] bg-nevoa px-3.5 pt-6 pb-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-grafite font-mono text-sm font-extrabold text-lima">
                N
              </span>

              <span className="truncate text-xs font-bold">
                Navalha Barbearia
              </span>
            </div>

            <span className="inline-flex items-center gap-1 rounded-full bg-grafite px-2 py-1 text-[10px] font-bold text-lima">
              <span className="size-1.5 rounded-full bg-lima" />
              Ao vivo
            </span>
          </div>

          <div className="overflow-hidden rounded-3xl bg-grafite text-white">
            <div className="px-4 pt-5 pb-4">
              <span className="text-[10px] font-bold tracking-widest text-white/60">
                SUA SENHA
              </span>

              <div className="font-mono text-7xl leading-none font-extrabold tracking-tighter text-lima">
                B-07
              </div>

              <p className="mt-1 text-xs text-white/65">
                Matheus · Corte + barba
              </p>
            </div>

            <div className="relative mx-4 border-t-2 border-dashed border-white/25">
              <span className="absolute -top-2.5 -left-6 size-5 rounded-full bg-nevoa" />
              <span className="absolute -top-2.5 -right-6 size-5 rounded-full bg-nevoa" />
            </div>

            <div className="grid grid-cols-2 gap-3 px-4 py-4">
              <div>
                <p className="text-[10px] text-white/60">
                  Na sua frente
                </p>
                <p className="text-sm font-bold">2 pessoas</p>
              </div>

              <div>
                <p className="text-[10px] text-white/60">
                  Espera estimada
                </p>
                <p className="text-sm font-bold">~20 min</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 rounded-2xl border border-grafite/10 bg-white p-1.5">
            {queue.map((person) => (
              <div
                key={person.code}
                className={`flex items-center gap-2 rounded-xl px-2 py-2 ${
                  person.active ? "bg-lima/35" : ""
                }`}
              >
                <span
                  className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                    person.active
                      ? "bg-lima text-grafite"
                      : "bg-nevoa text-cinzaapoio"
                  }`}
                >
                  {person.initials}
                </span>

                <span className="min-w-0 flex-1 truncate text-xs font-semibold">
                  {person.code} · {person.name}
                </span>

                <span
                  className={`rounded-full px-2 py-1 text-[9px] font-bold ${
                    person.active
                      ? "bg-grafite text-lima"
                      : person.status === "Atendendo"
                        ? "bg-azulstatus/10 text-azulstatus"
                        : "bg-nevoa text-cinzaapoio"
                  }`}
                >
                  {person.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-9 left-0 flex w-[210px] -rotate-3 items-center gap-3 rounded-2xl bg-white p-3.5 shadow-[0_24px_40px_-16px_rgba(17,20,18,0.35)]">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-lima">
          <Bell size={20} />
        </span>

        <div>
          <p className="text-sm leading-tight font-bold">
            Falta pouco!
          </p>
          <p className="mt-1 text-xs text-cinzaapoio">
            Sua vez em ~10 min
          </p>
        </div>
      </div>

      <div className="absolute top-24 right-0 inline-flex rotate-3 items-center gap-2 rounded-full bg-lima px-3 py-2 text-xs font-bold ring-2 ring-grafite">
        <span className="size-2 rounded-full bg-grafite" />
        Chamando · Cadeira 2
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section
      id="topo"
      className="mx-auto grid max-w-7xl items-center gap-12 px-5 pt-10 pb-20 md:px-8 lg:grid-cols-2 lg:gap-16"
    >
      <div className="flex flex-col items-start gap-7">
        <div className="inline-flex max-w-full items-center gap-2.5 rounded-full border border-grafite/10 bg-white px-4 py-2 text-xs font-semibold sm:text-sm">
          <span className="size-2.5 shrink-0 rounded-full bg-lima ring-[3px] ring-grafite" />
          Fila de espera para barbearias, unhas e cílios
        </div>

        <h1 className="font-mono text-[clamp(3.25rem,7vw,5.25rem)] leading-[0.98] font-extrabold tracking-[-0.05em]">
          Acabou a fila
          <br />
          na{" "}
          <span className="rounded-xl bg-lima px-2">
            porta.
          </span>
        </h1>

        <p className="max-w-xl text-lg leading-relaxed text-cinzaapoio md:text-xl">
          O cliente entra na fila pelo celular, acompanha a vez em tempo
          real e chega na hora certa. Você atende sem lista de papel e sem
          responder “quanto falta?” no WhatsApp.
        </p>

        <div className="flex flex-wrap gap-3">
          <a
            href="#criar"
            className="inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full bg-lima px-7 text-base font-bold text-grafite ring-2 ring-grafite transition-transform hover:-translate-y-1"
          >
            Criar minha fila grátis
            <ArrowRight size={20} />
          </a>

          <a
            href="#como-funciona"
            className="inline-flex min-h-14 items-center justify-center rounded-full border-2 border-grafite px-6 text-base font-bold hover:bg-grafite hover:text-white"
          >
            Ver como funciona
          </a>
        </div>

        <ul className="flex flex-wrap gap-x-6 gap-y-3">
          {benefits.map((benefit) => (
            <li
              key={benefit}
              className="flex items-center gap-2 text-sm font-medium text-cinzaapoio"
            >
              <span className="flex size-5 items-center justify-center rounded-full bg-lima text-grafite">
                <Check size={13} strokeWidth={3} />
              </span>
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-center">
        <QueuePreview />
      </div>
    </section>
  );
}

function AudienceSection() {
  return (
    <section
      id="para-quem"
      className="mx-auto max-w-7xl px-5 py-20 md:px-8"
    >
      <div className="mb-11 max-w-2xl space-y-4">
        <SectionLabel>Para quem</SectionLabel>

        <h2 className="font-mono text-4xl leading-tight font-extrabold tracking-tight md:text-5xl">
          Feito para o balcão de quem atende.
        </h2>

        <p className="text-lg text-cinzaapoio">
          Uma fila, três jeitos de trabalhar. Cada tipo de negócio com
          seus serviços, seus tempos e sua letra de senha.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {audiences.map((audience) => {
          const Icon = audience.icon;

          return (
            <article
              key={audience.title}
              className="flex flex-col gap-5 rounded-[28px] border border-grafite/10 bg-white p-7 transition-transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-grafite text-lima">
                  <Icon size={26} strokeWidth={1.8} />
                </span>

                <span className="rounded-xl bg-lima px-3 py-1.5 font-mono text-xl font-extrabold">
                  {audience.code}
                </span>
              </div>

              <h3 className="font-mono text-3xl font-extrabold tracking-tight">
                {audience.title}
              </h3>

              <p className="flex-1 leading-relaxed text-cinzaapoio">
                {audience.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {audience.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-nevoa px-3 py-1.5 text-xs font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="como-funciona" className="px-4 py-8">
      <div className="mx-auto max-w-7xl rounded-[32px] bg-grafite px-6 py-16 text-nevoa md:rounded-[40px] md:px-14 md:py-20">
        <div className="mb-12 max-w-2xl space-y-4">
          <div className="flex items-center gap-2.5 text-xs font-bold tracking-widest text-lima uppercase">
            <span className="h-[3px] w-7 rounded-full bg-lima" />
            Como funciona
          </div>

          <h2 className="font-mono text-4xl leading-tight font-extrabold tracking-tight md:text-5xl">
            Três passos. Zero sala de espera lotada.
          </h2>
        </div>

        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="flex flex-col gap-4 border-t border-white/20 pt-7"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-7xl leading-none font-extrabold tracking-tighter text-lima">
                    {step.number}
                  </span>

                  <Icon
                    size={32}
                    strokeWidth={1.8}
                    className="text-nevoa"
                  />
                </div>

                <h3 className="font-mono text-2xl font-extrabold tracking-tight">
                  {step.title}
                </h3>

                <p className="leading-relaxed text-nevoa/75">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  const customers = [
    {
      code: "B-05",
      name: "Lucas Andrade",
      service: "Corte · chamando",
      button: "Atender",
      active: true,
    },
    {
      code: "B-06",
      name: "Pedro Henrique",
      service: "Barba · 14 min de espera",
      button: "Chamar",
      active: false,
    },
    {
      code: "B-07",
      name: "Matheus Souza",
      service: "Corte + barba · 9 min de espera",
      button: "Chamar",
      active: false,
    },
    {
      code: "B-08",
      name: "João Vítor",
      service: "Sobrancelha · 6 min de espera",
      button: "Chamar",
      active: false,
    },
  ];

  return (
    <div className="min-w-0 rounded-[28px] border border-grafite/10 bg-white p-4 shadow-[0_30px_60px_-30px_rgba(17,20,18,0.25)] sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-mono text-2xl font-extrabold">
          Fila de hoje
        </h3>

        <span className="rounded-full bg-grafite px-4 py-1.5 text-xs font-bold text-lima">
          6 na fila
        </span>
      </div>

      <div className="space-y-2">
        {customers.map((customer) => (
          <div
            key={customer.code}
            className={`flex flex-wrap items-center gap-3 rounded-2xl p-3 sm:p-4 ${
              customer.active ? "bg-lima" : "bg-nevoa"
            }`}
          >
            <span className="min-w-16 font-mono text-2xl font-extrabold">
              {customer.code}
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">
                {customer.name}
              </p>

              <p className="text-xs text-cinzaapoio sm:text-sm">
                {customer.service}
              </p>
            </div>

            <span
              className={`inline-flex min-h-10 items-center justify-center rounded-full px-4 text-sm font-bold ${
                customer.active
                  ? "bg-grafite text-nevoa"
                  : "border border-grafite bg-transparent text-grafite"
              }`}
            >
              {customer.button}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardSection() {
  const features = [
    "Chame o próximo com um toque",
    "Pause a fila na hora do almoço",
    "Veja quem está esperando há mais tempo",
    "Telão para a sala de espera",
  ];

  return (
    <section
      id="painel"
      className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14"
    >
      <div className="space-y-6">
        <SectionLabel>Painel</SectionLabel>

        <h2 className="font-mono text-4xl leading-tight font-extrabold tracking-tight md:text-5xl">
          Seu painel, sem treinamento.
        </h2>

        <p className="max-w-lg text-lg leading-relaxed text-cinzaapoio">
          Quem atende vê a fila, chama o próximo e segue o trabalho.
          Tudo cabe em uma tela.
        </p>

        <ul className="space-y-4 pt-2">
          {features.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-3 font-semibold"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-grafite text-lima">
                <Check size={15} strokeWidth={3} />
              </span>

              {feature}
            </li>
          ))}
        </ul>
      </div>

      <DashboardPreview />
    </section>
  );
}

function PricingSection() {
  return (
    <section
      id="planos"
      className="mx-auto max-w-7xl px-5 py-20 md:px-8"
    >
      <div className="mb-11 max-w-2xl space-y-4">
        <SectionLabel>Planos</SectionLabel>

        <h2 className="font-mono text-4xl leading-tight font-extrabold tracking-tight md:text-5xl">
          Cresce junto com o seu movimento.
        </h2>
      </div>

      <div className="grid items-stretch gap-5 md:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={`flex flex-col gap-6 rounded-[30px] p-7 sm:p-8 ${
              plan.featured
                ? "bg-grafite text-nevoa shadow-[0_30px_60px_-30px_rgba(17,20,18,0.5)]"
                : "border border-grafite/10 bg-white text-grafite"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-mono text-2xl font-extrabold">
                  {plan.name}
                </h3>

                <p
                  className={`mt-1 text-sm ${
                    plan.featured
                      ? "text-nevoa/70"
                      : "text-cinzaapoio"
                  }`}
                >
                  {plan.description}
                </p>
              </div>

              {plan.featured && (
                <span className="shrink-0 rounded-full bg-lima px-3 py-1.5 text-[11px] font-bold text-grafite">
                  Mais escolhido
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-2">
              <span
                className={`font-mono text-5xl font-extrabold tracking-tight ${
                  plan.featured ? "text-lima" : ""
                }`}
              >
                {plan.price}
              </span>

              <span
                className={`text-sm ${
                  plan.featured
                    ? "text-nevoa/70"
                    : "text-cinzaapoio"
                }`}
              >
                /mês
              </span>
            </div>

            <ul className="flex-1 space-y-4">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-3 text-sm font-medium"
                >
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-lima text-grafite">
                    <Check size={12} strokeWidth={3} />
                  </span>

                  {feature}
                </li>
              ))}
            </ul>

            <a
              href="#criar"
              className={`flex min-h-13 items-center justify-center rounded-full text-sm font-bold ${
                plan.featured
                  ? "bg-lima text-grafite hover:bg-nevoa"
                  : "border-2 border-grafite text-grafite hover:bg-grafite hover:text-white"
              }`}
            >
              {plan.button}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section
      id="duvidas"
      className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16"
    >
      <div className="space-y-4">
        <SectionLabel>Dúvidas</SectionLabel>

        <h2 className="font-mono text-4xl font-extrabold tracking-tight md:text-5xl">
          Perguntas comuns.
        </h2>
      </div>

      <div>
        {questions.map((item) => (
          <div
            key={item.question}
            className="space-y-2 border-t border-grafite/15 py-6 last:border-b"
          >
            <h3 className="text-lg font-bold">
              {item.question}
            </h3>

            <p className="leading-relaxed text-cinzaapoio">
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section id="criar" className="px-4 pb-4">
      <div className="mx-auto grid max-w-7xl items-center gap-10 rounded-[32px] bg-lima px-6 py-14 md:rounded-[40px] md:px-14 md:py-20 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="font-mono text-4xl leading-tight font-extrabold tracking-tight md:text-6xl">
            Sua próxima fila começa agora.
          </h2>

          <p className="max-w-lg text-lg leading-relaxed">
            Informe seu WhatsApp e a gente te leva para configurar
            o primeiro QR code.
          </p>
        </div>

        <form
          action="#criar"
          className="flex flex-col gap-3 rounded-[28px] bg-white p-6"
        >
          <label
            htmlFor="whatsapp"
            className="text-sm font-bold"
          >
            Seu WhatsApp
          </label>

          <input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(21) 90000-0000"
            required
            className="min-h-14 w-full rounded-2xl border border-grafite/20 bg-white px-4 text-base text-grafite outline-none placeholder:text-cinzaapoio/60 focus:border-grafite focus:ring-2 focus:ring-lima"
          />

          <button
            type="submit"
            className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-grafite px-5 text-base font-bold text-lima hover:bg-cinzaapoio"
          >
            Criar minha fila grátis
            <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-10 md:px-8 lg:flex-row lg:items-center">
      <Logo />

      <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-cinzaapoio">
        <a href="#para-quem" className="hover:text-grafite">
          Para quem
        </a>
        <a href="#planos" className="hover:text-grafite">
          Planos
        </a>
        <a href="#duvidas" className="hover:text-grafite">
          Dúvidas
        </a>
        <a href="#topo" className="hover:text-grafite">
          Termos de uso
        </a>
        <a href="#topo" className="hover:text-grafite">
          Privacidade
        </a>
      </nav>

      <p className="text-sm text-cinzaapoio">
        © 2026 Vez. Feito para quem atende.
      </p>
    </footer>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-nevoa text-grafite">
      <Header />
      <Hero />
      <AudienceSection />
      <HowItWorks />
      <DashboardSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}