const GAME_DATA = [
  {
    world: "Mortal Realm",
    levels: [
      "Body Tempering",
      "Spirit Gathering",
      "Meridian Opening",
      "Core Condensation",
      "Nascent Soul",
      "Soul Palace",
      "Heaven Ascension"
    ]
  },
  {
    world: "Upper Realm",
    levels: [
      "Earth Spirit",
      "Heaven Spirit",
      "Void Walking",
      "Domain Forging",
      "Law Seed",
      "Law Embryo",
      "True Ascendant"
    ]
  },
  {
    world: "Immortal Realm",
    levels: [
      "Loose Immortal",
      "True Immortal",
      "Golden Immortal",
      "Profound Immortal",
      "Heavenly Immortal",
      "Immortal Lord",
      "Immortal King"
    ]
  },
  {
    world: "Saint Realm",
    levels: [
      "Saint Initiate",
      "Lesser Saint",
      "True Saint",
      "Great Saint",
      "Saint Lord",
      "Saint King",
      "Saint Sovereign"
    ]
  },
  {
    world: "Emperor Realm",
    levels: [
      "Quasi-Emperor",
      "True Emperor",
      "Heaven Emperor",
      "Void Emperor",
      "Law Emperor",
      "Great Emperor",
      "Emperor Sovereign"
    ]
  },
  {
    world: "God Realm",
    levels: [
      "Demi-God",
      "True God",
      "Ancient God",
      "God Lord",
      "God King",
      "Supreme God",
      "God Sovereign"
    ]
  },
  {
    world: "Semi-Origin Realm",
    levels: [
      "Origin Spark",
      "Origin Vessel",
      "Origin Lord",
      "Half-Origin King",
      "Pseudo-Origin Sovereign",
      "Source Saint",
      "Half-Origin Ancestor"
    ]
  },
  {
    world: "Origin Realm",
    levels: [
      "Origin Being",
      "Origin Lord",
      "Origin King",
      "Origin Emperor",
      "Origin Sovereign",
      "Origin Ancestor",
      "Origin Master"
    ]
  },
  {
    world: "Chaos Realm",
    levels: [
      "Chaos Seed",
      "Chaos Body",
      "Chaos Lord",
      "Chaos King",
      "Chaos Emperor",
      "Chaos Sovereign",
      "Chaos Origin"
    ]
  }
];

const SAVE_KEY = "heavenly-ascension-pwa-v2";
const MAX_STAGE = 10;

const REQUIRED_IDS = [
  "saveBtn",
  "exportSaveBtn",
  "importSaveBtn",
  "importSaveFile",
  "installBtn",
  "saveStatusText",
  "resetBtn",
  "realmName",
  "levelName",
  "stageName",
  "qiValue",
  "qiNeeded",
  "powerValue",
  "injuryValue",
  "stonesValue",
  "coresValue",
  "progressText",
  "progressFill",
  "meditateBtn",
  "breakthroughBtn",
  "healBtn",
  "exploreBtn",
  "fightBtn",
  "missionBtn",
  "craftQiPillBtn",
  "craftHealPillBtn",
  "forgeBtn",
  "beastBtn",
  "logOutput",
  "cultivationList",
  "qiPillCount",
  "healPillCount",
  "weaponTier",
  "armorTier",
  "relicTier",
  "beastRank",
  "streakValue",
  "enemyPanel",
  "tribulationFlash"
];

function getEl(id) {
  return document.getElementById(id);
}

function getRequiredElements() {
  const els = {};
  const missing = [];
  for (const id of REQUIRED_IDS) {
    const el = getEl(id);
    if (!el) missing.push(id);
    else els[id] = el;
  }
  if (missing.length) {
    throw new Error(`Missing DOM elements: ${missing.join(", ")}`);
  }
  return els;
}

function createDefaultState() {
  return {
    worldIndex: 0,
    levelIndex: 0,
    stage: 1,
    qi: 0,
    spiritStones: 0,
    beastCores: 0,
    daoInjury: 0,
    qiPills: 0,
    healPills: 0,
    weaponTier: 0,
    armorTier: 0,
    relicTier: 0,
    spiritBeastRank: 0,
    streak: 0,
    lastSavedAt: null,
    enemy: null
  };
}

let state = loadGame();
let els = null;
let deferredPrompt = null;

function safeNumber(v, fallback = 0) {
  return Number.isFinite(Number(v)) ? Number(v) : fallback;
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return createDefaultState();
    const parsed = JSON.parse(raw);
    return { ...createDefaultState(), ...parsed };
  } catch {
    return createDefaultState();
  }
}

