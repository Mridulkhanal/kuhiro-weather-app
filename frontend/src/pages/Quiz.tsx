import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "../context/LanguageContext";
import "./Quiz.css";

type Question = {
  question: { en: string; ne: string };
  options: { en: string[]; ne: string[] };
  correct: number;
};

type HighScore = {
  player: string;
  score: number;
};

const easyQuestions: Question[] = [
  {
    question: {
      en: "☀️ What do we call frozen water falling from the sky?",
      ne: "☀️ आकाशबाट खस्ने जमेको पानीलाई के भनिन्छ?",
    },
    options: {
      en: ["Rain", "Snow", "Cloud", "Wind"],
      ne: ["वर्षा", "हिउँ", "बादल", "हावा"],
    },
    correct: 1,
  },
  {
    question: {
      en: "🌧️ Which tool measures rainfall?",
      ne: "🌧️ कुन उपकरणले वर्षा मापन गर्छ?",
    },
    options: {
      en: ["Thermometer", "Rain Gauge", "Barometer", "Compass"],
      ne: ["थर्ममिटर", "रेन गेज", "ब्यारोमिटर", "कम्पास"],
    },
    correct: 1,
  },
  {
    question: {
      en: "What is a device used to measure temperature?",
      ne: "तापक्रम मापन गर्न प्रयोग हुने उपकरण के हो?",
    },
    options: {
      en: ["Thermometer", "Barometer", "Anemometer", "Hygrometer"],
      ne: ["थर्ममिटर", "ब्यारोमिटर", "एनेमोमिटर", "हाइग्रोमिटर"],
    },
    correct: 0,
  },
  {
    question: {
      en: "What are stratus, cirrus, cumulus types of?",
      ne: "स्ट्र्याटस, सिरस, क्युमुलस कुनका प्रकार हुन्?",
    },
    options: {
      en: ["Clouds", "Winds", "Rains", "Storms"],
      ne: ["बादल", "हावा", "वर्षा", "आँधी"],
    },
    correct: 0,
  },
  {
    question: {
      en: "Which country has the most tornadoes?",
      ne: "कुन देशमा सबैभन्दा धेरै टोर्नाडो हुन्छ?",
    },
    options: {
      en: ["USA", "Australia", "India", "Canada"],
      ne: ["संयुक्त राज्य अमेरिका", "अष्ट्रेलिया", "भारत", "क्यानडा"],
    },
    correct: 0,
  },
  {
    question: {
      en: "What color should you wear to stay cool on a hot day?",
      ne: "गर्मीको दिनमा चिसो रहन कुन रङको लुगा लगाउनुपर्छ?",
    },
    options: {
      en: ["Black", "White", "Red", "Blue"],
      ne: ["कालो", "सेतो", "रातो", "निलो"],
    },
    correct: 1,
  },
  {
    question: {
      en: "What is the study of weather called?",
      ne: "मौसमको अध्ययनलाई के भनिन्छ?",
    },
    options: {
      en: ["Geology", "Meteorology", "Biology", "Astronomy"],
      ne: ["भूविज्ञान", "मौसम विज्ञान", "जीवविज्ञान", "खगोल विज्ञान"],
    },
    correct: 1,
  },
  {
    question: {
      en: "What is needed to create a blizzard?",
      ne: "हिमआँधी बनाउन के आवश्यक छ?",
    },
    options: {
      en: ["Rain and wind", "Snow and wind", "Sun and heat", "Clouds and fog"],
      ne: ["वर्षा र हावा", "हिउँ र हावा", "घाम र ताप", "बादल र कुहिरो"],
    },
    correct: 1,
  },
  {
    question: {
      en: "What makes the wind blow?",
      ne: "हावालाई चलाउने के हो?",
    },
    options: {
      en: ["Trees", "Differences in air pressure", "Ocean", "Mountains"],
      ne: ["रूखहरू", "हावाको चापको भिन्नता", "समुद्र", "पहाडहरू"],
    },
    correct: 1,
  },
  {
    question: {
      en: "What is fog?",
      ne: "कुहिरो के हो?",
    },
    options: {
      en: ["A type of rain", "A cloud on the ground", "Snow falling", "Wind storm"],
      ne: ["वर्षाको एक प्रकार", "जमिनमा बादल", "हिउँ खस्ने", "हावाको आँधी"],
    },
    correct: 1,
  },
  {
    question: {
      en: "What is hail?",
      ne: "असिना के हो?",
    },
    options: {
      en: ["Frozen rain", "Snow balls", "Ice pellets from thunderstorms", "Sleet"],
      ne: ["जमेको वर्षा", "हिउँको गोला", "आँधीबाट बनेको बरफको कण", "हिउँमिश्रित वर्षा"],
    },
    correct: 2,
  },
  {
    question: {
      en: "How many inches in the highest yearly snowfall on record?",
      ne: "रेकर्डमा सबैभन्दा धेरै वार्षिक हिमपात कति इन्च हो?",
    },
    options: {
      en: ["29", "678", "1224", "100"],
      ne: ["२९", "६७८", "१२२४", "१००"],
    },
    correct: 2,
  },
  {
    question: {
      en: "What is a rainbow caused by?",
      ne: "इन्द्रेणी केले हुन्छ?",
    },
    options: {
      en: ["Wind", "Sunlight and rain", "Clouds", "Snow"],
      ne: ["हावा", "सूर्यको प्रकाश र वर्षा", "बादल", "हिउँ"],
    },
    correct: 1,
  },
  {
    question: {
      en: "What do we call a storm with strong winds and rain?",
      ne: "कडा हावा र वर्षासहितको आँधीबेहरीलाई के भनिन्छ?",
    },
    options: {
      en: ["Tornado", "Hurricane", "Blizzard", "Fog"],
      ne: ["टोर्नाडो", "हरिकेन", "हिमआँधी", "कुहिरो"],
    },
    correct: 1,
  },
  {
    question: {
      en: "What is the term for a long period without rain?",
      ne: "लामो समयसम्म वर्षा नहुने अवस्थालाई के भनिन्छ?",
    },
    options: {
      en: ["Flood", "Drought", "Hurricane", "Blizzard"],
      ne: ["बाढी", "खडेरी", "हरिकेन", "हिमआँधी"],
    },
    correct: 1,
  },
  {
    question: {
      en: "What gas makes up most of Earth's atmosphere?",
      ne: "पृथ्वीको वायुमण्डलको सबैभन्दा धेरै हिस्सा कुन ग्यासले बनाउँछ?",
    },
    options: {
      en: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Helium"],
      ne: ["अक्सिजन", "कार्बन डाइअक्साइड", "नाइट्रोजन", "हिलियम"],
    },
    correct: 2,
  },
  {
    question: {
      en: "What is a sudden burst of wind called?",
      ne: "हावाको अचानक झोक्कालाई के भनिन्छ?",
    },
    options: {
      en: ["Gust", "Breeze", "Gale", "Draft"],
      ne: ["झोक्का", "हल्का हावा", "आँधी", "हावाको बहाव"],
    },
    correct: 0,
  },
  {
    question: {
      en: "What do clouds need to form?",
      ne: "बादल बनाउन के आवश्यक छ?",
    },
    options: {
      en: ["Wind", "Water vapor", "Sand", "Smoke"],
      ne: ["हावा", "पानीको वाफ", "बालुवा", "धुवाँ"],
    },
    correct: 1,
  },
  {
    question: {
      en: "What is the calm center of a hurricane called?",
      ne: "हरिकेनको शान्त केन्द्रलाई के भनिन्छ?",
    },
    options: {
      en: ["Eye", "Wall", "Tail", "Core"],
      ne: ["आँखा", "पर्खाल", "पुच्छर", "केन्द्र"],
    },
    correct: 0,
  },
  {
    question: {
      en: "What season is typically the warmest?",
      ne: "सामान्यतया कुन मौसम सबैभन्दा तातो हुन्छ?",
    },
    options: {
      en: ["Winter", "Spring", "Summer", "Fall"],
      ne: ["हिउँद", "वसन्त", "गर्मी", "शरद"],
    },
    correct: 2,
  },
  {
    question: {
      en: "What is sleet?",
      ne: "हिउँमिश्रित वर्षा के हो?",
    },
    options: {
      en: ["Snow", "Rain mixed with ice", "Hail", "Fog"],
      ne: ["हिउँ", "बरफसहितको वर्षा", "असिना", "कुहिरो"],
    },
    correct: 1,
  },
  {
    question: {
      en: "What do we call a scientist who studies weather?",
      ne: "मौसम अध्ययन गर्ने वैज्ञानिकलाई के भनिन्छ?",
    },
    options: {
      en: ["Biologist", "Geologist", "Meteorologist", "Chemist"],
      ne: ["जीववैज्ञानिक", "भूवैज्ञानिक", "मौसमवैज्ञानिक", "रसायनवैज्ञानिक"],
    },
    correct: 2,
  },
  {
    question: {
      en: "What causes thunder?",
      ne: "गर्जनको कारण के हो?",
    },
    options: {
      en: ["Wind", "Lightning", "Rain", "Clouds"],
      ne: ["हावा", "चट्याङ", "वर्षा", "बादल"],
    },
    correct: 1,
  },
  {
    question: {
      en: "What is the term for very low temperatures?",
      ne: "धेरै कम तापक्रमको लागि कुन शब्द प्रयोग हुन्छ?",
    },
    options: {
      en: ["Heatwave", "Cold snap", "Drought", "Flood"],
      ne: ["तातो लहर", "चिसो अवस्था", "खडेरी", "बाढी"],
    },
    correct: 1,
  },
  {
    question: {
      en: "What is a common sign of an approaching storm?",
      ne: "आँधीबेहरी आउँदै गरेको सामान्य संकेत के हो?",
    },
    options: {
      en: ["Clear skies", "Dark clouds", "Bright sun", "Calm winds"],
      ne: ["खुला आकाश", "काला बादल", "चम्किलो घाम", "शान्त हावा"],
    },
    correct: 1,
  },
];

