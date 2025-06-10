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
CONVENTION DE FORMATION SLS - <<numero_convention>>
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

[PAGE_BREAK]

CONVENTION DE FORMATION SLS - <<numero_convention>>
CONDITIONS GENERALES DE VENTE - TARIF EN VIGUEUR JUSQU'AU 31/12/2025

Les présentes conditions générales régissent, sauf dispositions contraires, les relations contractuelles de SARL Laurent Serre avec les Stagiaires dans le cadre de formations privées et celles entretenues avec des sociétés (les Clients) pour le compte de leurs salariés dans le cadre de la formation professionnelle continue (article L63.13-1 du code du Travail).

1. Objectif
SARL LAURENT SERRE, est un organisme de formation spécialisé dans les techniques de vente. Il est inscrit auprès de la Préfecture sous le n° 91340863434.

2. Méthodes de Formation – Moyens pédagogiques
SARL LAURENT SERRE forme à toutes techniques utiles à la vente et/ou au management sur un principe original de formation sur mesure permettant la montée en compétences d'individus de manière personnalisée et progressive

Le parcours du Stagiaire est composé d'un ou plusieurs modules, chacun caractérisé comme suit :
Modules de formation dont l'objectif est de mettre à jour les connaissances et d'opérer les prises de conscience nécessaires à aux sessions d'entraînement ;
Séances de mise en pratique, individuelles ou en micro-groupe dans le centre Laurent Serre Développement dont l'objectif est de transformer les connaissances en compétences ;
Travail personnel intersession sur la base des axes d'amélioration identifiés en formation pour perfectionner les outils opérationnels et renforcer leur prise en main ;
Validation des acquis individuels

Dans le cas où le module n'impacte pas l'efficacité du Stagiaire alors qu'il s'en donne les moyens (préparation, mise en pratique, remontée des difficultés), le parcours du Stagiaire pourra être enrichi par des accompagnements complémentaires. 
L'entraîneur déterminera avec le Stagiaire les accompagnements complémentaires nécessaires :
Accompagnements complémentaires gratuits :
Accompagnement individuel téléphonique intermédiaire ;
Construction de plan de prise en main des savoir-faire personnalisé 
Accompagnements individuels complémentaires payants :
Accompagnement sur le terrain : diagnostic des acquis et identification puis travail des points de blocage ;
Accompagnement à la consolidation des productions réalisées en entrainement

3. Les titres et qualités de nos formateurs
Nos formateurs sont sélectionnés sur la base de
Leur double expertise
Opérationnelle : véritable expérience terrain sur des postes de relation client, vente et management d'équipes en relation avec le client ;
Pédagogique : formation de formateurs, expérience significative d'animation de formations à la relation client, à la vente et au management des équipes en relation avec le client.

Leurs expériences sectorielles et leurs affinités thématiques : Chacun d'entre eux suit notre processus de certification et est challengé dans la durée par notre département Pédagogie & Qualité.

4. Modalités d'évaluation et sanction de la formation

4.1 Modalité d'évaluation
Exercices, quiz, mises en situation, cas pratiques, évaluation des savoir-faire et de l'impact sur les performances, plans d'actions individuels, et parfois (pour les actions de formation pouvant donner lieu à une certification – cf. ci-après), un passage devant un jury d'examen.

4.2 Sanction des formations
Pour chaque action de formation, SARL Laurent Serre délivre une attestation de formation au Stagiaire à l'issue de la formation suivie. Cette attestation mentionne les objectifs, la nature et la durée de l'action et les résultats de l'évaluation des acquis de la formation. L'attestation a pour objet de permettre au Stagiaire de capitaliser sur les résultats des formations qu'il ou elle suit tout au long de sa vie, notamment les actions de courte durée. 
Chaque action de formation donne également lieu à une validation qui est fonction de l'objectif de la formation, de sa durée et des moyens permettant de suivre l'exécution de l'action et d'en apprécier les résultats.
Enfin, certaines actions de formation peuvent donner lieu à une Certification visée par France Compétences. Selon les actions de formation, il peut s'agir, soit d'une Certification Professionnelle inscrite au Répertoire National des Certifications Professionnelles (RNCP), soit d'une Certification inscrite au Répertoire Spécifique (RS). C'est l'établissement certificateur (selon la Certification, Laurent Serre Développement ou son partenaire certificateur) qui délivre le diplôme correspondant à la Certification obtenue.

