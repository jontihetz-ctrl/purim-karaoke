import type { TriviaQuestion } from '@/types'

// Hardcoded local question bank — supplements OpenTDB with high-quality pub quiz questions.
// These are served by /api/local-questions when no country is specified.

export const LOCAL_TRUE_FALSE: TriviaQuestion[] = [
  // Science & Nature
  { question: 'The Great Wall of China is visible from space with the naked eye.', correct_answer: 'False', incorrect_answers: ['True'], category: 'Science & Nature', type: 'boolean', difficulty: 'medium' },
  { question: 'Honey never spoils — archaeologists have found 3,000-year-old honey in Egyptian tombs that was still edible.', correct_answer: 'True', incorrect_answers: ['False'], category: 'Science & Nature', type: 'boolean', difficulty: 'easy' },
  { question: 'A day on Venus is longer than a year on Venus.', correct_answer: 'True', incorrect_answers: ['False'], category: 'Science & Nature', type: 'boolean', difficulty: 'hard' },
  { question: 'Humans share about 50% of their DNA with bananas.', correct_answer: 'True', incorrect_answers: ['False'], category: 'Science & Nature', type: 'boolean', difficulty: 'medium' },
  { question: 'Sound travels faster through water than through air.', correct_answer: 'True', incorrect_answers: ['False'], category: 'Science & Nature', type: 'boolean', difficulty: 'medium' },
  { question: 'Lightning never strikes the same place twice.', correct_answer: 'False', incorrect_answers: ['True'], category: 'Science & Nature', type: 'boolean', difficulty: 'easy' },
  { question: 'The human body contains more bacterial cells than human cells.', correct_answer: 'True', incorrect_answers: ['False'], category: 'Science & Nature', type: 'boolean', difficulty: 'medium' },
  { question: 'Diamonds are the hardest natural substance on Earth.', correct_answer: 'True', incorrect_answers: ['False'], category: 'Science & Nature', type: 'boolean', difficulty: 'easy' },
  { question: 'The Moon has its own light source.', correct_answer: 'False', incorrect_answers: ['True'], category: 'Science & Nature', type: 'boolean', difficulty: 'easy' },
  { question: 'Octopuses have three hearts.', correct_answer: 'True', incorrect_answers: ['False'], category: 'Science & Nature', type: 'boolean', difficulty: 'medium' },
  { question: 'Water boils at 100°C at sea level.', correct_answer: 'True', incorrect_answers: ['False'], category: 'Science & Nature', type: 'boolean', difficulty: 'easy' },
  { question: 'Sharks are older than trees — they existed before forests evolved on land.', correct_answer: 'True', incorrect_answers: ['False'], category: 'Science & Nature', type: 'boolean', difficulty: 'hard' },
  { question: 'Glass is technically a liquid that flows very slowly.', correct_answer: 'False', incorrect_answers: ['True'], category: 'Science & Nature', type: 'boolean', difficulty: 'medium' },
  { question: 'A group of flamingos is called a flamboyance.', correct_answer: 'True', incorrect_answers: ['False'], category: 'Science & Nature', type: 'boolean', difficulty: 'medium' },
  { question: 'The Sun is a planet.', correct_answer: 'False', incorrect_answers: ['True'], category: 'Science & Nature', type: 'boolean', difficulty: 'easy' },
  { question: 'Penguins can be found in the Arctic.', correct_answer: 'False', incorrect_answers: ['True'], category: 'Science & Nature', type: 'boolean', difficulty: 'easy' },
  { question: 'A snail can sleep for up to three years.', correct_answer: 'True', incorrect_answers: ['False'], category: 'Science & Nature', type: 'boolean', difficulty: 'hard' },
  { question: 'The human eye can detect a single photon of light in complete darkness.', correct_answer: 'True', incorrect_answers: ['False'], category: 'Science & Nature', type: 'boolean', difficulty: 'hard' },
  { question: 'Pluto is still classified as a planet by the International Astronomical Union.', correct_answer: 'False', incorrect_answers: ['True'], category: 'Science & Nature', type: 'boolean', difficulty: 'easy' },
  { question: 'There are more stars in the universe than grains of sand on all of Earth\'s beaches.', correct_answer: 'True', incorrect_answers: ['False'], category: 'Science & Nature', type: 'boolean', difficulty: 'medium' },

  // History
  { question: 'The Eiffel Tower was originally intended to be a permanent structure.', correct_answer: 'False', incorrect_answers: ['True'], category: 'History', type: 'boolean', difficulty: 'medium' },
  { question: 'Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid.', correct_answer: 'True', incorrect_answers: ['False'], category: 'History', type: 'boolean', difficulty: 'hard' },
  { question: 'Napoleon Bonaparte was unusually short for his era.', correct_answer: 'False', incorrect_answers: ['True'], category: 'History', type: 'boolean', difficulty: 'medium' },
  { question: 'The Viking Age began before the Norman Conquest of England.', correct_answer: 'True', incorrect_answers: ['False'], category: 'History', type: 'boolean', difficulty: 'easy' },
  { question: 'Albert Einstein failed mathematics at school.', correct_answer: 'False', incorrect_answers: ['True'], category: 'History', type: 'boolean', difficulty: 'medium' },
  { question: 'The Berlin Wall fell in 1989.', correct_answer: 'True', incorrect_answers: ['False'], category: 'History', type: 'boolean', difficulty: 'easy' },
  { question: 'World War I started in 1914.', correct_answer: 'True', incorrect_answers: ['False'], category: 'History', type: 'boolean', difficulty: 'easy' },
  { question: 'Julius Caesar was a Roman Emperor.', correct_answer: 'False', incorrect_answers: ['True'], category: 'History', type: 'boolean', difficulty: 'medium' },
  { question: 'The Great Fire of London occurred in 1666.', correct_answer: 'True', incorrect_answers: ['False'], category: 'History', type: 'boolean', difficulty: 'medium' },
  { question: 'The Titanic sank on its maiden voyage.', correct_answer: 'True', incorrect_answers: ['False'], category: 'History', type: 'boolean', difficulty: 'easy' },
  { question: 'The Cold War involved direct military combat between the USA and USSR.', correct_answer: 'False', incorrect_answers: ['True'], category: 'History', type: 'boolean', difficulty: 'medium' },
  { question: 'Christopher Columbus was born in Italy.', correct_answer: 'True', incorrect_answers: ['False'], category: 'History', type: 'boolean', difficulty: 'medium' },
  { question: 'The first successful powered aeroplane flight took place in 1903.', correct_answer: 'True', incorrect_answers: ['False'], category: 'History', type: 'boolean', difficulty: 'medium' },
  { question: 'The Roman Empire fell in 1066 AD.', correct_answer: 'False', incorrect_answers: ['True'], category: 'History', type: 'boolean', difficulty: 'easy' },

  // Geography
  { question: 'Australia is both a country and a continent.', correct_answer: 'True', incorrect_answers: ['False'], category: 'Geography', type: 'boolean', difficulty: 'easy' },
  { question: 'Russia is the largest country in the world by area.', correct_answer: 'True', incorrect_answers: ['False'], category: 'Geography', type: 'boolean', difficulty: 'easy' },
  { question: 'The Amazon River flows into the Pacific Ocean.', correct_answer: 'False', incorrect_answers: ['True'], category: 'Geography', type: 'boolean', difficulty: 'medium' },
  { question: 'The Sahara is the world\'s largest desert.', correct_answer: 'False', incorrect_answers: ['True'], category: 'Geography', type: 'boolean', difficulty: 'medium' },
  { question: 'Canada has more lakes than any other country in the world.', correct_answer: 'True', incorrect_answers: ['False'], category: 'Geography', type: 'boolean', difficulty: 'medium' },
  { question: 'The Nile is the longest river in the world.', correct_answer: 'True', incorrect_answers: ['False'], category: 'Geography', type: 'boolean', difficulty: 'easy' },
  { question: 'Africa is larger than North America.', correct_answer: 'True', incorrect_answers: ['False'], category: 'Geography', type: 'boolean', difficulty: 'medium' },
  { question: 'Brazil is the only Portuguese-speaking country in South America.', correct_answer: 'True', incorrect_answers: ['False'], category: 'Geography', type: 'boolean', difficulty: 'medium' },
  { question: 'New Zealand is part of Australia.', correct_answer: 'False', incorrect_answers: ['True'], category: 'Geography', type: 'boolean', difficulty: 'easy' },
  { question: 'The Dead Sea is the lowest point on Earth\'s surface.', correct_answer: 'True', incorrect_answers: ['False'], category: 'Geography', type: 'boolean', difficulty: 'medium' },
  { question: 'Switzerland has four official languages.', correct_answer: 'True', incorrect_answers: ['False'], category: 'Geography', type: 'boolean', difficulty: 'hard' },
  { question: 'Iceland is covered mostly in ice and Greenland is covered mostly in green.', correct_answer: 'False', incorrect_answers: ['True'], category: 'Geography', type: 'boolean', difficulty: 'easy' },

  // Entertainment
  { question: 'The first Harry Potter book was published in 1997.', correct_answer: 'True', incorrect_answers: ['False'], category: 'Entertainment: Books', type: 'boolean', difficulty: 'easy' },
  { question: 'James Bond was created by Ian Fleming.', correct_answer: 'True', incorrect_answers: ['False'], category: 'Entertainment: Books', type: 'boolean', difficulty: 'easy' },
  { question: 'Leonardo DiCaprio won an Oscar for Titanic.', correct_answer: 'False', incorrect_answers: ['True'], category: 'Entertainment: Film', type: 'boolean', difficulty: 'medium' },
  { question: 'The Beatles had more UK number one singles than any other artist.', correct_answer: 'True', incorrect_answers: ['False'], category: 'Entertainment: Music', type: 'boolean', difficulty: 'medium' },
  { question: 'Friends ran for 10 seasons on NBC.', correct_answer: 'True', incorrect_answers: ['False'], category: 'Entertainment: Television', type: 'boolean', difficulty: 'easy' },
  { question: 'Shrek won the first ever Academy Award for Best Animated Feature.', correct_answer: 'True', incorrect_answers: ['False'], category: 'Entertainment: Film', type: 'boolean', difficulty: 'hard' },
  { question: 'The Simpsons first appeared as a short on The Tracey Ullman Show.', correct_answer: 'True', incorrect_answers: ['False'], category: 'Entertainment: Television', type: 'boolean', difficulty: 'hard' },
  { question: 'Beethoven was completely deaf when he composed his 9th Symphony.', correct_answer: 'True', incorrect_answers: ['False'], category: 'Entertainment: Music', type: 'boolean', difficulty: 'medium' },
  { question: 'Game of Thrones is based on a series of books by George R.R. Martin.', correct_answer: 'True', incorrect_answers: ['False'], category: 'Entertainment: Television', type: 'boolean', difficulty: 'easy' },
  { question: 'Mozart died at the age of 35.', correct_answer: 'True', incorrect_answers: ['False'], category: 'Entertainment: Music', type: 'boolean', difficulty: 'medium' },

  // Sports
  { question: 'A standard football (soccer) match lasts 90 minutes.', correct_answer: 'True', incorrect_answers: ['False'], category: 'Sports', type: 'boolean', difficulty: 'easy' },
  { question: 'The Olympic Games originated in Ancient Rome.', correct_answer: 'False', incorrect_answers: ['True'], category: 'Sports', type: 'boolean', difficulty: 'easy' },
  { question: 'A cricket Test match can last up to five days.', correct_answer: 'True', incorrect_answers: ['False'], category: 'Sports', type: 'boolean', difficulty: 'easy' },
  { question: 'The Super Bowl is the championship game of American football.', correct_answer: 'True', incorrect_answers: ['False'], category: 'Sports', type: 'boolean', difficulty: 'easy' },
  { question: 'Roger Federer has won more Grand Slam titles than Rafael Nadal.', correct_answer: 'False', incorrect_answers: ['True'], category: 'Sports', type: 'boolean', difficulty: 'medium' },
  { question: 'Brazil has won the FIFA World Cup more times than any other country.', correct_answer: 'True', incorrect_answers: ['False'], category: 'Sports', type: 'boolean', difficulty: 'medium' },
  { question: 'Basketball was invented in Canada.', correct_answer: 'True', incorrect_answers: ['False'], category: 'Sports', type: 'boolean', difficulty: 'medium' },
  { question: 'A standard tennis set is won by the first player to reach 7 games.', correct_answer: 'False', incorrect_answers: ['True'], category: 'Sports', type: 'boolean', difficulty: 'medium' },
]

