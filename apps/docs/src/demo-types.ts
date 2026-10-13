import type { ComponentType } from 'react';

export type Demo = {
  id: string;
  title: string;
  name: string;
  category: 'action' | 'form' | 'navigation' | 'overlay' | 'feedback' | 'display';
  description: string;
  code: string;
  component: ComponentType;
  /** Source extension; not yet included in the published npm package. */
  release?: 'next';
};
