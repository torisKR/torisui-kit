import type { ComponentType } from 'react';

export type Demo = {
  id: string;
  title: string;
  name: string;
  category: 'action' | 'form' | 'navigation' | 'overlay' | 'feedback' | 'display';
  description: string;
  code: string;
  component: ComponentType;
  /** First published npm version for recently added components. */
  release?: '0.6.0';
};
