import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FaCloudUploadAlt, FaFilePdf, FaFileExcel, FaImage, FaSpinner } from 'react-icons/fa';
import axios from 'axios';

export const FileUploadModal = ({ isOpen, onClose, onDataExtracted }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
    setExtractedData(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:8000/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setExtractedData(response.data);
      onDataExtracted(response.data);
      console.log('Extracted Data:', response.data);
    } catch (err) {
      setError('File upload failed');
      console.error('Upload error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const FileIcon = () => {
    if (!selectedFile) return null;
    if (selectedFile.name.endsWith('.pdf')) return <FaFilePdf className="text-red-500" />;
    if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) return <FaFileExcel className="text-green-500" />;
    if (selectedFile.name.endsWith('.png') || selectedFile.name.endsWith('.jpg') || selectedFile.name.endsWith('.jpeg')) return <FaImage className="text-blue-500" />;
    return null;
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex items-center"
                >
                  <FaCloudUploadAlt className="mr-2 text-primary-500" /> 
                  Upload File
                </Dialog.Title>
                
                <div className="mt-4">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FaCloudUploadAlt className="w-10 h-10 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          {selectedFile 
                            ? `Selected: ${selectedFile.name}` 
                            : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-gray-400">
                          PDF, Excel, Image files supported
                        </p>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept=".pdf,.xlsx,.xls,.png,.jpg,.jpeg"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  
                  {selectedFile && (
                    <div className="mt-4 flex items-center space-x-2">
                      <FileIcon />
                      <span className="text-sm">{selectedFile.name}</span>
                    </div>
                  )}

                  {error && (
                    <div className="mt-4 text-red-500">
                      {error}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex space-x-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-primary-100 px-4 py-2 text-sm font-medium text-primary-900 hover:bg-primary-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 relative"
                    onClick={handleUpload}
                    disabled={!selectedFile || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Uploading...
                      </>
                    ) : (
                      'Upload'
                    )}
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 focus:outline-none"
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};