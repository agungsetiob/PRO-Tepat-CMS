export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  type: 'tempat' | 'acara' | 'penghormatan';
}

export interface Protocol {
  id: number;
  title: string;
  content: string;
  image_infographic?: string;
  references: string[];
  seating_rules?: SeatingRule[];
}

export interface SeatingRule {
  id: number;
  position_label: string;
  jabatan: string;
  note?: string;
  order: number;
}

export interface Scenario {
  id: number;
  title: string;
  slug: string;
  description?: string;
  layout_type: 'berjajar' | 'melingkar' | 'custom';
  jenis_acara: 'resmi' | 'kenegaraan' | 'tidak_resmi';
  category?: Category;
  protocols?: Protocol[];
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
  auth: {
    user: User;
  };
};