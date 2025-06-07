import React, { useState } from 'react';
import { marked } from 'marked';
import { ConventionData, FormFieldConfig } from '../types';
import { CONVENTION_FORM_FIELDS, CONVENTION_TEMPLATE_STRING } from '../constants';
import { generateConventionDocument } from '../services/documentService';
import { generateInvoiceDocument } from '../services/invoiceService'; // New import
import LoadingSpinner from './LoadingSpinner';

interface ConventionFormProps {
  data: ConventionData;
  onDataChange: (key: keyof ConventionData, value: string) => void;
  isExtracted: boolean;
  onGenerateProposal: () => void;
  isGeneratingProposal: boolean;
  commercialProposal: string | null;
  proposalError: string | null;
  hasTranscript: boolean;
}

const ConventionForm: React.FC<ConventionFormProps> = ({
  data,
  onDataChange,
  isExtracted,
  onGenerateProposal,
  isGeneratingProposal,
  commercialProposal,
  proposalError,
  hasTranscript,
}) => {
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState<boolean>(false);
  const [invoiceGenerationError, setInvoiceGenerationError] = useState<string | null>(null);

  if (!isExtracted && Object.values(data).every(val => val === '')) {
    return null;
  }

  const handleChange = (key: keyof ConventionData, value: string) => {
    onDataChange(key, value);
  };

  const handleGeneratePdfDocument = () => {
    if (!data.client_nom || !data.formation_intitule) {
      alert(
        "Veuillez renseigner au moins le nom du client et l'intitulé de la formation avant de générer la convention."
      );
      return;
    }
    generateConventionDocument(data, CONVENTION_TEMPLATE_STRING);
  };

  const getSanitizedHtml = (markdownText: string | null) => {
    if (!markdownText) return { __html: '' };
    const rawHtml = marked.parse(markdownText) as string;
    return { __html: rawHtml };
  };

  const handleGenerateInvoice = async () => {
    if (!data.client_nom || !data.formation_intitule || !data.formation_tarif_ht) {
      alert(
        "Veuillez vérifier que le nom du client, l'intitulé de la formation et le tarif HT sont renseignés avant de générer la facture."
      );
      return;
    }
    setIsGeneratingInvoice(true);
    setInvoiceGenerationError(null);
    try {
      await generateInvoiceDocument(data); // Assuming it might be async if it involves complex ops or just for consistency
    } catch (error) {
      console.error('Error generating invoice:', error);
      if (error instanceof Error) {
        setInvoiceGenerationError(error.message);
      } else {
        setInvoiceGenerationError(
          'Une erreur inconnue est survenue lors de la génération de la facture.'
        );
      }
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">2. Détails de la Convention</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {CONVENTION_FORM_FIELDS.map((field: FormFieldConfig) => (
          <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
            <label htmlFor={field.key} className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                id={field.key}
                name={field.key}
                rows={field.rows || 3}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                placeholder={field.placeholder}
                value={data[field.key]}
                onChange={e => handleChange(field.key, e.target.value)}
                aria-label={field.label}
              />
            ) : (
              <input
                type={field.type || 'text'}
                id={field.key}
                name={field.key}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                placeholder={field.placeholder}
                value={data[field.key]}
                onChange={e => handleChange(field.key, e.target.value)}
                step={field.type === 'number' ? '0.01' : undefined}
                aria-label={field.label}
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={handleGeneratePdfDocument}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-md shadow-sm transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          aria-label="Générer la convention au format PDF"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1h-2.586l-2.707-2.707a1 1 0 00-.707-.293H7a1 1 0 01-1-1V4zm2 0v9h4.586l2.707 2.707a.997.997 0 00.707.293H15V4H6z"
              clipRule="evenodd"
            />
            <path d="M8.75 10.75a.75.75 0 001.5 0V8.354l.354.353a.75.75 0 001.06-1.06l-1.5-1.5a.75.75 0 00-1.061 0l-1.5 1.5a.75.75 0 101.061 1.06l.353-.353V10.75z" />
          </svg>
          Générer la Convention (.pdf)
        </button>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          3. Proposition Commerciale Assistée par IA
        </h2>
        <button
          onClick={onGenerateProposal}
          disabled={isGeneratingProposal || !hasTranscript}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md shadow-sm transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          aria-label="Générer la proposition commerciale à partir de la transcription"
        >
          {isGeneratingProposal ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Génération en cours...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.663 17h4.673M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 10h.01M15 10h.01M9 14h.01M15 14h.01"
                />
              </svg>
              Générer la Proposition Commerciale
            </>
          )}
        </button>
        {isGeneratingProposal && (
          <div className="mt-4">
            <LoadingSpinner />
          </div>
        )}
        {proposalError && (
          <div
            className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md"
            role="alert"
          >
            <p className="font-bold">Erreur de Génération de Proposition</p>
            <p>{proposalError}</p>
          </div>
        )}
        {commercialProposal && !isGeneratingProposal && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Proposition Générée :</h3>
            <div
              className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none p-3 border border-gray-300 rounded-md bg-gray-50 h-96 overflow-y-auto focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
              dangerouslySetInnerHTML={getSanitizedHtml(commercialProposal)}
              aria-label="Proposition commerciale générée"
            />
          </div>
        )}
      </div>

      {/* Section 4: Facturation */}
      {commercialProposal && !isGeneratingProposal && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">4. Facturation</h2>
          <button
            onClick={handleGenerateInvoice}
            disabled={isGeneratingInvoice}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-md shadow-sm transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            aria-label="Créer la facture au format PDF"
          >
            {isGeneratingInvoice ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Génération de la facture...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path
                    fillRule="evenodd"
                    d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h2a1 1 0 100-2H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Créer la Facture (.pdf)
              </>
            )}
          </button>
          {isGeneratingInvoice && (
            <div className="mt-4">
              <LoadingSpinner />
            </div>
          )}
          {invoiceGenerationError && (
            <div
              className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md"
              role="alert"
            >
              <p className="font-bold">Erreur de Génération de Facture</p>
              <p>{invoiceGenerationError}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConventionForm;
