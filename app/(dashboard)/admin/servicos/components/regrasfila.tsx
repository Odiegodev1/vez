"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  queueRulesSchema,
  type QueueRulesValues,
} from "../schemas/queue-rules-schema"

import { getQueueRulesAction } from "../actions/get-queue-rules-action";
import { updateQueueRulesAction } from "../actions/update-queue-rules-action";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

import {
  Loader2,
  Save,
  Settings2,
} from "lucide-react";

const initialValues: QueueRulesValues = {
  maxWaiting: 20,
  notifyAhead: 2,
};

export function RegrasFila() {
  const [loading, setLoading] = useState(true);

  const form = useForm<QueueRulesValues>({
    resolver: zodResolver(queueRulesSchema),
    defaultValues: initialValues,
    mode: "onBlur",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
      isDirty,
    },
  } = form;

  const loadRules = useCallback(async () => {
    setLoading(true);

    try {
      const result = await getQueueRulesAction();

      if (!result.success || !result.rules) {
        toast.error(
          result.success
            ? "Não foi possível carregar as regras."
            : result.message
        );
        return;
      }

      reset(result.rules);
    } catch {
      toast.error("Erro ao carregar as regras da fila.");
    } finally {
      setLoading(false);
    }
  }, [reset]);

  useEffect(() => {
    void loadRules();
  }, [loadRules]);

  async function onSubmit(data: QueueRulesValues) {
    try {
      const result = await updateQueueRulesAction(data);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      reset(data);
    } catch {
      toast.error("Erro ao salvar as regras da fila.");
    }
  }

  return (
    <section className="h-fit w-full rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm lg:w-[340px] lg:shrink-0">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-nevoa">
          <Settings2 className="size-5 text-grafite" />
        </div>

        <div>
          <h2 className="font-mono text-2xl font-bold text-grafite">
            Regras da fila
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Configure os limites e avisos aos clientes.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-5">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          <Field data-invalid={!!errors.maxWaiting}>
            <FieldLabel htmlFor="maxWaiting">
              Limite de pessoas na fila
            </FieldLabel>

            <Input
              id="maxWaiting"
              type="number"
              min={1}
              max={200}
              placeholder="Ex: 20"
              {...register("maxWaiting", {
                valueAsNumber: true,
              })}
            />

            <FieldDescription>
              Número máximo de clientes aguardando.
            </FieldDescription>

            <FieldError errors={[errors.maxWaiting]} />
          </Field>

          <Field data-invalid={!!errors.notifyAhead}>
            <FieldLabel htmlFor="notifyAhead">
              Avisar no WhatsApp quando faltarem
            </FieldLabel>

            <Input
              id="notifyAhead"
              type="number"
              min={1}
              max={20}
              placeholder="Ex: 2 pessoas"
              {...register("notifyAhead", {
                valueAsNumber: true,
              })}
            />

            <FieldDescription>
              Quantas pessoas devem estar à frente quando
              o cliente receber o aviso.
            </FieldDescription>

            <FieldError errors={[errors.notifyAhead]} />
          </Field>

          <Button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className="h-11 w-full bg-grafite font-semibold text-white hover:bg-grafite/90"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}

            {isSubmitting
              ? "Salvando..."
              : "Salvar alterações"}
          </Button>
        </form>
      )}
    </section>
  );
}