"use client";

import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  memberSchema,
  type MemberFormValues,
  type TeamMember,
} from "../schemas/member-schema";

import { getMembersAction } from "../actions/get-members-action";
import { addMemberAction } from "../actions/add-member-action";
import { removeMemberAction } from "../actions/remove-member-action";
import { updateMemberRoleAction } from "../actions/update-member-role-action";

import { SettingsSection } from "./settings-section";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

import {
  Plus,
  Trash2,
  Users,
  Crown,
  Loader2,
  Copy,
  RefreshCw,
} from "lucide-react";

const roleLabels = {
  OWNER: "Proprietário",
  MANAGER: "Gerente",
  STAFF: "Funcionário",
};

export function MembersSettings() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [invitePath, setInvitePath] = useState<string | null>(null);

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),

    defaultValues: {
      name: "",
      email: "",
      role: "STAFF",
    },
  });

  const loadMembers = useCallback(async () => {
    setLoading(true);

    try {
      const result = await getMembersAction();

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      setMembers(result.members);
    } catch {
      toast.error("Erro ao carregar a equipe.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMembers();
  }, [loadMembers]);

  async function onSubmit(data: MemberFormValues) {
    const result = await addMemberAction(data);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);

    setInvitePath(result.invitePath);

    form.reset();
    setOpen(false);

    await loadMembers();
  }

  async function handleRemove(member: TeamMember) {
    if (member.isOwner) return;

    const confirmed = window.confirm(
      member.status === "ACTIVE"
        ? `Remover ${member.name} da equipe?`
        : `Cancelar o convite de ${member.name}?`
    );

    if (!confirmed) return;

    setBusyId(member.id);

    try {
      const result = await removeMemberAction({
        memberId: member.id,
        status: member.status,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      await loadMembers();
    } finally {
      setBusyId(null);
    }
  }

  async function handleRoleChange(
    member: TeamMember,
    role: "MANAGER" | "STAFF"
  ) {
    if (member.isOwner) return;

    setBusyId(member.id);

    try {
      const result = await updateMemberRoleAction({
        memberId: member.id,
        role,
        status: member.status,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      await loadMembers();
    } finally {
      setBusyId(null);
    }
  }

  async function copyInvite() {
    if (!invitePath) return;

    try {
      const url = new URL(invitePath, window.location.origin);

      await navigator.clipboard.writeText(url.toString());

      toast.success("Link do convite copiado!");
    } catch {
      toast.error("Não foi possível copiar o link.");
    }
  }

  return (
    <SettingsSection
      title="Equipe e membros"
      description="Gerencie os acessos e convites do seu estabelecimento."
    >
      <div className="space-y-6">
        {/* CABEÇALHO */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-nevoa">
              <Users className="size-5 text-grafite" />
            </div>

            <div>
              <p className="font-semibold text-grafite">
                Membros da equipe
              </p>

              <p className="text-sm text-cinzaapoio">
                {members.filter((m) => m.status === "ACTIVE").length} ativos
                {" · "}
                {members.filter((m) => m.status === "PENDING").length} pendentes
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={loading}
              onClick={() => void loadMembers()}
              aria-label="Atualizar equipe"
            >
              <RefreshCw className="size-4" />
            </Button>

            <Dialog
              open={open}
              onOpenChange={(value) => {
                setOpen(value);

                if (!value) {
                  form.reset();
                }
              }}
            >
              <DialogTrigger render={     <Button className="bg-grafite text-white hover:bg-grafite/90">
                  <Plus className="size-4" />
                  Adicionar membro
                </Button>}>
           
              </DialogTrigger>

              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    Convidar membro
                  </DialogTitle>

                  <DialogDescription>
                    Informe os dados e defina o nível de acesso.
                  </DialogDescription>
                </DialogHeader>

                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  <Field data-invalid={!!form.formState.errors.name}>
                    <FieldLabel htmlFor="member-name">
                      Nome completo
                    </FieldLabel>

                    <Input
                      id="member-name"
                      placeholder="Ex: Rafael Santos"
                      {...form.register("name")}
                    />

                    <FieldError
                      errors={[form.formState.errors.name]}
                    />
                  </Field>

                  <Field data-invalid={!!form.formState.errors.email}>
                    <FieldLabel htmlFor="member-email">
                      E-mail
                    </FieldLabel>

                    <Input
                      id="member-email"
                      type="email"
                      placeholder="rafael@email.com"
                      {...form.register("email")}
                    />

                    <FieldError
                      errors={[form.formState.errors.email]}
                    />
                  </Field>

                  <Controller
                    name="role"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>
                          Permissão
                        </FieldLabel>

                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>

                          <SelectContent>
                            <SelectItem value="STAFF">
                              Funcionário
                            </SelectItem>

                            <SelectItem value="MANAGER">
                              Gerente
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        <FieldError errors={[fieldState.error]} />
                      </Field>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpen(false)}
                    >
                      Cancelar
                    </Button>

                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                      className="bg-grafite text-white"
                    >
                      {form.formState.isSubmitting && (
                        <Loader2 className="size-4 animate-spin" />
                      )}

                      Criar convite
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* LINK DO CONVITE */}

        {invitePath && (
          <div className="rounded-xl border border-lima bg-lima/10 p-4">
            <p className="font-semibold text-grafite">
              Convite criado!
            </p>

            <p className="mt-1 text-sm text-cinzaapoio">
              Copie o link e envie à pessoa convidada.
            </p>

            <div className="mt-3 flex items-center gap-2">
              <Input
                readOnly
                type="text"
                value={invitePath}
                className="bg-white"
              />

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={copyInvite}
                aria-label="Copiar convite"
              >
                <Copy className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* LISTA */}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <Skeleton
                key={item}
                className="h-20 w-full rounded-xl"
              />
            ))}
          </div>
        ) : members.length === 0 ? (
          <div className="rounded-xl border border-dashed p-10 text-center">
            <Users className="mx-auto size-9 text-cinzaapoio" />

            <p className="mt-3 font-semibold text-grafite">
              Nenhum membro encontrado
            </p>

            <p className="mt-1 text-sm text-cinzaapoio">
              Adicione pessoas para gerenciar seu estabelecimento.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-[#e2e5df]">
            {members.map((member, index) => (
              <div
                key={`${member.status}-${member.id}`}
                className={`flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between ${
                  index !== members.length - 1
                    ? "border-b border-[#e2e5df]"
                    : ""
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-grafite font-bold text-lima">
                    {member.name
                      .split(" ")
                      .slice(0, 2)
                      .map((part) => part.charAt(0))
                      .join("")
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-grafite">
                        {member.name}
                      </p>

                      {member.isOwner && (
                        <Crown className="size-4 text-amber-500" />
                      )}

                      <Badge
                        variant={
                          member.status === "ACTIVE"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {member.status === "ACTIVE"
                          ? "Ativo"
                          : "Pendente"}
                      </Badge>
                    </div>

                    <p className="truncate text-sm text-cinzaapoio">
                      {member.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-14 sm:pl-0">
                  {member.isOwner ? (
                    <Badge variant="secondary">
                      Proprietário
                    </Badge>
                  ) : (
                    <>
                      <Select
                        value={member.role}
                        disabled={busyId === member.id}
                        onValueChange={(value) =>
                          void handleRoleChange(
                            member,
                            value as "MANAGER" | "STAFF"
                          )
                        }
                      >
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="MANAGER">
                            {roleLabels.MANAGER}
                          </SelectItem>

                          <SelectItem value="STAFF">
                            {roleLabels.STAFF}
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        disabled={busyId === member.id}
                        onClick={() => void handleRemove(member)}
                        aria-label={`Remover ${member.name}`}
                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      >
                        {busyId === member.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Trash2 className="size-4" />
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SettingsSection>
  );
}