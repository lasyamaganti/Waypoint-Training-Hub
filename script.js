document.addEventListener("DOMContentLoaded", () => {
  setupNav();
  setupTeamTabs();
  setupPlanPage();
  setupHistoryPage();
  setupWaypointFlow();
  setupWeatherWidget();
});

function setupNav() {
  const buttons = document.querySelectorAll("[data-nav-target]");
  const sections = document.querySelectorAll(".page-section");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.navTarget;

      sections.forEach((section) => {
        section.classList.toggle("is-active", section.id === targetId);
      });

      buttons.forEach((other) => {
        other.classList.toggle("is-active", other === btn);
      });
    });
  });
}

function setupTeamTabs() {
  const tabs = document.querySelectorAll("[data-team-tab]");
  const panels = document.querySelectorAll("[data-team-panel]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.teamTab;

      tabs.forEach((t) => t.classList.toggle("is-active", t === tab));
      panels.forEach((panel) =>
        panel.classList.toggle(
          "is-active",
          panel.dataset.teamPanel === target
        )
      );
    });
  });
}

const planDays = [
  { date: "2025-10-26", label: "Sun" },
  { date: "2025-10-27", label: "Mon" },
  { date: "2025-10-28", label: "Today" },
  { date: "2025-10-29", label: "Wed" },
  { date: "2025-10-30", label: "Thu" },
];

const planActivitiesByDate = {
  "2025-10-28": [
    { icon: "🍊", text: "Eat a high-carb snack before practice" },
    { icon: "🚵‍♀️", text: "Attend practice" },
  ],
  "2025-10-27": [{ icon: "🧘‍♀️", text: "Stretch for 10 minutes" }],
};

function setupPlanPage() {
  const dayStrip = document.querySelector(".day-strip");
  const activityList = document.querySelector(".activity-list");
  if (!dayStrip || !activityList) return;

  planDays.forEach((day, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "day-chip";
    if (day.label === "Today") btn.classList.add("is-today");
    if (index === 2) btn.classList.add("is-active");

    btn.dataset.date = day.date;
    btn.innerHTML = `
      <div class="day-chip__date">${new Date(day.date).getDate()}</div>
      <div class="day-chip__label">${day.label}</div>
    `;
    dayStrip.appendChild(btn);
  });

  function renderActivities(date) {
    activityList.innerHTML = "";
    const activities = planActivitiesByDate[date] || [];

    if (activities.length === 0) {
      const empty = document.createElement("p");
      empty.textContent = "No activities planned yet.";
      empty.style.fontSize = "0.85rem";
      empty.style.color = "#6b7280";
      activityList.appendChild(empty);
      return;
    }

    activities.forEach((activity) => {
      const card = document.createElement("article");
      card.className = "activity-card";
      card.innerHTML = `
        <div class="activity-card__icon">${activity.icon}</div>
        <div class="activity-card__body">${activity.text}</div>
        <div class="activity-card__check">✔</div>
      `;
      card.addEventListener("click", () => {
        card.classList.toggle("is-completed");
      });
      activityList.appendChild(card);
    });
  }

  const initialDate = planDays[2].date;
  renderActivities(initialDate);

  dayStrip.addEventListener("click", (e) => {
    const btn = e.target.closest(".day-chip");
    if (!btn) return;
    const date = btn.dataset.date;

    dayStrip
      .querySelectorAll(".day-chip")
      .forEach((chip) => chip.classList.remove("is-active"));
    btn.classList.add("is-active");

    renderActivities(date);
  });
}

function setupUnreadUpdatesShortcut() {
  const btn = document.getElementById("unreadUpdatesBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    document.querySelector('[data-nav-target="team"]').click();

    const updatesTab = document.querySelector('[data-team-tab="updates"]');
    if (updatesTab) updatesTab.click();
  });
}

setupUnreadUpdatesShortcut();

const historyEvents = {
  4: { type: "race" },
  7: { type: "practice" },
  15: { type: "practice" },
  18: { type: "race" },
  25: { type: "race" },
  28: { type: "practice" },
};

const historyActivitiesForDay = {
  28: [
    {
      type: "snack",
      text: "Ate a high-carb snack before practice",
    },
    {
      type: "practice",
      text: "Attended practice",
    },
    {
      type: "waypoint",
      text: "Completed a waypoint – Maintain race pace for full practice laps",
    },
  ],
};

