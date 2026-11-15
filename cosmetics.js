/* Cosmetic catalogue and achievement definitions. */
import { PLANETS } from "./planets.js";

const RARITY = {
  common:    { label:"Common",    color:"#9fb0d4", glow:"rgba(159,176,212,.35)" },
  rare:      { label:"Rare",      color:"#4fe3ff", glow:"rgba(79,227,255,.45)" },
  epic:      { label:"Epic",      color:"#a99bff", glow:"rgba(169,155,255,.5)" },
  legendary: { label:"Legendary", color:"#ffc857", glow:"rgba(255,200,87,.55)" }
};
const RARITY_ORDER = ["common", "rare", "epic", "legendary"];

/* Character skins: the face visible through the astronaut visor. */
const SKINS = [
  { id:"skin_moonlight", name:"Moonlight", price:0, rarity:"common", desc:"The academy starter look.", colors:{face:"#f4d6bd", shadow:"#d9aa8c", eyes:"#26364f", accent:"#fff0df"} },
  { id:"skin_sandstone", name:"Sandstone", price:35, rarity:"common", desc:"A warm desert-inspired complexion.", colors:{face:"#d9a477", shadow:"#b77a55", eyes:"#30251f", accent:"#f3c59a"} },
  { id:"skin_copper", name:"Copper Glow", price:65, rarity:"common", desc:"A bright copper-toned explorer look.", colors:{face:"#bd7957", shadow:"#8f503a", eyes:"#252b38", accent:"#e6a17a"} },
  { id:"skin_cocoa", name:"Cocoa Comet", price:90, rarity:"rare", desc:"A rich cocoa-toned character look.", colors:{face:"#87553f", shadow:"#603927", eyes:"#171d2a", accent:"#b77b5b"} },
  { id:"skin_umber", name:"Deep Orbit", price:120, rarity:"rare", desc:"A deep umber complexion with warm highlights.", colors:{face:"#573a32", shadow:"#38251f", eyes:"#101827", accent:"#8a5b4c"} },
  { id:"skin_ice", name:"Ice Crystal", price:180, rarity:"rare", desc:"A fictional frosted-blue alien skin.", colors:{face:"#a9e4f5", shadow:"#69b6d1", eyes:"#17445e", accent:"#e5fbff"} },
  { id:"skin_mint", name:"Mint Martian", price:240, rarity:"epic", desc:"A friendly green alien appearance.", colors:{face:"#8ce0b4", shadow:"#4aa77d", eyes:"#164d3c", accent:"#d7ffe8"} },
  { id:"skin_violet", name:"Nebula Violet", price:320, rarity:"epic", desc:"A cosmic violet character skin.", colors:{face:"#c2a5f5", shadow:"#8a6bc4", eyes:"#38245e", accent:"#f0e7ff"} },
  { id:"skin_galaxy", name:"Galaxy Shimmer", price:500, rarity:"legendary", desc:"A rare luminous space-inspired skin.", colors:{face:"#6e7fd8", shadow:"#4654a4", eyes:"#111b4b", accent:"#dce6ff"} },
  { id:"skin_old_astronaut", name:"Old Astronaut", price:80, rarity:"rare", desc:"A veteran space explorer with silver hair and a proud beard.", colors:{face:"#efc9a8", shadow:"#c18e70", eyes:"#35445a", accent:"#fff0d9"}, features:{hair:"silver_swept", beard:"silver", mustache:"silver"} },
  { id:"skin_scientist_junior", name:"Scientist Junior", price:120, rarity:"rare", desc:"A curious young scientist with round glasses.", colors:{face:"#f1c9a5", shadow:"#c28b69", eyes:"#2b3d57", accent:"#fff0dc"}, features:{hair:"brown_tuft", glasses:"round"} },
  { id:"skin_scientist_pro", name:"Scientist Pro", price:160, rarity:"epic", desc:"A senior researcher with silver hair and smart frames.", colors:{face:"#e7bd9b", shadow:"#b98566", eyes:"#25354d", accent:"#fff0df"}, features:{hair:"silver_swept", glasses:"rectangular"} },
  { id:"skin_professor_nova", name:"Professor Nova", price:260, rarity:"epic", desc:"A legendary teacher with a full white beard and spectacles.", colors:{face:"#d9a77f", shadow:"#a96f50", eyes:"#27344b", accent:"#f5d3b2"}, features:{hair:"white_curly", beard:"white", mustache:"white", glasses:"round"} },
  { id:"skin_field_scientist", name:"Field Scientist", price:300, rarity:"epic", desc:"An adventurous researcher ready for discoveries beyond Earth.", colors:{face:"#a96f4f", shadow:"#74452f", eyes:"#17283c", accent:"#d69a72"}, features:{hair:"dark_curls", glasses:"round"} }
];

