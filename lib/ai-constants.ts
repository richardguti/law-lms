export const SUBJECTS = [
  'Contracts',
  'Torts',
  'Civil Procedure',
  'Criminal Law',
  'Constitutional Law',
  'Property',
  'Evidence',
  'Administrative Law',
  'Business Associations',
  'Family Law',
  'Conflict of Laws',
  'Federal Courts',
]

export const SESSION_MODES = [
  'STUDY — Socratic mode, fact patterns only',
  'DRILL — rapid fire Q&A',
  'REVIEW — explain concepts clearly',
  'EXAM PREP — timed hypos',
]

export const FOCUS_TOPICS: Record<string, string[]> = {
  Contracts: ['Mutual Assent', 'Consideration', 'Defenses', 'Remedies', 'Third Parties', 'Performance & Breach'],
  Torts: ['Negligence', 'Intentional Torts', 'Strict Liability', 'Products Liability', 'Defamation', 'Privacy'],
  'Civil Procedure': ['Jurisdiction', 'Pleading', 'Discovery', 'Summary Judgment', 'Trial', 'Appeals'],
  'Criminal Law': ['Actus Reus', 'Mens Rea', 'Homicide', 'Theft', 'Defenses', 'Inchoate Crimes'],
  'Constitutional Law': ['Judicial Review', 'Commerce Clause', 'Due Process', 'Equal Protection', 'First Amendment', 'Federalism'],
  Property: ['Possession', 'Estates', 'Future Interests', 'Landlord-Tenant', 'Adverse Possession', 'Easements'],
  Evidence: ['Relevance', 'Hearsay', 'Privileges', 'Character Evidence', 'Expert Witnesses', 'Authentication'],
  'Administrative Law': ['Rulemaking', 'Adjudication', 'Judicial Review', 'Standing', 'Delegation Doctrine'],
  'Business Associations': ['Agency', 'Partnership', 'Corporations', 'LLC', 'Securities', 'Fiduciary Duties'],
  'Family Law': ['Marriage', 'Divorce', 'Custody', 'Adoption', 'Support', 'Property Division'],
  'Conflict of Laws': ['Choice of Law', 'Jurisdiction', 'Recognition of Judgments'],
  'Federal Courts': ['Article III', 'Standing', 'Habeas Corpus', 'Sovereign Immunity', '§1983'],
}

export const OUTLINE_DEPTHS = [
  { value: 'midterm', label: 'Midterm Outline' },
  { value: 'final', label: 'Final Outline' },
  { value: 'bar-prep', label: 'Bar Prep Overview' },
  { value: 'quick', label: 'Quick Reference' },
]
