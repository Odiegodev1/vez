"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  Check,
  Clock3,
  Loader2,
  Scissors,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field";

import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";



import { joinQueueAction } from "../actions/join-queue-action";

import type { PublicQueueData } from "../actions/get-public-queue-action";
import { schemaform, Schemaform } from "./form/schemaform";

interface FormCompoentsProps {
  slug: string;
  data: PublicQueueData;
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function formatPrice(value: string | null) {
  if (!value) return null;

  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function FormCompoents({
  slug,
  data,
}: FormCompoentsProps) {
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);

  const form = useForm<Schemaform>({
    resolver: zodResolver(schemaform),

    defaultValues: {
      name: "",
      phone: "",
      servicos: "",
      profissional: "",
    },
  });

  const selectedServiceId = form.watch("servicos");
  const selectedProfessionalId = form.watch("profissional");

  const professionals = useMemo(() => {
    if (!selectedServiceId) return [];

    return data.professionals.filter((professional) =>
      professional.serviceIds.includes(selectedServiceId)
    );
  }, [data.professionals, selectedServiceId]);

  const canJoin =
    data.isOpen &&
    !data.isFull &&
    data.services.length > 0;

    async function onSubmit(values: Schemaform) {
      if (!canJoin || submitting) return;
    
      setSubmitting(true);
    
      try {
        const result = await joinQueueAction({
          slug,
          name: values.name,
          phone: values.phone,
          servicos: values.servicos,
          profissional: values.profissional,
        });
    
        if (!result.success) {
          toast.error(result.message);
          return;
        }
    
        toast.success("Você entrou na fila!");
    
        router.push(
          `/${encodeURIComponent(slug)}/minhasenha?token=${encodeURIComponent(
            result.publicToken
          )}`
        );
      } catch (error) {
        console.error("[FORM_JOIN_QUEUE]", error);
    
        toast.error(
          "Não foi possível concluir sua entrada na fila."
        );
      } finally {
        setSubmitting(false);
      }
    }

  return (
    <section className="min-w-0 overflow-hidden rounded-[26px] border border-grafite/10 bg-white shadow-sm">
      {/* HEADER */}

      <div className="border-b border-grafite/10 px-4 py-5 sm:px-7 sm:py-6">
        <div className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-lima">
            <Scissors className="size-5 text-grafite" />
          </div>

          <div className="min-w-0">
            <h3 className="font-mono text-xl font-black tracking-tight">
              Entrar na fila
            </h3>

            <p className="mt-1 text-xs text-cinzaapoio">
              Leva menos de um minuto.
            </p>
          </div>
        </div>
      </div>

      {!data.isOpen && (
        <div
          role="status"
          className="mx-4 mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 sm:mx-7"
        >
          <p className="font-bold">Fila fechada no momento</p>

          <p className="mt-1 text-xs leading-5">
            Este estabelecimento ainda não está recebendo
            novos clientes pela fila online.
          </p>
        </div>
      )}

      {data.isOpen && data.isFull && (
        <div
          role="status"
          className="mx-4 mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 sm:mx-7"
        >
          <p className="font-bold">Fila temporariamente cheia</p>

          <p className="mt-1 text-xs leading-5">
            Aguarde a liberação de uma vaga para participar.
          </p>
        </div>
      )}

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="px-4 pb-5 pt-6 sm:px-7 sm:pb-7"
      >
        <fieldset
          disabled={!canJoin || submitting}
          className="min-w-0 disabled:opacity-65"
        >
          <FieldGroup className="gap-6">
            {/* DADOS PESSOAIS */}

            <div>
              <div className="mb-5 flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-full bg-grafite font-mono text-xs font-bold text-lima">
                  1
                </span>

                <h4 className="text-sm font-extrabold">
                  Seus dados
                </h4>
              </div>

              <div className="space-y-4">
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="queue-name">
                        Seu nome
                      </FieldLabel>

                      <Input
                        {...field}
                        id="queue-name"
                        autoComplete="name"
                        placeholder="Como podemos te chamar?"
                        aria-invalid={fieldState.invalid}
                        className="h-13 rounded-xl border-grafite/15 bg-nevoa px-4 text-base shadow-none focus-visible:ring-lima"
                      />

                      {fieldState.invalid && (
                        <FieldError
                          errors={[fieldState.error]}
                        />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="phone"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="queue-phone">
                        WhatsApp com DDD
                      </FieldLabel>

                      <Input
                        {...field}
                        value={field.value}
                        onChange={(event) =>
                          field.onChange(
                            formatPhone(event.target.value)
                          )
                        }
                        id="queue-phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel-national"
                        placeholder="(22) 99999-9999"
                        maxLength={15}
                        aria-invalid={fieldState.invalid}
                        className="h-13 rounded-xl border-grafite/15 bg-nevoa px-4 text-base shadow-none focus-visible:ring-lima"
                      />

                      <p className="mt-1 text-[11px] text-cinzaapoio">
                        Usaremos esse número para identificar
                        seu atendimento.
                      </p>

                      {fieldState.invalid && (
                        <FieldError
                          errors={[fieldState.error]}
                        />
                      )}
                    </Field>
                  )}
                />
              </div>
            </div>

            <div className="h-px bg-grafite/10" />

            {/* SERVIÇOS */}

            <Controller
              name="servicos"
              control={form.control}
              render={({ field, fieldState }) => (
                <FieldSet data-invalid={fieldState.invalid}>
                  <div className="mb-4 flex items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-full bg-grafite font-mono text-xs font-bold text-lima">
                      2
                    </span>

                    <FieldLegend className="text-sm font-extrabold">
                      O que você vai fazer?
                    </FieldLegend>
                  </div>

                  <RadioGroup
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);

                      // Evita manter um profissional incompatível
                      // quando o cliente troca de serviço.
                      form.setValue("profissional", "", {
                        shouldValidate: false,
                      });
                    }}
                    className="gap-2.5"
                  >
                    {data.services.map((service) => {
                      const selected =
                        field.value === service.id;

                      return (
                        <label
                          key={service.id}
                          htmlFor={`service-${service.id}`}
                          className={`flex min-h-17 cursor-pointer items-center gap-3 rounded-2xl border p-3.5 transition-colors sm:p-4 ${
                            selected
                              ? "border-grafite bg-grafite text-white"
                              : "border-grafite/10 bg-nevoa text-grafite hover:border-grafite/30"
                          }`}
                        >
                          <RadioGroupItem
                            value={service.id}
                            id={`service-${service.id}`}
                            className="sr-only"
                          />

                          <div
                            aria-hidden="true"
                            className={`flex size-6 shrink-0 items-center justify-center rounded-full ${
                              selected
                                ? "bg-lima text-grafite"
                                : "border-2 border-grafite/25"
                            }`}
                          >
                            {selected && (
                              <Check className="size-4 stroke-[3]" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold">
                              {service.name}
                            </p>

                            {service.description && (
                              <p
                                className={`mt-1 line-clamp-2 text-xs ${
                                  selected
                                    ? "text-zinc-300"
                                    : "text-cinzaapoio"
                                }`}
                              >
                                {service.description}
                              </p>
                            )}

                            {service.price && (
                              <p
                                className={`mt-1 text-xs font-bold ${
                                  selected
                                    ? "text-lima"
                                    : "text-cinzaapoio"
                                }`}
                              >
                                {formatPrice(service.price)}
                              </p>
                            )}
                          </div>

                          <div
                            className={`flex shrink-0 items-center gap-1 text-xs font-bold ${
                              selected
                                ? "text-lima"
                                : "text-cinzaapoio"
                            }`}
                          >
                            <Clock3 className="size-3.5" />

                            {service.durationMinutes} min
                          </div>
                        </label>
                      );
                    })}
                  </RadioGroup>

                  {data.services.length === 0 && (
                    <p className="rounded-xl bg-nevoa p-4 text-sm text-cinzaapoio">
                      Nenhum serviço disponível.
                    </p>
                  )}

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldSet>
              )}
            />

            <div className="h-px bg-grafite/10" />

            {/* PROFISSIONAIS */}

            <Controller
              name="profissional"
              control={form.control}
              render={({ field, fieldState }) => (
                <FieldSet data-invalid={fieldState.invalid}>
                  <div className="mb-4 flex items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-full bg-grafite font-mono text-xs font-bold text-lima">
                      3
                    </span>

                    <FieldLegend className="text-sm font-extrabold">
                      Com quem você prefere?
                    </FieldLegend>
                  </div>

                  {!selectedServiceId ? (
                    <div className="rounded-2xl border border-dashed border-grafite/15 bg-nevoa p-5 text-center">
                      <UserRound className="mx-auto size-6 text-cinzaapoio" />

                      <p className="mt-2 text-xs text-cinzaapoio">
                        Selecione um serviço primeiro.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2.5">
                      {data.allowAnyProfessional &&
                        professionals.length > 0 && (
                          <button
                            type="button"
                            onClick={() =>
                              field.onChange("any")
                            }
                            aria-pressed={
                              selectedProfessionalId === "any"
                            }
                            className={`flex min-h-27 flex-col items-center justify-center gap-2 rounded-2xl border p-3 text-center transition-colors ${
                              selectedProfessionalId === "any"
                                ? "border-grafite bg-grafite text-white"
                                : "border-grafite/10 bg-nevoa hover:border-grafite/30"
                            }`}
                          >
                            <UsersRound
                              className={`size-6 ${
                                selectedProfessionalId === "any"
                                  ? "text-lima"
                                  : "text-cinzaapoio"
                              }`}
                            />

                            <span className="text-xs font-bold">
                              Quem estiver livre
                            </span>

                            <span className="text-[10px] opacity-65">
                              Sem preferência
                            </span>
                          </button>
                        )}

                      {professionals.map((professional) => {
                        const selected =
                          field.value === professional.id;

                        return (
                          <button
                            key={professional.id}
                            type="button"
                            onClick={() =>
                              field.onChange(professional.id)
                            }
                            aria-pressed={selected}
                            className={`flex min-h-27 min-w-0 flex-col items-center justify-center gap-2 rounded-2xl border p-3 text-center transition-colors ${
                              selected
                                ? "border-grafite bg-grafite text-white"
                                : "border-grafite/10 bg-nevoa hover:border-grafite/30"
                            }`}
                          >
                            <div
                              className={`flex size-9 items-center justify-center rounded-full text-sm font-black ${
                                selected
                                  ? "bg-lima text-grafite"
                                  : "bg-white text-grafite"
                              }`}
                            >
                              {professional.name
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <span className="max-w-full truncate text-xs font-bold">
                              {professional.name}
                            </span>

                            {professional.chairLabel && (
                              <span className="text-[10px] opacity-65">
                                {professional.chairLabel}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {selectedServiceId &&
                    professionals.length === 0 && (
                      <p className="mt-3 text-xs text-amber-700">
                        Não há profissionais disponíveis
                        para esse serviço.
                      </p>
                    )}

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldSet>
              )}
            />
          </FieldGroup>
        </fieldset>

        {/* BOTÃO PRINCIPAL */}

        <div className="sticky bottom-0 z-10 -mx-4 mt-7 border-t border-grafite/10 bg-white/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:pb-0">
          <Button
            type="submit"
            disabled={!canJoin || submitting}
            className="h-14 w-full rounded-2xl bg-grafite px-5 text-base font-extrabold text-lima shadow-none hover:bg-grafite/90 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Entrando na fila...
              </>
            ) : (
              <>
                Confirmar e entrar na fila
                <ArrowRight className="ml-auto size-5" />
              </>
            )}
          </Button>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-cinzaapoio">
            <ShieldCheck className="size-3.5" />
            Você receberá uma senha para acompanhar sua vez.
          </p>
        </div>
      </form>
    </section>
  );
}