5. Formules de formation proposées – Coûts 
Dans un premier temps une analyse approfondie des besoins du Stagiaire est faite par le formateur. Un parcours sur-mesure est prescrit et ajusté en fonction des retours Clients  Le coût proposé par formule inclut la remise par Laurent Serre Développement au Stagiaire ou au Client du matériel pédagogique qui restera la propriété du Stagiaire ou du Client à l'issue de la formation.
Il est entendu par les Parties que la tarification en vigueur est celle affichée dans le centre à la date de signature de la présente Convention.

5.1 Frais de prise en charge 
En cas de subrogation de paiement à un OPCO, des frais de dossiers seront appliqués en fonction du volume de la commande (250 € HT / dossier)
Il appartient au Client d'effectuer la demande de prise en charge auprès de l'OPCO avant le début de la formation, sur l'exemplaire de la Convention que le Client retourne signée à Laurent Serre Développement.  
En cas de prise en charge partielle par l'OPCO, la différence sera directement facturée par Laurent Serre Développement au Client en sus des frais de dossiers. 
Si l'accord de prise en charge de l'OPCO ne parvient pas à Laurent Serre Développement 48h avant le premier jour de la formation, Laurent Serre Développement se réserve la possibilité de facturer la totalité des frais de formation au Client. 

[PAGE_BREAK]

5.2 Les Accompagnements Complémentaires
Le Stagiaire peut opter pour l'achat d'un ou plusieurs Accompagnements Complémentaires à son parcours de formation.
Accompagnement individuel sur le terrain : destiné à toute personne souhaitant être accompagnée en rendez-vous client.L'objectif est de bénéficier du regard du formateur en situation réelle pour identifier ses points forts et travailler ses difficultés dans la mise en œuvre des techniques de vente.
Accompagnement individuel à la formalisation du Plan de Vente : destiné à formaliser les bonne pratiques de la vente sur un support allégé et partageable. L'objectif est de consolider dans un Plan de Vente.
La préparation à la Certification : certaines actions de formation peuvent donner lieu à une Certification (cf. Article 4.2 - Sanction des formations).Afin de préparer le Stagiaire au passage de la Certification dans les meilleures conditions,Laurent Serre Développement propose une formation individuel, d'une durée d'1h30, organisée en fonction des contraintes du Stagiaire et des disponibilités des formateurs de Laurent Serre Développement.Cette formation individuelle est proposée au Stagiaire en engagement de meilleur effort, et donc, n'entraîne pas forcément la réussite au passage de la Certification (cf. Article 5.5 – Le passage de la Certification).Le coût de cet entraînement est de 600 € HT.
Le passage de la Certification : certaines actions de formation peuvent donner lieu à une Certification (cf. Article 4.2 - Sanction des formations).
Le passage effectif de la Certification est organisé par l'établissement certificateur (selon les cas, soit Laurent Serre Développement, soit un partenaire de Laurent Serre Développement.).
Les modalités de l'examen sont communiquées au Stagiaire par Laurent Serre Développement.
Il est rappelé que le Jury d'examen est souverain dans sa décision d'attribuer ou non la Certification au Stagiaire.
Le coût du passage de la Certification est de 600 € HT.

6. Mise en place de la Convention de formation

6.1 Diagnostic initial 
Laurent Serre Développement procède, avec l'accord du Stagiaire, à une évaluation de son niveau actuel au moyen d'un entretien de simulation ou d'une évaluation contradictoire des pratiques mises en oeuvre par le stagiaire. L'évaluation porte sur les aptitudes du Stagiaire, ses connaissances et son expérience en termes de vente et/ou de management.

6.2 Convention de formation
A l'issue du premier rendez-vous, Laurent Serre Développement remet au Stagiaire une Convention comprenant notamment son niveau actuel tel qu'il résulte du diagnostic initial, les objectifs à atteindre souhaités, le type de formation choisie et le coût. Les présentes Conditions Générales de Vente sont annexées à la Convention. 

6.3 Ratification de la Convention de formation
La Convention de Formation ne devient définitive et irrévocable qu'après remise par le Stagiaire ou le Client à Laurent Serre Développement de la Convention de formation signée.

