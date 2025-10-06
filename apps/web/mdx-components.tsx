import type { MDXComponents } from 'mdx/types';
import defaultComponents from 'fumadocs-ui/mdx';
import { Pre, CodeBlock } from 'fumadocs-ui/components/codeblock';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { Callout } from 'fumadocs-ui/components/callout';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...defaultComponents,
    pre: ({ title, ...props }: any) => (
      <CodeBlock title={title} allowCopy>
        <Pre {...props} />
      </CodeBlock>
    ),
    Tabs,
    Tab,
    Callout,
    Card,
    Cards,
    Step,
    Steps,
    Accordion,
    Accordions,
    ...components,
  };
}