function saveGame() {
  state.lastSavedAt = new Date().toLocaleString();
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  if (els) els.saveStatusText.textContent = `Saved: ${state.lastSavedAt}`;
}

function exportSave() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "heavenly-ascension-save.json";
  a.click();
  URL.revokeObjectURL(url);
  log("Save exported.");
}

function importSaveFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      state = { ...createDefaultState(), ...imported };
      saveGame();
      render();
      log("Save imported successfully.");
    } catch {
      alert("Invalid save file.");
    }
  };
  reader.readAsText(file);
}

function getCurrentWorld() {
  return GAME_DATA[state.worldIndex];
}

function getCurrentLevelName() {
  return getCurrentWorld().levels[state.levelIndex];
}

function getQiNeeded() {
  const difficulty = ((state.worldIndex * 7) + state.levelIndex + 1);
  const stageFactor = 1 + (state.stage - 1) * 0.32;
  return Math.floor(40 * Math.pow(1.32, difficulty) * stageFactor);
}

function getCombatPower() {
  const base = 10 + state.worldIndex * 400 + state.levelIndex * 65 + state.stage * 12;
  const gear = state.weaponTier * 18 + state.armorTier * 14 + state.relicTier * 20;
  const beast = state.spiritBeastRank * 24;
  const injuryPenalty = Math.floor(base * (state.daoInjury / 100) * 0.55);
  return Math.max(1, base + gear + beast + state.streak * 2 - injuryPenalty);
}

function getProgressPercent() {
  return Math.min(100, Math.floor((state.qi / getQiNeeded()) * 100));
}

function levelCompletedInWorld(index) {
  if (state.worldIndex > getCurrentWorldIndex()) return false;
  return index < state.levelIndex;
}

function getCurrentWorldIndex() {
  return state.worldIndex;
}

function log(message) {
  const line = document.createElement("div");
  line.className = "log-line";
  line.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
  els.logOutput.prepend(line);
  while (els.logOutput.children.length > 80) {
    els.logOutput.removeChild(els.logOutput.lastChild);
  }
}

function meditate() {
  const gainBase = 8 + state.worldIndex * 4 + state.levelIndex * 2;
  const pillBonus = state.qiPills > 0 ? 12 : 0;
  const injuryPenalty = 1 - Math.min(0.75, state.daoInjury / 140);
  const gain = Math.max(1, Math.floor((gainBase + pillBonus) * injuryPenalty));
  state.qi += gain;
  if (state.qiPills > 0) {
    state.qiPills -= 1;
    log(`You consumed 1 Qi Pill and gained ${gain} Qi.`);
  } else {
    log(`You meditated and gained ${gain} Qi.`);
  }
  render();
}

function breakthrough() {
  const needed = getQiNeeded();
  if (state.qi < needed) {
    log("You do not have enough Qi to break through.");
    return;
  }

  state.qi = 0;

  if (state.stage < MAX_STAGE) {
    state.stage += 1;
    log(`Breakthrough successful. You entered ${stageLabel(state.stage)} of ${getCurrentLevelName()}.`);
    if (state.stage === MAX_STAGE) {
      log(`You reached Ultimate Perfection in ${getCurrentLevelName()}.`);
    }
    saveGame();
    render();
    return;
  }

  const isWorldAscension = state.levelIndex === getCurrentWorld().levels.length - 1;
  if (isWorldAscension) {
    resolveTribulation();
  } else {
    state.levelIndex += 1;
    state.stage = 1;
    log(`You advanced to ${getCurrentLevelName()} in the ${getCurrentWorld().world}.`);
    saveGame();
    render();
  }
}

function resolveTribulation() {
  els.tribulationFlash.classList.remove("tribulation-active");
  void els.tribulationFlash.offsetWidth;
  els.tribulationFlash.classList.add("tribulation-active");

  const successRate = Math.max(
    20,
    70 + state.relicTier * 2 + state.spiritBeastRank - state.worldIndex * 4 - Math.floor(state.daoInjury / 2)
  );
  const roll = Math.random() * 100;

  if (roll <= successRate) {
    if (state.worldIndex < GAME_DATA.length - 1) {
      state.worldIndex += 1;
      state.levelIndex = 0;
      state.stage = 1;
      state.qi = 0;
      log(`You survived the thunder tribulation and ascended to ${getCurrentWorld().world}!`);
    } else {
      log("You stand at the peak of Chaos Origin. No higher world remains.");
    }
  } else {
    const injuryGain = 18 + Math.floor(Math.random() * 18);
    state.daoInjury = Math.min(95, state.daoInjury + injuryGain);

    if (state.stage > 1) {
      state.stage -= 1;
    } else if (state.levelIndex > 0) {
      state.levelIndex -= 1;
      state.stage = MAX_STAGE - 1;
    }

    state.qi = 0;
    log(`Tribulation failed. Dao injury increased by ${injuryGain}%. Your cultivation regressed and must be rebuilt.`);
  }

  saveGame();
  render();
}