6.4 Facturation
La facture du coût de la formation est éditée à la remise par le Stagiaire ou le Client de la Convention signée et doit être payée dans les conditions de l'article 8 ci-après.

7. Niveaux – Résultats - Attestation de formation
Laurent Serre Développement a déterminé lors de la création de la formation sur mesure les objectifs à atteindre par le stagiaire
Le niveau de départ est déterminé à l'issue du diagnostic initial par Laurent Serre Développement et reporté sur la Convention.
L'objectif à atteindre est déterminé en fonction des objectifs déclarés par le Stagiaire lors du diagnostic initial et de son engagement personnel à mettre tout en œuvre pour permettre le déroulement optimal de la formation et la réalisation de ses objectifs. 
La validation des objectifs. Le Stagiaire ne valide sa formation qu'après détermination par le formateur de la validation des objectifs . Le Stagiaire reconnaît que son atteinte de l'objectif dépend directement de sa contribution personnelle, de son assiduité, de son implication dans les  formations données par Laurent Serre Développement. 
Laurent Serre Développement, qui n'est tenue qu'à une obligation de moyens, s'engage à diligenter ses meilleurs efforts pour que le niveau souhaité soit atteint à la date de fin préconisée de la formation. Laurent Serre Développement ne serait être tenue responsable de quelque manière que ce soit de la non-validation du niveau souhaité et aucun remboursement de ce fait ne saurait être sollicité auprès de Laurent Serre Développement.
Laurent Serre Développement délivre au Stagiaire ou au Client une attestation de niveau indiquant le niveau atteint par le Stagiaire à la fin de la formation et justifiant la réalité et la validité des dépenses de formation engagées.

7.1 Durée initiale de la formation et absences

7.1.1 Durée de la formation
La durée de la formation dépend de la formule choisie par le Stagiaire ou le Client indiquée à l'article 5 des présentes Conditions Générales de Vente. Elle est expressément indiquée dans la Convention et est ferme et irrévocable sauf réserves de l'article 8.2.

7.1.2 Lieu de la formation
Les formations ont lieu dans le centre Laurent Serre Développement. Le lieu est expressément convenu entre les Parties dans la Convention. Il pourra, à titre exceptionnel, être transféré, en cours de formation, dans un autre centre Laurent Serre Développement, voire en distanciel, en cas d'accord exprès et préalable des Parties ou en cas mesures liées à la crise sanitaire,

7.2 Non sollicitation
Le Client s'engage à ne pas recruter et à ne pas missionner directement ou indirectement, que ce soit pour son propre compte ou pour le compte de toute personne ou entité, en tant que salarié ou prestataire, les consultants et/ou salariés de Laurent Serre Développement et ce, pendant toute la durée de la présente Convention et pendant les 36 mois qui suivent la date de résiliation ladite Convention.
Le non-respect de tout ou partie de cette clause par le Client l'engage à verser à Laurent Serre Développement une indemnité correspondant à 50% de la rémunération annuelle brute perçue par le consultant ou le salarié au cours de la dernière année pendant laquelle le consultant contracté ou le salarié débauché et Laurent Serre Développement ont travaillé ensemble. Cette indemnité s'appliquera de plein droit et sans préjudice de toute autre réclamation de Laurent Serre Développement  au titre du préjudice subi du fait de la violation de cette clause.

8. Conditions de règlement
Sauf convention contraire entre les Parties, le coût de la formation tel qu'indiqué à l'article 5 des présentes conditions générales est exigible à réception de la facture et le prix doit être payé d'avance en sa totalité par le Stagiaire ou le Client avant le démarrage de la formation.
En cas de non-paiement total ou partiel du coût de la formation, Laurent Serre Développement n'initiera aucune formation et sera en droit de suspendre toutes les formations qui seraient en cours, pour le même Stagiaire ou au nom et pour le compte du même Client. Les sommes dues porteront intérêt de plein droit et sans formalités au taux de la Banque Centrale Européenne en vigueur majoré de 10 points à la date d'échéance.
Le règlement est effectué par tous moyens au profit de Laurent Serre Développement.
Le coût des Accompagnements Complémentaires est exigible avant la date planifiée de l'Accompagnement. En cas de non-paiement total ou partiel de l'Accompagnement au moins 48 heures avant la date planifiée, l'Accompagnement Complémentaire sera annulé de plein droit.

