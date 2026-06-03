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
    category: 'Famous Faces', type: 'multiple', difficulty: 'easy',
    explanation: 'Albert Einstein (1879–1955) developed the theory of relativity and won the Nobel Prize in Physics in 1921. His formula E=mc² is the world\'s most famous equation.'
  },
  {
    image: wp('Mahatma-Gandhi,_studio,_1931.jpg'),
    question: 'Who is this?',
    correct_answer: 'Mahatma Gandhi',
    incorrect_answers: ['Jawaharlal Nehru', 'Nelson Mandela', 'Martin Luther King Jr.'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'easy',
    explanation: 'Mahatma Gandhi (1869–1948) led India\'s non-violent independence movement against British rule. His method of peaceful protest inspired civil rights movements worldwide.'
  },
  {
    image: wp('Marie_Curie_c1920.jpg'),
    question: 'Who is this?',
    correct_answer: 'Marie Curie',
    incorrect_answers: ['Rosalind Franklin', 'Florence Nightingale', 'Ada Lovelace'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'easy',
    explanation: 'Marie Curie (1867–1934) was the first woman to win a Nobel Prize, and the only person ever to win in two different sciences — Physics (1903) and Chemistry (1911).'
  },
  {
    image: wp('Charles_Darwin_seated_crop.jpg'),
    question: 'Who is this?',
    correct_answer: 'Charles Darwin',
    incorrect_answers: ['Gregor Mendel', 'Alfred Russel Wallace', 'Louis Pasteur'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'medium',
    explanation: 'Charles Darwin (1809–1882) proposed the theory of evolution by natural selection in his landmark 1859 work "On the Origin of Species", transforming our understanding of life on Earth.'
  },
  {
    image: wp('Leonardo_self.jpg'),
    question: 'Who is this?',
    correct_answer: 'Leonardo da Vinci',
    incorrect_answers: ['Michelangelo', 'Raphael', 'Donatello'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'medium',
    explanation: 'Leonardo da Vinci (1452–1519) was a Renaissance polymath — painter, sculptor, architect, scientist, and inventor. He painted the Mona Lisa and The Last Supper.'
  },
  {
    image: wp('Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project.jpg'),
    question: 'Who is this?',
    correct_answer: 'Vincent van Gogh',
    incorrect_answers: ['Paul Gauguin', 'Claude Monet', 'Pablo Picasso'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'medium',
    explanation: 'Vincent van Gogh (1853–1890) created over 2,100 artworks including "The Starry Night". He sold only one painting during his lifetime; his work now sells for hundreds of millions.'
  },
  {
    image: wp('Abraham_Lincoln_O-77_matte_collodion_print.jpg'),
    question: 'Who is this?',
    correct_answer: 'Abraham Lincoln',
    incorrect_answers: ['Ulysses S. Grant', 'George Washington', 'Theodore Roosevelt'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'easy',
    explanation: 'Abraham Lincoln (1809–1865) was the 16th US President. He led the country through the Civil War and abolished slavery with the Emancipation Proclamation in 1863.'
  },
  {
    image: wp('Nelson_Mandela_1994.jpg'),
    question: 'Who is this?',
    correct_answer: 'Nelson Mandela',
    incorrect_answers: ['Desmond Tutu', 'Robert Mugabe', 'Kofi Annan'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'easy',
    explanation: 'Nelson Mandela (1918–2013) spent 27 years in prison for opposing apartheid, then became South Africa\'s first democratically elected Black president in 1994. Nobel Peace Prize 1993.'
  },
  {
    image: wp('Stephen_Hawking.StarChild.jpg'),
    question: 'Who is this?',
    correct_answer: 'Stephen Hawking',
    incorrect_answers: ['Richard Feynman', 'Carl Sagan', 'Neil deGrasse Tyson'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'easy',
    explanation: 'Stephen Hawking (1942–2018) was a theoretical physicist famous for his work on black holes and "A Brief History of Time". He lived with motor neurone disease for over 50 years.'
  },
  {
    image: wp('President_Barack_Obama.jpg'),
    question: 'Who is this?',
    correct_answer: 'Barack Obama',
    incorrect_answers: ['Joe Biden', 'Bill Clinton', 'George W. Bush'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'easy',
    explanation: 'Barack Obama was the 44th US President (2009–2017) and the first African American to hold the office. He was awarded the Nobel Peace Prize in 2009.'
  },
  {
    image: wp('Nikola_Tesla_circa_1890.jpeg'),
    question: 'Who is this?',
    correct_answer: 'Nikola Tesla',
    incorrect_answers: ['Thomas Edison', 'Alexander Graham Bell', 'Guglielmo Marconi'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'medium',
    explanation: 'Nikola Tesla (1856–1943) invented the AC electrical system and the Tesla coil. His work on alternating current power laid the foundation for modern electrical infrastructure.'
  },
  {
    image: wp('Winston_Churchill_1941_photo_by_Yousuf_Karsh.jpg'),
    question: 'Who is this?',
    correct_answer: 'Winston Churchill',
    incorrect_answers: ['Franklin D. Roosevelt', 'Charles de Gaulle', 'Dwight Eisenhower'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'easy',
    explanation: 'Winston Churchill (1874–1965) served as British Prime Minister during WWII, famous for his defiant wartime speeches. He was also a Nobel Prize-winning author.'
  },
  {
    image: wp('Jacques-Louis_David_-_The_Emperor_Napoleon_in_His_Study_at_the_Tuileries_-_Google_Art_Project_2.jpg'),
    question: 'Who is depicted in this portrait?',
    correct_answer: 'Napoleon Bonaparte',
    incorrect_answers: ['Louis XIV', 'Frederick the Great', 'Duke of Wellington'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'medium',
    explanation: 'Napoleon Bonaparte (1769–1821) rose from Corsican obscurity to become Emperor of France. He reshaped Europe through military conquest and created the Napoleonic Code.'
  },
  {
    image: wp('CheHigh.jpg'),
    question: 'Who is this?',
    correct_answer: 'Che Guevara',
    incorrect_answers: ['Fidel Castro', 'Hugo Chavez', 'Salvador Allende'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'medium',
    explanation: 'Ernesto "Che" Guevara (1928–1967) was an Argentine Marxist revolutionary who played a key role in the Cuban Revolution. His face became one of the most iconic images of the 20th century.'
  },
  {
    image: wp('Frida_Kahlo,_by_Guillermo_Kahlo.jpg'),
    question: 'Who is this?',
    correct_answer: 'Frida Kahlo',
    incorrect_answers: ['Georgia O\'Keeffe', 'Tamara de Lempicka', 'Rosa Bonheur'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'medium',
    explanation: 'Frida Kahlo (1907–1954) was a Mexican painter known for her vivid self-portraits and works inspired by nature. She suffered a near-fatal bus accident at 18 and painted largely while bedridden.'
  },
  {
    image: wp('Martin_Luther_King_Jr_NYWTS.jpg'),
    question: 'Who is this?',
    correct_answer: 'Martin Luther King Jr.',
    incorrect_answers: ['Malcolm X', 'John Lewis', 'Jesse Jackson'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'easy',
    explanation: 'Martin Luther King Jr. (1929–1968) was the leader of the American civil rights movement. His "I Have a Dream" speech in 1963 became one of the most celebrated orations in history. Nobel Peace Prize 1964.'
  },
  {
    image: wp('Elvis_Presley_1970.jpg'),
    question: 'Who is this?',
    correct_answer: 'Elvis Presley',
    incorrect_answers: ['Chuck Berry', 'Jerry Lee Lewis', 'Buddy Holly'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'easy',
    explanation: 'Elvis Presley (1935–1977), "The King of Rock and Roll", sold over one billion records worldwide. His fusion of gospel, blues, and country music transformed popular music in the 1950s.'
  },
  {
    image: wp('Muhammad_Ali_NYWTS.jpg'),
    question: 'Who is this?',
    correct_answer: 'Muhammad Ali',
    incorrect_answers: ['Joe Frazier', 'George Foreman', 'Sonny Liston'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'easy',
    explanation: 'Muhammad Ali (1942–2016) is widely regarded as the greatest heavyweight boxer of all time. He was also renowned for his civil rights activism and refusal to be drafted for the Vietnam War.'
  },
  {
    image: wp('GodfreyKneller-IsaacNewton-1689.jpg'),
    question: 'Who is this?',
    correct_answer: 'Isaac Newton',
    incorrect_answers: ['Gottfried Leibniz', 'Robert Hooke', 'Edmund Halley'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'medium',
    explanation: 'Isaac Newton (1643–1727) formulated the laws of motion and universal gravitation, invented calculus, and built the first reflecting telescope. Often considered the greatest scientist of all time.'
  },
  {
    image: wp('Beethoven.jpg'),
    question: 'Who is this composer?',
    correct_answer: 'Ludwig van Beethoven',
    incorrect_answers: ['Wolfgang Amadeus Mozart', 'Franz Schubert', 'Joseph Haydn'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'medium',
    explanation: 'Ludwig van Beethoven (1770–1827) composed some of the most celebrated music ever written, including his 9th Symphony — which he wrote while completely deaf.'
  },
  {
    image: wp('Wolfgang-amadeus-mozart_1.jpg'),
    question: 'Who is this composer?',
    correct_answer: 'Wolfgang Amadeus Mozart',
    incorrect_answers: ['Ludwig van Beethoven', 'Franz Liszt', 'Johann Sebastian Bach'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'medium',
    explanation: 'Wolfgang Amadeus Mozart (1756–1791) was a child prodigy who composed over 800 works in his short 35-year life, including symphonies, operas, chamber music, and concertos.'
  },
  {
    image: wp('Marilyn_Monroe_in_1952.jpg'),
    question: 'Who is this?',
    correct_answer: 'Marilyn Monroe',
    incorrect_answers: ['Audrey Hepburn', 'Grace Kelly', 'Elizabeth Taylor'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'easy',
    explanation: 'Marilyn Monroe (1926–1962) was an American actress, model, and singer who became one of the most iconic figures of the 20th century. Born Norma Jeane, she starred in films like Some Like It Hot.'
  },
  {
    image: wp('Cleopatra_VII_coin_BM.jpg'),
    question: 'Which ancient ruler is depicted on this coin?',
    correct_answer: 'Cleopatra VII',
    incorrect_answers: ['Nefertiti', 'Hatshepsut', 'Boudicca'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'hard',
    explanation: 'Cleopatra VII (69–30 BC) was the last active ruler of the Ptolemaic Kingdom of Egypt. She was known for her intellect, political acumen, and relationships with Julius Caesar and Mark Antony.'
  },
]

const FAMOUS_PLACES: ImageQuestion[] = [
  {
    image: wp('Tour_eiffel_at_sunrise_from_the_trocadero.jpg'),
    question: 'Where is this landmark?',
    correct_answer: 'Paris, France',
    incorrect_answers: ['London, England', 'Berlin, Germany', 'Madrid, Spain'],
    category: 'Famous Places', type: 'multiple', difficulty: 'easy',
    explanation: 'The Eiffel Tower was built in 1889 for the World\'s Fair and stands 330 metres tall. It was the world\'s tallest man-made structure for 41 years and now attracts ~7 million visitors annually.'
  },
  {
    image: wp('Taj_Mahal_in_March_2004.jpg'),
    question: 'Where is this landmark?',
    correct_answer: 'Agra, India',
    incorrect_answers: ['Istanbul, Turkey', 'Tehran, Iran', 'Cairo, Egypt'],
    category: 'Famous Places', type: 'multiple', difficulty: 'easy',
    explanation: 'The Taj Mahal was built 1631–1653 by Mughal emperor Shah Jahan as a mausoleum for his wife Mumtaz Mahal. Over 20,000 workers spent 22 years building it. A UNESCO World Heritage Site.'
  },
  {
    image: wp('Colosseum_in_Rome,_Italy_-_April_2007.jpg'),
    question: 'Where is this landmark?',
    correct_answer: 'Rome, Italy',
    incorrect_answers: ['Athens, Greece', 'Split, Croatia', 'Carthage, Tunisia'],
    category: 'Famous Places', type: 'multiple', difficulty: 'easy',
    explanation: 'The Colosseum, completed in 80 AD, is the largest ancient amphitheatre ever built, holding 50,000–80,000 spectators. It hosted gladiatorial contests, animal hunts, and public executions.'
  },
  {
    image: wp('Machu_Picchu,_Peru.jpg'),
    question: 'Where is this landmark?',
    correct_answer: 'Cusco Region, Peru',
    incorrect_answers: ['Bolivia', 'Ecuador', 'Colombia'],
    category: 'Famous Places', type: 'multiple', difficulty: 'easy',
    explanation: 'Machu Picchu is a 15th-century Inca citadel set at 2,430m in the Andes. Built around 1450 and abandoned less than 100 years later, it was unknown to the outside world until 1911.'
  },
  {
    image: wp('Acropolis_of_Athens_01361.jpg'),
    question: 'Where is this landmark?',
    correct_answer: 'Athens, Greece',
    incorrect_answers: ['Rome, Italy', 'Istanbul, Turkey', 'Cairo, Egypt'],
    category: 'Famous Places', type: 'multiple', difficulty: 'medium',
    explanation: 'The Acropolis of Athens houses the Parthenon, built in the 5th century BC as a temple to Athena. The word "acropolis" means "high city" in Greek — it was the sacred heart of ancient Athens.'
  },
  {
    image: wp('Sydney_Opera_House_-_Dec_2008-2b.jpg'),
    question: 'Where is this landmark?',
    correct_answer: 'Sydney, Australia',
    incorrect_answers: ['Auckland, New Zealand', 'Melbourne, Australia', 'Cape Town, South Africa'],
    category: 'Famous Places', type: 'multiple', difficulty: 'easy',
    explanation: 'The Sydney Opera House opened in 1973 and is one of the 20th century\'s most distinctive buildings. Its "sail" roofs house multiple performance venues. Designed by Danish architect Jørn Utzon.'
  },
  {
    image: wp('Great_Wall_of_China_July_2006.jpg'),
    question: 'Where is this landmark?',
    correct_answer: 'China',
    incorrect_answers: ['Mongolia', 'Japan', 'South Korea'],
    category: 'Famous Places', type: 'multiple', difficulty: 'easy',
    explanation: 'The Great Wall of China stretches over 21,000 km. Built across many dynasties from the 7th century BC, the most famous sections near Beijing date from the Ming Dynasty (1368–1644).'
  },
  {
    image: wp('Statue_of_Liberty_7.jpg'),
    question: 'Where is this landmark?',
    correct_answer: 'New York, USA',
    incorrect_answers: ['Washington D.C., USA', 'Paris, France', 'Philadelphia, USA'],
    category: 'Famous Places', type: 'multiple', difficulty: 'easy',
    explanation: 'The Statue of Liberty was a gift from France, dedicated in 1886. The full name is "Liberty Enlightening the World." It stands 93m tall including the base. Sculptor: Frédéric Auguste Bartholdi.'
  },
  {
    image: wp('Big_Ben_2023.jpg'),
    question: 'Where is this landmark?',
    correct_answer: 'London, England',
    incorrect_answers: ['Edinburgh, Scotland', 'Dublin, Ireland', 'Amsterdam, Netherlands'],
    category: 'Famous Places', type: 'multiple', difficulty: 'easy',
    explanation: 'Big Ben is the nickname for the Great Bell of the Westminster clock tower, officially renamed the Elizabeth Tower in 2012. The tower was completed in 1859 and is one of the world\'s most famous landmarks.'
  },
  {
    image: wp('Chichen_Itza_3.jpg'),
    question: 'Where is this landmark?',
    correct_answer: 'Yucatán, Mexico',
    incorrect_answers: ['Guatemala', 'Honduras', 'Belize'],
    category: 'Famous Places', type: 'multiple', difficulty: 'medium',
    explanation: 'Chichen Itza was a major Maya city built between 400–1200 AD. The El Castillo pyramid is precisely aligned so that sunlight creates a snake-shadow effect on the equinoxes.'
  },
  {
    image: wp('Angkor_Wat_from_the_air.jpg'),
    question: 'Where is this landmark?',
    correct_answer: 'Siem Reap, Cambodia',
    incorrect_answers: ['Bangkok, Thailand', 'Hanoi, Vietnam', 'Yangon, Myanmar'],
    category: 'Famous Places', type: 'multiple', difficulty: 'hard',
    explanation: 'Angkor Wat is the world\'s largest religious monument, built in the 12th century for the Khmer Empire. Originally a Hindu temple for Vishnu, it was converted to Buddhism in the late 13th century.'
  },
  {
    image: wp('Petra_Jordan_BW_21.JPG'),
    question: 'Where is this landmark?',
    correct_answer: 'Petra, Jordan',
    incorrect_answers: ['Luxor, Egypt', 'Palmyra, Syria', 'Persepolis, Iran'],
    category: 'Famous Places', type: 'multiple', difficulty: 'medium',
    explanation: 'Petra is the "Rose City" of Jordan, carved into rose-coloured stone by the Nabataeans around the 4th century BC. It was largely unknown to the Western world until 1812.'
  },
  {
    image: wp('All_Gizah_Pyramids.jpg'),
    question: 'Where are these ancient monuments?',
    correct_answer: 'Giza, Egypt',
    incorrect_answers: ['Luxor, Egypt', 'Khartoum, Sudan', 'Tripoli, Libya'],
    category: 'Famous Places', type: 'multiple', difficulty: 'easy',
    explanation: 'The Pyramids of Giza include the Great Pyramid of Khufu, the only surviving Wonder of the Ancient World. Built around 2560 BC, the Great Pyramid was the world\'s tallest structure for 3,800 years.'
  },
  {
    image: wp('Sagrada_Familia_01.jpg'),
    question: 'Where is this landmark?',
    correct_answer: 'Barcelona, Spain',
    incorrect_answers: ['Rome, Italy', 'Paris, France', 'Vienna, Austria'],
    category: 'Famous Places', type: 'multiple', difficulty: 'medium',
    explanation: 'The Sagrada Família is Antoni Gaudí\'s masterpiece basilica in Barcelona. Construction began in 1882 and is still ongoing — it is expected to be completed around 2026. A UNESCO World Heritage Site since 1984.'
  },
  {
    image: wp('Neuschwanstein_castle_northwest_seen_from_Marienbrücke.jpg'),
    question: 'Where is this fairy-tale castle?',
    correct_answer: 'Bavaria, Germany',
    incorrect_answers: ['Salzburg, Austria', 'Prague, Czech Republic', 'Innsbruck, Austria'],
    category: 'Famous Places', type: 'multiple', difficulty: 'medium',
    explanation: 'Neuschwanstein Castle was built by King Ludwig II of Bavaria, begun in 1869. It inspired Walt Disney\'s Sleeping Beauty Castle. Ludwig II died before it was completed and it was opened to the public just weeks later.'
  },
  {
    image: wp('Stonehenge,_Condado_de_Wiltshire,_Inglaterra,_2014-08-12,_DD_09.JPG'),
    question: 'Where is this prehistoric monument?',
    correct_answer: 'Wiltshire, England',
    incorrect_answers: ['Brittany, France', 'County Kerry, Ireland', 'Orkney, Scotland'],
    category: 'Famous Places', type: 'multiple', difficulty: 'easy',
    explanation: 'Stonehenge on Salisbury Plain was built in several stages from around 3000 BC. The giant sarsen stones weigh up to 25 tonnes and were transported from 25 miles away — how remains a mystery.'
  },
  {
    image: wp('Cristo_Redentor_-_Rio_de_Janeiro.jpg'),
    question: 'Where is this statue?',
    correct_answer: 'Rio de Janeiro, Brazil',
    incorrect_answers: ['Buenos Aires, Argentina', 'Lima, Peru', 'São Paulo, Brazil'],
    category: 'Famous Places', type: 'multiple', difficulty: 'easy',
    explanation: 'Christ the Redeemer stands 30m tall (38m with the pedestal) atop Corcovado Mountain overlooking Rio. Completed in 1931, it is one of the New Seven Wonders of the World.'
  },
  {
    image: wp('Hagia_Sophia_from_the_Bosphorus_2.JPG'),
    question: 'Where is this landmark?',
    correct_answer: 'Istanbul, Turkey',
    incorrect_answers: ['Cairo, Egypt', 'Tehran, Iran', 'Athens, Greece'],
    category: 'Famous Places', type: 'multiple', difficulty: 'medium',
    explanation: 'Hagia Sophia was built in 537 AD as a Christian cathedral, converted to a mosque in 1453, became a museum in 1934, and was reconverted to a mosque in 2020. Its dome was the world\'s largest for nearly 1,000 years.'
  },
  {
    image: wp('GoldenGateBridge-001.jpg'),
    question: 'Where is this bridge?',
    correct_answer: 'San Francisco, USA',
    incorrect_answers: ['Sydney, Australia', 'New York, USA', 'Vancouver, Canada'],
    category: 'Famous Places', type: 'multiple', difficulty: 'easy',
    explanation: 'The Golden Gate Bridge opened in 1937 and spans 2.7 km across the Golden Gate strait. The distinctive "International Orange" colour was chosen to make it visible in fog — the original plan was grey.'
  },
  {
    image: wp('Leaning_tower_of_pisa_2.jpg'),
    question: 'Where is this landmark?',
    correct_answer: 'Pisa, Italy',
    incorrect_answers: ['Florence, Italy', 'Bologna, Italy', 'Siena, Italy'],
    category: 'Famous Places', type: 'multiple', difficulty: 'easy',
    explanation: 'The Leaning Tower of Pisa began tilting during construction in 1173 due to soft ground. It took 199 years to build. Galileo allegedly used it to demonstrate that objects of different masses fall at the same speed.'
  },
]

const FAMOUS_ARTWORKS: ImageQuestion[] = [
  {
    image: wp('Mona_Lisa,_by_Leonardo_da_Vinci,_from_C2RMF_retouched.jpg'),
    question: 'What is this painting?',
    correct_answer: 'Mona Lisa',
    incorrect_answers: ['Lady with an Ermine', 'Portrait of Ginevra de\' Benci', 'La Belle Ferronnière'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'easy',
    explanation: 'The Mona Lisa (c.1503–1519) by Leonardo da Vinci is the world\'s most famous painting. The subject is believed to be Lisa Gherardini. It hangs in the Louvre, Paris, behind bulletproof glass.'
  },
  {
    image: wp('Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg'),
    question: 'What is this painting?',
    correct_answer: 'The Starry Night',
    incorrect_answers: ['Wheat Field with Crows', 'Café Terrace at Night', 'The Night Café'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'easy',
    explanation: 'The Starry Night (1889) by Vincent van Gogh was painted from his room at Saint-Paul-de-Mausole asylum. Despite being one of the most recognised paintings in the world, van Gogh considered it a failure.'
  },
  {
    image: wp('The_Scream_by_Edvard_Munch,_1893_-_Nasjonalgalleriet.png'),
    question: 'What is this painting?',
    correct_answer: 'The Scream',
    incorrect_answers: ['Anxiety', 'Evening on Karl Johan Street', 'The Dance of Life'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'easy',
    explanation: 'The Scream (1893) by Edvard Munch is one of the most recognised images in Western art. Munch was inspired by a real moment of anxiety — he wrote: "I sensed an infinite scream passing through nature."'
  },
  {
    image: wp('Girl_with_a_Pearl_Earring.jpg'),
    question: 'What is this painting?',
    correct_answer: 'Girl with a Pearl Earring',
    incorrect_answers: ['Young Woman with a Water Pitcher', 'Woman Reading a Letter', 'The Milkmaid'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'easy',
    explanation: 'Girl with a Pearl Earring (c.1665) by Johannes Vermeer is known as the "Mona Lisa of the North." The identity of the subject remains unknown. It hangs in the Mauritshuis museum in The Hague.'
  },
  {
    image: wp('Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg'),
    question: 'What is this painting?',
    correct_answer: 'The Birth of Venus',
    incorrect_answers: ['Primavera', 'Pallas and the Centaur', 'Mars and Venus'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'easy',
    explanation: 'The Birth of Venus (c.1484–1486) by Sandro Botticelli depicts the goddess Venus emerging from the sea. It was one of the first large-scale non-religious works of the Renaissance and hangs in the Uffizi Gallery, Florence.'
  },
  {
    image: wp('Great_Wave_off_Kanagawa2.jpg'),
    question: 'What is this woodblock print?',
    correct_answer: 'The Great Wave off Kanagawa',
    incorrect_answers: ['Red Fuji', 'Fine Wind, Clear Morning', 'Sudden Shower over Shin-Ohashi Bridge'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'medium',
    explanation: 'The Great Wave off Kanagawa (c.1831) by Katsushika Hokusai is probably the most internationally recognisable Japanese artwork. Mount Fuji is visible in the background beneath the wave\'s claw-like foam.'
  },
  {
    image: wp('Michelangelo_-_Creation_of_Adam_(cropped).jpg'),
    question: 'What is this famous fresco?',
    correct_answer: 'The Creation of Adam',
    incorrect_answers: ['The Last Judgement', 'The Expulsion from the Garden', 'The Flood'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'easy',
    explanation: 'The Creation of Adam (c.1512) is part of Michelangelo\'s Sistine Chapel ceiling, commissioned by Pope Julius II. The near-touching hands of God and Adam is one of the most replicated images in history.'
  },
  {
    image: wp('Claude_Monet_-_Water_Lilies_-_1906,_Ryerson.jpg'),
    question: 'Who painted this series of water lily paintings?',
    correct_answer: 'Claude Monet',
    incorrect_answers: ['Pierre-Auguste Renoir', 'Camille Pissarro', 'Alfred Sisley'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'medium',
    explanation: 'Claude Monet\'s Water Lilies series consists of approximately 250 oil paintings depicting his flower garden at Giverny. He painted them in the last 30 years of his life, mostly while suffering from cataracts.'
  },
  {
    image: wp('The_Persistence_of_Memory.jpg'),
    question: 'What is this painting?',
    correct_answer: 'The Persistence of Memory',
    incorrect_answers: ['The Elephants', 'Dream Caused by the Flight of a Bee', 'Swans Reflecting Elephants'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'medium',
    explanation: 'The Persistence of Memory (1931) by Salvador Dalí is a Surrealist masterpiece featuring melting pocket watches. It was painted in just two hours. The "soft watches" were inspired by melting Camembert cheese.'
  },
  {
    image: wp('Grant_DeVolson_Wood_-_American_Gothic.jpg'),
    question: 'What is this painting?',
    correct_answer: 'American Gothic',
    incorrect_answers: ['Christina\'s World', 'Nighthawks', 'Automat'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'medium',
    explanation: 'American Gothic (1930) by Grant Wood depicts a farmer and his daughter (often misidentified as husband and wife) before a Gothic-style house in Iowa. It is one of the most famous and parodied American paintings.'
  },
  {
    image: wp('Van_Gogh_-_Sunflowers_-_VGM_F458.jpg'),
    question: 'What is this painting?',
    correct_answer: 'Sunflowers',
    incorrect_answers: ['Irises', 'Almond Blossom', 'Wheat Field with Cypresses'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'easy',
    explanation: 'Sunflowers (1888) is one of a series of paintings Van Gogh made to decorate his "Yellow House" in Arles for his friend Paul Gauguin\'s visit. In 1987, one version sold for $39.9 million, then a world record.'
  },
  {
    image: wp('Las_Meninas_01.jpg'),
    question: 'What is this painting?',
    correct_answer: 'Las Meninas',
    incorrect_answers: ['The Rokeby Venus', 'The Surrender of Breda', 'Pope Innocent X'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'hard',
    explanation: 'Las Meninas (1656) by Diego Velázquez is considered one of the most complex and celebrated paintings in Western art. The artist himself appears in it; the painting\'s true subject — who it depicts — has been debated for centuries.'
  },
  {
    image: wp('DaVinci_Last_Supper_high_res.jpg'),
    question: 'What is this painting?',
    correct_answer: 'The Last Supper',
    incorrect_answers: ['The Wedding at Cana', 'Christ Washing the Feet of the Apostles', 'The Transfiguration'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'easy',
    explanation: 'The Last Supper (1495–1498) by Leonardo da Vinci depicts Jesus announcing that one of his apostles will betray him. It is painted on the wall of the Santa Maria delle Grazie refectory in Milan.'
  },
  {
    image: wp('A_Sunday_on_La_Grande_Jatte,_Georges_Seurat,_1884-86.png'),
    question: 'What is this painting?',
    correct_answer: 'A Sunday Afternoon on the Island of La Grande Jatte',
    incorrect_answers: ['Bathers at Asnières', 'The Circus', 'Le Chahut'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'hard',
    explanation: 'A Sunday Afternoon on the Island of La Grande Jatte (1886) by Georges Seurat pioneered Pointillism — using thousands of tiny coloured dots rather than brushstrokes. Seurat spent two years on this single painting.'
  },
  {
    image: wp('Whistlers_Mother_high_res.jpg'),
    question: 'What is this painting?',
    correct_answer: 'Whistler\'s Mother',
    incorrect_answers: ['Woman Ironing', 'The Artist\'s Mother', 'Portrait of My Mother'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'medium',
    explanation: 'Whistler\'s Mother (1871), officially "Arrangement in Grey and Black No.1", by James Abbott McNeill Whistler, is one of the most famous American paintings. Whistler\'s original model cancelled, so his mother stepped in.'
  },
  {
    image: wp('Guernica_by_Picasso.jpg'),
    question: 'What is this painting?',
    correct_answer: 'Guernica',
    incorrect_answers: ['Les Demoiselles d\'Avignon', 'The Weeping Woman', 'Girl Before a Mirror'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'medium',
    explanation: 'Guernica (1937) by Pablo Picasso is a powerful anti-war statement depicting the Nazi bombing of the Basque town of Guernica during the Spanish Civil War. Painted in just over a month, it is now in the Reina Sofía museum, Madrid.'
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

export function generateImageQuestions(
  amount: number,
  subtype: 'faces' | 'places' | 'artworks' | 'mixed'
): ImageQuestion[] {
  let pool: ImageQuestion[]
  if (subtype === 'faces') pool = FAMOUS_FACES
  else if (subtype === 'places') pool = FAMOUS_PLACES
  else if (subtype === 'artworks') pool = FAMOUS_ARTWORKS
  else pool = [...FAMOUS_FACES, ...FAMOUS_PLACES, ...FAMOUS_ARTWORKS]
  return shuffleArray(pool).slice(0, Math.min(amount, pool.length))
}
