import React from 'react';

const TableBase = ({ columns, data, title }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No {title.toLowerCase()} data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <table className="w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th 
                key={col} 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              {Object.values(row).map((value, cellIdx) => (
                <td 
                  key={cellIdx} 
                  className="px-4 py-3 whitespace-nowrap text-sm text-gray-600"
                >
                  {value || 'N/A'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const InvoicesTable = ({ data }) => (
  <TableBase 
    title="Invoices" 
    columns={['Serial Number', 'Customer Name', 'Product Name', 'Quantity', 'Tax', 'Total Amount', 'Date']} 
    data={data || []} 
  />
);

export const ProductsTable = ({ data }) => (
  <TableBase 
    title="Products" 
    columns={['Product Name', 'Category', 'Unit Price', 'Tax', 'Price with Tax', 'Stock Quantity']} 
    data={data || []} 
  />
);

export const CustomersTable = ({ data }) => (
  <TableBase 
    title="Customers" 
    columns={['Customer Name', 'Phone Number', 'Total Purchase Amount']} 
    data={data || []} 
  />
);