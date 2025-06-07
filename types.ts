export interface ConventionData {
  numero_convention: string;
  client_nom: string;
  client_adresse: string;
  client_representant: string;
  client_fonction: string;
  formation_intitule: string;
  formation_duree: string;
  formation_dates: string;
  formation_lieu: string;
  participants: string;
  formation_tarif_ht: string;
  montant_tva: string;
  formation_tarif_ttc: string;
  date_signature: string;
}

export interface FormFieldConfig {
  key: keyof ConventionData;
  label: string;
  placeholder: string;
  type?: 'text' | 'number' | 'date' | 'textarea';
  rows?: number; // for textarea
}
