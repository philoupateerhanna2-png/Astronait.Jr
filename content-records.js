/**
 * Educational content metadata for the 15 Astronaut Jr missions.
 * Record status is intentionally explicit: source mapping is not the same as
 * expert scientific approval. See docs/educational-content-quality-section-14.md.
 */
const COMMON_AGE = 'Ages 9–13 (approximate; adapt to reading level and local curriculum)';
const records = [
[1,'Observe patterns in the night sky and explain why stars appear to move.',['constellations','Polaris','Earth rotation'],['People may think constellations are physically close groups of stars','Stars move around Earth each night'],['https://www.iau.org/public/themes/constellations/','https://science.nasa.gov/universe/stars/'],'Identify a constellation and explain apparent daily motion using Earth’s rotation.'],
[2,'Explain rocket motion using Newton’s third law and describe why rockets work in a vacuum.',['action–reaction','thrust','rocket exhaust','orbit'],['A rocket pushes against air to move','Rockets cannot work in a vacuum'],['https://www.grc.nasa.gov/www/k-12/rocket/','https://www.nasa.gov/learning-resources/'],'Use an action–reaction model to explain rocket thrust and distinguish thrust from lift.'],
[3,'Describe spacecraft life-support, power and redundancy systems.',['oxygen','carbon-dioxide removal','solar arrays','batteries','checklists'],['Spacecraft can use cabin air indefinitely without recycling','Solar panels generate power in Earth’s shadow'],['https://www.nasa.gov/reference/environmental-control-and-life-support-system-eclss/','https://www.nasa.gov/international-space-station/'],'Match life-support and electrical subsystems to the problems they solve.'],
[4,'Explain how plants and people can be supported in a controlled space environment.',['plant growth','water','light','nutrients','closed-loop systems'],['Plants grow in space exactly as they do on Earth without adaptation','Microgravity means plants have no gravity-related responses'],['https://www.nasa.gov/missions/station/','https://science.nasa.gov/biological-physical/'],'Identify resources plants need and describe one challenge of growing them in space.'],
[5,'Describe orbit as continuous free fall and distinguish orbital speed from simply reaching altitude.',['gravity','velocity','orbit','trajectory'],['There is no gravity in orbit','Orbit means an object is beyond Earth’s gravity'],['https://science.nasa.gov/solar-system/orbits-and-gravity/','https://www.nasa.gov/learning-resources/'],'Explain qualitatively how forward motion and gravity combine to produce an orbit.'],
[6,'Explain how communication, procedures and teamwork support mission operations.',['communication delay','mission control','roles','checklists'],['Mission Control can communicate instantly with every spacecraft','Teamwork is optional when automation is available'],['https://www.nasa.gov/missions/','https://www.nasa.gov/directorates/somd/space-communications-navigation-program/'],'Describe why clear communication and coordinated roles matter during a mission.'],
[7,'Describe major steps and engineering challenges involved in a lunar landing.',['lunar environment','descent','landing systems','surface exploration'],['The Moon has an Earth-like atmosphere','Landing is easy because the Moon has no atmosphere'],['https://www.nasa.gov/humans-in-space/artemis/','https://science.nasa.gov/moon/'],'Sequence key phases of a lunar landing and identify an environmental challenge.'],
[8,'Explain how solar activity can affect Earth and space technology.',['Sun','solar flares','coronal mass ejections','magnetosphere','space weather'],['All solar activity directly causes dangerous effects on the ground','Solar flares and coronal mass ejections are identical'],['https://science.nasa.gov/sun/','https://science.nasa.gov/heliophysics/space-weather/'],'Distinguish solar activity types and give one possible space-weather impact.'],
[9,'Identify the functions and limitations of spacesuits during extravehicular activity.',['pressure','oxygen','thermal control','mobility','EVA'],['A spacesuit is just clothing and does not provide life support','Astronauts can safely expose themselves to vacuum briefly'],['https://www.nasa.gov/humans-in-space/spacesuits/','https://www.nasa.gov/international-space-station/'],'Match spacesuit subsystems to the hazards they protect astronauts from.'],
[10,'Connect rocket design choices with forces, mass, energy and engineering constraints.',['mass','thrust','staging','propulsion','design trade-offs'],['A larger rocket is automatically more efficient','Rocket stages are discarded for appearance rather than mass reduction'],['https://www.grc.nasa.gov/www/k-12/rocket/','https://www.nasa.gov/learning-resources/'],'Explain one engineering trade-off and why reducing carried mass can help a launch vehicle.'],
[11,'Explain how satellites support communication, observation and navigation.',['orbits','remote sensing','communications','GPS timing'],['GPS works from one satellite alone','Satellites remain fixed above every point on Earth'],['https://science.nasa.gov/earth/','https://www.gps.gov/systems/gps/'],'Match satellite applications to their purpose and explain why navigation uses multiple satellites.'],
[12,'Describe how microgravity changes everyday activities and how astronauts adapt.',['microgravity','free fall','fluid movement','exercise','adaptation'],['There is no gravity aboard the ISS','Astronauts float because they are outside Earth’s gravitational field'],['https://www.nasa.gov/missions/station/','https://www.nasa.gov/humans-in-space/'],'Explain floating as continuous free fall and identify an adaptation for living in orbit.'],
[13,'Explain how telescopes collect light and why different wavelengths reveal different features.',['aperture','light collection','wavelengths','infrared','atmosphere'],['A telescope makes distant objects physically closer','All wavelengths pass through Earth’s atmosphere equally'],['https://science.nasa.gov/universe/','https://science.nasa.gov/mission/webb/','https://science.nasa.gov/mission/hubble/'],'Relate telescope design and wavelength choice to the observations scientists can make.'],
[14,'Evaluate the environmental and engineering challenges of a possible human mission to Mars.',['radiation','thin atmosphere','water ice','life support','communication delay'],['Mars has breathable air','A Mars crew can communicate with Earth instantly'],['https://science.nasa.gov/mars/','https://mars.nasa.gov/','https://www.nasa.gov/humans-in-space/'],'Identify essential habitat needs and explain one challenge that differs from living on Earth.'],
[15,'Describe astronaut selection and training as a combination of technical and teamwork skills.',['training','teamwork','procedures','experiments','adaptability'],['Astronauts are selected only for physical strength','Astronaut training ends after one course'],['https://www.nasa.gov/humans-in-space/astronauts/','https://www.nasa.gov/learning-resources/'],'Give examples of technical and interpersonal skills needed for safe mission work.']
];
export const CONTENT_RECORDS = records.map(([missionId, learningObjective, keyConcepts, misconceptions, sources, assessmentAlignment]) => ({
  missionId, targetAge: COMMON_AGE, learningObjective, keyConcepts, sourceUrls: sources,
  lesson: 'Use the mission lesson cards in js/data/missions.js; review each factual sentence against the linked primary/official sources.',
  activity: 'Use the mission activity defined in js/data/missions.js; observe whether the learner applies the learning objective.',
  quiz: 'Use the three mission quiz items in js/data/missions.js; each item must have one defensible correct option and an explanation.',
  misconceptionToAddress: misconceptions,
  assessmentAlignment,
  contentRecordUpdated: '2026-11-15',
  scientificReview: { status: 'Pending knowledgeable human reviewer', reviewedAt: null, reviewer: null },
  claimTraceability: { status: 'Source mapping supplied; sentence-level audit pending', auditedAt: null }
}));
export function validateContentRecords(stages) {
  const errors = [];
  if (CONTENT_RECORDS.length !== 15) errors.push(`Expected 15 content records; found ${CONTENT_RECORDS.length}`);
  const ids = new Set(CONTENT_RECORDS.map(r => r.missionId));
  for (const stage of stages) {
    const r = CONTENT_RECORDS.find(x => x.missionId === stage.id);
    if (!r) { errors.push(`Mission ${stage.id} has no content record`); continue; }
    if (!r.learningObjective || !r.targetAge || !r.keyConcepts.length || !r.sourceUrls.length || !r.lesson || !r.activity || !r.quiz || !r.misconceptionToAddress.length) errors.push(`Mission ${stage.id} has an incomplete content record`);
    if (!stage.quiz?.length) errors.push(`Mission ${stage.id} has no quiz`);
    for (const [i,q] of (stage.quiz || []).entries()) {
      if (!q.q?.trim() || !Array.isArray(q.options) || q.options.length < 2 || !Number.isInteger(q.correct) || q.correct < 0 || q.correct >= q.options.length || !q.explain?.trim() || !q.hint?.trim()) errors.push(`Mission ${stage.id}, question ${i+1} has incomplete assessment fields`);
      if (new Set(q.options.map(x => x.trim().toLowerCase())).size !== q.options.length) errors.push(`Mission ${stage.id}, question ${i+1} has duplicate options`);
    }
  }
  for (const id of ids) if (!stages.some(s => s.id === id)) errors.push(`Content record references unknown mission ${id}`);
  return errors;
}
export function getContentRecord(missionId) { return CONTENT_RECORDS.find(r => r.missionId === missionId) || null; }
