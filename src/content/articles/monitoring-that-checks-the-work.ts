import type { Article } from './types'

const article: Article = {
  slug: 'monitoring-that-checks-the-work',
  datePublished: '2026-10-23',
  en: {
    title: 'All Green, Zero Work: AI Agent Monitoring That Checks the Work',
    description:
      'My dashboard showed all green while zero tasks were completed in 4.5 hours. How I rebuilt AI agent monitoring to check the work, not just the lights.',
    body: [
      {
        type: 'p',
        text: 'For four and a half hours, every light on my status screen was green. In that same window, my AI workers completed exactly zero tasks. Nothing had crashed. Nothing had raised an alarm. The work had simply stopped, and the screen had no way of knowing.',
      },
      { type: 'h2', text: 'The problem: "the system is up" is not the same as "the work is done"' },
      {
        type: 'p',
        text: 'Many companies in Kuwait and the GCC rely on screens that answer one question: is the system running? The server responds, the application loads, the status page is green. Management sees that and assumes the business behind it is moving.',
      },
      {
        type: 'p',
        text: 'But a system can be fully up while nothing useful happens. Orders wait in a queue that nobody picks up. Requests are received and never answered. An automated process sits idle, waiting for something that will not come. Every check passes, because every check asks the wrong question.',
      },
      { type: 'h2', text: 'What it costs' },
      {
        type: 'ul',
        items: [
          'Silent delays: work stops for hours before anyone notices, and the backlog grows the whole time.',
          'Learning from customers: the first sign of a problem is often a complaint, not an alert.',
          'False confidence: a green screen that cannot see a stoppage is worse than no screen, because it tells everyone not to look.',
        ],
      },
      {
        type: 'p',
        text: 'With AI agents this matters even more. They are meant to work without someone watching, which is exactly the situation in which a silent stop can go unnoticed the longest.',
      },
      { type: 'h2', text: 'The turning point: measure the work, not the lights' },
      {
        type: 'p',
        text: 'When I looked back at those four and a half hours in my own AI operations, the lesson was clear. My monitoring checked that the services were running, and they were. It never checked whether any work was actually being finished. So I changed what it looks at.',
      },
      {
        type: 'ul',
        items: [
          'Work actually done: the system now checks whether tasks are being completed in the time I would expect. If nothing has finished for too long, that is treated as a problem, even when everything reports that it is up.',
          'Simple capacity: it also watches basic things such as disk space. They are easy to forget, and they can quietly stop work without anything crashing.',
          'Automatic recovery: when a worker sits idle while tasks are waiting, the system wakes it up automatically instead of waiting for me to notice.',
          'Independent alerts: the alerts no longer depend on the thing they are watching. If one part fails, the warning still gets through on a separate path.',
        ],
      },
      {
        type: 'p',
        text: 'The last point is easy to overlook. If your alarm runs through the same system that has stopped, the alarm stops too. A warning is only useful if it can still reach you on the worst day.',
      },
      { type: 'h2', text: 'The outcome' },
      {
        type: 'p',
        text: 'A stall like that no longer hides behind a green screen. When work stops, the system notices, tries to get it moving again, and tells me through a channel that does not depend on whatever failed. The status screen now answers the question that matters to the business: is the work getting done?',
      },
      {
        type: 'quote',
        text: 'The right question is not "is the system on?" It is "did the work happen?"',
      },
      { type: 'h2', text: 'What this means for your company' },
      {
        type: 'p',
        text: 'Whether you run AI agents, automated workflows or a traditional operations team, ask your managers a simple question: does our dashboard show that our systems are on, or that our work is done? If it only shows the first, you may already have hours of silent stoppage that nobody has seen.',
      },
      {
        type: 'p',
        text: 'Monitoring that checks the work is now part of how I think about every AI solution, including the process automation agents and AI assistants I build, and I hold my own AI operations stack to the same standard every day.',
      },
      {
        type: 'p',
        text: 'If this sounds familiar and you would like to talk it through, the WhatsApp button on this page is the quickest way to reach me.',
      },
    ],
  },
  ar: {
    title: 'كل المؤشرات خضراء ولا عمل يُنجز: مراقبة وكلاء الذكاء الاصطناعي بما يُنجز فعلًا',
    description:
      'لوحة المتابعة أظهرت أن كل شيء سليم بينما لم تُنجز أي مهمة خلال 4.5 ساعات. هكذا أعدت بناء المراقبة لتتحقق من العمل المنجز لا من المؤشرات فقط.',
    body: [
      {
        type: 'p',
        text: 'طوال أربع ساعات ونصف كانت كل المؤشرات على شاشة المتابعة خضراء. وفي الفترة نفسها أنجز وكلاء الذكاء الاصطناعي لديّ صفر مهام. لم يتعطل شيء، ولم يصدر أي تنبيه؛ العمل ببساطة توقف، والشاشة لم تكن قادرة على أن تعرف ذلك.',
      },
      { type: 'h2', text: 'المشكلة: «النظام يعمل» لا تعني «العمل يُنجز»' },
      {
        type: 'p',
        text: 'تعتمد شركات كثيرة في الكويت والخليج على شاشات تجيب عن سؤال واحد: هل النظام يعمل؟ الخادم يستجيب، والتطبيق يفتح، وصفحة الحالة خضراء. ترى الإدارة ذلك فتفترض أن العمل الذي يقف خلفه يسير كما ينبغي.',
      },
      {
        type: 'p',
        text: 'لكن النظام قد يكون قائمًا بالكامل بينما لا يحدث أي شيء مفيد: طلبات تنتظر في قائمة لا يلتقطها أحد، واستفسارات تصل ولا يُرد عليها، وإجراء مؤتمت متوقف ينتظر شيئًا لن يأتي. كل الفحوصات تنجح، لأن كل الفحوصات تطرح السؤال الخطأ.',
      },
      { type: 'h2', text: 'التكلفة الحقيقية' },
      {
        type: 'ul',
        items: [
          'تأخير صامت: يتوقف العمل ساعات قبل أن ينتبه أحد، وتتراكم المهام المعلقة طوال الوقت.',
          'العميل أول من يعلم: كثيرًا ما تكون أول إشارة إلى المشكلة شكوى من عميل، لا تنبيهًا من النظام.',
          'ثقة في غير محلها: الشاشة الخضراء التي لا ترى التوقف أسوأ من غياب الشاشة، لأنها تطمئن الجميع إلى أنه لا داعي للنظر.',
        ],
      },
      {
        type: 'p',
        text: 'ومع وكلاء الذكاء الاصطناعي يزداد الأمر أهمية؛ فهم مصممون للعمل دون أن يراقبهم أحد، وهذا تحديدًا هو الوضع الذي قد يبقى فيه التوقف الصامت أطول مدة دون أن يُكتشف.',
      },
      { type: 'h2', text: 'نقطة التحول: قِس العمل لا المؤشرات' },
      {
        type: 'p',
        text: 'حين راجعت تلك الساعات الأربع والنصف في منظومتي، كان الدرس واضحًا: المراقبة كانت تتحقق من أن الخدمات تعمل، وكانت تعمل فعلًا، لكنها لم تتحقق قط من أن أي عمل يُنجز. فغيّرت ما تنظر إليه.',
      },
      {
        type: 'ul',
        items: [
          'العمل المنجز فعلًا: صار النظام يتحقق من أن المهام تكتمل في الوقت المتوقع. وإذا مرت مدة طويلة دون إنجاز أي مهمة يُعامل ذلك كمشكلة، حتى لو أفادت كل الأنظمة بأنها تعمل.',
          'السعة الأساسية: يراقب أيضًا أمورًا بسيطة مثل مساحة التخزين؛ فهي سهلة النسيان، وقد توقف العمل بهدوء دون أن يتعطل أي شيء.',
          'الاستعادة التلقائية: حين يبقى أحد العاملين خاملًا بينما تنتظر المهام، يوقظه النظام تلقائيًا بدلًا من انتظار أن ألاحظ ذلك بنفسي.',
          'تنبيهات مستقلة: لم تعد التنبيهات تعتمد على الجزء الذي تراقبه؛ فإذا تعطل جزء ما، يصل التحذير عبر مسار منفصل.',
        ],
      },
      {
        type: 'p',
        text: 'النقطة الأخيرة يسهل إغفالها. إذا كان جرس الإنذار يعمل عبر النظام نفسه الذي توقف، فسيتوقف الجرس أيضًا. التحذير لا قيمة له إلا إذا استطاع الوصول إليك في أسوأ الأيام.',
      },
      { type: 'h2', text: 'النتيجة' },
      {
        type: 'p',
        text: 'لم يعد توقف كهذا يختبئ خلف شاشة خضراء. حين يتوقف العمل يلاحظ النظام ذلك، ويحاول إعادة تشغيله، ويبلغني عبر قناة لا تعتمد على الجزء الذي تعطل. وصارت شاشة المتابعة تجيب عن السؤال الذي يهم العمل فعلًا: هل يُنجز العمل؟',
      },
      {
        type: 'quote',
        text: 'السؤال الصحيح ليس «هل النظام يعمل؟» بل «هل أُنجز العمل؟»',
      },
      { type: 'h2', text: 'ماذا يعني هذا لشركتك؟' },
      {
        type: 'p',
        text: 'سواء كنت تشغّل وكلاء ذكاء اصطناعي أو إجراءات مؤتمتة أو فريق عمليات تقليديًا، اطرح على مديريك سؤالًا بسيطًا: هل تُظهر لوحة المتابعة لدينا أن أنظمتنا تعمل، أم أن عملنا يُنجز؟ إذا كانت تُظهر الأولى فقط، فقد تكون لديك بالفعل ساعات من التوقف الصامت لم يرها أحد.',
      },
      {
        type: 'p',
        text: 'صارت المراقبة التي تتحقق من العمل المنجز جزءًا من نظرتي إلى كل حل ذكاء اصطناعي، بما في ذلك وكلاء أتمتة الإجراءات والمساعدات الذكية التي أبنيها، وأُخضع منظومتي الخاصة للمعيار نفسه كل يوم.',
      },
      {
        type: 'p',
        text: 'إذا بدا لك هذا مألوفًا ورغبت في الحديث عنه، فزر واتساب في هذه الصفحة هو أسرع طريقة للتواصل معي.',
      },
    ],
  },
}

export default article