/* ---------------- OUTFIT SHOP ---------------- */
const SUITS = [
  { id:"suit_classic", name:"Cadet White",     price:0,    rarity:"common",    desc:"Standard issue. Crisp and clean.",        colors:{body:"#eef3ff", trim:"#4fe3ff", visor:"#2b3f66", accent:"#4fe3ff"} },
  { id:"suit_ember",   name:"Ember Orange",    price:30,   rarity:"common",    desc:"For pilots who like a warm glow.",        colors:{body:"#ff9d5c", trim:"#ffd9a8", visor:"#3a1c0a", accent:"#ffd9a8"} },
  { id:"suit_forest",  name:"Bio-Dome Green",  price:45,   rarity:"common",    desc:"Built for growing things in orbit.",      colors:{body:"#5ff0b6", trim:"#0d4a37", visor:"#063d2c", accent:"#0d4a37"} },
  { id:"suit_slate",   name:"Hangar Slate",    price:60,   rarity:"common",    desc:"Workshop grey. Hides the grease.",        colors:{body:"#8d9ab5", trim:"#2b3550", visor:"#141c30", accent:"#c3cfe8"} },
  { id:"suit_nebula",  name:"Nebula Violet",   price:180,  rarity:"rare",      desc:"Swirls of gas from a distant cloud.",     colors:{body:"#b39dff", trim:"#f0e8ff", visor:"#2a1d52", accent:"#f0e8ff"} },
  { id:"suit_solar",   name:"Solar Gold",      price:240,  rarity:"rare",      desc:"Polished panels, maximum shine.",         colors:{body:"#ffc857", trim:"#fff1c9", visor:"#4a3208", accent:"#fff1c9"} },
  { id:"suit_reef",    name:"Coral Reef",      price:280,  rarity:"rare",      desc:"Colours borrowed from a shallow sea.",    colors:{body:"#ff8fa8", trim:"#ffe3ec", visor:"#4a1024", accent:"#7ff0e0"} },
  { id:"suit_void",    name:"Deep Void",       price:520,  rarity:"epic",      desc:"For night-side operations only.",         colors:{body:"#2a3559", trim:"#6f7fd6", visor:"#080d1e", accent:"#6f7fd6"} },
  { id:"suit_plasma",  name:"Plasma Core",     price:640,  rarity:"epic",      desc:"Runs hot. Glows hotter.",                 colors:{body:"#ff5f8f", trim:"#ffd0e0", visor:"#3a0018", accent:"#ffd166"} },
  { id:"suit_aurora",  name:"Aurora Weave",    price:780,  rarity:"epic",      desc:"Woven from polar light.",                 colors:{body:"#5ff0b6", trim:"#a99bff", visor:"#062a3a", accent:"#4fe3ff"} },
  { id:"suit_eclipse", name:"Eclipse Chrome",  price:750,  rarity:"legendary", desc:"Mirror finish. Blinds the competition.",  colors:{body:"#dfe8ff", trim:"#8fa6d8", visor:"#0a0f1e", accent:"#ffffff"} },
  { id:"suit_supernova",name:"Supernova",      price:1600, rarity:"legendary", desc:"The last light of a dying star.",         colors:{body:"#ffb347", trim:"#fff3c4", visor:"#3a1200", accent:"#ff5f8f"} },
  { id:"suit_galaxy",  name:"Galaxy Print",    price:1800, rarity:"legendary", desc:"A whole spiral arm, printed on fabric.",  colors:{body:"#3b2a6b", trim:"#ffc857", visor:"#0b0620", accent:"#a99bff"} }
];
const HELMETS = [
  { id:"helm_bubble",  name:"Standard Bubble",  price:0,    rarity:"common",    desc:"Clear, roomy, reliable." },
  { id:"helm_gold",    name:"Gold Visor",       price:40,   rarity:"common",    desc:"Blocks glare, looks legendary." },
  { id:"helm_horn",    name:"Signal Antenna",   price:70,   rarity:"common",    desc:"A little dish, a lot of style." },
  { id:"helm_star",    name:"Star Crest",       price:150,  rarity:"rare",      desc:"For cadets who shine." },
  { id:"helm_ring",    name:"Ringed Halo",      price:260,  rarity:"rare",      desc:"A slow orbit around your head." },
  { id:"helm_dome",    name:"Survey Dome",      price:340,  rarity:"rare",      desc:"Extra glass, extra visibility." },
  { id:"helm_reactor", name:"Reactor Cowl",     price:600,  rarity:"epic",      desc:"Vents steam when you think hard." },
  { id:"helm_crystal", name:"Crystal Shell",    price:820,  rarity:"epic",      desc:"Grown, not built. Sings faintly." },
  { id:"helm_crown",   name:"Commander Crown",  price:900,  rarity:"legendary", desc:"Reserved for the very best." },
  { id:"helm_blackhole",name:"Event Horizon",   price:1700, rarity:"legendary", desc:"Light bends politely around it." }
];
const VISORS = [
  { id:"visor_clear",  name:"Clear Glass",      price:0,    rarity:"common",    desc:"See everything, hide nothing.",   tint:"#2b3f66", alpha:.92 },
  { id:"visor_smoke",  name:"Smoke Tint",       price:35,   rarity:"common",    desc:"Cool, calm, unreadable.",         tint:"#1a1f2e", alpha:.95 },
  { id:"visor_amber",  name:"Amber Filter",     price:80,   rarity:"common",    desc:"Cuts glare on the day side.",     tint:"#c98a1e", alpha:.9 },
  { id:"visor_rose",   name:"Rose Quartz",      price:190,  rarity:"rare",      desc:"Everything looks friendlier.",    tint:"#e07a9c", alpha:.88 },
  { id:"visor_ice",    name:"Ice Blue",         price:230,  rarity:"rare",      desc:"Frosted at the edges.",           tint:"#7fd8ff", alpha:.86 },
  { id:"visor_emerald",name:"Emerald Scan",     price:300,  rarity:"rare",      desc:"Adds a faint targeting grid.",    tint:"#2fd08a", alpha:.88 },
  { id:"visor_void",   name:"Void Black",       price:560,  rarity:"epic",      desc:"Nothing gets in. Nothing.",       tint:"#05070f", alpha:.98 },
  { id:"visor_prism",  name:"Prism Split",      price:760,  rarity:"epic",      desc:"Splits light into a rainbow.",    tint:"#a99bff", alpha:.85 },
  { id:"visor_solar",  name:"Solar Flare",      price:850,  rarity:"legendary", desc:"Looks like a small sun.",         tint:"#ffb347", alpha:.9 },
  { id:"visor_nebula", name:"Nebula Glass",     price:1650, rarity:"legendary", desc:"A galaxy trapped in the glass.",  tint:"#6b3fd0", alpha:.9 }
];
const HATS = [
  { id:"hat_none",     name:"Bare Helmet",      price:0,    rarity:"common",    desc:"No hat. All business." },
  { id:"hat_cap",      name:"Flight Cap",       price:25,   rarity:"common",    desc:"A simple pilot's cap." },
  { id:"hat_beanie",   name:"Thermal Beanie",   price:55,   rarity:"common",    desc:"For the cold side of the orbit." },
  { id:"hat_headset",  name:"Comms Headset",    price:120,  rarity:"rare",      desc:"Always on the right channel." },
  { id:"hat_tophat",   name:"Formal Top Hat",   price:210,  rarity:"rare",      desc:"For award ceremonies only." },
  { id:"hat_antennae", name:"Bug Antennae",     price:290,  rarity:"rare",      desc:"Two little feelers. Very cute." },
  { id:"hat_mohawk",   name:"Plasma Mohawk",    price:580,  rarity:"epic",      desc:"Hair made of excited gas." },
  { id:"hat_wizard",   name:"Star Wizard Hat",  price:740,  rarity:"epic",      desc:"Slightly magical. Mostly pointy." },
  { id:"hat_halo",     name:"Saintly Halo",     price:700,  rarity:"legendary", desc:"Floats. Glows. Judges you." },
  { id:"hat_dragon",   name:"Dragon Crest",     price:1550, rarity:"legendary", desc:"A tiny dragon, permanently napping." }
];
const BACKPACKS = [
  { id:"pack_std",     name:"Standard Pack",    price:0,    rarity:"common",    desc:"Two tanks. Does the job." },
  { id:"pack_slim",    name:"Slimline Pack",    price:40,   rarity:"common",    desc:"Low profile, high efficiency." },
  { id:"pack_twin",    name:"Twin Thruster",    price:110,  rarity:"rare",      desc:"Two nozzles for fine control." },
  { id:"pack_solar",   name:"Solar Wing Pack",  price:250,  rarity:"rare",      desc:"Folding panels on your back." },
  { id:"pack_cargo",   name:"Cargo Hauler",     price:330,  rarity:"rare",      desc:"Carries the samples home." },
  { id:"pack_jet",     name:"Jet Sprint",       price:620,  rarity:"epic",      desc:"Short bursts, big speed." },
  { id:"pack_reactor", name:"Fusion Backpack",  price:800,  rarity:"epic",      desc:"Powers a small town. Warm." },
  { id:"pack_wings",   name:"Ion Wings",        price:1400, rarity:"legendary", desc:"Glowing wings of charged gas." },
  { id:"pack_blackhole",name:"Singularity Pack",price:1750, rarity:"legendary", desc:"Do not open the little door." }
];
const BOOTS = [
  { id:"boot_std",     name:"Standard Boots",   price:0,    rarity:"common",    desc:"Magnetic soles. Grippy." },
  { id:"boot_red",     name:"Red Racer Boots",  price:30,   rarity:"common",    desc:"Go faster. Probably." },
  { id:"boot_steel",   name:"Steel Toe Caps",   price:90,   rarity:"rare",      desc:"For kicking asteroids." },
  { id:"boot_spring",  name:"Spring Heels",     price:200,  rarity:"rare",      desc:"Bouncy in low gravity." },
  { id:"boot_ice",     name:"Ice Grippers",     price:280,  rarity:"rare",      desc:"Tested on Europa. Allegedly." },
  { id:"boot_rocket",  name:"Rocket Boots",     price:600,  rarity:"epic",      desc:"Small thrusters in each heel." },
  { id:"boot_plasma",  name:"Plasma Striders",  price:780,  rarity:"epic",      desc:"Leaves a glowing footprint." },
  { id:"boot_gravity", name:"Gravity Boots",    price:950,  rarity:"legendary", desc:"Choose your own weight." }
];
const GLOVES = [
  { id:"glove_std",    name:"Standard Gloves",  price:0,    rarity:"common",    desc:"Warm, tough, reliable." },
  { id:"glove_blue",   name:"Blue Grips",       price:35,   rarity:"common",    desc:"Extra sticky fingertips." },
  { id:"glove_armor",  name:"Armoured Gauntlets",price:130, rarity:"rare",      desc:"Plated knuckles." },
  { id:"glove_heater", name:"Heated Gloves",    price:240,  rarity:"rare",      desc:"Toasty at -150 degrees." },
  { id:"glove_tool",   name:"Toolmaster Gloves",price:320,  rarity:"rare",      desc:"A socket in every finger." },
  { id:"glove_plasma", name:"Plasma Touch",     price:640,  rarity:"epic",      desc:"Crackles when you wave." },
  { id:"glove_gauntlet",name:"Infinity Gauntlet",price:820, rarity:"epic",      desc:"Six empty sockets. For now." },
  { id:"glove_star",   name:"Stardust Gloves",  price:1450, rarity:"legendary", desc:"Trails glitter as you work." }
];
const CAPES = [
  { id:"cape_none",    name:"No Cape",          price:0,    rarity:"common",    desc:"Streamlined and sensible." },
  { id:"cape_short",   name:"Short Cape",       price:60,   rarity:"common",    desc:"A modest bit of drama." },
  { id:"cape_hero",    name:"Hero Cape",        price:220,  rarity:"rare",      desc:"Billows even without wind." },
  { id:"cape_thermal", name:"Thermal Blanket",  price:300,  rarity:"rare",      desc:"Survival foil, styled up." },
  { id:"cape_aurora",  name:"Aurora Cloak",     price:660,  rarity:"epic",      desc:"Shimmers in six colours." },
  { id:"cape_void",    name:"Void Shroud",      price:840,  rarity:"epic",      desc:"Absorbs light. Slightly rude." },
  { id:"cape_comet",   name:"Comet Tail",       price:1500, rarity:"legendary", desc:"A tail of ice and dust." }
];
const PETS = [
  { id:"pet_none",     name:"No Companion",     price:0,    rarity:"common",    desc:"Flying solo." },
  { id:"pet_orb",      name:"Helper Orb",       price:80,   rarity:"common",    desc:"A little drone that beeps." },
  { id:"pet_star",     name:"Star Sprite",      price:190,  rarity:"rare",      desc:"A tiny star that follows you." },
  { id:"pet_moon",     name:"Moon Moth",        price:270,  rarity:"rare",      desc:"Wings like crescent moons." },
  { id:"pet_rover",    name:"Pocket Rover",     price:350,  rarity:"rare",      desc:"Six wheels, endless curiosity." },
  { id:"pet_fox",      name:"Comet Fox",        price:700,  rarity:"epic",      desc:"Leaves a trail of sparks." },
  { id:"pet_alien",    name:"Friendly Alien",   price:880,  rarity:"epic",      desc:"Waves with four arms." },
  { id:"pet_dragon",   name:"Baby Star Dragon", price:1600, rarity:"legendary", desc:"Breathes harmless sparkles." },
  { id:"pet_phoenix",  name:"Solar Phoenix",    price:1900, rarity:"legendary", desc:"Reborn every orbit." }
];
const BADGES = [
  { id:"badge_none",   name:"No badge",         price:0,    rarity:"common",    desc:"Clean chest plate." },
  { id:"badge_rocket", name:"Rocket Pin",       price:20,   rarity:"common",    desc:"You earned your launch." },
  { id:"badge_planet", name:"Ringed Planet Pin",price:70,   rarity:"common",    desc:"For planet hunters." },
  { id:"badge_comet",  name:"Comet Pin",        price:160,  rarity:"rare",      desc:"Fast, bright, unstoppable." },
  { id:"badge_wings",  name:"Pilot Wings",      price:250,  rarity:"rare",      desc:"Awarded after your first solo." },
  { id:"badge_shield", name:"Storm Shield",     price:330,  rarity:"rare",      desc:"Survived a solar storm." },
  { id:"badge_flame",  name:"Engine Flame",     price:620,  rarity:"epic",      desc:"For the engineers." },
  { id:"badge_eye",    name:"Deep Sky Eye",     price:790,  rarity:"epic",      desc:"You looked back in time." },
  { id:"badge_laurel", name:"Laurel of Command",price:800,  rarity:"legendary", desc:"Given, never bought. Officially." },
  { id:"badge_galaxy", name:"Galaxy Seal",      price:1700, rarity:"legendary", desc:"A whole galaxy on your chest." }
];
const TRAILS = [
  { id:"trail_none",   name:"No Trail",         price:0,    rarity:"common",    desc:"Clean and quiet." },
  { id:"trail_dust",   name:"Moon Dust",        price:50,   rarity:"common",    desc:"A soft grey puff." },
  { id:"trail_spark",  name:"Spark Shower",     price:140,  rarity:"rare",      desc:"Little orange sparks." },
  { id:"trail_bubble", name:"Bubble Stream",    price:230,  rarity:"rare",      desc:"Floating soap bubbles." },
  { id:"trail_star",   name:"Stardust",         price:310,  rarity:"rare",      desc:"A trail of tiny stars." },
  { id:"trail_flame",  name:"Rocket Flame",     price:650,  rarity:"epic",      desc:"You are the exhaust now." },
  { id:"trail_rainbow",name:"Rainbow Ribbon",   price:810,  rarity:"epic",      desc:"Six colours, always behind." },
  { id:"trail_aurora", name:"Aurora Veil",      price:1450, rarity:"legendary", desc:"Green and violet light." },
  { id:"trail_void",   name:"Void Ripple",      price:1850, rarity:"legendary", desc:"Space bends as you pass." }
];
/* Character creator add-ons: independent from the base skin. */
const HAIR_STYLES = [
  { id:"hair_skin_default", name:"Skin Signature", price:0, rarity:"common", desc:"Keep the hairstyle that comes with your selected skin.", style:"skin" },
  { id:"hair_classic", name:"Classic Sweep", price:35, rarity:"common", desc:"A neat, friendly swept hairstyle.", style:"classic", color:"#65402c" },
  { id:"hair_curly", name:"Comet Curls", price:65, rarity:"common", desc:"Bouncy curls for curious explorers.", style:"curly", color:"#493026" },
  { id:"hair_spiky", name:"Rocket Spikes", price:90, rarity:"rare", desc:"A bold, energetic hairstyle.", style:"spiky", color:"#a65b32" },
  { id:"hair_silver", name:"Silver Scholar", price:120, rarity:"rare", desc:"A distinguished silver hairstyle.", style:"silver", color:"#e7edf5" },
  { id:"hair_blue", name:"Ice Blue Flow", price:150, rarity:"epic", desc:"Cool blue hair for a cosmic look.", style:"flow", color:"#75cfff" }
];
const EYE_STYLES = [
  { id:"eyes_classic", name:"Classic Eyes", price:0, rarity:"common", desc:"The academy's friendly standard look.", style:"classic" },
  { id:"eyes_bright", name:"Bright Eyes", price:40, rarity:"common", desc:"Larger, extra-sparkly eyes.", style:"bright" },
  { id:"eyes_confident", name:"Confident Look", price:70, rarity:"common", desc:"Focused eyes for mission leaders.", style:"confident" },
  { id:"eyes_sleepy", name:"Sleepy Explorer", price:85, rarity:"rare", desc:"A relaxed look after a long journey.", style:"sleepy" },
  { id:"eyes_star", name:"Starry Eyes", price:130, rarity:"epic", desc:"Tiny cosmic highlights in the eyes.", style:"star" }
];
const EXPRESSIONS = [
  { id:"expression_smile", name:"Happy Smile", price:0, rarity:"common", desc:"A cheerful cadet smile.", style:"smile" },
  { id:"expression_grin", name:"Big Grin", price:45, rarity:"common", desc:"A wide grin after a successful mission.", style:"grin" },
  { id:"expression_surprised", name:"Surprised", price:60, rarity:"common", desc:"Ready for an unexpected discovery.", style:"surprised" },
  { id:"expression_curious", name:"Curious", price:95, rarity:"rare", desc:"A thoughtful, curious expression.", style:"curious" },
  { id:"expression_calm", name:"Calm Focus", price:110, rarity:"rare", desc:"Quiet confidence before launch.", style:"calm" }
];

