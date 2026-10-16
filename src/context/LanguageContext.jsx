import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Header & Nav
    nav_home: 'Home',
    nav_nationalists: 'Nationalists',
    nav_community: 'Community',
    nav_the_govt: 'The Govt',
    donate: 'Donate',
    submit_propagandu: 'Submit Propagandu',
    suggest_creator: 'Suggest Creator',
    music_on: 'MUSIC ON',
    music_off: 'MUSIC OFF',
    
    // Propagandus Directory
    dir_title: 'PUBLIC INTELLIGENCE VAULT',
    dir_subtitle: 'Declassified dossier exposing individuals, political conduits, and digital propagandists running organized subversion campaigns against Bharat.',
    search_placeholder: 'Search by name, handle, party, or keyword...',
    all_categories: 'All Categories',
    all_parties: 'All Opposition Parties',
    all_institutions: 'All Institutions',
    sort_upvoted: 'Most Upvoted',
    sort_newest: 'Newest First',
    sort_oldest: 'Oldest First',
    view_profile: 'Profile',
    view_detailed: 'Detailed',
    report_banner: 'Report These People from Social Media to Remove these Anti-Bharat Forces Outside and Protect Bharat!',
    propagandus_report_msg: 'Report These People from social Media to Remove these Anti-Bharat Forces Outside and Protect Bharat',
    tracked_narrative: 'TRACKED ANTI-INDIA NARRATIVE:',
    expose: 'Expose',
    exposed: 'Exposed',
    evidence_link: 'Evidence Link',
    no_profiles: 'No Profiles Found',
    no_profiles_desc: 'No matching profiles found with current search or filters.',
    reset_filters: 'Reset Filters',
    
    // Nationalist Page
    nat_banner: 'Support These Nationalist People Who always Stands for Bharat in Every Situations, Must Follow all these people on their Social Media!',
    nationalist_banner_msg: 'Support These Nationalist People Who always Stands for Bharat in Every Situations, Must Follow all these people on their Social Media',
    nat_search_placeholder: 'Search nationalist creators by name, topic, or social handle...',
    nat_filter: 'Filter',
    
    // Suggest Feature
    suggest_title: '💡 SUGGEST UPDATES OR FEATURES TO ADMIN',
    suggest_desc: 'Have an idea to improve Exposed Propagandus? Want a new feature or found an issue? Send your suggestions directly to Commander Om Kumar.',
    your_name: 'Your Name',
    your_email: 'Your Email',
    suggestion_category: 'Category',
    suggestion_message: 'Your Suggestion / Feature Request',
    submit_suggestion: '🚀 Send to Admin',
    sending: 'Sending...',
    suggestion_sent: '✅ Suggestion sent directly to Admin Om Kumar!',
    
    // Anti-Inspect Shield
    shield_title: '🛡️ SOVEREIGN SECURITY SHIELD ACTIVE',
    shield_subtitle: 'PAGE INSPECTION / DEVTOOLS DETECTED',
    shield_desc: 'For national data integrity and anti-tampering protection, page interaction is paused. Please close Developer Tools to resume browsing.'
  },
  hi: {
    // Header & Nav
    nav_home: 'होम',
    nav_nationalists: 'राष्ट्रवादी',
    nav_community: 'कम्युनिटी',
    nav_the_govt: 'सरकार',
    donate: 'सहयोग / दान',
    submit_propagandu: 'प्रोपेगैंडा जोड़ें',
    suggest_creator: 'राष्ट्रवादी जोड़ें',
    music_on: 'संगीत चालू',
    music_off: 'संगीत बंद',
    
    // Propagandus Directory
    dir_title: 'सार्वजनिक गुप्तचर डायरेक्टरी',
    dir_subtitle: 'भारत-विरोधी एजेंडा, राजनीतिक षड्यंत्र और झूठे नैरेटिव फैलाने वाले प्रोपेगैंडा तत्वों का प्रामाणिक सार्वजनिक दस्तावेज़।',
    search_placeholder: 'नाम, सोशल हैंडल, पार्टी या कीवर्ड से खोजें...',
    all_categories: 'सभी श्रेणियां',
    all_parties: 'सभी विपक्षी पार्टियां',
    all_institutions: 'सभी संस्थान',
    sort_upvoted: 'सर्वाधिक वोट',
    sort_newest: 'नवीनतम पहले',
    sort_oldest: 'पुराने पहले',
    view_profile: 'प्रोफ़ाइल',
    view_detailed: 'विस्तृत विवरण',
    report_banner: 'भारत की रक्षा के लिए इन भारत-विरोधी तत्वों को सोशल मीडिया पर रिपोर्ट करें और देश से बाहर का रास्ता दिखाएं!',
    propagandus_report_msg: 'भारत की सुरक्षा और इन भारत विरोधी ताकतों को बाहर करने के लिए सोशल मीडिया पर इन लोगों को रिपोर्ट करें',
    tracked_narrative: 'चिह्नित भारत-विरोधी नैरेटिव:',
    expose: 'एक्सपोज़ करें',
    exposed: 'एक्सपोज़्ड',
    evidence_link: 'प्रमाण लिंक',
    no_profiles: 'कोई प्रोफ़ाइल नहीं मिली',
    no_profiles_desc: 'वर्तमान खोज या फ़िल्टर के अनुसार कोई परिणाम नहीं मिला।',
    reset_filters: 'फ़िल्टर हटाएं',
    
    // Nationalist Page
    nat_banner: 'हमेशा हर परिस्थिति में भारत के लिए खड़े रहने वाले इन राष्ट्रवादियों का समर्थन करें, सोशल मीडिया पर इन्हें अवश्य फॉलो करें!',
    nationalist_banner_msg: 'हर परिस्थिति में हमेशा भारत के साथ खड़े रहने वाले इन राष्ट्रवादी लोगों का समर्थन करें, सोशल मीडिया पर इन्हें अवश्य फॉलो करें',
    nat_search_placeholder: 'राष्ट्रवादी विचारकों और क्रिएटर्स को खोजें...',
    nat_filter: 'खोजें',
    
    // Suggest Feature
    suggest_title: '💡 व्यवस्था सुधार एवं नए फीचर का सुझाव दें',
    suggest_desc: 'क्या आपके पास वेबसाइट को बेहतर बनाने का कोई विचार है? कोई नया फीचर चाहते हैं? सीधे एडमिन ओम कुमार को अपना सुझाव भेजें।',
    your_name: 'आपका नाम',
    your_email: 'आपका ईमेल',
    suggestion_category: 'सुझाव श्रेणी',
    suggestion_message: 'आपका सुझाव / नया फीचर विवरण',
    submit_suggestion: '🚀 एडमिन को सुझाव भेजें',
    sending: 'भेजा जा रहा है...',
    suggestion_sent: '✅ आपका सुझाव सीधे एडमिन ओम कुमार को भेज दिया गया है!',
    
    // Anti-Inspect Shield
    shield_title: '🛡️ संप्रभु सुरक्षा शील्ड सक्रिय',
    shield_subtitle: 'डेवलपर टूल्स / इंस्पेक्ट मोड का पता चला',
    shield_desc: 'राष्ट्रीय डेटा सुरक्षा एवं छेड़छाड़ निषेध हेतु वेबसाइट को अस्थायी रूप से रोक दिया गया है। जारी रखने के लिए कृपया इंस्पेक्ट मोड बंद करें।'
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('ep_lang') || 'en';
    } catch (e) {
      return 'en';
    }
  });

  const toggleLang = () => {
    setLang(prev => {
      const next = prev === 'en' ? 'hi' : 'en';
      try {
        localStorage.setItem('ep_lang', next);
      } catch (e) {}
      return next;
    });
  };

  const t = (key, fallback = '') => {
    return translations[lang]?.[key] || translations['en']?.[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      lang: 'en',
      toggleLang: () => {},
      t: (key, fallback = '') => fallback || key
    };
  }
  return context;
}
