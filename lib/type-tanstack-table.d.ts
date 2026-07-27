import "@tanstack/react-table"

declare module "@tanstack/react-table" {
  interface TableMeta<TData> {
    updateData: (
      rowIndex: number,
      columnId: string,
      value: unknown
    ) => void   
  }
}