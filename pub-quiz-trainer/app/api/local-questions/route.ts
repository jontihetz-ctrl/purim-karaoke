import { NextRequest, NextResponse } from 'next/server'

interface Q {
  question: string
  correct_answer: string
  incorrect_answers: string[]
  category: string
  difficulty: string
}

const BANKS: Record<string, Q[]> = {
  GB: [
    { question: 'Which river flows through London?', correct_answer: 'Thames', incorrect_answers: ['Severn', 'Trent', 'Avon'], category: 'UK Geography', difficulty: 'easy' },
    { question: 'How many countries make up the United Kingdom?', correct_answer: 'Four', incorrect_answers: ['Three', 'Five', 'Two'], category: 'UK', difficulty: 'easy' },
    { question: 'What year was the Great Fire of London?', correct_answer: '1666', incorrect_answers: ['1567', ' 1756', '1588'], category: 'UK History', difficulty: 'medium' },
    { question: 'Which football club has won the most Premier League titles?', correct_answer: 'Manchester United', incorrect_answers: ['Liverpool', 'Arsenal', 'Chelsea'], category: 'UK Sport', difficulty: 'medium' },
    { question: 'Who is the patron saint of England?', correct_answer: 'St George', incorrect_answers: ['St Andrew', 'St Patrick', 'St David'], category: 'UK', difficulty: 'easy' },
    { question: 'In which city is the Scottish Parliament located?', correct_answer: 'Edinburgh', incorrect_answers: ['Glasgow', 'Aberdeen', 'Dundee'], category: 'UK Geography', difficulty: 'easy' },
    { question: 'Which British band released the album Abbey Road?', correct_answer: 'The Beatles', incorrect_answers: ['The Rolling Stones', 'Led Zeppelin', 'The Who'], category: 'UK Music', difficulty: 'easy' },
    { question: 'What is the tallest mountain in the UK?', correct_answer: 'Ben Nevis', incorrect_answers: ['Scafell Pike', 'Snowdon', 'Helvellyn'], category: 'UK Geography', difficulty: 'medium' },
    { question: 'Who wrote Pride and Prejudice?', correct_answer: 'Jane Austen', incorrect_answers: ['Charlotte Brontë', 'Mary Shelley', 'George Eliot'], category: 'UK Literature', difficulty: 'easy' },
    { question: 'What is the national animal of Scotland?', correct_answer: 'Unicorn', incorrect_answers: ['Stag', 'Lion', 'Bear'], category: 'UK', difficulty: 'medium' },
    { question: 'Which UK city hosted the 2012 Summer Olympics?', correct_answer: 'London', incorrect_answers: ['Manchester', 'Birmingham', 'Glasgow'], category: 'UK Sport', difficulty: 'easy' },
    { question: 'What is the longest river in the UK?', correct_answer: 'River Severn', incorrect_answers: ['River Thames', 'River Trent', 'River Aire'], category: 'UK Geography', difficulty: 'medium' },
  ],
  US: [
    { question: 'How many stripes are on the American flag?', correct_answer: '13', incorrect_answers: ['50', '12', '15'], category: 'US', difficulty: 'easy' },
    { question: 'What is the largest US state by area?', correct_answer: 'Alaska', incorrect_answers: ['Texas', 'California', 'Montana'], category: 'US Geography', difficulty: 'easy' },
    { question: 'Who was the first US President?', correct_answer: 'George Washington', incorrect_answers: ['Thomas Jefferson', 'John Adams', 'Benjamin Franklin'], category: 'US History', difficulty: 'easy' },
    { question: 'What year did the US declare independence?', correct_answer: '1776', incorrect_answers: ['1766', '1786', '1812'], category: 'US History', difficulty: 'easy' },
    { question: 'What is the capital of the United States?', correct_answer: 'Washington D.C.', incorrect_answers: ['New York', 'Chicago', 'Los Angeles'], category: 'US Geography', difficulty: 'easy' },
    { question: 'How many states are in the US?', correct_answer: '50', incorrect_answers: ['48', '52', '46'], category: 'US', difficulty: 'easy' },
    { question: 'Which team has won the most Super Bowls?', correct_answer: 'New England Patriots', incorrect_answers: ['Pittsburgh Steelers', 'Dallas Cowboys', 'San Francisco 49ers'], category: 'US Sport', difficulty: 'medium' },
    { question: 'On which US bill does Benjamin Franklin appear?', correct_answer: '$100', incorrect_answers: ['$50', '$20', '$10'], category: 'US', difficulty: 'medium' },
    { question: 'Which US state is known as the Sunshine State?', correct_answer: 'Florida', incorrect_answers: ['California', 'Arizona', 'Hawaii'], category: 'US Geography', difficulty: 'easy' },
    { question: 'What is the name of the river that flows through the Grand Canyon?', correct_answer: 'Colorado River', incorrect_answers: ['Missouri River', 'Snake River', 'Rio Grande'], category: 'US Geography', difficulty: 'medium' },
    { question: 'Which city is known as the Windy City?', correct_answer: 'Chicago', incorrect_answers: ['New York', 'Dallas', 'Boston'], category: 'US', difficulty: 'easy' },
    { question: 'Who was the 16th US President?', correct_answer: 'Abraham Lincoln', incorrect_answers: ['Andrew Jackson', 'Ulysses S. Grant', 'James Polk'], category: 'US History', difficulty: 'medium' },
  ],
  IL: [
    { question: 'In what year was the State of Israel established?', correct_answer: '1948', incorrect_answers: ['1945', '1952', '1967'], category: 'Israel', difficulty: 'easy' },
    { question: 'What is the currency of Israel?', correct_answer: 'New Israeli Shekel', incorrect_answers: ['Euro', 'Dinar', 'Pound'], category: 'Israel', difficulty: 'easy' },
    { question: 'What is the capital of Israel?', correct_answer: 'Jerusalem', incorrect_answers: ['Tel Aviv', 'Haifa', 'Beersheba'], category: 'Israel', difficulty: 'easy' },
    { question: 'Which sea borders Israel to the west?', correct_answer: 'Mediterranean Sea', incorrect_answers: ['Red Sea', 'Dead Sea', 'Sea of Galilee'], category: 'Israel Geography', difficulty: 'easy' },
    { question: 'Who was Israel\'s first Prime Minister?', correct_answer: 'David Ben-Gurion', incorrect_answers: ['Golda Meir', 'Moshe Sharett', 'Levi Eshkol'], category: 'Israel History', difficulty: 'medium' },
    { question: 'Which Israeli city is famous for its Bahá\'í Gardens?', correct_answer: 'Haifa', incorrect_answers: ['Jerusalem', 'Tel Aviv', 'Acre'], category: 'Israel', difficulty: 'medium' },
    { question: 'What is the lowest point on Earth, bordering Israel and Jordan?', correct_answer: 'Dead Sea', incorrect_answers: ['Sea of Galilee', 'Red Sea', 'Mediterranean'], category: 'Israel Geography', difficulty: 'easy' },
    { question: 'Which Israeli city is known as the "White City" for its Bauhaus architecture?', correct_answer: 'Tel Aviv', incorrect_answers: ['Jerusalem', 'Haifa', 'Herzliya'], category: 'Israel', difficulty: 'medium' },
    { question: 'What is the national airline of Israel?', correct_answer: 'El Al', incorrect_answers: ['Arkia', 'Israir', 'Ryanair'], category: 'Israel', difficulty: 'easy' },
    { question: 'In which city is the Yad Vashem Holocaust memorial located?', correct_answer: 'Jerusalem', incorrect_answers: ['Tel Aviv', 'Haifa', 'Beersheba'], category: 'Israel', difficulty: 'medium' },
    { question: 'What is Israel\'s national sport?', correct_answer: 'Football (Soccer)', incorrect_answers: ['Basketball', 'Tennis', 'Athletics'], category: 'Israel Sport', difficulty: 'medium' },
    { question: 'Which ancient fortress in Israel is the site of the famous last stand against Rome?', correct_answer: 'Masada', incorrect_answers: ['Acre', 'Caesarea', 'Jericho'], category: 'Israel History', difficulty: 'medium' },
  ],
  AU: [
    { question: 'What is the capital of Australia?', correct_answer: 'Canberra', incorrect_answers: ['Sydney', 'Melbourne', 'Brisbane'], category: 'Australia', difficulty: 'easy' },
    { question: 'What is the largest city in Australia?', correct_answer: 'Sydney', incorrect_answers: ['Melbourne', 'Brisbane', 'Perth'], category: 'Australia', difficulty: 'easy' },
    { question: 'What year did Australia become a federation?', correct_answer: '1901', incorrect_answers: ['1888', '1914', '1927'], category: 'Australia History', difficulty: 'medium' },
    { question: 'In which state is the Great Barrier Reef located?', correct_answer: 'Queensland', incorrect_answers: ['New South Wales', 'Victoria', 'Northern Territory'], category: 'Australia Geography', difficulty: 'medium' },
    { question: 'Which city hosted the 2000 Summer Olympics?', correct_answer: 'Sydney', incorrect_answers: ['Melbourne', 'Brisbane', 'Adelaide'], category: 'Australia Sport', difficulty: 'easy' },
    { question: 'What is Australia\'s currency?', correct_answer: 'Australian Dollar', incorrect_answers: ['New Zealand Dollar', 'Pound', 'Euro'], category: 'Australia', difficulty: 'easy' },
    { question: 'What is the name of the large sandstone rock in Australia\'s Northern Territory?', correct_answer: 'Uluru', incorrect_answers: ['Devils Marbles', 'Wave Rock', 'Kings Canyon'], category: 'Australia Geography', difficulty: 'easy' },
    { question: 'Which animal appears on the Australian coat of arms alongside the kangaroo?', correct_answer: 'Emu', incorrect_answers: ['Koala', 'Wombat', 'Platypus'], category: 'Australia', difficulty: 'medium' },
    { question: 'What is the longest river in Australia?', correct_answer: 'Murray River', incorrect_answers: ['Darling River', 'Murrumbidgee River', 'Lachlan River'], category: 'Australia Geography', difficulty: 'medium' },
    { question: 'Who designed the Sydney Opera House?', correct_answer: 'Jørn Utzon', incorrect_answers: ['Frank Lloyd Wright', 'Norman Foster', 'Renzo Piano'], category: 'Australia', difficulty: 'hard' },
  ],
  CA: [
    { question: 'What is the capital of Canada?', correct_answer: 'Ottawa', incorrect_answers: ['Toronto', 'Vancouver', 'Montreal'], category: 'Canada', difficulty: 'easy' },
    { question: 'What is the most populated city in Canada?', correct_answer: 'Toronto', incorrect_answers: ['Montreal', 'Vancouver', 'Calgary'], category: 'Canada Geography', difficulty: 'easy' },
    { question: 'How many provinces does Canada have?', correct_answer: '10', incorrect_answers: ['12', '9', '13'], category: 'Canada', difficulty: 'easy' },
    { question: 'Which city hosted the 2010 Winter Olympics?', correct_answer: 'Vancouver', incorrect_answers: ['Calgary', 'Montreal', 'Toronto'], category: 'Canada Sport', difficulty: 'medium' },
    { question: 'What is Canada\'s national summer sport?', correct_answer: 'Lacrosse', incorrect_answers: ['Ice Hockey', 'Football', 'Basketball'], category: 'Canada Sport', difficulty: 'medium' },
    { question: 'What is the longest river in Canada?', correct_answer: 'Mackenzie River', incorrect_answers: ['St. Lawrence River', 'Yukon River', 'Columbia River'], category: 'Canada Geography', difficulty: 'hard' },
    { question: 'Who is on the Canadian $10 bill?', correct_answer: 'Viola Desmond', incorrect_answers: ['Wilfrid Laurier', 'John A. Macdonald', 'Queen Elizabeth II'], category: 'Canada', difficulty: 'hard' },
    { question: 'In what year did Canada become a self-governing dominion?', correct_answer: '1867', incorrect_answers: ['1776', '1901', '1931'], category: 'Canada History', difficulty: 'medium' },
  ],
  IE: [
    { question: 'What is the capital of Ireland?', correct_answer: 'Dublin', incorrect_answers: ['Cork', 'Galway', 'Limerick'], category: 'Ireland', difficulty: 'easy' },
    { question: 'Who is the patron saint of Ireland?', correct_answer: 'St Patrick', incorrect_answers: ['St Brigid', 'St Columba', 'St Kevin'], category: 'Ireland', difficulty: 'easy' },
    { question: 'What instrument is Ireland\'s national symbol?', correct_answer: 'Harp', incorrect_answers: ['Shamrock', 'Celtic Cross', 'Claddagh'], category: 'Ireland', difficulty: 'medium' },
    { question: 'What is the traditional Irish sport played with a stick and a small ball?', correct_answer: 'Hurling', incorrect_answers: ['Gaelic Football', 'Shinty', 'Camogie'], category: 'Ireland Sport', difficulty: 'medium' },
    { question: 'What is the name of Ireland\'s famous coastal tourist route?', correct_answer: 'Wild Atlantic Way', incorrect_answers: ['Ring of Kerry', 'Causeway Coastal Route', 'Emerald Trail'], category: 'Ireland', difficulty: 'medium' },
    { question: 'What is the currency of Ireland?', correct_answer: 'Euro', incorrect_answers: ['Pound', 'Dollar', 'Punt'], category: 'Ireland', difficulty: 'easy' },
    { question: 'Which Irish county is the largest by area?', correct_answer: 'Cork', incorrect_answers: ['Galway', 'Mayo', 'Tipperary'], category: 'Ireland Geography', difficulty: 'hard' },
  ],
  ZA: [
    { question: 'What is the administrative capital of South Africa?', correct_answer: 'Pretoria', incorrect_answers: ['Cape Town', 'Johannesburg', 'Durban'], category: 'South Africa', difficulty: 'medium' },
    { question: 'How many official languages does South Africa have?', correct_answer: '11', incorrect_answers: ['10', '12', '9'], category: 'South Africa', difficulty: 'medium' },
    { question: 'What is the currency of South Africa?', correct_answer: 'Rand', incorrect_answers: ['Dollar', 'Pound', 'Kwacha'], category: 'South Africa', difficulty: 'easy' },
    { question: 'Who became South Africa\'s first democratically elected President in 1994?', correct_answer: 'Nelson Mandela', incorrect_answers: ['Thabo Mbeki', 'F.W. de Klerk', 'Cyril Ramaphosa'], category: 'South Africa History', difficulty: 'easy' },
    { question: 'Which South African city is known as the "Mother City"?', correct_answer: 'Cape Town', incorrect_answers: ['Johannesburg', 'Durban', 'Port Elizabeth'], category: 'South Africa', difficulty: 'medium' },
    { question: 'What is the name of the famous prison island where Mandela was held?', correct_answer: 'Robben Island', incorrect_answers: ['Alcatraz', 'Snake Island', 'Dassen Island'], category: 'South Africa History', difficulty: 'easy' },
  ],
  IN: [
    { question: 'What is the capital of India?', correct_answer: 'New Delhi', incorrect_answers: ['Mumbai', 'Kolkata', 'Chennai'], category: 'India', difficulty: 'easy' },
    { question: 'In what year did India gain independence?', correct_answer: '1947', incorrect_answers: ['1935', '1952', '1942'], category: 'India History', difficulty: 'easy' },
    { question: 'Who was the first Prime Minister of India?', correct_answer: 'Jawaharlal Nehru', incorrect_answers: ['Mahatma Gandhi', 'Sardar Patel', 'Lal Bahadur Shastri'], category: 'India History', difficulty: 'easy' },
    { question: 'What is the currency of India?', correct_answer: 'Rupee', incorrect_answers: ['Taka', 'Rial', 'Baht'], category: 'India', difficulty: 'easy' },
    { question: 'Which river is considered most sacred in Hinduism?', correct_answer: 'Ganges', incorrect_answers: ['Yamuna', 'Brahmaputra', 'Indus'], category: 'India', difficulty: 'easy' },
    { question: 'In which city is the Taj Mahal located?', correct_answer: 'Agra', incorrect_answers: ['Delhi', 'Jaipur', 'Lucknow'], category: 'India', difficulty: 'easy' },
    { question: 'What is the national sport of India?', correct_answer: 'Field Hockey', incorrect_answers: ['Cricket', 'Kabaddi', 'Chess'], category: 'India Sport', difficulty: 'medium' },
    { question: 'Which is the most populous city in India?', correct_answer: 'Mumbai', incorrect_answers: ['Delhi', 'Kolkata', 'Bangalore'], category: 'India Geography', difficulty: 'medium' },
  ],
  DE: [
    { question: 'What is the capital of Germany?', correct_answer: 'Berlin', incorrect_answers: ['Munich', 'Frankfurt', 'Hamburg'], category: 'Germany', difficulty: 'easy' },
    { question: 'What is Germany\'s federal parliament called?', correct_answer: 'Bundestag', incorrect_answers: ['Reichstag', 'Bundesrat', 'Landtag'], category: 'Germany', difficulty: 'medium' },
    { question: 'Which German city is famous for Oktoberfest?', correct_answer: 'Munich', incorrect_answers: ['Berlin', 'Frankfurt', 'Hamburg'], category: 'Germany', difficulty: 'easy' },
    { question: 'What year did the Berlin Wall fall?', correct_answer: '1989', incorrect_answers: ['1991', '1987', '1985'], category: 'Germany History', difficulty: 'easy' },
    { question: 'Which German city is the country\'s financial hub?', correct_answer: 'Frankfurt', incorrect_answers: ['Berlin', 'Hamburg', 'Munich'], category: 'Germany', difficulty: 'medium' },
    { question: 'Who invented the printing press around 1440?', correct_answer: 'Johannes Gutenberg', incorrect_answers: ['Martin Luther', 'Albert Einstein', 'Max Planck'], category: 'Germany History', difficulty: 'medium' },
  ],
  FR: [
    { question: 'What is the capital of France?', correct_answer: 'Paris', incorrect_answers: ['Lyon', 'Marseille', 'Nice'], category: 'France', difficulty: 'easy' },
    { question: 'What year was the French Revolution?', correct_answer: '1789', incorrect_answers: ['1776', '1799', '1804'], category: 'France History', difficulty: 'medium' },
    { question: 'Who designed the Eiffel Tower?', correct_answer: 'Gustave Eiffel', incorrect_answers: ['Baron Haussmann', 'Le Corbusier', 'Auguste Perret'], category: 'France', difficulty: 'medium' },
    { question: 'What is France\'s famous long-distance cycling race?', correct_answer: 'Tour de France', incorrect_answers: ['Paris-Roubaix', 'Giro d\'Italia', 'Vuelta a España'], category: 'France Sport', difficulty: 'easy' },
    { question: 'Which French city is famous for its wine region?', correct_answer: 'Bordeaux', incorrect_answers: ['Lyon', 'Strasbourg', 'Toulouse'], category: 'France', difficulty: 'medium' },
    { question: 'What is the national motto of France?', correct_answer: 'Liberté, Égalité, Fraternité', incorrect_answers: ['Dieu et mon droit', 'Honneur et Patrie', 'Liberté et Justice'], category: 'France', difficulty: 'medium' },
  ],
  NZ: [
    { question: 'What is the capital of New Zealand?', correct_answer: 'Wellington', incorrect_answers: ['Auckland', 'Christchurch', 'Hamilton'], category: 'New Zealand', difficulty: 'easy' },
    { question: 'What is New Zealand\'s famous rugby team called?', correct_answer: 'All Blacks', incorrect_answers: ['Springboks', 'Wallabies', 'Lions'], category: 'New Zealand Sport', difficulty: 'easy' },
    { question: 'What is the indigenous name for New Zealand?', correct_answer: 'Aotearoa', incorrect_answers: ['Maoriland', 'Te Reo', 'Waitangi'], category: 'New Zealand', difficulty: 'medium' },
    { question: 'Which mountain range runs the length of New Zealand\'s South Island?', correct_answer: 'Southern Alps', incorrect_answers: ['North Island Volcanic Plateau', 'Kaikoura Ranges', 'Tararua Range'], category: 'New Zealand Geography', difficulty: 'medium' },
    { question: 'What is the currency of New Zealand?', correct_answer: 'New Zealand Dollar', incorrect_answers: ['Australian Dollar', 'Pound', 'Euro'], category: 'New Zealand', difficulty: 'easy' },
  ],
}