const mediumQuestions: Question[] = [
  {
    question: {
      en: "🌡️ Which layer of the atmosphere contains the ozone layer?",
      ne: "🌡️ वायुमण्डलको कुन तहमा ओजोन तह हुन्छ?",
    },
    options: {
      en: ["Troposphere", "Stratosphere", "Mesosphere", "Exosphere"],
      ne: ["ट्रोपोस्फियर", "स्ट्र्याटोस्फियर", "मेसोस्फियर", "एक्सोस्फियर"],
    },
    correct: 1,
  },
  {
    question: {
      en: "💨 What causes wind?",
      ne: "💨 हावाको कारण के हो?",
    },
    options: {
      en: [
        "Movement of clouds",
        "Temperature differences",
        "Rotation of Earth only",
        "Ocean waves",
      ],
      ne: [
        "बादलको चाल",
        "तापक्रमको भिन्नता",
        "पृथ्वीको घुमाइ मात्र",
        "समुद्री छालहरू",
      ],
    },
    correct: 1,
  },
  {
    question: {
      en: "What do you call someone who forecasts weather?",
      ne: "मौसम पूर्वानुमान गर्ने व्यक्तिलाई के भनिन्छ?",
    },
    options: {
      en: ["Astronomer", "Geologist", "Meteorologist", "Biologist"],
      ne: ["खगोलवैज्ञानिक", "भूवैज्ञानिक", "मौसमवैज्ञानिक", "जीववैज्ञानिक"],
    },
    correct: 2,
  },
  {
    question: {
      en: "What two things are needed for a rainbow?",
      ne: "इन्द्रेणीको लागि कुन दुई चीजहरू आवश्यक छन्?",
    },
    options: {
      en: ["Sun and rain", "Moon and clouds", "Wind and sun", "Rain and wind"],
      ne: ["सूर्य र वर्षा", "चन्द्रमा र बादल", "हावा र सूर्य", "वर्षा र हावा"],
    },
    correct: 0,
  },
  {
    question: {
      en: "What is the average weather pattern called?",
      ne: "औसत मौसम ढाँचालाई के भनिन्छ?",
    },
    options: {
      en: ["Weather", "Climate", "Season", "Forecast"],
      ne: ["मौसम", "जलवायु", "मौसम (ऋतु)", "पूर्वानुमान"],
    },
    correct: 1,
  },
  {
    question: {
      en: "What is a rotating funnel cloud with high winds?",
      ne: "उच्च हावासहितको घुम्ने फनेल बादललाई के भनिन्छ?",
    },
    options: {
      en: ["Hurricane", "Tornado", "Cyclone", "Typhoon"],
      ne: ["हरिकेन", "टोर्नाडो", "चक्रवात", "टाइफुन"],
    },
    correct: 1,
  },
  {
    question: {
      en: "Highest temperature recorded (134°F) in which country?",
      ne: "सबैभन्दा उच्च तापक्रम (१३४°F) कुन देशमा रेकर्ड गरिएको छ?",
    },
    options: {
      en: ["Saudi Arabia", "USA", "Australia", "India"],
      ne: ["साउदी अरेबिया", "संयुक्त राज्य अमेरिका", "अष्ट्रेलिया", "भारत"],
    },
    correct: 1,
  },
  {
    question: {
      en: "What makes hurricanes powerful?",
      ne: "हरिकेनलाई शक्तिशाली बनाउने के हो?",
    },
    options: {
      en: ["Warm ocean water", "Cold air", "Mountains", "Deserts"],
      ne: ["तातो समुद्री पानी", "चिसो हावा", "पहाडहरू", "मरुभूमि"],
    },
    correct: 0,
  },
  {
    question: {
      en: "What is snow?",
      ne: "हिउँ के हो?",
    },
    options: {
      en: ["Frozen rain", "Ice crystals", "Hail", "Sleet"],
      ne: ["जमेको वर्षा", "बरफका क्रिस्टल", "असिना", "हिउँमिश्रित वर्षा"],
    },
    correct: 1,
  },
  {
    question: {
      en: "What are clouds made of?",
      ne: "बादलहरू केले बनेका हुन्छन्?",
    },
    options: {
      en: ["Cotton", "Water droplets", "Smoke", "Air only"],
      ne: ["कपास", "पानीका थोपाहरू", "धुवाँ", "हावा मात्र"],
    },
    correct: 1,
  },
  {
    question: {
      en: "What is a drought?",
      ne: "खडेरी के हो?",
    },
    options: {
      en: ["Too much rain", "Lack of water", "Strong wind", "Cold weather"],
      ne: ["धेरै वर्षा", "पानीको कमी", "कडा हावा", "चिसो मौसम"],
    },
    correct: 1,
  },
  {
    question: {
      en: "What causes seasons?",
      ne: "मौसमहरू (ऋतुहरू) को कारण के हो?",
    },
    options: {
      en: ["Earth's tilt", "Distance from sun", "Moon", "Wind"],
      ne: ["पृथ्वीको झुकाव", "सूर्यबाट दूरी", "चन्द्रमा", "हावा"],
    },
    correct: 0,
  },
  {
    question: {
      en: "What is the primary source of Earth's climate system?",
      ne: "पृथ्वीको जलवायु प्रणालीको प्राथमिक स्रोत के हो?",
    },
    options: {
      en: ["Moon", "Sun", "Stars", "Earth's core"],
      ne: ["चन्द्रमा", "सूर्य", "ताराहरू", "पृथ्वीको केन्द्र"],
    },
    correct: 1,
  },
  {
    question: {
      en: "What measures atmospheric pressure?",
      ne: "वायुमण्डलीय चाप मापन गर्ने के हो?",
    },
    options: {
      en: ["Thermometer", "Barometer", "Anemometer", "Hygrometer"],
      ne: ["थर्ममिटर", "ब्यारोमिटर", "एनेमोमिटर", "हाइग्रोमिटर"],
    },
    correct: 1,
  },
  {
    question: {
      en: "What is a cold front?",
      ne: "चिसो मोर्चा के हो?",
    },
    options: {
      en: [
        "Warm air replacing cold air",
        "Cold air replacing warm air",
        "Stable air mass",
        "High-pressure system",
      ],
      ne: [
        "तातो हावाले चिसो हावालाई विस्थापन गर्ने",
        "चिसो हावाले तातो हावालाई विस्थापन गर्ने",
        "स्थिर हावाको समूह",
        "उच्च-चाप प्रणाली",
      ],
    },
    correct: 1,
  },
  {
    question: {
      en: "What type of cloud is thin and wispy?",
      ne: "कुन प्रकारको बादल पातलो र हल्का हुन्छ?",
    },
    options: {
      en: ["Cumulus", "Stratus", "Cirrus", "Nimbus"],
      ne: ["क्युमुलस", "स्ट्र्याटस", "सिरस", "निम्बस"],
    },
    correct: 2,
  },
  {
    question: {
      en: "What is the term for a sudden flood caused by heavy rain?",
      ne: "भारी वर्षाले हुने अचानक बाढीलाई के भनिन्छ?",
    },
    options: {
      en: ["Tsunami", "Flash flood", "Hurricane", "Tornado"],
      ne: ["सुनामी", "आकस्मिक बाढी", "हरिकेन", "टोर्नाडो"],
    },
    correct: 1,
  },
  {
    question: {
      en: "What is the jet stream?",
      ne: "जेट स्ट्रिम के हो?",
    },
    options: {
      en: [
        "Ocean current",
        "High-altitude wind",
        "Low-pressure system",
        "Rain pattern",
      ],
      ne: [
        "समुद्री धारा",
        "उच्च उचाइको हावा",
        "निम्न-चाप प्रणाली",
        "वर्षाको ढाँचा",
      ],
    },
    correct: 1,
  },
  {
    question: {
      en: "What is El Niño?",
      ne: "एल निनो के हो?",
    },
    options: {
      en: [
        "A cooling of ocean waters",
        "A warming of ocean waters",
        "A type of tornado",
        "A high-pressure system",
      ],
      ne: [
        "समुद्री पानीको चिसो",
        "समुद्री पानीको तातो",
        "टोर्नाडोको प्रकार",
        "उच्च-चाप प्रणाली",
      ],
    },
    correct: 1,
  },
  {
    question: {
      en: "What does a hygrometer measure?",
      ne: "हाइग्रोमिटरले के मापन गर्छ?",
    },
    options: {
      en: ["Wind speed", "Humidity", "Pressure", "Temperature"],
      ne: ["हावाको गति", "आर्द्रता", "चाप", "तापक्रम"],
    },
    correct: 1,
  },
  {
    question: {
      en: "What is a monsoon?",
      ne: "मानसून के हो?",
    },
    options: {
      en: [
        "A dry season",
        "A seasonal wind with heavy rain",
        "A cold front",
        "A type of cloud",
      ],
      ne: [
        "सुख्खा मौसम",
        "भारी वर्षासहितको मौसमी हावा",
        "चिसो मोर्चा",
        "बादलको प्रकार",
      ],
    },
    correct: 1,
  },
  {
    question: {
      en: "What is the greenhouse effect?",
      ne: "हरितगृह प्रभाव के हो?",
    },
    options: {
      en: [
        "Cooling of the Earth",
        "Trapping of heat by gases",
        "Wind circulation",
        "Ocean currents",
      ],
      ne: [
        "पृथ्वीको चिसो",
        "ग्यासहरूद्वारा तापको संग्रह",
        "हावाको परिसंचरण",
        "समुद्री धाराहरू",
      ],
    },
    correct: 1,
  },
  {
    question: {
      en: "What is a waterspout?",
      ne: "वाटरस्पाउट के हो?",
    },
    options: {
      en: [
        "A type of rain",
        "A tornado over water",
        "A wave",
        "A cloud formation",
      ],
      ne: [
        "वर्षाको प्रकार",
        "पानीमाथिको टोर्नाडो",
        "छाल",
        "बादलको गठन",
      ],
    },
    correct: 1,
  },
  {
    question: {
      en: "What is the main cause of fog?",
      ne: "कुहिरोको मुख्य कारण के हो?",
    },
    options: {
      en: [
        "High wind speeds",
        "Cooling of air near the ground",
        "Heavy rain",
        "Warm ocean currents",
      ],
      ne: [
        "उच्च हावाको गति",
        "जमिन नजिकको हावाको चिसो",
        "भारी वर्षा",
        "तातो समुद्री धाराहरू",
      ],
    },
    correct: 1,
  },
  {
    question: {
      en: "What is the term for a high-pressure system?",
      ne: "उच्च-चाप प्रणालीको लागि कुन शब्द प्रयोग हुन्छ?",
    },
    options: {
      en: ["Cyclone", "Anticyclone", "Tornado", "Monsoon"],
      ne: ["चक्रवात", "एन्टिसाइक्लोन", "टोर्नाडो", "मानसून"],
    },
    correct: 1,
  },
];

