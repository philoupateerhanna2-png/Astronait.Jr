/* Planet and Sun reference content. Presentation stays in feature renderers. */
const PLANETS = [
  {
    id:"mercury", name:"Mercury", type:"Rocky planet · 1st from the Sun", hue:"#b9b3a8",
    art:"mercury",
    blurb:"The smallest planet and the fastest one around the Sun. Mercury is a rocky world covered in craters, with almost no air to protect it.",
    stats:{
      "Diameter":"4,879 km","Distance from Sun":"58 million km","Day length":"59 Earth days",
      "Year length":"88 Earth days","Moons":"0","Temperature":"-180 °C to 430 °C"
    },
    facts:[
      ["Speed racer","Mercury races around the Sun at about 47 km per second — faster than any other planet."],
      ["Two kinds of hot","By day the surface can bake at 430 °C, then drop to -180 °C at night. No blanket of air keeps the heat in."],
      ["Crater face","With no wind or rain to smooth it out, Mercury wears billions of years of crash marks."]
    ],
    alt:"A grey cratered planet lit from the left."
  },
  {
    id:"venus", name:"Venus", type:"Rocky planet · 2nd from the Sun", hue:"#e8c98a",
    art:"venus",
    blurb:"Venus is almost the same size as Earth, but a thick blanket of carbon-dioxide clouds makes it the hottest planet of all.",
    stats:{
      "Diameter":"12,104 km","Distance from Sun":"108 million km","Day length":"243 Earth days",
      "Year length":"225 Earth days","Moons":"0","Temperature":"about 465 °C"
    },
    facts:[
      ["Backwards spinner","Venus turns the opposite way to most planets — on Venus the Sun would rise in the west."],
      ["Slowest day ever","One spin takes longer than one trip around the Sun, so a Venus day is longer than its year."],
      ["Clouds of acid","Its clouds are made of sulphuric acid droplets. Spacecraft only survive on the surface for about an hour."]
    ],
    alt:"A creamy yellow planet wrapped in swirling clouds."
  },
  {
    id:"earth", name:"Earth", type:"Rocky planet · 3rd from the Sun", hue:"#5aa9ff",
    art:"earth",
    blurb:"Our home. Earth is the only place we know of with liquid oceans, breathable air and living things — that makes it very special.",
    stats:{
      "Diameter":"12,742 km","Distance from Sun":"150 million km","Day length":"24 hours",
      "Year length":"365.25 days","Moons":"1 (the Moon)","Temperature":"about 15 °C average"
    },
    facts:[
      ["Water world","About 71% of Earth's surface is covered by water — that's why astronauts call it the Blue Marble."],
      ["A protective bubble","Earth's magnetic field deflects most of the Sun's charged particles, and the atmosphere burns up small space rocks."],
      ["Perfect distance","Earth sits in the 'habitable zone' — not too hot, not too cold — so water can stay liquid."]
    ],
    alt:"A blue and green planet with white clouds."
  },
  {
    id:"mars", name:"Mars", type:"Rocky planet · 4th from the Sun", hue:"#e2703f",
    art:"mars",
    blurb:"The Red Planet gets its colour from rusty iron dust. Robots from Earth are exploring it right now, and its canyons and volcanoes are enormous.",
    stats:{
      "Diameter":"6,779 km","Distance from Sun":"228 million km","Day length":"24.6 hours",
      "Year length":"687 Earth days","Moons":"2 (Phobos, Deimos)","Temperature":"about -60 °C average"
    },
    facts:[
      ["Tallest volcano","Olympus Mons rises about 22 km high — roughly two and a half times the height of Mount Everest."],
      ["Grand canyon","Valles Marineris is a canyon system about 4,000 km long, long enough to stretch across the USA."],
      ["Two tiny moons","Phobos and Deimos are lumpy and small. Phobos circles Mars three times a day and is slowly drifting closer."]
    ],
    alt:"A rusty red planet with a white polar cap and dark patches."
  },
  {
    id:"jupiter", name:"Jupiter", type:"Gas giant · 5th from the Sun", hue:"#d9a06a",
    art:"jupiter",
    blurb:"The biggest planet in the solar system — a huge ball of swirling gas with a storm that has been spinning for hundreds of years.",
    stats:{
      "Diameter":"139,820 km","Distance from Sun":"778 million km","Day length":"9.9 hours",
      "Year length":"11.9 Earth years","Moons":"95+ known","Temperature":"about -110 °C at the cloud tops"
    },
    facts:[
      ["King of planets","Jupiter could hold more than 1,300 Earths inside it, yet it spins fastest of all — one day lasts under 10 hours."],
      ["Great Red Spot","A storm wider than Earth that has been raging for at least 150 years, maybe far longer."],
      ["Its own mini solar system","Jupiter has dozens of moons; four big ones — Io, Europa, Ganymede and Callisto — are visible with binoculars."]
    ],
    alt:"A banded orange and cream gas giant with a great red spot."
  },
  {
    id:"saturn", name:"Saturn", type:"Gas giant · 6th from the Sun", hue:"#e8d3a0",
    art:"saturn",
    blurb:"Saturn's rings make it the most recognisable planet. The rings are not solid — they are billions of pieces of ice and rock, some tiny, some house-sized.",
    stats:{
      "Diameter":"116,460 km","Distance from Sun":"1.4 billion km","Day length":"10.7 hours",
      "Year length":"29.4 Earth years","Moons":"140+ known","Temperature":"about -140 °C at the cloud tops"
    },
    facts:[
      ["Paper-thin rings","The rings stretch about 280,000 km wide but in most places are only about 10 metres thick."],
      ["It would float","Saturn is less dense than water, so a giant bath would let it float (if you could find one)."],
      ["Moon with weather","Titan, its largest moon, has lakes and rivers — made of liquid methane, not water."]
    ],
    alt:"A pale gold planet with wide tilted rings."
  },
  {
    id:"uranus", name:"Uranus", type:"Ice giant · 7th from the Sun", hue:"#a8e6ef",
    art:"uranus",
    blurb:"An ice giant that rolls around the Sun on its side, probably after a giant collision long ago. Its blue-green colour comes from methane gas.",
    stats:{
      "Diameter":"50,724 km","Distance from Sun":"2.9 billion km","Day length":"17.2 hours",
      "Year length":"84 Earth years","Moons":"28 known","Temperature":"about -195 °C"
    },
    facts:[
      ["Sideways planet","Uranus is tipped over by nearly 98°, so it seems to roll along its orbit like a ball."],
      ["Crazy seasons","Each pole gets about 42 years of sunlight, then 42 years of darkness."],
      ["First spotted with a telescope","William Herschel found Uranus in 1781 — the first planet discovered that way."]
    ],
    alt:"A pale cyan ice giant with faint bands."
  },
  {
    id:"neptune", name:"Neptune", type:"Ice giant · 8th from the Sun", hue:"#4d7bff",
    art:"neptune",
    blurb:"The farthest planet from the Sun, and the windiest. Neptune is so far away that sunlight takes more than four hours to reach it.",
    stats:{
      "Diameter":"49,244 km","Distance from Sun":"4.5 billion km","Day length":"16.1 hours",
      "Year length":"165 Earth years","Moons":"16 known","Temperature":"about -200 °C"
    },
    facts:[
      ["Supersonic winds","Winds on Neptune can blow faster than 2,000 km/h — faster than a passenger jet, times three."],
      ["Found with maths","Astronomers predicted Neptune's position from wobbles in Uranus's orbit, then found it in 1846."],
      ["A moon that goes backwards","Triton orbits the wrong way, so it was probably a captured icy world."]
    ],
    alt:"A deep blue planet with dark storms and faint streaks."
  }
];

const SUN_INFO = {
  id:"sun", name:"The Sun", type:"Our star", hue:"#ffc857", art:"sun",
  blurb:"The Sun is a star — a giant ball of super-hot gas. It holds the whole solar system together and gives us light, warmth and almost all of our energy.",
  stats:{
    "Diameter":"1.39 million km","Distance from Earth":"150 million km","Day length":"about 27 Earth days",
    "Surface temperature":"5,500 °C","Core temperature":"15 million °C","Age":"4.6 billion years"
  },
  facts:[
    ["99.8% of everything","The Sun contains almost all the mass in the solar system. Every planet could fit inside it with room to spare."],
    ["Light with a delay","Sunlight takes about 8 minutes and 20 seconds to reach Earth."],
    ["Not yellow","Seen from space the Sun is actually white — our air makes it look yellow and red near the horizon."]
  ],
  alt:"A bright glowing sun."
};

/* ---------------- MISSIONS ---------------- */

export { PLANETS, SUN_INFO };
