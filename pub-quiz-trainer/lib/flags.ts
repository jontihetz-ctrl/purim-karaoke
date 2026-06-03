import type { TriviaQuestion } from '@/types'

const COUNTRIES = [
  { code: 'us', name: 'United States' }, { code: 'gb', name: 'United Kingdom' },
  { code: 'fr', name: 'France' }, { code: 'de', name: 'Germany' },
  { code: 'jp', name: 'Japan' }, { code: 'cn', name: 'China' },
  { code: 'in', name: 'India' }, { code: 'br', name: 'Brazil' },
  { code: 'au', name: 'Australia' }, { code: 'ca', name: 'Canada' },
  { code: 'ru', name: 'Russia' }, { code: 'it', name: 'Italy' },
  { code: 'es', name: 'Spain' }, { code: 'mx', name: 'Mexico' },
  { code: 'kr', name: 'South Korea' }, { code: 'za', name: 'South Africa' },
  { code: 'ar', name: 'Argentina' }, { code: 'ng', name: 'Nigeria' },
  { code: 'eg', name: 'Egypt' }, { code: 'sa', name: 'Saudi Arabia' },
  { code: 'tr', name: 'Turkey' }, { code: 'pk', name: 'Pakistan' },
  { code: 'id', name: 'Indonesia' }, { code: 'ph', name: 'Philippines' },
  { code: 'th', name: 'Thailand' }, { code: 'vn', name: 'Vietnam' },
  { code: 'pl', name: 'Poland' }, { code: 'nl', name: 'Netherlands' },
  { code: 'se', name: 'Sweden' }, { code: 'ch', name: 'Switzerland' },
  { code: 'no', name: 'Norway' }, { code: 'fi', name: 'Finland' },
  { code: 'dk', name: 'Denmark' }, { code: 'pt', name: 'Portugal' },
  { code: 'gr', name: 'Greece' }, { code: 'be', name: 'Belgium' },
  { code: 'at', name: 'Austria' }, { code: 'cz', name: 'Czech Republic' },
  { code: 'ro', name: 'Romania' }, { code: 'hu', name: 'Hungary' },
  { code: 'nz', name: 'New Zealand' }, { code: 'sg', name: 'Singapore' },
  { code: 'my', name: 'Malaysia' }, { code: 'il', name: 'Israel' },
  { code: 'ae', name: 'UAE' }, { code: 'ir', name: 'Iran' },
  { code: 'ma', name: 'Morocco' }, { code: 'ke', name: 'Kenya' },
  { code: 'gh', name: 'Ghana' }, { code: 'et', name: 'Ethiopia' },
  { code: 'co', name: 'Colombia' }, { code: 'cl', name: 'Chile' },
  { code: 'pe', name: 'Peru' }, { code: 've', name: 'Venezuela' },
  { code: 'ua', name: 'Ukraine' }, { code: 'kz', name: 'Kazakhstan' },
  { code: 'cu', name: 'Cuba' }, { code: 'jm', name: 'Jamaica' },
  { code: 'ie', name: 'Ireland' }, { code: 'sk', name: 'Slovakia' },
  { code: 'hr', name: 'Croatia' }, { code: 'rs', name: 'Serbia' },
  { code: 'bg', name: 'Bulgaria' }, { code: 'lt', name: 'Lithuania' },
  { code: 'lv', name: 'Latvia' }, { code: 'ee', name: 'Estonia' },
  { code: 'si', name: 'Slovenia' }, { code: 'ba', name: 'Bosnia' },
  { code: 'al', name: 'Albania' }, { code: 'mk', name: 'North Macedonia' },
  { code: 'is', name: 'Iceland' }, { code: 'lu', name: 'Luxembourg' },
  { code: 'mt', name: 'Malta' }, { code: 'cy', name: 'Cyprus' },
  { code: 'tn', name: 'Tunisia' }, { code: 'dz', name: 'Algeria' },
  { code: 'ly', name: 'Libya' }, { code: 'sd', name: 'Sudan' },
  { code: 'ug', name: 'Uganda' }, { code: 'tz', name: 'Tanzania' },
  { code: 'mz', name: 'Mozambique' }, { code: 'zm', name: 'Zambia' },
  { code: 'zw', name: 'Zimbabwe' }, { code: 'bw', name: 'Botswana' },
  { code: 'sn', name: 'Senegal' }, { code: 'ci', name: "Ivory Coast" },
  { code: 'cm', name: 'Cameroon' }, { code: 'ao', name: 'Angola' },
  { code: 'iq', name: 'Iraq' }, { code: 'sy', name: 'Syria' },
  { code: 'jo', name: 'Jordan' }, { code: 'lb', name: 'Lebanon' },
  { code: 'kw', name: 'Kuwait' }, { code: 'qa', name: 'Qatar' },
  { code: 'om', name: 'Oman' }, { code: 'ye', name: 'Yemen' },
  { code: 'bd', name: 'Bangladesh' }, { code: 'lk', name: 'Sri Lanka' },
  { code: 'np', name: 'Nepal' }, { code: 'mm', name: 'Myanmar' },
  { code: 'kh', name: 'Cambodia' }, { code: 'la', name: 'Laos' },
  { code: 'mn', name: 'Mongolia' }, { code: 'uz', name: 'Uzbekistan' },
  { code: 'ge', name: 'Georgia' }, { code: 'am', name: 'Armenia' },
  { code: 'az', name: 'Azerbaijan' }, { code: 'md', name: 'Moldova' },
  { code: 'ec', name: 'Ecuador' }, { code: 'bo', name: 'Bolivia' },
  { code: 'py', name: 'Paraguay' }, { code: 'uy', name: 'Uruguay' },
  { code: 'cr', name: 'Costa Rica' }, { code: 'gt', name: 'Guatemala' },
  { code: 'hn', name: 'Honduras' }, { code: 'ni', name: 'Nicaragua' },
  { code: 'pa', name: 'Panama' }, { code: 'sv', name: 'El Salvador' },
  { code: 'do', name: 'Dominican Republic' }, { code: 'ht', name: 'Haiti' },
  { code: 'tt', name: 'Trinidad & Tobago' }, { code: 'bb', name: 'Barbados' },
]

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function generateFlagQuestions(amount: number): (TriviaQuestion & { image: string })[] {
  const shuffled = shuffleArray(COUNTRIES)
  return shuffled.slice(0, Math.min(amount, COUNTRIES.length)).map(country => {
    const wrong = shuffleArray(COUNTRIES.filter(c => c.code !== country.code))
      .slice(0, 3)
      .map(c => c.name)
    return {
      category: 'Flags',
      type: 'multiple',
      difficulty: 'easy',
      question: 'Which country does this flag belong to?',
      correct_answer: country.name,
      incorrect_answers: wrong,
      image: `https://flagcdn.com/w320/${country.code}.png`,
    }
  })
}
