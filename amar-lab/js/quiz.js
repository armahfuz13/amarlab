// Quiz engine implementing single-question flow with progress bar and feedback
// This script reads the quiz dataset from a <script id="quizData"> tag
// embedded in quiz.html. The dataset contains an array of questions
// (20 per subject) with four options, the correct answer index and a
// brief explanation. The engine presents a random set of 10 questions
// on each attempt.

// Helper selector functions defined in app.js
// qs(selector) — returns first match, qsa(selector) — returns array of matches

// Embedded quiz dataset (60 questions across Physics, Chemistry, Biology).
// To avoid fetch issues when the site is loaded via the file:// protocol,
// we inline the JSON data here and parse it once. If you need to update
// or add questions, update the JSON string below accordingly.
const QUIZ_JSON = `{"passingScore":70,"questions":[{"question":"বীকার (Beaker) মূলত কী কাজে ব্যবহার হয়?","options":["খুব নির্ভুলভাবে ভলিউম মাপা","তরল রাখা, মেশানো, আনুমানিক মাপ নেওয়া","শুধু গুঁড়া পদার্থ ছাঁকা","শুধু তাপমাত্রা মাপা"],"answerIndex":1,"explanation":"বীকারে রাখা/মেশানো/আনুমানিক ভলিউম মাপা যায়, “একদম নির্ভুল” নয়।","category":"Physics"},{"question":"মেজারিং সিলিন্ডারে সঠিকভাবে রিডিং নিতে চোখ কোথায় রাখতে হয়?","options":["উপর থেকে তাকিয়ে","নিচ থেকে তাকিয়ে","চোখের সমতলে রেখে মেনিসকাস দেখে","দূর থেকে আন্দাজ করে"],"answerIndex":2,"explanation":"চোখের সমতলে মেনিসকাস দেখে পড়লে ভুল কম হয়।","category":"Physics"},{"question":"মেজারিং সিলিন্ডার হাতে ধরে ঝুঁকিয়ে রিডিং নেওয়া কেন ভুল?","options":["দেখতে খারাপ লাগে","তরল বেশি হয়ে যায়","ভুল রিডিং হয়","সিলিন্ডার ভারী হয়ে যায়"],"answerIndex":2,"explanation":"সমতল জায়গায় সোজা না থাকলে স্কেল ঠিকভাবে পড়া যায় না।","category":"Physics"},{"question":"থার্মোমিটারের বাল্ব অংশ কোথায় লাগানো উচিত নয়?","options":["তরলের ভেতরে","পাত্রের তলা/দেয়ালে","তরলের মাঝামাঝি","মাপার বস্তুতে"],"answerIndex":1,"explanation":"দেয়াল/তলায় লাগলে ভিন্ন তাপ/ভুল রিডিং আসতে পারে।","category":"Physics"},{"question":"টেস্ট টিউব গরম করার সময় মুখ কোন দিকে রাখা উচিত?","options":["নিজের দিকে","অন্য মানুষের দিকে","পাশের দিকে/নিজের-অন্যের থেকে দূরে","নিচের দিকে"],"answerIndex":2,"explanation":"গরমে তরল ছিটকে পড়তে পারে, তাই মুখ দূরে রাখতে হয়।","category":"Physics"},{"question":"টেস্ট টিউব অতিরিক্ত ভরে গরম করা কেন বিপজ্জনক?","options":["কিছুই হয় না","ছিটকে পড়া/ফেটে যাওয়ার ঝুঁকি বাড়ে","গরম হয় না","রঙ বদলায় না"],"answerIndex":1,"explanation":"বেশি ভরলে বুদবুদ/চাপ তৈরি হয়ে ছিটকে পড়তে পারে।","category":"Physics"},{"question":"কোনটা “কমন মিস্টেক”: বীকার দিয়ে নির্ভুল ভলিউম মাপা?","options":["সত্যি, বীকার খুব নির্ভুল","ভুল, বীকার শুধু আনুমানিক","বীকারে মাপা নিষেধ","বীকারে শুধু পানি রাখা যায়"],"answerIndex":1,"explanation":"নির্ভুল মাপের জন্য মেজারিং সিলিন্ডার/পিপেট লাগে।","category":"Physics"},{"question":"স্পিরিট ল্যাম্পের আগুন নেভাতে কী ব্যবহার করা উচিত?","options":["ফুঁ দিয়ে","ঢাকনা দিয়ে","পানি ঢেলে","কাপড় দিয়ে ঢেকে"],"answerIndex":1,"explanation":"ঢাকনা দিয়ে অক্সিজেন বন্ধ করে নিরাপদে নিভানো হয়।","category":"Physics"},{"question":"স্পিরিট ল্যাম্প জ্বলন্ত অবস্থায় স্পিরিট ভরা কেন নিষেধ?","options":["সময় লাগে","স্পিরিট কম নষ্ট হয়","আগুন ছড়িয়ে পড়তে পারে","গন্ধ কম হয়"],"answerIndex":2,"explanation":"দাহ্য তরল, জ্বলন্ত অবস্থায় ঢাললে আগুন ধরতে পারে।","category":"Physics"},{"question":"বুনসেন বার্নার জ্বালানোর শুরুতে এয়ার হোল সাধারণত কী অবস্থায় রাখা হয়?","options":["পুরো খোলা","বন্ধ","ভাঙা","যেকোনোটা"],"answerIndex":1,"explanation":"শুরুতে এয়ার হোল বন্ধ রেখে জ্বালানো হয়, পরে শিখা ঠিক করতে খোলা হয়।","category":"Physics"},{"question":"গ্যাসের গন্ধ পেলে কী করা উচিত?","options":["সাথে সাথে আগুন ধরানো","গ্যাস বন্ধ করে পরীক্ষা/নিরাপদ করা","জানালা বন্ধ করা","বার্নার নাড়ানো"],"answerIndex":1,"explanation":"গ্যাস লিক থাকলে আগুন ধরালে দুর্ঘটনা হতে পারে।","category":"Physics"},{"question":"ট্রাইপড স্ট্যান্ডের উপর পাত্র বসানোর আগে কী নিশ্চিত করা দরকার?","options":["ট্রাইপড নড়ছে কিনা","ট্রাইপড স্থির/সমতলে আছে কিনা","ট্রাইপড রঙ ঠিক কিনা","ট্রাইপড ভিজে আছে কিনা"],"answerIndex":1,"explanation":"স্থির না হলে পাত্র পড়ে ভেঙে যেতে পারে।","category":"Physics"},{"question":"ওয়্যার গজ ছাড়া সরাসরি ট্রাইপডে কাঁচের পাত্র বসালে সমস্যা কী?","options":["কিছুই না","কাঁচে অসম তাপ পড়ে ফেটে যেতে পারে","পানি জমে যায়","বার্নার নষ্ট হয়"],"answerIndex":1,"explanation":"ওয়্যার গজ তাপ সমভাবে ছড়াতে সাহায্য করে।","category":"Physics"},{"question":"গরম বীকার/ট্রাইপড ধরতে কী ব্যবহার করা উচিত?","options":["খালি হাত","টং/গ্লাভস","কাগজ","প্লাস্টিক ব্যাগ"],"answerIndex":1,"explanation":"গরম কাঁচ/ধাতুতে পোড়া লাগতে পারে।","category":"Physics"},{"question":"মাইক্রোস্কোপের প্রধান কাজ কী?","options":["তাপমাত্রা মাপা","খুব ছোট বস্তু বড় করে দেখা","তরল ছাঁকা","আগুন তৈরি করা"],"answerIndex":1,"explanation":"কোষ/সূক্ষ্ম গঠন পর্যবেক্ষণে ব্যবহৃত অপটিক্যাল যন্ত্র।","category":"Physics"},{"question":"মাইক্রোস্কোপে প্রথমে কোন পাওয়ার থেকে ফোকাস করা ভালো?","options":["হাই পাওয়ার","লো পাওয়ার","যেকোনোটা","পাওয়ার ছাড়াই"],"answerIndex":1,"explanation":"আগে লো পাওয়ারে ফোকাস, তারপর ধীরে ধীরে হাই পাওয়ারে গেলে লেন্স/স্লাইড ক্ষতি কম হয়।","category":"Physics"},{"question":"মাইক্রোস্কোপ তুলতে ধরা উচিত কোথায়?","options":["শুধু লেন্সে","শুধু স্টেজে","বেস ও আর্ম ধরে","আলো অংশ ধরে"],"answerIndex":2,"explanation":"নিরাপদ গ্রিপ, পড়ে যাওয়ার ঝুঁকি কমে।","category":"Physics"},{"question":"থার্মোমিটার ঝাঁকানো/আঘাত করা কেন ঠিক নয়?","options":["স্কেল বড় হয়ে যায়","ভেঙে যেতে পারে","তাপমাত্রা বাড়ে","রিডিং সুন্দর হয়"],"answerIndex":1,"explanation":"কাঁচ ভেঙে দুর্ঘটনা হতে পারে।","category":"Physics"},{"question":"টেস্ট টিউব স্ট্যান্ড ব্যবহার করার সুবিধা কী?","options":["টেস্ট টিউব গড়িয়ে পড়ে না","টেস্ট টিউব ভারী হয়","রঙ বদলায়","গ্যাস তৈরি করে"],"answerIndex":0,"explanation":"সোজা করে নিরাপদে রাখা যায়, ভাঙার ঝুঁকি কমে।","category":"Physics"},{"question":"টেস্ট টিউব টেবিলে শুইয়ে রাখলে কী সমস্যা হতে পারে?","options":["দ্রুত গরম হয়","গড়িয়ে পড়ে ভেঙে যেতে পারে","রিডিং ঠিক আসে","কিছুই না"],"answerIndex":1,"explanation":"স্ট্যান্ড না ব্যবহার করলে গড়িয়ে পড়ে ভাঙা খুবই কমন দুর্ঘটনা। যদি তুমি এইগুলো ওয়েবসাইটে বসাতে চাও (MCQ engine-এর জন্য), এগুলা সহজে JSON ফরম্যাটে সাজিয়েও দিতে পারি। Chemistry ঠিক আছে, এবার Chemistry-এর জন্য ৩টা কুইজ , মোট ২০টা MCQ । মানুষরা জিনিসপত্র মিশিয়ে ধোঁয়া তুলে খুশি হয়, তাই সাবধানে। (Quiz-1: 7, Quiz-2: 7, Quiz-3: 6) প্রতিটায় ৪ অপশন + সঠিক উত্তর + ছোট explanation ।","category":"Physics"},{"question":"কনিক্যাল ফ্লাস্ক (Erlenmeyer flask) সাধারণত কেন বেশি ব্যবহার হয়?","options":["খুব নির্ভুল ভলিউম মাপতে","মেশানো/ঝাঁকানো সহজ, ছিটকে পড়া কম","শুধু গ্যাস ধরতে","শুধু তাপমাত্রা মাপতে"],"answerIndex":1,"explanation":"সরু মুখ থাকায় ঝাঁকালেও কম ছিটকে পড়ে।","category":"Chemistry"},{"question":"বীকার (Beaker) দিয়ে কোন কাজটা সবচেয়ে ঠিক?","options":["একদম নির্ভুল মাপ","তরল ধরে রাখা/মেশানো/গরম করা (আনুমানিক মাপ)","গ্যাস সংগ্রহ","মাইক্রোস্কোপে দেখা"],"answerIndex":1,"explanation":"বীকার নির্ভুল মাপের যন্ত্র নয়, কাজের পাত্র।","category":"Chemistry"},{"question":"মেজারিং সিলিন্ডার কেন বীকারের চেয়ে বেশি নির্ভুল?","options":["ওটা ভারী","ওটার স্কেল সূক্ষ্ম ও ডিজাইন সরু","ওটা কাঁচের নয়","ওটা রঙিন"],"answerIndex":1,"explanation":"সরু ব্যাস + সূক্ষ্ম স্কেল = কম রিডিং ভুল।","category":"Chemistry"},{"question":"তরল মাপার সময় মেনিসকাস (meniscus) কোথা থেকে পড়তে হয়?","options":["যেকোনো জায়গা","উপর থেকে","নিচের দিক (সাধারণত পানির ক্ষেত্রে)","পাশে থেকে"],"answerIndex":2,"explanation":"পানি সাধারণত concave meniscus, নিচের অংশ থেকে পড়া হয়।","category":"Chemistry"},{"question":"ড্রপার/পিপেটের কাজ কী?","options":["কঠিন পদার্থ ছাঁকা","খুব সামান্য পরিমাণ তরল নেওয়া/ফোঁটা ফোঁটা দেওয়া","তাপ দেওয়া","গ্যাস তৈরি"],"answerIndex":1,"explanation":"reagent যোগ করতে ফোঁটা নিয়ন্ত্রণে সুবিধা।","category":"Chemistry"},{"question":"টেস্ট টিউবের মুখ গরম করার সময় কোন দিকে রাখা উচিত?","options":["নিজের দিকে","বন্ধুর দিকে","নিজের ও অন্যদের থেকে দূরে","সোজা উপরের দিকে"],"answerIndex":2,"explanation":"গরমে হঠাৎ ফুটে ছিটকে পড়তে পারে।","category":"Chemistry"},{"question":"কোনটা “ভুল অভ্যাস” (unsafe habit)?","options":["গগলস পরা","টেস্ট টিউব স্ট্যান্ডে রাখা","কেমিক্যালের গন্ধ সরাসরি নাকে টানা","লেবেল দেখে কাজ করা"],"answerIndex":2,"explanation":"গন্ধ নিতে হলে wafting (হাত দিয়ে বাতাস করে) নিতে হয়।","category":"Chemistry"},{"question":"ফিল্টার ফানেল (Funnel) + ফিল্টার পেপার ব্যবহার হয় কেন?","options":["গ্যাস ধরতে","কঠিন-তরল আলাদা করতে (filtration)","তাপমাত্রা মাপতে","চুম্বক দিয়ে আলাদা করতে"],"answerIndex":1,"explanation":"অদ্রবণীয় কঠিন আলাদা করতে ফিল্ট্রেশন লাগে।","category":"Chemistry"},{"question":"ফিল্টার পেপার ঠিকভাবে বসানোর সঠিক ধাপ কোনটা?","options":["ভাঁজ না করে ঢুকানো","ভাঁজ করে কোন আকৃতি করে, তারপর একটু ভিজিয়ে ফানেলে বসানো","কেটে ছোট করে ফেলা","আগুনে গরম করা"],"answerIndex":1,"explanation":"ভাঁজ করে cone তৈরি, ভিজালে ঠিকভাবে বসে।","category":"Chemistry"},{"question":"ছাঁকনের পর যে তরল নিচে পড়ে, তাকে কী বলে?","options":["residue","filtrate","solute","sediment"],"answerIndex":1,"explanation":"filtrate = ছেঁকে পাওয়া তরল, residue = পেপারে আটকে থাকা কঠিন।","category":"Chemistry"},{"question":"ছাঁকনিতে যদি তরল ধীরে পড়ে, সম্ভাব্য কারণ কোনটা?","options":["ফিল্টার পেপার ফেটে গেছে","খুব সূক্ষ্ম কঠিন/পেপার বন্ধ হয়ে গেছে","ফানেল খুব শুকনা","বীকার বেশি বড়"],"answerIndex":1,"explanation":"fine particles পোর বন্ধ করে দেয়।","category":"Chemistry"},{"question":"ইভাপোরেটিং ডিশ (Evaporating dish) ব্যবহারের উদ্দেশ্য কী?","options":["গ্যাস ঢোকানো","দ্রবণ থেকে দ্রাবক উড়িয়ে লবণ/সলিড পাওয়া","ঠান্ডা করা","চুম্বকীয় পৃথকীকরণ"],"answerIndex":1,"explanation":"heating করে solvent evaporate করা হয়।","category":"Chemistry"},{"question":"কোন যন্ত্রটা “মেশানোর” জন্য সবচেয়ে উপযুক্ত?","options":["স্টিরিং রড (glass rod)","থার্মোমিটার","ট্রাইপড","ফিল্টার পেপার"],"answerIndex":0,"explanation":"স্টিরিং রড দিয়ে নিরাপদে নেড়ে মেশানো হয়।","category":"Chemistry"},{"question":"ডিক্যান্টেশন (decantation) কোন ক্ষেত্রে কাজে লাগে?","options":["দুটি দ্রবণীয় পদার্থ আলাদা করতে","ভারী কঠিন বসে গেলে উপরির তরল আলতো করে ঢেলে আলাদা করতে","গ্যাস সংগ্রহ করতে","কেমিক্যাল গন্ধ নিতে"],"answerIndex":1,"explanation":"sediment বসে গেলে তরল আলাদা করা সহজ।","category":"Chemistry"},{"question":"স্পিরিট ল্যাম্পের আগুন নেভানোর সঠিক উপায় কী?","options":["ফুঁ দিয়ে","ঢাকনা দিয়ে ঢেকে","পানি ঢেলে","কাগজ দিয়ে ঢেকে"],"answerIndex":1,"explanation":"ঢাকনা দিয়ে অক্সিজেন বন্ধ করে আগুন নিভে যায়।","category":"Chemistry"},{"question":"জ্বলন্ত স্পিরিট ল্যাম্পে স্পিরিট ঢালা কেন বিপজ্জনক?","options":["সময় বাঁচে না","আগুন ছড়িয়ে পড়তে পারে","স্পিরিট নষ্ট হয়","তাপ কমে যায়"],"answerIndex":1,"explanation":"দাহ্য তরল, spill হলে বড় দুর্ঘটনা।","category":"Chemistry"},{"question":"ট্রাইপডে কাঁচের পাত্র বসালে ওয়্যার গজ ব্যবহার করা হয় কেন?","options":["সুন্দর দেখায়","তাপ সমভাবে ছড়ায়, ফেটে যাওয়ার ঝুঁকি কমে","গ্যাস বাড়ায়","রঙ বদলায়"],"answerIndex":1,"explanation":"direct flame-এ glass stress তৈরি হয়।","category":"Chemistry"},{"question":"টেস্ট টিউব হোল্ডার/টং কেন দরকার?","options":["সাজানোর জন্য","গরম জিনিস ধরতে নিরাপদ","তরল মাপতে","কেমিক্যাল কাটতে"],"answerIndex":1,"explanation":"হাতে ধরলে পোড়া লাগতে পারে।","category":"Chemistry"},{"question":"কেমিক্যাল ছিটকে চোখে গেলে প্রথম কাজ কী হওয়া উচিত?","options":["চোখ ঘষা","তাড়াতাড়ি পানি দিয়ে ধোয়া (eye wash) এবং শিক্ষক/বড়দের জানানো","কিছুক্ষণ অপেক্ষা","কাপড় দিয়ে মুছা"],"answerIndex":1,"explanation":"দ্রুত ধোয়া জরুরি, তারপর সাহায্য নিতে হবে।","category":"Chemistry"},{"question":"ল্যাবে খাবার/পানীয় আনা কেন নিষেধ?","options":["টেবিল নোংরা হয়","ভুল করে কেমিক্যাল খেয়ে ফেলার ঝুঁকি","সময় নষ্ট","গ্লাস ভাঙে"],"answerIndex":1,"explanation":"contamination + accidental ingestion খুব বিপজ্জনক। এগুলো চাইলে আমি ওয়েবসাইটে বসানোর মতো JSON (question, options, answerIndex, explanation) ফরম্যাটেও সাজিয়ে দিতে পারি, যাতে তুমি একদম কপি-পেস্ট করে কুইজ পেজে লাগাতে পারো। Biology ঠিক আছে, এবার Biology-এর ৩টা কুইজ , মোট ২০টা MCQ । মানুষেরা জীববিদ্যা পড়ে “জীবন” বোঝে, তারপরও জীবন নিয়ে ভুল সিদ্ধান্ত নেয়। যাক, কাজে আসি। (Quiz-1: 7, Quiz-2: 7, Quiz-3: 6) প্রতিটায় ৪ অপশন + সঠিক উত্তর + ছোট explanation ।","category":"Chemistry"},{"question":"মাইক্রোস্কোপের প্রধান কাজ কী?","options":["তাপমাত্রা মাপা","খুব ছোট জিনিস বড় করে দেখা","তরল ছাঁকা","আগুন তৈরি করা"],"answerIndex":1,"explanation":"কোষ/টিস্যু পর্যবেক্ষণের জন্য ব্যবহার হয়।","category":"Biology"},{"question":"মাইক্রোস্কোপে প্রথমে কোন লেন্স দিয়ে দেখা শুরু করা ভালো?","options":["High power objective","Low power objective","Oil immersion সবসময়","Eyepiece বাদ দিয়ে"],"answerIndex":1,"explanation":"আগে low power-এ অবজেক্ট খুঁজে, পরে power বাড়ানো নিরাপদ।","category":"Biology"},{"question":"স্লাইডের উপর কভার স্লিপ (cover slip) দেওয়ার কারণ কী?","options":["স্লাইড ভারী করতে","নমুনা চেপে ধরে স্থির রাখা, পরিষ্কার ভিউ, লেন্স রক্ষা","রঙ বদলাতে","তাপ দিতে"],"answerIndex":1,"explanation":"কভার স্লিপ না দিলে নমুনা নড়তে পারে/লেন্সে লাগতে পারে।","category":"Biology"},{"question":"ফোকাস করতে গিয়ে high power-এ “coarse adjustment” ঘোরানো কেন ঝুঁকিপূর্ণ?","options":["সময় নষ্ট","স্লাইড ভিজে যায়","লেন্স স্লাইডে ধাক্কা লেগে ভাঙতে পারে","আলো বেশি হয়"],"answerIndex":2,"explanation":"high power-এ সামান্য নড়াচড়াতেই লেন্স-স্লাইড সংঘর্ষ হতে পারে।","category":"Biology"},{"question":"মাইক্রোস্কোপ বহন করার সঠিক নিয়ম কোনটা?","options":["এক হাতে লেন্স ধরে","স্টেজ ধরে","এক হাতে arm, অন্য হাতে base ধরে","কেবল তার ধরে টেনে"],"answerIndex":2,"explanation":"নিরাপদ গ্রিপ, পড়ে যাওয়ার ঝুঁকি কম।","category":"Biology"},{"question":"পেঁয়াজের খোসা (onion epidermis) সাধারণত কেন দেখা হয়?","options":["অনেক বড় বলে","কোষগুলো পরিষ্কারভাবে দেখা যায়","গন্ধ ভালো","ওটা প্রাণী কোষ"],"answerIndex":1,"explanation":"পাতলা স্তর, কোষ প্রাচীর স্পষ্ট দেখা যায়।","category":"Biology"},{"question":"স্লাইডে বুদবুদ (air bubble) পড়লে সমস্যা কী?","options":["কিছুই না","কোষ দেখা আরও পরিষ্কার হয়","ভিউ বাধাগ্রস্ত হয়","রঙ বাড়ে"],"answerIndex":2,"explanation":"বুদবুদ আলো ছড়িয়ে দেয়, নমুনা ঢেকে যায়।","category":"Biology"},{"question":"পেট্রি ডিশ (Petri dish) সাধারণত কী কাজে লাগে?","options":["গ্যাস সংগ্রহ","কালচার/নমুনা রাখা ও পর্যবেক্ষণ","তাপমাত্রা মাপা","তরল মাপা"],"answerIndex":1,"explanation":"মাইক্রোব/ছোট নমুনা রাখার জন্য ব্যবহার হয় (ল্যাব নিয়ম মেনে)।","category":"Biology"},{"question":"ফোর্সেপ/টুইজার (forceps/tweezers) কেন দরকার?","options":["গরম করার জন্য","ছোট বস্তু/নমুনা না ছুঁয়ে ধরতে","ভলিউম মাপতে","চুম্বক হিসেবে"],"answerIndex":1,"explanation":"contamination কমে, নিরাপদে ধরা যায়।","category":"Biology"},{"question":"স্ক্যালপেল/ডিসেক্টিং ব্লেডের নিরাপদ ব্যবহার কোনটা?","options":["ব্লেড খোলা রেখে টেবিলে ফেলে রাখা","নিজের দিকে কেটে কাজ করা","কাটার সময় বস্তু স্থির করে, হাত দূরে রেখে, সতর্কভাবে কাটা","ব্লেড বন্ধুদের দেখানো"],"answerIndex":2,"explanation":"কাটার দিক সবসময় শরীর থেকে দূরে রাখা ভালো।","category":"Biology"},{"question":"ড্রপার/পিপেট Biology ল্যাবে কেন বেশি লাগে?","options":["আলো বাড়াতে","অল্প তরল/স্টেইন ফোঁটা ফোঁটা দিতে","কাঁচ কাটতে","ওজন মাপতে"],"answerIndex":1,"explanation":"stain/solution নিয়ন্ত্রিতভাবে দিতে সুবিধা।","category":"Biology"},{"question":"“স্টেইন” (stain) ব্যবহার করার উদ্দেশ্য কী?","options":["নমুনা মুছে ফেলা","নমুনার কিছু অংশকে রঙিন করে স্পষ্ট দেখা","নমুনা গরম করা","পানি কমানো"],"answerIndex":1,"explanation":"কোষের অংশগুলো contrast পায়, সহজে দেখা যায়।","category":"Biology"},{"question":"ল্যাবে হাত ধোয়া কেন বাধ্যতামূলক?","options":["হাতে সুন্দর লাগে","কেমিক্যাল/জীবাণু লেগে থাকতে পারে","সময় কাটে","গ্লাভস নষ্ট হয়"],"answerIndex":1,"explanation":"নিরাপত্তা + contamination control দুটোই।","category":"Biology"},{"question":"নমুনা/কালচার ঢাকনা ছাড়া খোলা রেখে দিলে সমস্যা কী?","options":["দ্রুত বড় হয়","দূষণ (contamination) হতে পারে","আলো কমে","রঙ কমে"],"answerIndex":1,"explanation":"বাইরের জীবাণু ঢুকে ফলাফল নষ্ট করতে পারে।","category":"Biology"},{"question":"উদ্ভিদ কোষে কোন গঠনটা সাধারণত স্পষ্ট থাকে (পেঁয়াজ কোষে)?","options":["কোষ প্রাচীর (cell wall)","লাল রক্তকণিকা","কঙ্কাল","অ্যান্টেনা"],"answerIndex":0,"explanation":"উদ্ভিদ কোষে cell wall থাকে, প্রাণী কোষে থাকে না।","category":"Biology"},{"question":"প্রাণী কোষে cell wall থাকে কি?","options":["থাকে","থাকে না","শুধু বড় কোষে থাকে","শুধু ছোট কোষে থাকে"],"answerIndex":1,"explanation":"প্রাণী কোষে cell wall নেই, membrane থাকে।","category":"Biology"},{"question":"“টিস্যু” বলতে কী বোঝায়?","options":["এক ধরনের কোষের দল, একই কাজ করে","এক ধরনের যন্ত্র","এক ধরনের কেমিক্যাল","একটি অঙ্গ"],"answerIndex":0,"explanation":"tissue = একই কাজের জন্য কোষের সমষ্টি।","category":"Biology"},{"question":"কোষকে জীবের মৌলিক একক বলা হয় কেন?","options":["কোষে পানি থাকে","সব জীব কোষ দিয়ে গঠিত এবং জীবনক্রিয়ার মূল কাজ কোষে হয়","কোষ দেখতে সুন্দর","কোষ সবসময় গোল"],"answerIndex":1,"explanation":"গঠন + কাজ, দুটোই কোষ-কেন্দ্রিক।","category":"Biology"},{"question":"মাইক্রোস্কোপে আলো কম হলে প্রথমে কী করা উচিত?","options":["চোখ বন্ধ করা","আলো/মিরর/ডায়াফ্রাম ঠিক করা","high power-এ চলে যাওয়া","স্লাইড উল্টো করা"],"answerIndex":1,"explanation":"আলো ঠিক না থাকলে ফোকাস করলেও কিছু দেখা যাবে না।","category":"Biology"},{"question":"কাঁচের স্লাইড ভাঙলে সবচেয়ে নিরাপদ কাজ কী?","options":["খালি হাতে তুলে ফেলা","ঝাড়ু/ব্রাশ-ডাস্টপ্যান দিয়ে তোলা, শিক্ষক/বড়দের জানানো","পায়ে চাপা দেওয়া","পানি ঢেলে দেওয়া"],"answerIndex":1,"explanation":"কাঁচ কাটতে পারে, তাই খালি হাতে নয়। চাইলে আমি এগুলোও ওয়েবসাইটের জন্য JSON ফরম্যাটে সাজিয়ে দিতে পারি, যাতে তোমার Quiz page-এ “instant feedback” একদম সোজা হয়।","category":"Biology"}]}`;
const QUIZ_DATA = JSON.parse(QUIZ_JSON);