export const LOCAL_MULTIPLE_CHOICE: TriviaQuestion[] = [
  // Geography
  { question: 'What is the capital of Australia?', correct_answer: 'Canberra', incorrect_answers: ['Sydney', 'Melbourne', 'Brisbane'], category: 'Geography', type: 'multiple', difficulty: 'medium' },
  { question: 'Which country has the most natural lakes in the world?', correct_answer: 'Canada', incorrect_answers: ['Russia', 'Finland', 'USA'], category: 'Geography', type: 'multiple', difficulty: 'medium' },
  { question: 'What is the smallest country in the world by area?', correct_answer: 'Vatican City', incorrect_answers: ['Monaco', 'San Marino', 'Liechtenstein'], category: 'Geography', type: 'multiple', difficulty: 'easy' },
  { question: 'Which ocean is the largest?', correct_answer: 'Pacific Ocean', incorrect_answers: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean'], category: 'Geography', type: 'multiple', difficulty: 'easy' },
  { question: 'What is the longest river in the world?', correct_answer: 'The Nile', incorrect_answers: ['The Amazon', 'The Yangtze', 'The Mississippi'], category: 'Geography', type: 'multiple', difficulty: 'easy' },
  { question: 'Which African country has the largest population?', correct_answer: 'Nigeria', incorrect_answers: ['Ethiopia', 'Egypt', 'South Africa'], category: 'Geography', type: 'multiple', difficulty: 'medium' },
  { question: 'What is the capital of Canada?', correct_answer: 'Ottawa', incorrect_answers: ['Toronto', 'Montreal', 'Vancouver'], category: 'Geography', type: 'multiple', difficulty: 'medium' },
  { question: 'Which mountain range contains Mount Everest?', correct_answer: 'The Himalayas', incorrect_answers: ['The Andes', 'The Alps', 'The Rockies'], category: 'Geography', type: 'multiple', difficulty: 'easy' },
  { question: 'How many countries are in Africa?', correct_answer: '54', incorrect_answers: ['44', '64', '49'], category: 'Geography', type: 'multiple', difficulty: 'hard' },
  { question: 'What is the capital of Brazil?', correct_answer: 'Brasília', incorrect_answers: ['Rio de Janeiro', 'São Paulo', 'Salvador'], category: 'Geography', type: 'multiple', difficulty: 'medium' },
  { question: 'Which country owns the Canary Islands?', correct_answer: 'Spain', incorrect_answers: ['Portugal', 'France', 'Morocco'], category: 'Geography', type: 'multiple', difficulty: 'medium' },
  { question: 'The Strait of Gibraltar separates Europe from which continent?', correct_answer: 'Africa', incorrect_answers: ['Asia', 'South America', 'North America'], category: 'Geography', type: 'multiple', difficulty: 'easy' },
  { question: 'Which city is known as the "City of Canals"?', correct_answer: 'Venice', incorrect_answers: ['Amsterdam', 'Bangkok', 'Stockholm'], category: 'Geography', type: 'multiple', difficulty: 'easy' },
  { question: 'What is the currency of Japan?', correct_answer: 'Yen', incorrect_answers: ['Won', 'Yuan', 'Ringgit'], category: 'Geography', type: 'multiple', difficulty: 'easy' },
  { question: 'Which country has the most time zones?', correct_answer: 'France', incorrect_answers: ['Russia', 'USA', 'China'], category: 'Geography', type: 'multiple', difficulty: 'hard' },

  // History
  { question: 'In which year did World War II end?', correct_answer: '1945', incorrect_answers: ['1944', '1946', '1943'], category: 'History', type: 'multiple', difficulty: 'easy' },
  { question: 'Who was the first person to walk on the Moon?', correct_answer: 'Neil Armstrong', incorrect_answers: ['Buzz Aldrin', 'Yuri Gagarin', 'Michael Collins'], category: 'History', type: 'multiple', difficulty: 'easy' },
  { question: 'Which empire was the largest in history by land area?', correct_answer: 'The Mongol Empire', incorrect_answers: ['The British Empire', 'The Roman Empire', 'The Ottoman Empire'], category: 'History', type: 'multiple', difficulty: 'medium' },
  { question: 'In which year did the French Revolution begin?', correct_answer: '1789', incorrect_answers: ['1776', '1804', '1815'], category: 'History', type: 'multiple', difficulty: 'medium' },
  { question: 'Who was the first President of the United States?', correct_answer: 'George Washington', incorrect_answers: ['Thomas Jefferson', 'John Adams', 'Benjamin Franklin'], category: 'History', type: 'multiple', difficulty: 'easy' },
  { question: 'What ancient wonder was located in Alexandria, Egypt?', correct_answer: 'The Lighthouse of Alexandria', incorrect_answers: ['The Colossus of Rhodes', 'The Temple of Artemis', 'The Hanging Gardens'], category: 'History', type: 'multiple', difficulty: 'medium' },
  { question: 'Which country did Adolf Hitler originally come from?', correct_answer: 'Austria', incorrect_answers: ['Germany', 'Poland', 'Hungary'], category: 'History', type: 'multiple', difficulty: 'medium' },
  { question: 'In which city was the Magna Carta signed?', correct_answer: 'Runnymede (near Windsor)', incorrect_answers: ['London', 'Canterbury', 'Oxford'], category: 'History', type: 'multiple', difficulty: 'hard' },
  { question: 'Who invented the telephone?', correct_answer: 'Alexander Graham Bell', incorrect_answers: ['Thomas Edison', 'Nikola Tesla', 'Guglielmo Marconi'], category: 'History', type: 'multiple', difficulty: 'easy' },
  { question: 'Which ancient civilisation built Machu Picchu?', correct_answer: 'The Inca', incorrect_answers: ['The Aztec', 'The Maya', 'The Olmec'], category: 'History', type: 'multiple', difficulty: 'easy' },
  { question: 'In what year did the Soviet Union collapse?', correct_answer: '1991', incorrect_answers: ['1989', '1985', '1993'], category: 'History', type: 'multiple', difficulty: 'medium' },
  { question: 'Who painted the Sistine Chapel ceiling?', correct_answer: 'Michelangelo', incorrect_answers: ['Leonardo da Vinci', 'Raphael', 'Botticelli'], category: 'History', type: 'multiple', difficulty: 'easy' },
  { question: 'Which country first granted women the right to vote nationally?', correct_answer: 'New Zealand', incorrect_answers: ['Australia', 'Finland', 'USA'], category: 'History', type: 'multiple', difficulty: 'hard' },
  { question: 'How many wives did King Henry VIII of England have?', correct_answer: '6', incorrect_answers: ['4', '5', '7'], category: 'History', type: 'multiple', difficulty: 'easy' },
  { question: 'The Trojan War was fought over which city?', correct_answer: 'Troy', incorrect_answers: ['Athens', 'Sparta', 'Corinth'], category: 'History', type: 'multiple', difficulty: 'easy' },

  // Science
  { question: 'What is the chemical symbol for gold?', correct_answer: 'Au', incorrect_answers: ['Ag', 'Gd', 'Go'], category: 'Science & Nature', type: 'multiple', difficulty: 'easy' },
  { question: 'How many bones are in the adult human body?', correct_answer: '206', incorrect_answers: ['186', '226', '196'], category: 'Science & Nature', type: 'multiple', difficulty: 'medium' },
  { question: 'What is the speed of light (approximately) in a vacuum?', correct_answer: '300,000 km/s', incorrect_answers: ['150,000 km/s', '500,000 km/s', '100,000 km/s'], category: 'Science & Nature', type: 'multiple', difficulty: 'medium' },
  { question: 'What is the most abundant gas in Earth\'s atmosphere?', correct_answer: 'Nitrogen', incorrect_answers: ['Oxygen', 'Carbon Dioxide', 'Argon'], category: 'Science & Nature', type: 'multiple', difficulty: 'medium' },
  { question: 'How many chromosomes do humans have?', correct_answer: '46', incorrect_answers: ['48', '44', '23'], category: 'Science & Nature', type: 'multiple', difficulty: 'medium' },
  { question: 'What planet is closest in size to Earth?', correct_answer: 'Venus', incorrect_answers: ['Mars', 'Mercury', 'Neptune'], category: 'Science & Nature', type: 'multiple', difficulty: 'medium' },
  { question: 'What is the hardest natural substance on Earth?', correct_answer: 'Diamond', incorrect_answers: ['Quartz', 'Corundum', 'Topaz'], category: 'Science & Nature', type: 'multiple', difficulty: 'easy' },
  { question: 'Which organ produces insulin?', correct_answer: 'The pancreas', incorrect_answers: ['The liver', 'The kidney', 'The thyroid'], category: 'Science & Nature', type: 'multiple', difficulty: 'medium' },
  { question: 'What is the atomic number of carbon?', correct_answer: '6', incorrect_answers: ['8', '12', '14'], category: 'Science & Nature', type: 'multiple', difficulty: 'medium' },
  { question: 'Which planet has the most moons?', correct_answer: 'Saturn', incorrect_answers: ['Jupiter', 'Uranus', 'Neptune'], category: 'Science & Nature', type: 'multiple', difficulty: 'medium' },
  { question: 'What is the chemical formula for water?', correct_answer: 'H₂O', incorrect_answers: ['HO₂', 'H₂O₂', 'HO'], category: 'Science & Nature', type: 'multiple', difficulty: 'easy' },
  { question: 'How long does light from the Sun take to reach Earth?', correct_answer: 'About 8 minutes', incorrect_answers: ['About 1 minute', 'About 30 minutes', 'About 1 hour'], category: 'Science & Nature', type: 'multiple', difficulty: 'medium' },
  { question: 'What is the largest organ in the human body?', correct_answer: 'The skin', incorrect_answers: ['The liver', 'The brain', 'The lungs'], category: 'Science & Nature', type: 'multiple', difficulty: 'easy' },
  { question: 'What force keeps planets in orbit around the Sun?', correct_answer: 'Gravity', incorrect_answers: ['Magnetism', 'Centrifugal force', 'Nuclear force'], category: 'Science & Nature', type: 'multiple', difficulty: 'easy' },
  { question: 'Which element is liquid at room temperature (besides mercury)?', correct_answer: 'Bromine', incorrect_answers: ['Phosphorus', 'Cesium', 'Gallium'], category: 'Science & Nature', type: 'multiple', difficulty: 'hard' },

  // Entertainment: Film
  { question: 'Which film won the first ever Academy Award for Best Picture?', correct_answer: 'Wings (1927)', incorrect_answers: ['All Quiet on the Western Front', 'The Broadway Melody', 'Grand Hotel'], category: 'Entertainment: Film', type: 'multiple', difficulty: 'hard' },
  { question: 'Who directed the movie "Schindler\'s List"?', correct_answer: 'Steven Spielberg', incorrect_answers: ['Martin Scorsese', 'Stanley Kubrick', 'Francis Ford Coppola'], category: 'Entertainment: Film', type: 'multiple', difficulty: 'medium' },
  { question: 'In which year was the first Star Wars film released?', correct_answer: '1977', incorrect_answers: ['1975', '1979', '1980'], category: 'Entertainment: Film', type: 'multiple', difficulty: 'easy' },
  { question: 'Which actor has won the most Academy Awards for acting?', correct_answer: 'Meryl Streep (3 wins)', incorrect_answers: ['Katherine Hepburn (4 wins)', 'Daniel Day-Lewis (3 wins)', 'Jack Nicholson (3 wins)'], category: 'Entertainment: Film', type: 'multiple', difficulty: 'hard' },
  { question: 'What was the highest-grossing film of all time before Avatar?', correct_answer: 'Titanic', incorrect_answers: ['The Avengers', 'Jurassic Park', 'The Lion King'], category: 'Entertainment: Film', type: 'multiple', difficulty: 'medium' },
  { question: 'Who played Iron Man in the Marvel Cinematic Universe?', correct_answer: 'Robert Downey Jr.', incorrect_answers: ['Chris Evans', 'Chris Hemsworth', 'Mark Ruffalo'], category: 'Entertainment: Film', type: 'multiple', difficulty: 'easy' },
  { question: 'Which James Bond film features the villain Goldfinger?', correct_answer: 'Goldfinger (1964)', incorrect_answers: ['Thunderball', 'Dr. No', 'From Russia with Love'], category: 'Entertainment: Film', type: 'multiple', difficulty: 'medium' },
  { question: 'What is the name of the toy cowboy in Toy Story?', correct_answer: 'Woody', incorrect_answers: ['Buzz', 'Rex', 'Jesse'], category: 'Entertainment: Film', type: 'multiple', difficulty: 'easy' },
  { question: 'Which film features the line "I\'ll be back"?', correct_answer: 'The Terminator', incorrect_answers: ['RoboCop', 'Predator', 'Total Recall'], category: 'Entertainment: Film', type: 'multiple', difficulty: 'easy' },
  { question: 'Who directed "The Dark Knight" (2008)?', correct_answer: 'Christopher Nolan', incorrect_answers: ['Tim Burton', 'Zack Snyder', 'Joel Schumacher'], category: 'Entertainment: Film', type: 'multiple', difficulty: 'easy' },

  // Entertainment: Music
  { question: 'Which band\'s members included Freddie Mercury, Brian May, Roger Taylor and John Deacon?', correct_answer: 'Queen', incorrect_answers: ['Led Zeppelin', 'The Who', 'Deep Purple'], category: 'Entertainment: Music', type: 'multiple', difficulty: 'easy' },
  { question: 'What nationality is the singer Shakira?', correct_answer: 'Colombian', incorrect_answers: ['Venezuelan', 'Brazilian', 'Argentine'], category: 'Entertainment: Music', type: 'multiple', difficulty: 'medium' },
  { question: 'Which instrument does Yo-Yo Ma famously play?', correct_answer: 'Cello', incorrect_answers: ['Violin', 'Viola', 'Double bass'], category: 'Entertainment: Music', type: 'multiple', difficulty: 'medium' },
  { question: 'What was the name of Adele\'s debut album?', correct_answer: '19', incorrect_answers: ['21', '25', '30'], category: 'Entertainment: Music', type: 'multiple', difficulty: 'medium' },
  { question: 'Which composer wrote "The Four Seasons"?', correct_answer: 'Antonio Vivaldi', incorrect_answers: ['Johann Sebastian Bach', 'George Frideric Handel', 'Wolfgang Amadeus Mozart'], category: 'Entertainment: Music', type: 'multiple', difficulty: 'medium' },
  { question: 'Who was the lead singer of Nirvana?', correct_answer: 'Kurt Cobain', incorrect_answers: ['Dave Grohl', 'Krist Novoselic', 'Eddie Vedder'], category: 'Entertainment: Music', type: 'multiple', difficulty: 'easy' },
  { question: 'Which country does the band ABBA come from?', correct_answer: 'Sweden', incorrect_answers: ['Norway', 'Denmark', 'Finland'], category: 'Entertainment: Music', type: 'multiple', difficulty: 'easy' },
  { question: 'What is the best-selling album of all time?', correct_answer: 'Thriller by Michael Jackson', incorrect_answers: ['Back in Black by AC/DC', 'The Dark Side of the Moon by Pink Floyd', 'Hotel California by Eagles'], category: 'Entertainment: Music', type: 'multiple', difficulty: 'easy' },
  { question: 'In what decade did Elvis Presley first become famous?', correct_answer: '1950s', incorrect_answers: ['1940s', '1960s', '1970s'], category: 'Entertainment: Music', type: 'multiple', difficulty: 'easy' },
  { question: 'Which rapper\'s real name is Shawn Carter?', correct_answer: 'Jay-Z', incorrect_answers: ['Kanye West', 'Eminem', 'Nas'], category: 'Entertainment: Music', type: 'multiple', difficulty: 'medium' },

  // Sports
  { question: 'How many players are on a standard rugby union team?', correct_answer: '15', incorrect_answers: ['13', '11', '17'], category: 'Sports', type: 'multiple', difficulty: 'easy' },
  { question: 'In which country were the 2016 Summer Olympics held?', correct_answer: 'Brazil', incorrect_answers: ['Greece', 'China', 'UK'], category: 'Sports', type: 'multiple', difficulty: 'easy' },
  { question: 'How many Grand Slam titles did Roger Federer win?', correct_answer: '20', incorrect_answers: ['17', '18', '22'], category: 'Sports', type: 'multiple', difficulty: 'medium' },
  { question: 'Which country invented the sport of cricket?', correct_answer: 'England', incorrect_answers: ['India', 'Australia', 'West Indies'], category: 'Sports', type: 'multiple', difficulty: 'easy' },
  { question: 'What is the maximum break in snooker?', correct_answer: '147', incorrect_answers: ['145', '150', '155'], category: 'Sports', type: 'multiple', difficulty: 'medium' },
  { question: 'How often are the Summer Olympic Games held?', correct_answer: 'Every 4 years', incorrect_answers: ['Every 2 years', 'Every 3 years', 'Every 5 years'], category: 'Sports', type: 'multiple', difficulty: 'easy' },
  { question: 'Which team has won the most FIFA World Cups?', correct_answer: 'Brazil (5 times)', incorrect_answers: ['Germany (4 times)', 'Italy (4 times)', 'Argentina (3 times)'], category: 'Sports', type: 'multiple', difficulty: 'medium' },
  { question: 'In athletics, how many laps of a standard track make 1500 metres?', correct_answer: '3¾ laps', incorrect_answers: ['3 laps', '4 laps', '3½ laps'], category: 'Sports', type: 'multiple', difficulty: 'hard' },
  { question: 'What is the governing body of world football?', correct_answer: 'FIFA', incorrect_answers: ['UEFA', 'IOC', 'IAAF'], category: 'Sports', type: 'multiple', difficulty: 'easy' },
  { question: 'Which sport uses a shuttlecock?', correct_answer: 'Badminton', incorrect_answers: ['Squash', 'Racquetball', 'Pickleball'], category: 'Sports', type: 'multiple', difficulty: 'easy' },

  // General Knowledge
  { question: 'How many sides does a hexagon have?', correct_answer: '6', incorrect_answers: ['5', '7', '8'], category: 'General Knowledge', type: 'multiple', difficulty: 'easy' },
  { question: 'What is the most widely spoken language in the world by native speakers?', correct_answer: 'Mandarin Chinese', incorrect_answers: ['English', 'Spanish', 'Hindi'], category: 'General Knowledge', type: 'multiple', difficulty: 'medium' },
  { question: 'How many colours are in a rainbow?', correct_answer: '7', incorrect_answers: ['6', '8', '5'], category: 'General Knowledge', type: 'multiple', difficulty: 'easy' },
  { question: 'What is the most popular sport in the world?', correct_answer: 'Association Football (Soccer)', incorrect_answers: ['Cricket', 'Basketball', 'Tennis'], category: 'General Knowledge', type: 'multiple', difficulty: 'easy' },
  { question: 'What is the name of the longest bone in the human body?', correct_answer: 'Femur (thigh bone)', incorrect_answers: ['Tibia', 'Humerus', 'Radius'], category: 'General Knowledge', type: 'multiple', difficulty: 'medium' },
  { question: 'How many keys does a standard piano have?', correct_answer: '88', incorrect_answers: ['76', '96', '84'], category: 'General Knowledge', type: 'multiple', difficulty: 'medium' },
  { question: 'What is the most expensive spice in the world by weight?', correct_answer: 'Saffron', incorrect_answers: ['Vanilla', 'Cardamom', 'Truffle'], category: 'General Knowledge', type: 'multiple', difficulty: 'medium' },
  { question: 'How many Oscars did the film "Titanic" win?', correct_answer: '11', incorrect_answers: ['7', '9', '14'], category: 'General Knowledge', type: 'multiple', difficulty: 'medium' },
  { question: 'What is the square root of 144?', correct_answer: '12', incorrect_answers: ['11', '13', '14'], category: 'General Knowledge', type: 'multiple', difficulty: 'easy' },
  { question: 'In which decade was the internet made publicly available?', correct_answer: '1990s', incorrect_answers: ['1980s', '1970s', '2000s'], category: 'General Knowledge', type: 'multiple', difficulty: 'easy' },
  { question: 'What is the chemical symbol for iron?', correct_answer: 'Fe', incorrect_answers: ['Ir', 'In', 'Io'], category: 'General Knowledge', type: 'multiple', difficulty: 'medium' },
  { question: 'Who wrote the play "Romeo and Juliet"?', correct_answer: 'William Shakespeare', incorrect_answers: ['Christopher Marlowe', 'Ben Jonson', 'John Webster'], category: 'General Knowledge', type: 'multiple', difficulty: 'easy' },
  { question: 'How many strings does a standard violin have?', correct_answer: '4', incorrect_answers: ['3', '5', '6'], category: 'General Knowledge', type: 'multiple', difficulty: 'easy' },
  { question: 'What is the world\'s largest hot desert?', correct_answer: 'The Sahara', incorrect_answers: ['The Arabian Desert', 'The Gobi Desert', 'The Kalahari'], category: 'General Knowledge', type: 'multiple', difficulty: 'easy' },
  { question: 'Which planet is known as the Red Planet?', correct_answer: 'Mars', incorrect_answers: ['Jupiter', 'Venus', 'Saturn'], category: 'General Knowledge', type: 'multiple', difficulty: 'easy' },
]

export function getLocalTrivia(amount: number, type: 'boolean' | 'multiple' | 'any' = 'any'): TriviaQuestion[] {
  let pool: TriviaQuestion[]
  if (type === 'boolean') pool = LOCAL_TRUE_FALSE
  else if (type === 'multiple') pool = LOCAL_MULTIPLE_CHOICE
  else pool = [...LOCAL_TRUE_FALSE, ...LOCAL_MULTIPLE_CHOICE]

  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(amount, shuffled.length))
}