const hardQuestions: Question[] = [
  {
    question: {
      en: "🌍 The Intertropical Convergence Zone (ITCZ) is also known as?",
      ne: "🌍 इन्टरट्रपिकल कन्भर्जेन्स जोन (ITCZ) लाई अर्को के नामले चिनिन्छ?",
    },
    options: {
      en: ["Horse Latitudes", "Doldrums", "Trade Winds", "Polar Vortex"],
      ne: ["हर्स ल्याटिट्यूड्स", "डोल्ड्रम्स", "ट्रेड विण्ड्स", "पोलर भोर्टेक्स"],
    },
    correct: 1,
  },
  {
    question: {
      en: "⚡ What is the scientific term for sudden downdrafts during thunderstorms?",
      ne: "⚡ आँधीबेहरीमा अचानक तल झर्ने हावाको वैज्ञानिक शब्द के हो?",
    },
    options: {
      en: ["Cyclone", "Microburst", "Squall", "Derecho"],
      ne: ["चक्रवात", "माइक्रोबर्स्ट", "स्क्वल", "डेरेचो"],
    },
    correct: 1,
  },
  {
    question: {
      en: "From which cloud do thunderstorms come?",
      ne: "आँधीबेहरी कुन बादलबाट आउँछ?",
    },
    options: {
      en: ["Cumulus", "Cumulonimbus", "Stratus", "Cirrus"],
      ne: ["क्युमुलस", "क्युमुलोनिम्बस", "स्ट्र्याटस", "सिरस"],
    },
    correct: 1,
  },
  {
    question: {
      en: "What does CAPE stand for in meteorology?",
      ne: "मौसम विज्ञानमा CAPE को अर्थ के हो?",
    },
    options: {
      en: [
        "Convective Available Potential Energy",
        "Cloud Altitude Pressure Estimate",
        "Cumulative Atmospheric Pressure Effect",
        "Convective Air Parcel Energy",
      ],
      ne: [
        "कन्भेक्टिभ उपलब्ध सम्भावित ऊर्जा",
        "बादलको उचाइ चाप अनुमान",
        "संचयी वायुमण्डलीय चाप प्रभाव",
        "कन्भेक्टिभ हावाको पार्सल ऊर्जा",
      ],
    },
    correct: 0,
  },
  {
    question: {
      en: "Standard temperature at sea level?",
      ne: "समुद्री सतहमा मानक तापक्रम के हो?",
    },
    options: {
      en: ["0°C", "15°C", "20°C", "25°C"],
      ne: ["० डिग्री सेल्सियस", "१५ डिग्री सेल्सियस", "२० डिग्री सेल्सियस", "२५ डिग्री सेल्सियस"],
    },
    correct: 1,
  },
  {
    question: {
      en: "Standard pressure at sea level?",
      ne: "समुद्री सतहमा मानक चाप के हो?",
    },
    options: {
      en: ["1000 mb", "1013 mb", "1020 mb", "990 mb"],
      ne: ["१००० मिलिबार", "१०१३ मिलिबार", "१०२० मिलिबार", "९९० मिलिबार"],
    },
    correct: 1,
  },
  {
    question: {
      en: "In a stable air mass, what is likely?",
      ne: "स्थिर हावाको समूहमा के सम्भावना हुन्छ?",
    },
    options: {
      en: ["Turbulence", "Smooth air", "Thunderstorms", "High winds"],
      ne: ["अस्थिरता", "सहज हावा", "आँधीबेहरी", "उच्च हावाको गति"],
    },
    correct: 1,
  },
  {
    question: {
      en: "Weather mostly occurs in which layer?",
      ne: "मौसम प्रायः कुन तहमा हुन्छ?",
    },
    options: {
      en: ["Stratosphere", "Troposphere", "Mesosphere", "Thermosphere"],
      ne: ["स्ट्र्याटोस्फियर", "ट्रोपोस्फियर", "मेसोस्फियर", "थर्मोस्फियर"],
    },
    correct: 1,
  },
  {
    question: {
      en: "Three main gases in the atmosphere?",
      ne: "वायुमण्डलका तीन मुख्य ग्यासहरू के हुन्?",
    },
    options: {
      en: [
        "Nitrogen, Oxygen, Carbon Dioxide",
        "Nitrogen, Oxygen, Argon",
        "Oxygen, Carbon Dioxide, Neon",
        "Helium, Nitrogen, Oxygen",
      ],
      ne: [
        "नाइट्रोजन, अक्सिजन, कार्बन डाइअक्साइड",
        "नाइट्रोजन, अक्सिजन, आर्गन",
        "अक्सिजन, कार्बन डाइअक्साइड, नियन",
        "हिलियम, नाइट्रोजन, अक्सिजन",
      ],
    },
    correct: 1,
  },
  {
    question: {
      en: "What measures wind speed?",
      ne: "हावाको गति मापन गर्ने के हो?",
    },
    options: {
      en: ["Barometer", "Anemometer", "Thermometer", "Hygrometer"],
      ne: ["ब्यारोमिटर", "एनेमोमिटर", "थर्ममिटर", "हाइग्रोमिटर"],
    },
    correct: 1,
  },
  {
    question: {
      en: "What is the term for winds greater than 32 mph with heavy snow?",
      ne: "३२ माइल प्रति घण्टाभन्दा बढी हावासहितको भारी हिमपातको लागि कुन शब्द प्रयोग हुन्छ?",
    },
    options: {
      en: ["Blizzard", "Snowstorm", "Hurricane", "Tornado"],
      ne: ["हिमआँधी", "हिमपात", "हरिकेन", "टोर्नाडो"],
    },
    correct: 0,
  },
  {
    question: {
      en: "How is water vapor in the air measured?",
      ne: "हावामा पानीको वाफ कसरी मापन गरिन्छ?",
    },
    options: {
      en: ["Temperature", "Humidity", "Pressure", "Density"],
      ne: ["तापक्रम", "आर्द्रता", "चाप", "घनत्व"],
    },
    correct: 1,
  },
  {
    question: {
      en: "What is the Coriolis effect caused by?",
      ne: "कोरिओलिस प्रभावको कारण के हो?",
    },
    options: {
      en: [
        "Earth's rotation",
        "Temperature differences",
        "Ocean currents",
        "Solar radiation",
      ],
      ne: [
        "पृथ्वीको घुमाइ",
        "तापक्रमको भिन्नता",
        "समुद्री धाराहरू",
        "सौर्य विकिरण",
      ],
    },
    correct: 0,
  },
  {
    question: {
      en: "What is a derecho?",
      ne: "डेरेचो के हो?",
    },
    options: {
      en: [
        "A tropical storm",
        "A widespread windstorm",
        "A type of cloud",
        "A cold front",
      ],
      ne: [
        "उष्णकटिबंधीय आँधी",
        "विशाल हावाको आँधी",
        "बादलको प्रकार",
        "चिसो मोर्चा",
      ],
    },
    correct: 1,
  },
  {
    question: {
      en: "What is the primary driver of ocean currents?",
      ne: "समुद्री धाराहरूको प्राथमिक चालक के हो?",
    },
    options: {
      en: ["Wind", "Tides", "Earth's rotation", "Solar heat"],
      ne: ["हावा", "ज्वारभाटा", "पृथ्वीको घुमाइ", "सौर्य ताप"],
    },
    correct: 0,
  },
  {
    question: {
      en: "What is a haboob?",
      ne: "हबूब के हो?",
    },
    options: {
      en: [
        "A dust storm",
        "A tropical cyclone",
        "A cold front",
        "A high-pressure system",
      ],
      ne: [
        "धूलको आँधी",
        "उष्णकटिबंधीय चक्रवात",
        "चिसो मोर्चा",
        "उच्च-चाप प्रणाली",
      ],
    },
    correct: 0,
  },
  {
    question: {
      en: "What is the approximate height of the troposphere at the equator?",
      ne: "विषुवत रेखामा ट्रोपोस्फियरको अनुमानित उचाइ कति हो?",
    },
    options: {
      en: ["5 km", "10 km", "16 km", "20 km"],
      ne: ["५ किमी", "१० किमी", "१६ किमी", "२० किमी"],
    },
    correct: 2,
  },
  {
    question: {
      en: "What is a squall line?",
      ne: "स्क्वल लाइन के हो?",
    },
    options: {
      en: [
        "A line of thunderstorms",
        "A type of cloud",
        "A wind pattern",
        "A pressure system",
      ],
      ne: [
        "आँधीबेहरीको रेखा",
        "बादलको प्रकार",
        "हावाको ढाँचा",
        "चाप प्रणाली",
      ],
    },
    correct: 0,
  },
  {
    question: {
      en: "What gas is most responsible for the greenhouse effect?",
      ne: "हरितगृह प्रभावको लागि सबैभन्दा जिम्मेवार ग्यास कुन हो?",
    },
    options: {
      en: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Argon"],
      ne: ["अक्सिजन", "नाइट्रोजन", "कार्बन डाइअक्साइड", "आर्गन"],
    },
    correct: 2,
  },
  {
    question: {
      en: "What is the term for a rapid drop in temperature?",
      ne: "तापक्रममा तीव्र गिरावटको लागि कुन शब्द प्रयोग हुन्छ?",
    },
    options: {
      en: ["Cold snap", "Heatwave", "Inversion", "Advection"],
      ne: ["चिसो अवस्था", "तातो लहर", "उल्टो अवस्था", "एडभेक्शन"],
    },
    correct: 0,
  },
  {
    question: {
      en: "What is a foehn wind?",
      ne: "फोन हावा के हो?",
    },
    options: {
      en: [
        "A cold polar wind",
        "A warm downslope wind",
        "A tropical storm wind",
        "A high-altitude jet stream",
      ],
      ne: [
        "चिसो ध्रुवीय हावा",
        "तातो तलतिर बग्ने हावा",
        "उष्णकटिबंधीय आँधीको हावा",
        "उच्च उचाइको जेट स्ट्रिम",
      ],
    },
    correct: 1,
  },
  {
    question: {
      en: "What is the dew point?",
      ne: "शीत बिन्दु के हो?",
    },
    options: {
      en: [
        "Temperature at which air becomes saturated",
        "Lowest daily temperature",
        "Pressure at sea level",
        "Wind speed threshold",
      ],
      ne: [
        "हावा संतृप्त हुने तापक्रम",
        "दैनिक सबैभन्दा कम तापक्रम",
        "समुद्री सतहमा चाप",
        "हावाको गति सीमा",
      ],
    },
    correct: 0,
  },
  {
    question: {
      en: "What is the Beaufort scale used for?",
      ne: "ब्यूफोर्ट स्केल कसको लागि प्रयोग गरिन्छ?",
    },
    options: {
      en: [
        "Measuring temperature",
        "Measuring wind speed",
        "Measuring rainfall",
        "Measuring humidity",
      ],
      ne: [
        "तापक्रम मापन",
        "हावाको गति मापन",
        "वर्षा मापन",
        "आर्द्रता मापन",
      ],
    },
    correct: 1,
  },
  {
    question: {
      en: "What is a thermal inversion?",
      ne: "थर्मल इन्भर्सन के हो?",
    },
    options: {
      en: [
        "Warm air below cold air",
        "Cold air below warm air",
        "High wind speeds",
        "Heavy rainfall",
      ],
      ne: [
        "तातो हावा चिसो हावामुनि",
        "चिसो हावा तातो हावामुनि",
        "उच्च हावाको गति",
        "भारी वर्षा",
      ],
    },
    correct: 0,
  },
  {
    question: {
      en: "What is the primary source of energy for Earth's weather?",
      ne: "पृथ्वीको मौसमको प्राथमिक ऊर्जा स्रोत के हो?",
    },
    options: {
      en: ["Earth's core", "Moon", "Sun", "Wind"],
      ne: ["पृथ्वीको केन्द्र", "चन्द्रमा", "सूर्य", "हावा"],
    },
    correct: 2,
  },
];