function healDaoInjury() {
  if (state.healPills > 0) {
    state.healPills -= 1;
    state.daoInjury = Math.max(0, state.daoInjury - 25);
    log("You used a Healing Pill and reduced Dao Injury.");
  } else if (state.spiritStones >= 20) {
    state.spiritStones -= 20;
    state.daoInjury = Math.max(0, state.daoInjury - 10);
    log("You spent 20 Spirit Stones to stabilize your Dao Injury.");
  } else {
    log("Not enough Healing Pills or Spirit Stones.");
    return;
  }
  saveGame();
  render();
}

function explore() {
  const tier = state.worldIndex * 7 + state.levelIndex + 1;
  const hp = 30 + tier * 16 + state.stage * 8;
  const atk = 8 + tier * 7;
  const rewards = 8 + tier * 5;
  const names = ["Rogue Beast", "Bandit Cultivator", "Spirit Wolf", "Ancient Shade", "Sky Serpent", "Thunder Wraith"];
  state.enemy = {
    name: names[Math.floor(Math.random() * names.length)],
    hp,
    maxHp: hp,
    atk,
    rewards
  };
  log(`You encountered ${state.enemy.name}.`);
  render();
}

function fight() {
  if (!state.enemy) {
    log("No enemy to fight. Explore first.");
    return;
  }

  const playerPower = getCombatPower();
  const damage = Math.max(5, Math.floor(playerPower * (0.55 + Math.random() * 0.45)));
  state.enemy.hp -= damage;

  if (state.enemy.hp <= 0) {
    const stones = state.enemy.rewards;
    const cores = Math.random() < 0.38 ? 1 : 0;
    state.spiritStones += stones;
    state.beastCores += cores;
    state.streak += 1;
    log(`You defeated ${state.enemy.name}, gained ${stones} Spirit Stones${cores ? " and 1 Beast Core" : ""}.`);
    state.enemy = null;
    saveGame();
    render();
    return;
  }

  const enemyDamage = Math.max(1, Math.floor(state.enemy.atk * (0.5 + Math.random() * 0.5)));
  const injuryGain = Math.max(1, Math.floor(enemyDamage / 8));
  state.daoInjury = Math.min(95, state.daoInjury + injuryGain);
  state.streak = 0;
  log(`You dealt ${damage} damage. ${state.enemy.name} struck back. Dao Injury +${injuryGain}%.`);
  saveGame();
  render();
}

function doMission() {
  const reward = 15 + state.worldIndex * 10 + state.levelIndex * 4;
  const fail = Math.random() < 0.2;
  if (fail) {
    state.daoInjury = Math.min(95, state.daoInjury + 6);
    log("Your sect mission went poorly. You suffered minor Dao backlash.");
  } else {
    state.spiritStones += reward;
    log(`Sect mission completed. You gained ${reward} Spirit Stones.`);
  }
  saveGame();
  render();
}

function craftQiPill() {
  if (state.spiritStones < 12) {
    log("You need 12 Spirit Stones to craft a Qi Pill.");
    return;
  }
  state.spiritStones -= 12;
  state.qiPills += 1;
  log("You crafted 1 Qi Pill.");
  saveGame();
  render();
}

function craftHealingPill() {
  if (state.spiritStones < 18) {
    log("You need 18 Spirit Stones to craft a Healing Pill.");
    return;
  }
  state.spiritStones -= 18;
  state.healPills += 1;
  log("You crafted 1 Healing Pill.");
  saveGame();
  render();
}

function forgeGear() {
  if (state.spiritStones < 30 || state.beastCores < 1) {
    log("Forging requires 30 Spirit Stones and 1 Beast Core.");
    return;
  }
  state.spiritStones -= 30;
  state.beastCores -= 1;

  const roll = Math.floor(Math.random() * 3);
  if (roll === 0) {
    state.weaponTier += 1;
    log("Forging success: your weapon improved.");
  } else if (roll === 1) {
    state.armorTier += 1;
    log("Forging success: your armor improved.");
  } else {
    state.relicTier += 1;
    log("Forging success: your relic improved.");
  }
  saveGame();
  render();
}

function tameBeast() {
  if (state.beastCores < 2) {
    log("You need 2 Beast Cores to tame a Spirit Beast.");
    return;
  }
  state.beastCores -= 2;
  const success = Math.random() < 0.7;
  if (success) {
    state.spiritBeastRank += 1;
    log("Spirit Beast tamed successfully.");
  } else {
    log("Beast taming failed.");
  }
  saveGame();
  render();
}

