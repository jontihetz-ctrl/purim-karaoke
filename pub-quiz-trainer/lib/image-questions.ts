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
  {
    image: wp('Burj_Khalifa.jpg'),
    question: 'Where is this skyscraper?',
    correct_answer: 'Dubai, UAE',
    incorrect_answers: ['Shanghai, China', 'Kuala Lumpur, Malaysia', 'New York, USA'],
    category: 'Famous Places', type: 'multiple', difficulty: 'easy',
    explanation: 'The Burj Khalifa, completed in 2010, stands 828m tall — the world\'s tallest building. It has 163 floors and was built in just 6 years. On a clear day you can see it from 95km away.'
  },
  {
    image: wp('Alhambra_granada_spain.jpg'),
    question: 'Where is this Moorish palace?',
    correct_answer: 'Granada, Spain',
    incorrect_answers: ['Seville, Spain', 'Córdoba, Spain', 'Toledo, Spain'],
    category: 'Famous Places', type: 'multiple', difficulty: 'medium',
    explanation: 'The Alhambra was built in the 13th–14th centuries as a palace complex for the Nasrid sultans. Its name means "the red one" in Arabic. After the Reconquista in 1492, it became a royal palace for the Spanish monarchs.'
  },
  {
    image: wp('Forbidden_City_from_the_Corner_Tower.jpg'),
    question: 'Where is this imperial palace?',
    correct_answer: 'Beijing, China',
    incorrect_answers: ['Tokyo, Japan', 'Seoul, South Korea', 'Kyoto, Japan'],
    category: 'Famous Places', type: 'multiple', difficulty: 'medium',
    explanation: 'The Forbidden City was the Chinese imperial palace from 1420 to 1912. It has 980 buildings and covers 72 hectares. For 500 years, commoners were forbidden to enter — hence the name.'
  },
  {
    image: wp('Mont_Saint-Michel_3,_Avranches,_Normandy,_France_-_July_2011.jpg'),
    question: 'Where is this tidal island abbey?',
    correct_answer: 'Normandy, France',
    incorrect_answers: ['Cornwall, England', 'Brittany, France', 'Galicia, Spain'],
    category: 'Famous Places', type: 'multiple', difficulty: 'hard',
    explanation: 'Mont Saint-Michel is a tidal island commune in Normandy, France. The abbey atop it was founded in 708 AD. At high tide it becomes an island; at low tide a causeway connects it to the mainland.'
  },
  {
    image: wp('Oia-Santorini.jpg'),
    question: 'Where is this whitewashed island village?',
    correct_answer: 'Santorini, Greece',
    incorrect_answers: ['Mykonos, Greece', 'Ibiza, Spain', 'Capri, Italy'],
    category: 'Famous Places', type: 'multiple', difficulty: 'easy',
    explanation: 'Santorini (Thira) is a volcanic island in the Aegean. The iconic blue-domed churches and white buildings of Oia are one of the most photographed scenes in the world. The island may have inspired the Atlantis legend.'
  },
  {
    image: wp('Notre-Dame_de_Paris_2013-07-24.jpg'),
    question: 'Where is this cathedral?',
    correct_answer: 'Paris, France',
    incorrect_answers: ['Lyon, France', 'Brussels, Belgium', 'Cologne, Germany'],
    category: 'Famous Places', type: 'multiple', difficulty: 'easy',
    explanation: 'Notre-Dame de Paris was built 1163–1345. In April 2019 a catastrophic fire destroyed its spire and much of the roof. Reconstruction began immediately; the cathedral reopened in December 2024.'
  },
  {
    image: wp('Tower_bridge_London_Twilight_-_November_2012.jpg'),
    question: 'Where is this bridge?',
    correct_answer: 'London, England',
    incorrect_answers: ['Edinburgh, Scotland', 'Dublin, Ireland', 'Manchester, England'],
    category: 'Famous Places', type: 'multiple', difficulty: 'easy',
    explanation: 'Tower Bridge was built 1886–1894 across the Thames. Despite its Victorian Gothic appearance, it uses a steel frame. Its two bascules can rise to 86° to allow tall ships to pass.'
  },
  {
    image: wp('Edinburgh_castle_from_princes_street.JPG'),
    question: 'Where is this castle?',
    correct_answer: 'Edinburgh, Scotland',
    incorrect_answers: ['Stirling, Scotland', 'Cardiff, Wales', 'Dublin, Ireland'],
    category: 'Famous Places', type: 'multiple', difficulty: 'medium',
    explanation: 'Edinburgh Castle sits on a volcanic rock that has been a fortress since the 12th century. It houses the Scottish Crown Jewels and the Stone of Destiny, on which Scottish kings were traditionally crowned.'
  },
  {
    image: wp('Uluru,_2013.jpg'),
    question: 'Where is this sandstone monolith?',
    correct_answer: 'Northern Territory, Australia',
    incorrect_answers: ['Western Australia', 'New South Wales, Australia', 'South Australia'],
    category: 'Famous Places', type: 'multiple', difficulty: 'medium',
    explanation: 'Uluru (Ayers Rock) is a massive sandstone monolith 348m high and 9.4km around. Sacred to the Anangu Aboriginal people for over 10,000 years. Climbing was banned permanently in 2019.'
  },
  {
    image: wp('Trevi_Fountain,_Rome,_Italy_2_-_May_2007.jpg'),
    question: 'Where is this famous fountain?',
    correct_answer: 'Rome, Italy',
    incorrect_answers: ['Naples, Italy', 'Florence, Italy', 'Venice, Italy'],
    category: 'Famous Places', type: 'multiple', difficulty: 'easy',
    explanation: 'The Trevi Fountain, completed in 1762, is the largest Baroque fountain in Rome at 26m high. The tradition of throwing a coin over your left shoulder with your right hand to ensure a return to Rome generates ~€1.5 million a year.'
  },
  {
    image: wp('Niagara_Falls_2010.jpg'),
    question: 'Where are these waterfalls?',
    correct_answer: 'USA/Canada border',
    incorrect_answers: ['Argentina/Brazil border', 'Zambia/Zimbabwe border', 'Venezuela'],
    category: 'Famous Places', type: 'multiple', difficulty: 'easy',
    explanation: 'Niagara Falls sits on the border of Ontario, Canada and New York, USA. The three falls together form the highest flow rate of any waterfall in the world. About 6 million cubic feet of water fall per minute.'
  },
  {
    image: wp('Fuji_san_from_Honshu_ridge.jpg'),
    question: 'Where is this volcanic mountain?',
    correct_answer: 'Honshu, Japan',
    incorrect_answers: ['South Korea', 'Taiwan', 'Philippines'],
    category: 'Famous Places', type: 'multiple', difficulty: 'easy',
    explanation: 'Mount Fuji is Japan\'s highest peak at 3,776m and last erupted in 1707. It is a UNESCO World Heritage Site and a symbol of Japan. Approximately 200,000 people climb it each year.'
  },
  {
    image: wp('Table_Mountain_DanielaC.jpg'),
    question: 'Where is this flat-topped mountain?',
    correct_answer: 'Cape Town, South Africa',
    incorrect_answers: ['Nairobi, Kenya', 'Addis Ababa, Ethiopia', 'Windhoek, Namibia'],
    category: 'Famous Places', type: 'multiple', difficulty: 'medium',
    explanation: 'Table Mountain stands 1,085m above Cape Town. Its flat top is often covered by a "tablecloth" of orographic cloud. A cable car has operated to the summit since 1929. One of the New Seven Wonders of Nature.'
  },
  {
    image: wp('Palace_of_Versailles,_December_2007_001.jpg'),
    question: 'Where is this royal palace?',
    correct_answer: 'Versailles, France',
    incorrect_answers: ['Vienna, Austria', 'Madrid, Spain', 'Munich, Germany'],
    category: 'Famous Places', type: 'multiple', difficulty: 'easy',
    explanation: 'The Palace of Versailles was the principal residence of French kings from Louis XIV to Louis XVI. Its Hall of Mirrors is 73m long with 357 mirrors. The Treaty of Versailles ending WWI was signed here in 1919.'
  },
  {
    image: wp('Dubrovnik_Old_Town_2.jpg'),
    question: 'Where are these medieval city walls?',
    correct_answer: 'Dubrovnik, Croatia',
    incorrect_answers: ['Split, Croatia', 'Kotor, Montenegro', 'Valletta, Malta'],
    category: 'Famous Places', type: 'multiple', difficulty: 'medium',
    explanation: 'Dubrovnik\'s city walls, up to 25m high and 6m wide, encircle the old town. Founded in the 7th century, it was a powerful maritime republic. Used as King\'s Landing in Game of Thrones.'
  },
  {
    image: wp('Moai_Rano_raraku.jpg'),
    question: 'Where are these stone statues?',
    correct_answer: 'Easter Island, Chile',
    incorrect_answers: ['Hawaii, USA', 'Tonga', 'Samoa'],
    category: 'Famous Places', type: 'multiple', difficulty: 'medium',
    explanation: 'The moai of Easter Island were carved by the Rapa Nui people between the 13th and 16th centuries. There are 900 statues averaging 4m tall and 14 tonnes. How they were moved remains debated.'
  },
  {
    image: wp('Borobudur_Magelang_2014.jpg'),
    question: 'Where is this Buddhist temple?',
    correct_answer: 'Java, Indonesia',
    incorrect_answers: ['Bali, Indonesia', 'Cambodia', 'Myanmar'],
    category: 'Famous Places', type: 'multiple', difficulty: 'hard',
    explanation: 'Borobudur is a 9th-century Mahayana Buddhist temple on Java. Built around 800 AD, it has 2,672 relief panels and 504 Buddha statues. Abandoned after volcanic eruptions and rediscovered in 1814.'
  },
  {
    image: wp('Kapadokya_balon.jpg'),
    question: 'Where are these famous hot air balloons flown over a volcanic landscape?',
    correct_answer: 'Cappadocia, Turkey',
    incorrect_answers: ['Pamukkale, Turkey', 'Wadi Rum, Jordan', 'Serengeti, Tanzania'],
    category: 'Famous Places', type: 'multiple', difficulty: 'medium',
    explanation: 'Cappadocia in central Turkey is famous for its fairy chimney rock formations, carved cave dwellings, and underground cities. Up to 150 hot air balloons take off at sunrise each morning.'
  },
  {
    image: wp('Iguazu_Argentina.jpg'),
    question: 'Where are these waterfalls?',
    correct_answer: 'Argentina/Brazil border',
    incorrect_answers: ['USA/Canada border', 'Zambia/Zimbabwe border', 'Venezuela'],
    category: 'Famous Places', type: 'multiple', difficulty: 'medium',
    explanation: 'Iguazu Falls on the Argentina-Brazil border consists of 275 individual falls spanning 2.7km. Eleanor Roosevelt reportedly said "Poor Niagara!" upon first seeing them. The largest drop is called the Devil\'s Throat.'
  },
  {
    image: wp('Victoria_Falls_Zimbabwe_(2009).jpg'),
    question: 'Where are these waterfalls, known locally as "the smoke that thunders"?',
    correct_answer: 'Zambia/Zimbabwe border',
    incorrect_answers: ['Congo/Rwanda border', 'Kenya/Tanzania border', 'Ethiopia'],
    category: 'Famous Places', type: 'multiple', difficulty: 'medium',
    explanation: 'Victoria Falls (Mosi-oa-Tunya) on the Zambezi River is the world\'s largest waterfall by combined width (1.7km) and height (108m). Named by explorer David Livingstone in 1855 after Queen Victoria.'
  },
  {
    image: wp('Brandenburger_Tor_nachts.jpg'),
    question: 'Where is this neoclassical gate?',
    correct_answer: 'Berlin, Germany',
    incorrect_answers: ['Vienna, Austria', 'Prague, Czech Republic', 'Warsaw, Poland'],
    category: 'Famous Places', type: 'multiple', difficulty: 'easy',
    explanation: 'The Brandenburg Gate was built 1788–1791, inspired by the Propylaea of the Acropolis. For 28 years it stood in the no-man\'s land of the Berlin Wall, becoming the symbol of divided — then reunified — Germany.'
  },
  {
    image: wp('Charles_Bridge_and_Prague_Castle,_Prague_(8578873974).jpg'),
    question: 'Where is this medieval stone bridge?',
    correct_answer: 'Prague, Czech Republic',
    incorrect_answers: ['Budapest, Hungary', 'Kraków, Poland', 'Vienna, Austria'],
    category: 'Famous Places', type: 'multiple', difficulty: 'medium',
    explanation: 'Charles Bridge was built 1357–1402 across the Vltava. Its 30 Baroque statues of saints were added 1683–1714. It was the only bridge across the Vltava for 500 years and is now pedestrian only.'
  },
  {
    image: wp('Great_Sphinx_of_Giza_-_20080716a.jpg'),
    question: 'Where is this ancient limestone statue?',
    correct_answer: 'Giza, Egypt',
    incorrect_answers: ['Luxor, Egypt', 'Memphis, Egypt', 'Alexandria, Egypt'],
    category: 'Famous Places', type: 'multiple', difficulty: 'easy',
    explanation: 'The Great Sphinx of Giza, carved around 2500 BC, is the oldest known monumental sculpture in the world. It is 73m long and 20m high. The nose was likely removed deliberately — theories include Napoleon\'s soldiers, though this predates him.'
  },
  {
    image: wp('Space_Needle_2011-07-04.jpg'),
    question: 'Where is this futuristic tower?',
    correct_answer: 'Seattle, USA',
    incorrect_answers: ['Portland, USA', 'Vancouver, Canada', 'San Francisco, USA'],
    category: 'Famous Places', type: 'multiple', difficulty: 'medium',
    explanation: 'The Space Needle was built for the 1962 World\'s Fair in Seattle. It stands 184m tall and has a rotating restaurant at the top. Its design was inspired by the Jetsons TV show and a flying saucer.'
  },
  {
    image: wp('Ha_Long_Bay_1.jpg'),
    question: 'Where is this bay with limestone karst islands?',
    correct_answer: 'Vietnam',
    incorrect_answers: ['Thailand', 'Philippines', 'China'],
    category: 'Famous Places', type: 'multiple', difficulty: 'medium',
    explanation: 'Ha Long Bay in northeast Vietnam contains over 1,600 limestone islands and islets. A UNESCO World Heritage Site since 1994. "Ha Long" means "descending dragon" — legend says a dragon created the islands.'
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
  {
    image: wp('Rembrandt_van_Rijn-_The_Night_Watch_-_Google_Art_Project.jpg'),
    question: 'What is this painting?',
    correct_answer: 'The Night Watch',
    incorrect_answers: ['The Anatomy Lesson of Dr Nicolaes Tulp', 'Self-Portrait with Two Circles', 'The Jewish Bride'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'medium',
    explanation: 'The Night Watch (1642) by Rembrandt is the largest painting in the Rijksmuseum, Amsterdam. It depicts a militia company led by Captain Frans Banninck Cocq. The painting was cut down on all four sides when moved in 1715.'
  },
  {
    image: wp('Gustav_Klimt_016.jpg'),
    question: 'What is this painting?',
    correct_answer: 'The Kiss',
    incorrect_answers: ['Judith and the Head of Holofernes', 'Portrait of Adele Bloch-Bauer I', 'Danae'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'easy',
    explanation: 'The Kiss (1907–1908) by Gustav Klimt is his most famous work, painted during his "Golden Phase" using gold leaf. The couple is often thought to be Klimt himself and his companion Emilie Flöge. It hangs in Vienna\'s Belvedere.'
  },
  {
    image: wp('The_Garden_of_Earthly_Delights_by_Bosch_High_Resolution.jpg'),
    question: 'What is this triptych painting?',
    correct_answer: 'The Garden of Earthly Delights',
    incorrect_answers: ['The Last Judgement', 'The Seven Deadly Sins', 'The Ship of Fools'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'hard',
    explanation: 'The Garden of Earthly Delights (c.1490–1510) by Hieronymus Bosch is a triptych depicting Eden, worldly pleasure, and Hell. Its bizarre imagery has fascinated viewers for 500 years. It hangs in the Prado, Madrid.'
  },
  {
    image: wp('Eugène_Delacroix_-_La_liberté_guidant_le_peuple.jpg'),
    question: 'What is this painting?',
    correct_answer: 'Liberty Leading the People',
    incorrect_answers: ['The Raft of the Medusa', 'The Coronation of Napoleon', 'Oath of the Tennis Court'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'medium',
    explanation: 'Liberty Leading the People (1830) by Eugène Delacroix commemorates the July Revolution in France. The woman personifying Liberty holding the tricolour became an emblem of France and inspired the Statue of Liberty.'
  },
  {
    image: wp('Francisco_de_Goya,_Saturno_devorando_a_su_hijo_(1819-1823).jpg'),
    question: 'What is this painting?',
    correct_answer: 'Saturn Devouring His Son',
    incorrect_answers: ['The Third of May 1808', 'The Witches\' Sabbath', 'The Fight with Cudgels'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'medium',
    explanation: 'Saturn Devouring His Son (1819–1823) by Francisco Goya is one of his "Black Paintings," painted directly onto the walls of his house. It depicts the Titan Saturn eating one of his children to prevent being overthrown.'
  },
  {
    image: wp('Van_Eyck_-_Arnolfini_Portrait.jpg'),
    question: 'What is this painting?',
    correct_answer: 'The Arnolfini Portrait',
    incorrect_answers: ['Portrait of a Man in a Red Turban', 'The Virgin of Chancellor Rolin', 'The Ghent Altarpiece'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'hard',
    explanation: 'The Arnolfini Portrait (1434) by Jan van Eyck is one of the first large-scale uses of oil paint in Northern Europe. The convex mirror in the background reflects two witnesses, possibly including van Eyck himself.'
  },
  {
    image: wp('Claude_Monet,_Impression,_soleil_levant.jpg'),
    question: 'What is this painting?',
    correct_answer: 'Impression, Sunrise',
    incorrect_answers: ['Haystacks', 'Rouen Cathedral', 'Water Lilies'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'medium',
    explanation: 'Impression, Sunrise (1872) by Claude Monet depicts Le Havre harbour in morning mist. A critic mocked it as a mere "impression" — inadvertently giving the Impressionist movement its name.'
  },
  {
    image: wp('John_Constable_-_The_Hay_Wain_(1821).jpg'),
    question: 'What is this painting?',
    correct_answer: 'The Hay Wain',
    incorrect_answers: ['The Cornfield', 'Dedham Vale', 'Flatford Mill'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'medium',
    explanation: 'The Hay Wain (1821) by John Constable depicts a horse-drawn hay wain crossing the River Stour in Suffolk. It won a gold medal at the Paris Salon and is the UK\'s most beloved painting according to a 2005 poll.'
  },
  {
    image: wp('Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg'),
    question: 'What is this Romantic painting?',
    correct_answer: 'Wanderer above the Sea of Fog',
    incorrect_answers: ['The Monk by the Sea', 'Two Men Contemplating the Moon', 'Rocky Landscape in the Elbe Sandstone Mountains'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'hard',
    explanation: 'Wanderer above the Sea of Fog (c.1818) by Caspar David Friedrich is a definitive image of German Romanticism. The figure gazing into a misty abyss represents the human relationship with the sublime natural world.'
  },
  {
    image: wp('John_Everett_Millais_-_Ophelia_-_Google_Art_Project.jpg'),
    question: 'What is this Pre-Raphaelite painting?',
    correct_answer: 'Ophelia',
    incorrect_answers: ['The Lady of Shalott', 'Miranda', 'Mariana'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'medium',
    explanation: 'Ophelia (1851–1852) by John Everett Millais depicts the death of Hamlet\'s Ophelia. The model, Elizabeth Siddal, lay in a bath of water for hours while Millais painted — she caught a severe cold as a result.'
  },
  {
    image: wp('The_Fighting_Temeraire,_JMW_Turner,_National_Gallery.jpg'),
    question: 'What is this painting?',
    correct_answer: 'The Fighting Temeraire',
    incorrect_answers: ['Rain, Steam and Speed', 'The Slave Ship', 'Venice from the Porch of Madonna della Salute'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'hard',
    explanation: 'The Fighting Temeraire (1839) by J.M.W. Turner depicts the veteran warship of Trafalgar being towed to be broken up. Voted the greatest painting in Britain in a public poll. Now in the National Gallery, London.'
  },
  {
    image: wp('Michelangelo\'s_David_-_right_view_2.jpg'),
    question: 'What is this famous marble sculpture?',
    correct_answer: 'David',
    incorrect_answers: ['Moses', 'Apollo Belvedere', 'Dying Slave'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'easy',
    explanation: 'David (1501–1504) by Michelangelo stands 5.17m tall and depicts the biblical shepherd before his battle with Goliath. Carved from a single block of marble, it is displayed in the Galleria dell\'Accademia, Florence.'
  },
  {
    image: wp('Venus_de_Milo_Louvre_Ma399_n4.jpg'),
    question: 'What is this ancient Greek marble statue?',
    correct_answer: 'Venus de Milo',
    incorrect_answers: ['Nike of Samothrace', 'Aphrodite of Knidos', 'Artemis of Ephesus'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'easy',
    explanation: 'The Venus de Milo (c.100 BC) was discovered on the Greek island of Milos in 1820. Its missing arms have inspired endless speculation. It depicts Aphrodite (Venus) and now resides in the Louvre, Paris.'
  },
  {
    image: wp('The_Thinker,_Auguste_Rodin.jpg'),
    question: 'What is this bronze sculpture?',
    correct_answer: 'The Thinker',
    incorrect_answers: ['The Kiss', 'Burghers of Calais', 'The Age of Bronze'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'easy',
    explanation: 'The Thinker (Le Penseur) by Auguste Rodin was originally called "The Poet," intended to depict Dante Alighieri contemplating The Divine Comedy. Created 1880–1882, it is now one of the most recognised sculptures in the world.'
  },
  {
    image: wp('Edouard_Manet_-_A_Bar_at_the_Folies-Bergère.jpg'),
    question: 'What is this painting?',
    correct_answer: 'A Bar at the Folies-Bergère',
    incorrect_answers: ['Le Déjeuner sur l\'Herbe', 'Olympia', 'The Plum'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'hard',
    explanation: 'A Bar at the Folies-Bergère (1882) by Édouard Manet was his final major work. The barmaid\'s expression is detached despite the lively crowd reflected in the mirror behind her. The reflection does not match the perspective, puzzling art historians.'
  },
  {
    image: wp('Nighthawks_by_Edward_Hopper_1942.jpg'),
    question: 'What is this painting?',
    correct_answer: 'Nighthawks',
    incorrect_answers: ['Automat', 'Chop Suey', 'New York Movie'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'medium',
    explanation: 'Nighthawks (1942) by Edward Hopper depicts people in a diner late at night in a big city. It is one of the most recognised paintings in American art, capturing a sense of urban isolation and loneliness.'
  },
  {
    image: wp('Pierre-Auguste_Renoir,_Le_Moulin_de_la_Galette.jpg'),
    question: 'What is this Impressionist painting?',
    correct_answer: 'Dance at Le Moulin de la Galette',
    incorrect_answers: ['The Luncheon of the Boating Party', 'Two Sisters', 'Bal du Moulin Rouge'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'hard',
    explanation: 'Dance at Le Moulin de la Galette (1876) by Auguste Renoir captures a Sunday afternoon at a popular Montmartre dance garden. Painted en plein air, it is one of Impressionism\'s masterpieces. Now in the Musée d\'Orsay, Paris.'
  },
  {
    image: wp('The_two_Fridas.jpg'),
    question: 'What is this painting?',
    correct_answer: 'The Two Fridas',
    incorrect_answers: ['Self-Portrait with Thorn Necklace', 'My Dress Hangs There', 'The Broken Column'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'medium',
    explanation: 'The Two Fridas (1939) by Frida Kahlo depicts two versions of herself with exposed, connected hearts — one whole and one cut. Painted after her divorce from Diego Rivera, it reflects her dual Mexican and European identity.'
  },
  {
    image: wp('Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_(454045).jpg'),
    question: 'Which artist painted this self-portrait?',
    correct_answer: 'Vincent van Gogh',
    incorrect_answers: ['Paul Gauguin', 'Paul Cézanne', 'Henri de Toulouse-Lautrec'],
    category: 'Famous Artworks', type: 'multiple', difficulty: 'easy',
    explanation: 'Van Gogh painted over 30 self-portraits between 1885 and 1889 — partly because he could not afford models. This 1889 version, painted just before he entered the Saint-Paul-de-Mausole asylum, is one of his most famous.'
  },
]

// ── SPORTS STARS ────────────────────────────────────────────────────────────
const SPORTS_STARS: ImageQuestion[] = [
  {
    image: wp('Lionel_Messi_20180626.jpg'),
    question: 'Who is this footballer?',
    correct_answer: 'Lionel Messi',
    incorrect_answers: ['Cristiano Ronaldo', 'Neymar', 'Kylian Mbappé'],
    category: 'Sports Stars', type: 'multiple', difficulty: 'easy',
    explanation: 'Lionel Messi (born 1987) is widely regarded as the greatest footballer of all time. He won 8 Ballon d\'Or awards and led Argentina to the 2022 FIFA World Cup title.'
  },
  {
    image: wp('Cristiano_Ronaldo_2018.jpg'),
    question: 'Who is this footballer?',
    correct_answer: 'Cristiano Ronaldo',
    incorrect_answers: ['Lionel Messi', 'Zinedine Zidane', 'Ronaldinho'],
    category: 'Sports Stars', type: 'multiple', difficulty: 'easy',
    explanation: 'Cristiano Ronaldo (born 1985) is a Portuguese footballer and one of the greatest of all time. He holds records for most goals in Champions League history and has won 5 Ballon d\'Or awards.'
  },
  {
    image: wp('Michael_Phelps_2012.jpg'),
    question: 'Who is this Olympic swimmer?',
    correct_answer: 'Michael Phelps',
    incorrect_answers: ['Ian Thorpe', 'Ryan Lochte', 'Mark Spitz'],
    category: 'Sports Stars', type: 'multiple', difficulty: 'medium',
    explanation: 'Michael Phelps (born 1985) is the most decorated Olympian of all time, with 23 gold medals. He dominated swimming at the 2004, 2008, 2012 and 2016 Olympics.'
  },
  {
    image: wp('Novak_Djokovic_2019_French_Open.jpg'),
    question: 'Who is this tennis player?',
    correct_answer: 'Novak Djokovic',
    incorrect_answers: ['Rafael Nadal', 'Andy Murray', 'Stan Wawrinka'],
    category: 'Sports Stars', type: 'multiple', difficulty: 'easy',
    explanation: 'Novak Djokovic (born 1987) is a Serbian tennis player who holds the record for most Grand Slam singles titles (24) in the Open Era. He has been world No. 1 for over 400 weeks.'
  },
  {
    image: wp('LeBron_James_-_51959723161.jpg'),
    question: 'Who is this basketball player?',
    correct_answer: 'LeBron James',
    incorrect_answers: ['Kobe Bryant', 'Stephen Curry', 'Kevin Durant'],
    category: 'Sports Stars', type: 'multiple', difficulty: 'easy',
    explanation: 'LeBron James (born 1984) is considered one of the greatest NBA players of all time. He has won 4 NBA championships with 3 different teams and is the NBA\'s all-time leading scorer.'
  },
  {
    image: wp('Simone_Biles_2016.jpg'),
    question: 'Who is this gymnast?',
    correct_answer: 'Simone Biles',
    incorrect_answers: ['Nadia Comăneci', 'Aly Raisman', 'Gabby Douglas'],
    category: 'Sports Stars', type: 'multiple', difficulty: 'medium',
    explanation: 'Simone Biles (born 1997) is the most decorated gymnast in World Championship history, with 30 medals. She has four gymnastics skills named after her, recognising their unprecedented difficulty.'
  },
  {
    image: wp('Rafael_Nadal_2019_French_Open_R4_(48).jpg'),
    question: 'Who is this tennis player?',
    correct_answer: 'Rafael Nadal',
    incorrect_answers: ['Novak Djokovic', 'Roger Federer', 'Carlos Alcaraz'],
    category: 'Sports Stars', type: 'multiple', difficulty: 'easy',
    explanation: 'Rafael Nadal (born 1986) is a Spanish tennis player known as the "King of Clay". He won the French Open a record 14 times and accumulated 22 Grand Slam singles titles in his career.'
  },
  {
    image: wp('Manny_Pacquiao_2012.jpg'),
    question: 'Who is this boxer?',
    correct_answer: 'Manny Pacquiao',
    incorrect_answers: ['Floyd Mayweather', 'Oscar De La Hoya', 'Erik Morales'],
    category: 'Sports Stars', type: 'multiple', difficulty: 'medium',
    explanation: 'Manny Pacquiao (born 1978) is a Filipino boxer and the only fighter to win world titles in eight different weight divisions. He also served as a senator in the Philippines.'
  },
  {
    image: wp('Lewis_Hamilton_2016_Malaysia_2.jpg'),
    question: 'Who is this Formula 1 driver?',
    correct_answer: 'Lewis Hamilton',
    incorrect_answers: ['Sebastian Vettel', 'Michael Schumacher', 'Max Verstappen'],
    category: 'Sports Stars', type: 'multiple', difficulty: 'easy',
    explanation: 'Lewis Hamilton (born 1985) is a British Formula 1 driver who holds the record for most wins (103) and pole positions (104) in F1 history. He has won 7 World Drivers\' Championship titles, tying Michael Schumacher\'s record.'
  },
  {
    image: wp('Ronaldinho_2018.jpg'),
    question: 'Who is this Brazilian footballer?',
    correct_answer: 'Ronaldinho',
    incorrect_answers: ['Ronaldo Nazário', 'Roberto Carlos', 'Cafu'],
    category: 'Sports Stars', type: 'multiple', difficulty: 'medium',
    explanation: 'Ronaldinho (born 1980) is a Brazilian footballer known for his exceptional skill and joy for the game. He won the 2002 FIFA World Cup, the 2005 Ballon d\'Or, and the 2006 Champions League with Barcelona.'
  },
]

// ── MUSIC STARS ─────────────────────────────────────────────────────────────
const MUSIC_STARS: ImageQuestion[] = [
  {
    image: wp('Michael_Jackson_in_1988.jpg'),
    question: 'Who is this music legend?',
    correct_answer: 'Michael Jackson',
    incorrect_answers: ['Prince', 'James Brown', 'Stevie Wonder'],
    category: 'Music Stars', type: 'multiple', difficulty: 'easy',
    explanation: 'Michael Jackson (1958–2009) was known as the "King of Pop". His 1982 album Thriller is the best-selling album of all time, with over 66 million copies sold worldwide.'
  },
  {
    image: wp('Freddie_Mercury_performing_in_New_Haven,_CT,_November_1977.jpg'),
    question: 'Who is this rock legend?',
    correct_answer: 'Freddie Mercury',
    incorrect_answers: ['David Bowie', 'Mick Jagger', 'Robert Plant'],
    category: 'Music Stars', type: 'multiple', difficulty: 'easy',
    explanation: 'Freddie Mercury (1946–1991) was the lead vocalist of Queen. He is widely regarded as one of the greatest singers in rock history, known for his extraordinary vocal range and theatrical stage presence.'
  },
  {
    image: wp('David_Bowie_-_The_Jean_Genie,_1973.jpg'),
    question: 'Who is this musician?',
    correct_answer: 'David Bowie',
    incorrect_answers: ['Elton John', 'Lou Reed', 'Bryan Ferry'],
    category: 'Music Stars', type: 'multiple', difficulty: 'easy',
    explanation: 'David Bowie (1947–2016) was a pioneering English rock musician and actor known for his ever-changing persona. From Ziggy Stardust to the Thin White Duke, he reinvented himself across five decades of groundbreaking music.'
  },
  {
    image: wp('Beatles_ad_1965_just_the_beatles_crop.jpg'),
    question: 'Which band is pictured here?',
    correct_answer: 'The Beatles',
    incorrect_answers: ['The Rolling Stones', 'The Who', 'The Kinks'],
    category: 'Music Stars', type: 'multiple', difficulty: 'easy',
    explanation: 'The Beatles — John Lennon, Paul McCartney, George Harrison and Ringo Starr — are the best-selling music act of all time, with over 600 million units sold. They transformed popular music from 1963 to 1970.'
  },
  {
    image: wp('Bob_Dylan_-_Truly_Wild_The_Story_of_American_Music.jpg'),
    question: 'Who is this singer-songwriter?',
    correct_answer: 'Bob Dylan',
    incorrect_answers: ['Neil Young', 'Leonard Cohen', 'Paul Simon'],
    category: 'Music Stars', type: 'multiple', difficulty: 'medium',
    explanation: 'Bob Dylan (born 1941) is an American singer-songwriter who has been a major figure in popular culture for more than 50 years. In 2016 he was awarded the Nobel Prize in Literature for "creating new poetic expressions within the great American song tradition".'
  },
  {
    image: wp('Beyoncé_-_The_Formation_World_Tour,_at_Wembley_Stadium_(cropped).jpg'),
    question: 'Who is this pop superstar?',
    correct_answer: 'Beyoncé',
    incorrect_answers: ['Rihanna', 'Mariah Carey', 'Whitney Houston'],
    category: 'Music Stars', type: 'multiple', difficulty: 'easy',
    explanation: 'Beyoncé (born 1981) is one of the best-selling music artists of all time, with over 200 million records sold. She holds the record for most Grammy wins by any artist, with 32 as of 2024.'
  },
  {
    image: wp('Elton_John_-_Rocketman_premiere_(cropped_2).jpg'),
    question: 'Who is this pop icon?',
    correct_answer: 'Elton John',
    incorrect_answers: ['Billy Joel', 'Rod Stewart', 'David Bowie'],
    category: 'Music Stars', type: 'multiple', difficulty: 'easy',
    explanation: 'Elton John (born 1947) is a British singer-songwriter who has sold over 300 million records. Known for flamboyant stage costumes and hit songs including Rocket Man and Tiny Dancer, he was knighted in 1998.'
  },
  {
    image: wp('Madonna_at_the_2022_MTV_VMAs_09_(cropped).jpg'),
    question: 'Who is the "Queen of Pop"?',
    correct_answer: 'Madonna',
    incorrect_answers: ['Cyndi Lauper', 'Janet Jackson', 'Tina Turner'],
    category: 'Music Stars', type: 'multiple', difficulty: 'easy',
    explanation: 'Madonna (born 1958) is the best-selling female music artist of all time, with over 300 million records sold. She is known for reinventing herself across decades and her influence on pop culture, fashion and music.'
  },
  {
    image: wp('Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_(3).jpg'),
    question: 'Who is this singer-songwriter?',
    correct_answer: 'Taylor Swift',
    incorrect_answers: ['Selena Gomez', 'Katy Perry', 'Ariana Grande'],
    category: 'Music Stars', type: 'multiple', difficulty: 'easy',
    explanation: 'Taylor Swift (born 1989) is an American singer-songwriter who began as a country artist before crossing into pop. She became the first artist to simultaneously occupy all top 10 spots on the Billboard Hot 100 chart in 2022.'
  },
  {
    image: wp('Adele_2016.jpg'),
    question: 'Who is this British singer?',
    correct_answer: 'Adele',
    incorrect_answers: ['Amy Winehouse', 'Duffy', 'Jessie J'],
    category: 'Music Stars', type: 'multiple', difficulty: 'easy',
    explanation: 'Adele (born 1988) is a British singer-songwriter known for her powerful mezzo-soprano voice and soulful ballads. Her album 21 is one of the best-selling albums of all time and she has won 15 Grammy Awards.'
  },
]

// ── FILM STARS ──────────────────────────────────────────────────────────────
const FILM_STARS: ImageQuestion[] = [
  {
    image: wp('Marlon-Brando.jpg'),
    question: 'Who is this legendary actor?',
    correct_answer: 'Marlon Brando',
    incorrect_answers: ['James Dean', 'Paul Newman', 'Montgomery Clift'],
    category: 'Film Stars', type: 'multiple', difficulty: 'medium',
    explanation: 'Marlon Brando (1924–2004) revolutionised acting with his naturalistic method style. He is best known for roles in "The Godfather" (1972) and "Apocalypse Now" (1979), winning two Academy Awards for Best Actor.'
  },
  {
    image: wp('Audrey_Hepburn_1956.jpg'),
    question: 'Who is this iconic actress?',
    correct_answer: 'Audrey Hepburn',
    incorrect_answers: ['Grace Kelly', 'Katharine Hepburn', 'Elizabeth Taylor'],
    category: 'Film Stars', type: 'multiple', difficulty: 'medium',
    explanation: 'Audrey Hepburn (1929–1993) was a British actress and humanitarian. She is one of the few entertainers who achieved EGOT status (Emmy, Grammy, Oscar, Tony). She is remembered for Breakfast at Tiffany\'s and her later work as a UNICEF ambassador.'
  },
  {
    image: wp('Alfred_Hitchcock_on_the_set_of_Saboteur_(1942).jpg'),
    question: 'Who is this famous film director?',
    correct_answer: 'Alfred Hitchcock',
    incorrect_answers: ['Orson Welles', 'Billy Wilder', 'John Huston'],
    category: 'Film Stars', type: 'multiple', difficulty: 'medium',
    explanation: 'Alfred Hitchcock (1899–1980) was the "Master of Suspense" who directed classics such as Psycho, Rear Window and Vertigo. He appeared in brief cameos in almost all of his 53 films.'
  },
  {
    image: wp('Audrey_Hepburn_-_Breakfast_at_Tiffany\'s.jpg'),
    question: 'Who plays Holly Golightly in this iconic film scene?',
    correct_answer: 'Audrey Hepburn',
    incorrect_answers: ['Marilyn Monroe', 'Grace Kelly', 'Natalie Wood'],
    category: 'Film Stars', type: 'multiple', difficulty: 'medium',
    explanation: 'Audrey Hepburn starred as Holly Golightly in Breakfast at Tiffany\'s (1961), directed by Blake Edwards. The film produced the Oscar-winning song Moon River and became a defining moment of 1960s cinema.'
  },
  {
    image: wp('Will_Smith_2011.jpg'),
    question: 'Who is this Hollywood actor?',
    correct_answer: 'Will Smith',
    incorrect_answers: ['Denzel Washington', 'Jamie Foxx', 'Kevin Hart'],
    category: 'Film Stars', type: 'multiple', difficulty: 'easy',
    explanation: 'Will Smith (born 1968) is a rapper and actor who rose to fame on The Fresh Prince of Bel-Air before becoming one of Hollywood\'s biggest stars. He won an Academy Award for Best Actor for his role in "King Richard" (2022).'
  },
  {
    image: wp('Leonardo_DiCaprio_2014.jpg'),
    question: 'Who is this actor?',
    correct_answer: 'Leonardo DiCaprio',
    incorrect_answers: ['Brad Pitt', 'Tom Hanks', 'Matt Damon'],
    category: 'Film Stars', type: 'multiple', difficulty: 'easy',
    explanation: 'Leonardo DiCaprio (born 1974) is an American actor and environmental activist. He is known for roles in Titanic, The Aviator and The Wolf of Wall Street, and won the Academy Award for Best Actor for "The Revenant" (2016).'
  },
  {
    image: wp('Meryl_Streep_2017.jpg'),
    question: 'Who is this Oscar-winning actress?',
    correct_answer: 'Meryl Streep',
    incorrect_answers: ['Cate Blanchett', 'Kate Winslet', 'Helen Mirren'],
    category: 'Film Stars', type: 'multiple', difficulty: 'medium',
    explanation: 'Meryl Streep (born 1949) holds the record for the most Academy Award nominations of any actor (21 nominations, 3 wins). She is widely considered the greatest living actress, known for her ability to master different accents and characters.'
  },
  {
    image: wp('Tom_Hanks_2016.jpg'),
    question: 'Who is this beloved actor?',
    correct_answer: 'Tom Hanks',
    incorrect_answers: ['Robin Williams', 'Steve Martin', 'Jim Carrey'],
    category: 'Film Stars', type: 'multiple', difficulty: 'easy',
    explanation: 'Tom Hanks (born 1956) is one of Hollywood\'s most respected actors, known for Forrest Gump, Cast Away and The Green Mile. He is the first male actor to win back-to-back Academy Awards for Best Actor (Philadelphia, 1994; Forrest Gump, 1995).'
  },
  {
    image: wp('Oprah_in_2014.jpg'),
    question: 'Who is this media mogul and actress?',
    correct_answer: 'Oprah Winfrey',
    incorrect_answers: ['Whoopi Goldberg', 'Halle Berry', 'Angela Bassett'],
    category: 'Film Stars', type: 'multiple', difficulty: 'easy',
    explanation: 'Oprah Winfrey (born 1954) is a media mogul, actress and philanthropist. Her talk show ran for 25 seasons (1986–2011) and she became the first Black female billionaire in the world. She received an honorary Academy Award in 2018.'
  },
  {
    image: wp('Scarlett_Johansson_2014.jpg'),
    question: 'Who plays Black Widow in the Marvel films?',
    correct_answer: 'Scarlett Johansson',
    incorrect_answers: ['Brie Larson', 'Elizabeth Olsen', 'Natalie Portman'],
    category: 'Film Stars', type: 'multiple', difficulty: 'easy',
    explanation: 'Scarlett Johansson (born 1984) is an American actress who is one of the highest-grossing box office stars of all time. She first played Natasha Romanoff/Black Widow in "Iron Man 2" (2010) and starred in her own film in 2021.'
  },
]

// ── WORLD LEADERS ───────────────────────────────────────────────────────────
const WORLD_LEADERS: ImageQuestion[] = [
  {
    image: wp('Emmanuel_Macron_in_2019.jpg'),
    question: 'Who is this world leader?',
    correct_answer: 'Emmanuel Macron',
    incorrect_answers: ['François Hollande', 'Nicolas Sarkozy', 'Édouard Philippe'],
    category: 'World Leaders', type: 'multiple', difficulty: 'medium',
    explanation: 'Emmanuel Macron (born 1977) became France\'s youngest President at 39 when he was elected in 2017. He founded the centrist "En Marche!" party and was re-elected for a second term in 2022.'
  },
  {
    image: wp('Joe_Biden_(49484798448)_(cropped).jpg'),
    question: 'Who is this US President?',
    correct_answer: 'Joe Biden',
    incorrect_answers: ['Bernie Sanders', 'Barack Obama', 'Donald Trump'],
    category: 'World Leaders', type: 'multiple', difficulty: 'easy',
    explanation: 'Joe Biden (born 1942) served as the 46th President of the United States (2021–2025) and had previously been Vice President under Barack Obama. At 78, he became the oldest person to be inaugurated as US President.'
  },
  {
    image: wp('Vladimir_Putin_(2022-12-29).jpg'),
    question: 'Who is this world leader?',
    correct_answer: 'Vladimir Putin',
    incorrect_answers: ['Dmitry Medvedev', 'Boris Yeltsin', 'Mikhail Gorbachev'],
    category: 'World Leaders', type: 'multiple', difficulty: 'easy',
    explanation: 'Vladimir Putin (born 1952) has been the dominant political figure in Russia since 1999, serving multiple terms as both President and Prime Minister. He is the longest-serving leader of Russia since Joseph Stalin.'
  },
  {
    image: wp('Angela_Merkel_Security_Conference_February_2009_crop.jpg'),
    question: 'Who is this former world leader?',
    correct_answer: 'Angela Merkel',
    incorrect_answers: ['Theresa May', 'Jacinda Ardern', 'Christine Lagarde'],
    category: 'World Leaders', type: 'multiple', difficulty: 'medium',
    explanation: 'Angela Merkel (born 1954) served as Chancellor of Germany from 2005 to 2021 — the longest-serving leader of a major democratic nation in that period. She was consistently ranked as the world\'s most powerful woman.'
  },
  {
    image: wp('Official_Photo_of_President_Reagan_1981.jpg'),
    question: 'Who is this former US President?',
    correct_answer: 'Ronald Reagan',
    incorrect_answers: ['Gerald Ford', 'Jimmy Carter', 'George H.W. Bush'],
    category: 'World Leaders', type: 'multiple', difficulty: 'medium',
    explanation: 'Ronald Reagan (1911–2004) was the 40th US President (1981–1989) and a former Hollywood actor. He is associated with "Reaganomics" — supply-side economic policies — and played a key role in ending the Cold War.'
  },
  {
    image: wp('Tony_Blair_Falklands_2_crop.jpg'),
    question: 'Who is this former UK Prime Minister?',
    correct_answer: 'Tony Blair',
    incorrect_answers: ['Gordon Brown', 'John Major', 'David Cameron'],
    category: 'World Leaders', type: 'multiple', difficulty: 'medium',
    explanation: 'Tony Blair (born 1953) served as Prime Minister of the United Kingdom from 1997 to 2007 — the longest-serving Labour Prime Minister. He won three general elections and oversaw the Good Friday Agreement in Northern Ireland.'
  },
  {
    image: wp('Xi_Jinping_in_November_2013.jpg'),
    question: 'Who is this world leader?',
    correct_answer: 'Xi Jinping',
    incorrect_answers: ['Hu Jintao', 'Jiang Zemin', 'Li Keqiang'],
    category: 'World Leaders', type: 'multiple', difficulty: 'medium',
    explanation: 'Xi Jinping (born 1953) has been General Secretary of the Chinese Communist Party since 2012 and President of China since 2013. He is considered the most powerful Chinese leader since Mao Zedong.'
  },
  {
    image: wp('Jacinda_Ardern_2018_official_portrait_cropped.jpg'),
    question: 'Who is this former world leader?',
    correct_answer: 'Jacinda Ardern',
    incorrect_answers: ['Helen Clark', 'Jenny Shipley', 'Nicola Willis'],
    category: 'World Leaders', type: 'multiple', difficulty: 'medium',
    explanation: 'Jacinda Ardern (born 1980) served as New Zealand\'s 40th Prime Minister (2017–2023). She became the world\'s youngest female head of government at 37 and the second elected leader to give birth while in office.'
  },
]

// ── ROYALS ──────────────────────────────────────────────────────────────────
const ROYALS: ImageQuestion[] = [
  {
    image: wp('Queen_Elizabeth_II_in_March_2015.jpg'),
    question: 'Who is this monarch?',
    correct_answer: 'Queen Elizabeth II',
    incorrect_answers: ['Princess Diana', 'Queen Mary', 'Princess Anne'],
    category: 'Royals', type: 'multiple', difficulty: 'easy',
    explanation: 'Queen Elizabeth II (1926–2022) was the longest-reigning British monarch, serving for 70 years and 214 days. She ascended the throne at 25 in 1952 following the death of her father, King George VI.'
  },
  {
    image: wp('Princess_Diana_Allan_Warren.jpg'),
    question: 'Who is this member of the British Royal Family?',
    correct_answer: 'Princess Diana',
    incorrect_answers: ['Queen Elizabeth II', 'Princess Anne', 'Sarah Ferguson'],
    category: 'Royals', type: 'multiple', difficulty: 'easy',
    explanation: 'Princess Diana (1961–1997) was the first wife of King Charles III and the mother of Princes William and Harry. Known as the "People\'s Princess", she was celebrated for her charity work and humanitarian causes.'
  },
  {
    image: wp('King_Charles_III_at_COP27_(cropped).jpg'),
    question: 'Who is this monarch?',
    correct_answer: 'King Charles III',
    incorrect_answers: ['Prince William', 'Prince Harry', 'Prince Andrew'],
    category: 'Royals', type: 'multiple', difficulty: 'easy',
    explanation: 'King Charles III (born 1948) became King of the United Kingdom in September 2022 following the death of his mother, Queen Elizabeth II. He is the oldest person to accede to the British throne at 73.'
  },
  {
    image: wp('Prince_William_2020.jpg'),
    question: 'Who is this member of the Royal Family?',
    correct_answer: 'Prince William',
    incorrect_answers: ['Prince Harry', 'Prince Andrew', 'Prince Edward'],
    category: 'Royals', type: 'multiple', difficulty: 'easy',
    explanation: 'Prince William (born 1982), now the Prince of Wales, is the heir apparent to the British throne. He married Catherine Middleton in 2011 at Westminster Abbey in a ceremony watched by an estimated 2 billion people.'
  },
  {
    image: wp('Napoleon_in_His_Study.jpg'),
    question: 'Who is this historical figure?',
    correct_answer: 'Napoleon Bonaparte',
    incorrect_answers: ['Louis XIV', 'Louis XVI', 'Charles de Gaulle'],
    category: 'Royals', type: 'multiple', difficulty: 'medium',
    explanation: 'Napoleon Bonaparte (1769–1821) was a French military commander and Emperor who dominated Europe in the early 19th century. He is regarded as one of the greatest military commanders in history, winning most of his 60 battles.'
  },
  {
    image: wp('Queen_Victoria_by_Bassano,_1882.jpg'),
    question: 'Who is this monarch?',
    correct_answer: 'Queen Victoria',
    incorrect_answers: ['Mary Queen of Scots', 'Queen Anne', 'Queen Elizabeth I'],
    category: 'Royals', type: 'multiple', difficulty: 'medium',
    explanation: 'Queen Victoria (1819–1901) reigned for 63 years and 7 months — the second longest of any British monarch. During her reign the British Empire expanded to cover a quarter of the world\'s land surface.'
  },
]

// ── COMEDIANS ───────────────────────────────────────────────────────────────
const COMEDIANS: ImageQuestion[] = [
  {
    image: wp('Robin_Williams_Happy_Feet.jpg'),
    question: 'Who is this comedian and actor?',
    correct_answer: 'Robin Williams',
    incorrect_answers: ['Steve Martin', 'Jim Carrey', 'Billy Crystal'],
    category: 'Comedians', type: 'multiple', difficulty: 'easy',
    explanation: 'Robin Williams (1951–2014) was one of the most acclaimed comedians and actors of his generation. Known for improvisation and manic energy, he won an Academy Award for Good Will Hunting (1998) and starred in Mrs. Doubtfire and Aladdin.'
  },
  {
    image: wp('Ricky_Gervais_2016_(cropped).jpg'),
    question: 'Who is this British comedian?',
    correct_answer: 'Ricky Gervais',
    incorrect_answers: ['Steve Coogan', 'Lee Mack', 'Jimmy Carr'],
    category: 'Comedians', type: 'multiple', difficulty: 'medium',
    explanation: 'Ricky Gervais (born 1961) created and starred in the original British version of The Office (2001–2003), which won two BAFTA Awards and two Golden Globes. He has hosted the Golden Globe Awards five times.'
  },
  {
    image: wp('Dave_Chappelle_2015.jpg'),
    question: 'Who is this stand-up comedian?',
    correct_answer: 'Dave Chappelle',
    incorrect_answers: ['Chris Rock', 'Eddie Murphy', 'Kevin Hart'],
    category: 'Comedians', type: 'multiple', difficulty: 'medium',
    explanation: 'Dave Chappelle (born 1973) is an American comedian and actor best known for Chappelle\'s Show, which he walked away from in 2005. He has won multiple Grammy Awards for his stand-up specials and is considered one of the greatest comedians of his generation.'
  },
  {
    image: wp('Kevin_Hart_2014_Comic-Con.jpg'),
    question: 'Who is this comedian?',
    correct_answer: 'Kevin Hart',
    incorrect_answers: ['Chris Rock', 'Eddie Murphy', 'Dave Chappelle'],
    category: 'Comedians', type: 'multiple', difficulty: 'easy',
    explanation: 'Kevin Hart (born 1979) is an American comedian, actor and producer. Known for his high-energy stand-up specials, he became one of Hollywood\'s most bankable stars, starring in films like Jumanji and Ride Along.'
  },
  {
    image: wp('John_Cleese_2014_by_Gage_Skidmore.jpg'),
    question: 'Who is this British comedian?',
    correct_answer: 'John Cleese',
    incorrect_answers: ['Michael Palin', 'Eric Idle', 'Stephen Fry'],
    category: 'Comedians', type: 'multiple', difficulty: 'medium',
    explanation: 'John Cleese (born 1939) co-founded Monty Python and created and starred in Fawlty Towers. He also co-wrote and starred in A Fish Called Wanda (1988), for which he received a BAFTA nomination for Best Screenplay.'
  },
  {
    image: wp('Mr._Bean_(character).jpg'),
    question: 'Which comedian\'s most famous character is this?',
    correct_answer: 'Rowan Atkinson',
    incorrect_answers: ['John Cleese', 'Steve Coogan', 'Harry Enfield'],
    category: 'Comedians', type: 'multiple', difficulty: 'easy',
    explanation: 'Rowan Atkinson (born 1955) created Mr. Bean — a childlike, largely silent character who became a global phenomenon. He also played Edmund Blackadder in the acclaimed BBC series Blackadder (1983–1989).'
  },
]

// ── INVENTORS & SCIENTISTS (tech focus) ─────────────────────────────────────
const INVENTORS: ImageQuestion[] = [
  {
    image: wp('Steve_Jobs_Headshot_2010-CROP_(cropped_2).jpg'),
    question: 'Who is this technology pioneer?',
    correct_answer: 'Steve Jobs',
    incorrect_answers: ['Bill Gates', 'Elon Musk', 'Jeff Bezos'],
    category: 'Inventors', type: 'multiple', difficulty: 'easy',
    explanation: 'Steve Jobs (1955–2011) co-founded Apple Inc. and is credited with revolutionising personal computing, music (iPod), mobile phones (iPhone) and tablet computing (iPad). He was also the driving force behind Pixar Animation Studios.'
  },
  {
    image: wp('Bill_Gates_2017_(cropped).jpg'),
    question: 'Who co-founded Microsoft?',
    correct_answer: 'Bill Gates',
    incorrect_answers: ['Steve Jobs', 'Mark Zuckerberg', 'Larry Page'],
    category: 'Inventors', type: 'multiple', difficulty: 'easy',
    explanation: 'Bill Gates (born 1955) co-founded Microsoft in 1975 with Paul Allen. Under his leadership, Microsoft became the world\'s most valuable company. He has since devoted much of his fortune to global health and education through the Bill & Melinda Gates Foundation.'
  },
  {
    image: wp('Elon_Musk_Colorado_2022_(cropped).jpg'),
    question: 'Who is this tech entrepreneur?',
    correct_answer: 'Elon Musk',
    incorrect_answers: ['Jeff Bezos', 'Richard Branson', 'Larry Ellison'],
    category: 'Inventors', type: 'multiple', difficulty: 'easy',
    explanation: 'Elon Musk (born 1971) is a South African-born entrepreneur who founded SpaceX, co-founded Tesla and PayPal, and acquired Twitter (rebranded as X). He became the world\'s wealthiest person, with a net worth exceeding $300 billion in 2024.'
  },
  {
    image: wp('Mark_Zuckerberg_F8_2018_Keynote_(26617494157)_(cropped).jpg'),
    question: 'Who is this social media founder?',
    correct_answer: 'Mark Zuckerberg',
    incorrect_answers: ['Jack Dorsey', 'Sergey Brin', 'Larry Page'],
    category: 'Inventors', type: 'multiple', difficulty: 'easy',
    explanation: 'Mark Zuckerberg (born 1984) co-founded Facebook (now Meta Platforms) in his Harvard dorm room in 2004. He became the world\'s youngest billionaire at 23, and Meta now owns Facebook, Instagram and WhatsApp.'
  },
  {
    image: wp('Tim_Berners-Lee.jpg'),
    question: 'Who invented the World Wide Web?',
    correct_answer: 'Tim Berners-Lee',
    incorrect_answers: ['Vint Cerf', 'Bill Gates', 'Steve Jobs'],
    category: 'Inventors', type: 'multiple', difficulty: 'medium',
    explanation: 'Tim Berners-Lee (born 1955) invented the World Wide Web in 1989 while working at CERN. He wrote the first web browser, web server and the HTML language. He famously made the web freely available without a patent.'
  },
  {
    image: wp('Thomas_Edison2.jpg'),
    question: 'Who is this famous inventor?',
    correct_answer: 'Thomas Edison',
    incorrect_answers: ['Alexander Graham Bell', 'Nikola Tesla', 'Benjamin Franklin'],
    category: 'Inventors', type: 'multiple', difficulty: 'easy',
    explanation: 'Thomas Edison (1847–1931) held 1,093 US patents and invented the phonograph, the practical incandescent light bulb and a system to distribute electricity. He also created the world\'s first industrial research laboratory in Menlo Park, New Jersey.'
  },
  {
    image: wp('Jeff_Bezos_2016.jpg'),
    question: 'Who founded Amazon?',
    correct_answer: 'Jeff Bezos',
    incorrect_answers: ['Elon Musk', 'Bill Gates', 'Mark Zuckerberg'],
    category: 'Inventors', type: 'multiple', difficulty: 'easy',
    explanation: 'Jeff Bezos (born 1964) founded Amazon in 1994 as an online bookstore that grew into the world\'s largest e-commerce and cloud computing company. He also founded Blue Origin, a private aerospace company, and owns The Washington Post.'
  },
]

// ── TV PERSONALITIES ─────────────────────────────────────────────────────────
const TV_PERSONALITIES: ImageQuestion[] = [
  {
    image: wp('David_Attenborough_2011.jpg'),
    question: 'Who is this beloved naturalist and broadcaster?',
    correct_answer: 'David Attenborough',
    incorrect_answers: ['Chris Packham', 'Richard Attenborough', 'Bill Nye'],
    category: 'TV Personalities', type: 'multiple', difficulty: 'easy',
    explanation: 'Sir David Attenborough (born 1926) is a broadcaster and natural historian known for narrating landmark nature documentaries including Life on Earth, Planet Earth and Blue Planet. He is one of the most widely recognised voices in the world.'
  },
  {
    image: wp('Gordon_Ramsay.jpg'),
    question: 'Who is this celebrity chef and TV personality?',
    correct_answer: 'Gordon Ramsay',
    incorrect_answers: ['Jamie Oliver', 'Heston Blumenthal', 'Marco Pierre White'],
    category: 'TV Personalities', type: 'multiple', difficulty: 'easy',
    explanation: 'Gordon Ramsay (born 1966) is a Scottish chef who holds 17 Michelin stars across his restaurants. He became a global TV star through Hell\'s Kitchen, MasterChef and Kitchen Nightmares, known for his fiery temper and passionate cooking.'
  },
  {
    image: wp('Conan_O\'Brien_2014.jpg'),
    question: 'Who is this late-night TV host?',
    correct_answer: 'Conan O\'Brien',
    incorrect_answers: ['Jimmy Fallon', 'Jay Leno', 'David Letterman'],
    category: 'TV Personalities', type: 'multiple', difficulty: 'medium',
    explanation: 'Conan O\'Brien (born 1963) is an American comedian and TV host who hosted late-night shows for over 25 years, including Late Night with Conan O\'Brien and Conan. He graduated from Harvard and was once a writer for The Simpsons and Saturday Night Live.'
  },
  {
    image: wp('Jimmy_Fallon_2016.jpg'),
    question: 'Who is the host of The Tonight Show?',
    correct_answer: 'Jimmy Fallon',
    incorrect_answers: ['Conan O\'Brien', 'Seth Meyers', 'James Corden'],
    category: 'TV Personalities', type: 'multiple', difficulty: 'medium',
    explanation: 'Jimmy Fallon (born 1974) has hosted The Tonight Show Starring Jimmy Fallon since 2014, following in the footsteps of legends like Johnny Carson and Jay Leno. Before that, he was a cast member of Saturday Night Live for six years.'
  },
  {
    image: wp('Ellen_DeGeneres_2011_(2).jpg'),
    question: 'Who is this TV host and comedian?',
    correct_answer: 'Ellen DeGeneres',
    incorrect_answers: ['Oprah Winfrey', 'Rosie O\'Donnell', 'Whoopi Goldberg'],
    category: 'TV Personalities', type: 'multiple', difficulty: 'easy',
    explanation: 'Ellen DeGeneres (born 1958) hosted The Ellen DeGeneres Show from 2003 to 2022, winning numerous Daytime Emmy Awards. She was one of the first openly gay celebrities in Hollywood, coming out in 1997 on her sitcom Ellen.'
  },
]

// ── FASHION & DESIGN ─────────────────────────────────────────────────────────
const FASHION_ICONS: ImageQuestion[] = [
  {
    image: wp('Coco_Chanel_1920.jpg'),
    question: 'Who is this fashion legend?',
    correct_answer: 'Coco Chanel',
    incorrect_answers: ['Christian Dior', 'Gianni Versace', 'Yves Saint Laurent'],
    category: 'Fashion Icons', type: 'multiple', difficulty: 'medium',
    explanation: 'Coco Chanel (1883–1971) revolutionised women\'s fashion by liberating women from corsets and introducing comfortable, practical designs. She created the "little black dress", Chanel No. 5 perfume, and the iconic Chanel suit.'
  },
  {
    image: wp('Karl_Lagerfeld_2014_(cropped).jpg'),
    question: 'Who is this fashion designer?',
    correct_answer: 'Karl Lagerfeld',
    incorrect_answers: ['Giorgio Armani', 'Donatella Versace', 'Valentino Garavani'],
    category: 'Fashion Icons', type: 'multiple', difficulty: 'medium',
    explanation: 'Karl Lagerfeld (1933–2019) was a German fashion designer who transformed Chanel after joining in 1983, making it one of the most profitable luxury brands in the world. He was known for his iconic white ponytail, dark glasses and fingerless gloves.'
  },
  {
    image: wp('Naomi_Campbell_2019_(cropped).jpg'),
    question: 'Who is this supermodel?',
    correct_answer: 'Naomi Campbell',
    incorrect_answers: ['Cindy Crawford', 'Tyra Banks', 'Linda Evangelista'],
    category: 'Fashion Icons', type: 'multiple', difficulty: 'medium',
    explanation: 'Naomi Campbell (born 1970) is one of the original supermodels who dominated the fashion industry in the late 1980s and 1990s. She was the first Black model to appear on the cover of Time magazine and French Vogue.'
  },
  {
    image: wp('Cindy_Crawford_2009_crop.jpg'),
    question: 'Who is this supermodel?',
    correct_answer: 'Cindy Crawford',
    incorrect_answers: ['Naomi Campbell', 'Claudia Schiffer', 'Heidi Klum'],
    category: 'Fashion Icons', type: 'multiple', difficulty: 'medium',
    explanation: 'Cindy Crawford (born 1966) is one of the original supermodels, famous for her trademark beauty mark. She appeared on over 1,000 magazine covers and was one of the world\'s highest-paid models throughout the 1990s.'
  },
  {
    image: wp('Victoria_Beckham_2014.jpg'),
    question: 'Who is this fashion designer and former pop star?',
    correct_answer: 'Victoria Beckham',
    incorrect_answers: ['Eva Longoria', 'Kate Moss', 'Stella McCartney'],
    category: 'Fashion Icons', type: 'multiple', difficulty: 'easy',
    explanation: 'Victoria Beckham (born 1974) rose to fame as "Posh Spice" in the Spice Girls before launching a successful fashion label in 2008. Her brand has won multiple British Fashion Awards and is stocked in high-end boutiques worldwide.'
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

export type ImageSubtype = 'faces' | 'places' | 'artworks' | 'sports' | 'music' | 'film' | 'leaders' | 'royals' | 'comedians' | 'inventors' | 'tv' | 'fashion' | 'mixed'

export function generateImageQuestions(
  amount: number,
  subtype: ImageSubtype
): ImageQuestion[] {
  let pool: ImageQuestion[]
  switch (subtype) {
    case 'faces':     pool = FAMOUS_FACES; break
    case 'places':    pool = FAMOUS_PLACES; break
    case 'artworks':  pool = FAMOUS_ARTWORKS; break
    case 'sports':    pool = SPORTS_STARS; break
    case 'music':     pool = MUSIC_STARS; break
    case 'film':      pool = FILM_STARS; break
    case 'leaders':   pool = WORLD_LEADERS; break
    case 'royals':    pool = ROYALS; break
    case 'comedians': pool = COMEDIANS; break
    case 'inventors': pool = INVENTORS; break
    case 'tv':        pool = TV_PERSONALITIES; break
    case 'fashion':   pool = FASHION_ICONS; break
    default:          pool = [...FAMOUS_FACES, ...FAMOUS_PLACES, ...FAMOUS_ARTWORKS, ...SPORTS_STARS, ...MUSIC_STARS, ...FILM_STARS]
  }
  return shuffleArray(pool).slice(0, Math.min(amount, pool.length))
}
