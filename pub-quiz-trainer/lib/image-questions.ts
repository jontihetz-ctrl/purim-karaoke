import type { TriviaQuestion } from '@/types'

function wp(file: string): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=320`
}

interface ImageQuestion extends TriviaQuestion {
  image: string
  explanation: string
}

const FAMOUS_FACES: ImageQuestion[] = [
  {
    image: wp('Albert_Einstein_Head.jpg'),
    question: 'Who is this?',
    correct_answer: 'Albert Einstein',
    incorrect_answers: ['Isaac Newton', 'Nikola Tesla', 'Charles Darwin'],
    category: 'Famous Faces',
    type: 'multiple', difficulty: 'easy',
    explanation: 'Albert Einstein (1879–1955) developed the theory of relativity and won the Nobel Prize in Physics in 1921.'
  },
  {
    image: wp('Mahatma-Gandhi,_studio,_1931.jpg'),
    question: 'Who is this?',
    correct_answer: 'Mahatma Gandhi',
    incorrect_answers: ['Jawaharlal Nehru', 'Nelson Mandela', 'Martin Luther King Jr.'],
    category: 'Famous Faces',
    type: 'multiple', difficulty: 'easy',
    explanation: 'Mahatma Gandhi led India\'s non-violent independence movement against British rule, inspiring civil rights movements worldwide.'
  },
  {
    image: wp('Marie_Curie_c1920.jpg'),
    question: 'Who is this?',
    correct_answer: 'Marie Curie',
    incorrect_answers: ['Rosalind Franklin', 'Florence Nightingale', 'Ada Lovelace'],
    category: 'Famous Faces',
    type: 'multiple', difficulty: 'easy',
    explanation: 'Marie Curie was the first woman to win a Nobel Prize, and the only person to win in two different sciences (Physics and Chemistry).'
  },
  {
    image: wp('Charles_Darwin_seated_crop.jpg'),
    question: 'Who is this?',
    correct_answer: 'Charles Darwin',
    incorrect_answers: ['Gregor Mendel', 'Alfred Russel Wallace', 'Louis Pasteur'],
    category: 'Famous Faces',
    type: 'multiple', difficulty: 'medium',
    explanation: 'Charles Darwin (1809–1882) proposed the theory of evolution by natural selection in his landmark 1859 work "On the Origin of Species".'
  },
  {
    image: wp('Leonardo_self.jpg'),
    question: 'Who is this?',
    correct_answer: 'Leonardo da Vinci',
    incorrect_answers: ['Michelangelo', 'Raphael', 'Donatello'],
    category: 'Famous Faces',
    type: 'multiple', difficulty: 'medium',
    explanation: 'Leonardo da Vinci (1452–1519) was a Renaissance polymath — painter, sculptor, architect, musician, scientist, and inventor. He painted the Mona Lisa.'
  },
  {
    image: wp('Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project.jpg'),
    question: 'Who is this?',
    correct_answer: 'Vincent van Gogh',
    incorrect_answers: ['Paul Gauguin', 'Claude Monet', 'Pablo Picasso'],
    category: 'Famous Faces',
    type: 'multiple', difficulty: 'medium',
    explanation: 'Vincent van Gogh (1853–1890) created over 2,100 artworks including "The Starry Night". He sold only one painting during his lifetime.'
  },
  {
    image: wp('Abraham_Lincoln_O-77_matte_collodion_print.jpg'),
    question: 'Who is this?',
    correct_answer: 'Abraham Lincoln',
    incorrect_answers: ['Ulysses S. Grant', 'George Washington', 'Theodore Roosevelt'],
    category: 'Famous Faces',
    type: 'multiple', difficulty: 'easy',
    explanation: 'Abraham Lincoln (1809–1865) was the 16th US President, led the country through the Civil War, and abolished slavery with the Emancipation Proclamation.'
  },
  {
    image: wp('Nelson_Mandela_1994.jpg'),
    question: 'Who is this?',
    correct_answer: 'Nelson Mandela',
    incorrect_answers: ['Desmond Tutu', 'Robert Mugabe', 'Kofi Annan'],
    category: 'Famous Faces',
    type: 'multiple', difficulty: 'easy',
    explanation: 'Nelson Mandela spent 27 years in prison before becoming South Africa\'s first Black president in 1994 and winning the Nobel Peace Prize.'
  },
  {
    image: wp('Stephen_Hawking.StarChild.jpg'),
    question: 'Who is this?',
    correct_answer: 'Stephen Hawking',
    incorrect_answers: ['Richard Feynman', 'Carl Sagan', 'Neil deGrasse Tyson'],
    category: 'Famous Faces',
    type: 'multiple', difficulty: 'easy',
    explanation: 'Stephen Hawking (1942–2018) was a theoretical physicist famous for his work on black holes and "A Brief History of Time". He lived with ALS for over 50 years.'
  },
  {
    image: wp('President_Barack_Obama.jpg'),
    question: 'Who is this?',
    correct_answer: 'Barack Obama',
    incorrect_answers: ['Joe Biden', 'Bill Clinton', 'George W. Bush'],
    category: 'Famous Faces',
    type: 'multiple', difficulty: 'easy',
    explanation: 'Barack Obama was the 44th President of the United States (2009–2017), the first African American to hold the office, and won the Nobel Peace Prize in 2009.'
  },
  {
    image: wp('Nikola_Tesla_circa_1890.jpeg'),
    question: 'Who is this?',
    correct_answer: 'Nikola Tesla',
    incorrect_answers: ['Thomas Edison', 'Alexander Graham Bell', 'Guglielmo Marconi'],
    category: 'Famous Faces',
    type: 'multiple', difficulty: 'medium',
    explanation: 'Nikola Tesla (1856–1943) invented the AC electrical system, the Tesla coil, and contributed fundamentally to the design of the modern alternating current electricity supply system.'
  },
  {
    image: wp('Cleopatra_VII_coin_BM.jpg'),
    question: 'Which ancient ruler is depicted on this coin?',
    correct_answer: 'Cleopatra VII',
    incorrect_answers: ['Nefertiti', 'Hatshepsut', 'Boudicca'],
    category: 'Famous Faces',
    type: 'multiple', difficulty: 'hard',
    explanation: 'Cleopatra VII (69–30 BC) was the last active ruler of the Ptolemaic Kingdom of Egypt. She was known for her relationships with Julius Caesar and Mark Antony.'
  },
]

const FAMOUS_PLACES: ImageQuestion[] = [
  {
    image: wp('Tour_eiffel_at_sunrise_from_the_trocadero.jpg'),
    question: 'Where is this landmark?',
    correct_answer: 'Paris, France',
    incorrect_answers: ['London, England', 'Berlin, Germany', 'Madrid, Spain'],
    category: 'Famous Places',
    type: 'multiple', difficulty: 'easy',
    explanation: 'The Eiffel Tower was built in 1889 for the World\'s Fair and stands 330 metres tall. It was the world\'s tallest man-made structure for 41 years.'
  },
  {
    image: wp('Taj_Mahal_in_March_2004.jpg'),
    question: 'Where is this landmark?',
    correct_answer: 'Agra, India',
    incorrect_answers: ['Istanbul, Turkey', 'Tehran, Iran', 'Cairo, Egypt'],
    category: 'Famous Places',
    type: 'multiple', difficulty: 'easy',
    explanation: 'The Taj Mahal was built between 1631–1653 by Mughal emperor Shah Jahan as a mausoleum for his wife Mumtaz Mahal. It is a UNESCO World Heritage Site.'
  },
  {
    image: wp('Colosseum_in_Rome,_Italy_-_April_2007.jpg'),
    question: 'Where is this landmark?',
    correct_answer: 'Rome, Italy',
    incorrect_answers: ['Athens, Greece', 'Split, Croatia', 'Carthage, Tunisia'],
    category: 'Famous Places',
    type: 'multiple', difficulty: 'easy',
    explanation: 'The Colosseum, completed in 80 AD, is the largest ancient amphitheatre ever built, holding 50,000–80,000 spectators. It hosted gladiatorial contests and public spectacles.'
  },
  {
    image: wp('Machu_Picchu,_Peru.jpg'),
    question: 'Where is this landmark?',
    correct_answer: 'Cusco Region, Peru',
    incorrect_answers: ['Bolivia', 'Ecuador', 'Colombia'],
    category: 'Famous Places',
    type: 'multiple', difficulty: 'easy',
    explanation: 'Machu Picchu is a 15th-century Inca citadel set high in the Andes Mountains. It was built around 1450 and abandoned less than 100 years later, only "rediscovered" in 1911.'
  },
  {
    image: wp('Acropolis_of_Athens_01361.jpg'),
    question: 'Where is this landmark?',
    correct_answer: 'Athens, Greece',
    incorrect_answers: ['Rome, Italy', 'Istanbul, Turkey', 'Cairo, Egypt'],
    category: 'Famous Places',
    type: 'multiple', difficulty: 'medium',
    explanation: 'The Acropolis of Athens houses the Parthenon, built in the 5th century BC as a temple to the goddess Athena. It\'s one of the world\'s greatest monuments of ancient civilisation.'
  },
  {
    image: wp('Sydney_Opera_House_-_Dec_2008-2b.jpg'),
    question: 'Where is this landmark?',
    correct_answer: 'Sydney, Australia',
    incorrect_answers: ['Auckland, New Zealand', 'Melbourne, Australia', 'Cape Town, South Africa'],
    category: 'Famous Places',
    type: 'multiple', difficulty: 'easy',
    explanation: 'The Sydney Opera House opened in 1973 and is one of the 20th century\'s most distinctive buildings. Its "shells" house multiple performance venues. Designed by Jørn Utzon.'
  },
  {
    image: wp('Great_Wall_of_China_July_2006.jpg'),
    question: 'Where is this landmark?',
    correct_answer: 'China',
    incorrect_answers: ['Mongolia', 'Japan', 'South Korea'],
    category: 'Famous Places',
    type: 'multiple', difficulty: 'easy',
    explanation: 'The Great Wall of China was built across many dynasties starting in the 7th century BC. The most famous sections near Beijing date from the Ming Dynasty (1368–1644).'
  },
  {
    image: wp('Statue_of_Liberty_7.jpg'),
    question: 'Where is this landmark?',
    correct_answer: 'New York, USA',
    incorrect_answers: ['Washington D.C., USA', 'Paris, France', 'Philadelphia, USA'],
    category: 'Famous Places',
    type: 'multiple', difficulty: 'easy',
    explanation: 'The Statue of Liberty was a gift from France to the United States, dedicated in 1886. The full name is "Liberty Enlightening the World". It stands 93 metres tall including the base.'
  },
  {
    image: wp('Big_Ben_2023.jpg'),
    question: 'Where is this landmark?',
    correct_answer: 'London, England',
    incorrect_answers: ['Edinburgh, Scotland', 'Dublin, Ireland', 'Amsterdam, Netherlands'],
    category: 'Famous Places',
    type: 'multiple', difficulty: 'easy',
    explanation: 'Big Ben is the nickname for the Great Bell of the Westminster clock tower, officially named the Elizabeth Tower since 2012. The tower was completed in 1859.'
  },
  {
    image: wp('Chichen_Itza_3.jpg'),
    question: 'Where is this landmark?',
    correct_answer: 'Yucatán, Mexico',
    incorrect_answers: ['Guatemala', 'Honduras', 'Belize'],
    category: 'Famous Places',
    type: 'multiple', difficulty: 'medium',
    explanation: 'Chichen Itza was a major Maya city built between 400–1200 AD. The famous El Castillo pyramid is precisely aligned to cast serpent-shadow effects during equinoxes.'
  },
  {
    image: wp('Angkor_Wat_from_the_air.jpg'),
    question: 'Where is this landmark?',
    correct_answer: 'Siem Reap, Cambodia',
    incorrect_answers: ['Bangkok, Thailand', 'Hanoi, Vietnam', 'Yangon, Myanmar'],
    category: 'Famous Places',
    type: 'multiple', difficulty: 'hard',
    explanation: 'Angkor Wat is the world\'s largest religious monument, built in the 12th century for the Khmer Empire. It was originally a Hindu temple dedicated to Vishnu, later converted to Buddhism.'
  },
  {
    image: wp('Petra_Jordan_BW_21.JPG'),
    question: 'Where is this landmark?',
    correct_answer: 'Petra, Jordan',
    incorrect_answers: ['Luxor, Egypt', 'Palmyra, Syria', 'Persepolis, Iran'],
    category: 'Famous Places',
    type: 'multiple', difficulty: 'medium',
    explanation: 'Petra is a famous archaeological city known as the "Rose City" for its rose-coloured stone. It was the capital of the Nabataean Kingdom and dates to the 4th century BC.'
  },
]

export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function generateImageQuestions(amount: number, subtype: 'faces' | 'places' | 'mixed'): ImageQuestion[] {
  let pool: ImageQuestion[]
  if (subtype === 'faces') pool = FAMOUS_FACES
  else if (subtype === 'places') pool = FAMOUS_PLACES
  else pool = [...FAMOUS_FACES, ...FAMOUS_PLACES]
  return shuffleArray(pool).slice(0, Math.min(amount, pool.length))
}