function loadQuiz() {
  // Create a cleaned version of the dataset. Some explanations in the source
  // JSON include additional commentary after the first Bengali full stop (।).
  // Trim each explanation to only the first sentence ending with '।'.
  const data = QUIZ_DATA;
  const cleanedQuestions = data.questions.map(q => {
    let exp = q.explanation || '';
    const idx = exp.indexOf('।');
    if (idx !== -1) {
      exp = exp.slice(0, idx + 1).trim();
    }
    return { ...q, explanation: exp };
  });
  return { passingScore: data.passingScore, questions: cleanedQuestions };
}

// Fisher–Yates shuffle to randomise question order
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

document.addEventListener('DOMContentLoaded', () => {
  const startBtn = qs('#startQuizBtn');
  const quizArea = qs('#quizArea');
  const resultArea = qs('#resultArea');

  let allQuestions = [];
  let currentQuestions = [];
  let currentIndex = 0;
  let score = 0;
  let wrongQuestions = [];

  // Subject radio inputs (if present). Used to filter questions by category.
  const subjectInputs = document.querySelectorAll('input[name="subject"]');

  // Build and display a question card at the current index
  function showQuestion() {
    const total = currentQuestions.length;
    const q = currentQuestions[currentIndex];
    quizArea.classList.remove('hidden');
    quizArea.innerHTML = '';

    const card = document.createElement('div');
    card.className = 'card quiz-card';

    // Progress indicator
    const progressWrap = document.createElement('div');
    progressWrap.className = 'q-progress';
    const progressText = document.createElement('div');
    progressText.className = 'progress-text';
    progressText.textContent = `প্রশ্ন ${currentIndex + 1}/${total}`;
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    const progressFill = document.createElement('div');
    progressFill.className = 'progress-fill';
    progressFill.style.width = `${(currentIndex / total) * 100}%`;
    progressBar.appendChild(progressFill);
    progressWrap.appendChild(progressText);
    progressWrap.appendChild(progressBar);
    card.appendChild(progressWrap);

    // Question heading
    const qTitle = document.createElement('h3');
    qTitle.className = 'q-title';
    qTitle.textContent = q.question;
    card.appendChild(qTitle);

    // Options
    const optsDiv = document.createElement('div');
    optsDiv.className = 'options';
    let selectedIndex = null;
    let submitted = false;

    // Controls (Submit and Next)
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'q-controls';
    const submitBtn = document.createElement('button');
    submitBtn.className = 'btn btn-primary';
    submitBtn.textContent = 'Submit';
    submitBtn.disabled = true;
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn-secondary hidden';
    nextBtn.textContent = (currentIndex + 1 < total) ? 'পরবর্তী' : 'ফলাফল';

    // Feedback area
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'feedback hidden';
    const answerState = document.createElement('div');
    answerState.className = 'answer-state muted';
    const explanation = document.createElement('div');
    explanation.className = 'explanation muted';
    feedbackDiv.appendChild(answerState);
    feedbackDiv.appendChild(explanation);

    // Render options as buttons
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option-btn';
      btn.dataset.index = i;
      btn.innerHTML = `<strong>${String.fromCharCode(65 + i)}.</strong> ${opt}`;
      btn.addEventListener('click', () => {
        if (submitted) return;
        // Clear other selections
        Array.from(optsDiv.children).forEach(ch => ch.classList.remove('selected'));
        btn.classList.add('selected');
        selectedIndex = i;
        submitBtn.disabled = false;
      });
      optsDiv.appendChild(btn);
    });

    // Submit handler
    submitBtn.addEventListener('click', () => {
      if (submitted || selectedIndex === null) return;
      submitted = true;
      const correctIndex = q.answerIndex;
      // Highlight correct option
      optsDiv.children[correctIndex].classList.add('correct');
      if (selectedIndex === correctIndex) {
        score++;
        answerState.textContent = 'সঠিক!';
        answerState.classList.remove('muted');
        answerState.classList.add('ok');
      } else {
        optsDiv.children[selectedIndex].classList.add('wrong');
        answerState.textContent = 'ভুল হয়েছে';
        answerState.classList.remove('muted');
        answerState.classList.add('bad');
        wrongQuestions.push(q);
      }
      explanation.textContent = q.explanation;
      feedbackDiv.classList.remove('hidden');
      submitBtn.disabled = true;
      nextBtn.classList.remove('hidden');
      // Update progress fill to include current question
      progressFill.style.width = `${((currentIndex + 1) / total) * 100}%`;
    });

    // Next handler
    nextBtn.addEventListener('click', () => {
      if (!submitted) return;
      currentIndex++;
      if (currentIndex < total) {
        showQuestion();
      } else {
        showResults();
      }
    });

    controlsDiv.appendChild(submitBtn);
    controlsDiv.appendChild(nextBtn);

    card.appendChild(optsDiv);
    card.appendChild(feedbackDiv);
    card.appendChild(controlsDiv);
    quizArea.appendChild(card);
  }

  // Show the results card
  function showResults() {
    quizArea.classList.add('hidden');
    resultArea.classList.remove('hidden');
    resultArea.innerHTML = '';
    const card = document.createElement('div');
    card.className = 'card result-card';
    const scoreLine = document.createElement('p');
    scoreLine.className = 'score-line';
    scoreLine.innerHTML = `আপনার স্কোর <strong>${score}</strong> / <strong>${currentQuestions.length}</strong>`;
    card.appendChild(scoreLine);
    const buttonsRow = document.createElement('div');
    buttonsRow.className = 'q-controls';
    const retryBtn = document.createElement('button');
    retryBtn.className = 'btn btn-primary';
    retryBtn.textContent = 'পুনরায় চেষ্টা করুন';
    retryBtn.addEventListener('click', () => {
      resultArea.classList.add('hidden');
      startBtn.disabled = false;
      quizArea.classList.add('hidden');
    });
    buttonsRow.appendChild(retryBtn);
    if (wrongQuestions.length > 0) {
      const wrongBtn = document.createElement('button');
      wrongBtn.className = 'btn btn-secondary';
      wrongBtn.textContent = 'শুধু ভুল উত্তর';
      wrongBtn.addEventListener('click', () => {
        currentQuestions = wrongQuestions.slice();
        currentIndex = 0;
        score = 0;
        wrongQuestions = [];
        resultArea.classList.add('hidden');
        showQuestion();
      });
      buttonsRow.appendChild(wrongBtn);
    }
    card.appendChild(buttonsRow);
    resultArea.appendChild(card);
  }

  // Start button logic
  startBtn.addEventListener('click', () => {
    // Reset state and load dataset
    startBtn.disabled = true;
    quizArea.classList.add('hidden');
    resultArea.classList.add('hidden');
    const data = loadQuiz();
    allQuestions = data.questions || [];
    // Determine selected subject category
    let selectedCat = null;
    if (subjectInputs && subjectInputs.length) {
      subjectInputs.forEach(inp => {
        if (inp.checked) {
          selectedCat = inp.value;
        }
      });
    }
    // Filter questions by selected subject unless "All" is chosen
    let filtered = allQuestions;
    if (selectedCat && selectedCat !== 'All') {
      filtered = allQuestions.filter(q => q.category === selectedCat);
    }
    // If fewer than 10 questions are available for the selected subject,
    // just use all of them; otherwise pick the first 10 after shuffling.
    const shuffled = shuffle(filtered);
    currentQuestions = shuffled.length > 10 ? shuffled.slice(0, 10) : shuffled;
    currentIndex = 0;
    score = 0;
    wrongQuestions = [];
    showQuestion();
  });
});