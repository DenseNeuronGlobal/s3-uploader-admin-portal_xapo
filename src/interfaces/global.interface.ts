import {ReactNode} from 'react';

export interface IRow {
  [key: string]: string | number | Date;
}

export interface IColumn {
  title: string;
  key: string;
  render?: (row: IRow) => string | ReactNode;
  hideColumn?: boolean;
}

export interface IPath {
  title: string;
  to?: string;
  onClick?: () => void;
}
