// ============================================================
//  EVERYTHING YOU SEE ON THE SITE IS EDITED HERE.
//  No other file needs to change when you add a project,
//  mixtape or post.
// ============================================================
window.SITE = {
  name: "Neelab",
  tagline: "creative technologist",

  // ---------- CORKBOARD (about / resume) ----------
  about: {
    bio: "I'm a computer science student at the University of Waterloo. I write GPU kernels and SIMD code that push hardware to its limits, and I build pink, Y2K-flavoured things for the browser. Snoop around my room to see both.",
    resumeUrl: "", // e.g. "resume.pdf" once you have a copy you are happy to share publicly
    education: [
      { school: "University of Waterloo", detail: "Bachelor of Computer Science · Women in Computer Science Executive", when: "Sept 2023 – April 2028" },
    ],
    experience: [
      { role: "Software Engineering Intern", place: "Microsoft", when: "June – Aug 2026 · Austin, TX",
        note: "Shipped C++/CUDA GPU kernels for SQL FLOOR/CEILING in Fabric Data Warehouse's query engine: 16–22.7x the throughput of a 64-core CPU, up to 2.55 TB/s." },
      { role: "Software Engineering Intern", place: "FormAI", when: "May – Aug 2024 · Waterloo, ON",
        note: "Built CUDA parallel processing for data-heavy query operations (30% faster) and Solidity smart contracts for decentralized apps." },
      { role: "Research Affiliate Assistant", place: "Harvard University, Galileo Project", when: "Aug 2022 – Present · Cambridge, MA",
        note: "Anomaly-detection models on Google Cloud Vertex AI, with SIMD-accelerated execution improving throughput by 25%." },
    ],
    // Add your fun facts here, e.g. ["I can ...", "I once ..."]. Empty shows "coming soon".
    facts: [],
    skills: [
      "C++", "Python", "Java", "JavaScript", "SQL", "Assembly",
      "CUDA", "TensorFlow", "Docker", "Kubernetes", "Google Cloud", "PostgreSQL", "Git",
      "GPU kernels", "SIMD / AVX-512", "Query execution", "Parallel computing", "Distributed systems", "Performance tuning",
    ],
  },

  // ---------- LAPTOP (projects, one tab each) ----------
  projects: [
    {
      name: "SIMD & Sorcery",
      year: "2026",
      blurb: "A turn-based dungeon crawler for the terminal, played by Dungeons & Dragons 5e rules and built around a SIMD-vectorized map engine. Build a hero and fight down through five floors.",
      points: [
        "The dungeon is stored as flat byte grids sized for 512-bit vector registers",
        "Enemy movement, spawning and drawing run as AVX-512 or NEON kernels instead of cell-by-cell loops",
        "Real 5e mechanics: d20 attacks against Armor Class, saving throws, monster stat blocks, XP and levelling",
      ],
      tags: ["C++17", "AVX-512", "NEON", "SIMD"],
      links: [{ label: "GitHub", url: "https://github.com/NeelabK/simd-and-sorcery" }],
      image: "",
    },
    {
      name: "Y2K Dress Up",
      year: "2026",
      blurb: "A 2000s Flash-style fashion dress-up game that runs in the browser. Pick tops, bottoms, shoes, bags and shades, then take your look from the studio to the bedroom to the mall.",
      points: [
        "Random-outfit butterfly, a hearts rating, a camera that saves your look, and music",
        "Every item is drawn in place on the doll canvas, so adding one is a single line",
      ],
      tags: ["HTML5", "JavaScript", "Game"],
      links: [
        { label: "Play it", url: "https://neelabk.github.io/y2k-dress-up-game/" },
        { label: "GitHub", url: "https://github.com/NeelabK/y2k-dress-up-game" },
      ],
      image: "https://github.com/NeelabK/y2k-dress-up-game/raw/HEAD/screenshots/studio.png",
    },
    {
      name: "Pink Mini Player",
      year: "2026",
      blurb: "A retro pink click-wheel music player for your phone. It runs in the browser, installs to the home screen like an app, and plays MP3s you add from your own device.",
      points: [
        "Songs are saved on the device and work offline; nothing is uploaded",
        "Queue, shuffle, repeat and lock-screen controls",
        "Scroll by dragging your finger around the wheel",
      ],
      tags: ["HTML", "JavaScript", "PWA"],
      links: [
        { label: "Try it", url: "https://neelabk.github.io/retro-pink-music-player/" },
        { label: "GitHub", url: "https://github.com/NeelabK/retro-pink-music-player" },
      ],
      image: "images/pink-mini-player.png",
    },
    {
      name: "Holo Agents",
      year: "2026",
      blurb: "A web app for talking to AI hologram characters by voice. Pick a character from the carousel, connect, and have a real-time conversation.",
      points: [
        "Real-time voice conversations powered by Ultravox",
        "Each persona is defined in a YAML file, so adding a character is a text edit",
        "Token-gated access that checks a Solana wallet's on-chain balance",
      ],
      tags: ["JavaScript", "Express", "Ultravox", "Solana"],
      links: [{ label: "GitHub", url: "https://github.com/NeelabK/holo-agents" }],
      image: "",
    },
    {
      name: "CUDA Image Filter",
      year: "2026",
      blurb: "A small C++/CUDA project that inverts the colours of JPEG and PNG images on an NVIDIA GPU, with each GPU thread processing one pixel.",
      points: [
        "Launches the inversion kernel in 16×16 thread blocks",
        "Handles the full round trip: decode, copy to GPU, run, copy back, save",
      ],
      tags: ["C++", "CUDA"],
      links: [{ label: "GitHub", url: "https://github.com/NeelabK/pixel-color-inverter-cuda" }],
      image: "",
    },
    {
      name: "CC3K Engine",
      year: "2026",
      blurb: "An extensible C++20 roguelike game engine, using inheritance and polymorphism to manage game objects and their interactions.",
      points: [
        "Dynamic memory management for object creation, ownership, state updates and cleanup",
        "Efficient data structures and low-level memory optimizations",
        "AVX-512 SIMD execution to accelerate object-based computations",
      ],
      tags: ["C++20", "OOP", "AVX-512", "SIMD"],
      links: [],
      image: "",
    },
    {
      name: "Biquadris",
      year: "2026",
      blurb: "A two-player Tetris-inspired game in C++, built as the final project for CS 246 at the University of Waterloo, with both console and graphical interfaces.",
      points: [
        "Multiple difficulty levels and special effects players trigger against each other",
        "Designed for low coupling and high cohesion, with game logic separate from presentation",
      ],
      tags: ["C++", "OOP", "X11"],
      links: [{ label: "GitHub", url: "https://github.com/NeelabK/Biquadris-CS246-Project" }],
      image: "",
    },
  ],

  // ---------- BOOMBOX (mixtapes) ----------
  // Each track opens `link` (a streaming page) when clicked.
  // Swap the search links below for exact Spotify / YouTube links.
  // A track with `src` (an audio file you have the rights to share,
  // e.g. "music/song.mp3") plays right on the boombox instead.
  mixtapes: [
    {
      name: "snooping music",
      note: "for going through my stuff",
      color: "#f6a6cf",
      tracks: [
        { title: "Pretty Girl", artist: "Clairo", link: "https://open.spotify.com/search/Clairo%20Pretty%20Girl" },
        { title: "Duvet", artist: "Bôa", link: "https://open.spotify.com/search/B%C3%B4a%20Duvet" },
        { title: "Meet Me in the Pale Moonlight", artist: "Lana Del Rey", link: "https://open.spotify.com/search/Lana%20Del%20Rey%20Meet%20Me%20in%20the%20Pale%20Moonlight" },
      ],
    },
  ],

  // ---------- DIARY (technical blog posts) ----------
  // Empty shows "coming soon". Add posts like:
  //   { title: "My post", date: "Nov 20, 2026", body: ["First paragraph.", "Second paragraph."] },
  posts: [],

  // ---------- FLIP PHONE (contact) ----------
  // `label` is what shows on the phone screen (keep it under 10 letters).
  contact: [
    { label: "Email", value: "n8karimi@uwaterloo.ca", url: "mailto:n8karimi@uwaterloo.ca" },
    { label: "LinkedIn", value: "linkedin.com/in/neelabkarimi", url: "https://www.linkedin.com/in/neelabkarimi" },
    { label: "GitHub", value: "github.com/NeelabK", url: "https://github.com/NeelabK" },
  ],
};
