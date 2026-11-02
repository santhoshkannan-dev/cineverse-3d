export interface Movie {
  slug: string;
  trailerId?: string;
  title: string;
  tagline?: string;
  lang: string;
  langs: string[];
  genres: string[];
  runtime: string;
  cert: string;
  rating: number;
  director: string;
  cast: string[];
  status: "now" | "soon" | "prebook";
  release: string;
  mood: [string, string];
  synopsis?: string;
}

export const ALL_MOVIES: Movie[] = [
  {
    "slug": "ramayana",
    "trailerId": "K7zjRJ_0sgk",
    "title": "Ramayana",
    "tagline": "Part 1 \u2014 The Age of Dharma begins",
    "lang": "Hindi",
    "langs": [
      "Hindi",
      "Tamil",
      "Telugu",
      "Kannada",
      "Malayalam"
    ],
    "genres": [
      "Mythology",
      "Epic",
      "Action"
    ],
    "runtime": "2h 58m",
    "cert": "UA",
    "rating": 9.4,
    "director": "Nitesh Tiwari",
    "cast": [
      "Ranbir Kapoor",
      "Yash",
      "Sai Pallavi",
      "Sunny Deol"
    ],
    "status": "prebook",
    "release": "Diwali 2026",
    "mood": [
      "#ffb347",
      "#ff4d1a"
    ],
    "synopsis": "Prince Rama's exile, the abduction of Sita and the rise of Ravana \u2014 India's greatest epic, retold at a scale never attempted before."
  },
  {
    "slug": "jailer-2",
    "trailerId": "FW_PPcr1sPE",
    "title": "Jailer 2",
    "tagline": "Tiger ka hukum \u2014 again.",
    "lang": "Tamil",
    "langs": [
      "Tamil",
      "Telugu",
      "Hindi",
      "Kannada"
    ],
    "genres": [
      "Action",
      "Thriller"
    ],
    "runtime": "2h 46m",
    "cert": "UA 16+",
    "rating": 9.1,
    "director": "Nelson Dilipkumar",
    "cast": [
      "Rajinikanth",
      "Mohanlal",
      "Shiva Rajkumar",
      "Ramya Krishnan"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#ff2e3a",
      "#2b0007"
    ],
    "synopsis": "Muthuvel Pandian is pulled out of retirement once more when an old enemy returns with an army \u2014 and this time, it's personal."
  },
  {
    "slug": "toxic",
    "trailerId": "f5M1d7r2UNQ",
    "title": "Toxic",
    "tagline": "A fairy tale for grown-ups",
    "lang": "Kannada",
    "langs": [
      "Kannada",
      "Tamil",
      "Telugu",
      "Hindi",
      "Malayalam"
    ],
    "genres": [
      "Gangster",
      "Period",
      "Action"
    ],
    "runtime": "2h 41m",
    "cert": "A",
    "rating": 8.8,
    "director": "Geetu Mohandas",
    "cast": [
      "Yash",
      "Nayanthara",
      "Kiara Advani",
      "Huma Qureshi"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#39ff88",
      "#0a2a1a"
    ],
    "synopsis": "In a drug-soaked coastal empire of the 1960s, one man rises through smoke and gunfire to rule a world that was never meant for him."
  },
  {
    "slug": "varanasi",
    "trailerId": "DMD2uthghWE",
    "title": "Varanasi",
    "tagline": "S.S. Rajamouli's globe-trotter",
    "lang": "Telugu",
    "langs": [
      "Telugu",
      "Tamil",
      "Hindi",
      "Kannada",
      "Malayalam"
    ],
    "genres": [
      "Adventure",
      "Mythology",
      "Action"
    ],
    "runtime": "3h 05m",
    "cert": "UA",
    "rating": 9.6,
    "director": "S. S. Rajamouli",
    "cast": [
      "Mahesh Babu",
      "Priyanka Chopra Jonas",
      "Prithviraj Sukumaran"
    ],
    "status": "prebook",
    "release": "Sankranti 2027",
    "mood": [
      "#ffcf6b",
      "#3a1c6e"
    ],
    "synopsis": "From the ghats of Kashi to the edges of the known world \u2014 an adventure that spans time, myth and every continent."
  },
  {
    "slug": "coolie",
    "trailerId": "qeVfT2iLiu0",
    "title": "Coolie",
    "lang": "Tamil",
    "langs": [
      "Tamil",
      "Telugu"
    ],
    "genres": [
      "Action",
      "Thriller"
    ],
    "runtime": "2h 18m",
    "cert": "UA",
    "rating": 8.4,
    "director": "Lokesh Kanagaraj",
    "cast": [
      "Rajinikanth",
      "Nagarjuna",
      "Shruti Haasan"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#f5c518",
      "#1a1205"
    ]
  },
  {
    "slug": "leo",
    "trailerId": "Po3jStA673E",
    "title": "Leo",
    "lang": "Tamil",
    "langs": [
      "Tamil",
      "Hindi"
    ],
    "genres": [
      "Action",
      "Thriller"
    ],
    "runtime": "2h 25m",
    "cert": "UA 13+",
    "rating": 8.2,
    "director": "Lokesh Kanagaraj",
    "cast": [
      "Vijay",
      "Trisha",
      "Sanjay Dutt"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#d64933",
      "#111"
    ]
  },
  {
    "slug": "vikram",
    "trailerId": "OKBMCL-frPU",
    "title": "Vikram",
    "lang": "Tamil",
    "langs": [
      "Tamil",
      "Telugu"
    ],
    "genres": [
      "Action",
      "Thriller"
    ],
    "runtime": "2h 32m",
    "cert": "UA 16+",
    "rating": 9,
    "director": "Lokesh Kanagaraj",
    "cast": [
      "Kamal Haasan",
      "Vijay Sethupathi",
      "Fahadh Faasil"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#ff6b35",
      "#140a04"
    ]
  },
  {
    "slug": "jailer",
    "trailerId": "xenOE1Tma0A",
    "title": "Jailer",
    "lang": "Tamil",
    "langs": [
      "Tamil",
      "Hindi"
    ],
    "genres": [
      "Action",
      "Comedy"
    ],
    "runtime": "2h 39m",
    "cert": "A",
    "rating": 8.6,
    "director": "Nelson Dilipkumar",
    "cast": [
      "Rajinikanth",
      "Mohanlal",
      "Vinayakan"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#e63946",
      "#1d0306"
    ]
  },
  {
    "slug": "amaran",
    "trailerId": "hylIXfZeB4c",
    "title": "Amaran",
    "lang": "Tamil",
    "langs": [
      "Tamil",
      "Telugu"
    ],
    "genres": [
      "War",
      "Biopic"
    ],
    "runtime": "2h 46m",
    "cert": "U",
    "rating": 9.2,
    "director": "Rajkumar Periasamy",
    "cast": [
      "Sivakarthikeyan",
      "Sai Pallavi"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#7cb342",
      "#0e1a06"
    ]
  },
  {
    "slug": "vettaiyan",
    "trailerId": "zPqMbwmGC1U",
    "title": "Vettaiyan",
    "lang": "Tamil",
    "langs": [
      "Tamil",
      "Hindi"
    ],
    "genres": [
      "Action",
      "Drama"
    ],
    "runtime": "2h 53m",
    "cert": "UA",
    "rating": 7.9,
    "director": "T. J. Gnanavel",
    "cast": [
      "Rajinikanth",
      "Amitabh Bachchan",
      "Fahadh Faasil"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#4fc3f7",
      "#06131b"
    ]
  },
  {
    "slug": "goat",
    "trailerId": "B5GAjuSnNuQ",
    "title": "The Greatest of All Time",
    "lang": "Tamil",
    "langs": [
      "Tamil",
      "Telugu"
    ],
    "genres": [
      "Sci-Fi",
      "Action"
    ],
    "runtime": "2h 20m",
    "cert": "UA 13+",
    "rating": 7.6,
    "director": "Venkat Prabhu",
    "cast": [
      "Vijay",
      "Prashanth",
      "Sneha"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#ffd54f",
      "#16120a"
    ]
  },
  {
    "slug": "good-bad-ugly",
    "trailerId": "bJbZAXbF3Xo",
    "title": "Good Bad Ugly",
    "lang": "Tamil",
    "langs": [
      "Tamil",
      "Hindi"
    ],
    "genres": [
      "Action",
      "Comedy"
    ],
    "runtime": "2h 27m",
    "cert": "UA 16+",
    "rating": 7.8,
    "director": "Adhik Ravichandran",
    "cast": [
      "Ajith Kumar",
      "Trisha"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#ff4081",
      "#16050c"
    ]
  },
  {
    "slug": "thug-life",
    "trailerId": "96kAbj3IF3k",
    "title": "Thug Life",
    "lang": "Tamil",
    "langs": [
      "Tamil",
      "Telugu"
    ],
    "genres": [
      "Gangster",
      "Drama"
    ],
    "runtime": "2h 34m",
    "cert": "A",
    "rating": 7.2,
    "director": "Mani Ratnam",
    "cast": [
      "Kamal Haasan",
      "Silambarasan",
      "Trisha"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#b0bec5",
      "#0c0f11"
    ]
  },
  {
    "slug": "dragon",
    "trailerId": "qIBZlbJ7NUE",
    "title": "Dragon",
    "lang": "Tamil",
    "langs": [
      "Tamil",
      "Hindi"
    ],
    "genres": [
      "Comedy",
      "Drama"
    ],
    "runtime": "2h 41m",
    "cert": "U",
    "rating": 8.7,
    "director": "Ashwath Marimuthu",
    "cast": [
      "Pradeep Ranganathan",
      "Anupama Parameswaran"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#ff7043",
      "#170905"
    ]
  },
  {
    "slug": "kanguva",
    "trailerId": "ajnCMSC4VPo",
    "title": "Kanguva",
    "lang": "Tamil",
    "langs": [
      "Tamil",
      "Telugu"
    ],
    "genres": [
      "Fantasy",
      "Action"
    ],
    "runtime": "2h 48m",
    "cert": "UA",
    "rating": 7.1,
    "director": "Siva",
    "cast": [
      "Suriya",
      "Bobby Deol",
      "Disha Patani"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#ff8f00",
      "#190d00"
    ]
  },
  {
    "slug": "viduthalai-2",
    "trailerId": "HOxXrrwa_8o",
    "title": "Viduthalai Part 2",
    "lang": "Tamil",
    "langs": [
      "Tamil",
      "Hindi"
    ],
    "genres": [
      "Drama",
      "Political"
    ],
    "runtime": "2h 55m",
    "cert": "UA 13+",
    "rating": 8.5,
    "director": "Vetrimaaran",
    "cast": [
      "Vijay Sethupathi",
      "Soori",
      "Manju Warrier"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#c62828",
      "#170303"
    ]
  },
  {
    "slug": "jana-nayagan",
    "trailerId": "fJaAYcERf3Y",
    "title": "Jana Nayagan",
    "lang": "Tamil",
    "langs": [
      "Tamil",
      "Telugu"
    ],
    "genres": [
      "Action",
      "Political"
    ],
    "runtime": "2h 22m",
    "cert": "UA 16+",
    "rating": 8.9,
    "director": "H. Vinoth",
    "cast": [
      "Vijay",
      "Pooja Hegde",
      "Bobby Deol"
    ],
    "status": "soon",
    "release": "Coming soon",
    "mood": [
      "#ffca28",
      "#1a1300"
    ]
  },
  {
    "slug": "maharaja",
    "trailerId": "Otcr-vRuaQs",
    "title": "Maharaja",
    "lang": "Tamil",
    "langs": [
      "Tamil",
      "Hindi"
    ],
    "genres": [
      "Thriller",
      "Drama"
    ],
    "runtime": "2h 29m",
    "cert": "A",
    "rating": 9.3,
    "director": "Nithilan Saminathan",
    "cast": [
      "Vijay Sethupathi",
      "Anurag Kashyap"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#8d6e63",
      "#120c0a"
    ]
  },
  {
    "slug": "retro",
    "trailerId": "ZnH_2I0WoFQ",
    "title": "Retro",
    "lang": "Tamil",
    "langs": [
      "Tamil",
      "Telugu"
    ],
    "genres": [
      "Action",
      "Romance"
    ],
    "runtime": "2h 36m",
    "cert": "U",
    "rating": 7.7,
    "director": "Karthik Subbaraj",
    "cast": [
      "Suriya",
      "Pooja Hegde"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#ef5350",
      "#190707"
    ]
  },
  {
    "slug": "vidaamuyarchi",
    "trailerId": "hsoGpoDxyKg",
    "title": "Vidaamuyarchi",
    "lang": "Tamil",
    "langs": [
      "Tamil",
      "Hindi"
    ],
    "genres": [
      "Action",
      "Thriller"
    ],
    "runtime": "2h 43m",
    "cert": "UA",
    "rating": 7.4,
    "director": "Magizh Thirumeni",
    "cast": [
      "Ajith Kumar",
      "Trisha",
      "Arjun"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#ffb74d",
      "#1a1105"
    ]
  },
  {
    "slug": "master",
    "trailerId": "UTiXQcrLlv4",
    "title": "Master",
    "lang": "Tamil",
    "langs": [
      "Tamil",
      "Telugu"
    ],
    "genres": [
      "Action",
      "Drama"
    ],
    "runtime": "2h 50m",
    "cert": "UA 13+",
    "rating": 8.3,
    "director": "Lokesh Kanagaraj",
    "cast": [
      "Vijay",
      "Vijay Sethupathi"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#29b6f6",
      "#04121a"
    ]
  },
  {
    "slug": "ponniyin-selvan",
    "trailerId": "D4qAQYlgZQs",
    "title": "Ponniyin Selvan: I",
    "lang": "Tamil",
    "langs": [
      "Tamil",
      "Hindi"
    ],
    "genres": [
      "Epic",
      "History"
    ],
    "runtime": "2h 57m",
    "cert": "UA 16+",
    "rating": 8.6,
    "director": "Mani Ratnam",
    "cast": [
      "Vikram",
      "Aishwarya Rai",
      "Karthi",
      "Jayam Ravi"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#ffa726",
      "#1a0f02"
    ]
  },
  {
    "slug": "mark-antony",
    "trailerId": "Dg8X7SZ_4bs",
    "title": "Mark Antony",
    "lang": "Tamil",
    "langs": [
      "Tamil",
      "Telugu"
    ],
    "genres": [
      "Sci-Fi",
      "Comedy"
    ],
    "runtime": "2h 24m",
    "cert": "A",
    "rating": 7.9,
    "director": "Adhik Ravichandran",
    "cast": [
      "Vishal",
      "S. J. Suryah"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#ab47bc",
      "#14061a"
    ]
  },
  {
    "slug": "jigarthanda",
    "trailerId": "PvoUJejn1e4",
    "title": "Jigarthanda DoubleX",
    "lang": "Tamil",
    "langs": [
      "Tamil",
      "Hindi"
    ],
    "genres": [
      "Action",
      "Period"
    ],
    "runtime": "2h 31m",
    "cert": "U",
    "rating": 8.4,
    "director": "Karthik Subbaraj",
    "cast": [
      "Raghava Lawrence",
      "S. J. Suryah"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#ffee58",
      "#1a1a04"
    ]
  },
  {
    "slug": "pushpa-2",
    "trailerId": "g3JUbgOHgdw",
    "title": "Pushpa 2: The Rule",
    "lang": "Telugu",
    "langs": [
      "Telugu"
    ],
    "genres": [
      "Action",
      "Drama"
    ],
    "runtime": "2h 38m",
    "cert": "UA",
    "rating": 8.5,
    "director": "Sukumar",
    "cast": [
      "Allu Arjun",
      "Rashmika Mandanna",
      "Fahadh Faasil"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#e53935",
      "#1a0404"
    ]
  },
  {
    "slug": "kalki",
    "trailerId": "y1-w1kUGuz8",
    "title": "Kalki 2898 AD",
    "lang": "Telugu",
    "langs": [
      "Telugu",
      "Hindi"
    ],
    "genres": [
      "Sci-Fi",
      "Mythology"
    ],
    "runtime": "2h 45m",
    "cert": "UA 13+",
    "rating": 8.6,
    "director": "Nag Ashwin",
    "cast": [
      "Prabhas",
      "Amitabh Bachchan",
      "Deepika Padukone",
      "Kamal Haasan"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#ffb300",
      "#0b0f1a"
    ]
  },
  {
    "slug": "devara",
    "trailerId": "5cx7rvMvAWo",
    "title": "Devara: Part 1",
    "lang": "Telugu",
    "langs": [
      "Telugu"
    ],
    "genres": [
      "Action",
      "Drama"
    ],
    "runtime": "2h 52m",
    "cert": "UA 16+",
    "rating": 7.8,
    "director": "Koratala Siva",
    "cast": [
      "N. T. Rama Rao Jr.",
      "Saif Ali Khan",
      "Janhvi Kapoor"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#1e88e5",
      "#030c18"
    ]
  },
  {
    "slug": "rrr",
    "trailerId": "NgBoMJy386M",
    "title": "RRR",
    "lang": "Telugu",
    "langs": [
      "Telugu",
      "Hindi"
    ],
    "genres": [
      "Epic",
      "Action"
    ],
    "runtime": "2h 19m",
    "cert": "A",
    "rating": 9.4,
    "director": "S. S. Rajamouli",
    "cast": [
      "N. T. Rama Rao Jr.",
      "Ram Charan",
      "Alia Bhatt"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#ff6f00",
      "#1a0a00"
    ]
  },
  {
    "slug": "og",
    "trailerId": "_8J8LwoVH_0",
    "title": "They Call Him OG",
    "lang": "Telugu",
    "langs": [
      "Telugu"
    ],
    "genres": [
      "Gangster",
      "Action"
    ],
    "runtime": "2h 26m",
    "cert": "U",
    "rating": 8.3,
    "director": "Sujeeth",
    "cast": [
      "Pawan Kalyan",
      "Emraan Hashmi",
      "Priyanka Mohan"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#d32f2f",
      "#120202"
    ]
  },
  {
    "slug": "salaar",
    "trailerId": "4GPvYMKtrtI",
    "title": "Salaar: Part 1 \u2013 Ceasefire",
    "lang": "Telugu",
    "langs": [
      "Telugu",
      "Hindi"
    ],
    "genres": [
      "Action",
      "Thriller"
    ],
    "runtime": "2h 33m",
    "cert": "UA",
    "rating": 8.1,
    "director": "Prashanth Neel",
    "cast": [
      "Prabhas",
      "Prithviraj Sukumaran",
      "Shruti Haasan"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#ff7043",
      "#0d0806"
    ]
  },
  {
    "slug": "game-changer",
    "trailerId": "zHiKFSBO_JE",
    "title": "Game Changer",
    "lang": "Telugu",
    "langs": [
      "Telugu"
    ],
    "genres": [
      "Political",
      "Action"
    ],
    "runtime": "2h 40m",
    "cert": "UA 13+",
    "rating": 6.9,
    "director": "S. Shankar",
    "cast": [
      "Ram Charan",
      "Kiara Advani",
      "S. J. Suryah"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#26c6da",
      "#04161a"
    ]
  },
  {
    "slug": "hanuman",
    "trailerId": "Oqvly3MvlXA",
    "title": "Hanu-Man",
    "lang": "Telugu",
    "langs": [
      "Telugu",
      "Hindi"
    ],
    "genres": [
      "Superhero",
      "Fantasy"
    ],
    "runtime": "2h 47m",
    "cert": "UA 16+",
    "rating": 8.8,
    "director": "Prasanth Varma",
    "cast": [
      "Teja Sajja",
      "Amritha Aiyer"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#ff9800",
      "#1a0f00"
    ]
  },
  {
    "slug": "daaku",
    "trailerId": "fNDRSver0uM",
    "title": "Daaku Maharaaj",
    "lang": "Telugu",
    "langs": [
      "Telugu"
    ],
    "genres": [
      "Action",
      "Drama"
    ],
    "runtime": "2h 54m",
    "cert": "A",
    "rating": 7.5,
    "director": "Bobby Kolli",
    "cast": [
      "Nandamuri Balakrishna",
      "Bobby Deol"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#8d6e63",
      "#140d0a"
    ]
  },
  {
    "slug": "raja-saab",
    "trailerId": "i-8w5yDwukA",
    "title": "The Raja Saab",
    "lang": "Telugu",
    "langs": [
      "Telugu",
      "Hindi"
    ],
    "genres": [
      "Horror",
      "Comedy"
    ],
    "runtime": "2h 21m",
    "cert": "U",
    "rating": 7.3,
    "director": "Maruthi",
    "cast": [
      "Prabhas",
      "Sanjay Dutt",
      "Malavika Mohanan"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#7e57c2",
      "#0e0718"
    ]
  },
  {
    "slug": "peddi",
    "trailerId": "sF2dj7ycZvA",
    "title": "Peddi",
    "lang": "Telugu",
    "langs": [
      "Telugu"
    ],
    "genres": [
      "Sports",
      "Action"
    ],
    "runtime": "2h 28m",
    "cert": "UA",
    "rating": 8.9,
    "director": "Buchi Babu Sana",
    "cast": [
      "Ram Charan",
      "Janhvi Kapoor",
      "Shiva Rajkumar"
    ],
    "status": "soon",
    "release": "Coming soon",
    "mood": [
      "#66bb6a",
      "#061a08"
    ]
  },
  {
    "slug": "akhanda-2",
    "trailerId": "qlCBzdZSnlY",
    "title": "Akhanda 2: Thaandavam",
    "lang": "Telugu",
    "langs": [
      "Telugu",
      "Hindi"
    ],
    "genres": [
      "Action",
      "Devotional"
    ],
    "runtime": "2h 35m",
    "cert": "UA 13+",
    "rating": 7.4,
    "director": "Boyapati Srinu",
    "cast": [
      "Nandamuri Balakrishna",
      "Samyuktha"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#ff5722",
      "#1a0703"
    ]
  },
  {
    "slug": "lucky-baskhar",
    "trailerId": "FonKx5wvuHI",
    "title": "Lucky Baskhar",
    "lang": "Telugu",
    "langs": [
      "Telugu"
    ],
    "genres": [
      "Crime",
      "Drama"
    ],
    "runtime": "2h 42m",
    "cert": "UA 16+",
    "rating": 8.9,
    "director": "Venky Atluri",
    "cast": [
      "Dulquer Salmaan",
      "Meenakshi Chaudhary"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#43a047",
      "#051405"
    ]
  },
  {
    "slug": "baahubali-2",
    "trailerId": "qD-6d8Wo3do",
    "title": "Baahubali 2: The Conclusion",
    "lang": "Telugu",
    "langs": [
      "Telugu",
      "Hindi"
    ],
    "genres": [
      "Epic",
      "Action"
    ],
    "runtime": "2h 49m",
    "cert": "A",
    "rating": 9.3,
    "director": "S. S. Rajamouli",
    "cast": [
      "Prabhas",
      "Rana Daggubati",
      "Anushka Shetty"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#ffb300",
      "#1a1000"
    ]
  },
  {
    "slug": "kantara-1",
    "trailerId": "TMQUFhWm8C0",
    "title": "Kantara: Chapter 1",
    "lang": "Kannada",
    "langs": [
      "Kannada",
      "Telugu"
    ],
    "genres": [
      "Mythology",
      "Action"
    ],
    "runtime": "2h 56m",
    "cert": "U",
    "rating": 9,
    "director": "Rishab Shetty",
    "cast": [
      "Rishab Shetty",
      "Rukmini Vasanth",
      "Jayaram"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#ff6d00",
      "#1a0b00"
    ]
  },
  {
    "slug": "kgf-2",
    "trailerId": "jQsE85cI384",
    "title": "K.G.F: Chapter 2",
    "lang": "Kannada",
    "langs": [
      "Kannada",
      "Hindi"
    ],
    "genres": [
      "Action",
      "Period"
    ],
    "runtime": "2h 23m",
    "cert": "UA",
    "rating": 9,
    "director": "Prashanth Neel",
    "cast": [
      "Yash",
      "Sanjay Dutt",
      "Srinidhi Shetty"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#ffc107",
      "#1a1400"
    ]
  },
  {
    "slug": "empuraan",
    "trailerId": "PGqltBCo6cU",
    "title": "L2: Empuraan",
    "lang": "Malayalam",
    "langs": [
      "Malayalam",
      "Telugu"
    ],
    "genres": [
      "Political",
      "Action"
    ],
    "runtime": "2h 30m",
    "cert": "UA 13+",
    "rating": 8,
    "director": "Prithviraj Sukumaran",
    "cast": [
      "Mohanlal",
      "Prithviraj Sukumaran",
      "Manju Warrier"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#e53935",
      "#140303"
    ]
  },
  {
    "slug": "manjummel",
    "trailerId": "id848Ww1YLo",
    "title": "Manjummel Boys",
    "lang": "Malayalam",
    "langs": [
      "Malayalam",
      "Hindi"
    ],
    "genres": [
      "Survival",
      "Drama"
    ],
    "runtime": "2h 37m",
    "cert": "UA 16+",
    "rating": 9.1,
    "director": "Chidambaram",
    "cast": [
      "Soubin Shahir",
      "Sreenath Bhasi"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#00acc1",
      "#02131a"
    ]
  },
  {
    "slug": "lokah",
    "trailerId": "64XHtNWTB5o",
    "title": "Lokah Chapter 1: Chandra",
    "lang": "Malayalam",
    "langs": [
      "Malayalam",
      "Telugu"
    ],
    "genres": [
      "Superhero",
      "Fantasy"
    ],
    "runtime": "2h 44m",
    "cert": "A",
    "rating": 8.7,
    "director": "Dominic Arun",
    "cast": [
      "Kalyani Priyadarshan",
      "Naslen"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#7c4dff",
      "#0b0618"
    ]
  },
  {
    "slug": "dhurandhar",
    "trailerId": "BKOVzHcjEIo",
    "title": "Dhurandhar",
    "lang": "Hindi",
    "langs": [
      "Hindi",
      "Tamil",
      "Telugu"
    ],
    "genres": [
      "Spy",
      "Action"
    ],
    "runtime": "2h 51m",
    "cert": "U",
    "rating": 8.6,
    "director": "Aditya Dhar",
    "cast": [
      "Ranveer Singh",
      "Akshaye Khanna",
      "R. Madhavan"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#b71c1c",
      "#120202"
    ]
  },
  {
    "slug": "chhaava",
    "title": "Chhaava",
    "lang": "Hindi",
    "langs": [
      "Hindi",
      "Tamil",
      "Telugu"
    ],
    "genres": [
      "Period",
      "Action"
    ],
    "runtime": "2h 18m",
    "cert": "UA",
    "rating": 8.7,
    "director": "Laxman Utekar",
    "cast": [
      "Vicky Kaushal",
      "Rashmika Mandanna",
      "Akshaye Khanna"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#ff7a1a",
      "#1a0a02"
    ]
  },
  {
    "slug": "stree-2",
    "title": "Stree 2",
    "lang": "Hindi",
    "langs": [
      "Hindi",
      "Tamil",
      "Telugu"
    ],
    "genres": [
      "Horror",
      "Comedy"
    ],
    "runtime": "2h 25m",
    "cert": "UA 13+",
    "rating": 8.4,
    "director": "Amar Kaushik",
    "cast": [
      "Rajkummar Rao",
      "Shraddha Kapoor",
      "Pankaj Tripathi"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#9c27b0",
      "#12041a"
    ]
  },
  {
    "slug": "jawan",
    "title": "Jawan",
    "lang": "Hindi",
    "langs": [
      "Hindi",
      "Tamil",
      "Telugu"
    ],
    "genres": [
      "Action",
      "Thriller"
    ],
    "runtime": "2h 32m",
    "cert": "UA 16+",
    "rating": 8.1,
    "director": "Atlee",
    "cast": [
      "Shah Rukh Khan",
      "Nayanthara",
      "Vijay Sethupathi"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#ffab40",
      "#1a1004"
    ]
  },
  {
    "slug": "saiyaara",
    "title": "Saiyaara",
    "lang": "Hindi",
    "langs": [
      "Hindi",
      "Tamil",
      "Telugu"
    ],
    "genres": [
      "Romance",
      "Musical"
    ],
    "runtime": "2h 39m",
    "cert": "A",
    "rating": 8,
    "director": "Mohit Suri",
    "cast": [
      "Ahaan Panday",
      "Aneet Padda"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#f06292",
      "#1a0610"
    ]
  },
  {
    "slug": "animal",
    "title": "Animal",
    "lang": "Hindi",
    "langs": [
      "Hindi",
      "Tamil",
      "Telugu"
    ],
    "genres": [
      "Action",
      "Crime"
    ],
    "runtime": "2h 46m",
    "cert": "U",
    "rating": 7.9,
    "director": "Sandeep Reddy Vanga",
    "cast": [
      "Ranbir Kapoor",
      "Rashmika Mandanna",
      "Bobby Deol"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#90a4ae",
      "#0b0e10"
    ]
  },
  {
    "slug": "war-2",
    "title": "War 2",
    "lang": "Hindi",
    "langs": [
      "Hindi",
      "Tamil",
      "Telugu"
    ],
    "genres": [
      "Spy",
      "Action"
    ],
    "runtime": "2h 53m",
    "cert": "UA",
    "rating": 7.2,
    "director": "Ayan Mukerji",
    "cast": [
      "Hrithik Roshan",
      "N. T. Rama Rao Jr.",
      "Kiara Advani"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#29b6f6",
      "#03111a"
    ]
  }
];

