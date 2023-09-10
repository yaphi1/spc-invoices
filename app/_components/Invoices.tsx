import styles from '../invoices.module.css';
import { InvoiceData } from "../_utils/types";

export default function Invoices({ invoiceData }: { invoiceData?: InvoiceData }) {
  if (!invoiceData?.customerData || !invoiceData.metadata) {
    return;
  }
  const { customerData } = invoiceData;
  const { month, year } = invoiceData.metadata;

  return (
    <div>
      {customerData.map((customer, i) => {
        const fullName = customer['Full Name'];
        const addressLine1 = customer['Address Line 1'];
        const addressLine2 = customer['Address Line 2'];
        const city = customer['City'];
        const state = customer['State'];
        const zip = customer['Zip'];
        const location = customer['Location'];
        const totalOwed = customer['Total Owed'];

        return (
          <div key={i} className={styles.invoice}>
            <div>Invoice period: {month} {year}</div>
            -
            <div>Name: {fullName}</div>
            -
            <div>
              <div>Address:</div>
              <div>{addressLine1}</div>
              <div>{addressLine2}</div>
              <div>{city}, {state} {zip}</div>
            </div>
            -
            <div>Parking Location: {location}</div>
            -
            <div>Total Owed: ${totalOwed}</div>
          </div>
        );
      })}
    </div>
  );
}