const Quiz = () => {
  const context = useLanguage();
  const lang = context?.lang ?? "en";
  const translations = context?.translations ?? {
    title: lang === "ne" ? "मौसम क्विज" : "Weather Quiz",
    enterName: lang === "ne" ? "आफ्नो नाम प्रविष्ट गर्नुहोस्:" : "Enter your name:",
    namePlaceholder: lang === "ne" ? "तपाईंको नाम" : "Your name",
    selectLevel: lang === "ne" ? "स्तर छान्नुहोस्:" : "Select a level to begin:",
    levelEasy: lang === "ne" ? "सजिलो" : "Easy",
    levelMedium: lang === "ne" ? "मध्यम" : "Medium",
    levelHard: lang === "ne" ? "कठिन" : "Hard",
    nameError: lang === "ne" ? "कृपया सुरु गर्न आफ्नो नाम प्रविष्ट गर्नुहोस्!" : "Please enter your name to start!",
    player: lang === "ne" ? "खेलाडी" : "Player",
    score: lang === "ne" ? "अंक" : "Score",
    question: lang === "ne" ? "प्रश्न" : "Question",
    timeLeft: lang === "ne" ? "स्तरको लागि बाँकी समय" : "Time Left for Level",
    seconds: lang === "ne" ? "सेकेन्ड" : "s",
    correct: lang === "ne" ? "सही!" : "Correct!",
    wrong: lang === "ne" ? "गलत!" : "Wrong!",
    gameOver: lang === "ne" ? "खेल समाप्त!" : "Game Over!",
    wizard: lang === "ne" ? "मौसम जादुगर! 🌟" : "Weather Wizard! 🌟",
    greatJob: lang === "ne" ? "उत्कृष्ट काम! 👍" : "Great Job! 👍",
    goodEffort: lang === "ne" ? "राम्रो प्रयास! 😊" : "Good Effort! 😊",
    keepLearning: lang === "ne" ? "सिक्न जारी राख्नुहोस्! 📚" : "Keep Learning! 📚",
    finalScore: lang === "ne" ? "तपाईंको अन्तिम अंक" : "Your final score",
    percentage: lang === "ne" ? "प्रतिशत" : "Percentage",
    highScorePrefix: lang === "ne" ? "को लागि उच्च अंक" : "High Score for",
    playAgain: lang === "ne" ? "फेरि खेल्नुहोस्" : "Play Again",
    highScores: lang === "ne" ? "उच्च अंकहरू" : "High Scores",
    level: lang === "ne" ? "स्तर" : "Level",
    playerHeader: lang === "ne" ? "खेलाडी" : "Player",
    scoreHeader: lang === "ne" ? "अंक" : "Score",
    loading: lang === "ne" ? "लोड हुँदै..." : "Loading...",
    loadingMessage: lang === "ne" ? "कृपया क्विज तयार हुँदासम्म पर्खनुहोस्।" : "Please wait while the quiz is being prepared.",
  };
  const [level, setLevel] = useState<"easy" | "medium" | "hard" | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [highScores, setHighScores] = useState<{
    easy: HighScore | null;
    medium: HighScore | null;
    hard: HighScore | null;
  }>({
    easy: null,
    medium: null,
    hard: null,
  });
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const getQuestions = useCallback(() => {
    if (level === "easy") return easyQuestions;
    if (level === "medium") return mediumQuestions;
    if (level === "hard") return hardQuestions;
    return [];
  }, [level]);

  const getTimerDuration = useCallback(() => {
    if (level === "easy") return 60;
    if (level === "medium") return 90;
    if (level === "hard") return 120;
    return 60;
  }, [level]);

  const getPoints = useCallback(() => {
    if (level === "easy") return 5;
    if (level === "medium") return 10;
    if (level === "hard") return 20;
    return 5;
  }, [level]);

  useEffect(() => {
    // Load high scores from localStorage on mount
    const storedHighScores = localStorage.getItem("weatherQuizHighScores");
    if (storedHighScores) {
      try {
        setHighScores(JSON.parse(storedHighScores));
      } catch (error) {
        console.error("Failed to parse high scores:", error);
      }
    }
  }, []);

  useEffect(() => {
    // Shuffle questions when level is selected
    if (level && shuffledQuestions.length === 0) {
      const questions = getQuestions();
      if (questions.length > 0) {
        setShuffledQuestions(shuffleArray(questions));
      }
    }
  }, [level, getQuestions, shuffledQuestions.length]);

  useEffect(() => {
    // Timer logic for entire level
    if (level && !gameOver && shuffledQuestions.length > 0) {
      setTimeLeft(getTimerDuration());
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [level, gameOver, getTimerDuration, shuffledQuestions.length]);

  const handleAnswer = (index: number) => {
    if (shuffledQuestions.length === 0 || showFeedback) return; // Prevent action if no questions or during feedback
    setSelectedAnswer(index);
    const q = shuffledQuestions[currentQ];
    const correct = index === q.correct;
    setIsCorrect(correct);
    if (correct) {
      setScore((prev) => prev + getPoints());
    }
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);
      setIsCorrect(null);
      if (currentQ + 1 < shuffledQuestions.length) {
        setCurrentQ((prev) => prev + 1);
      } else {
        setGameOver(true);
      }
    }, 1500);
  };

  const startGame = (selectedLevel: "easy" | "medium" | "hard") => {
    if (playerName.trim()) {
      setLevel(selectedLevel);
      setCurrentQ(0);
      setScore(0);
      setGameOver(false);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setIsCorrect(null);
      setShuffledQuestions([]);
      setTimeLeft(getTimerDuration());
    }
  };

  const restartGame = () => {
    setLevel(null);
    setCurrentQ(0);
    setScore(0);
    setGameOver(false);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(null);
    setTimeLeft(0);
    setPlayerName("");
    setShuffledQuestions([]);
  };

  useEffect(() => {
    // Update high scores when game is over
    if (gameOver && level && playerName) {
      setHighScores((prev) => {
        const currentHighScore = prev[level];
        const newHighScore = { player: playerName, score };
        if (!currentHighScore || score > currentHighScore.score) {
          const updatedHighScores = { ...prev, [level]: newHighScore };
          try {
            localStorage.setItem("weatherQuizHighScores", JSON.stringify(updatedHighScores));
          } catch (error) {
            console.error("Failed to save high scores:", error);
          }
          return updatedHighScores;
        }
        return prev;
      });
    }
  }, [gameOver, level, score, playerName]);

  const renderHighScores = () => (
    <div className="high-scores-container">
      <h3>{translations.highScores}</h3>
      <table className="high-scores-table">
        <thead>
          <tr>
            <th>{translations.level}</th>
            <th>{translations.playerHeader}</th>
            <th>{translations.scoreHeader}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{translations.levelEasy}</td>
            <td>{highScores.easy ? highScores.easy.player : "N/A"}</td>
            <td>{highScores.easy ? highScores.easy.score : "0"}</td>
          </tr>
          <tr>
            <td>{translations.levelMedium}</td>
            <td>{highScores.medium ? highScores.medium.player : "N/A"}</td>
            <td>{highScores.medium ? highScores.medium.score : "0"}</td>
          </tr>
          <tr>
            <td>{translations.levelHard}</td>
            <td>{highScores.hard ? highScores.hard.player : "N/A"}</td>
            <td>{highScores.hard ? highScores.hard.score : "0"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  if (!level) {
    return (
      <div className="quiz-container">
        <h2>🌦️ {translations.title}</h2>
        {renderHighScores()}
        <p>{translations.enterName}</p>
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value.trim())}
          placeholder={translations.namePlaceholder}
          className="player-input"
          maxLength={20}
        />
        <p>{translations.selectLevel}</p>
        <div className="level-buttons">
          <button onClick={() => startGame("easy")} disabled={!playerName.trim()}>
            {translations.levelEasy}
          </button>
          <button onClick={() => startGame("medium")} disabled={!playerName.trim()}>
            {translations.levelMedium}
          </button>
          <button onClick={() => startGame("hard")} disabled={!playerName.trim()}>
            {translations.levelHard}
          </button>
        </div>
        {!playerName.trim() && (
          <p className="error-message">{translations.nameError}</p>
        )}
      </div>
    );
  }

  if (gameOver) {
    const totalQuestions = shuffledQuestions.length;
    const maxScore = totalQuestions * getPoints();
    const percentage = totalQuestions > 0 ? Math.round((score / maxScore) * 100) : 0;
    let message = "";
    if (percentage >= 90) {
      message = translations.wizard;
    } else if (percentage >= 70) {
      message = translations.greatJob;
    } else if (percentage >= 50) {
      message = translations.goodEffort;
    } else {
      message = translations.keepLearning;
    }
    const highScore = highScores[level];
    return (
      <div className="quiz-container">
        <h2>🏆 {translations.gameOver}</h2>
        {renderHighScores()}
        <p>{message}</p>
        <p>
          {translations.finalScore}: {score} / {maxScore}
        </p>
        <p>
          {translations.percentage}: {percentage}%
        </p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
        </div>
        {highScore && (
          <p className="high-score">
            {translations.highScorePrefix} {lang === "ne" ? (level === "easy" ? "सजिलो" : level === "medium" ? "मध्यम" : "कठिन") : level.toUpperCase()}: {highScore.score} by {highScore.player}
          </p>
        )}
        <button onClick={restartGame}>{translations.playAgain}</button>
      </div>
    );
  }

  if (shuffledQuestions.length === 0) {
    return (
      <div className="quiz-container">
        <h2>{translations.loading}</h2>
        <p>{translations.loadingMessage}</p>
      </div>
    );
  }

  const q = shuffledQuestions[currentQ];
  const timerDuration = getTimerDuration();

  return (
    <div className="quiz-container">
      <h2>
        {translations.level}: {lang === "ne" ? (level === "easy" ? "सजिलो" : level === "medium" ? "मध्यम" : "कठिन") : level.toUpperCase()}
      </h2>
      {renderHighScores()}
      <p>
        {translations.player}: {playerName}
      </p>
      <p>
        {translations.score}: {score}
      </p>
      <p>
        {translations.question} {currentQ + 1} of {shuffledQuestions.length}
      </p>
      <p>
        {translations.timeLeft}: {timeLeft}{translations.seconds}
      </p>
      <div className="timer-bar">
        <div
          className="timer-fill"
          style={{ width: `${(timeLeft / timerDuration) * 100}%` }}
        ></div>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${((currentQ + 1) / shuffledQuestions.length) * 100}%` }}
        ></div>
      </div>
      <div className="question-box">
        <h3>{lang === "ne" ? q.question.ne : q.question.en}</h3>
        {showFeedback && (
          <p className={isCorrect ? "feedback-correct" : "feedback-wrong"}>
            {isCorrect ? translations.correct : translations.wrong}
          </p>
        )}
        <div className="options-grid">
          {(lang === "ne" ? q.options.ne : q.options.en).map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className={
                showFeedback
                  ? idx === q.correct
                    ? "correct"
                    : idx === selectedAnswer
                    ? "wrong"
                    : ""
                  : selectedAnswer === idx
                  ? "selected"
                  : ""
              }
              disabled={selectedAnswer !== null || showFeedback}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quiz;