export const STAGES = [
  { name: "Little Pebble", description: "A smooth little pebble, ready for its journey.", image: "assets/rock.svg", sessions: 4 },
  { name: "Mineral Seed", description: "Tiny mineral details are beginning to form.", image: "assets/stage-2.svg", sessions: 5 },
  { name: "Crystal Bud", description: "Your first crystal points are appearing.", image: "assets/stage-3.svg", sessions: 6 },
  { name: "Growing Crystal", description: "A lovely cluster is taking shape.", image: "assets/stage-4.svg", sessions: 8 },
  { name: "Grand Crystal", description: "A magnificent crystal formation. Look how far you've come!", image: "assets/stage-5.svg", sessions: 8 }
];

// One completed study block = one growth point. Breaks never grow the rock.
export function addGrowth(profile) {
  const next = { ...profile };
  if (next.stage >= STAGES.length) return { profile: next, evolved: false };
  next.sessionsTowardNextStage = (next.sessionsTowardNextStage || 0) + 1;
  let evolved = false;
  if (next.sessionsTowardNextStage >= STAGES[next.stage - 1].sessions) {
    next.stage += 1;
    next.sessionsTowardNextStage = 0;
    evolved = true;
  }
  return { profile: next, evolved };
}
export function stageProgress(profile) {
  if (profile.stage >= STAGES.length) return { current: 1, required: 1, percent: 100 };
  const required = STAGES[profile.stage - 1].sessions;
  const current = profile.sessionsTowardNextStage || 0;
  return { current, required, percent: Math.min(100, current / required * 100) };
}