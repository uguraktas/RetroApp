import { DocsBody, DocsPage } from "fumadocs-ui/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage, getPages } from "@/lib/source";
import { useMDXComponents } from "../../../../../mdx-components";

type PageProps = {
  params: Promise<{ slug?: string[]; locale: string }>;
};

export default async function Page({ params }: PageProps) {
  const { slug, locale } = await params;
  const page = getPage(slug, locale);

  if (!page) {
    notFound();
  }

  const Mdx = page.data.body;

  return (
    <DocsPage full={page.data.full} toc={page.data.toc}>
      <DocsBody>
        <h1>{page.data.title}</h1>
        {page.data.description && <p>{page.data.description}</p>}
        <Mdx components={useMDXComponents({})} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return getPages().map((page) => ({
    slug: page.slugs,
    locale: page.locale,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const page = getPage(slug, locale);

  if (!page) {
    notFound();
  }

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
