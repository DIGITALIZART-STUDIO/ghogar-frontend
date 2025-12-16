export type FacetedFilter<TValue> = {
  column: string;
  title: string;
  options: Array<{
    label: string;
    value: TValue;
    icon?: React.ComponentType<{ className?: string }>;
  }>;
};
