import { ReactNode } from "react";

export interface IColumn {
  title: string;
  key: string;
  render?: (row: any) => string | ReactNode
}

export interface IPath {
  title: string
  to?: string
  onClick?: () => void
}
