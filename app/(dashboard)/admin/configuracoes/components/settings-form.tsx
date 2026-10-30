"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createBusinessAction } from "../actions/create-business-action";


import {
  settingsSchema,
  type SettingsFormValues,
} from "../schemas/settings-schema";

import { SettingsSection } from "./settings-section";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import {
  Clock3,
  Save,
  Settings2,
  Loader2,
} from "lucide-react";
import { updateBusinessAction } from "../actions/update-business-action";

// ============================================================
// TIPAGEM DOS DADOS DO ESTABELECIMENTO
// ============================================================

type BusinessData = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  phone: string | null;
  address: string | null;

  queueSettings: {
    isOpen: boolean;
    maxWaiting: number;
    notifyAhead: number;
    callTimeoutMinutes: number;
  } | null;
};

interface SettingsFormProps {
  business: BusinessData | null;
}

// ============================================================
// VALORES INICIAIS
// ============================================================

// Os dados do estabelecimento começam vazios.
// As regras da fila recebem valores padrão do sistema.

const emptyValues: SettingsFormValues = {
  name: "",
  slug: "",
  description: "",
  phone: "",
  address: "",

  queueEnabled: false,

  maxQueueSize: 20,
  notifyAhead: 2,
  callTimeoutMinutes: 5,

  primaryColor: "#C8F31D",
  showWaitTime: true,
  showQueuePosition: true,
};

// ============================================================
// CONVERTER DADOS DO BANCO PARA O FORMULÁRIO
// ============================================================

