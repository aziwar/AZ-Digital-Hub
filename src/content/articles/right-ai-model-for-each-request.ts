import type { Article } from './types'

const article: Article = {
  slug: 'right-ai-model-for-each-request',
  datePublished: '2026-10-23',
  dateModified: '2026-10-24',
  en: {
    title: 'AI Governance: The Right Model for Each Request',
    description:
      'How an AI gateway routes each request by complexity and data sensitivity, so sensitive data stays where it belongs and every AI cost stays visible.',
    body: [
      {
        type: 'p',
        text: 'Not every question deserves your most expensive AI model. And not every document should leave your company at all. Once I started treating those two facts as rules rather than good intentions, my AI operations became cheaper to run and far easier to explain.',
      },
      { type: 'h2', text: 'The problem: one model for everything, or a model for anyone' },
      {
        type: 'p',
        text: 'Many companies I speak with in Kuwait and the GCC fall into one of two patterns. Some choose a single, premium AI service and send everything to it: a two-line email summary goes to the same model, at the same price, as a complex contract review. Others leave it open, and staff use whatever AI tool is closest to hand, sometimes pasting customer details, financial figures or internal documents into a public service.',
      },
      {
        type: 'p',
        text: 'Both patterns feel convenient at first. Both create problems that management usually discovers later.',
      },
      { type: 'h2', text: 'What it costs' },
      {
        type: 'ul',
        items: [
          'Money: paying premium prices for simple work that a lighter model handles just as well.',
          'Risk: sensitive data ending up with a service it was never approved for.',
          'Blind spots: when someone asks which data went where, and what it cost, nobody can answer with confidence.',
        ],
      },
      {
        type: 'p',
        text: 'The last point is often the most serious. A company can recover from a high bill. It is much harder to recover from not knowing where its confidential information has been.',
      },
      { type: 'h2', text: 'The turning point: one controlled front door' },
      {
        type: 'p',
        text: 'In my own AI operations I use several models: Claude, models from OpenAI and open models. Each has strengths, and each has a different price and a different place where data is processed. Instead of letting every application talk to every model directly, I put one controlled front door in between: an AI gateway.',
      },
      {
        type: 'p',
        text: 'Every request passes through that gateway, and before it reaches any model, the gateway answers two questions:',
      },
      {
        type: 'ol',
        items: [
          'How complex is this request? Simple tasks go to a lighter, lower-cost model. Demanding tasks go to a stronger one.',
          'How sensitive is the data? Sensitive requests may only take routes that are approved for that kind of data. Everything else is closed to them.',
        ],
      },
      {
        type: 'p',
        text: 'Each decision is recorded: which route the request took and what it cost. The rules live in one place, so changing a policy does not mean changing every application that uses AI.',
      },
      { type: 'h2', text: 'When the governance was tested' },
      {
        type: 'p',
        text: 'Good governance is not the absence of mistakes. It is a system in which mistakes are visible and can be reversed quickly. That was tested on my own setup. During one change, a step that checks how sensitive a request is went missing from one route. Because every change is reviewed and every route is traceable, the gap was caught and the change was reverted the same day.',
      },
      {
        type: 'quote',
        text: 'The point of governance is not to promise that nothing will go wrong. It is to make sure you find out, and can fix it, before it becomes a habit.',
      },
      {
        type: 'p',
        text: 'For a business owner, that is the difference between hoping your AI use is safe and being able to show that it is controlled.',
      },
      { type: 'h2', text: 'The outcome' },
      {
        type: 'p',
        text: 'Today, every request in my AI operations can be traced to the route it took and what it cost. Sensitive data has defined paths and no others. Simple work is not billed at premium prices. And when I need to answer a question about where data went or why a cost changed, the answer is already on record.',
      },
      { type: 'h2', text: 'What this means for your company' },
      {
        type: 'p',
        text: 'You do not need to build everything at once. Start with three questions for your management team: Which AI services are our people using today? Which of our data should never leave approved systems? And can we see what we are spending on AI, request by request? If any answer is unclear, a controlled gateway is usually the right first step.',
      },
      {
        type: 'p',
        text: 'AI governance and model gateways are part of the work I have delivered for large enterprises and public-sector organisations over the past year, with a choice of commercial and open models, access control, usage visibility and cost control.',
      },
      {
        type: 'p',
        text: 'If you would like to discuss how this could look for your company, the WhatsApp button on this page is the simplest way to reach me.',
      },
    ],
  },
  ar: {
    title: 'النموذج المناسب لكل طلب: حوكمة الذكاء الاصطناعي عبر بوابة واحدة',
    description:
      'كيف توجّه بوابة الذكاء الاصطناعي كل طلب بحسب تعقيده وحساسية بياناته، فتبقى البيانات الحساسة في مكانها وتبقى تكلفة الذكاء الاصطناعي واضحة.',
    body: [
      {
        type: 'p',
        text: 'ليس كل سؤال بحاجة إلى أغلى نموذج ذكاء اصطناعي لديك، وليس كل مستند يجوز أن يغادر شركتك أصلًا. حين بدأت أتعامل مع هاتين الحقيقتين كقواعد ملزمة لا كنوايا حسنة، صارت منظومة الذكاء الاصطناعي التي أديرها أقل تكلفة وأسهل بكثير في تفسيرها ومساءلتها.',
      },
      { type: 'h2', text: 'المشكلة: نموذج واحد لكل شيء، أو أداة مفتوحة للجميع' },
      {
        type: 'p',
        text: 'كثير من الشركات التي أتحدث معها في الكويت والخليج تقع في أحد نمطين. بعضها يختار خدمة ذكاء اصطناعي واحدة متميزة ويرسل إليها كل شيء، فيذهب ملخص رسالة من سطرين إلى النموذج نفسه وبالسعر نفسه الذي تُراجع به عقود معقدة. وبعضها يترك الباب مفتوحًا، فيستخدم الموظفون أي أداة متاحة، وقد يلصقون فيها بيانات عملاء أو أرقامًا مالية أو مستندات داخلية في خدمة عامة.',
      },
      {
        type: 'p',
        text: 'كلا النمطين مريح في البداية، وكلاهما يخلّف مشكلات تكتشفها الإدارة عادة في وقت متأخر.',
      },
      { type: 'h2', text: 'التكلفة الحقيقية' },
      {
        type: 'ul',
        items: [
          'المال: دفع أسعار مرتفعة مقابل أعمال بسيطة يستطيع نموذج أخف إنجازها بالجودة نفسها.',
          'المخاطر: وصول بيانات حساسة إلى خدمة لم تُعتمد لها قط.',
          'غياب الرؤية: حين يُسأل أي البيانات ذهبت إلى أين، وكم كلّف ذلك، لا يستطيع أحد أن يجيب بثقة.',
        ],
      },
      {
        type: 'p',
        text: 'والنقطة الأخيرة غالبًا هي الأخطر؛ فالشركة تستطيع تجاوز فاتورة مرتفعة، لكن من الصعب جدًا أن تتجاوز عدم معرفتها بمكان معلوماتها السرية.',
      },
      { type: 'h2', text: 'نقطة التحول: مدخل واحد مضبوط' },
      {
        type: 'p',
        text: 'أستخدم في منظومتي عدة نماذج: Claude ونماذج OpenAI ونماذج مفتوحة. لكل منها نقاط قوة، ولكل منها سعر مختلف ومكان مختلف تُعالج فيه البيانات. وبدلًا من أن يتصل كل تطبيق بكل نموذج مباشرة، وضعت بينها مدخلًا واحدًا تحت السيطرة: بوابة للذكاء الاصطناعي.',
      },
      {
        type: 'p',
        text: 'يمر كل طلب عبر هذه البوابة، وقبل أن يصل إلى أي نموذج تجيب البوابة عن سؤالين:',
      },
      {
        type: 'ol',
        items: [
          'ما مدى تعقيد الطلب؟ المهام البسيطة تذهب إلى نموذج أخف وأقل تكلفة، والمهام الصعبة إلى نموذج أقوى.',
          'ما مدى حساسية البيانات؟ الطلبات الحساسة لا تسلك إلا مسارات معتمدة لهذا النوع من البيانات، وكل ما عداها مغلق أمامها.',
        ],
      },
      {
        type: 'p',
        text: 'ويُسجَّل كل قرار: المسار الذي سلكه الطلب وتكلفته. والقواعد محفوظة في مكان واحد، فتغيير السياسة لا يعني تعديل كل تطبيق يستخدم الذكاء الاصطناعي.',
      },
      { type: 'h2', text: 'حين وُضعت الحوكمة على المحك' },
      {
        type: 'p',
        text: 'الحوكمة الجيدة لا تعني غياب الأخطاء، بل تعني نظامًا تظهر فيه الأخطاء ويمكن التراجع عنها بسرعة. وقد اختُبر ذلك فعلًا في منظومتي: خلال أحد التعديلات سقطت من أحد المسارات خطوة التحقق من حساسية الطلب. ولأن كل تعديل يخضع للمراجعة وكل مسار قابل للتتبع، اكتُشفت الثغرة وأُلغي التعديل في اليوم نفسه.',
      },
      {
        type: 'quote',
        text: 'الغاية من الحوكمة ليست أن تعد بألا يحدث خطأ، بل أن تضمن اكتشافه وإصلاحه قبل أن يتحول إلى عادة.',
      },
      {
        type: 'p',
        text: 'وبالنسبة إلى مالك الشركة، هذا هو الفرق بين أن تأمل أن استخدامك للذكاء الاصطناعي آمن، وأن تستطيع إثبات أنه تحت السيطرة.',
      },
      { type: 'h2', text: 'النتيجة' },
      {
        type: 'p',
        text: 'اليوم يمكن تتبع كل طلب في منظومتي إلى المسار الذي سلكه وإلى تكلفته. للبيانات الحساسة مسارات محددة ولا شيء غيرها، والأعمال البسيطة لا تُحتسب بأسعار مرتفعة. وحين أحتاج إلى الإجابة عن سؤال حول مكان ذهاب البيانات أو سبب تغير التكلفة، تكون الإجابة مسجلة مسبقًا.',
      },
      { type: 'h2', text: 'ماذا يعني هذا لشركتك؟' },
      {
        type: 'p',
        text: 'لا تحتاج إلى بناء كل شيء دفعة واحدة. ابدأ بثلاثة أسئلة لفريق الإدارة: ما خدمات الذكاء الاصطناعي التي يستخدمها موظفونا اليوم؟ وما البيانات التي يجب ألا تغادر الأنظمة المعتمدة أبدًا؟ وهل نستطيع أن نرى ما ننفقه على الذكاء الاصطناعي طلبًا بطلب؟ إذا كانت أي إجابة غير واضحة، فالبوابة المضبوطة هي في الغالب الخطوة الأولى الصحيحة.',
      },
      {
        type: 'p',
        text: 'حوكمة الذكاء الاصطناعي وبوابات النماذج جزء من الأعمال التي نفذتها خلال العام الماضي لمؤسسات كبرى وجهات في القطاع العام، مع إمكانية الاختيار بين النماذج التجارية والمفتوحة، وضبط الصلاحيات، ووضوح الاستخدام، والتحكم في التكلفة.',
      },
      {
        type: 'p',
        text: 'إذا رغبت في مناقشة الشكل الذي يناسب شركتك، فالضغط على زر واتساب في هذه الصفحة هو أبسط طريقة للتواصل معي.',
      },
    ],
  },
}

export default article
