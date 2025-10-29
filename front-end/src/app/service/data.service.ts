import { Injectable } from '@angular/core';
import { Description, Header } from '../model/lpl/ui-element';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  // getDataCategoryHeader(name: string): Header {
  //   var header = new Header();
  //   header.lang = 'en';
  //   switch (name) {
  //     case "dc_preference":
  //       header.value = "Preference";
  //       break;
  //     case "dc_transactional":
  //       header.value = "Transactional";
  //       break;
  //     case "dc_social":
  //       header.value = "Social Network";
  //       break;
  //     case "dc_sexual":
  //       header.value = "Sexual";
  //       break;
  //     case "dc_religiousBeliefs":
  //       header.value = "Religious Beliefs";
  //       break;
  //     case "dc_religion":
  //       header.value = "Religion";
  //       break;
  //     case "dc_race":
  //       header.value = "Race";
  //       break;
  //     case "dc_public":
  //       header.value = "Public Life";
  //       break;
  //     case "dc_professional":
  //       header.value = "Professional";
  //       break;
  //     case "dc_politicalAffiliation":
  //       header.value = "Political Affiliation";
  //       break;
  //     case "dc_physical":
  //       header.value = "Physical Characteristics";
  //       break;
  //     case "dc_philosophical":
  //       header.value = "Philosophical Belief";
  //       break;
  //     case "dc_ownership":
  //       header.value = "Ownership";
  //       break;
  //     case "dc_medical":
  //       header.value = "Medical and Health";
  //       break;
  //     case "dc_location":
  //       header.value = "Location";
  //       break;
  //     case "dc_knowledge":
  //       header.value = "Knowledge and Belief";
  //       break;
  //     case "dc_identifying":
  //       header.value = "Identifying";
  //       break;
  //     case "dc_historical":
  //       header.value = "Historical";
  //       break;
  //     case "dc_family":
  //       header.value = "Family";
  //       break;
  //     case "dc_ethnicity":
  //       header.value = "Ethnicity";
  //       break;
  //     case "dc_ethnicOrigin":
  //       header.value = "Ethnic Origin";
  //       break;
  //     case "dc_derived":
  //       header.value = "Derived Personal Data";
  //       break;
  //     case "dc_demographic":
  //       header.value = "Demographic";
  //       break;
  //     case "dc_criminal":
  //       header.value = "Criminal";
  //       break;
  //     case "dc_credit":
  //       header.value = "Credit";
  //       break;
  //     case "dc_contact":
  //       header.value = "Contact";
  //       break;
  //     case "dc_computer":
  //       header.value = "Computer Device";
  //       break;
  //     case "dc_communication":
  //       header.value = "Communication";
  //       break;
  //     case "dc_biometric":
  //       header.value = "Biometric";
  //       break;
  //     case "dc_behavioral":
  //       header.value = "Behavioral";
  //       break;
  //     case "dc_authenticating":
  //       header.value = "Authenticating";
  //       break;
  //     case "dc_account":
  //       header.value = "Account";
  //       break;  
  //     default:
  //       break;
  //   }
  //   return header;
  // }

  // getDataCategoryDesc(name: string): Description {
  //   var desc = new Description();
  //   desc.lang = 'en';
  //   switch (name) {
  //     case "dc_preference":
  //       desc.value = "Information about an individual's preferences or interests, e.g., opinions, intentions, interests, favorite foods, colors, likes, dislikes, music.";
  //       break;
  //     case "dc_transactional":
  //       desc.value = "Information about an individual's purchasing, spending, or income, e.g., purchases, sales, credit, income, loan records, transactions, taxes, purchases and spending habits.";
  //       break;
  //     case "dc_social":
  //       desc.value = "Information about an individual's friends or social connections, e.g., friends, connections, acquaintances, associations, group membership.";
  //       break;
  //     case "dc_sexual":
  //       desc.value = "Information that describes an individual's sexual life, e.g., gender identity, preferences, proclivities, fetishes, history, etc.";
  //       break;
  //     case "dc_religiousBeliefs":
  //       desc.value = "Information about religion and religious beliefs.";
  //       break;
  //     case "dc_religion":
  //       desc.value = "Information about religion, religious inclinations, and religious history.";
  //       break;
  //     case "dc_race":
  //       desc.value = "Information about race or racial history.";
  //       break;
  //     case "dc_public":
  //       desc.value = "Information about an individual's public life, e.g., character, general reputation, social status, marital status, religion, political affiliations, interactions, communications meta-data.";
  //       break;
  //     case "dc_professional":
  //       desc.value = "Information about an individual's educational or professional career, e.g., job titles, salary, work history, school attended, employee files, employment history, evaluations, references, interviews, certifications, disciplinary actions.";
  //       break;
  //     case "dc_politicalAffiliation":
  //       desc.value = "Information about political affiliation and history.";
  //       break;
  //     case "dc_physical":
  //       desc.value = "Information that describes an individual's physical characteristics, e.g., height, weight, age, hair color, skin tone, tattoos, gender, piercings.";
  //       break;
  //     case "dc_philosophical":
  //       desc.value = "Information about philosophical beliefs.";
  //       break;
  //     case "dc_ownership":
  //       desc.value = "Information about things an individual has owned, rented, borrowed, possessed, e.g., cars, houses, apartments, personal possessions.";
  //       break;
  //     case "dc_medical":
  //       desc.value = "Information that describes an individual's health, medical conditions or health care, e.g., physical and mental health, drug test results, disabilities, family or individual health history, health records, blood type, DNA code, prescriptions.";
  //       break;
  //     case "dc_location":
  //       desc.value = "Information about an individual's location, e.g., country, GPS coordinates, room number.";
  //       break;
  //     case "dc_knowledge":
  //       desc.value = "Information about what a person knows or believes, e.g., religious beliefs, philosophical beliefs, thoughts, what they know and don't know, what someone thinks.";
  //       break;
  //     case "dc_identifying":
  //       desc.value = "Information that uniquely or semi-uniquely identifies a specific individual, e.g., name, user-name, unique identifier, government issued identification, picture, biometric data.";
  //       break;
  //     case "dc_historical":
  //       desc.value = "Information about an individual's personal history, e.g., events that happened in a person's life, either to them or just around them which might have influenced them (WWII,9/11)";
  //       break;
  //     case "dc_family":
  //       desc.value = "Information about an individual's family and relationships, e.g., family structure, siblings, offspring, marriages, divorces, relationships.";
  //       break;
  //     case "dc_ethnicity":
  //       desc.value = "Information that describes an individual's origins and lineage, e.g., race, national or ethnic origin, languages spoken, dialects, accents.";
  //       break;
  //     case "dc_ethnicOrigin":
  //       desc.value = "Information about ethnic origin.";
  //       break;
  //     case "dc_derived":
  //       desc.value = "Derived data is data that is obtained or derived from other data.";
  //       break;
  //     case "dc_demographic":
  //       desc.value = "Information that describes an individual's characteristics shared with others, e.g., age ranges, physical traits, income brackets, geographic.";
  //       break;
  //     case "dc_criminal":
  //       desc.value = "Information about an individual's criminal activity, e.g., convictions, charges, pardons.";
  //       break;
  //     case "dc_credit":
  //       desc.value = "Information about an individual's reputation with regards to money, e.g., credit records, credit worthiness, credit standing, credit capacity.";
  //       break;
  //     case "dc_contact":
  //       desc.value = "Information that provides a mechanism for contacting an individual, e.g., email address, physical address, telephone number.";
  //       break;
  //     case "dc_computer":
  //       desc.value = "Information about a device that an individual uses for personal use (even part-time or with others), e.g., IP address, Mac address, browser fingerprint.";
  //       break;
  //     case "dc_communication":
  //       desc.value = "Information communicated from or to an individual, e.g., telephone recordings, voice mail, email.";
  //       break;
  //     case "dc_biometric":
  //       desc.value = "Information about biometrics and biometric characteristics.";
  //       break;
  //     case "dc_behavioral":
  //       desc.value = "Information that describes an individual's behavior or activity, e.g., browsing behavior, call logs, links clicked, demeanor, attitude.";
  //       break;
  //     case "dc_authenticating":
  //       desc.value = "Information used to authenticate an individual with something they know, e.g., passwords, PIN, mother's maiden name.";
  //       break;
  //     case "dc_account":
  //       desc.value = "Information that identifies an individual's financial account, e.g., credit card number, bank account.";
  //       break;  
  //     default:
  //       break;
  //   }
  //   return desc;
  // }

  getRightsHeader(name: string) : Array<Header> {
    var res = new Array<Header>();
    var header = new Header();
    header.lang = 'en';
    switch (name) {
      case "access":
        header.value = "Right of Access";
        break;
      case "rectification":
        header.value = "Right to Rectification";
        break;
      case "erasure":
        header.value = "Right to Erasure";
        break;
      case "restriction":
        header.value = "Right to Restrict Processing";
        break;
      case "portability":
        header.value = "Right to Data Portability";
        break;
      case "objection":
        header.value = "Right to Object";
        break;
      case "intervention":
        header.value = "Right to Obtain Human Intervention for Automated Decision Making";
        break;
      default:
        break;
    }
    res.push(header);

    var header = new Header();
    header.lang = 'de';
    switch (name) {
      case "access":
        header.value = "Auskunftsrecht";
        break;
      case "rectification":
        header.value = "Recht auf Berichtigung";
        break;
      case "erasure":
        header.value = "Recht auf Loeschung";
        break;
      case "restriction":
        header.value = "Recht auf Einschraenkung der Verarbeitung";
        break;
      case "portability":
        header.value = "Recht auf Datenuebertragbarkeit";
        break;
      case "objection":
        header.value = "Widerspruchsrecht";
        break;
      case "intervention":
        header.value = "Recht auf menschliche Intervention bei automatisierter Entscheidungsfindung";
        break;
      default:
        break;
    }
    res.push(header);

    return res;
  }

  getRightsDesc(name: string) : Array<Description> {
    var res = new Array<Description>();

    var desc = new Description();
    desc.lang = 'en';
    switch (name) {
      case "access":
        desc.value = "You have the right of access to data which has been collected concerning you.";
        break;
      case "rectification":
        desc.value = "You have the right to have personal data rectified.";
        break;
      case "erasure":
        desc.value = "You have the right to have personal data erased.";
        break;
      case "restriction":
        desc.value = "You have the right to have the processing of personal data restricted.";
        break;
      case "portability":
        desc.value = "You have the right to obtain a copy of your personal data in a way that is accessible and machine-readable, for example as a csv file. This copy may also be transferred directly to another service provider.";
        break;
      case "objection":
        desc.value = "You have the right to object to the processing of your personal data.";
        break;
      case "intervention":
        desc.value = "You have the right to obtain human intervention where decisions are solely based on automated decision-making.";
        break;
      default:
        break;
    }
    res.push(desc);

    var desc = new Description();
    desc.lang = 'de';
    switch (name) {
      case "access":
        desc.value = "Sie haben das Recht auf Zugang zu den Daten, die über Sie gesammelt wurden.";
        break;
      case "rectification":
        desc.value = "Sie haben das Recht, personenbezogene Daten berichtigen zu lassen.";
        break;
      case "erasure":
        desc.value = "Sie haben das Recht, personenbezogene Daten loeschen zu lassen.";
        break;
      case "restriction":
        desc.value = "Sie haben das Recht, die Verarbeitung personenbezogener Daten einschränken zu lassen.";
        break;
      case "objection":
        desc.value = "Sie haben das Recht, der Verarbeitung ihrer personenbezogenen Daten zu widersprechen.";
        break;
      case "portability":
        desc.value = "Sie haben das Recht, eine Kopie Ihrer personenbezogenen Daten in einer Weise zu erhalten, die zugaenglich und maschinenlesbar ist, z.B. als csv-Datei. Diese Kopie kann auch direkt an einen anderen Dienstanbieter uebertragen werden.";
        break;
      case "intervention":
        desc.value = "Sie haben das Recht, ein menschliches Eingreifen zu erwirken, wenn Entscheidungen ausschließlich auf einer automatisierten Entscheidungsfindung beruhen.";
        break;
      default:
        break;
    }
    res.push(desc);

    return res;
  }
}
