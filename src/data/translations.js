// Demonstration translations for the public warning message. These are illustrative
// prototype strings and should be reviewed by language experts before any real use.

export const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', font: '' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', font: 'font-kannada' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', font: 'font-deva' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', font: 'font-telugu' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', font: 'font-tamil' },
  { code: 'mr', label: 'Marathi', native: 'मराठी', font: 'font-deva' },
];

export const publicStrings = {
  en: {
    title: 'Severe Thunderstorm Warning',
    message: 'Severe thunderstorm expected within 15 minutes. Move indoors.',
    location: 'Location', expected: 'Expected', within15: 'Within 15 minutes',
    lightningProb: 'Lightning probability',
    action: 'Move indoors immediately and avoid open areas.',
    safe: 'Nearest Safe Locations', understood: 'UNDERSTOOD', issued: 'Issued',
    tips: ['Stay away from trees, poles and water bodies', 'Unplug electrical appliances', 'Do not use wired phones', 'Wait 30 minutes after the last thunder'],
    tipsTitle: 'Safety instructions',
  },
  kn: {
    title: 'ತೀವ್ರ ಗುಡುಗು ಸಹಿತ ಮಳೆ ಎಚ್ಚರಿಕೆ',
    message: 'ಮುಂದಿನ 15 ನಿಮಿಷಗಳಲ್ಲಿ ತೀವ್ರ ಗುಡುಗು ಸಹಿತ ಮಳೆಯ ಸಾಧ್ಯತೆ ಇದೆ. ಒಳಾಂಗಣಕ್ಕೆ ತೆರಳಿ.',
    location: 'ಸ್ಥಳ', expected: 'ನಿರೀಕ್ಷಿತ ಸಮಯ', within15: '15 ನಿಮಿಷಗಳೊಳಗೆ',
    lightningProb: 'ಸಿಡಿಲಿನ ಸಾಧ್ಯತೆ',
    action: 'ತಕ್ಷಣ ಒಳಾಂಗಣಕ್ಕೆ ತೆರಳಿ ಮತ್ತು ತೆರೆದ ಪ್ರದೇಶಗಳನ್ನು ತಪ್ಪಿಸಿ.',
    safe: 'ಹತ್ತಿರದ ಸುರಕ್ಷಿತ ಸ್ಥಳಗಳು', understood: 'ಅರ್ಥವಾಯಿತು', issued: 'ಹೊರಡಿಸಲಾಗಿದೆ',
    tips: ['ಮರಗಳು, ಕಂಬಗಳು ಮತ್ತು ಜಲಮೂಲಗಳಿಂದ ದೂರವಿರಿ', 'ವಿದ್ಯುತ್ ಉಪಕರಣಗಳ ಪ್ಲಗ್ ತೆಗೆಯಿರಿ', 'ತಂತಿ ದೂರವಾಣಿ ಬಳಸಬೇಡಿ', 'ಕೊನೆಯ ಗುಡುಗಿನ ನಂತರ 30 ನಿಮಿಷ ಕಾಯಿರಿ'],
    tipsTitle: 'ಸುರಕ್ಷತಾ ಸೂಚನೆಗಳು',
  },
  hi: {
    title: 'गंभीर आंधी-तूफ़ान चेतावनी',
    message: 'अगले 15 मिनट में तीव्र आंधी-तूफ़ान की संभावना है। घर के अंदर जाएँ।',
    location: 'स्थान', expected: 'अपेक्षित', within15: '15 मिनट के भीतर',
    lightningProb: 'बिजली गिरने की संभावना',
    action: 'तुरंत घर के अंदर जाएँ और खुले स्थानों से बचें।',
    safe: 'निकटतम सुरक्षित स्थान', understood: 'समझ गया', issued: 'जारी',
    tips: ['पेड़ों, खंभों और जलाशयों से दूर रहें', 'बिजली के उपकरणों के प्लग निकालें', 'तार वाले फ़ोन का उपयोग न करें', 'आख़िरी गरज के बाद 30 मिनट प्रतीक्षा करें'],
    tipsTitle: 'सुरक्षा निर्देश',
  },
  te: {
    title: 'తీవ్ర ఉరుములతో కూడిన తుఫాను హెచ్చరిక',
    message: 'రాబోయే 15 నిమిషాల్లో తీవ్రమైన ఉరుములతో కూడిన తుఫాను వచ్చే అవకాశం ఉంది. లోపలికి వెళ్ళండి.',
    location: 'ప్రాంతం', expected: 'అంచనా సమయం', within15: '15 నిమిషాల్లోపు',
    lightningProb: 'పిడుగు పడే అవకాశం',
    action: 'వెంటనే లోపలికి వెళ్ళండి, బహిరంగ ప్రదేశాలను నివారించండి.',
    safe: 'సమీప సురక్షిత ప్రదేశాలు', understood: 'అర్థమైంది', issued: 'జారీ',
    tips: ['చెట్లు, స్తంభాలు, నీటి వనరులకు దూరంగా ఉండండి', 'విద్యుత్ ఉపకరణాల ప్లగ్ తీసేయండి', 'వైర్డ్ ఫోన్లు వాడకండి', 'చివరి ఉరుము తర్వాత 30 నిమిషాలు వేచి ఉండండి'],
    tipsTitle: 'భద్రతా సూచనలు',
  },
  ta: {
    title: 'கடுமையான இடியுடன் கூடிய புயல் எச்சரிக்கை',
    message: 'அடுத்த 15 நிமிடங்களில் கடுமையான இடியுடன் கூடிய மழை எதிர்பார்க்கப்படுகிறது. உள்ளே செல்லுங்கள்.',
    location: 'இடம்', expected: 'எதிர்பார்ப்பு', within15: '15 நிமிடங்களுக்குள்',
    lightningProb: 'மின்னல் வாய்ப்பு',
    action: 'உடனடியாக உள்ளே செல்லுங்கள்; திறந்த வெளிகளைத் தவிர்க்கவும்.',
    safe: 'அருகிலுள்ள பாதுகாப்பான இடங்கள்', understood: 'புரிந்தது', issued: 'வெளியிடப்பட்டது',
    tips: ['மரங்கள், கம்பங்கள், நீர்நிலைகளிலிருந்து விலகி இருங்கள்', 'மின் சாதனங்களின் இணைப்பைத் துண்டிக்கவும்', 'கம்பி தொலைபேசியைப் பயன்படுத்த வேண்டாம்', 'கடைசி இடிக்குப் பின் 30 நிமிடம் காத்திருங்கள்'],
    tipsTitle: 'பாதுகாப்பு அறிவுரைகள்',
  },
  mr: {
    title: 'तीव्र वादळी वाऱ्यासह पावसाचा इशारा',
    message: 'पुढील 15 मिनिटांत तीव्र वादळी पावसाची शक्यता आहे. घरात जा.',
    location: 'ठिकाण', expected: 'अपेक्षित', within15: '15 मिनिटांच्या आत',
    lightningProb: 'वीज पडण्याची शक्यता',
    action: 'ताबडतोब घरात जा आणि मोकळ्या जागा टाळा.',
    safe: 'जवळची सुरक्षित ठिकाणे', understood: 'समजले', issued: 'जारी',
    tips: ['झाडे, खांब आणि जलाशयांपासून दूर राहा', 'विद्युत उपकरणांचे प्लग काढा', 'तारेचा फोन वापरू नका', 'शेवटच्या गडगडाटानंतर 30 मिनिटे थांबा'],
    tipsTitle: 'सुरक्षा सूचना',
  },
};

export const safeLocationsByLang = {
  en: ['Community Hall', 'Government School', 'Panchayat Office'],
  kn: ['ಸಮುದಾಯ ಭವನ', 'ಸರ್ಕಾರಿ ಶಾಲೆ', 'ಪಂಚಾಯತ್ ಕಚೇರಿ'],
  hi: ['सामुदायिक भवन', 'सरकारी विद्यालय', 'पंचायत कार्यालय'],
  te: ['కమ్యూనిటీ హాల్', 'ప్రభుత్వ పాఠశాల', 'పంచాయతీ కార్యాలయం'],
  ta: ['சமுதாயக் கூடம்', 'அரசுப் பள்ளி', 'பஞ்சாயத்து அலுவலகம்'],
  mr: ['समाज मंदिर', 'सरकारी शाळा', 'ग्रामपंचायत कार्यालय'],
};
