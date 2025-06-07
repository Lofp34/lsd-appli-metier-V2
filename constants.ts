import { FormFieldConfig, ConventionData } from './types';

export const CONVENTION_FORM_FIELDS: FormFieldConfig[] = [
  {
    key: 'numero_convention',
    label: 'Numéro de Convention',
    placeholder: 'SLS-YYYY-MM-DD-XXX',
    type: 'text',
  },
  {
    key: 'client_nom',
    label: 'Nom du Client',
    placeholder: "Nom de l'entreprise cliente",
    type: 'text',
  },
  {
    key: 'client_adresse',
    label: 'Adresse du Client',
    placeholder: 'Adresse complète du client',
    type: 'textarea',
    rows: 2,
  },
  {
    key: 'client_representant',
    label: 'Représentant du Client',
    placeholder: 'Nom du représentant',
    type: 'text',
  },
  {
    key: 'client_fonction',
    label: 'Fonction du Représentant',
    placeholder: 'Fonction du représentant',
    type: 'text',
  },
  {
    key: 'formation_intitule',
    label: 'Intitulé de la Formation',
    placeholder: 'Ex: Bootcamp Commercial Minifel',
    type: 'textarea',
    rows: 2,
  },
  {
    key: 'formation_duree',
    label: 'Durée de la Formation',
    placeholder: 'Ex: 1h par personne / X jours',
    type: 'text',
  },
  {
    key: 'formation_dates',
    label: 'Dates de Formation',
    placeholder: 'Ex: Semaine du 16 Septembre',
    type: 'text',
  },
  {
    key: 'formation_lieu',
    label: 'Lieu de la Formation',
    placeholder: 'Ex: Locaux Minifel / Distanciel',
    type: 'text',
  },
  {
    key: 'participants',
    label: 'Participants',
    placeholder: 'Ex: 4 commerciaux, 1 apprentie. Noms...',
    type: 'textarea',
    rows: 3,
  },
  { key: 'formation_tarif_ht', label: 'Montant HT (€)', placeholder: '0.00', type: 'number' },
  { key: 'montant_tva', label: 'Montant TVA (20%) (€)', placeholder: '0.00', type: 'number' },
  { key: 'formation_tarif_ttc', label: 'Montant TTC (€)', placeholder: '0.00', type: 'number' },
  { key: 'date_signature', label: 'Date de Signature', placeholder: 'JJ/MM/AAAA', type: 'date' },
];

export const INITIAL_CONVENTION_DATA: ConventionData = {
  numero_convention: '',
  client_nom: '',
  client_adresse: '',
  client_representant: '',
  client_fonction: '',
  formation_intitule: '',
  formation_duree: '',
  formation_dates: '',
  formation_lieu: '',
  participants: '',
  formation_tarif_ht: '',
  montant_tva: '',
  formation_tarif_ttc: '',
  date_signature: '',
};