function getFormValues(
  business: BusinessData | null
): SettingsFormValues {
  if (!business) {
    return { ...emptyValues };
  }

  return {
    name: business.name,
    slug: business.slug,
    description: business.description ?? "",
    phone: business.phone ?? "",
    address: business.address ?? "",

    queueEnabled:
      business.queueSettings?.isOpen ?? false,

    maxQueueSize:
      business.queueSettings?.maxWaiting ?? 20,

    notifyAhead:
      business.queueSettings?.notifyAhead ?? 2,

    callTimeoutMinutes:
      business.queueSettings?.callTimeoutMinutes ?? 5,

    primaryColor: "#C8F31D",
    showWaitTime: true,
    showQueuePosition: true,
  };
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export function SettingsForm({
  business,
}: SettingsFormProps) {
  const router = useRouter();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: getFormValues(business),
    mode: "onBlur",
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
      isDirty,
    },
  } = form;

  // ============================================================
  // ATUALIZAR FORMULÁRIO QUANDO OS DADOS DO BANCO MUDAREM
  // ============================================================

  useEffect(() => {
    reset(getFormValues(business));
  }, [business, reset]);

  // ============================================================
  // CRIAR OU ATUALIZAR ESTABELECIMENTO
  // ============================================================

  async function onSubmit(data: SettingsFormValues) {
    try {
      const result = business
        ? await updateBusinessAction(business.id, data)
        : await createBusinessAction(data);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      console.log("CONFIGURAÇÕES SALVAS:", data);

      reset(data);

      router.refresh();
    } catch (error) {
      console.error(
        "[SETTINGS_FORM_ERROR]",
        error
      );

      toast.error(
        "Ocorreu um erro inesperado ao salvar as configurações."
      );
    }
  }

  // ============================================================
  // INTERFACE
  // ============================================================

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      noValidate
    >
      {/* ====================================================== */}
      {/* DADOS DO ESTABELECIMENTO */}
      {/* ====================================================== */}

      <SettingsSection
        title="Dados do estabelecimento"
        description="Informações exibidas na página pública da sua barbearia."
      >
        <FieldGroup>
          <div className="grid gap-5 md:grid-cols-2">
            {/* NOME */}

            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">
                Nome do estabelecimento
              </FieldLabel>

              <Input
                id="name"
                placeholder="Ex: Navalha Barbearia"
                className="h-11"
                aria-invalid={!!errors.name}
                {...register("name")}
              />

              <FieldError errors={[errors.name]} />
            </Field>

            {/* SLUG */}

            <Field data-invalid={!!errors.slug}>
              <FieldLabel htmlFor="slug">
                Link público
              </FieldLabel>

              <div className="flex h-11 overflow-hidden rounded-md border border-input">
                <span className="flex shrink-0 items-center bg-zinc-100 px-3 text-sm text-cinzaapoio">
                  vez.digital/
                </span>

                <input
                  id="slug"
                  placeholder="minha-barbearia"
                  className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
                  aria-invalid={!!errors.slug}
                  {...register("slug")}
                />
              </div>

              <FieldDescription>
                Esse será o endereço público da sua fila.
              </FieldDescription>

              <FieldError errors={[errors.slug]} />
            </Field>
          </div>

          {/* DESCRIÇÃO */}

          <Field data-invalid={!!errors.description}>
            <FieldLabel htmlFor="description">
              Descrição
            </FieldLabel>

            <Textarea
              id="description"
              rows={3}
              placeholder="Conte um pouco sobre seu estabelecimento..."
              aria-invalid={!!errors.description}
              {...register("description")}
            />

            <FieldError
              errors={[errors.description]}
            />
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            {/* WHATSAPP */}

            <Field data-invalid={!!errors.phone}>
              <FieldLabel htmlFor="phone">
                WhatsApp do estabelecimento
              </FieldLabel>

              <Input
                id="phone"
                placeholder="Ex: 21999999999"
                inputMode="numeric"
                className="h-11"
                aria-invalid={!!errors.phone}
                {...register("phone")}
              />

              <FieldError errors={[errors.phone]} />
            </Field>

            {/* ENDEREÇO */}

            <Field data-invalid={!!errors.address}>
              <FieldLabel htmlFor="address">
                Endereço
              </FieldLabel>

              <Input
                id="address"
                placeholder="Rua, número, bairro e cidade"
                className="h-11"
                aria-invalid={!!errors.address}
                {...register("address")}
              />

              <FieldError errors={[errors.address]} />
            </Field>
          </div>
        </FieldGroup>
      </SettingsSection>

      {/* ====================================================== */}
      {/* FUNCIONAMENTO DA FILA */}
      {/* ====================================================== */}

      <SettingsSection
        title="Funcionamento da fila"
        description="Controle quando os clientes podem entrar na fila."
      >
        <Controller
          name="queueEnabled"
          control={control}
          render={({ field }) => (
            <div className="flex items-center justify-between gap-4 rounded-xl border border-[#e2e5df] p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-nevoa p-2">
                  <Clock3 className="size-5 text-grafite" />
                </div>

                <div>
                  <p className="font-semibold text-grafite">
                    Fila aberta
                  </p>

                  <p className="mt-1 text-sm text-cinzaapoio">
                    Permitir que novos clientes entrem na fila.
                  </p>
                </div>
              </div>

              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-label="Ativar fila"
              />
            </div>
          )}
        />
      </SettingsSection>

      {/* ====================================================== */}
      {/* REGRAS DA FILA */}
      {/* ====================================================== */}

      <SettingsSection
        title="Regras da fila"
        description="Defina os limites e o comportamento dos atendimentos."
      >
        <FieldGroup>
          <div className="grid gap-5 md:grid-cols-2">
            {/* LIMITE */}

            <Field data-invalid={!!errors.maxQueueSize}>
              <FieldLabel htmlFor="maxQueueSize">
                Limite de pessoas na fila
              </FieldLabel>

              <Input
                id="maxQueueSize"
                type="number"
                min={1}
                max={200}
                className="h-11"
                aria-invalid={!!errors.maxQueueSize}
                {...register("maxQueueSize", {
                  valueAsNumber: true,
                })}
              />

              <FieldDescription>
                Quantidade máxima de clientes aguardando.
              </FieldDescription>

              <FieldError
                errors={[errors.maxQueueSize]}
              />
            </Field>

            {/* NOTIFICAÇÃO */}

            <Field data-invalid={!!errors.notifyAhead}>
              <FieldLabel htmlFor="notifyAhead">
                Avisar quando faltarem
              </FieldLabel>

              <Input
                id="notifyAhead"
                type="number"
                min={1}
                max={20}
                className="h-11"
                aria-invalid={!!errors.notifyAhead}
                {...register("notifyAhead", {
                  valueAsNumber: true,
                })}
              />

              <FieldDescription>
                Quantas pessoas antes do atendimento o cliente
                receberá um aviso no WhatsApp.
              </FieldDescription>

              <FieldError
                errors={[errors.notifyAhead]}
              />
            </Field>
          </div>

          {/* TEMPO PARA COMPARECER */}

          <Field data-invalid={!!errors.callTimeoutMinutes}>
            <FieldLabel htmlFor="callTimeoutMinutes">
              Tempo para comparecer após ser chamado
            </FieldLabel>

            <div className="relative">
              <Input
                id="callTimeoutMinutes"
                type="number"
                min={1}
                max={30}
                className="h-11 pr-20"
                aria-invalid={!!errors.callTimeoutMinutes}
                {...register("callTimeoutMinutes", {
                  valueAsNumber: true,
                })}
              />

              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-cinzaapoio">
                minutos
              </span>
            </div>

            <FieldDescription>
              Após esse período, o cliente poderá perder a vez
              automaticamente.
            </FieldDescription>

            <FieldError
              errors={[errors.callTimeoutMinutes]}
            />
          </Field>
        </FieldGroup>
      </SettingsSection>

      {/* ====================================================== */}
      {/* PERSONALIZAÇÃO */}
      {/* ====================================================== */}

      <SettingsSection
        title="Personalização"
        description="Configure a aparência e as informações da página pública."
      >
        <FieldGroup>
          {/* COR PRINCIPAL */}

          <Controller
            name="primaryColor"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  Cor principal
                </FieldLabel>

                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={
                      /^#[0-9a-fA-F]{6}$/.test(field.value)
                        ? field.value
                        : "#C8F31D"
                    }
                    onChange={field.onChange}
                    className="h-11 w-14 cursor-pointer rounded-lg border border-[#e2e5df] bg-white p-1"
                    aria-label="Selecionar cor principal"
                  />

                  <Input
                    value={field.value}
                    onChange={field.onChange}
                    className="h-11 max-w-40"
                    placeholder="#C8F31D"
                    aria-invalid={fieldState.invalid}
                  />
                </div>

                <FieldError
                  errors={[fieldState.error]}
                />
              </Field>
            )}
          />

          <div className="space-y-4">
            {/* MOSTRAR TEMPO */}

            <Controller
              name="showWaitTime"
              control={control}
              render={({ field }) => (
                <div className="flex items-center justify-between gap-4 rounded-xl border border-[#e2e5df] p-4">
                  <div>
                    <p className="font-semibold text-grafite">
                      Mostrar previsão de espera
                    </p>

                    <p className="mt-1 text-sm text-cinzaapoio">
                      Exibir o tempo estimado no bilhete digital.
                    </p>
                  </div>

                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-label="Mostrar previsão de espera"
                  />
                </div>
              )}
            />

            {/* MOSTRAR POSIÇÃO */}

            <Controller
              name="showQueuePosition"
              control={control}
              render={({ field }) => (
                <div className="flex items-center justify-between gap-4 rounded-xl border border-[#e2e5df] p-4">
                  <div>
                    <p className="font-semibold text-grafite">
                      Mostrar posição na fila
                    </p>

                    <p className="mt-1 text-sm text-cinzaapoio">
                      Exibir quantas pessoas estão à frente do cliente.
                    </p>
                  </div>

                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-label="Mostrar posição na fila"
                  />
                </div>
              )}
            />
          </div>
        </FieldGroup>
      </SettingsSection>

      {/* ====================================================== */}
      {/* BOTÕES */}
      {/* ====================================================== */}

      <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-2xl border border-[#e2e5df] bg-white/95 p-4 shadow-lg backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-cinzaapoio">
          <Settings2 className="size-4" />

          {isDirty
            ? "Você possui alterações não salvas."
            : "Nenhuma alteração pendente."}
        </div>

        <div className="flex gap-2">
          {/* DESCARTAR */}

          <Button
            type="button"
            variant="outline"
            onClick={() => reset()}
            disabled={!isDirty || isSubmitting}
          >
            Descartar
          </Button>

          {/* SALVAR */}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-grafite font-semibold text-white hover:bg-grafite/90"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}

            {isSubmitting
              ? "Salvando..."
              : business
                ? "Salvar alterações"
                : "Criar estabelecimento"}
          </Button>
        </div>
      </div>
    </form>
  );
}