function setupHistoryPage() {
  const daysContainer = document.getElementById("calendarDays");
  const label = document.getElementById("historyDayLabel");
  const activitiesContainer = document.getElementById("historyActivities");
  if (!daysContainer || !label || !activitiesContainer) return;

  for (let i = 1; i <= 31; i++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "calendar-day";
    btn.textContent = i;

    if (historyEvents[i]) {
      btn.classList.add("calendar-day--has-activity");
      if (historyEvents[i].type === "race") {
        btn.classList.add("calendar-day--race");
      }
    }

    if (i === 28) {
      btn.classList.add("is-selected");
    }

    btn.dataset.day = String(i);
    daysContainer.appendChild(btn);
  }

  function renderHistoryDay(day) {
    const dayNumber = Number(day);
    const dateText = `October ${dayNumber}, 2025`;
    label.textContent = dateText;

    activitiesContainer.innerHTML = "";
    const dayActivities = historyActivitiesForDay[dayNumber] || [];
    if (dayActivities.length === 0) {
      const p = document.createElement("p");
      p.textContent = "No activities recorded for this day.";
      p.style.fontSize = "0.85rem";
      p.style.color = "#6b7280";
      activitiesContainer.appendChild(p);
      return;
    }

    dayActivities.forEach((item) => {
      const div = document.createElement("div");
      div.className = "history-activity";

      if (item.type === "snack") div.classList.add("history-activity--snack");
      if (item.type === "practice")
        div.classList.add("history-activity--practice");
      if (item.type === "waypoint")
        div.classList.add("history-activity--waypoint");

      div.textContent = item.text;
      activitiesContainer.appendChild(div);
    });
  }

  renderHistoryDay(28);

  daysContainer.addEventListener("click", (e) => {
    const btn = e.target.closest(".calendar-day");
    if (!btn) return;
    daysContainer
      .querySelectorAll(".calendar-day")
      .forEach((d) => d.classList.remove("is-selected"));
    btn.classList.add("is-selected");
    renderHistoryDay(btn.dataset.day);
  });
}

function setupWeatherWidget() {
  const form = document.getElementById("weatherForm");
  const input = document.getElementById("weatherLocation");
  const resultBox = document.getElementById("weatherResult");

  if (!form || !input || !resultBox) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const location = input.value.trim();
    if (!location) return;

    resultBox.classList.remove("weather-result--empty");
    resultBox.innerHTML =
      '<p class="weather-result__placeholder">Loading trail conditions...</p>';

    try {
      const response = await fetch(
        `/api/weather?city=${encodeURIComponent(location)}`
      );

      console.log("Weather response ok?", response.ok, "status:", response.status);

      if (!response.ok) {
        const errText = await response.text();
        console.log("Weather error body:", errText);
        throw new Error("Request failed");
      }

      const data = await response.json();
      console.log("Weather data:", data);

      renderWeatherResult(resultBox, location, data);
    } catch (err) {
      console.error("Weather fetch error:", err);
      resultBox.innerHTML = `
        <p class="weather-result__placeholder">
          Sorry, we couldn't fetch the weather for "${location}". Try another city.
        </p>
      `;
    }
  });
}

function renderWeatherResult(container, location, data) {
  const temp = Math.round(data.main.temp);
  const conditions = data.weather[0].description;
  const wind = Math.round(data.wind.speed);
  const feelsLike = Math.round(data.main.feels_like);

  let tagText = "Good ride conditions";
  let tagClass = "weather-result__tag--good";

  if (temp < 40 || temp > 90 || wind > 20) {
    tagText = "Tough conditions – plan carefully";
    tagClass = "weather-result__tag--bad";
  } else if (temp < 50 || temp > 80 || wind > 15) {
    tagText = "Okay, but take caution";
    tagClass = "weather-result__tag--caution";
  }

  container.classList.remove("weather-result--empty");
  container.innerHTML = `
    <p class="weather-result__title">${location}</p>
    <p class="weather-result__meta">
      ${temp}°F · feels like ${feelsLike}°F · ${conditions} · wind ${wind} mph
    </p>
    <p class="weather-result__summary">
      ${
        conditions.includes("rain") || conditions.includes("storm")
          ? "Might be muddy – pick a trail with good drainage or do skills in an open area."
          : "Looks solid for riding – still check the trail status if it's rained recently."
      }
    </p>
    <div class="weather-result__tag ${tagClass}">
      ${tagText}
    </div>
  `;
}

const waypointData = {
  completed: [
    {
      title: "Record a baseline time on the local race loop",
      completedOn: "Jun 10",
    },
    {
      title: "Finish a 12-mile endurance ride without stopping",
      completedOn: "Jul 28",
    },
    {
      title: "Clean the Grotpeter switchback climb section",
      completedOn: "Aug 24",
    },
    {
      title: "Add weekly interval training",
      completedOn: "Sep 10",
    },
  ],
  current: {
    title: "Maintain race pace for full practice laps",
    due: "Nov 3",
  },
  upcoming: [
    {
      id: "mock-race",
      title: "Finish a mock race without crashing or mechanicals",
      due: "Nov 20",
    },
    {
      id: "suspension",
      title: "Set up suspension and tire pressure for race conditions",
      due: "Nov 30",
    },
  ],
};

const waypointSuggestions = [
  "Ride 3 laps of the race loop without stopping",
  "Practice cornering drills for 20 minutes",
  "Do a recovery ride at easy pace for 45 minutes",
  "Session a tricky feature 3 times in a row",
  "Finish a 10-mile ride with negative splits",
];

function getSuggestedWaypoint() {
  const i = Math.floor(Math.random() * waypointSuggestions.length);
  return waypointSuggestions[i];
}

