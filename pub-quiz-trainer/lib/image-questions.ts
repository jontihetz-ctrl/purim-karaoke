import type { TriviaQuestion } from '@/types'

function wp(file: string): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=320`
}

interface ImageQuestion extends TriviaQuestion {
  image: string
  explanation: string
}

const FAMOUS_FACES: ImageQuestion[] = [
  // ── SCIENCE ─────────────────────────────────────────────────────────────────
  {
    image: wp('Albert_Einstein_Head.jpg'),
    question: 'Who is this?',
    correct_answer: 'Albert Einstein',
    incorrect_answers: ['Isaac Newton', 'Nikola Tesla', 'Charles Darwin'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'easy',
    explanation: 'Albert Einstein (1879–1955) developed the theory of relativity and won the Nobel Prize in Physics in 1921. His formula E=mc² is the world\'s most famous equation.'
  },
  {
    image: wp('Marie_Curie_c1920.jpg'),
    question: 'Who is this?',
    correct_answer: 'Marie Curie',
    incorrect_answers: ['Rosalind Franklin', 'Florence Nightingale', 'Ada Lovelace'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'medium',
    explanation: 'Marie Curie (1867–1934) was the first woman to win a Nobel Prize, and the only person ever to win in two different sciences — Physics (1903) and Chemistry (1911).'
  },
  {
    image: wp('Charles_Darwin_seated_crop.jpg'),
    question: 'Who is this?',
    correct_answer: 'Charles Darwin',
    incorrect_answers: ['Gregor Mendel', 'Alfred Russel Wallace', 'Louis Pasteur'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'medium',
    explanation: 'Charles Darwin (1809–1882) proposed the theory of evolution by natural selection in "On the Origin of Species" (1859), transforming our understanding of life on Earth.'
  },
  {
    image: wp('Nikola_Tesla_3.jpg'),
    question: 'Who is this?',
    correct_answer: 'Nikola Tesla',
    incorrect_answers: ['Thomas Edison', 'Alexander Graham Bell', 'Guglielmo Marconi'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'medium',
    explanation: 'Nikola Tesla (1856–1943) invented the AC electrical system and the Tesla coil. His work on alternating current laid the foundation for modern electrical infrastructure.'
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
    image: wp('Stephen_Hawking.StarChild.jpg'),
    question: 'Who is this?',
    correct_answer: 'Stephen Hawking',
    incorrect_answers: ['Richard Feynman', 'Carl Sagan', 'Neil deGrasse Tyson'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'easy',
    explanation: 'Stephen Hawking (1942–2018) was a theoretical physicist famous for his work on black holes and "A Brief History of Time". He lived with motor neurone disease for over 50 years.'
  },
  {
    image: wp('Richard_Feynman_Nobel.jpg'),
    question: 'Who is this Nobel-winning physicist?',
    correct_answer: 'Richard Feynman',
    incorrect_answers: ['Murray Gell-Mann', 'Enrico Fermi', 'Paul Dirac'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'hard',
    explanation: 'Richard Feynman (1918–1988) won the 1965 Nobel Prize in Physics for quantum electrodynamics. He also played a key role in the Manhattan Project and the Challenger disaster investigation.'
  },
  {
    image: wp('Alan_Turing_Aged_16.jpg'),
    question: 'Who is this mathematician and codebreaker?',
    correct_answer: 'Alan Turing',
    incorrect_answers: ['John von Neumann', 'Claude Shannon', 'Norbert Wiener'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'hard',
    explanation: 'Alan Turing (1912–1954) broke Nazi Germany\'s Enigma code at Bletchley Park, arguably shortening WWII by two years. He is also considered the father of modern computer science and AI.'
  },
  {
    image: wp('Florence_Nightingale_CDV_by_Henry_Hering_NPG_x82368.jpg'),
    question: 'Who is this?',
    correct_answer: 'Florence Nightingale',
    incorrect_answers: ['Mary Seacole', 'Edith Cavell', 'Clara Barton'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'medium',
    explanation: 'Florence Nightingale (1820–1910) revolutionised nursing during the Crimean War, dramatically cutting mortality rates through sanitation. She is considered the founder of modern nursing.'
  },

  // ── POLITICS & ACTIVISM ─────────────────────────────────────────────────────
  {
    image: wp('Mahatma-Gandhi,_studio,_1931.jpg'),
    question: 'Who is this?',
    correct_answer: 'Mahatma Gandhi',
    incorrect_answers: ['Jawaharlal Nehru', 'Nelson Mandela', 'Martin Luther King Jr.'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'easy',
    explanation: 'Mahatma Gandhi (1869–1948) led India\'s non-violent independence movement against British rule. His method of peaceful protest inspired civil rights movements worldwide.'
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
    image: wp('Abraham_Lincoln_O-77_matte_collodion_print.jpg'),
    question: 'Who is this?',
    correct_answer: 'Abraham Lincoln',
    incorrect_answers: ['Ulysses S. Grant', 'George Washington', 'Theodore Roosevelt'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'easy',
    explanation: 'Abraham Lincoln (1809–1865) was the 16th US President. He led the country through the Civil War and abolished slavery with the Emancipation Proclamation in 1863.'
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
    image: wp('Winston_Churchill_1941_photo_by_Yousuf_Karsh.jpg'),
    question: 'Who is this?',
    correct_answer: 'Winston Churchill',
    incorrect_answers: ['Franklin D. Roosevelt', 'Charles de Gaulle', 'Dwight Eisenhower'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'easy',
    explanation: 'Winston Churchill (1874–1965) served as British Prime Minister during WWII, famous for his defiant wartime speeches. He was also a Nobel Prize-winning author.'
  },
  {
    image: wp('Martin_Luther_King_Jr_NYWTS.jpg'),
    question: 'Who is this?',
    correct_answer: 'Martin Luther King Jr.',
    incorrect_answers: ['Malcolm X', 'John Lewis', 'Jesse Jackson'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'easy',
    explanation: 'Martin Luther King Jr. (1929–1968) led the American civil rights movement. His "I Have a Dream" speech in 1963 became one of history\'s most celebrated orations. Nobel Peace Prize 1964.'
  },
  {
    image: wp('Jacques-Louis_David_-_The_Emperor_Napoleon_in_His_Study_at_the_Tuileries_-_Google_Art_Project_2.jpg'),
    question: 'Who is depicted in this portrait?',
    correct_answer: 'Napoleon Bonaparte',
    incorrect_answers: ['Louis XIV', 'Frederick the Great', 'Duke of Wellington'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'medium',
    explanation: 'Napoleon Bonaparte (1769–1821) rose from Corsican obscurity to become Emperor of France. He reshaped Europe through military conquest and created the Napoleonic Code of law.'
  },
  {
    image: wp('Margaret_Thatcher.png'),
    question: 'Who is this?',
    correct_answer: 'Margaret Thatcher',
    incorrect_answers: ['Indira Gandhi', 'Golda Meir', 'Angela Merkel'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'medium',
    explanation: 'Margaret Thatcher (1925–2013) was UK Prime Minister 1979–1990, the first woman to hold the role. Known as "The Iron Lady", her free-market economic policies became known as Thatcherism.'
  },
  {
    image: wp('Face_detail,_Mao_Zedong_with_cap_(cropped).jpg'),
    question: 'Who is this?',
    correct_answer: 'Mao Zedong',
    incorrect_answers: ['Zhou Enlai', 'Deng Xiaoping', 'Chiang Kai-shek'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'medium',
    explanation: 'Mao Zedong (1893–1976) founded the People\'s Republic of China in 1949 and served as its leader until his death. His Cultural Revolution (1966–1976) caused enormous social upheaval.'
  },
  {
    image: wp('Fidel_Castro_-_MATS_Terminal_Washington_1959.jpg'),
    question: 'Who is this?',
    correct_answer: 'Fidel Castro',
    incorrect_answers: ['Che Guevara', 'Hugo Chavez', 'Raúl Castro'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'medium',
    explanation: 'Fidel Castro (1926–2016) led Cuba as Prime Minister and President for nearly 50 years after the 1959 revolution. He survived over 600 assassination attempts, many by the CIA.'
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
    image: wp('Rosa_Parks_1955_(cropped).jpg'),
    question: 'Who is this civil rights activist?',
    correct_answer: 'Rosa Parks',
    incorrect_answers: ['Coretta Scott King', 'Claudette Colvin', 'Dorothy Height'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'medium',
    explanation: 'Rosa Parks (1913–2005) sparked the Montgomery Bus Boycott in 1955 by refusing to give up her seat to a white passenger. She became an iconic figure of the American civil rights movement.'
  },
  {
    image: wp('Emmeline_Pankhurst.jpg'),
    question: 'Who is this suffragette leader?',
    correct_answer: 'Emmeline Pankhurst',
    incorrect_answers: ['Millicent Fawcett', 'Emily Wilding Davison', 'Sylvia Pankhurst'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'hard',
    explanation: 'Emmeline Pankhurst (1858–1928) founded the Women\'s Social and Political Union in 1903, leading the militant campaign for women\'s suffrage in Britain. Women over 30 gained the vote in 1918.'
  },
  {
    image: wp('Mother_Teresa_1.jpg'),
    question: 'Who is this?',
    correct_answer: 'Mother Teresa',
    incorrect_answers: ['Indira Gandhi', 'Dorothy Day', 'Simone Weil'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'easy',
    explanation: 'Mother Teresa (1910–1997) founded the Missionaries of Charity in Kolkata, dedicating her life to serving the poorest of the poor. She won the Nobel Peace Prize in 1979 and was canonised in 2016.'
  },
  {
    image: wp('Cleopatra_VII_coin_BM.jpg'),
    question: 'Which ancient ruler is depicted on this coin?',
    correct_answer: 'Cleopatra VII',
    incorrect_answers: ['Nefertiti', 'Hatshepsut', 'Boudicca'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'hard',
    explanation: 'Cleopatra VII (69–30 BC) was the last active ruler of the Ptolemaic Kingdom of Egypt, known for her relationships with Julius Caesar and Mark Antony.'
  },

  // ── SPORT ───────────────────────────────────────────────────────────────────
  {
    image: wp('Pele_1970.jpg'),
    question: 'Who is this footballer?',
    correct_answer: 'Pelé',
    incorrect_answers: ['Garrincha', 'Ronaldo', 'Zico'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'medium',
    explanation: 'Pelé (1940–2022) is widely regarded as the greatest footballer of all time. He won three FIFA World Cups with Brazil (1958, 1962, 1970) and scored over 1,000 career goals.'
  },
  {
    image: wp('Diego_Armando_Maradona_(1979).jpg'),
    question: 'Who is this footballer?',
    correct_answer: 'Diego Maradona',
    incorrect_answers: ['Pelé', 'Ronaldo', 'Zinedine Zidane'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'medium',
    explanation: 'Diego Maradona (1960–2020) is one of football\'s greatest ever players. He led Argentina to the 1986 World Cup, scoring both the "Hand of God" goal and the "Goal of the Century" against England.'
  },
  {
    image: wp('Jesse_Owens2.jpg'),
    question: 'Who is this athlete?',
    correct_answer: 'Jesse Owens',
    incorrect_answers: ['Carl Lewis', 'Jim Thorpe', 'Ralph Metcalfe'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'hard',
    explanation: 'Jesse Owens (1913–1980) won 4 gold medals at the 1936 Berlin Olympics — a humiliating rebuke to Hitler\'s Aryan supremacy ideology. He set three world records in a single day in 1935.'
  },
  {
    image: wp('Babe_Ruth2.jpg'),
    question: 'Who is this baseball legend?',
    correct_answer: 'Babe Ruth',
    incorrect_answers: ['Joe DiMaggio', 'Lou Gehrig', 'Mickey Mantle'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'medium',
    explanation: 'Babe Ruth (1895–1948) is considered the greatest baseball player of all time. He hit 714 home runs in his career — a record that stood for 39 years — and transformed the game\'s style of play.'
  },
  {
    image: wp('Ayrton_Senna_1991_Hockenheim.jpg'),
    question: 'Who is this racing driver?',
    correct_answer: 'Ayrton Senna',
    incorrect_answers: ['Alain Prost', 'Nigel Mansell', 'Michael Schumacher'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'medium',
    explanation: 'Ayrton Senna (1960–1994) won three F1 World Championships with McLaren. He is widely regarded as the greatest racing driver of all time. He died in a crash at the 1994 San Marino Grand Prix.'
  },
  {
    image: wp('Usain_Bolt_Olympics_80th_(cropped).jpg'),
    question: 'Who is this sprinter?',
    correct_answer: 'Usain Bolt',
    incorrect_answers: ['Maurice Greene', 'Asafa Powell', 'Yohan Blake'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'easy',
    explanation: 'Usain Bolt (born 1986) is the fastest human ever recorded. He holds world records in the 100m (9.58s) and 200m (19.19s) and won 8 Olympic gold medals across the 2008, 2012 and 2016 Games.'
  },
  {
    image: wp('Michael_Jordan_in_2014.jpg'),
    question: 'Who is this basketball player?',
    correct_answer: 'Michael Jordan',
    incorrect_answers: ['LeBron James', 'Kobe Bryant', 'Magic Johnson'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'easy',
    explanation: 'Michael Jordan (born 1963) won 6 NBA championships with the Chicago Bulls and is widely regarded as the greatest basketball player of all time. His partnership with Nike created the iconic Air Jordan brand.'
  },
  {
    image: wp('Roger_Federer_2012_Wimbledon_(cropped).jpg'),
    question: 'Who is this tennis player?',
    correct_answer: 'Roger Federer',
    incorrect_answers: ['Rafael Nadal', 'Novak Djokovic', 'Pete Sampras'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'easy',
    explanation: 'Roger Federer (born 1981) won 20 Grand Slam singles titles and is regarded as one of the greatest tennis players of all time. He held the world No. 1 ranking for a record 310 weeks.'
  },
  {
    image: wp('Tiger_Woods_at_the_2010_Walker_Cup_(cropped).jpg'),
    question: 'Who is this golfer?',
    correct_answer: 'Tiger Woods',
    incorrect_answers: ['Jack Nicklaus', 'Phil Mickelson', 'Rory McIlroy'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'easy',
    explanation: 'Tiger Woods (born 1975) has won 15 major championships and 82 PGA Tour events. He became the world\'s first billionaire athlete and transformed golf into a mainstream global sport.'
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
    image: wp('Mike_Tyson.jpg'),
    question: 'Who is this boxer?',
    correct_answer: 'Mike Tyson',
    incorrect_answers: ['Evander Holyfield', 'Lennox Lewis', 'George Foreman'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'easy',
    explanation: 'Mike Tyson (born 1966) became the youngest heavyweight world champion in history at 20 years old in 1986. Known as "Iron Mike", he knocked out 44 of his 50 career wins.'
  },
  {
    image: wp('Serena_Williams_at_the_2013_US_Open.jpg'),
    question: 'Who is this tennis player?',
    correct_answer: 'Serena Williams',
    incorrect_answers: ['Venus Williams', 'Steffi Graf', 'Martina Navratilova'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'easy',
    explanation: 'Serena Williams (born 1981) won 23 Grand Slam singles titles — more than any other player in the Open Era. She is widely considered the greatest female tennis player of all time.'
  },
  {
    image: wp('Jack_Nicklaus.jpg'),
    question: 'Who is this golfer, known as "The Golden Bear"?',
    correct_answer: 'Jack Nicklaus',
    incorrect_answers: ['Arnold Palmer', 'Gary Player', 'Tom Watson'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'hard',
    explanation: 'Jack Nicklaus (born 1940) won a record 18 major championships and is often called the greatest golfer of all time. He competed at the highest level from 1961 until his final Masters appearance in 2005.'
  },
  {
    image: wp('Yuri_Gagarin_(1961).jpg'),
    question: 'Who is this cosmonaut?',
    correct_answer: 'Yuri Gagarin',
    incorrect_answers: ['Valentina Tereshkova', 'Gherman Titov', 'Alexei Leonov'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'medium',
    explanation: 'Yuri Gagarin (1934–1968) became the first human to travel into space on 12 April 1961, completing one orbit of Earth aboard Vostok 1 in 108 minutes. He died in a training jet crash aged 34.'
  },
  {
    image: wp('Amelia_Earhart_1935.jpg'),
    question: 'Who is this aviation pioneer?',
    correct_answer: 'Amelia Earhart',
    incorrect_answers: ['Bessie Coleman', 'Harriet Quimby', 'Amy Johnson'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'medium',
    explanation: 'Amelia Earhart (1897–1937) was the first woman to fly solo across the Atlantic in 1932. She disappeared in 1937 while attempting to circumnavigate the globe — her fate remains one of history\'s great mysteries.'
  },

  // ── ARTS & ENTERTAINMENT ────────────────────────────────────────────────────
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
    image: wp('Frida_Kahlo,_by_Guillermo_Kahlo.jpg'),
    question: 'Who is this?',
    correct_answer: 'Frida Kahlo',
    incorrect_answers: ['Georgia O\'Keeffe', 'Tamara de Lempicka', 'Rosa Bonheur'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'medium',
    explanation: 'Frida Kahlo (1907–1954) was a Mexican painter known for her vivid self-portraits. She suffered a near-fatal bus accident at 18 and produced most of her work while bedridden.'
  },
  {
    image: wp('Charlie_Chaplin.jpg'),
    question: 'Who is this?',
    correct_answer: 'Charlie Chaplin',
    incorrect_answers: ['Buster Keaton', 'Harold Lloyd', 'Stan Laurel'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'easy',
    explanation: 'Charlie Chaplin (1889–1977) was a British comic genius of the silent film era, famous for his "Tramp" character. He wrote, directed, produced, and starred in his own films. One of the most influential figures in cinema history.'
  },
  {
    image: wp('Jimi_Hendrix_1967.jpg'),
    question: 'Who is this musician?',
    correct_answer: 'Jimi Hendrix',
    incorrect_answers: ['Eric Clapton', 'Carlos Santana', 'B.B. King'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'medium',
    explanation: 'Jimi Hendrix (1942–1970) is widely considered the greatest guitarist in history. Left-handed, he played a right-handed Stratocaster strung upside down. He died aged 27, a member of the "27 Club".'
  },
  {
    image: wp('Bob-Marley.jpg'),
    question: 'Who is this musician?',
    correct_answer: 'Bob Marley',
    incorrect_answers: ['Peter Tosh', 'Bunny Wailer', 'Jimmy Cliff'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'easy',
    explanation: 'Bob Marley (1945–1981) brought reggae music and Rastafarianism to a global audience. Songs like "No Woman, No Cry" and "One Love" made him the best-selling reggae artist of all time.'
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
    image: wp('Marilyn_Monroe_in_1952.jpg'),
    question: 'Who is this?',
    correct_answer: 'Marilyn Monroe',
    incorrect_answers: ['Audrey Hepburn', 'Grace Kelly', 'Elizabeth Taylor'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'easy',
    explanation: 'Marilyn Monroe (1926–1962) was an American actress, model, and singer who became one of the most iconic figures of the 20th century. Born Norma Jeane, she starred in Some Like It Hot.'
  },
  {
    image: wp('Ludwig_van_Beethoven_by_Joseph_Karl_Stieler,_1820.jpg'),
    question: 'Who is this composer?',
    correct_answer: 'Ludwig van Beethoven',
    incorrect_answers: ['Wolfgang Amadeus Mozart', 'Franz Schubert', 'Joseph Haydn'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'medium',
    explanation: 'Ludwig van Beethoven (1770–1827) composed some of the most celebrated music ever written, including his 9th Symphony — which he composed while completely deaf.'
  },
  {
    image: wp('Wolfgang-amadeus-mozart_1.jpg'),
    question: 'Who is this composer?',
    correct_answer: 'Wolfgang Amadeus Mozart',
    incorrect_answers: ['Ludwig van Beethoven', 'Franz Liszt', 'Johann Sebastian Bach'],
    category: 'Famous Faces', type: 'multiple', difficulty: 'medium',
    explanation: 'Wolfgang Amadeus Mozart (1756–1791) was a child prodigy who composed over 800 works in his short 35-year life, including symphonies, operas, chamber music, and concertos.'
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
    explanation: 'The Acropolis of Athens houses the Parthenon, built in the 5th century BC as a temple to Athena. "Acropolis" means "high city" in Greek — it was the sacred heart of ancient Athens.'
  },
  {
    image: wp('Sydney_Opera_House_-_Dec_2008-2b.jpg'),
    question: 'Where is this landmark?',
    correct_answer: 'Sydney, Australia',
    incorrect_answers: ['Auckland, New Zealand', 'Melbourne, Australia', 'Cape Town, South Africa'],
    category: 'Famous Places', type: 'multiple', difficulty: 'easy',
    explanation: 'The Sydney Opera House opened in 1973. Its "sail" roofs house multiple performance venues. Designed by Danish architect Jørn Utzon, who won the Pritzker Prize partly for this design.'
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
    image: wp('Big_Ben_Elizabeth_Tower_London_2023_01_Detail.jpg'),
    question: 'Where is this landmark?',
    correct_answer: 'London, England',
    incorrect_answers: ['Edinburgh, Scotland', 'Dublin, Ireland', 'Amsterdam, Netherlands'],
    category: 'Famous Places', type: 'multiple', difficulty: 'easy',
    explanation: 'Big Ben is the nickname for the Great Bell of the Westminster clock tower, officially renamed the Elizabeth Tower in 2012. The tower was completed in 1859.'
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
    explanation: 'The Pyramids of Giza include the Great Pyramid of Khufu, the only surviving Wonder of the Ancient World. Built around 2560 BC, it was the world\'s tallest structure for 3,800 years.'
  },
  {
    image: wp('Sagrada_Familia_01.jpg'),
    question: 'Where is this landmark?',
    correct_answer: 'Barcelona, Spain',
    incorrect_answers: ['Rome, Italy', 'Paris, France', 'Vienna, Austria'],
    category: 'Famous Places', type: 'multiple', difficulty: 'medium',
    explanation: 'The Sagrada Família is Antoni Gaudí\'s masterpiece basilica in Barcelona. Construction began in 1882 and is still ongoing — expected completion around 2026. A UNESCO World Heritage Site.'
  },
  {
    image: wp('Neuschwanstein_castle_northwest_seen_from_Marienbrücke.jpg'),
    question: 'Where is this fairy-tale castle?',
    correct_answer: 'Bavaria, Germany',
    incorrect_answers: ['Salzburg, Austria', 'Prague, Czech Republic', 'Innsbruck, Austria'],
    category: 'Famous Places', type: 'multiple', difficulty: 'medium',
    explanation: 'Neuschwanstein Castle was built by King Ludwig II of Bavaria, begun in 1869. It inspired Walt Disney\'s Sleeping Beauty Castle. Ludwig II died before it was completed.'
  },
  {
    image: wp('Stonehenge,_Condado_de_Wiltshire,_Inglaterra,_2014-08-12,_DD_09.JPG'),
    question: 'Where is this prehistoric monument?',
    correct_answer: 'Wiltshire, England',
    incorrect_answers: ['Brittany, France', 'County Kerry, Ireland', 'Orkney, Scotland'],
    category: 'Famous Places', type: 'multiple', difficulty: 'easy',
    explanation: 'Stonehenge on Salisbury Plain was built in stages from around 3000 BC. The giant sarsen stones weigh up to 25 tonnes and were transported from 25 miles away — how remains a mystery.'
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
    image: wp('Hagia_Sophia_Mars_2013.jpg'),
    question: 'Where is this landmark?',
    correct_answer: 'Istanbul, Turkey',
    incorrect_answers: ['Cairo, Egypt', 'Tehran, Iran', 'Athens, Greece'],
    category: 'Famous Places', type: 'multiple', difficulty: 'medium',
    explanation: 'Hagia Sophia was built in 537 AD as a Christian cathedral, converted to a mosque in 1453, became a museum in 1934, and reconverted to a mosque in 2020. Its dome was the world\'s largest for nearly 1,000 years.'
  },
  {
    image: wp('GoldenGateBridge-001.jpg'),
    question: 'Where is this bridge?',
    correct_answer: 'San Francisco, USA',
    incorrect_answers: ['Sydney, Australia', 'New York, USA', 'Vancouver, Canada'],
    category: 'Famous Places', type: 'multiple', difficulty: 'easy',
    explanation: 'The Golden Gate Bridge opened in 1937 and spans 2.7 km. The distinctive "International Orange" colour was chosen to make it visible in San Francisco\'s famous fog.'
  },
  {
    image: wp('Leaning_tower_of_pisa_2.jpg'),
    question: 'Where is this landmark?',
    correct_answer: 'Pisa, Italy',
    incorrect_answers: ['Florence, Italy', 'Bologna, Italy', 'Siena, Italy'],
    category: 'Famous Places', type: 'multiple', difficulty: 'easy',
    explanation: 'The Leaning Tower of Pisa began tilting during construction in 1173 due to soft ground. Galileo allegedly used it to demonstrate that objects of different masses fall at the same speed.'
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
    explanation: 'The Birth of Venus (c.1484–1486) by Sandro Botticelli depicts the goddess Venus emerging from the sea. One of the first large-scale non-religious works of the Renaissance. Hangs in the Uffizi Gallery, Florence.'
  },
  {
    image: wp('Great_Wave_off_Kanagawa2.jpg'),
    question: 'What is this woodblock print?',
    correct_answer: 'The Great Wave off Kanagawa',
    incorrect_answers: ['Red Fuji', 'Fine Wind, Clear Morning', 'Sudden Shower over Shin-Ohashi Bridge'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'medium',
    explanation: 'The Great Wave off Kanagawa (c.1831) by Katsushika Hokusai is probably the most internationally recognisable Japanese artwork. Mount Fuji is visible in the background beneath the wave\'s foam.'
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
    explanation: 'The Persistence of Memory (1931) by Salvador Dalí features melting pocket watches. It was painted in just two hours. The "soft watches" were inspired by melting Camembert cheese.'
  },
  {
    image: wp('Grant_DeVolson_Wood_-_American_Gothic.jpg'),
    question: 'What is this painting?',
    correct_answer: 'American Gothic',
    incorrect_answers: ['Christina\'s World', 'Nighthawks', 'Automat'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'medium',
    explanation: 'American Gothic (1930) by Grant Wood depicts a farmer and his daughter (often misidentified as husband and wife) before a Gothic-style house in Iowa. One of the most famous and parodied American paintings.'
  },
  {
    image: wp('Van_Gogh_-_Sunflowers_-_VGM_F458.jpg'),
    question: 'What is this painting?',
    correct_answer: 'Sunflowers',
    incorrect_answers: ['Irises', 'Almond Blossom', 'Wheat Field with Cypresses'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'easy',
    explanation: 'Sunflowers (1888) is one of a series Van Gogh made to decorate his "Yellow House" in Arles for Paul Gauguin\'s visit. In 1987, one version sold for $39.9 million — then a world record.'
  },
  {
    image: wp('Las_Meninas_01.jpg'),
    question: 'What is this painting?',
    correct_answer: 'Las Meninas',
    incorrect_answers: ['The Rokeby Venus', 'The Surrender of Breda', 'Pope Innocent X'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'hard',
    explanation: 'Las Meninas (1656) by Diego Velázquez is considered one of the most complex paintings in Western art. The artist himself appears in it; who it actually depicts has been debated for centuries.'
  },
  {
    image: wp('DaVinci_Last_Supper_high_res.jpg'),
    question: 'What is this painting?',
    correct_answer: 'The Last Supper',
    incorrect_answers: ['The Wedding at Cana', 'Christ Washing the Feet of the Apostles', 'The Transfiguration'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'easy',
    explanation: 'The Last Supper (1495–1498) by Leonardo da Vinci depicts Jesus announcing that one of his apostles will betray him. Painted on the wall of Santa Maria delle Grazie refectory in Milan.'
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
    explanation: 'Whistler\'s Mother (1871), officially "Arrangement in Grey and Black No.1", by James Whistler. Whistler\'s original model cancelled, so his mother stepped in as a last-minute replacement.'
  },
  {
    image: wp('Guernica_by_Picasso.jpg'),
    question: 'What is this painting?',
    correct_answer: 'Guernica',
    incorrect_answers: ['Les Demoiselles d\'Avignon', 'The Weeping Woman', 'Girl Before a Mirror'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'medium',
    explanation: 'Guernica (1937) by Pablo Picasso is a powerful anti-war statement depicting the Nazi bombing of the Basque town of Guernica during the Spanish Civil War. Now in the Reina Sofía museum, Madrid.'
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