const COSMETIC_TABS = [
  { key:"skin",     label:"Skins",     icon:"🎨", list:SKINS },
  { key:"hair",     label:"Hair",      icon:"💇", list:HAIR_STYLES },
  { key:"eyes",     label:"Eyes",      icon:"👀", list:EYE_STYLES },
  { key:"expression",label:"Expressions",icon:"😊", list:EXPRESSIONS },
  { key:"suit",     label:"Suits",     icon:"🧑‍🚀", list:SUITS },
  { key:"helmet",   label:"Helmets",   icon:"🪖", list:HELMETS },
  { key:"visor",    label:"Visors",    icon:"🕶️", list:VISORS },
  { key:"hat",      label:"Hats",      icon:"🎩", list:HATS },
  { key:"backpack", label:"Packs",     icon:"🎒", list:BACKPACKS },
  { key:"boots",    label:"Boots",     icon:"🥾", list:BOOTS },
  { key:"gloves",   label:"Gloves",    icon:"🧤", list:GLOVES },
  { key:"cape",     label:"Capes",     icon:"🦸", list:CAPES },
  { key:"pet",      label:"Pets",      icon:"🐾", list:PETS },
  { key:"badge",    label:"Badges",    icon:"🎖️", list:BADGES },
  { key:"trail",    label:"Trails",    icon:"✨", list:TRAILS }
];

