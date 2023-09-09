import { InvoiceData } from "../_utils/types";

export function DebugTable({ invoiceData }: { invoiceData?: InvoiceData }) {
  return (
    <table>
      <tbody>
        {invoiceData?.customerData.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j}>{cell.cellValue}</td>)
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