8.1 Clause relative à la prise en charge des frais annexes
Dans le cadre de la présente convention de formation, il est convenu que les frais annexes liés à la prestation, incluant spécifiquement :
	•	Frais de déplacement : coûts de transport du formateur entre son lieu de résidence et le lieu de formation.
	•	Frais d'hébergement : dépenses liées à l'hébergement du formateur pendant la durée de la formation.
	•	Frais de restauration : dépenses de repas du formateur durant ses déplacements liés à la formation.

Ces frais seront intégralement à la charge du client.

Modalités de facturation et de remboursement :
	•	Justificatifs : le formateur fournira au client l'ensemble des justificatifs originaux correspondants (factures, reçus) pour chaque dépense engagée.
	•	Facturation distincte : ces frais feront l'objet d'une facturation séparée, distincte des honoraires de formation.
	•	Délai de paiement : le client s'engage à rembourser les frais annexes dans un délai de 30 jours à compter de la réception de la facture et des justificatifs correspondants.
	•	Plafonds et barèmes : les frais seront remboursés sur la base des barèmes suivants :
	•	Déplacement : remboursement au coût réel sur présentation des justificatifs.
	•	Hébergement : remboursement plafonné à 250 euros par nuit.
	•	Restauration : remboursement plafonné à 50 euros par repas.

Ces modalités visent à assurer une transparence totale entre les parties et à prévenir tout litige ultérieur.

[PAGE_BREAK]

9. Inexécution totale ou partielle
En cas de cessation de la formation avant la fin contractuellement convenue, Laurent Serre Développement ne sera amené à rembourser le trop-perçu au Stagiaire qu'en cas de décès du Stagiaire.
Dans tous les autres cas et notamment en cas d'abandon anticipé par le Stagiaire de la formation en cours et quelles que soient les raisons, Laurent Serre Développement conservera le prix payé au titre de la formation sans remboursement possible.

