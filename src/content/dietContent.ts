export type SourceRef = {
  label: string
  url: string
}

export type ContentSection = {
  id: string
  title: string
  sources: SourceRef[]
  paragraphs: string[]
  listItems?: string[]
  subsections?: { title: string; paragraphs: string[] }[]
}

export const PRIMARY_SOURCES: SourceRef[] = [
  {
    label: 'Netlib — Argonne Anti-Jet-Lag Diet',
    url: 'https://www.netlib.org/misc/jet-lag-diet',
  },
  {
    label: 'AntiJetLagDiet.com FAQs (archived)',
    url: 'https://web.archive.org/web/20130109121752/http://www.antijetlagdiet.com/faqs.asp',
  },
  {
    label: 'AntiJetLagDiet.com homepage (archived)',
    url: 'https://web.archive.org/web/20130109121752/http://www.antijetlagdiet.com/',
  },
  {
    label: 'Argonne National Laboratory',
    url: 'https://www.anl.gov/',
  },
  {
    label: 'Military Medicine study (PDF, archived)',
    url: 'https://web.archive.org/web/20130109121752/http://www.antijetlagdiet.com/docs/mmarticle.pdf',
  },
]

export const dietSections: ContentSection[] = [
  {
    id: 'what',
    title: 'What is the Anti-Jetlag Diet?',
    sources: [PRIMARY_SOURCES[0], PRIMARY_SOURCES[2], PRIMARY_SOURCES[3]],
    paragraphs: [
      'The Argonne Anti-Jet-Lag Diet helps travelers quickly adjust their bodies\' internal clocks to new time zones. It is also used to speed the adjustment of shift workers, such as power plant operators, to periodically rotating work hours.',
      'The diet was developed by Dr. Charles F. Ehret of Argonne\'s Division of Biological and Medical Research as an application of his fundamental studies of the daily biological rhythms of animals. Argonne National Laboratory is one of the U.S. Department of Energy\'s major centers of research in energy and the fundamental sciences.',
      'The Anti-Jet-Lag Diet can reduce or prevent jet lag for anyone traveling east or west across three or more time zones. Developed by Dr. Ehret, an Argonne biologist who studied the body\'s inner clocks, the diet uses nature\'s time cues to help your body adjust quickly to a new time zone.',
    ],
  },
  {
    id: 'how-to-avoid',
    title: 'How to Avoid Jet Lag',
    sources: [PRIMARY_SOURCES[0]],
    paragraphs: [
      'Follow these three steps from the Argonne protocol:',
    ],
    listItems: [
      'DETERMINE BREAKFAST TIME at destination on day of arrival.',
      'FEAST–FAST–FEAST–FAST — Start four days before breakfast time in step 1. On day one, FEAST: eat heartily with high-protein breakfast and lunch and a high-carbohydrate dinner. No coffee except between 3 and 5 p.m. On day two, FAST on light meals of salads, light soups, fruits and juices. Again, no coffee except between 3 and 5 p.m. On day three, FEAST again. On day four, FAST; if you drink caffeinated beverages, take them in the morning when traveling west, or between 6 and 11 p.m. when traveling east.',
      'BREAK THE FINAL FAST at destination breakfast time. No alcohol on the plane. If the flight is long enough, sleep until normal breakfast time at destination, but no later. Wake up and FEAST on a high-protein breakfast. Stay awake and active. Continue the day\'s meals according to mealtimes at the destination.',
    ],
  },
  {
    id: 'feast-fast',
    title: 'Feast Days and Fast Days',
    sources: [PRIMARY_SOURCES[0], PRIMARY_SOURCES[1]],
    paragraphs: [
      'FEAST on high-protein breakfast and lunches to stimulate the body\'s active cycle. Suitable meals include steak, eggs, hamburgers, high-protein cereals, and green beans.',
      'FEAST on high-carbohydrate suppers to stimulate sleep. They include spaghetti and other pastas (but no meatballs), crepes (but no meat filling), potatoes, other starchy vegetables, and sweet desserts.',
      'FAST days help deplete the liver\'s store of carbohydrates and prepare the body\'s clock for resetting. Suitable foods include fruit, light soups, broths, skimpy salads, unbuttered toast, and half pieces of bread. Keep calories and carbohydrates to a minimum, preferably under 800 calories per day.',
    ],
    subsections: [
      {
        title: 'Sample Feast Day Menu',
        paragraphs: [
          'Breakfast: plenty of steak, eggs, ham, cheese; milk; some orange juice; one piece of lightly buttered bread.',
          'Lunch: assorted cold cuts (chicken, turkey, lean meat); cheeses; one cup of vegetables; one apple, pear, banana, or bunch of grapes.',
          'Dinner: pasta with meatless tomato sauce; one piece of lightly buttered bread; fruit salad; cake or cookies. Alcoholic beverages in reasonable amounts.',
        ],
      },
      {
        title: 'Sample Fast Day Menu',
        paragraphs: [
          'Breakfast: one egg any style; ½ cup yogurt; ½ cup orange juice.',
          'Lunch: ½ cup packed tuna or salmon with lemon juice; one piece of lightly buttered bread or light mayo; tomato and lettuce; ½ cup milk.',
          'Dinner: medium salad of pure vegetables with one tablespoon dressing; one piece of lightly buttered bread; one optional alcoholic beverage; one apple or pear.',
        ],
      },
    ],
  },
  {
    id: 'how-it-works',
    title: 'How Does the Diet Work?',
    sources: [PRIMARY_SOURCES[1]],
    paragraphs: [
      'To avoid jet lag, the Anti-Jet-Lag Diet uses some of the same time cues that cause it. These time cues include meal times, sunset and sunrise, and daily cycles of rest and activity. Normally, they work together to help keep the body on schedule and healthy.',
      'The Anti-Jet-Lag Diet is more than a diet. It helps avoid jet lag with a coordinated plan that combines alternate days of moderate feasting and fasting to help speed your adjustment to a new schedule. Meals are central: what you eat sends your body signals about waking up and going to sleep.',
      'An example traveling east: A traveler planning a Sunday flight from New York to Paris faces a nine-hour flight across six time zones, arriving Monday at 10 a.m. Paris time. The traveler begins the diet on Thursday — feast day — followed by fasting on Friday, feasting on Saturday, and fasting on Sunday (flight day).',
      'On feast days, breakfast and lunch should be high in protein (steak and eggs, meat and beans). Supper is high in carbohydrates (spaghetti without meatballs, pasta without high-protein additions). On fast days, eat three small meals under about 700–800 calories.',
      'On flight day (Sunday evening), the traveler boards about 7 p.m., drinks coffee between 9 and 10 p.m., and sleeps. About 1:30 a.m. New York time — 7:30 a.m. in Paris — they wake for a high-protein breakfast, stay active on the plane, eat a high-protein lunch Monday afternoon in Paris, a high-carbohydrate supper that evening, and wake Tuesday with little or no jet lag.',
      'On the return trip west, the same feast–fast–fast pattern applies in reverse, with morning caffeine on departure day and breaking the fast at New York breakfast time.',
    ],
  },
  {
    id: 'who',
    title: 'Who Should Use It?',
    sources: [PRIMARY_SOURCES[1]],
    paragraphs: [
      'Anyone traveling across three or more time zones can benefit from the Anti-Jet-Lag Diet plan. Besides aiding travelers, this research has important implications for helping shift workers. Many organizations use shift-rotation programs based on this plan to help workers adjust quickly to continually changing work shifts.',
      'Pre-teenagers adjust so quickly to new time zones that they seldom need the help of the Anti-Jet-Lag Diet. The older you are, the harder it is to adjust to jet lag and the more you can benefit from using it.',
    ],
  },
  {
    id: 'does-it-work',
    title: 'Does It Work?',
    sources: [PRIMARY_SOURCES[1], PRIMARY_SOURCES[4]],
    paragraphs: [
      'The professional journal Military Medicine reported a test of the Anti-Jet-Lag Diet on 186 members of the Minnesota and Wisconsin National Guards during a joint training mission with South Korean troops across nine time zones. On the trip east to Korea, soldiers who used the diet were 7.5 times less likely to experience symptoms of jet lag. On the return trip west, soldiers who used the diet were 16.2 times less likely to have jet-lag symptoms.',
      'Argonne National Laboratory has received thousands of letters from people who have used the Anti-Jet-Lag Diet. More than 99 percent have been positive. Left to its own devices, the body normally needs one day to adjust for each time zone crossed. Proper use of the Anti-Jet-Lag Diet can help the traveler make the change in one day.',
    ],
  },
  {
    id: 'about-food',
    title: 'About Food',
    sources: [PRIMARY_SOURCES[1]],
    paragraphs: [
      'High-protein foods that provide all the amino acids your body needs include meat, fish, poultry, milk, cheese, and eggs. Proteins stimulate the body to produce catecholamines, biochemicals it naturally produces during the active part of the daily cycle.',
      'Unprocessed high-carbohydrate foods include cereal grains, potatoes, many fruits and vegetables, peas, and beans. Processed high-carbohydrate foods include pasta, bread, jams, and dried fruits. Carbohydrates stimulate the body to produce indoleamines, biochemicals it naturally produces during the resting phase of your daily cycle.',
      'Many plant foods are high in protein. Good examples include almonds (24 g protein per cup), lentils (16 g), kidney beans (15 g), and peanuts (37 g roasted). Even plant foods high in protein may lack a complete amino acid profile; include food from at least two of the three plant categories — grains, beans/legumes, and nuts/seeds — at each meal.',
    ],
  },
  {
    id: 'caffeine-alcohol',
    title: 'About Caffeine and Alcohol',
    sources: [PRIMARY_SOURCES[0], PRIMARY_SOURCES[1]],
    paragraphs: [
      'Caffeine, like theophylline in tea and theobromine in cocoa, belongs to a class of chemicals called methylated xanthines. They tend to speed up the body clock when taken late during the normal activity cycle and slow it down when taken early. During the middle of the daily cycle — roughly 3 to 5 p.m. for most people — they have little or no effect.',
      'On feast and fast days before travel, drink coffee, tea, cola, or other caffeinated beverages only between 3 and 5 p.m.',
      'Alcohol is another food that can reset your circadian rhythms, but the precise effects vary with amount, time of day, and body weight. It is easier to eliminate alcohol for a few days, making the diet simpler and more effective. No alcohol on the plane during the final fast.',
    ],
  },
  {
    id: 'medical',
    title: 'Medical Caution',
    sources: [PRIMARY_SOURCES[1]],
    paragraphs: [
      'If you are under a doctor\'s care, consult your physician before using the Anti-Jet-Lag Diet — not because using the diet will harm you, but because varying your doctor\'s instructions might.',
    ],
  },
]
