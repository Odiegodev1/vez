"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";
import { Loader2, Pencil, Plus } from "lucide-react";

import {
  serviceSchema,
  type ServiceFormValues,
  type ServiceItem,
} from "../schemas/service-schema";


import { updateServiceAction } from "../actions/update-service-action";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { createServiceAction } from "../actions/create-service-action";

type Props = {
  service?: ServiceItem;
  onSaved?: () => void | Promise<void>;
};

const emptyValues: ServiceFormValues = {
  name: "",
  description: "",
  durationMinutes: 30,
  price: "",
  active: true,
};

function getFormValues(service?: ServiceItem): ServiceFormValues {
  if (!service) {
    return { ...emptyValues };
  }

  return {
    name: service.name ?? "",
    description: service.description ?? "",
    durationMinutes: service.durationMinutes ?? 30,
    price: service.price ?? "",
    active: service.active ?? true,
  };
}

export function DialogServicos({
  service,
  onSaved,
}: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const isEditing = Boolean(service);

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema as any),
    defaultValues: getFormValues(service),
    mode: "onChange",
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    getValues,
    formState: {
      errors,
      isSubmitting,
    },
  } = form;

  // Atualiza os dados do formulário ao abrir o modal.
  useEffect(() => {
    if (open) {
      reset(getFormValues(service));
    }
  }, [open, service, reset]);

  function handleOpenChange(value: boolean) {
    if (isSubmitting) return;

    setOpen(value);

    if (!value) {
      reset(getFormValues(service));
    }
  }

  async function onSubmit(data: ServiceFormValues) {
    try {
      const result = service
        ? await updateServiceAction(service.id, data)
        : await createServiceAction(data);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      setOpen(false);
      reset(getFormValues(service));

      // Notifica a tabela para buscar os serviços atualizados.
      window.dispatchEvent(
        new Event("vez:services-updated")
      );

      router.refresh();

      await onSaved?.();
    } catch (error) {
      console.error("[SERVICE_FORM_ERROR]", error);

      toast.error(
        "Ocorreu um erro ao salvar o serviço."
      );
    }
  }

  function onInvalid() {
    console.error(
      "[SERVICE_VALIDATION_ERROR]",
      form.formState.errors
    );

    console.log(
      "[SERVICE_FORM_VALUES]",
      getValues()
    );

    toast.error(
      "Verifique os campos do formulário."
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      {/* BOTÃO QUE ABRE O MODAL */}

      <DialogTrigger
        render={
          isEditing ? (
            <Button
              type="button"
              size="icon"
              variant="outline"
              aria-label={`Editar ${service?.name}`}
              title="Editar serviço"
            >
              <Pencil className="size-4" />
            </Button>
          ) : (
            <Button
              type="button"
              className="bg-grafite text-white hover:bg-grafite/90"
            >
              <Plus className="size-4" />
              Novo serviço
            </Button>
          )
        }
      />

      {/* CONTEÚDO DO MODAL */}

      <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-2xl sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-mono text-2xl font-bold text-grafite">
            {isEditing
              ? "Editar serviço"
              : "Novo serviço"}
          </DialogTitle>

          <DialogDescription>
            Cadastre os serviços oferecidos pelo seu
            estabelecimento e defina o tempo médio de
            atendimento.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          className="space-y-6"
          noValidate
        >
          <FieldGroup>
            {/* NOME */}

            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="service-name">
                Nome do serviço
              </FieldLabel>

              <Input
                id="service-name"
                placeholder="Ex: Corte masculino"
                autoComplete="off"
                aria-invalid={!!errors.name}
                disabled={isSubmitting}
                {...register("name")}
              />

              <FieldError errors={[errors.name]} />
            </Field>

            {/* DESCRIÇÃO */}

            <Field data-invalid={!!errors.description}>
              <FieldLabel htmlFor="service-description">
                Descrição
              </FieldLabel>

              <Input
                id="service-description"
                placeholder="Ex: Corte com máquina ou tesoura"
                autoComplete="off"
                aria-invalid={!!errors.description}
                disabled={isSubmitting}
                {...register("description")}
              />

              <FieldError
                errors={[errors.description]}
              />
            </Field>

            {/* DURAÇÃO E PREÇO */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* DURAÇÃO */}

              <Field
                data-invalid={!!errors.durationMinutes}
              >
                <FieldLabel htmlFor="service-duration">
                  Duração (minutos)
                </FieldLabel>

                <Input
                  id="service-duration"
                  type="number"
                  min={5}
                  max={480}
                  step={1}
                  placeholder="Ex: 30"
                  aria-invalid={!!errors.durationMinutes}
                  disabled={isSubmitting}
                  {...register("durationMinutes", {
                    valueAsNumber: true,
                  })}
                />

                <FieldError
                  errors={[errors.durationMinutes]}
                />
              </Field>

              {/* PREÇO */}

              <Field data-invalid={!!errors.price}>
                <FieldLabel htmlFor="service-price">
                  Preço (R$)
                </FieldLabel>

                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm font-medium text-cinzaapoio">
                    R$
                  </span>

                  <Input
                    id="service-price"
                    type="text"
                    inputMode="decimal"
                    placeholder="45,00"
                    autoComplete="off"
                    aria-invalid={!!errors.price}
                    disabled={isSubmitting}
                    className="pl-10"
                    {...register("price")}
                  />
                </div>

                <FieldError errors={[errors.price]} />
              </Field>
            </div>

            {/* STATUS DO SERVIÇO */}

            <Controller
              name="active"
              control={control}
              render={({ field }) => (
                <div className="flex items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-nevoa/40 p-4">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-grafite">
                      Serviço ativo
                    </p>

                    <p className="text-xs leading-relaxed text-cinzaapoio">
                      Quando ativo, o serviço fica
                      disponível para novos clientes
                      entrarem na fila.
                    </p>
                  </div>

                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                    aria-label="Ativar ou desativar serviço"
                  />
                </div>
              )}
            />
          </FieldGroup>

          {/* INFORMAÇÃO */}

          <div className="rounded-xl border border-zinc-200 bg-nevoa p-4">
            <p className="text-xs leading-relaxed text-cinzaapoio">
              <strong className="text-grafite">
                Sobre a duração:
              </strong>{" "}
              O tempo informado será utilizado para
              calcular a previsão de espera dos clientes
              na fila.
            </p>
          </div>

          {/* BOTÕES */}

          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-grafite text-white hover:bg-grafite/90 sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Salvando...
                </>
              ) : isEditing ? (
                <>
                  <Pencil className="size-4" />
                  Salvar alterações
                </>
              ) : (
                <>
                  <Plus className="size-4" />
                  Criar serviço
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}