"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { ServiceItem } from "../schemas/service-schema";

import { getServicesAction } from "../actions/get-services-action";
import { deleteServiceAction } from "../actions/delete-service-action";

import { DialogServicos } from "./DialogServicos";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Clock3,
  Loader2,
  Scissors,
  Trash2,
} from "lucide-react";

const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function TabelaServicos() {
  const router = useRouter();

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // =====================================================
  // BUSCAR SERVIÇOS
  // =====================================================

  const loadServices = useCallback(async () => {
    setLoading(true);

    try {
      const result = await getServicesAction();

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      setServices(result.services);
    } catch (error) {
      console.error("[LOAD_SERVICES_ERROR]", error);

      toast.error("Erro ao carregar os serviços.");
    } finally {
      setLoading(false);
    }
  }, []);

  // =====================================================
  // CARREGAMENTO INICIAL
  // =====================================================

  useEffect(() => {
    void loadServices();
  }, [loadServices]);

  // =====================================================
  // ATUALIZAÇÃO APÓS CRIAR OU EDITAR
  // =====================================================

  useEffect(() => {
    function handleServicesUpdated() {
      void loadServices();
    }

    window.addEventListener(
      "vez:services-updated",
      handleServicesUpdated
    );

    return () => {
      window.removeEventListener(
        "vez:services-updated",
        handleServicesUpdated
      );
    };
  }, [loadServices]);

  // =====================================================
  // DESATIVAR SERVIÇO
  // =====================================================

  async function handleDelete(service: ServiceItem) {
    if (!service.active) {
      return;
    }

    const confirmed = window.confirm(
      `Deseja desativar o serviço "${service.name}"?\n\n` +
        "O serviço não ficará disponível para novos clientes, " +
        "mas seu histórico será preservado."
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(service.id);

    try {
      const result = await deleteServiceAction(service.id);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      await loadServices();

      router.refresh();
    } catch (error) {
      console.error("[DELETE_SERVICE_ERROR]", error);

      toast.error("Erro ao desativar serviço.");
    } finally {
      setDeletingId(null);
    }
  }

  // =====================================================
  // ESTATÍSTICAS
  // =====================================================

  const totalServices = services.length;

  const activeServices = services.filter(
    (service) => service.active
  ).length;

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <section className="min-w-0 flex-1 space-y-4 rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-44" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        <Skeleton className="h-4 w-36" />

        <div className="space-y-3 pt-4">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton
              key={item}
              className="h-16 w-full rounded-xl"
            />
          ))}
        </div>
      </section>
    );
  }

  // =====================================================
  // COMPONENTE
  // =====================================================

  return (
    <section className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
      {/* CABEÇALHO */}

      <div className="flex items-center justify-between gap-4 border-b border-zinc-100 p-5">
        <div>
          <h2 className="font-mono text-xl font-bold text-grafite">
            Serviços cadastrados
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {totalServices}{" "}
            {totalServices === 1
              ? "serviço cadastrado"
              : "serviços cadastrados"}
          </p>
        </div>

        <Badge
          variant="secondary"
          className="shrink-0 bg-lima/20 font-semibold text-grafite"
        >
          {activeServices} ativos
        </Badge>
      </div>

      {/* ESTADO VAZIO */}

      {services.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-nevoa">
            <Scissors className="size-6 text-grafite" />
          </div>

          <h3 className="font-mono text-xl font-bold text-grafite">
            Nenhum serviço cadastrado
          </h3>

          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Cadastre seu primeiro serviço para começar a organizar
            os atendimentos da fila.
          </p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[680px] text-left">
            {/* CABEÇALHO DA TABELA */}

            <thead className="border-b border-zinc-100 bg-nevoa/60">
              <tr className="text-sm text-cinzaapoio">
                <th className="px-5 py-4 font-semibold">
                  Serviço
                </th>

                <th className="px-4 py-4 font-semibold">
                  Duração
                </th>

                <th className="px-4 py-4 font-semibold">
                  Preço
                </th>

                <th className="px-4 py-4 font-semibold">
                  Status
                </th>

                <th className="px-5 py-4 text-right font-semibold">
                  Ações
                </th>
              </tr>
            </thead>

            {/* SERVIÇOS */}

            <tbody className="divide-y divide-zinc-100">
              {services.map((service) => {
                const initials = service.name
                  .trim()
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((part) => part.charAt(0))
                  .join("")
                  .toUpperCase();

                return (
                  <tr
                    key={service.id}
                    className="transition-colors hover:bg-nevoa/40"
                  >
                    {/* NOME E DESCRIÇÃO */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-grafite font-mono font-bold text-lima">
                          {initials || "SV"}
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold text-grafite">
                            {service.name}
                          </p>

                          <p className="max-w-[220px] truncate text-sm text-muted-foreground">
                            {service.description ||
                              "Sem descrição"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* DURAÇÃO */}

                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm text-grafite">
                        <Clock3 className="size-4 text-cinzaapoio" />

                        {service.durationMinutes} min
                      </span>
                    </td>

                    {/* PREÇO */}

                    <td className="px-4 py-4 font-semibold whitespace-nowrap text-grafite">
                      {moneyFormatter.format(
                        Number(service.price)
                      )}
                    </td>

                    {/* STATUS */}

                    <td className="px-4 py-4">
                      <Badge
                        variant={
                          service.active
                            ? "default"
                            : "secondary"
                        }
                        className={
                          service.active
                            ? "bg-lima text-grafite hover:bg-lima"
                            : "bg-zinc-100 text-zinc-600"
                        }
                      >
                        {service.active
                          ? "Ativo"
                          : "Inativo"}
                      </Badge>
                    </td>

                    {/* AÇÕES */}

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* EDITAR */}

                        <DialogServicos
                          service={service}
                        />

                        {/* DESATIVAR */}

                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          disabled={
                            deletingId === service.id ||
                            !service.active
                          }
                          onClick={() =>
                            void handleDelete(service)
                          }
                          aria-label={`Desativar ${service.name}`}
                          title={
                            service.active
                              ? "Desativar serviço"
                              : "Serviço já está inativo"
                          }
                          className="text-red-500 hover:bg-red-50 hover:text-red-600"
                        >
                          {deletingId === service.id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Trash2 className="size-4" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}