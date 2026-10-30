import type { ReactNode } from "react";

interface SettingsSectionProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function SettingsSection({
  title,
  description,
  children,
}: SettingsSectionProps) {
  return (
    <section className="rounded-2xl border border-[#e2e5df] bg-white p-5 md:p-7">
      <div className="mb-6 border-b border-[#e2e5df] pb-5">
        <h2 className="text-xl font-bold tracking-tight text-grafite">
          {title}
        </h2>

        <p className="mt-1 text-sm text-cinzaapoio">
          {description}
        </p>
      </div>

      {children}
    </section>
  );
}