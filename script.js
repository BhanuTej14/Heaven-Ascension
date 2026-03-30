(function(){
function startupError(message){
  try {
    var box=document.createElement("div");
    box.style.position="fixed";box.style.left="16px";box.style.right="16px";box.style.top="16px";box.style.zIndex="99999";box.style.padding="14px 16px";box.style.borderRadius="12px";box.style.background="#2b0f13";box.style.color="#fff";box.style.border="1px solid rgba(255,120,120,.45)";box.style.fontFamily="Arial, sans-serif";box.style.fontSize="14px";box.textContent="Startup error: "+message+". Please use the latest repaired zip version.";
    document.body.appendChild(box);
  } catch(e) {}
}
try {
const cultivationData = [
  { realm: "Mortal Realm", description: "The path begins in mortal flesh. Body, meridians, soul, and foundation are forged here.", levels: [["Body Tempering", "Strengthens muscles, bones, and organs. First step beyond ordinary mortals."],["Spirit Gathering", "Absorbs worldly qi into the body and awakens spiritual perception."],["Meridian Opening", "Opens energy channels and improves cultivation speed."],["Core Condensation", "Forms a spiritual nucleus for stable, explosive power."],["Nascent Soul", "Soul separates from mere flesh and lifespan rises greatly."],["Soul Palace", "Builds an inner spiritual world to hold will and techniques."],["Heaven Ascension", "Peak of the Mortal Realm. Heaven tests whether you can step upward."]]},
  { realm: "Upper Realm", description: "Cultivation ceases to be merely human. Heaven and earth start bending around your will.", levels: [["Earth Spirit", "Energy becomes denser and control over the environment begins."],["Heaven Spirit", "Borrows the power of heaven and earth."],["Void Walking", "Traverses short spatial distances and endures realm pressure."],["Domain Forging", "Creates a personal domain to suppress weaker enemies."],["Law Seed", "Comprehends the seed of a natural law such as sword, fire, death, or space."],["Law Embryo", "Law understanding becomes usable in battle."],["True Ascendant", "Peak of the Upper Realm. Qualified to seek immortality."]]},
  { realm: "Immortal Realm", description: "Mortality loosens. Immortal essence, immortal techniques, and heavenly authority begin to bloom.", levels: [["Loose Immortal", "First immortal body, no longer bound by mortal decay."],["True Immortal", "Body and soul become stable immortal entities."],["Golden Immortal", "Immortal essence turns radiant and hard to destroy."],["Profound Immortal", "Deepens law mastery and creates immortal techniques."],["Heavenly Immortal", "Resonates with heavens and immortal storms."],["Immortal Lord", "Rules lesser immortal regions."],["Immortal King", "Peak of the Immortal Realm. Eligible for sainthood."]]},
  { realm: "Saint Realm", description: "A saint stands above ordinary immortals, complete in soul and law on a far higher plane.", levels: [["Saint Initiate", "Steps onto the saint path with a holy soul."],["Lesser Saint", "Saint aura can suppress lower worlds."],["True Saint", "Completes one great path of law."],["Great Saint", "Touches fate, karma, and destiny."],["Saint Lord", "Commands saintly domains and heavenly order."],["Saint King", "A crowned saint who can ruin immortal dynasties."],["Saint Sovereign", "Peak of sainthood, one step from emperor authority."]]},
  { realm: "Emperor Realm", description: "Imperial authority descends. These rulers suppress worlds and command order on a vast scale.", levels: [["Quasi-Emperor", "Half-step into emperor destiny."],["True Emperor", "Possesses true imperial might."],["Heaven Emperor", "Commands countless regions and heavenly authority."],["Void Emperor", "Controls space, void, and dimensional suppression."],["Law Emperor", "Laws submit to the cultivator's will."],["Great Emperor", "Can found eternal empires across many worlds."],["Emperor Sovereign", "Peak emperor nearing true divinity."]]},
  { realm: "God Realm", description: "Lower worlds now view the cultivator as a true god, overwhelming in power and authority.", levels: [["Demi-God", "First touch of godhood."],["True God", "Divine body and divine authority are formed."],["Ancient God", "A vast and ancient oppressive divine presence."],["God Lord", "Rules divine kingdoms or races."],["God King", "Can kill emperors as mortals kill ants."],["Supreme God", "Commands multiple divine laws."],["God Sovereign", "Peak godhood, eligible for source transition."]]},
  { realm: "Semi-Origin Realm", description: "A transition between created existence and source existence. Reality itself grows thin here.", levels: [["Origin Spark", "First touch of source energy."],["Origin Vessel", "Body grows capable of carrying origin force."],["Origin Lord", "Uses incomplete origin authority."],["Half-Origin King", "Far surpasses ordinary gods."],["Pseudo-Origin Sovereign", "Creates proto-worlds and imperfect realities."],["Source Saint", "Soul nears source-level purity."],["Half-Origin Ancestor", "Peak of the Semi-Origin Realm."]]},
  { realm: "Origin Realm", description: "The source of existence can now be touched directly. Creation itself responds to your will.", levels: [["Origin Being", "Truly enters the source path."],["Origin Lord", "Controls origin essence directly."],["Origin King", "Shapes worlds from source substance."],["Origin Emperor", "Will becomes a law of creation."],["Origin Sovereign", "Can rewrite lower realities."],["Origin Ancestor", "One of the oldest source existences."],["Origin Master", "Peak of the Origin Realm, ready to touch chaos."]]},
  { realm: "Chaos Realm", description: "Beyond origin, the cultivator stands in primordial chaos before order ever existed.", levels: [["Chaos Seed", "Can hold chaotic primal force."],["Chaos Body", "Flesh, soul, and dao become chaos-compatible."],["Chaos Lord", "Survives and fights in primal chaos."],["Chaos King", "Can create or devour world seas."],["Chaos Emperor", "Commands vast chaos authority."],["Chaos Sovereign", "One of the supreme rulers of chaos existence."],["Chaos Origin", "Peak of the entire path and near-absolute existence."]]},
];

const STAGES_PER_LEVEL = 10;
const enemyTemplates = ["Forest Bandit","Stone Ape","Blood Wolf","Cave Serpent","Bone Puppet","Storm Hawk","Shadow Cultivator","Iron Shell Beast"];
const beastTemplates = [
  { name: "Azure Crane", rank: "Rare", meditation: 1.2, power: 10, crit: 2 },
  { name: "Thunder Wolf", rank: "Epic", meditation: 0.7, power: 18, crit: 4 },
  { name: "Flame Qilin Cub", rank: "Legendary", meditation: 1.5, power: 28, crit: 6 },
  { name: "Void Fox", rank: "Mythic", meditation: 2.2, power: 36, crit: 9 }
];
const gearTiers = ["Common","Spirit","Earth","Heaven","Void","Saint"];
const missions = [
  { name: "Guard the mountain pass", reward: (s)=> `${18 + s.realmIndex*12} Stones, ${3 + s.levelIndex} Insight`, difficulty: "Low" },
  { name: "Recover hidden herbs", reward: (s)=> `${8 + s.realmIndex*3} Herbs, ${10 + s.realmIndex*5} Stones`, difficulty: "Medium" },
  { name: "Escort a sect caravan", reward: (s)=> `${5 + s.realmIndex*3} Willpower, ${14 + s.levelIndex*4} Stones`, difficulty: "Medium" },
  { name: "Clear a rogue beast nest", reward: (s)=> `${2 + Math.floor(s.realmIndex/2)} Beast Cores, ${20 + s.realmIndex*8} Stones`, difficulty: "High" },
  { name: "Study an ancient tablet", reward: (s)=> `${10 + s.realmIndex*5} Insight, ${4 + s.levelIndex} Willpower`, difficulty: "Low" }
];

const upgrades = [
  { id:"breath", name:"Breath Cycle", description:"Meditation gains +1 per second per rank.", baseCost:10, currency:"spiritStones", currencyLabel:"Spirit Stones", apply: s => s.upgrades.breath++, cost(s){return Math.floor(this.baseCost*Math.pow(1.9,s.upgrades.breath));}, label:s=>`Rank ${s.upgrades.breath}` },
  { id:"will", name:"Heart Tempering", description:"Breakthrough chance +4% per rank.", baseCost:16, currency:"insight", currencyLabel:"Insight", apply: s => s.upgrades.will++, cost(s){return Math.floor(this.baseCost*Math.pow(2.05,s.upgrades.will));}, label:s=>`Rank ${s.upgrades.will}` },
  { id:"resist", name:"Thunder Vein", description:"Tribulation resistance +5% per rank.", baseCost:24, currency:"willpower", currencyLabel:"Willpower", apply: s => s.upgrades.resist++, cost(s){return Math.floor(this.baseCost*Math.pow(2.25,s.upgrades.resist));}, label:s=>`Rank ${s.upgrades.resist}` },
  { id:"combat", name:"Battle Sutra", description:"Battle power +8 per rank. Makes fights and missions safer.", baseCost:20, currency:"spiritStones", currencyLabel:"Spirit Stones", apply: s => s.upgrades.combat++, cost(s){return Math.floor(this.baseCost*Math.pow(2.05,s.upgrades.combat));}, label:s=>`Rank ${s.upgrades.combat}` },
];

const REQUIRED_IDS = "currentRealm,currentLevel,levelDescription,qiText,qiBar,meditationRate,breakPower,tribulationResist,injuryText,insightText,stoneText,willText,tribulationText,herbText,coreText,requiredExp,chanceText,riskText,nextDestination,tribulationState,dangerText,penaltyText,recoveryText,worldTrack,worldBadge,upgradeList,log,meditateBtn,breakthroughBtn,healBtn,saveBtn,exportSaveBtn,importSaveBtn,importSaveFile,saveStatusText,installBtn,resetBtn,lightningLayer,particles,modal,modalEyebrow,modalTitle,modalBody,modalClose,battlePowerText,defenseText,critText,beastNameText,enemyBadge,enemyName,enemyPower,enemyHp,enemyHpBar,exploreBtn,fightBtn,missionBadge,missionName,missionReward,missionDifficulty,rerollMissionBtn,missionBtn,pillCount,qiPillText,healPillText,craftQiPillBtn,craftHealPillBtn,useQiPillBtn,useHealPillBtn,beastRankText,beastDesc,beastChance,beastCost,huntCoresBtn,tameBeastBtn,gearTierText,weaponText,armorText,relicText,forgeWeaponBtn,forgeArmorBtn,forgeRelicBtn,autoMeditationText,offlineText,streakText,missionBonusText".split(",");
const els = Object.fromEntries(REQUIRED_IDS.map(id => [id, document.getElementById(id)]));
const missingIds = REQUIRED_IDS.filter(id => !els[id]);
if (missingIds.length) throw new Error("Missing DOM elements: " + missingIds.join(", "));

const STORAGE_KEY = "heavenly-ascension-save-v3-full";
const SAVE_TIME_KEY = "heavenly-ascension-save-v3-full-time";

function defaultState(){
  return {
    realmIndex:0, levelIndex:0, stageIndex:0, qi:0, insight:0, spiritStones:0, willpower:0, herbs:0, beastCores:0,
    tribulationsSurvived:0, injuryStacks:0, combatStreak:0,
    upgrades:{ breath:0, will:0, resist:0, combat:0 },
    pills:{ qi:0, heal:0 },
    gear:{ weapon:0, armor:0, relic:0 },
    beast:null,
    enemy:null,
    missionIndex:0,
    logs:[{ text:"You awaken at the foot of the path. Grow through each stage, hunt enemies, and rise world by world.", type:"good" }]
  };
}

let state = loadState();

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return defaultState();
    const base = defaultState();
    const loaded = { ...base, ...JSON.parse(raw) };
    loaded.upgrades = { ...base.upgrades, ...(loaded.upgrades||{}) };
    loaded.pills = { ...base.pills, ...(loaded.pills||{}) };
    loaded.gear = { ...base.gear, ...(loaded.gear||{}) };
    loaded.logs = Array.isArray(loaded.logs) && loaded.logs.length ? loaded.logs : base.logs;
    if(!loaded.enemy) loaded.enemy = generateEnemy();
    return loaded;
  } catch { return defaultState(); }
}
function setSaveStatus(text){ if(els.saveStatusText) els.saveStatusText.textContent = text; }
function formatSaveTime(ts){ try { return new Date(ts).toLocaleString(); } catch(e){ return "Saved"; } }
function saveState(){
  const payload = JSON.stringify(state);
  localStorage.setItem(STORAGE_KEY, payload);
  const ts = new Date().toISOString();
  localStorage.setItem(SAVE_TIME_KEY, ts);
  setSaveStatus("Saved: " + formatSaveTime(ts));
  return payload;
}
const clamp = (v,min,max)=>Math.max(min,Math.min(max,v));
const getCurrentRealmData = ()=>cultivationData[state.realmIndex];
const getCurrentLevelData = ()=>getCurrentRealmData().levels[state.levelIndex];
const stageLabel = (index=state.stageIndex)=> index===9 ? "Stage 10 • Ultimate Perfection" : `Stage ${index+1}`;
const isLevelPeak = ()=> state.stageIndex===9;
const isRealmPeakLevel = ()=> state.levelIndex===getCurrentRealmData().levels.length-1;
const isRealmPeak = ()=> isRealmPeakLevel() && isLevelPeak();
const isFinalLevel = ()=> state.realmIndex===cultivationData.length-1 && isRealmPeak();
function totalStageIndex(){ let sum=0; for(let r=0;r<state.realmIndex;r++) sum += cultivationData[r].levels.length*STAGES_PER_LEVEL; return sum + state.levelIndex*STAGES_PER_LEVEL + state.stageIndex; }
function expRequired(){ const stage = totalStageIndex(); return Math.floor((18 + 5*Math.pow(stage+1,1.24))*Math.pow(1.3,state.realmIndex)*Math.pow(1.09,state.levelIndex)*(1 + state.stageIndex*0.18)); }
function gearPower(slot){ return state.gear[slot] * ({weapon:14, armor:10, relic:8}[slot]); }
function beastPower(){ return state.beast ? state.beast.power : 0; }
function meditationGainPerSecond(){ const base = 1 + state.realmIndex*0.8 + state.levelIndex*0.4 + state.stageIndex*0.18; const injuryPenalty=Math.max(0.4,1-state.injuryStacks*0.12); const beastBonus=state.beast ? state.beast.meditation : 0; return +((base + state.upgrades.breath + beastBonus) * injuryPenalty).toFixed(1); }
function breakthroughChance(){ const fill=Math.min(state.qi/expRequired(),1); const base=84 + state.realmIndex*1.5 + state.levelIndex*1.2 + state.upgrades.will*4 + fill*10 - state.stageIndex*3.2; return clamp(Math.round(base - state.injuryStacks*6), 28, 100); }
function tribulationResistance(){ return clamp(8 + state.upgrades.resist*5 + state.tribulationsSurvived*2 + Math.floor(gearPower("relic")/12) - state.injuryStacks*4, 0, 85); }
function regressionRisk(){ if(!isRealmPeak() || state.realmIndex===cultivationData.length-1) return 0; return clamp(45 - tribulationResistance(), 6, 45); }
function nextDestination(){ if(isFinalLevel()) return "Path Complete"; if(!isLevelPeak()) return `${getCurrentLevelData()[0]} • ${stageLabel(state.stageIndex+1)}`; if(!isRealmPeakLevel()) return `${getCurrentRealmData().levels[state.levelIndex+1][0]} • Stage 1`; return `${cultivationData[state.realmIndex+1].realm} • ${cultivationData[state.realmIndex+1].levels[0][0]} • Stage 1`; }
function currentDanger(){ if(!isRealmPeak() || state.realmIndex===cultivationData.length-1) return "Low"; const risk=regressionRisk(); return risk<=12?"Moderate":risk<=24?"High":"Extreme"; }
function battlePower(){ const base = 12 + totalStageIndex()*2 + state.upgrades.combat*8 + state.upgrades.will*3 + gearPower("weapon") + beastPower(); return Math.floor(base * (1 + state.combatStreak*0.03)); }
function defense(){ return 6 + state.realmIndex*4 + state.levelIndex*2 + gearPower("armor") + Math.floor(tribulationResistance()/4); }
function critChance(){ return clamp(5 + state.upgrades.will*2 + gearPower("relic")/10 + (state.beast?.crit || 0), 5, 60); }

function logEvent(text,type=""){ state.logs.push({text,type}); state.logs = state.logs.slice(-60); renderLog(); }
function renderLog(){ els.log.innerHTML=""; state.logs.forEach(entry=>{ const div=document.createElement("div"); div.className=`log-entry ${entry.type}`.trim(); div.textContent=entry.text; els.log.appendChild(div); }); }
function spawnParticle(burst=false){ const p=document.createElement("div"); p.className="particle"; p.style.left=`${35 + Math.random()*30}%`; p.style.bottom=`${52 + Math.random()*18}%`; p.style.animationDuration=`${burst ? 1.2+Math.random()*0.6 : 2.5+Math.random()*1.4}s`; p.style.transform=`scale(${0.7 + Math.random()*0.8})`; els.particles.appendChild(p); setTimeout(()=>p.remove(),4200); }
function showModal(eyebrow,title,body){ els.modalEyebrow.textContent=eyebrow; els.modalTitle.textContent=title; els.modalBody.textContent=body; els.modal.classList.remove("hidden"); }

function meditate(clickPower=1){
  if(isFinalLevel()){ logEvent("You already stand at Chaos Origin Ultimate Perfection. Meditation now only deepens eternity.","good"); return; }
  const gain = meditationGainPerSecond()*(0.75+0.25*clickPower);
  state.qi = clamp(state.qi + gain, 0, expRequired());
  state.spiritStones += Math.max(1, Math.floor(gain/3));
  if(Math.random()<0.30) state.herbs += 1;
  if(Math.random()<0.75) spawnParticle(false);
  render();
}

function advanceStageOrLevel(){
  const currentLevelName = getCurrentLevelData()[0];
  const previousStage = stageLabel();
  if(!isLevelPeak()){
    state.stageIndex += 1; state.qi = 0; state.insight += 2 + state.realmIndex; state.spiritStones += 4 + state.levelIndex; state.willpower += 2 + Math.floor(state.stageIndex/3);
    logEvent(`Breakthrough successful: ${currentLevelName} ${previousStage} → ${stageLabel()}.`,"good"); return;
  }
  if(isRealmPeakLevel()) return runTribulation();
  state.levelIndex += 1; state.stageIndex = 0; state.qi = 0; state.insight += 8 + state.realmIndex*4; state.spiritStones += 14 + state.levelIndex*6; state.willpower += 6 + state.realmIndex*3;
  logEvent(`Breakthrough successful: ${currentLevelName} Ultimate Perfection → ${getCurrentLevelData()[0]} Stage 1.`,"good");
}
function runTribulation(){
  const oldRealm = cultivationData[state.realmIndex].realm; const oldLevel = getCurrentLevelData()[0];
  const successChance = clamp(56 + state.upgrades.will*3 + tribulationResistance() + Math.floor(defense()/10) - state.realmIndex*2, 18, 95);
  els.lightningLayer.classList.remove("active"); void els.lightningLayer.offsetWidth; els.lightningLayer.classList.add("active"); for(let i=0;i<16;i++) setTimeout(()=>spawnParticle(true), i*40);
  if(Math.random()*100 < successChance){
    state.tribulationsSurvived += 1; state.realmIndex += 1; state.levelIndex = 0; state.stageIndex = 0; state.qi = 0; state.insight += 22 + state.realmIndex*10; state.spiritStones += 54 + state.realmIndex*26; state.willpower += 26 + state.realmIndex*12;
    logEvent(`Heavenly tribulation shattered above you, yet you endured. ${oldRealm} / ${oldLevel} Ultimate Perfection → ${cultivationData[state.realmIndex].realm} / ${cultivationData[state.realmIndex].levels[0][0]} Stage 1.`,"good");
    showModal("World Ascension","Heaven acknowledges your path.",`Lightning refined your dao and opened the gate from ${oldRealm} into ${cultivationData[state.realmIndex].realm}. You begin again at ${cultivationData[state.realmIndex].levels[0][0]} Stage 1.`);
  } else {
    state.injuryStacks += 1; state.qi = 0; state.combatStreak = 0;
    if(state.stageIndex>0) state.stageIndex = Math.max(0,state.stageIndex-2); else if(state.levelIndex>0){ state.levelIndex -=1; state.stageIndex=8; }
    logEvent("Tribulation failure! Heavenly lightning pierced your meridians. Dao injury formed and cultivation regressed.","warn");
    showModal("Tribulation Failure","Heaven was merciless.","You failed to overcome the ascension tribulation. Dao injuries scar your foundation, your cultivation regresses, and meditation becomes less efficient until you recover.");
  }
}
function breakthrough(){
  if(isFinalLevel()){ logEvent("At Chaos Origin Ultimate Perfection, there is no further breakthrough left to seize.","good"); return; }
  const needed = expRequired();
  if(state.qi < needed){ logEvent("Your qi pool is incomplete. Continue meditating before forcing a breakthrough.","warn"); return; }
  if(Math.random()*100 <= breakthroughChance()) advanceStageOrLevel();
  else { state.qi = Math.max(0,state.qi - Math.floor(needed*0.42)); state.injuryStacks = Math.min(state.injuryStacks+1,6); if(state.stageIndex>0 && Math.random()<0.35) state.stageIndex -= 1; logEvent("Breakthrough backlash! Qi scatters and your stage foundation shakes.","warn"); }
  render();
}

function healDaoInjury(forcePill=false){
  if(state.injuryStacks<=0){ logEvent("Your meridians are currently stable. No dao injury to heal."); return; }
  if(forcePill){
    if(state.pills.heal<=0){ logEvent("You have no Healing Pills.","warn"); return; }
    state.pills.heal -= 1; state.injuryStacks -= 2; state.injuryStacks = Math.max(0,state.injuryStacks); logEvent("A Healing Pill melts into warm spiritual mist. Dao injuries recede.","good"); render(); return;
  }
  const cost = 30 + state.injuryStacks*18;
  if(state.insight < cost || state.spiritStones < cost){ logEvent(`Healing failed. You need ${cost} Insight and ${cost} Spirit Stones to repair dao injuries.`,"warn"); return; }
  state.insight -= cost; state.spiritStones -= cost; state.injuryStacks -= 1; logEvent("You guided medicinal qi through your meridians. One layer of dao injury is removed.","good"); render();
}

function generateEnemy(){
  const power = Math.max(20, battlePower() * (0.7 + Math.random()*0.9));
  const hp = Math.floor(power * (2.2 + Math.random()*0.8));
  return { name: enemyTemplates[Math.floor(Math.random()*enemyTemplates.length)], power: Math.floor(power), hp, maxHp: hp };
}
function explore(){ state.enemy = generateEnemy(); logEvent(`You enter a wild zone and encounter ${state.enemy.name}.`,"good"); render(); }
function fightEnemy(){
  if(!state.enemy) state.enemy = generateEnemy();
  const playerHit = Math.floor(battlePower() * (0.65 + Math.random()*0.55) * (Math.random()*100 < critChance() ? 1.7 : 1));
  state.enemy.hp = Math.max(0, state.enemy.hp - playerHit);
  if(state.enemy.hp <= 0){
    const stoneGain = Math.floor(10 + state.enemy.power/4);
    const insightGain = Math.floor(2 + state.realmIndex + Math.random()*3);
    const coreGain = Math.random() < 0.35 ? 1 : 0;
    const herbGain = Math.random() < 0.55 ? 1 + Math.floor(state.realmIndex/2) : 0;
    state.spiritStones += stoneGain; state.insight += insightGain; state.herbs += herbGain; state.beastCores += coreGain; state.combatStreak += 1;
    state.qi = clamp(state.qi + Math.floor(expRequired()*0.14), 0, expRequired());
    logEvent(`You slew ${state.enemy.name}. +${stoneGain} Stones, +${insightGain} Insight${coreGain?`, +${coreGain} Beast Core`:""}${herbGain?`, +${herbGain} Herbs`:""}.`,"good");
    state.enemy = generateEnemy();
  } else {
    const enemyHit = Math.max(0, Math.floor(state.enemy.power * (0.35 + Math.random()*0.35) - defense()*0.25));
    if(enemyHit > battlePower()*0.28 && Math.random() < 0.28){ state.injuryStacks = Math.min(6, state.injuryStacks + 1); state.combatStreak = 0; logEvent(`${state.enemy.name} struck through your guard. You suffered a dao bruise.`,"warn"); }
    else logEvent(`You hit ${state.enemy.name} for ${playerHit} damage. It still stands.`,"");
  }
  render();
}

function currentMission(){ return missions[state.missionIndex % missions.length]; }
function rerollMission(){ state.missionIndex = Math.floor(Math.random()*missions.length); logEvent(`The sect assigns a new mission: ${currentMission().name}.`,`good`); render(); }
function completeMission(){
  const success = battlePower() + defense() > (45 + totalStageIndex()*3) || Math.random() < 0.65;
  const bonus = 1 + state.combatStreak*0.04;
  if(!success){ state.injuryStacks = Math.min(6, state.injuryStacks + 1); state.combatStreak = 0; logEvent(`Mission failed: ${currentMission().name}. Your foundation suffers backlash.`,"warn"); render(); return; }
  const stoneGain = Math.floor((16 + state.realmIndex*8 + state.levelIndex*3) * bonus);
  const insightGain = Math.floor((4 + state.realmIndex*3) * bonus);
  const willGain = Math.floor((3 + Math.floor(state.levelIndex/2)) * bonus);
  const herbGain = Math.random() < 0.5 ? 2 + state.realmIndex : 0;
  state.spiritStones += stoneGain; state.insight += insightGain; state.willpower += willGain; state.herbs += herbGain; state.combatStreak += 1;
  logEvent(`Mission complete: ${currentMission().name}. +${stoneGain} Stones, +${insightGain} Insight, +${willGain} Willpower${herbGain?`, +${herbGain} Herbs`:""}.`,"good");
  rerollMission();
}

function craftQiPill(){ if(state.herbs<6 || state.spiritStones<12){ logEvent("Not enough materials to craft a Qi Recovery Pill.","warn"); return; } state.herbs-=6; state.spiritStones-=12; state.pills.qi += 1; logEvent("You refined a Qi Recovery Pill.","good"); render(); }
function craftHealPill(){ if(state.herbs<8 || state.spiritStones<18){ logEvent("Not enough materials to craft a Healing Pill.","warn"); return; } state.herbs-=8; state.spiritStones-=18; state.pills.heal += 1; logEvent("You refined a Healing Pill.","good"); render(); }
function useQiPill(){ if(state.pills.qi<=0){ logEvent("You have no Qi Recovery Pills.","warn"); return; } state.pills.qi -=1; state.qi = clamp(state.qi + Math.floor(expRequired()*0.45), 0, expRequired()); logEvent("A Qi Recovery Pill melts on your tongue. Spiritual energy surges through your body.","good"); render(); }

function huntCores(){ const gain = Math.random() < 0.65 ? 1 + Math.floor(Math.random()*2) : 0; const herbs = Math.random() < 0.55 ? 2 + Math.floor(state.realmIndex/2) : 0; if(gain===0 && herbs===0){ state.injuryStacks = Math.min(6,state.injuryStacks+1); logEvent("The beast hunt went poorly and left you with minor injuries.","warn"); } else { state.beastCores += gain; state.herbs += herbs; logEvent(`You return from the hunting grounds with ${gain} Beast Cores and ${herbs} Herbs.`,"good"); } render(); }
function tameChance(){ return clamp(35 + state.upgrades.will*3 + Math.floor(state.beastCores*2) + state.realmIndex*2, 35, 90); }
function tameBeast(){
  const cost = 3 + state.realmIndex;
  if(state.beastCores < cost){ logEvent(`You need ${cost} Beast Cores to attempt taming.`,"warn"); return; }
  state.beastCores -= cost;
  if(Math.random()*100 < tameChance()){ state.beast = { ...beastTemplates[Math.floor(Math.random()*beastTemplates.length)] }; logEvent(`A spirit beast submits to you: ${state.beast.name} (${state.beast.rank}).`,"good"); }
  else { state.injuryStacks = Math.min(6,state.injuryStacks+1); logEvent("The beast rejected the bond and wounded your sea of consciousness.","warn"); }
  render();
}

function forgeCost(){ return { stones: 20 + state.realmIndex*8, cores: 4 + Math.floor(state.levelIndex/2) }; }
function gearName(slot, tier){ const pool = { weapon:["Spirit Sword","Moon Saber","Void Spear","Heaven Halberd"], armor:["Iron Robe","Cloud Armor","Star Vest","Saint Mail"], relic:["Jade Ring","Soul Lamp","Heaven Seal","Void Mirror"] }; return `${gearTiers[Math.min(tier,gearTiers.length-1)]} ${pool[slot][tier % pool[slot].length]}`; }
function forgeGear(slot){
  const cost = forgeCost();
  if(state.spiritStones < cost.stones || state.beastCores < cost.cores){ logEvent(`Not enough materials to forge ${slot}.`,"warn"); return; }
  state.spiritStones -= cost.stones; state.beastCores -= cost.cores; state.gear[slot] += 1;
  logEvent(`You forged ${gearName(slot, state.gear[slot]-1)}. Your ${slot} improved.`,"good"); render();
}

function buyUpgrade(id){
  const up = upgrades.find(u=>u.id===id); const cost = up.cost(state);
  if(state[up.currency] < cost){ logEvent(`Not enough ${up.currencyLabel} for ${up.name}.`,"warn"); return; }
  state[up.currency] -= cost; up.apply(state); logEvent(`${up.name} advanced to ${up.label(state)}.`,"good"); render();
}

function renderWorldTrack(){
  const realm = getCurrentRealmData(); els.worldTrack.innerHTML="";
  realm.levels.forEach((levelData,index)=>{ const div=document.createElement("div"); div.className="world-item"; if(index<state.levelIndex) div.classList.add("cleared"); if(index===state.levelIndex) div.classList.add("active"); const stageText = index<state.levelIndex ? "Ultimate Perfection reached" : index===state.levelIndex ? stageLabel() : "Not yet entered"; div.innerHTML=`<strong>${levelData[0]}</strong><small>${stageText}</small>`; els.worldTrack.appendChild(div); });
  els.worldBadge.textContent=`${realm.realm} • ${state.levelIndex+1}/${realm.levels.length}`;
}
function renderUpgrades(){
  els.upgradeList.innerHTML="";
  upgrades.forEach(up=>{ const card=document.createElement("div"); card.className="upgrade-card"; const btn=document.createElement("button"); btn.className="secondary-btn"; btn.textContent=`Upgrade • ${up.cost(state)} ${up.currencyLabel}`; btn.onclick=()=>buyUpgrade(up.id); card.innerHTML=`<div class="head-row"><strong>${up.name}</strong><span class="badge">${up.label(state)}</span></div><p>${up.description}</p>`; card.appendChild(btn); els.upgradeList.appendChild(card); });
}
function renderEnemy(){ if(!state.enemy) state.enemy = generateEnemy(); els.enemyBadge.textContent = state.enemy.hp > 0 ? "Engaged" : "Idle"; els.enemyName.textContent = state.enemy.name; els.enemyPower.textContent = state.enemy.power; els.enemyHp.textContent = `${state.enemy.hp} / ${state.enemy.maxHp}`; els.enemyHpBar.style.width = `${(state.enemy.hp/state.enemy.maxHp)*100}%`; }
function renderMission(){ const m=currentMission(); els.missionBadge.textContent = "Available"; els.missionName.textContent = m.name; els.missionReward.textContent = m.reward(state); els.missionDifficulty.textContent = m.difficulty; }
function renderBeast(){ els.beastNameText.textContent = state.beast ? state.beast.name : "None"; els.beastRankText.textContent = state.beast ? state.beast.rank : "None"; els.beastDesc.textContent = state.beast ? `${state.beast.name} increases meditation by ${state.beast.meditation.toFixed(1)}, battle power by ${state.beast.power}, crit by ${state.beast.crit}%.` : "A loyal spirit beast grants passive combat and meditation bonuses."; els.beastChance.textContent = `${tameChance()}%`; els.beastCost.textContent = `${3 + state.realmIndex}`; }
function renderGear(){ els.weaponText.textContent = state.gear.weapon ? gearName("weapon", state.gear.weapon-1) : "None"; els.armorText.textContent = state.gear.armor ? gearName("armor", state.gear.armor-1) : "None"; els.relicText.textContent = state.gear.relic ? gearName("relic", state.gear.relic-1) : "None"; els.gearTierText.textContent = gearTiers[Math.min(Math.max(state.gear.weapon,state.gear.armor,state.gear.relic)-1, gearTiers.length-1)] || "Common"; }
function render(){
  const lastSaved = localStorage.getItem(SAVE_TIME_KEY);
  setSaveStatus(lastSaved ? "Saved: " + formatSaveTime(lastSaved) : "Not saved yet");
  const realm = getCurrentRealmData(); const [level, desc] = getCurrentLevelData(); const needed=expRequired();
  els.currentRealm.textContent = realm.realm; els.currentLevel.textContent = `${level} • ${stageLabel()}`; els.levelDescription.textContent = desc;
  els.qiText.textContent = `${Math.floor(state.qi)} / ${needed}`; els.qiBar.style.width = `${Math.min(state.qi/needed*100,100)}%`;
  els.meditationRate.textContent = meditationGainPerSecond().toFixed(1); els.breakPower.textContent = `${breakthroughChance()}%`; els.tribulationResist.textContent = `${tribulationResistance()}%`; els.injuryText.textContent = state.injuryStacks>0 ? `${state.injuryStacks} stack${state.injuryStacks>1?"s":""}` : "None";
  els.insightText.textContent = state.insight; els.stoneText.textContent = state.spiritStones; els.willText.textContent = state.willpower; els.tribulationText.textContent = state.tribulationsSurvived; els.herbText.textContent = state.herbs; els.coreText.textContent = state.beastCores;
  els.requiredExp.textContent = needed; els.chanceText.textContent = `${breakthroughChance()}%`; els.riskText.textContent = `${regressionRisk()}%`; els.nextDestination.textContent = nextDestination(); els.tribulationState.textContent = isRealmPeak() && !isFinalLevel() ? "Awaiting Heavenly Trial" : "Dormant"; els.dangerText.textContent = currentDanger();
  els.battlePowerText.textContent = battlePower(); els.defenseText.textContent = defense(); els.critText.textContent = `${Math.floor(critChance())}%`;
  els.qiPillText.textContent = state.pills.qi; els.healPillText.textContent = state.pills.heal; els.pillCount.textContent = `${state.pills.qi + state.pills.heal} in stock`;
  els.autoMeditationText.textContent = `${meditationGainPerSecond().toFixed(1)}/sec`; els.offlineText.textContent = "Resources only"; els.streakText.textContent = state.combatStreak; els.missionBonusText.textContent = `${Math.floor(state.combatStreak*4)}%`;
  els.healBtn.disabled = state.injuryStacks<=0; els.breakthroughBtn.disabled = state.qi<needed && !isFinalLevel();
  renderWorldTrack(); renderUpgrades(); renderLog(); renderEnemy(); renderMission(); renderBeast(); renderGear(); saveState();
}

function bindClick(id, handler){
  if(!els[id]) throw new Error("Cannot bind missing element: " + id);
  els[id].onclick = handler;
}

bindClick("modalClose", ()=>els.modal.classList.add("hidden"));
bindClick("meditateBtn", ()=>meditate(1.2));
bindClick("breakthroughBtn", breakthrough);
bindClick("healBtn", ()=>healDaoInjury(false));
bindClick("exploreBtn", explore);
bindClick("fightBtn", fightEnemy);
bindClick("rerollMissionBtn", rerollMission);
bindClick("missionBtn", completeMission);
bindClick("craftQiPillBtn", craftQiPill);
bindClick("craftHealPillBtn", craftHealPill);
bindClick("useQiPillBtn", useQiPill);
bindClick("useHealPillBtn", ()=>healDaoInjury(true));
bindClick("huntCoresBtn", huntCores);
bindClick("tameBeastBtn", tameBeast);
bindClick("forgeWeaponBtn", ()=>forgeGear("weapon"));
bindClick("forgeArmorBtn", ()=>forgeGear("armor"));
bindClick("forgeRelicBtn", ()=>forgeGear("relic"));
bindClick("saveBtn", ()=>{ saveState(); logEvent("Your cultivation state has been sealed into memory.","good"); render(); });
bindClick("exportSaveBtn", ()=>{
  try{
    const payload = saveState();
    const blob = new Blob([payload], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "heavenly-ascension-save.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(url), 1000);
    logEvent("Save file exported successfully.","good");
    render();
  } catch(e){ logEvent("Export failed.","warn"); }
});
bindClick("importSaveBtn", ()=>{ els.importSaveFile.click(); });
els.importSaveFile.addEventListener("change", async (event)=>{
  const file = event.target.files && event.target.files[0];
  if(!file) return;
  try{
    const text = await file.text();
    const base = defaultState();
    const incoming = { ...base, ...JSON.parse(text) };
    incoming.upgrades = { ...base.upgrades, ...(incoming.upgrades||{}) };
    incoming.pills = { ...base.pills, ...(incoming.pills||{}) };
    incoming.gear = { ...base.gear, ...(incoming.gear||{}) };
    incoming.logs = Array.isArray(incoming.logs) && incoming.logs.length ? incoming.logs : base.logs;
    if(!incoming.enemy) incoming.enemy = generateEnemy();
    state = incoming;
    saveState();
    logEvent("Save file imported successfully.","good");
    render();
  } catch(e){
    logEvent("Import failed. That save file is invalid or corrupted.","warn");
  } finally {
    event.target.value = "";
  }
});
bindClick("resetBtn", ()=>{ if(!confirm("Erase your cultivation progress and begin from Body Tempering Stage 1?")) return; state=defaultState(); render(); });

setInterval(()=>{ if(document.hidden || isFinalLevel()) return; state.qi = clamp(state.qi + meditationGainPerSecond(), 0, expRequired()); state.spiritStones += Math.max(1, Math.floor(meditationGainPerSecond()/4)); if(Math.random()<0.28) state.herbs += 1; if(Math.random()<0.5) spawnParticle(false); render(); },1000);
setInterval(()=>{ if(document.hidden) return; if(Math.random()<0.12){ const events=[()=>{ const gain=3+state.realmIndex*2; state.insight += gain; logEvent(`A flash of comprehension descends. +${gain} Insight.`,"good"); },()=>{ const gain=6+state.levelIndex*2; state.spiritStones += gain; logEvent(`A hidden spirit vein cracks open. +${gain} Spirit Stones.`,"good"); },()=>{ const gain=4+state.realmIndex*2; state.willpower += gain; logEvent(`Your dao heart stabilizes during silent meditation. +${gain} Willpower.`,"good"); }]; events[Math.floor(Math.random()*events.length)](); render(); } },12000);
setInterval(()=>{ if(document.hidden) return; if(Math.random()<0.18){ state.enemy = generateEnemy(); renderEnemy(); } },15000);

if(!state.enemy) state.enemy = generateEnemy();
render();

} catch (err) {
  console.error(err);
  startupError(err && err.message ? err.message : String(err));
}
})();
