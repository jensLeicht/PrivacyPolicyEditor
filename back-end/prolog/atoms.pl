%--------------------------------------------------------------------------
%--------------------------------------------------------------------------
% knowledge base

% known data types

dType("Text").
dType("Number").
dType("Date").
dType("Boolean").
dType("Value Set").
dType("Other").


% data sensitivity

sensitivity("EI"). % Explicit
sensitivity("QID"). % Quasi-Identifier
sensitivity("SD"). % Sensitive
sensitivity("NSD"). % Non-Sensitive


% entity classifications

classification("Person").
classification("Legal Entity").
classification("Public Authority").


% entity types

entityType("Data Source").
entityType("Data Recipient").
entityType("Data Controller").
entityType("Data Protection Officer").
entityType("Supervisory Authority").


% retention types

retentionType(indefinite).
retentionType(afterPurpose).
retentionType(fixedDate).


% data categories

dataCategory(dc_derived,("derived personal data",[("en","Derived Personal Data")],[("en","Derived data is data obtained or derived from other data.")])).
% internal
dataCategory(dc_knowledge,("knowledge and belief",[("en","Knowledge and Belief")],[("en","Information about what a person knows or believes, e.g., religious beliefs, philosophical beliefs, thoughts, what they know and do not know, what someone thinks.")])).
dataCategory(dc_authenticating,("authenticating",[("en","Authenticating")],[("en","Information used to authenticate an individual with something they know, e.g., passwords, PIN, mother's maiden name.")])).
dataCategory(dc_preference,("preference",[("en","Preference")],[("en","Information about an individual's preferences or interests, e.g., opinions, intentions, interests, favourite foods, colours, likes, dislikes, music.")])).
% external
dataCategory(dc_identifying,("identifying",[("en","Identifying")],[("en","Information that uniquely or semi-uniquely identifies a specific individual, e.g., name, user-name, unique identifier, government issued identification, picture, biometric data.")])).
dataCategory(dc_ethnicity,("ethnicity",[("en","Ethnicity")],[("en","Information that describes an individual's origins and lineage, e.g., race, national or ethnic origin, languages spoken, dialects, accents.")])).
dataCategory(dc_behavioral,("behavioral",[("en","Behavioral")],[("en","Information that describes an individual's behaviour or activity, e.g., browsing behaviour, call logs, links clicked, demeanour, attitude.")])).
dataCategory(dc_demographic,("demographic",[("en","Demographic")],[("en","Information that describes an individual's characteristics shared with others, e.g., age ranges, physical traits, income brackets, approximate place of residence.")])).
dataCategory(dc_physical,("physical characteristics",[("en","Physical Characteristics")],[("en","Information that describes an individual's physical characteristics, e.g., height, weight, age, hair colour, skin tone, tattoos, piercings.")])).
% tracking
dataCategory(dc_computer,("computer device",[("en","Computer Device")],[("en","Information about a device that an individual uses for personal use (even part-time or with others), e.g., IP address, MAC address, browser fingerprint.")])).
dataCategory(dc_contact,("contact",[("en","Contact")],[("en","Information that provides a mechanism for contacting an individual, e.g., email address, physical address, telephone number.")])).
dataCategory(dc_location,("location",[("en","Location")],[("en","Information about an individual's location, e.g., country, GPS coordinates, room number.")])).
% historical
dataCategory(dc_historical,("historical",[("en","Historical")],[("en","Information about an individual's personal history, e.g., events that happened in a person's life, either to them or just around them, which might have influenced them (e.g., WWII,9/11).")])).
% financial
dataCategory(dc_account,("account",[("en","Account")],[("en","Information that identifies an individual's financial account, e.g., credit card number, bank account.")])).
dataCategory(dc_ownership,("ownership",[("en","Ownership")],[("en","Information about things an individual has owned, rented, borrowed, possessed, e.g., cars, houses, apartments, personal possessions.")])).
dataCategory(dc_transactional,("transactional",[("en","Transactional")],[("en","Information about an individual's purchasing, spending, or income, e.g., purchases, sales, credit, income, loan records, transactions, taxes, purchases, spending habits.")])).
dataCategory(dc_credit,("credit",[("en","Credit")],[("en","Information about an individual's reputation regarding money, e.g., credit records, credit worthiness, credit standing, credit capacity.")])).
% social
dataCategory(dc_professional,("professional",[("en","Professional")],[("en","Information about an individual's educational or professional career, e.g., job titles, salary, work history, school attended, employee files, employment history, evaluations, references, interviews, certifications, disciplinary actions.")])).
dataCategory(dc_criminal,("criminal",[("en","Criminal")],[("en","Information about an individual's criminal activity, e.g., convictions, charges, pardons.")])).
dataCategory(dc_public,("public life",[("en","Public Life")],[("en","Information about an individual's public life, e.g., character, general reputation, social status, marital status, religion, political affiliations, interactions, communications meta-data.")])).
dataCategory(dc_family,("family",[("en","Family")],[("en","Information about an individual's family and relationships, e.g., family structure, siblings, offspring, marriages, divorces, relationships.")])).
dataCategory(dc_social,("social network",[("en","Social Network")],[("en","Information about an individual's friends or social connections, e.g., friends, connections, acquaintances, associations, group membership.")])).
dataCategory(dc_communication,("communication",[("en","Communication")],[("en","Information communicated from or to an individual, e.g., telephone recordings, voice mail, email.")])).
% SpecialCategoryPersonalData
dataCategory(dc_medical,("medical and health",[("en","Medical and Health")],[("en","Information that describes an individual's health, medical conditions or health care, e.g., physical and mental health, drug test results, disabilities, family or individual health history, health records, blood type, DNA code, prescriptions.")])). % external
dataCategory(dc_sexual,("sexual",[("en","Sexual")],[("en","Information that describes an individual's sexual life, e.g., gender identity, preferences, proclivities, fetishes, history.")])). % external
% removed due to redundancy
% dataCategory(dc_biometric,("biometric",[("en","Biometric")],[("en","Information about biometrics and biometric characteristics")])). % external > identifying
% dataCategory(dc_ethnicOrigin,("ethnic origin",[("en","Ethnic Origin")],[("en","Information about ethnic origin")])). % external > ethnicity
% dataCategory(dc_philosophical,("philosophical belief",[("en","Philosophical Belief")],[("en","Information about philosophical beliefs")])). % internal > knowledge and belief
% dataCategory(dc_politicalAffiliation,("political affiliation",[("en","Political Affiliation")],[("en","Information about political affiliation and history")])). % social > public life
% dataCategory(dc_race,("race",[("en","Race")],[("en","Information about race or racial history")])). % external > ethnicity
% dataCategory(dc_religion,("religion",[("en","Religion")],[("en","Information about religion, religious inclinations, and religious history")])). % social > public life
% dataCategory(dc_religiousBeliefs,("religious beliefs",[("en","Religious Beliefs")],[("en","Information about religion and religious beliefs")])). % internal > knowledge and belief