export const CONVENTION_TEMPLATE_STRING: string = `
LAURENT SERRE DÉVELOPPEMENT
CONVENTION DE FORMATION N°SLS - <<numero_convention>>
CONDITIONS PARTICULIÈRES – TARIF EN VIGUEUR JUSQU'AU 31/12/2025

Entre l'organisme de formation : la société SARL LAURENT SERRE, ayant son activité
au 259 rue de la Lavande, 34130 MAUGUIO, immatriculée au RCS de MONTPELLIER
435292941, dont la déclaration d'activité a été enregistrée sous le numéro 91340863434,
numéro intracommunautaire FR34435292941, code APE 4778A, exerçant sous l'enseigne
LAURENT SERRE DÉVELOPPEMENT, et représentée par Laurent SERRE.

Ci-après désigné « Laurent Serre Développement »

Et : <<client_nom>>, dont le siège social est situé à <<client_adresse>>, représenté par
<<client_representant>> en qualité de <<client_fonction>>.

Ci-après désigné « le Client »
____________________________________________________________________________________________________________
Article 1 – Objet de la convention

La présente convention a pour objet la réalisation d'une formation intitulée :
<<formation_intitule>>

Nature de l'action de formation : Action d'adaptation et de développement des compétences
des salariés.
Formule : Forfait sur mesure – technique de vente et de communication.
____________________________________________________________________________________________________________
Article 2 – Modalités d'exécution

• Durée de la formation : <<formation_duree>> par personne.
• Dates de formation : <<formation_dates>>.
• Lieu de la formation : <<formation_lieu>>.
• Intervenant : Laurent Serre
____________________________________________________________________________________________________________
Article 3 – Participants

• <<participants>>
____________________________________________________________________________________________________________
Article 4 – Conditions financières

• Montant HT : <<formation_tarif_ht>> euros
• TVA (20%) : <<montant_tva>> euros
• Montant TTC : <<formation_tarif_ttc>> euros

Tous les frais annexes liés à la prestation de formation, incluant notamment les frais de
déplacement, d'hébergement et de restauration du formateur, sont intégralement à la charge
du client. Ces frais feront l'objet d'une facturation distincte, sur présentation des justificatifs
correspondants.

Mode de paiement : Virement
RIB : 16607 00433 40001057063 93
IBAN : FR76 1660 7004 3340 0010 5706 393
BIC : CCBPFRPPPPG

Conditions de règlement : Facturation totale avant l'entrée en formation. Règlement en
une fois à la signature de la convention.

Fait en 2 exemplaires, à MONTPELLIER, le <<date_signature>>

Pour le Client :
Nom : <<client_representant>>
Fonction : <<client_fonction>>
Signature :
____________________________________


ATTENTION UNE DEUXIÈME SIGNATURE EST REQUISE EN PAGE 10 DE CE
DOCUMENT

Pour le Prestataire :
Nom : Laurent Serre
Fonction : Dirigeant
Signature :
____________________________________
`;

export const COMMERCIAL_PROPOSAL_SYSTEM_INSTRUCTION: string = `Tu es un expert hybride à la croisée de 4 disciplines :
– Psychologie comportementale appliquée,
– Persuasion éthique (influence, biais cognitifs, décision),
– Storytelling stratégique et communication d’impact,
– Vente consultative orientée solution et co-construction.

🎯 Mission

Ta mission est d’accompagner un expert en développement commercial (Laurent Serre) à :
	•	Décrypter en profondeur les entretiens de vente avec ses prospects,
	•	Identifier les signaux faibles émotionnels, les biais cognitifs activés, les objections latentes,
	•	Détecter les opportunités narratives et stratégiques pour bâtir une proposition commerciale percutante,
	•	Proposer une reformulation qui maximise l’adhésion tout en restant alignée avec les besoins profonds du client.

🧩 Ta posture

Tu agis comme :
	•	Un analyste comportemental : tu repères les formulations-clés, les émotions implicites, les zones de désengagement ou d’adhésion.
	•	Un stratège de la persuasion : tu mobilises les leviers d’engagement, d’autorité, de rareté ou de preuve sociale de manière éthique et personnalisée.
	•	Un concepteur de message : tu construis des récits convaincants à partir des éléments réels extraits de l’entretien (problèmes, besoins, aspirations).
	•	Un architecte de la décision : tu structures la proposition pour favoriser la prise de décision du prospect avec fluidité.

🛠️ Capacités attendues
	•	Repérer les leviers psychologiques activés ou manquants.
	•	Reformuler les messages commerciaux en les rendant plus impactants et crédibles.
	•	Identifier les incohérences, les signaux faibles, ou les oublis critiques dans la proposition.
	•	Synthétiser en un plan clair, structuré et séduisant sur le fond comme sur la forme.

⚠️ Contraintes
	•	Tu recours à tous les leviers de l'influence, et en premier lieu aux biais cognitifs que tu nommes explicitement.
	•	Tes propositions doivent rester fidèles au discours du prospect (tu ne crées pas des besoins fictifs).
	•	Tu privilégies la clarté, la structure et l’élégance de formulation.
	•	Tes suggestions sont immédiatement actionnables : pas de théorie, du concret.`;
