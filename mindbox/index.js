window.addEventListener('DOMContentLoaded', () => {
  console.log("DOM fully loaded and parsed");
  const svg = document.querySelector('svg');
  console.log(svg); // jetzt verfügbar
});

function resizeSvgToViewport() {
  console.log("Resizing SVG to viewport dimensions");
  console.log("Window dimensions:", window.innerWidth, window.innerHeight);

    const svg = document.querySelector('svg');
    console.log(svg)
    svg.setAttribute('width', window.innerWidth);
    svg.setAttribute('height', window.innerHeight);
  }

  // Initial resize
  resizeSvgToViewport();

  // Resize on window change
  window.addEventListener('resize', resizeSvgToViewport);

// Raum-ID → Raumname
const ROOM_NAME_MAP = {
  ROOM_STAGE: "Main stage",
  ROOM_BUCKOWER_CHAUSSEE: "Werkstattraum 1",
  ROOM_LEHRTER_STADTBAHNHOF: "Werkstattraum 2",
  ROOM_B63: "Bogen 63",
  ROOM_GESTRANDET_BAR_1: "Area 1",
  ROOM_GESTRANDET_BAR_2: "Area 2",
  ROOM_AREA3: "Area 3",
  ROOM_LOUNGE: "mindbox Lounge",
};

// Programm pro Raumname
const PROGRAM_DATA = {
  "Main stage": [
    { time: "10:30 – 11:00", title: "Begrüßung durch die DB mindbox" },
    { time: "11:00 – 11:25", title: "Opening Keynote von Dr. Daniela Gerd tom Markotten" },
    { time: "11:25 – 12:00", title: "Gründer-Panel – Reise zu den Anfängen der DB mindbox" },
    { time: "12:00 – 12:45", title: "Die Zukunft der DB – Gespräch mit jungen Bahner:innen" },
    { time: "17:15 – 17:45", title: "Pitches der aktuellen DB mindbox Programme FOM & BIM" },
    { time: "17:45 – 18:00", title: "Programmabschluss mit Dr. Jasmin Bigdon" },
  ],
  "Werkstattraum 1": [
    { time: "13:30 – 14:30", title: "Meet the Boss mit Dr. Daniela Gerd tom Markotten" },
    { time: "14:30 – 15:15", title: "10 Jahre DB mindbox – Geschichten 2015–2018" },
    { time: "15:30 – 16:15", title: "10 Jahre DB mindbox – Geschichten 2019–2022" },
    { time: "16:15 – 17:00", title: "10 Jahre DB mindbox – Geschichten 2023–2025+" },
  ],
  "Werkstattraum 2": [
    { time: "13:30 – 14:30", title: "F*ckup Night" },
    { time: "14:30 – 15:15", title: "How to prompt with BahnGPT" },
    { time: "15:30 – 16:15", title: "Powerpoint-Karaoke" },
    { time: "16:15 – 17:00", title: "Promptathon – wer schreibt den besten Prompt?" },
  ],
  "Bogen 63": [
    { time: "10:30 – 18:00", title: "Leckeres Kennenlernen" },
  ],
  "Area 1": [
    { time: "13:30 – 15:00", title: "Investor:innen Matchmaking" },
  ],
  "Area 2": [
    { time: "13:30 – 15:00", title: "Nachhaltigkeit & Ökosystem Networking" },
  ],
  "Area 3": [
    { time: "13:30 – 15:00", title: "NerdZone – mit dem Startup „SENF“ zum Thema Bürgerbeteiligung" },
    { time: "15:30 – 16:15", title: "Mini-Discovery zu FOM" },
  ],
  "mindbox Lounge": [
    { time: "Ganztägig", title: "Rückzugsort für Meetings & Arbeitsplätze" },
  ],
};

let currentIndex = 0;
let autoSwitch = true;
const TIMER_DURATION = 10; // Sekunden bis zum nächsten Raumwechsel
const roomIds = Object.keys(ROOM_NAME_MAP);
let countdown = TIMER_DURATION;

function showSchedule(roomId = "ROOM_MAIN") {
  const roomName = ROOM_NAME_MAP[roomId] || "Main stage";
  const schedule = PROGRAM_DATA[roomName] || [];
  const titleEl = document.getElementById("schedule-title");
  const listEl = document.getElementById("schedule-list");

  // all ids with ROOM_ get 0.4 opacity by default except ROOM_STAGE
    const allRoomElements = document.querySelectorAll("[id^='ROOM_']");
  allRoomElements.forEach(el => {
    el.style.opacity = (el.id === "ROOM_STAGE") ? "1" : "0.4";
  });
  titleEl.textContent = roomName;
  listEl.innerHTML = "";
  schedule.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${item.time}</strong>: ${item.title}`;
    listEl.appendChild(li);
  });

  roomIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.style.opacity = (id === roomId) ? "1" : "0.4";
    }
  });
}

function rotateRooms() {
  if (!autoSwitch) return;
  const nextId = roomIds[currentIndex];
  showSchedule(nextId);
  currentIndex = (currentIndex + 1) % roomIds.length;
}

function updateCountdownDisplay() {
  const el = document.getElementById("rotation-timer");
  if (el) {
    el.textContent = `Nächster Raum in ${countdown}s`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Timer-Element erzeugen
  const timer = document.createElement("div");
  timer.id = "rotation-timer";
  timer.style.fontSize = "0.9em";
  timer.style.opacity = "0.6";
  timer.style.marginTop = "0.5rem";
  document.getElementById("SCHEDULE")?.appendChild(timer);

  showSchedule("ROOM_MAIN");
  updateCountdownDisplay();

  roomIds.forEach(roomId => {
    const el = document.getElementById(roomId);
    if (el) {
      el.addEventListener("mouseenter", () => {
        autoSwitch = false;
        showSchedule(roomId);
      });
      el.addEventListener("mouseleave", () => {
        autoSwitch = true;
        showSchedule(roomIds[currentIndex]);
      });
    }
  });

  setInterval(() => {
    if (autoSwitch) {
      countdown--;
      updateCountdownDisplay();
      if (countdown <= 0) {
        rotateRooms();
        countdown = TIMER_DURATION;
        updateCountdownDisplay();
      }
    }
  }, 1000);
});