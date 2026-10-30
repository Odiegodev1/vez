import { notFound } from "next/navigation";

import { getPublicQueueAction } from "./actions/get-public-queue-action";

import { HeaderComponents } from "./components/headercomponents";
import { CtaComponents } from "./components/CtaComponents";
import { FormCompoents } from "./components/FormCompoents";

export const instant = false;

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PageSlug({ params }: Props) {
  const { slug } = await params;

  const data = await getPublicQueueAction(slug);

  if (!data) {
    notFound();
  }

  return (
    <main className="min-h-dvh w-full overflow-x-hidden bg-nevoa text-grafite">
      <div className="mx-auto w-full max-w-2xl px-4 pb-10 pt-4 sm:px-6 sm:pt-7">
        <HeaderComponents
          name={data.business.name}
          logoUrl={data.business.logoUrl}
          isOpen={data.isOpen}
        />

        <div className="mt-8 sm:mt-12">
          <CtaComponents
            waiting={data.waiting}
            isOpen={data.isOpen}
            isFull={data.isFull}
          />
        </div>

        <div className="mt-7">
          <FormCompoents slug={slug} data={data} />
        </div>

        <footer className="pb-4 pt-8 text-center text-xs text-cinzaapoio">
          Fila organizada com Vez
        </footer>
      </div>
    </main>
  );
}