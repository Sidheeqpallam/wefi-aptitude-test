import type { RiasecCategory } from './questions';

export interface ResultDescription {
  category: RiasecCategory;
  title: { malayalam: string; english: string };
  summary: { malayalam: string; english: string };
  careers: { malayalam: string[]; english: string[] };
  strengths: { malayalam: string[]; english: string[] };
  description: { malayalam: string; english: string };
}

export const RESULT_DESCRIPTIONS: Record<RiasecCategory, ResultDescription> = {
  R: {
    category: 'R',
    title: { malayalam: "Realistic (റിയലിസ്റ്റിക്)", english: "Realistic" },
    summary: {
      malayalam: "മെക്കാനിക്കൽ അല്ലെങ്കിൽ ശാരീരിക അധ്വാനം ആവശ്യമുള്ള ജോലികളിൽ ഇക്കൂട്ടർ മിടുക്കരായിരിക്കും.",
      english: "You may have aptitude for roles involving mechanical or athletic skills."
    },
    careers: {
      malayalam: ["അഗ്രിക്കൾച്ചർ", "ഹെൽത്ത് അസിസ്റ്റന്റ്", "കമ്പ്യൂട്ടർ", "കൺസ്ട്രക്ഷൻ", "മെക്കാനിക്", "എൻജിനീയറിംഗ്", "ഫുഡ് & ഹോസ്പിറ്റാലിറ്റി"],
      english: ["Agriculture", "Physical Assistance", "Computer Technology", "Construction", "Mechanics/Manufacturing", "Engineering", "Food and Hospitality"]
    },
    strengths: {
      malayalam: ["ശാരീരിക അധ്വാനം", "മെക്കാനിക് കഴിവുകൾ", "അത്‍ലറ്റിക് കഴിവുകൾ"],
      english: ["Physical Labor", "Mechanical Skills", "Athletic Abilities"]
    },
    description: {
      malayalam: "അത്‍ലറ്റിക്, മെക്കാനിക് തൊഴിലുകളിലും നിങ്ങളുടെ താല്പര്യം പ്രകടമാണ്. കൃഷി, ശാരീരിക സഹായങ്ങൾ, കമ്പ്യൂട്ടർ, നിർമാണം, മെക്കാനിക്/മെക്കാനിസ്റ്റ്, ആതിഥ്യമര്യാദയും ഭക്ഷണവും, എഞ്ചിനീയറിങ് തൊഴിലുകളിൽ നിങ്ങൾക്ക് അവസരങ്ങളുണ്ട്.",
      english: "You may have an interest and aptitude for athletic and mechanical occupations. Potential fields could include: agriculture, physical assistance, computer technology, construction, mechanics/manufacturing, hospitality and food services, or engineering."
    }
  },
  I: {
    category: 'I',
    title: { malayalam: "Investigative (ഇൻവെസ്റ്റിഗേറ്റീവ്)", english: "Investigative" },
    summary: {
      malayalam: "കാര്യങ്ങൾ നിരീക്ഷിക്കാനും പഠിക്കാനും വിശകലനം ചെയ്യാനും പ്രശ്നപരിഹാരം കണ്ടെത്താനും ഇഷ്ടപ്പെടുന്നവരാണ് ഇക്കൂട്ടർ.",
      english: "You demonstrate strong problem-solving, learning, and analytical abilities."
    },
    careers: {
      malayalam: ["മറൈൻ ബയോളജി", "എൻജിനീയറിംഗ്", "കെമിസ്ട്രി", "സുവോളജി", "മെഡിസിൻ/സർജറി", "കൺസ്യൂമർ ഇക്കണോമിക്സ്", "സൈക്കോളജി"],
      english: ["Marine Biology", "Engineering", "Chemistry", "Zoology", "Medicine/Surgery", "Consumer Economics", "Psychology"]
    },
    strengths: {
      malayalam: ["പ്രശ്നപരിഹാരം", "വിശകലന ശേഷി", "നിരീക്ഷണ പാടവം"],
      english: ["Problem Solving", "Analytical Skills", "Observation Skills"]
    },
    description: {
      malayalam: "പ്രശ്നങ്ങളെ വീക്ഷിക്കുന്നതിലും, പഠിക്കുന്നതിലും, വിലയിരുത്തുന്നതിലും നിങ്ങൾക്ക് ചെറുതല്ലാത്ത ഭാവിയുണ്ട്. നിങ്ങൾക്ക് ശ്രമിച്ചു നോക്കാവുന്ന മേഖലകൾ: സമുദ്രജീവശാസ്ത്രം, എഞ്ചിനീയറിങ്, കെമിസ്ട്രി, സുവോളജി, മെഡിസിൻ/സർജറി, ഉപഭോക്തൃ സാമ്പത്തികശാസ്ത്രം, സൈക്കോളജി.",
      english: "You demonstrate strong abilities in observing, learning, and evaluating problems. Potential fields of interest include: marine biology, engineering, chemistry, zoology, medicine/surgery, consumer economics, or psychology."
    }
  },
  A: {
    category: 'A',
    title: { malayalam: "Artistic (ആർട്ടിസ്റ്റിക്)", english: "Artistic" },
    summary: {
      malayalam: "സ്വതന്ത്രമായി സ്വന്തം സർഗ്ഗാത്മകത ഉപയോഗിച്ച് ജോലി ചെയ്യാൻ ഇഷ്ടപ്പെടുന്നവരാണ് ഇവർ.",
      english: "You seem to have creative talents that could be well-utilized in unstructured environments."
    },
    careers: {
      malayalam: ["കമ്മ്യൂണിക്കേഷൻസ്", "കോസ്മെറ്റോളജി", "ഫൈൻ ആർട്സ്", "ഫോട്ടോഗ്രാഫി", "റേഡിയോ & ടിവി", "ഇൻ്റീരിയർ ഡിസൈൻ", "ആർക്കിടെക്ചർ"],
      english: ["Communication", "Cosmetology", "Performing Arts", "Fine Arts", "Photography", "Media (TV, Radio)", "Interior Design", "Architecture"]
    },
    strengths: {
      malayalam: ["സർഗ്ഗാത്മകത", "സ്വതന്ത്ര ചിന്ത", "ക്രിയാത്മകത"],
      english: ["Creativity", "Independent Thinking", "Creative Talents"]
    },
    description: {
      malayalam: "കൃത്യമായ ഘടനയില്ലാത്ത സ്ഥലങ്ങളിൽ സ്വന്തം ക്രിയാത്മകത ഉപയോഗിച്ച് ജോലി ചെയ്തും നിങ്ങളുടെ കഴിവുകളെ പരിപോഷിപ്പിക്കാം. ശ്രമിക്കാവുന്ന മേഖലകൾ: വാർത്താവിനിമയം, മെയ്ക്കപ്പ് (Cosmetology), നടനകലകളും ഫൈൻ ആർട്സും, ഫോട്ടോഗ്രഫി, ടി. വി., റേഡിയോ, ഇന്റീരിയർ ഡിസൈനിങ്, ആർക്കിടെക്ചർ.",
      english: "Your creative talents could also be well-utilized in unstructured environments. Potential areas to explore include: communication, cosmetology, performing arts, fine arts, photography, media (TV, radio), interior design, or architecture."
    }
  },
  S: {
    category: 'S',
    title: { malayalam: "Social (സോഷ്യൽ)", english: "Social" },
    summary: {
      malayalam: "വസ്തുക്കളേക്കാൾ ഉപരിയായി ആളുകളുമായി ഇടപഴകാനും അവരെ സഹായിക്കാനും ഇഷ്ടപ്പെടുന്നവരാണിവർ.",
      english: "Your interpersonal skills and desire to work with people suggest you may be well-suited for roles involving helping others."
    },
    careers: {
      malayalam: ["കൗൺസിലിംഗ്", "നഴ്സിംഗ്", "ഫിസിക്കൽ തെറാപ്പി", "ട്രാവൽ", "അഡ്വർടൈസിംഗ്", "പബ്ലിക് റിലേഷൻസ്", "എഡ്യൂക്കേഷൻ"],
      english: ["Counseling", "Nursing", "Physical Therapy", "Travel", "Advertising", "Public Relations", "Education"]
    },
    strengths: {
      malayalam: ["ആശയവിനിമയം", "സേവന മനോഭാവം", "അധ്യാപന കഴിവ്"],
      english: ["Interpersonal Skills", "Service Orientation", "Teaching/Training"]
    },
    description: {
      malayalam: "മറ്റു മനുഷ്യരുടെ കൂടെയുള്ള ജോലികളിലും നിങ്ങൾക്ക് വേണമെങ്കിൽ ഭാവി സൃഷ്ടിക്കാം. നിങ്ങൾക്ക് ശ്രമിക്കാവുന്ന മേഖലകൾ: കൗൺസിലിങ്, നഴ്സിങ്, ഫിസിക്കൽ തെറാപ്പി, സഞ്ചാരം, അഡ്വർടൈസിങ്, പബ്ലിക് റിലേഷൻ, വിദ്യാഭ്യാസം.",
      english: "You may also excel in roles involving work with other people. Potential fields to consider include: counseling, nursing, physical therapy, travel, advertising, public relations, or education."
    }
  },
  E: {
    category: 'E',
    title: { malayalam: "Enterprising (എന്റർപ്രൈസിംഗ്)", english: "Enterprising" },
    summary: {
      malayalam: "മറ്റുള്ളവരോടൊപ്പം ജോലി ചെയ്യാനും അവരെ കാര്യങ്ങൾ ബോധ്യപ്പെടുത്താനും നേതൃത്വം നൽകാനും ഇഷ്ടപ്പെടുന്നവരാണ് ഇക്കൂട്ടർ.",
      english: "You appear to have strengths in motivating and collaborating with others."
    },
    careers: {
      malayalam: ["ഫാഷൻ മെർക്കൻഡൈസിംഗ്", "റിയൽ എസ്റ്റേറ്റ്", "മാർക്കറ്റിംഗ്/സെയിൽസ്", "നിയമം (Law)", "പൊളിറ്റിക്കൽ സയൻസ്", "ഇൻ്റർനാഷണൽ ട്രേഡ്", "ബാങ്കിംഗ്/ഫിനാൻസ്"],
      english: ["Fashion Merchandising", "Real Estate", "Marketing/Sales", "Law", "Political Science", "International Trade", "Banking", "Finance"]
    },
    strengths: {
      malayalam: ["നേതൃത്വം", "പ്രേരണാശക്തി", "ബിസിനസ്സ് നൈപുണ്യം"],
      english: ["Leadership", "Influencing", "Business Aptitude"]
    },
    description: {
      malayalam: "മറ്റുള്ളവരുടെ കൂടെ പ്രചോദിപ്പിച്ചും പ്രകടനങ്ങൾ നടത്തിയും ജോലി ചെയ്യുന്നതിലും നിങ്ങളുടെയുള്ളിൽ കഴിവുണ്ട്. പരിശ്രമിക്കാവുന്ന മേഖലകൾ: ഫാഷൻ വാണിജ്യങ്ങൾ, റിയൽ എസ്റ്റേറ്റ്, മാർക്കറ്റിങ്/സെയിൽസ്, നിയമം, പൊളിറ്റിക്കൽ സയൻസ്, അന്തർദേശീയ കച്ചവടങ്ങൾ, ബാങ്കിങ്, ഫൈനാൻസിങ്.",
      english: "Your skills in inspiring, demonstrating, and collaborating with others suggest you may thrive in areas like: fashion merchandising, real estate, marketing/sales, law, political science, international trade, banking, or finance."
    }
  },
  C: {
    category: 'C',
    title: { malayalam: "Conventional (കൺവെൻഷണൽ)", english: "Conventional" },
    summary: {
      malayalam: "വിവരങ്ങൾ (Data) ചിട്ടയോടെ കൈകാര്യം ചെയ്യാനും കൃത്യതയോടെയും അച്ചടക്കത്തോടെയും ജോലി ചെയ്യാനും ഇഷ്ടപ്പെടുന്നവരാണിവർ.",
      english: "Your attention to detail and comfort working with data and precision suggest you may excel in organized environments."
    },
    careers: {
      malayalam: ["അക്കൗണ്ടിംഗ്", "ഇൻഷുറൻസ്", "അഡ്മിനിസ്ട്രേഷൻ", "മെഡിക്കൽ റെക്കോർഡ്സ്", "ബാങ്കിംഗ്", "ഡാറ്റ പ്രോസസിംഗ്"],
      english: ["Accounting", "Court Reporting", "Insurance", "Administration", "Medical Records", "Banking", "Data Processing"]
    },
    strengths: {
      malayalam: ["ചിട്ടയായ പ്രവർത്തനം", "കൃത്യത", "വിവര വിശകലനം"],
      english: ["Organization", "Precision", "Data Orientation"]
    },
    description: {
      malayalam: "വിശദീകരണങ്ങൾക്ക് അധിഷ്ഠിതമായി, കൃത്യമായി ജോലി ചെയ്യാനും നിങ്ങളുടെയുള്ളിൽ താല്പര്യംമുണ്ട്. ഡാറ്റകളോട് അല്പമെങ്കിലും പ്രിയവുമുണ്ട്. ഈ സാധ്യതകളും നിങ്ങൾക്ക് നോക്കാം: അക്കൗണ്ടിങ്, കോടതി റിപ്പോർട്ടിങ്, ഇൻഷുറൻസ്, അഡ്മിനിസ്ട്രേഷൻ, മെഡിക്കൽ റെക്കോഡുകൾ, ബാങ്കിങ്, ഡാറ്റ പ്രൊസസിങ്.",
      english: "Your attention to detail, data orientation, and accuracy indicate you may also find success in fields such as: accounting, court reporting, insurance, administration, medical records, banking, or data processing."
    }
  }
};