const ACHIEVEMENTS = [
  { id:"first_mission", icon:"🚀", name:"First Launch",     desc:"Finish your first mission.",              test:s=>s.completed.length>=1 },
  { id:"half_way",      icon:"🌗", name:"Halfway Cadet",    desc:"Finish 8 of the 15 missions.",            test:s=>s.completed.length>=8 },
  { id:"graduate",      icon:"🎓", name:"Academy Graduate", desc:"Finish all 15 missions.",                 test:s=>s.completed.length>=15 },
  { id:"planet_hunter", icon:"🪐", name:"Planet Hunter",    desc:"Open the file for all 8 planets.",        test:s=>PLANETS.every(p=>s.planetsSeen[p.id]) },
  { id:"sun_gazer",     icon:"☀️", name:"Sun Gazer",        desc:"Read about the Sun.",                     test:s=>!!s.planetsSeen.sun },
  { id:"perfect",       icon:"💯", name:"Perfect Mission",  desc:"Get every question right in one mission.", test:s=>Object.keys(s.stageStars).some(k=>s.stageStars[k]===3) },
  { id:"shopper",       icon:"👕", name:"Style Upgrade",    desc:"Buy your first outfit.",                   test:s=>s.owned.length>=2 },
  { id:"collector",     icon:"🧳", name:"Wardrobe Builder", desc:"Own 15 different items.",                  test:s=>s.owned.length>=15 },
  { id:"fashionista",   icon:"💎", name:"Fashion Icon",     desc:"Own 40 different items.",                  test:s=>s.owned.length>=40 },
  { id:"legendary",     icon:"👑", name:"Legendary Taste",  desc:"Own any Legendary item.",                  test:s=>s.owned.some(id=>{const f=window.AstroCadet.Shop.find(id);return f&&f.item.rarity==="legendary";}) },
  { id:"rich",          icon:"💰", name:"Star Collector",   desc:"Hold 500 stars at once.",                  test:s=>s.stars>=500 },
  { id:"tycoon",        icon:"🏦", name:"Star Tycoon",      desc:"Earn 2,000 stars all-time.",               test:s=>s.earnedTotal>=2000 },
  { id:"curious",       icon:"💡", name:"Curious Mind",     desc:"Ask Astro ten questions.",                 test:s=>s.pipAsked>=10 },
  { id:"listener",      icon:"🔊", name:"Good Listener",    desc:"Turn on Astro's voice.",                     test:s=>!!s.settings.voice }
];
/*@@END_JS_DATA@@*/

export { RARITY, RARITY_ORDER, SKINS, HAIR_STYLES, EYE_STYLES, EXPRESSIONS, SUITS, HELMETS, VISORS, HATS, BACKPACKS, BOOTS, GLOVES, CAPES, PETS, BADGES, TRAILS, COSMETIC_TABS, ACHIEVEMENTS };
