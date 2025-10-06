import type { MDXComponents } from 'mdx/types';
import defaultComponents from 'fumadocs-ui/mdx';
import { Pre, CodeBlock } from 'fumadocs-ui/components/codeblock';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...defaultComponents,
    pre: ({ title, ...props }: any) => (
      <CodeBlock title={title} allowCopy>
        <Pre {...props} />
      </CodeBlock>
    ),
    ...components,
  };
}
