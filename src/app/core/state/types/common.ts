export interface LoadingResult {
  success: boolean;
  loading: boolean;
  error: boolean;
}

export interface IMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

export type Tab = {
  tabElement?: React.ReactNode;
  name: string;
  component?: React.ReactElement;
};
