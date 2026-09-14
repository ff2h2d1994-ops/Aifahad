-- Run this AFTER schema.sql. Safe to re-run (upserts by slug).
--
-- Prices are starting-point suggestions grounded in the Saudi freelance
-- market (Khamsat/Mostaql listings and local web-design agency rates,
-- researched Sept 2026) for an independent freelancer/personal brand —
-- not an agency. Adjust freely from /admin/services; these are meant
-- to be accessible and flexible starting points, not fixed law.

insert into services (slug, category, title_ar, title_en, description_ar, description_en, icon, features_ar, features_en, price_min, price_max, price_note, order_index)
values
('ai-services','ai','خدمات الذكاء الاصطناعي','AI Solutions',
 'محتوى نصي وصوري، أفكار مبتكرة، أتمتة، ومساعدين ذكاء اصطناعي مخصصين.',
 'Text and visual content, automation, and custom AI assistants.',
 'brain-circuit',
 '["صناعة محتوى نصي وصوري","أفكار وحلول مبتكرة","أتمتة المهام","إنشاء مساعدين ووكلاء AI","حلول ذكاء اصطناعي مخصصة","بناء حلول للأفراد والمنشآت","تطوير أفكار الأعمال باستخدام AI","استخدام الذكاء الاصطناعي لزيادة الإنتاجية"]'::jsonb,
 '["Text and visual content creation","Creative ideas and solutions","Task automation","AI assistants and agents","Custom AI solutions","Solutions for individuals and companies","Growing business ideas with AI","Boosting productivity with AI"]'::jsonb,
 150, 1500, 'حسب حجم وتعقيد المشروع', 1),

('photo-editing','photo','معالجة الصور','Photo Editing',
 'تحسين الجودة، تغيير الخلفيات والهوية البصرية، وصور تسويقية احترافية.',
 'Quality enhancement, background and identity changes, professional marketing photos.',
 'image',
 '["تحسين الجودة","تغيير الخلفيات","نقل الشخص إلى أي مكان أو بيئة","تغيير الهوية البصرية للشخص","تحويل الصور العادية إلى صور احترافية","إنشاء صور واقعية واحترافية","تركيب الأشخاص داخل مشاهد مختلفة","تحسين الإضاءة والألوان","إزالة أو إضافة عناصر","ترميم الصور القديمة","إنشاء صور تسويقية ومنتجات احترافية"]'::jsonb,
 '["Quality enhancement","Background changes","Placing a subject in any setting","Visual identity changes","Turning casual photos into professional ones","Realistic professional image creation","Compositing people into scenes","Lighting and color correction","Removing or adding elements","Restoring old photos","Marketing and product photography"]'::jsonb,
 30, 250, 'لكل صورة، حسب الكمية والتعقيد', 2),

('graphic-design','design','التصميم الجرافيكي','Graphic Design',
 'شعارات، هويات بصرية، إعلانات، وتصاميم تسويقية متكاملة.',
 'Logos, brand identities, ads, and complete marketing designs.',
 'palette',
 '["تصميم الشعارات","تصميم الهويات البصرية","بوستات السوشال ميديا","إعلانات تجارية","تصميم منيو المطاعم والكافيهات","جداول","إنفوجرافيك","سير ذاتية","بروشورات","عروض تقديمية","أغلفة","تصاميم المنتجات","تصاميم المناسبات","التصاميم التسويقية"]'::jsonb,
 '["Logo design","Brand identity design","Social media posts","Commercial ads","Restaurant/cafe menus","Tables","Infographics","Resumes","Brochures","Presentations","Covers","Product designs","Event designs","Marketing designs"]'::jsonb,
 100, 2000, 'حسب نوع التصميم — بوست، شعار، أو هوية كاملة', 3),

('video-services','video','خدمات الفيديو','Video Production',
 'مونتاج احترافي، موشن جرافيك، وفيديوهات إعلانية وتسويقية.',
 'Professional editing, motion graphics, and promotional videos.',
 'clapperboard',
 '["مونتاج احترافي","Motion Graphics","فيديوهات إعلانية","فيديوهات تسويقية","فيديوهات للسوشال ميديا","Reels","Shorts","تحسين جودة الفيديو","إضافة مؤثرات","إضافة ترجمة","تحويل أفكار إلى فيديوهات باستخدام AI"]'::jsonb,
 '["Professional editing","Motion graphics","Ad videos","Marketing videos","Social media videos","Reels","Shorts","Video quality enhancement","Adding effects","Adding subtitles","Turning ideas into AI-generated videos"]'::jsonb,
 150, 900, 'حسب مدة الفيديو ومستوى التعقيد', 4),

('audio-services','audio','الخدمات الصوتية','Audio Services',
 'تسجيل، تعديل، وتحسين جودة الصوت باحترافية.',
 'Recording, editing, and professional audio enhancement.',
 'mic',
 '["تسجيل شيلات وأغاني","تعديل الصوت","تحسين جودة التسجيل","إزالة الضوضاء","تحويل صوت إلى صوت آخر","معالجة التسجيلات الصوتية","Voice Over","تحسين النبرة","إنتاج مقاطع صوتية احترافية"]'::jsonb,
 '["Recording songs/chants","Audio editing","Recording quality enhancement","Noise removal","Voice conversion","Audio processing","Voice over","Tone enhancement","Professional audio production"]'::jsonb,
 75, 400, 'حسب مدة ونوع التسجيل', 5),