function stageLabel(n) {
  return n === 10 ? "Ultimate Perfection" : `Stage ${n}`;
}

function renderCultivationList() {
  const world = getCurrentWorld();
  els.cultivationList.innerHTML = "";
  world.levels.forEach((level, idx) => {
    const item = document.createElement("div");
    item.className = "cultivation-item";
    if (idx === state.levelIndex) item.classList.add("active");
    if (idx < state.levelIndex) item.classList.add("complete");

    const name = document.createElement("div");
    name.className = "cultivation-name";
    name.textContent = level;

    const meta = document.createElement("div");
    meta.className = "cultivation-meta";
    if (idx < state.levelIndex) {
      meta.textContent = "Ultimate Perfection reached";
    } else if (idx === state.levelIndex) {
      meta.textContent = `${stageLabel(state.stage)} • Current`;
    } else {
      meta.textContent = "Locked until previous breakthrough";
    }

    item.appendChild(name);
    item.appendChild(meta);
    els.cultivationList.appendChild(item);
  });
}

function renderEnemy() {
  if (!state.enemy) {
    els.enemyPanel.innerHTML = "<p>No enemy encountered yet.</p>";
    return;
  }
  els.enemyPanel.innerHTML = `
    <p><strong>${state.enemy.name}</strong></p>
    <p>HP: ${Math.max(0, state.enemy.hp)} / ${state.enemy.maxHp}</p>
    <p>Attack: ${state.enemy.atk}</p>
    <p>Reward: ${state.enemy.rewards} Spirit Stones</p>
  `;
}

function render() {
  els.realmName.textContent = getCurrentWorld().world;
  els.levelName.textContent = getCurrentLevelName();
  els.stageName.textContent = stageLabel(state.stage);

  els.qiValue.textContent = state.qi;
  els.qiNeeded.textContent = getQiNeeded();
  els.powerValue.textContent = getCombatPower();
  els.injuryValue.textContent = `${state.daoInjury}%`;
  els.stonesValue.textContent = state.spiritStones;
  els.coresValue.textContent = state.beastCores;

  const progress = getProgressPercent();
  els.progressText.textContent = `${progress}%`;
  els.progressFill.style.width = `${progress}%`;

  els.qiPillCount.textContent = state.qiPills;
  els.healPillCount.textContent = state.healPills;
  els.weaponTier.textContent = state.weaponTier;
  els.armorTier.textContent = state.armorTier;
  els.relicTier.textContent = state.relicTier;
  els.beastRank.textContent = state.spiritBeastRank;
  els.streakValue.textContent = state.streak;

  els.saveStatusText.textContent = state.lastSavedAt ? `Saved: ${state.lastSavedAt}` : "Not saved yet";

  renderCultivationList();
  renderEnemy();
}

function resetGame() {
  if (!confirm("Reset all progress?")) return;
  state = createDefaultState();
  saveGame();
  render();
  log("The path begins anew.");
}

function bindEvents() {
  els.saveBtn.onclick = () => saveGame();
  els.exportSaveBtn.onclick = () => exportSave();
  els.importSaveBtn.onclick = () => els.importSaveFile.click();
  els.importSaveFile.onchange = (e) => {
    const file = e.target.files?.[0];
    if (file) importSaveFile(file);
    e.target.value = "";
  };

  els.resetBtn.onclick = () => resetGame();
  els.meditateBtn.onclick = () => meditate();
  els.breakthroughBtn.onclick = () => breakthrough();
  els.healBtn.onclick = () => healDaoInjury();
  els.exploreBtn.onclick = () => explore();
  els.fightBtn.onclick = () => fight();
  els.missionBtn.onclick = () => doMission();
  els.craftQiPillBtn.onclick = () => craftQiPill();
  els.craftHealPillBtn.onclick = () => craftHealingPill();
  els.forgeBtn.onclick = () => forgeGear();
  els.beastBtn.onclick = () => tameBeast();

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    els.installBtn.classList.remove("hidden-install");
  });

  els.installBtn.onclick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    els.installBtn.classList.add("hidden-install");
  };
}

function registerSW() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }
}

function boot() {
  try {
    els = getRequiredElements();
    bindEvents();
    render();
    registerSW();
    log("System initialized. The path of cultivation is open.");
  } catch (err) {
    document.body.innerHTML = `
      <div style="padding:20px;font-family:Arial,sans-serif;color:white;background:#0b1020;min-height:100vh">
        <h2>Startup error</h2>
        <p>${String(err.message || err)}</p>
        <p>Please use the latest repaired zip version.</p>
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", boot);