function renderGoalTimelines() {
  const completedContainer = document.querySelector(
    ".goals-timeline .timeline-group:nth-of-type(1) .timeline"
  );
  const currentContainer = document.getElementById(
    "currentWaypointContainer"
  );
  const upcomingContainer = document.getElementById(
    "upcomingWaypointContainer"
  );

  if (!completedContainer || !currentContainer || !upcomingContainer) return;

  completedContainer.innerHTML = "";
  waypointData.completed.forEach((wp) => {
    const item = document.createElement("div");
    item.className = "timeline-item";
    item.innerHTML = `
      <article class="timeline-card timeline-card--completed">
        <div>${wp.title}</div>
        <p class="timeline-card__meta">Completed ${wp.completedOn}</p>
      </article>
    `;
    completedContainer.appendChild(item);
  });

  currentContainer.innerHTML = "";
  const currentItem = document.createElement("div");
  currentItem.className = "timeline-item timeline-item--current";
  currentItem.innerHTML = `
    <article class="timeline-card timeline-card--current js-open-waypoint-flow">
      <div>${waypointData.current.title}</div>
      <p class="timeline-card__meta">Complete by ${waypointData.current.due}</p>
    </article>
  `;
  currentContainer.appendChild(currentItem);

  upcomingContainer.innerHTML = "";
  waypointData.upcoming.forEach((wp) => {
    const item = document.createElement("div");
    item.className = "timeline-item timeline-item--upcoming";
    item.innerHTML = `
      <article class="timeline-card timeline-card--upcoming" data-waypoint-id="${wp.id}">
        <div>${wp.title}</div>
        <p class="timeline-card__meta">Complete by ${wp.due}</p>
      </article>
    `;
    upcomingContainer.appendChild(item);
  });
}

function setupWaypointFlow() {
  renderGoalTimelines();
  bindWaypointOpeners();
  setupModalBasics();
  setupWaypointSteps();
}

function bindWaypointOpeners() {
  function attach() {
    const openers = document.querySelectorAll(".js-open-waypoint-flow");
    openers.forEach((el) => {
      el.addEventListener("click", () => openModal("waypointDetailsModal"));
    });
  }
  attach();
}

function setupModalBasics() {
  const closeButtons = document.querySelectorAll(".js-close-modal");
  closeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      closeAllModals();
    });
  });

  document.querySelectorAll(".modal__backdrop").forEach((backdrop) => {
    backdrop.addEventListener("click", () => closeAllModals());
  });
}

function openModal(id) {
  closeAllModals();
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  }
}

function closeAllModals() {
  document.querySelectorAll(".modal.is-open").forEach((modal) => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  });
}

function setupWaypointSteps() {
  const markBtn = document.getElementById("markAsComplete");
  const nextFromMark = document.getElementById("markCompleteNext");
  const celebrateNext = document.getElementById("celebrateNext");
  const nextDone = document.getElementById("nextWaypointDone");
  const toggle = document.getElementById("sharingToggle");
  const upcomingChoiceList = document.getElementById("upcomingChoiceList");
  const suggestBtn = document.getElementById("suggestWaypointBtn");

  if (toggle) {
    toggle.addEventListener("click", () => {
      toggle.classList.toggle("is-on");
    });
  }

  if (markBtn) {
    markBtn.addEventListener("click", () => {
      closeAllModals();
      openModal("markCompleteModal");
    });
  }

  if (nextFromMark) {
    nextFromMark.addEventListener("click", () => {
      closeAllModals();
      openModal("celebrateModal");
    });
  }

  if (celebrateNext) {
    celebrateNext.addEventListener("click", () => {
      closeAllModals();
      buildUpcomingChoices(upcomingChoiceList);
      openModal("nextWaypointModal");
    });
  }

  if (nextDone) {
    nextDone.addEventListener("click", () => {
      closeAllModals();
    });
  }

  if (suggestBtn) {
    suggestBtn.addEventListener("click", () => {
      const titleInput = document.getElementById("newWaypointTitle");
      const dueInput = document.getElementById("newWaypointDue");

      if (titleInput && !titleInput.value) {
        titleInput.value = getSuggestedWaypoint();
      }

      if (dueInput && !dueInput.value) {
        const today = new Date();
        const inTwoWeeks = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + 14
        );
        const iso = inTwoWeeks.toISOString().slice(0, 10);
        dueInput.value = iso;
      }
    });
  }
}

function buildUpcomingChoices(container) {
  if (!container) return;
  container.innerHTML = "";

  waypointData.upcoming.forEach((wp, index) => {
    const div = document.createElement("button");
    div.type = "button";
    div.className = "choice-card";
    if (index === 0) div.classList.add("is-selected");
    div.dataset.waypointId = wp.id;
    div.innerHTML = `
      <div>${wp.title}</div>
      <div style="font-size:0.8rem; color:#6b7280;">Complete by ${wp.due}</div>
    `;
    div.addEventListener("click", () => {
      container
        .querySelectorAll(".choice-card")
        .forEach((c) => c.classList.remove("is-selected"));
      div.classList.add("is-selected");
    });
    container.appendChild(div);
  });
}
