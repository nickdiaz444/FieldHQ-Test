// =============================================
// FIELDHQ — Shared Data Store
// Replace localStorage with Supabase calls here
// when you're ready to add a real database.
// =============================================

const FieldHQ = {

  // ----- DEFAULT SEED DATA -----
  defaults: {
    league: { name: "Spring Season 2025", sport: "Soccer", slug: "spring-2025", year: 2025 },
    teams: [
      { id: 1, name: "Thunder FC",    color: "#00e5a0", coach: "Marcus Lee",   division: "Open", w: 7, l: 1, t: 0 },
      { id: 2, name: "Iron Wolves",   color: "#0099ff", coach: "Sandra Kim",   division: "Open", w: 6, l: 2, t: 0 },
      { id: 3, name: "Red Storm",     color: "#ff6b35", coach: "David Park",   division: "Open", w: 5, l: 2, t: 1 },
      { id: 4, name: "Blue Hawks",    color: "#a855f7", coach: "Amy Chen",     division: "Open", w: 4, l: 4, t: 0 },
      { id: 5, name: "Golden Eagles", color: "#facc15", coach: "Tom Rivera",   division: "Open", w: 3, l: 5, t: 0 },
      { id: 6, name: "Night Owls",    color: "#ec4899", coach: "Lisa Wang",    division: "Open", w: 2, l: 5, t: 1 },
      { id: 7, name: "Steel United",  color: "#64748b", coach: "Brian Scott",  division: "Open", w: 1, l: 6, t: 1 },
      { id: 8, name: "Rising Sun",    color: "#f97316", coach: "Emma Torres",  division: "Open", w: 0, l: 8, t: 0 },
    ],
    players: [
      { id: 1, first: "Jordan", last: "Hayes",   number: 10, position: "Forward",    team: 1, email: "j.hayes@email.com",   status: "active" },
      { id: 2, first: "Alex",   last: "Morgan",  number: 7,  position: "Midfielder", team: 1, email: "a.morgan@email.com",  status: "active" },
      { id: 3, first: "Chris",  last: "Davis",   number: 1,  position: "Goalkeeper", team: 1, email: "c.davis@email.com",   status: "active" },
      { id: 4, first: "Sam",    last: "Wilson",  number: 5,  position: "Defender",   team: 2, email: "s.wilson@email.com",  status: "active" },
      { id: 5, first: "Taylor", last: "Brown",   number: 9,  position: "Forward",    team: 2, email: "t.brown@email.com",   status: "active" },
      { id: 6, first: "Riley",  last: "Johnson", number: 11, position: "Winger",     team: 3, email: "r.johnson@email.com", status: "active" },
      { id: 7, first: "Morgan", last: "Smith",   number: 4,  position: "Midfielder", team: 3, email: "m.smith@email.com",   status: "active" },
      { id: 8, first: "Casey",  last: "Miller",  number: 8,  position: "Midfielder", team: 4, email: "c.miller@email.com",  status: "active" },
    ],
    games: [
      { id: 1, home: 1, away: 2, date: "2025-03-08", time: "10:00", location: "Field 1", homeScore: 3, awayScore: 1, status: "final" },
      { id: 2, home: 3, away: 4, date: "2025-03-08", time: "12:00", location: "Field 2", homeScore: 2, awayScore: 2, status: "final" },
      { id: 3, home: 5, away: 6, date: "2025-03-15", time: "10:00", location: "Field 1", homeScore: null, awayScore: null, status: "scheduled" },
      { id: 4, home: 7, away: 8, date: "2025-03-15", time: "12:00", location: "Field 3", homeScore: null, awayScore: null, status: "scheduled" },
      { id: 5, home: 1, away: 3, date: "2025-03-22", time: "10:00", location: "Field 2", homeScore: null, awayScore: null, status: "scheduled" },
      { id: 6, home: 2, away: 5, date: "2025-03-22", time: "14:00", location: "Field 1", homeScore: null, awayScore: null, status: "scheduled" },
    ],
    announcements: [
      { id: 1, type: "general", title: "Welcome to Spring Season 2025!", body: "All teams should confirm their roster by Friday. Coaches, please check your team pages and ensure player info is up to date.", date: "Feb 20, 2025", author: "Jake D." },
      { id: 2, type: "game",    title: "Week 4 Schedule Posted",         body: "Games have been posted for the upcoming week. Thunder FC vs Iron Wolves on Saturday at 10am, Field 1.", date: "Feb 22, 2025", author: "Jake D." },
      { id: 3, type: "alert",   title: "Field Closure — Feb 26",         body: "Due to scheduled maintenance, Fields 1 and 2 will be closed on Feb 26. All games moved to Field 4.", date: "Feb 24, 2025", author: "Jake D." },
    ],
  },

  // ----- STATE -----
  _state: null,

  get state() {
    if (!this._state) this._load();
    return this._state;
  },

  _load() {
    try {
      const saved = localStorage.getItem('fieldhq_state');
      this._state = saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(this.defaults));
    } catch(e) {
      this._state = JSON.parse(JSON.stringify(this.defaults));
    }
  },

  save() {
    try { localStorage.setItem('fieldhq_state', JSON.stringify(this._state)); } catch(e) {}
  },

  reset() {
    this._state = JSON.parse(JSON.stringify(this.defaults));
    this.save();
  },

  // ----- HELPERS -----
  pts(team) { return team.w * 3 + team.t; },

  sortedStandings() {
    return [...this.state.teams].sort((a, b) => this.pts(b) - this.pts(a) || b.w - a.w);
  },

  teamById(id) { return this.state.teams.find(t => t.id === id); },

  playersForTeam(teamId) { return this.state.players.filter(p => p.team === teamId); },

  nextId(arr) { return arr.length ? Math.max(...arr.map(x => x.id)) + 1 : 1; },

  // ----- TEAMS -----
  addTeam(data) {
    const team = { id: this.nextId(this.state.teams), w: 0, l: 0, t: 0, ...data };
    this.state.teams.push(team);
    this.save();
    return team;
  },

  removeTeam(id) {
    this.state.teams = this.state.teams.filter(t => t.id !== id);
    this.state.players = this.state.players.filter(p => p.team !== id);
    this.save();
  },

  // ----- PLAYERS -----
  addPlayer(data) {
    const player = { id: this.nextId(this.state.players), status: 'active', ...data };
    this.state.players.push(player);
    this.save();
    return player;
  },

  removePlayer(id) {
    this.state.players = this.state.players.filter(p => p.id !== id);
    this.save();
  },

  // ----- GAMES -----
  addGame(data) {
    const game = { id: this.nextId(this.state.games), status: 'scheduled', homeScore: null, awayScore: null, ...data };
    this.state.games.push(game);
    this.save();
    return game;
  },

  updateScore(id, homeScore, awayScore) {
    const g = this.state.games.find(g => g.id === id);
    if (!g) return;

    // Reverse old result if was final
    if (g.status === 'final') {
      const home = this.teamById(g.home);
      const away = this.teamById(g.away);
      if (home && away) {
        if (g.homeScore > g.awayScore) { home.w--; away.l--; }
        else if (g.homeScore < g.awayScore) { away.w--; home.l--; }
        else { home.t--; away.t--; }
      }
    }

    g.homeScore = parseInt(homeScore);
    g.awayScore = parseInt(awayScore);
    g.status = 'final';

    // Apply new result
    const home = this.teamById(g.home);
    const away = this.teamById(g.away);
    if (home && away) {
      if (g.homeScore > g.awayScore) { home.w++; away.l++; }
      else if (g.homeScore < g.awayScore) { away.w++; home.l++; }
      else { home.t++; away.t++; }
    }

    this.save();
  },

  removeGame(id) {
    const g = this.state.games.find(g => g.id === id);
    if (g && g.status === 'final') {
      const home = this.teamById(g.home);
      const away = this.teamById(g.away);
      if (home && away) {
        if (g.homeScore > g.awayScore) { home.w--; away.l--; }
        else if (g.homeScore < g.awayScore) { away.w--; home.l--; }
        else { home.t--; away.t--; }
      }
    }
    this.state.games = this.state.games.filter(g => g.id !== id);
    this.save();
  },

  gamesForMonth(year, month) {
    return this.state.games.filter(g => {
      const d = new Date(g.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  },

  // ----- ANNOUNCEMENTS -----
  addAnnouncement(data) {
    const ann = { id: this.nextId(this.state.announcements), date: new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}), author: 'Admin', ...data };
    this.state.announcements.unshift(ann);
    this.save();
    return ann;
  },

  removeAnnouncement(id) {
    this.state.announcements = this.state.announcements.filter(a => a.id !== id);
    this.save();
  },

  // ----- REGISTRATION -----
  registerPlayer(data) {
    // data = { first, last, email, phone, teamId, number, position, emergencyContact, emergencyPhone }
    const player = this.addPlayer({
      first: data.first, last: data.last,
      email: data.email, phone: data.phone,
      number: data.number || '?',
      position: data.position || 'Player',
      team: parseInt(data.teamId),
      emergencyContact: data.emergencyContact,
      emergencyPhone: data.emergencyPhone,
      status: 'registered',
      registeredAt: new Date().toISOString()
    });
    return player;
  },

};

// Toast utility
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  if (!t) return;
  const colors = { success: 'var(--accent)', error: 'var(--warn)', info: 'var(--accent2)' };
  t.style.borderColor = colors[type] || colors.success;
  t.style.color = colors[type] || colors.success;
  document.getElementById('toastMsg').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