10. Règlement intérieur - Discipline
Laurent Serre Développement s'engage à transmettre le règlement intérieur au(x) Stagiaire(s)
Pendant la durée de la formation, le Stagiaire est autorisé à pénétrer dans les locaux de Laurent Serre Développement tels que défini dans la Convention et à en utiliser les installations dans le cadre des horaires affichés, et en fonction du planning réservé aux cours tant pour les modules de préparation aux séances de mise en pratique que pour les séances de mise en pratique elle-même.
Le stagiaire reconnaît à la Direction de Laurent Serre Développement le droit de l'exclure de l'établissement, à titre de mesure conservatoire, sans préavis, en cas d'attitude ou de comportement contraires aux bonnes mœurs ou notoirement gênant pour les autres Stagiaires ou non-conforme au présent Règlement.
Si une sanction pouvant affecter durablement la formation du Stagiaire est envisagée, Laurent Serre Développement respectera les dispositions de l'article R922-5 du Code du Travail :
Convocation du Stagiaire par lettre de remise en main propre avec AR,
Entretien avec la Direction de Laurent Serre Développement afin d'énoncer le motif de la sanction envisagée et d'entendre les explications du Stagiaire assisté ou non,
Notification de la décision par lettre remise en main propre ou envoyée sous pli AR.
Le Stagiaire est tenu d'adopter au sein de Laurent Serre Développement une attitude conforme aux bonnes mœurs et respectueuse des autres Stagiaires et du personnel Laurent Serre Développement, de porter une tenue vestimentaire correcte (sobre et adaptée au monde de l'entreprise), de ne pas fumer à l'intérieur de l'établissement, de ne pas être sous l'emprise d'alcool ou d'autres substances illicites, de ne pas porter de signes religieux visibles, de ne pas se restaurer ou de prendre un en-cas dans l'établissement, de veiller sur ses effets personnels, de respecter le silence et la concentration des autres, d'éteindre son téléphone portable tant qu'il se trouve dans l'établissement.
Le Stagiaire et toutes autres personnes soumises au respect des présentes Conditions Générales reconnaissent être entièrement responsables de l'ensemble du contenu qu'ils rendent accessible à des tiers depuis les ordinateurs mis à leur disposition par Laurent Serre Développement dans le cadre des modules de formation ou qu'ils envoient par courrier électronique depuis lesdits ordinateurs ou encore qu'ils stockent sous des fichiers personnels sécurisés créés sur lesdits ordinateurs.
Le Stagiaire et toutes autres personnes soumises au respect des présentes Conditions Générales de Vente s'interdisent, dans le cadre de l'utilisation des ordinateurs mis à leur disposition par Laurent Serre Développement, de se livrer à des actes, de quelque nature que ce soit, qui seraient contraires à la loi française, porteraient atteinte à l'ordre public français, ou aux droits d'un tiers. En particulier, et sans que cette liste ait un caractère limitatif, les stagiaires et toutes autres personnes soumises au respect des présentes Conditions Générales
S'interdisent de :
Télécharger, stocker, émettre ou retransmettre des documents contraires à la morale et aux lois en vigueur, provocants, violents, pornographiques, pédophiles, racistes, haineux et/ou susceptibles de porter atteinte au respect, à la dignité, à l'honneur ou à l'intégrité de la personne humaine, à l'égalité entre les hommes et les femmes et à la protection des mineurs ;
Télécharger, stocker, émettre, diffuser ou faire suivre des Informations susceptibles d'encourager la commission de crimes et délits, d'inciter à la consommation de substances illicites, de favoriser la discrimination, la haine, la violence en raison de la race, de l'ethnie, de la religion ou de la nation, plus généralement dont les contenus constituent une infraction à la loi française, portent atteinte à l'ordre public français, ou aux droits d'un tiers (exemple : ceux relatifs à la pédophilie, aux ventes d'organes, aux ventes de substances illicites, ou de tout autre objets et/ou prestations illicites, faisant l'apologie du terrorisme, des crimes de guerre, du nazisme…) ;
Télécharger, stocker ou émettre des messages illégaux, nuisibles, abusifs, constitutifs de harcèlement, diffamatoires, injurieux, obscènes, menaçants pour la vie privée d'autrui ;
Transmettre des messages pouvant induire en erreur leurs destinataires sur le nom ou la dénomination sociale d'autres personnes physiques ou morales ;
Se servir des ordinateurs dans un but commercial ;
S'engagent à :
Respecter la législation française et la réglementation européenne relatives à la propriété intellectuelle et industrielle, notamment en ce qui concerne le stockage, l'utilisation, la diffusion de documents couverts par les lois sur la propriété littéraire, artistique ou industrielle (droits d'auteurs, marques, brevets, modèles, secrets de fabrique…) et pour lesquels ils n'ont pas acquis de droits ou de licences (en particulier, ils s'engagent à ne pas publier de documents sans l'autorisation formelle de leurs auteurs) ;
Ne pas laisser circuler de virus informatique ou tout autre code ou programme, conçus pour interrompre, détruire ou limiter la fonctionnalité de tout logiciel, ordinateur ou outil de télécommunication, par voie de messagerie.
Le Stagiaire et toutes autres personnes soumises au respect des présentes Conditions Générales de Vente seront entièrement responsables de l'intégralité des conséquences de quelque nature que ce soit de tout manquement ou de toute violation de la présente clause, sans que Laurent Serre Développement puisse être inquiétée et ou recherchée d'aucune manière. En tout état de cause, le Stagiaire garantit pleinement et intégralement Laurent Serre Développement de toutes éventuelles poursuites contentieuses ou non.
Les personnes extérieures n'ont pas accès au centre Laurent Serre Développement, sauf si elles bénéficient d'une invitation ou d'une autorisation exceptionnelle de la Direction de Laurent Serre Développement. Ces dernières seront alors soumises au même règlement intérieur.

