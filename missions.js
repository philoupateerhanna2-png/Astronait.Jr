/* Mission lesson, activity and quiz content plus scoring constants. */
const STAGES = [
  {
    id:1, hue:42, emoji:"✦", title:"Early Stargazers",
    subtitle:"How ancient sky-watchers turned dots of light into stories.",
    skill:"Constellations",
    intro:"Long before telescopes, people looked up and joined the stars like dots in a drawing. Those pictures are called constellations — and we still use them today!",
    lessons:[
      {
        h:"The sky as a storybook",
        p:["Thousands of years ago, farmers, sailors and travellers needed the sky. It told them when to plant crops, when winter was coming, and which way was north.",
           "With no maps, they invented a trick: connect bright stars with imaginary lines and give the shapes names. A hunter, a bear, a swan, a scorpion. If you can remember the story, you can remember the way home."],
        note:"A constellation is an official region of the sky. There are 88 of them, and every star you can see belongs to one."
      },
      {
        h:"Meet the Big Dipper",
        p:["Seven bright stars in the constellation Ursa Major look like a soup ladle with a bent handle. In North America it is called the Big Dipper; in the UK, the Plough.",
           "Follow the two stars at the far edge of the bowl and keep going straight about five times that distance. You will land on Polaris, the North Star — which sits almost exactly above Earth's north pole."],
        note:"Because Polaris barely moves during the night, finding it is like finding north. It has guided travellers for centuries."
      },
      {
        h:"Why the stars seem to move",
        p:["Stars do drift, but they are so far away that your whole life would barely show it. What you actually see is Earth turning.",
           "Earth spins once about every 24 hours, so the whole sky appears to sweep past overhead — while the North Star stays still because it is lined up with Earth's axis."],
        note:"The star trails in long-exposure photos are not stars racing — they are proof that Earth is spinning."
      }
    ],
    art:"constellation",
    activity:{
      type:"constellation",
      title:"Connect the Big Dipper",
      hint:"Tap the stars in order, starting at number 1, to draw the dipper's bowl and handle."
    },
    quiz:[
      { q:"What do we call a group of stars that forms a picture in the sky?",
        options:["A constellation","A galaxy","A crater","A comet"],
        correct:0, hint:"The word starts with 'con-' and sounds a bit like 'constellation'.",
        explain:"A constellation is a named pattern of stars. There are 88 official constellations covering the whole sky." },
      { q:"Which star sits almost exactly above Earth's north pole?",
        options:["Polaris (the North Star)","Sirius","The Sun","Betelgeuse"],
        correct:0, hint:"It is named after the direction it marks.",
        explain:"Polaris stays in nearly the same spot all night, which is why it has been used for navigation for centuries." },
      { q:"Why do the stars appear to move across the sky during the night?",
        options:["Because Earth is spinning","Because the stars are running away","Because the Moon pushes them","Because the sky is moving"],
        correct:0, hint:"Look at what your own planet is doing while you stand still.",
        explain:"Earth rotates once every 24 hours, so the night sky sweeps past us. The stars themselves barely move." }
    ],
    reward:{ label:"Stargazer Badge", icon:"✦" }
  },
  {
    id:2, hue:190, emoji:"🚀", title:"Rocket Pioneers",
    subtitle:"Why a rocket needs nothing to push against — and how thrust works.",
    skill:"Thrust & motion",
    intro:"A rocket is a machine that throws hot gas backwards extremely fast. The gas pushes back, and the rocket goes forward. Simple idea, enormous engineering.",
    lessons:[
      {
        h:"Newton's third law",
        p:["Isaac Newton wrote it down in 1687: for every action there is an equal and opposite reaction.",
           "Push a wall, and the wall pushes back on your hand. A rocket throws gas down; the gas throws the rocket up. It does not need air to push against — that is exactly why rockets work in the emptiness of space."],
        note:"The force on the rocket equals the force on the gas. Rockets work in a vacuum because the reaction is between the rocket and its own exhaust."
      },
      {
        h:"Building enough push",
        p:["The Saturn V rocket that carried astronauts to the Moon weighed about 2,970 tonnes at launch, and most of that was fuel.",
           "To get away from Earth you need a speed of about 11.2 km per second — 40,000 km/h. Nothing you can do with wheels gets close; you must carry your own oxygen and burn hard for minutes."],
        note:"Rockets are built in stages: empty fuel tanks are dropped off so the rest of the rocket does not have to carry dead weight."
      },
      {
        h:"Gravity is a hill, not a wall",
        p:["Getting to orbit is not about going high — it is about going sideways fast enough to keep missing the ground.",
           "At about 7.8 km per second, an object falls towards Earth exactly as fast as the curved Earth drops away beneath it. That is orbit: falling forever, and never landing."],
        note:"Try it in the orbit mission later — this is the same idea that keeps the Moon circling Earth."
      }
    ],
    art:"rocket",
    activity:{
      type:"thrust",
      title:"Launch console",
      hint:"Slide the throttle up to <b>100% thrust</b> and feel the rocket climb."
    },
    quiz:[
      { q:"Which law explains why hot gas shooting downwards pushes a rocket upwards?",
        options:["Newton's third law of motion","The law of magnetism","The law of buoyancy","The law of reflection"],
        correct:0, hint:"It is the 'equal and opposite reaction' one.",
        explain:"Action: gas is pushed down. Reaction: the rocket is pushed up with the same force. This works even where there is no air." },
      { q:"Why can a rocket fly in space where there is no air?",
        options:["It carries its own oxidiser and pushes against its exhaust","It pushes against the air","Its wings create lift","Space has extra gravity"],
        correct:0, hint:"Think about what comes out of the engine.",
        explain:"A rocket carries both fuel and oxygen, and the reaction force comes from throwing its own exhaust backwards — no air required." },
      { q:"Roughly how fast must you travel to stay in low Earth orbit?",
        options:["About 7.8 km per second","About 100 km per hour","About 1 km per second","About 300 km per hour"],
        correct:0, hint:"It is many times faster than a speeding bullet.",
        explain:"At around 7.8 km/s you fall around Earth as fast as the ground curves away, so you keep orbiting instead of landing." }
    ],
    reward:{ label:"Rocket Wings", icon:"🚀" }
  },
  {
    id:3, hue:265, emoji:"🛰", title:"Spacecraft Pilot",
    subtitle:"Life support, power and the systems that keep a crew alive.",
    skill:"Systems & power",
    intro:"A spacecraft is a tiny, sealed world. Air, water, power and temperature are all managed by machines — and a pilot has to watch every one of them.",
    lessons:[
      {
        h:"The air you carry",
        p:["There is no air in space, so a spacecraft brings its own. Most stations use a mix of oxygen and nitrogen at about the pressure you feel at sea level.",
           "Oxygen is often made by splitting water with electricity, and carbon-dioxide scrubbers remove the gas you breathe out. Without those two systems, the air would go bad within hours."],
        note:"The station's life-support system is called ECLSS — Environmental Control and Life Support System."
      },
      {
        h:"Power from sunlight",
        p:["Solar panels turn sunlight into electricity. Near Earth, each square metre can collect about 1,360 watts of sunlight — enough, with good panels, to run pumps, computers and lights.",
           "The panels also charge batteries, because a spacecraft in low orbit spends about 45 minutes of every 90-minute loop in Earth's shadow."],
        note:"Solar panels work better in space than on the ground: there is no cloud, no night-time air, and no atmosphere to dim the light."
      },
      {
        h:"A cockpit built for mistakes",
        p:["Everything important has a backup, and the important alarms are hard to ignore. Pilots run checklists out loud, in pairs, so a tired voice cannot skip a step.",
           "Modern spacecraft can fly themselves most of the time — but crews still train manually, because computers fail and because a human can notice something a sensor cannot."],
        note:"Checklists are not a sign of forgetting. They are how professionals make sure nothing is missed when they are tired or busy."
      }
    ],
    art:"cockpit",
    activity:{
      type:"systems",
      title:"Bring the ship online",
      hint:"Switch on <b>all three</b> systems. Keep them green."
    },
    quiz:[
      { q:"Why does a spacecraft need solar panels and batteries?",
        options:["Panels make power from sunlight and batteries store it for the dark half of the orbit","To look shiny","To keep the ship cool","To send radio waves"],
        correct:0, hint:"One collects, the other saves it for later.",
        explain:"Sunlight makes electricity through the panels, and batteries keep the ship running while it is in Earth's shadow." },
      { q:"What does a carbon-dioxide scrubber do?",
        options:["Removes the CO₂ that the crew breathes out","Makes the ship heavier","Cools the engines","Creates gravity"],
        correct:0, hint:"Breathing out too much of one gas is the problem.",
        explain:"Crews breathe out carbon dioxide. Scrubbers remove it so the cabin air stays safe to breathe." },
      { q:"Why do pilots use checklists even for tasks they know well?",
        options:["To make sure no step gets missed under pressure","Because they forget everything","To waste time","Because computers cannot count"],
        correct:0, hint:"Think about being tired and busy during a critical moment.",
        explain:"Checklists turn memory into a reliable procedure, so important steps are never skipped when the crew is busy or stressed." }
    ],
    reward:{ label:"Pilot Wings", icon:"🛰" }
  },
  {
    id:4, hue:150, emoji:"🌱", title:"Living in Orbit",
    subtitle:"Eating, sleeping and staying healthy when everything floats.",
    skill:"Microgravity",
    intro:"Orbit feels weightless, but gravity has not switched off. Astronauts are falling around Earth — and everything inside the station falls with them.",
    lessons:[
      {
        h:"Why everything floats",
        p:["The space station is in free fall around Earth. Because the station and everything in it fall at the same rate, nothing presses down on anything else — so nothing stays on a table.",
           "This is called microgravity, or 'weightlessness'. Gravity is still about 90% as strong up there; you just cannot feel it while you fall together."],
        note:"Astronauts on the station orbit about 400 km up — that is roughly the distance from London to Paris, not very far at all."
      },
      {
        h:"Everyday life, rearranged",
        p:["Water forms floating blobs, so drinks come in pouches with straws. Food is often freeze-dried and rehydrated, and salt and pepper are liquids so they do not drift into eyes or vents.",
           "Sleeping bags are strapped to the wall. Astronauts can sleep in any direction — some say they feel like they are standing upright all night."],
        note:"Crumbs are banned on the station. A floating crumb can drift into an electrical panel or someone's lung."
      },
      {
        h:"Bodies need gravity",
        p:["Without weight pressing on bones and muscles, the body starts to weaken. Astronauts lose bone density and muscle mass unless they exercise hard — usually about two hours a day.",
           "Fluids also drift towards the head, which makes faces puffy and can affect eyesight. That is why crews measure their bodies carefully before, during and after a flight."],
        note:"Exercise is not just fitness in space; it is a medical requirement. Bikes and resistance machines are bolted to the station."
      }
    ],
    art:"station",
    activity:{
      type:"zerog",
      title:"Catch the floating snacks",
      hint:"Tap <b>all five</b> floating items before they drift out of reach."
    },
    quiz:[
      { q:"Why do astronauts float inside the space station?",
        options:["The station and everything in it are falling around Earth together","There is no gravity in space","The station spins very fast","Their suits are filled with helium"],
        correct:0, hint:"Free fall, not zero gravity.",
        explain:"They are in continuous free fall around Earth, so nothing presses on anything else. Gravity is still about 90% as strong as on the ground." },
      { q:"Why is exercise a daily requirement on the station?",
        options:["To stop bones and muscles weakening without gravity","To make the crew tired","To generate electricity","To heat the station"],
        correct:0, hint:"Think about what gravity normally does to your body.",
        explain:"Bones and muscles need load to stay strong. Without it they weaken, so astronauts exercise around two hours a day." },
      { q:"Why is loose food like crumbs and salt not allowed?",
        options:["It can float into eyes, lungs and electrical equipment","It tastes bad","It is too heavy","It attracts aliens"],
        correct:0, hint:"Anything that is not tied down goes wherever the air takes it.",
        explain:"In microgravity crumbs drift everywhere, and they can clog filters or damage electronics. Food is packaged to stay put." }
    ],
    reward:{ label:"Orbit Gardener", icon:"🌱" }
  },
  {
    id:5, hue:275, emoji:"🛰️", title:"Space Navigation & Orbits",
    subtitle:"How spacecraft find their way — and why an orbit is a permanent fall.",
    skill:"Orbits & navigation",
    intro:"An orbit is not a road. It is a balance: sideways speed versus the pull of gravity. Change the speed, and you change the whole shape of your path.",
    lessons:[
      {
        h:"Orbits are shaped by speed",
        p:["Too slow, and gravity wins — you fall back down. Fast enough sideways, and you fall around the curve forever. Too fast, and you escape the planet completely.",
           "That is why almost every orbit is an oval, not a circle. Close to the planet you move fastest; far away you slow down. The lowest point is called perigee, the highest point apogee."],
        note:"Speed and height trade places. A satellite that dives low speeds up, exactly like a skateboarder dropping into a bowl."
      },
      {
        h:"Getting from one place to another",
        p:["You cannot fly a spacecraft straight to another planet like a plane. You time a burn of the engine so your new oval path touches both orbits.",
           "Engineers call this a Hohmann transfer. You wait for the two planets to line up, burn once to raise your orbit, coast for months, then burn again to stay at the destination. Fuel is so precious that missions can wait years for the right launch window."],
        note:"Missions to Mars launch roughly every 26 months, when Earth and Mars are in the right positions. Miss it and you wait two more years."
      },
      {
        h:"Finding your way with no signposts",
        p:["There are no street signs in space. A spacecraft works out where it is by measuring radio signals from Earth, and by watching the positions of the Sun and stars with special cameras called star trackers.",
           "It then adjusts using small thrusters — tiny puffs of gas that shift it by millimetres per second. In orbit, a small push, repeated, moves you a very long way."],
        note:"Star trackers compare the sky they see with a stored map of thousands of stars. It is the same trick ancient sailors used, done by a computer."
      }
    ],
    art:"orbit",
    activity:{
      type:"orbit",
      title:"Set a stable orbit",
      hint:"Raise the orbit speed until the satellite circles Earth without falling in or flying away."
    },
    quiz:[
      { q:"What is an orbit really?",
        options:["Falling around a planet fast enough to keep missing it","A road in space","A place where gravity stops","A circle drawn by the Moon"],
        correct:0, hint:"Think of a ball thrown so hard it never lands.",
        explain:"An orbit is continuous free fall. The sideways speed is just right, so the object falls around the curve of the planet instead of into it." },
      { q:"Why does a spacecraft sometimes wait years for a launch window?",
        options:["It needs the destination planet to be in the right position to save fuel","It is not finished being built","Rockets only work in summer","Astronauts need a holiday"],
        correct:0, hint:"The planets keep moving while you plan.",
        explain:"A transfer burn puts you on an oval path that must meet the target's orbit. The planets only line up at certain times, so timing saves enormous amounts of fuel." },
      { q:"How does a spacecraft work out where it is?",
        options:["By radio signals from Earth and star trackers that read the sky","By asking other spacecraft","By counting engine burns","By following a rope"],
        correct:0, hint:"Two methods: one from home, one from the stars.",
        explain:"Radio ranging measures distance from ground stations, and star trackers compare the sky with a stored star map to fix the spacecraft's direction." }
    ],
    reward:{ label:"Navigator Star", icon:"🛰️" }
  },
  {
    id:6, hue:15, emoji:"🎧", title:"Mission Control & Teamwork",
    subtitle:"Hundreds of people, one voice at a time — how a mission actually runs.",
    skill:"Communication",
    intro:"A mission is never one person. Flight controllers, engineers, doctors and scientists all watch different screens. Clear talking is what holds them together.",
    lessons:[
      {
        h:"Who is in the room",
        p:["In Mission Control, each desk owns one system: propulsion, power, life support, communications, weather, crew health. Each one reports to the Flight Director, who makes the final call.",
           "The person who talks to the crew is the CAPCOM — short for Capsule Communicator. One voice goes up, so the crew never has to work out who to listen to."],
        note:"'Flight' is what controllers call the Flight Director. In a real room, the words 'Flight, guidance, go/no-go' mean a decision is about to be made."
      },
      {
        h:"Talking so nothing is lost",
        p:["Radio traffic is short, ordered and repeatable. Controllers say the number, then the unit: 'two hundred, metres per second'. If it matters, the crew reads it back.",
           "Phrases like 'say again', 'stand by' and 'copy' exist so that nobody has to guess. A calm, clear voice is a trained skill, not a personality trait."],
        note:"Read-back is why important information survives noise and stress: the listener proves they heard it correctly."
      },
      {
        h:"When something goes wrong",
        p:["In April 1970 an oxygen tank exploded on Apollo 13, far from home. The crew and controllers had to invent a new plan using what was on board.",
           "They powered up the lunar module as a lifeboat, built a carbon-dioxide filter adapter from plastic and tape, and turned the engine off for hours to save power — then burned it precisely to come home. Everyone came back."],
        note:"The Apollo 13 crew never landed on the Moon. The mission is famous anyway, because the team solved a problem nobody had planned for."
      }
    ],
    art:"control",
    activity:{
      type:"comms",
      title:"Send a clean status report",
      hint:"Pick the <b>clearest and most complete</b> message for each situation."
    },
    quiz:[
      { q:"In Mission Control, who is the only person who speaks directly to the crew?",
        options:["The CAPCOM","The Flight Director","The flight surgeon","The weather officer"],
        correct:0, hint:"The name comes from 'capsule communicator'.",
        explain:"The CAPCOM is the single voice to the crew, so messages never overlap or contradict each other." },
      { q:"Why do crews read important numbers back to the ground?",
        options:["To prove the message was heard correctly","To practise their voices","To fill silence","To slow down the mission"],
        correct:0, hint:"It is a check, not a courtesy.",
        explain:"A read-back confirms that the exact value arrived without being misheard — vital when a number could mean danger." },
      { q:"What made Apollo 13 a successful failure?",
        options:["The team improvised a rescue and brought the crew home","They landed on the Moon anyway","The explosion never happened","They stayed in orbit for a year"],
        correct:0, hint:"The landing was cancelled — but what was saved?",
        explain:"The landing was abandoned. Controllers and crew worked together with limited power and improvised equipment to bring all three astronauts safely back to Earth." }
    ],
    reward:{ label:"Headset of Honour", icon:"🎧" }
  },
  {
    id:7, hue:205, emoji:"🌕", title:"The Moon Landing",
    subtitle:"The final approach: flying a lander with almost no fuel to spare.",
    skill:"Landing & precision",
    intro:"Landing on the Moon is not like landing a plane. There is no air to glide on, gravity is weaker, and the computer is far less powerful than the phone in your pocket.",
    lessons:[
      {
        h:"A very thin margin",
        p:["Apollo 11's lunar module had to slow from about 1.7 km per second to a gentle touchdown in around twelve minutes.",
           "The computer had about 2 kilobytes of usable memory — less than a single photo today. Alarms went off during the descent, and Neil Armstrong took manual control to steer past a boulder field, landing with roughly 20 seconds of fuel left."],
        note:"Armstrong and Aldrin landed on 20 July 1969 in the Sea of Tranquility. Michael Collins waited in orbit above them."
      },
      {
        h:"Flying with no air",
        p:["With no atmosphere there is no parachute and no wing lift. A lander slows down by pointing its engine at the direction of travel and burning.",
           "It also has to arrive upright. Thrusters fire in tiny pulses to tilt the craft, and on the last metres the engine blast kicks up dust that hides the ground — which is why the pilot watches for shadows and boulders instead."],
        note:"The dust problem is real: on later missions, pilots lost sight of the surface in the final seconds and had to land almost by feel."
      },
      {
        h:"What we left behind",
        p:["Six Apollo crews landed between 1969 and 1972. They brought back 382 kg of Moon rock, set up scientific instruments, and left footprints that will stay sharp for millions of years.",
           "The Moon has no wind or rain, so the only thing that slowly changes the surface is micrometeorite dust. Those footprints are a very long-lasting signature."],
        note:"Moon dust is sharp and clingy, like tiny glass. Astronauts tracked it into the cabin and it wore through seals and suits."
      }
    ],
    art:"moon",
    activity:{
      type:"lander",
      title:"Final descent",
      hint:"Tap <b>BURN</b> to slow your fall. Touch down gently at under <b>3 m/s</b>."
    },
    quiz:[
      { q:"Who was the first human to step onto the Moon?",
        options:["Neil Armstrong","Yuri Gagarin","Buzz Aldrin","Michael Collins"],
        correct:0, hint:"His first step came with the words 'one small step'.",
        explain:"Neil Armstrong stepped out on 20 July 1969. Buzz Aldrin followed, while Michael Collins stayed in orbit aboard the command module." },
      { q:"Why can a Moon lander not use a parachute?",
        options:["The Moon has no atmosphere to fill it","Parachutes are too heavy","The Moon is too cold","Gravity is too strong"],
        correct:0, hint:"Parachutes need something to push against.",
        explain:"With essentially no air, a parachute would do nothing. Landers slow down by firing an engine against their direction of travel." },
      { q:"Why will astronaut footprints on the Moon last so long?",
        options:["There is no wind or rain to erase them","The dust is made of glue","The Moon has no gravity","They were covered in plastic"],
        correct:0, hint:"Think about weather — or the lack of it.",
        explain:"Without wind or rain, the prints are only slowly worn away by micrometeorite dust, so they can survive for millions of years." }
    ],
    reward:{ label:"Lunar Medal", icon:"🌕" }
  },
  {
    id:8, hue:48, emoji:"🌞", title:"Space Weather & Solar Storms",
    subtitle:"The Sun throws storms at us — and we can see them coming.",
    skill:"Solar weather",
    intro:"The Sun is not a calm ball of light. It breathes, it flares, and sometimes it throws a billion tonnes of charged particles straight at Earth.",
    lessons:[
      {
        h:"The Sun has weather",
        p:["The Sun's surface boils with tangled magnetic fields. When those fields twist and snap, the Sun releases a burst of X-rays called a solar flare — and sometimes a cloud of charged particles called a coronal mass ejection, or CME.",
           "A CME can cross the 150 million kilometres to Earth in one to three days. When it arrives it shakes our magnetic field, and we call that a geomagnetic storm."],
        note:"Sunlight takes about 8 minutes 20 seconds to reach us. A CME takes a day or more — and that gap is exactly why we can forecast it."
      },
      {
        h:"What a storm does to us",
        p:["Charged particles can build up on satellites and cause sparks, confuse GPS signals, and make radio communication fade out. On the ground, a big storm can push extra current into power lines and damage transformers.",
           "The good news: Earth's magnetic field and atmosphere shield everyone on the surface. Astronauts on the space station are protected too, but a crew travelling to the Moon or Mars would need a storm shelter."],
        note:"In 1859 a huge storm — the Carrington Event — made telegraph wires spark and lit auroras so bright that people could read newspapers at midnight."
      },
      {
        h:"Watching the Sun",
        p:["Spacecraft like SOHO and the Parker Solar Probe watch the Sun every minute, and ground observatories track dark sunspots — cooler patches where the magnetic field is strongest.",
           "Forecasters at space weather centres issue alerts so satellite operators can switch to safe mode, airlines can reroute polar flights, and astronauts can move to a shielded module."],
        note:"Auroras are the beautiful side of space weather: particles funnelled towards the poles make the sky glow green, red and purple."
      }
    ],
    art:"sunstorm",
    activity:{
      type:"shield",
      title:"Ride out the solar storm",
      hint:"A flare is on its way. Switch on <b>all three</b> protections before the timer runs out."
    },
    quiz:[
      { q:"What is a coronal mass ejection (CME)?",
        options:["A huge cloud of charged particles thrown out by the Sun","A hole punched in the Sun","A kind of space telescope","A moon of Jupiter"],
        correct:0, hint:"It is a mass of material, ejected from the Sun's outer atmosphere.",
        explain:"A CME is a billion-tonne cloud of plasma flung from the Sun's corona. If it reaches Earth it can trigger a geomagnetic storm." },
      { q:"Why can we forecast a solar storm a day or more ahead?",
        options:["The particles travel slower than light, so we see the flare first","The Sun sends us a warning message","Storms only ever happen on Mondays","We cannot forecast them at all"],
        correct:0, hint:"Light is the fastest thing there is.",
        explain:"Light from a flare arrives in about 8 minutes, but the particles themselves take one to three days. That gap is our warning time." },
      { q:"What protects people on Earth's surface from solar radiation?",
        options:["Earth's magnetic field and atmosphere","A very large sun hat","The Moon","Nothing at all"],
        correct:0, hint:"Two natural layers of shielding.",
        explain:"The magnetosphere deflects most charged particles and the atmosphere absorbs the rest, so people on the ground stay safe." }
    ],
    reward:{ label:"Storm Shield", icon:"🌞" }
  },
  {
    id:9, hue:200, emoji:"🧑‍🚀", title:"Spacewalks & EVA",
    subtitle:"Stepping outside in a suit that is really a tiny spaceship.",
    skill:"EVA & suits",
    intro:"An EVA — extravehicular activity — is the most dangerous thing astronauts do. Outside the airlock there is nothing between you and space but a few layers of fabric and plastic.",
    lessons:[
      {
        h:"A suit is a one-person spacecraft",
        p:["An EVA suit supplies oxygen, removes carbon dioxide, keeps the temperature steady, and holds pressure around your body. It has its own radio, lights, cameras and a small computer.",
           "It is heavy — around 120 kg on Earth — but in orbit it weighs nothing, so astronauts move it with their arms and legs rather than carrying it."],
        note:"The suit's cooling system circulates water through a tight-fitting garment, because a sealed suit traps a lot of body heat."
      },
      {
        h:"Never let go",
        p:["Every spacewalker wears a safety tether clipped to the station, and often a second one. Tools are tethered too, because a dropped wrench becomes a fast-moving hazard that never comes back.",
           "Astronauts also use a SAFER jetpack as a last-resort rescue device, and they rehearse every task in a giant water tank on Earth, where floating feels similar to orbit."],
        note:"The first spacewalk was by Alexei Leonov in 1965. His suit stiffened so much in vacuum that he had to let air out of it to squeeze back through the airlock."
      },
      {
        h:"Working outside",
        p:["Spacewalks usually last six to eight hours. Astronauts work in pairs, following a checklist read out by a partner inside, and they stop often to check tethers, gloves and suit readings.",
           "The station orbits every 90 minutes, so a spacewalker sees a sunrise or sunset roughly every 45 minutes — and the temperature swings by more than 200 degrees."],
        note:"Gloves are the most fragile part of a suit. They are checked carefully for cuts, because a small tear can damage a hand in vacuum."
      }
    ],
    art:"eva",
    activity:{
      type:"order",
      title:"Prepare for your spacewalk",
      hint:"Tap the steps in the <b>correct order</b>, from first to last."
    },
    quiz:[
      { q:"Why do astronauts wear a tether during a spacewalk?",
        options:["So they cannot drift away from the station","To keep them warm","To charge their suit battery","To talk to Mission Control"],
        correct:0, hint:"Think about what happens if you push off and nothing holds you.",
        explain:"A tether keeps the astronaut attached to the station. Without it, a small push would send them drifting away with no way to return." },
      { q:"What does an EVA suit NOT have to provide?",
        options:["Gravity","Oxygen","Pressure around the body","A radio"],
        correct:0, hint:"One of these is not something a machine can make inside a suit.",
        explain:"A suit supplies air, pressure, cooling and communications — but it cannot create gravity. Astronauts stay weightless the whole time." },
      { q:"Why do astronauts train for spacewalks in a giant water tank?",
        options:["Floating in water feels similar to floating in orbit","Water is good for their skin","It is cheaper than a simulator","To practise swimming"],
        correct:0, hint:"Think about how buoyancy compares to weightlessness.",
        explain:"Neutral buoyancy in water mimics the slow, floating motion of orbit, so crews can rehearse every movement of a real spacewalk." }
    ],
    reward:{ label:"EVA Wings", icon:"🧑‍🚀" }
  },
  {
    id:10, hue:20, emoji:"🔧", title:"Rocket Engineering",
    subtitle:"Why rockets are built in pieces, and why most of it is thrown away.",
    skill:"Engineering",
    intro:"A rocket is mostly fuel tank. Engineers fight one enemy the whole time: weight. Every kilogram you carry is a kilogram you must lift.",
    lessons:[
      {
        h:"The tyranny of the rocket equation",
        p:["To go faster you need more fuel. But more fuel means a bigger tank, and a bigger tank means more weight, which needs even more fuel. This spiral is called the rocket equation, and it is why rockets are enormous.",
           "The trick is staging: build the rocket in sections and drop each empty one as soon as it is used up, so the rest of the vehicle does not have to carry dead weight."],
        note:"The Saturn V that went to the Moon was 110 metres tall and about 85% of its launch mass was propellant."
      },
      {
        h:"Engines, nozzles and thrust",
        p:["A rocket engine burns fuel with an oxidiser and pushes the hot gas out through a bell-shaped nozzle. The nozzle shape matters: it lets the gas expand and speeds it up, which increases thrust.",
           "Engineers measure efficiency as specific impulse — how much push you get per kilogram of fuel per second. Hydrogen and oxygen give a very high value, which is why they are used for upper stages."],
        note:"A nozzle that is too wide for the surrounding air pressure wastes thrust. That is why some engines have two nozzle sizes for different altitudes."
      },
      {
        h:"Reusable rockets",
        p:["For decades every rocket was thrown away after one flight. Modern boosters can fly back, land on their tail, and be refuelled for the next launch — which cuts the cost of reaching orbit dramatically.",
           "Landing a booster is hard: it must slow from thousands of kilometres per hour, steer with grid fins, and touch down on a moving ship at sea, all automatically."],
        note:"Reusability is the biggest change in rocketry since the 1960s. It is the reason launching satellites is now far cheaper than it used to be."
      }
    ],
    art:"engineering",
    activity:{
      type:"pick",
      title:"Assemble a working rocket",
      hint:"Choose the <b>three</b> parts every orbital rocket must have."
    },
    quiz:[
      { q:"Why are rockets built in stages?",
        options:["So empty tanks can be dropped and not carried further","To make them look taller","Because one engine is not enough","To carry more astronauts"],
        correct:0, hint:"Think about weight that is no longer useful.",
        explain:"Staging sheds empty tanks and engines as they are used up, so the remaining vehicle does not waste fuel lifting dead weight." },
      { q:"What does a rocket nozzle do?",
        options:["Lets hot gas expand and speed up, increasing thrust","Cools the fuel","Steers with wings","Stores oxygen"],
        correct:0, hint:"It is shaped like a bell for a reason.",
        explain:"The bell shape allows exhaust gas to expand and accelerate, which converts more of the engine's energy into forward thrust." },
      { q:"Why does reusing a booster matter so much?",
        options:["It makes reaching orbit much cheaper","It makes rockets quieter","It removes the need for fuel","It makes launches slower"],
        correct:0, hint:"Think about what you normally throw away after one use.",
        explain:"The rocket hardware is a huge part of launch cost. Flying it again instead of discarding it lowers the price of every mission." }
    ],
    reward:{ label:"Engineer's Wrench", icon:"🔧" }
  },
  {
    id:11, hue:170, emoji:"📡", title:"Satellites & GPS",
    subtitle:"How a constellation of robots tells your phone exactly where you are.",
    skill:"Satellites",
    intro:"Right now, dozens of satellites are broadcasting the time. Your phone listens to several at once and works out where it must be — using nothing but clocks and geometry.",
    lessons:[
      {
        h:"Different orbits, different jobs",
        p:["Low Earth orbit, a few hundred kilometres up, is perfect for taking pictures of the ground and for the space station. It is close, so details are sharp, but the satellite races past in about 90 minutes.",
           "Geostationary orbit is 35,786 km up, where one lap takes exactly 24 hours — so the satellite appears to hang still over one spot. That is ideal for television and weather watching."],
        note:"A GPS satellite sits in medium Earth orbit at about 20,200 km, circling twice a day."
      },
      {
        h:"Finding yourself with clocks",
        p:["Each GPS satellite broadcasts its position and the exact time. Your phone measures how long the signal took to arrive, which gives the distance to that satellite — a sphere of possible positions.",
           "With three satellites you can narrow it to two points, and a fourth resolves which one is real. That is why your phone needs to see at least four satellites to give a fix."],
        note:"GPS satellites carry atomic clocks accurate to a few billionths of a second. A timing error of one millionth of a second would put you 300 metres off."
      },
      {
        h:"What satellites do for us",
        p:["Weather satellites watch storms form. Earth-observation satellites track fires, crops and ice. Communication satellites carry phone calls and internet across oceans.",
           "They also watch the Sun, measure sea level, and relay data from Mars rovers back to Earth. Much of modern life quietly depends on machines you never see."],
        note:"Space junk is a growing problem: a fleck of paint travelling at 7 km per second can crack a window on the space station."
      }
    ],
    art:"satellite",
    activity:{
      type:"pick",
      title:"Get a position fix",
      hint:"Your phone needs a fix. Select <b>three</b> satellites that are in view."
    },
    quiz:[
      { q:"How many GPS satellites must your phone usually see to work out its position?",
        options:["At least four","One","Two","Twenty"],
        correct:0, hint:"Three narrows it down, and one more settles it.",
        explain:"Three satellites give two possible points; a fourth resolves which is correct and also checks the phone's clock." },
      { q:"What is special about geostationary orbit?",
        options:["The satellite takes 24 hours per lap, so it seems to hang still","It is the closest orbit to Earth","It is where the space station flies","It has no gravity"],
        correct:0, hint:"Match the orbit period to Earth's rotation.",
        explain:"At 35,786 km the orbital period equals one day, so the satellite stays above the same point on the ground — perfect for weather and TV." },
      { q:"Why do GPS satellites need atomic clocks?",
        options:["A tiny timing error would mean a huge position error","To keep them warm","To power the solar panels","To talk to each other"],
        correct:0, hint:"Light travels 300 metres in a millionth of a second.",
        explain:"Distance is measured from travel time, so even a billionth-of-a-second error shifts the answer. Atomic clocks keep that error tiny." }
    ],
    reward:{ label:"Signal Badge", icon:"📡" }
  },
  {
    id:12, hue:300, emoji:"🛏️", title:"Living in Zero Gravity",
    subtitle:"Sleeping, washing and staying strong when nothing stays put.",
    skill:"Microgravity life",
    intro:"A long stay in orbit changes your body. Astronauts train for months to keep their muscles, bones and balance working without the pull of gravity.",
    lessons:[
      {
        h:"Your body notices immediately",
        p:["Fluids drift towards the head, so faces look puffy and legs look thinner. The inner ear, which normally senses which way is down, gets confused — that is why many astronauts feel sick for the first day or two.",
           "After a few weeks the body adapts: it makes less blood, and the heart does not have to pump so hard against gravity."],
        note:"Astronauts grow about 3% taller in orbit because the discs in the spine expand without weight pressing them together."
      },
      {
        h:"Staying strong on purpose",
        p:["Without load, muscles shrink and bones lose minerals — roughly 1% of bone mass per month if nothing is done. So crews exercise about two hours a day on a treadmill, a bike and a resistance machine.",
           "The treadmill has a harness with bungee cords that pulls the runner down, because otherwise they would simply float off it."],
        note:"Exercise in orbit is a medical treatment, not a hobby. It is the main defence against weakened bones and muscles."
      },
      {
        h:"Everyday habits, rebuilt",
        p:["Astronauts wash with wet wipes and rinseless shampoo, because water will not run. Hair is cut over a vacuum hose so the clippings are captured.",
           "Sleeping bags are strapped to the wall, and crew members often tuck their arms in so they do not float up and wake them. There is no up or down, so any wall will do."],
        note:"Astronauts see about 16 sunrises a day, so the station keeps a strict schedule of lights and alarms to protect their sleep."
      }
    ],
    art:"zeroglife",
    activity:{
      type:"zerog",
      title:"Catch the drifting supplies",
      hint:"Tap <b>all five</b> floating items before they drift out of reach."
    },
    quiz:[
      { q:"Why do astronauts exercise about two hours a day in orbit?",
        options:["To stop bones and muscles weakening without gravity","To pass the time","To generate electricity","To stay warm"],
        correct:0, hint:"Think about what gravity normally does to your body.",
        explain:"Bones and muscles need load to stay strong. Without it they weaken quickly, so exercise is a medical requirement in orbit." },
      { q:"Why do astronauts grow slightly taller in space?",
        options:["The discs in the spine expand without weight pressing on them","They eat more food","The station stretches them","Gravity pulls them upward"],
        correct:0, hint:"Think about what squashes your spine on Earth.",
        explain:"Without gravity compressing the spine, the discs between the vertebrae expand, so astronauts can be about 3% taller." },
      { q:"How do astronauts wash in orbit?",
        options:["With wet wipes and rinseless shampoo","In a normal shower","By floating in a water bubble","They do not wash"],
        correct:0, hint:"Water does not run when there is no down.",
        explain:"Water forms floating blobs instead of flowing, so crews use wipes and rinseless products to stay clean." }
    ],
    reward:{ label:"Orbit Athlete", icon:"🛏️" }
  },
  {
    id:13, hue:250, emoji:"🔭", title:"Deep Space & Telescopes",
    subtitle:"Looking so far away that you see the past.",
    skill:"Astronomy",
    intro:"A telescope is a time machine. Because light takes time to travel, every distant object you see is shown as it was long ago.",
    lessons:[
      {
        h:"Bigger is better",
        p:["A telescope's job is to collect light. A wider mirror gathers more of it, which lets you see fainter objects, and a wider mirror also sharpens the image.",
           "That is why observatories are built on mountain tops, above much of the blurring atmosphere — and why the best telescope of all is the one in orbit."],
        note:"The James Webb Space Telescope's mirror is 6.5 metres across and made of 18 gold-coated hexagons that unfold after launch."
      },
      {
        h:"Looking back in time",
        p:["Light from the Sun takes 8 minutes to reach us, so you always see the Sun as it was 8 minutes ago. Light from the nearest star after the Sun takes about 4.2 years.",
           "Look at a galaxy 50 million light-years away and you are seeing it as it was 50 million years ago — before humans existed. The deepest images show galaxies whose light left them over 13 billion years ago."],
        note:"A light-year is a distance, not a time: about 9.5 trillion kilometres. It is simply how far light travels in one year."
      },
      {
        h:"Seeing the invisible",
        p:["Stars also shine in light our eyes cannot see. Infrared telescopes reveal warm dust and newborn stars hidden inside clouds, while radio telescopes pick up cold gas and even the faint echo of the Big Bang.",
           "Putting telescopes in space removes the atmosphere entirely, and lets them stay cold — which is essential for detecting faint infrared heat."],
        note:"Radio telescopes can be linked across continents to act like one giant dish thousands of kilometres wide."
      }
    ],
    art:"telescope",
    activity:{
      type:"focus",
      title:"Focus the telescope",
      hint:"Slide the focus until the distant galaxy becomes <b>sharp and clear</b>."
    },
    quiz:[
      { q:"Why is a bigger telescope mirror better?",
        options:["It collects more light and gives a sharper image","It is easier to build","It makes the stars move","It needs no maintenance"],
        correct:0, hint:"Think about what a telescope is really doing.",
        explain:"A wider mirror gathers more light, so fainter objects become visible, and it also improves the sharpness of the image." },
      { q:"When you look at a star 4.2 light-years away, what are you seeing?",
        options:["The star as it was 4.2 years ago","The star as it is right now","The star in the future","A reflection of the Sun"],
        correct:0, hint:"Light takes time to travel.",
        explain:"Light from that star has been travelling for 4.2 years, so you see it as it was then — a telescope is a time machine." },
      { q:"Why do infrared telescopes work better in space?",
        options:["The atmosphere blocks much infrared, and space is cold","Space is closer to the stars","There is more light in space","Gravity helps the mirror"],
        correct:0, hint:"Two reasons: one about the air, one about temperature.",
        explain:"Earth's atmosphere absorbs most infrared, and a warm telescope glows in infrared itself. Cold space removes both problems." }
    ],
    reward:{ label:"Deep Sky Lens", icon:"🔭" }
  },
  {
    id:14, hue:12, emoji:"🏕️", title:"Mars Colonization",
    subtitle:"What it would really take to live on another planet.",
    skill:"Colony planning",
    intro:"Mars is the most habitable world after Earth — and it is still trying to kill you. Thin air, deadly cold, no liquid water on the surface, and radiation from space.",
    lessons:[
      {
        h:"The journey and the landing",
        p:["Mars is 55 to 400 million kilometres away, depending on where the planets are. A crewed trip would take about seven months each way, and the crew would have to wait on Mars for over a year for the planets to line up for the return.",
           "Landing is the hard part: Mars has just enough atmosphere to burn you up but not enough to slow you down, so spacecraft need heat shields, parachutes and retro-rockets."],
        note:"Because of the launch window, a Mars mission is roughly a three-year round trip. There is no coming home early."
      },
      {
        h:"Staying alive there",
        p:["A colony would need airtight habitats, probably buried under soil or built from it, because Mars has almost no magnetic field and only a thin atmosphere to block radiation.",
           "Water ice exists under the surface and at the poles. Oxygen can be made from that ice by splitting it with electricity, and rocket fuel can be made from the carbon dioxide in the air."],
        note:"The MOXIE experiment on the Perseverance rover made oxygen from Martian air — a small but real proof that it can be done."
      },
      {
        h:"Growing food and staying sane",
        p:["Food would be grown indoors under LED light, in soil or in water with nutrients. Experiments on the space station have already grown lettuce, radishes and chillies in orbit.",
           "The hardest part may be people. A small crew, far from home, with a long communication delay, needs strong routines, privacy and clear roles. Teamwork is life support too."],
        note:"Radio signals take 4 to 24 minutes to travel one way between Earth and Mars, so a Mars crew cannot ask for help in an emergency."
      }
    ],
    art:"marsbase",
    activity:{
      type:"pick",
      title:"Stock the colony",
      hint:"Choose the <b>three</b> things a Mars base cannot survive without."
    },
    quiz:[
      { q:"Why is landing on Mars harder than landing on the Moon?",
        options:["Mars has enough air to heat you up but not enough to slow you down","Mars is closer to the Sun","Mars has stronger gravity than Earth","There is no gravity on Mars"],
        correct:0, hint:"It is a problem of having too little of something useful.",
        explain:"Mars' thin atmosphere creates fierce heating on entry but provides too little drag, so landers need heat shields, parachutes and rockets." },
      { q:"How could a Mars colony get oxygen?",
        options:["By splitting water ice or carbon dioxide with electricity","By importing it from Earth","By breathing the Martian air directly","By growing it in trees"],
        correct:0, hint:"Think about what oxygen can be extracted from.",
        explain:"Water ice can be split into hydrogen and oxygen, and carbon dioxide in the air can also be split. MOXIE proved this on Mars." },
      { q:"Why would a Mars colony need to be buried or shielded?",
        options:["Mars has almost no magnetic field or thick atmosphere to block radiation","To keep it tidy","To hide from aliens","Because it is too windy"],
        correct:0, hint:"Think about what protects us on Earth.",
        explain:"Without a strong magnetic field and thick air, radiation from space reaches the surface, so habitats need soil or other shielding." }
    ],
    reward:{ label:"Colony Founder", icon:"🏕️" }
  },
  {
    id:15, hue:45, emoji:"🎓", title:"Becoming an Astronaut",
    subtitle:"The last mission: how real astronauts are chosen and trained.",
    skill:"Graduation",
    intro:"You have flown every mission in the academy. Now the final question: what does it actually take to be chosen for a real spaceflight?",
    lessons:[
      {
        h:"Who gets picked",
        p:["Space agencies look for people who are calm under pressure, work well in a team, and can learn fast. Most astronauts are scientists, engineers, doctors or pilots, and many apply several times before being chosen.",
           "Physical fitness matters, but so does the ability to stay friendly and useful in a small crew for months. Astronauts are tested in teams, not just as individuals."],
        note:"The first astronauts were chosen partly because they were test pilots used to staying calm when things went wrong."
      },
      {
        h:"Two years of training",
        p:["New astronauts spend about two years learning before they are assigned to a flight: spacecraft systems, robotics, spacewalking in the water tank, survival training, and Russian or English if it is not their first language.",
           "They also fly jet aircraft to build quick decision-making, and they practise every emergency procedure until it is automatic."],
        note:"Astronauts keep training for their whole career. Every mission has new experiments and new hardware to learn."
      },
      {
        h:"What the job is really like",
        p:["A flight day is scheduled almost minute by minute: experiments, exercise, maintenance, meals, conferences with the ground, and a short window before sleep.",
           "The best part, astronauts often say, is looking out of the window. The hardest part is being away from family — and the first few days back on Earth, when gravity feels very heavy indeed."],
        note:"Astronauts describe seeing Earth from orbit as the 'overview effect': borders disappear and the atmosphere looks like a thin, fragile line."
      }
    ],
    art:"graduation",
    activity:{
      type:"comms",
      title:"Final board review",
      hint:"Answer the <b>three</b> board questions the way a real astronaut would."
    },
    quiz:[
      { q:"What do space agencies look for most in astronaut candidates?",
        options:["Calmness under pressure and strong teamwork","Being the tallest applicant","Having the loudest voice","Never making a mistake"],
        correct:0, hint:"Think about living in a small crew for months.",
        explain:"Technical skill can be taught. Agencies select for judgement, calm and the ability to work well with others in a confined crew." },
      { q:"Roughly how long is basic astronaut training before a first flight?",
        options:["About two years","About two weeks","About ten years","No training is needed"],
        correct:0, hint:"It is measured in years, not days.",
        explain:"Candidates spend around two years learning systems, robotics, spacewalks and survival skills before being assigned to a mission." },
      { q:"What is the 'overview effect' astronauts describe?",
        options:["Seeing Earth from orbit makes it look fragile and borderless","A problem with their eyesight","The feeling of being dizzy","A type of space suit"],
        correct:0, hint:"It is about how Earth looks from up there.",
        explain:"From orbit, national borders vanish and the atmosphere appears as a thin line, which many astronauts find deeply moving." }
    ],
    reward:{ label:"Academy Wings", icon:"🎓" }
  }
];

/* ---------------- ECONOMY ----------------
   Deliberately slow: a first-time mission pays 3 lesson stars + 3 quiz
   answers + a completion bonus, and nothing pays twice. Practice runs pay a
   small training stipend so a determined cadet can still grind towards the
   legendary tier, but the top items take a lot of flying.
   ------------------------------------------ */

const STAGE_BONUS = 15;
const QUIZ_POINTS = 4;
const LESSON_POINTS = 1;
const PLANET_POINTS = 2;
const PRACTICE_STIPEND = 10;

/* ---------------- RARITY ---------------- */

export { STAGES, STAGE_BONUS, QUIZ_POINTS, LESSON_POINTS, PLANET_POINTS, PRACTICE_STIPEND };
