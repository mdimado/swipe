import React, { useState } from 'react';
import { FileUploadModal } from './components/FileUploadModal';
import { InvoicesTable } from './components/TableBase';
import { ProductsTable } from './components/TableBase';
import { CustomersTable } from './components/TableBase';
import { FaFileUpload } from 'react-icons/fa';

function App() {
  const [activeTab, setActiveTab] = useState('invoices');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [extractedData, setExtractedData] = useState({
    invoices: [],
    products: [],
    customers: []
  });

  const tabs = [
    { name: 'Invoices', key: 'invoices' },
    { name: 'Products', key: 'products' },
    { name: 'Customers', key: 'customers' }
  ];

  const handleDataExtracted = (data) => {
    console.log('Extracted Data in App:', data);
    setExtractedData({
      invoices: data.data?.invoices || [],
      products: data.data?.products || [],
      customers: data.data?.customers || []
    });
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.key 
                    ? 'bg-primary-500 text-white' 
                    : 'text-gray-600 hover:bg-primary-50'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center bg-primary-700 text-white px-4 py-2 rounded-md hover:bg-primary-500 transition-colors"
          >
            <FaFileUpload className="mr-2" /> Upload File
          </button>
        </div>

        {activeTab === 'invoices' && <InvoicesTable data={extractedData.invoices} />}
        {activeTab === 'products' && <ProductsTable data={extractedData.products} />}
        {activeTab === 'customers' && <CustomersTable data={extractedData.customers} />}

        <FileUploadModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          onDataExtracted={handleDataExtracted}
        />
      </div>
    </div>
  );
}

export default App;