11. Loi Informatique et libertés
Laurent Serre Développement est amenée à recueillir des données personnelles qui, pour assurer l'exécution de ses prestations (création et gestion des accès à nos services en ligne, études qualité, respect des obligations légales), font l'objet d'un traitement informatique. Pour des raisons légales, ces données personnelles sont enregistrées et conservées pour une durée minimum de 10 ans (à compter de la dernière formation). Laurent Serre Développement mets en place tous moyens aptes à assurer la confidentialité et la sécurité des données personnelles, de manière à empêcher leur endommagement, effacement ou accès par des tiers non autorisés. 
L'accès à ces données personnelles est strictement limité aux services de Laurent Serre Développement et à ses partenaires contractuels qui sont soumis à une obligation de confidentialité et ne peuvent utiliser les données qu'en conformité avec les dispositions contractuelles et la législation applicable. 
Laurent Serre Développement s'engage à ne pas vendre, louer, céder ni donner accès à des tiers à ces données sans consentement préalable, à moins d'y être contraints en raison d'un motif légitime (obligation légale, lutte contre la fraude ou l'abus, exercice des droits de la défense, etc.). 
Conformément à la loi informatique et libertés n° 78-17 du 6/01/1978, et du Règlement Général de Protection des Données (RGPD) entré en application au sein de l'Union Européenne le 25 mai 2018, le Stagiaire bénéficie d'un droit d'accès et de rectification des informations nominatives le concernant en s'adressant à Laurent Serre Développement. 

12. Loi applicable - Contestations – Différends
La présente Convention de formation est soumise au droit français.
Si une contestation ou un différend ne peuvent être réglés à l'amiable, il sera soumis aux juridictions compétentes.

Fait en 2 exemplaires
À MAUGUIO, le  <<date_signature>>
									

SARL LAURENT SERRE
Laurent SERRE


LE CLIENT
<<client_representant>>

[PAGE_BREAK]

CONVENTION DE FORMATION N° SLS - <<numero_convention>>
PROGRAMME DE FORMATION -

SOCIETE : <<client_nom>>
ACADEMICIEN(S): <<participants>>

Moyens pédagogiques et techniques :
Évaluation individuelle initiale
Enseignements théoriques dispensés par un formateur qualifié
Jeux de rôles axées sur des compétences métier
Analyse de cas pratiques concrets liés directement à l'entreprise
Pour évaluer de manière efficace les progrès réalisés et les compétences acquises au cours de notre programme de formation en entreprise, nous utilisons plusieurs instruments pédagogiques d'évaluation. Ceux-ci comprennent des exercices pratiques, des quiz interactifs pour la validation rapide des connaissances, des évaluations formelles des acquis centrées sur le "savoir-faire" professionnel, ainsi que des mises en situation qui imitent des scénarios réels du secteur de son secteur d'activité.
Moyens techniques : Supports de cours, vidéos, études de cas, guides pratiques.quiz en ligne
Ce programme de formation est conçu pour offrir une compréhension approfondie des techniques de vente modernes et pour permettre aux apprenants de développer des compétences pratiques essentielles à leur succès professionnel.

Encadrement de la formation :
L'encadrement pédagogique de notre programme de formation est assuré par une équipe de formateurs issus de la formation interne à SARL Laurent Serre. Ces experts possèdent une solide expérience opérationnelle dans les domaines de la vente et/ou du management. En plus de leur expertise métier, ils sont formés aux techniques spécifiques de formation qui maximisent l'apprentissage et la performance. Pour attester de leur haut niveau de compétence, ils sont dotés d'une certification qui valide leurs aptitudes techniques, professionnelles et pédagogiques.

Le suivi de l'action, pour chaque formation :
Afin d'assurer un suivi rigoureux et de maintenir la responsabilité tout au long de la formation, chaque formateur et stagiaire est tenu de signer une feuille de présence pour chaque demi-journée de formation. De plus, un processus structuré de suivi est mis en place pour chaque stagiaire : une évaluation individuelle après la fin de formation est conduite pour examiner les progrès, ajuster le cas échéant et identifier les éventuelles zones d'amélioration.

L'appréciation des résultats :
À la conclusion de chaque niveau de formation, le formateur évalue chaque stagiaire en utilisant sa production ou des mises en situation pratiques pour déterminer si les objectifs et compétences spécifiques de la formation ont été atteints. Si le stagiaire n'a pas satisfait aux critères établis, il bénéficie d'un accompagnement individuel pour combler les lacunes identifiées. 

À la fin du programme de formation, SARL Laurent Serre fournit à chaque stagiaire une attestation de formation officielle. Ce document détaille les objectifs pédagogiques atteints, la nature de la formation suivie, ainsi que sa durée totale. Cette attestation sert non seulement à valider l'engagement et les acquis du stagiaire, mais également à fournir une référence formelle pour de futurs besoins en développement professionnel.
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