// Countries that share UK questions (crown dependencies etc.)
const COUNTRY_MAP: Record<string, string> = {
  GB: 'GB', UK: 'GB',
  US: 'US',
  IL: 'IL',
  AU: 'AU',
  CA: 'CA',
  IE: 'IE',
  ZA: 'ZA',
  IN: 'IN',
  DE: 'DE',
  FR: 'FR',
  NZ: 'NZ',
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export async function GET(req: NextRequest) {
  // Detect country from Vercel's header (populated automatically in production)
  const vercelCountry = req.headers.get('x-vercel-ip-country') || ''
  const queryCountry = req.nextUrl.searchParams.get('country') || ''
  const detectOnly = req.nextUrl.searchParams.get('detect') === '1'

  const country = (queryCountry || vercelCountry).toUpperCase()

  if (detectOnly) {
    return NextResponse.json({ country: COUNTRY_MAP[country] || '' })
  }

  const bank = BANKS[COUNTRY_MAP[country] || '']
  if (!bank || bank.length === 0) {
    return NextResponse.json({ questions: [] })
  }

  const picked = shuffle(bank).slice(0, 4)
  const questions = picked.map(q => ({
    category: q.category,
    type: 'multiple',
    difficulty: q.difficulty,
    question: q.question,
    correct_answer: q.correct_answer,
    incorrect_answers: q.incorrect_answers,
  }))

  return NextResponse.json({ questions })
}