export const FEATURED_MOVIES: Movie[] = [
  {
    "slug": "ramayana",
    "trailerId": "K7zjRJ_0sgk",
    "title": "Ramayana",
    "tagline": "Part 1 \u2014 The Age of Dharma begins",
    "lang": "Hindi",
    "langs": [
      "Hindi",
      "Tamil",
      "Telugu",
      "Kannada",
      "Malayalam"
    ],
    "genres": [
      "Mythology",
      "Epic",
      "Action"
    ],
    "runtime": "2h 58m",
    "cert": "UA",
    "rating": 9.4,
    "director": "Nitesh Tiwari",
    "cast": [
      "Ranbir Kapoor",
      "Yash",
      "Sai Pallavi",
      "Sunny Deol"
    ],
    "status": "prebook",
    "release": "Diwali 2026",
    "mood": [
      "#ffb347",
      "#ff4d1a"
    ],
    "synopsis": "Prince Rama's exile, the abduction of Sita and the rise of Ravana \u2014 India's greatest epic, retold at a scale never attempted before."
  },
  {
    "slug": "jailer-2",
    "trailerId": "FW_PPcr1sPE",
    "title": "Jailer 2",
    "tagline": "Tiger ka hukum \u2014 again.",
    "lang": "Tamil",
    "langs": [
      "Tamil",
      "Telugu",
      "Hindi",
      "Kannada"
    ],
    "genres": [
      "Action",
      "Thriller"
    ],
    "runtime": "2h 46m",
    "cert": "UA 16+",
    "rating": 9.1,
    "director": "Nelson Dilipkumar",
    "cast": [
      "Rajinikanth",
      "Mohanlal",
      "Shiva Rajkumar",
      "Ramya Krishnan"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#ff2e3a",
      "#2b0007"
    ],
    "synopsis": "Muthuvel Pandian is pulled out of retirement once more when an old enemy returns with an army \u2014 and this time, it's personal."
  },
  {
    "slug": "toxic",
    "trailerId": "f5M1d7r2UNQ",
    "title": "Toxic",
    "tagline": "A fairy tale for grown-ups",
    "lang": "Kannada",
    "langs": [
      "Kannada",
      "Tamil",
      "Telugu",
      "Hindi",
      "Malayalam"
    ],
    "genres": [
      "Gangster",
      "Period",
      "Action"
    ],
    "runtime": "2h 41m",
    "cert": "A",
    "rating": 8.8,
    "director": "Geetu Mohandas",
    "cast": [
      "Yash",
      "Nayanthara",
      "Kiara Advani",
      "Huma Qureshi"
    ],
    "status": "now",
    "release": "Now showing",
    "mood": [
      "#39ff88",
      "#0a2a1a"
    ],
    "synopsis": "In a drug-soaked coastal empire of the 1960s, one man rises through smoke and gunfire to rule a world that was never meant for him."
  },
  {
    "slug": "varanasi",
    "trailerId": "DMD2uthghWE",
    "title": "Varanasi",
    "tagline": "S.S. Rajamouli's globe-trotter",
    "lang": "Telugu",
    "langs": [
      "Telugu",
      "Tamil",
      "Hindi",
      "Kannada",
      "Malayalam"
    ],
    "genres": [
      "Adventure",
      "Mythology",
      "Action"
    ],
    "runtime": "3h 05m",
    "cert": "UA",
    "rating": 9.6,
    "director": "S. S. Rajamouli",
    "cast": [
      "Mahesh Babu",
      "Priyanka Chopra Jonas",
      "Prithviraj Sukumaran"
    ],
    "status": "prebook",
    "release": "Sankranti 2027",
    "mood": [
      "#ffcf6b",
      "#3a1c6e"
    ],
    "synopsis": "From the ghats of Kashi to the edges of the known world \u2014 an adventure that spans time, myth and every continent."
  }
];

export const MOVIES = ALL_MOVIES;

export const LANGUAGES = [
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Hindi"
];

export function getMovieBySlug(slug: string): Movie | undefined {
  return ALL_MOVIES.find((m) => m.slug === slug);
}

export function getPosterUrl(slug: string): string {
  return `/posters/${slug}.webp`;
}

export function getTrailerEmbedUrl(movie: Movie, extraParams = ""): string | undefined {
  if (!movie.trailerId) return undefined;
  return `https://www.youtube.com/embed/${movie.trailerId}?start=30${extraParams ? `&${extraParams}` : ""}`;
}