% adequacy decisions, need to be updated regularly
% source: https://ec.europa.eu/info/law/law-topic/data-protection/international-dimension-data-protection/adequacy-decisions_en

adequate("AD"). % Andorra
adequate("AR"). % Argentina
adequate("CA"). % Canada (comercial organisations)
adequate("FO"). % Faroe Islands
adequate("GG"). % Guernsey
adequate("IL"). % Israel
adequate("IM"). % Isle of Man
adequate("JP"). % Japan
adequate("JE"). % Jersey
adequate("NZ"). % New Zealand
adequate("KR"). % Republic of Korea
adequate("CH"). % Switzerland
adequate("GB"). % United Kingdom
adequate("UY"). % Uruguay


% GDPR Data Subject Rights (cf. dsrCheck)

dsr(access).
dsr(rectification).
dsr(erasure).
dsr(restriction).
dsr(portability).
dsr(objection).
dsr(intervention).


% given legalBases
% use legalBasis(lb1,(consent,[HEAD],[DESC])
% to define the actual legal Basis

legalBasis(consent).
legalBasis(contract).
legalBasis(legalObligation).
legalBasis(vitalInterest).
legalBasis(publicTask).
legalBasis(legitimateInterest).


% given purposes

purpose(accountManagement).
purpose(commercialPurpose). % DPV 2.1
purpose(communicationManagement).
purpose(communicationForCustomerCare). % DPV 2.1
purpose(customerManagement).
purpose(enforceSecurity). 
purpose(establishContractualAgreement). % DPV 2.1
purpose(fulfilmentOfObligation). % DPV 2.1, replaces legalCompliance
purpose(humanResourceManagement).
% purpose(legalCompliance). renamed fulfilmentOfObligation
purpose(marketing).
purpose(nonCommercialPurpose). % DPV 2.1
purpose(organisationGovernance).
purpose(personalisation).
purpose(publicBenefit). % DPV 2.1
purpose(recordManagement).
purpose(researchAndDevelopment).
purpose(serviceProvision).
purpose(vendorManagement).
purpose(other).