('web-development','web','المواقع والبرمجة','Web & Development',
 'مواقع احترافية، لوحات تحكم، وحلول برمجية مخصصة بالذكاء الاصطناعي.',
 'Professional websites, dashboards, and custom AI-powered software.',
 'code-2',
 '["تصميم مواقع احترافية","Landing Pages","Dashboards","لوحات تحكم","مواقع شركات","مواقع شخصية","مواقع خدمات","برمجة مخصصة","تطبيقات ويب","أدوات رقمية","أنظمة أعمال داخلية","أتمتة العمليات","حلول برمجية باستخدام AI"]'::jsonb,
 '["Professional website design","Landing pages","Dashboards","Admin panels","Company websites","Personal websites","Service websites","Custom development","Web apps","Digital tools","Internal business systems","Process automation","AI-powered software solutions"]'::jsonb,
 800, 6000, 'حسب نوع الموقع وعدد الصفحات', 6),

('data-analysis','data','تحليل البيانات والملفات','Data Analysis',
 'تحليل ملفات Excel وPDF، تقارير، ورسوم بيانية تدعم القرار.',
 'Excel/PDF analysis, reports, and charts that support decisions.',
 'bar-chart-3',
 '["تحليل ملفات Excel","تحليل ملفات PDF","تحليل مستندات","استخراج معلومات مهمة","تلخيص الملفات","إعداد تقارير","إنشاء رسوم بيانية","تحليل بيانات","دعم اتخاذ القرار","تنظيم البيانات"]'::jsonb,
 '["Excel file analysis","PDF file analysis","Document analysis","Extracting key information","File summarization","Report preparation","Chart creation","Data analysis","Decision support","Data organization"]'::jsonb,
 50, 400, 'حسب حجم البيانات وتعقيد التحليل', 7),

('smart-shopping','shopping','التسوق الذكي','Smart Shopping',
 'بحث ومقارنة أسعار وإيجاد أفضل الروابط الموثوقة للشراء.',
 'Searching, price comparison, and finding trusted purchase links.',
 'shopping-bag',
 '["البحث عن أي منتج","مقارنة الأسعار","البحث عن أفضل سعر","توفير روابط شراء موثوقة","مقارنة المنتجات","إيجاد بدائل أرخص","مساعدة العميل في اختيار المنتج المناسب","البحث داخل المتاجر المحلية والعالمية"]'::jsonb,
 '["Finding any product","Price comparison","Finding the best price","Trusted purchase links","Product comparison","Finding cheaper alternatives","Helping choose the right product","Searching local and global stores"]'::jsonb,
 40, 150, 'لكل طلب بحث ومقارنة', 8),

('travel-booking','travel','حجز التذاكر والفنادق','Travel & Booking',
 'رحلات طيران، فنادق، وخطط سفر متكاملة حسب الميزانية.',
 'Flights, hotels, and complete travel plans based on budget.',
 'plane',
 '["البحث عن رحلات الطيران","مقارنة أسعار التذاكر","البحث عن الفنادق","مقارنة الفنادق","إعداد جداول سياحية","إعداد خطط سفر","اقتراح أماكن سياحية","تنظيم رحلة متكاملة حسب الميزانية"]'::jsonb,
 '["Finding flights","Comparing ticket prices","Finding hotels","Comparing hotels","Building itineraries","Travel planning","Suggesting destinations","Full trip planning by budget"]'::jsonb,
 100, 400, 'حسب عدد الوجهات وتعقيد الرحلة', 9),

('consulting-training','consulting','استشارات وتدريب','Consulting & Training',
 'استشارات في الذكاء الاصطناعي وتدريب للأفراد وأصحاب الأعمال.',
 'AI consulting and training for individuals and businesses.',
 'graduation-cap',
 '["استشارات في الذكاء الاصطناعي","تدريب على أدوات AI","تدريب للأفراد","تدريب لأصحاب الأعمال","تطوير الأفكار","تطوير المشاريع","دعم رواد الأعمال","اقتراح حلول رقمية","أتمتة الأعمال"]'::jsonb,
 '["AI consulting","Training on AI tools","Training for individuals","Training for business owners","Idea development","Project development","Supporting entrepreneurs","Suggesting digital solutions","Business automation"]'::jsonb,
 150, 600, 'للجلسة الواحدة', 10),

('content-management','content','إدارة وصناعة المحتوى','Content Management',
 'خطط محتوى، كتابة إعلانات، وإدارة حسابات السوشال ميديا.',
 'Content plans, ad copywriting, and social media management.',
 'megaphone',
 '["خطط محتوى","كتابة محتوى","أفكار للسوشال ميديا","صناعة محتوى باستخدام AI","كتابة إعلانات","كتابة نصوص تسويقية","إدارة الحسابات","تحليل الأداء","إعداد التقارير","تطوير استراتيجية محتوى"]'::jsonb,
 '["Content plans","Content writing","Social media ideas","AI-generated content","Ad copywriting","Marketing copy","Account management","Performance analysis","Reporting","Content strategy"]'::jsonb,
 300, 1500, 'شهريًا، حسب عدد المنصات', 11)

on conflict (slug) do update set
  features_ar = excluded.features_ar,
  features_en = excluded.features_en,
  price_min = excluded.price_min,
  price_max = excluded.price_max,
  price_note = excluded.price_note,
  updated_at = now();
