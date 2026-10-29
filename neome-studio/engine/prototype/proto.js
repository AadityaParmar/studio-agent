// Prototype template script (ticket 33). Draws every screen from the embedded page model.
// State lives in memory only; Reset puts the sample data back. No network, no storage.
(function () {
  "use strict";
  var M = JSON.parse(document.getElementById("proto-data").textContent);
  var clone = function (x) { return JSON.parse(JSON.stringify(x)); };
  var S = null;

  // ---------- lookups ----------
  var main = M.records.filter(function (r) { return r.entity === M.entity; })[0] || { entity: M.entity, fields: [] };
  var children = M.records.filter(function (r) { return r.entity !== M.entity; });
  var statusById = {};
  M.statuses.forEach(function (s) { statusById[s.id] = s; });
  var roleByName = {};
  M.roles.forEach(function (r) { roleByName[r.role] = r; });
  var reqById = {};
  M.requirements.forEach(function (r) { reqById[r.id] = r; });
  var keyRoles = M.roles.filter(function (r) { return r.key; });
  var starts = M.statuses.filter(function (s) { return s.start; }).map(function (s) { return s.id; });
  var owners = uniq(M.transitions.filter(function (t) { return starts.indexOf(t.from) >= 0; })
    .reduce(function (a, t) { return a.concat(t.by); }, []).filter(function (b) { return b !== "system"; }));

  function fresh(keep) {
    var s = {
      rows: clone(M.rows), notifs: [], chat: {}, seq: 0,
      tab: "app", role: M.roles[0] ? M.roles[0].role : "", view: M.statuses.length ? "kanban" : "sheet",
      screen: "entity", open: null, dtab: "d", sc: 0, step: 0,
      mrole: keyRoles[0] ? keyRoles[0].role : (M.roles[0] ? M.roles[0].role : ""), req: null, tags: false,
    };
    if (keep) ["tab", "role", "view", "sc", "step", "mrole", "req", "tags"].forEach(function (k) { s[k] = keep[k]; });
    return s;
  }

  // ---------- text ----------
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  // Inline markdown from the spec: show the words, not the marks.
  function plain(s) { return esc(String(s == null ? "" : s).replace(/\*\*([^*]+)\*\*/g, "$1").replace(/`([^`]+)`/g, "$1")); }
  function uniq(a) { return a.filter(function (x, i) { return a.indexOf(x) === i; }); }
  function attr(name, v) { return " data-" + name + '="' + esc(v) + '"'; }
  function dr(ids) { return ids && ids.length ? attr("req", ids.join(" ")) : ""; }
  function who(role) {
    if (role === "system") return "System";
    var r = roleByName[role];
    return r ? r.person + " (" + r.role + ")" : role;
  }
  function label(id) { return statusById[id] ? statusById[id].label : id; }
  function st(id) {
    var s = statusById[id];
    return s ? '<span class="t-' + s.tone + '">' + esc(s.label) + "</span>" + (s.oi ? " " + oiChip(s.oi) : "") + prop(s.proposed) : "";
  }
  function fmt(f, v) {
    if (v === undefined || v === null || v === "") return "";
    if ((f.type === "money" || f.type === "number") && typeof v === "number") return esc(v.toLocaleString("en"));
    if (f.type === "link-to-entity") return '<a class="lnk" href="#" data-on="noop">' + esc(v) + "</a>";
    if (f.type === "file") return "📄 " + esc(v);
    return esc(v);
  }
  function isStatusField(f) { return /^status$/i.test(f.name) && M.statuses.length > 0; }

  // ---------- chips (Studio overlay) ----------
  function reqChips(ids) {
    return (ids || []).map(function (id) {
      return '<span class="chip req reqtag"' + attr("on", "trace") + attr("id", id) + ' title="' + esc(reqById[id] ? reqById[id].title : "") + '">' + esc(id) + "</span>";
    }).join(" ");
  }
  function oiChip(id) { return id && M.ois[id] ? '<span class="chip oi" title="' + esc(id + ": " + M.ois[id]) + '">' + esc(id) + "</span>" : ""; }
  function prop(p) { return p ? ' <span class="chip prop" title="Proposed by Neomenta, to confirm">proposed</span>' : ""; }
  var SAMPLE = ' <span class="chip sample" title="Made-up sample record">sample</span>';
  var GUESSED = ' <span class="chip guess" title="No real Neome approval screen seen yet; this layout is a guess">guessed</span>';

  // ---------- behaviour ----------
  function row(id) { return S.rows.filter(function (r) { return r.id === id; })[0]; }
  function holds(g, values) {
    var raw = values[g.field];
    var num = typeof g.value === "number";
    if (num && (raw === undefined || raw === null || raw === "" || isNaN(Number(raw)))) return false;
    var a = num ? Number(raw) : String(raw == null ? "" : raw);
    var b = g.value;
    return g.op === "<" ? a < b : g.op === "<=" ? a <= b : g.op === ">" ? a > b : g.op === ">=" ? a >= b : g.op === "=" ? a === b : g.op === "!=" ? a !== b : false;
  }
  function blocked(t, r) {
    var bad = t.guard.filter(function (g) { return !holds(g, r.values); });
    return bad.length ? "Rule: needs " + bad.map(function (g) { return g.field + " " + g.op + " " + g.value; }).join(" and ") : "";
  }
  function outOf(r) { return M.transitions.filter(function (t) { return t.from === r.status; }); }
  function mine(r, role) { return outOf(r).filter(function (t) { return t.by.indexOf(role) >= 0; }); }
  function systemOut(r) { return outOf(r).filter(function (t) { return t.by[0] === "system"; }); }
  function canEdit(r, role) { return (!M.statuses.length || starts.indexOf(r.status) >= 0) && (owners.indexOf(role) >= 0 || !owners.length); }
  function tById(id) { return M.transitions.filter(function (t) { return t.id === id; })[0]; }

  function act(rowId, tid, role) {
    var r = row(rowId), t = tById(tid);
    if (!r || !t || r.status !== t.from || blocked(t, r)) return;
    S.seq += 1;
    var when = "now · " + S.seq;
    r.status = t.to;
    r.log.push([when, who(role), t.action + " · " + label(t.from) + " → " + label(t.to)]);
    t.notify.forEach(function (n) {
      S.notifs.unshift({ to: n, when: when, row: r.id, title: label(t.to), text: r.id + ": " + t.action + " by " + who(role) });
    });
    (S.chat[role] = S.chat[role] || []).push({ row: r.id, text: "✓ " + t.action + " · " + r.id, when: when });
  }

  // ---------- shared Neome pieces ----------
  function tile(kind, glyph, name, on, off, handler, extra) {
    return '<div class="tile ' + kind + (on ? " on" : "") + (off ? " off" : "") + '"' + (handler || "") + (extra || "") + '><div class="g">' + glyph + "</div>" + esc(name) + "</div>";
  }
  function notifsFor(role) { return S.notifs.filter(function (n) { return n.to === role; }); }
  function notifHTML(n, phone) {
    return '<div class="notif"' + (n.row && !phone ? attr("on", "open") + attr("row", n.row) : "") + '><div class="avatar" style="background:#EEE">🤖</div><div style="flex:1;min-width:0"><div class="who"><span>' +
      esc(M.name) + '</span><span class="time">' + esc(n.when) + '</span></div><div class="msg">✨ <b>' + esc(n.title) + "!</b> " + esc(n.text) + "</div></div></div>";
  }
  function launcher(role, phone, extraNotifs) {
    var me = roleByName[role] || { reqs: [] };
    var tiles = tile("green", "▤", M.entity, !phone && S.screen === "entity", false, phone ? "" : attr("on", "screen") + attr("screen", "entity"));
    M.reports.forEach(function (r, i) {
      tiles += tile("blue", "▦", r.name, !phone && S.screen === "report:" + i, false, phone ? "" : attr("on", "screen") + attr("screen", "report:" + i), dr(r.reqs));
    });
    if (M.rules.length) tiles += tile("grey", "⚙", "Rules", !phone && S.screen === "rules", false, phone ? "" : attr("on", "screen") + attr("screen", "rules"), dr(M.rules.reduce(function (a, r) { return a.concat(r.reqs); }, [])));
    M.others.forEach(function (n) { tiles += tile("green", "▤", n, false, true, "", ' title="Another Module: not in this Prototype"'); });
    var list = (extraNotifs || []).concat(notifsFor(role));
    return '<div class="bar"' + dr(me.reqs) + '><div class="avatar">👤</div><div class="t">' + esc(who(role)) + '</div><span class="ico" style="margin-left:auto">🔔</span></div>' +
      '<div class="searchpill">🔍 Search messages or data</div><div class="tiles">' + tiles + "</div>" +
      list.map(function (n) { return notifHTML(n, phone); }).join("");
  }

  function fieldHTML(r, f, editable) {
    var v;
    if (isStatusField(f)) v = st(r.status);
    else if (editable && f.type !== "file") {
      var cur = r.values[f.name];
      if (f.type === "choice" && f.choices) {
        v = '<select' + attr("change", "field") + attr("row", r.id) + attr("field", f.name) + '><option value=""></option>' +
          f.choices.map(function (c) { return "<option" + (c === cur ? " selected" : "") + ">" + esc(c) + "</option>"; }).join("") + "</select>";
      } else {
        v = '<input value="' + esc(cur == null ? "" : cur) + '"' + (f.type === "number" || f.type === "money" ? ' inputmode="decimal"' : "") +
          attr("change", "field") + attr("row", r.id) + attr("field", f.name) + attr("type", f.type) + ">";
      }
    } else v = fmt(f, r.values[f.name]) || '<span class="small">—</span>';
    var trail = !editable ? "" : f.type === "date" ? "📅" : f.type === "link-to-entity" ? "＋ ✕" : f.type === "person" ? "✕" : f.type === "file" ? "📎" : "";
    return '<div' + dr(f.reqs) + '><div class="ofld' + (editable && !isStatusField(f) ? "" : " ro") + '"><label>' + esc(f.name) + (f.required ? " *" : "") + '</label><div class="val">' + v + "</div>" +
      (trail ? '<span class="tr">' + trail + "</span>" : "") + "</div>" +
      (f.oi || f.proposed || (f.reqs && f.reqs.length) ? '<div class="tags">' + oiChip(f.oi) + prop(f.proposed) + " " + reqChips(f.reqs) + "</div>" : "") +
      (f.notes && !/^(Values|Links to):/i.test(f.notes) ? '<div class="helper">' + plain(f.notes) + "</div>" : "") + "</div>";
  }

  function childTable(r, rec) {
    var rows = (r.children && r.children[rec.entity]) || [];
    return '<div class="secdiv">' + esc(rec.entity) + '</div><table class="sub-t"><tr>' +
      rec.fields.map(function (f) { return "<th" + dr(f.reqs) + ">" + esc(f.name) + (f.oi ? " " + oiChip(f.oi) : "") + prop(f.proposed) + " " + reqChips(f.reqs) + "</th>"; }).join("") + "</tr>" +
      (rows.length ? rows.map(function (c) { return "<tr>" + rec.fields.map(function (f) { return "<td>" + fmt(f, c[f.name]) + "</td>"; }).join("") + "</tr>"; }).join("")
        : '<tr><td colspan="' + rec.fields.length + '" class="small">Nothing here</td></tr>') + "</table>";
  }

  // The record drawer. opts.static = picture in a scenario (no clicks); opts.done = action just taken.
  function drawer(r, role, opts) {
    opts = opts || {};
    var editable = !opts.static && canEdit(r, role);
    var tab = opts.static ? "d" : S.dtab;
    var acts = [], note = "";
    var avail = outOf(r);
    if (!opts.static) {
      mine(r, role).forEach(function (t) {
        var why = blocked(t, r);
        acts.push('<button class="tbtn' + (/reject|lost|cancel/i.test(t.action) ? " red" : "") + '"' + (why ? " disabled" : "") + ' title="' + esc(why || t.trigger) + '"' +
          attr("on", "act") + attr("row", r.id) + attr("t", t.id) + attr("role", role) + dr(t.reqs) + ">" + esc(t.action) + "</button>");
      });
      systemOut(r).forEach(function (t) {
        acts.push('<button class="tbtn" title="' + esc(t.trigger) + '"' + attr("on", "act") + attr("row", r.id) + attr("t", t.id) + attr("role", "system") + dr(t.reqs) + ">⏱ " + esc(t.action) + " (system)</button>");
      });
      var others = uniq(avail.filter(function (t) { return t.by.indexOf(role) < 0 && t.by[0] !== "system"; }).reduce(function (a, t) { return a.concat(t.by); }, []));
      if (!mine(r, role).length && others.length) note = "Waiting on " + others.join(", ");
      else if (!avail.length && M.statuses.length) note = "No more steps";
    } else if (opts.done) {
      acts.push('<span class="tbtn"' + dr(opts.done.reqs) + ">✓ " + esc(opts.done.action) + "</span>");
    }
    var gates = avail.filter(function (t) { return t.rules.length || t.guard.length; }).map(function (t) {
      return '<div class="gate"' + dr(t.reqs) + "><b>" + esc(t.action) + "</b>: " + t.rules.map(function (n) {
        var rule = M.rules.filter(function (x) { return x.rule === n; })[0];
        return rule ? esc(rule.rule) + " — " + plain(rule.when) + " → " + plain(rule.action) + prop(rule.proposed) : "";
      }).concat(t.guard.map(function (g) { return "only when " + esc(g.field + " " + g.op + " " + g.value); })).join("; ") + "</div>";
    }).join("");
    var details = (M.statuses.length && !main.fields.some(isStatusField) ? '<div class="ofld ro"><label>Status</label><div class="val">' + st(r.status) + "</div></div>" : "") +
      gates + '<div class="secdiv">' + esc(M.entity) + "</div>" + main.fields.map(function (f) { return fieldHTML(r, f, editable); }).join("") +
      children.map(function (c) { return childTable(r, c); }).join("");
    var activity = '<div class="timeline">' + (r.log.length ? r.log.slice().reverse().map(function (l) { return '<div><div class="when">' + esc(l[0]) + " · " + esc(l[1]) + "</div>" + esc(l[2]) + "</div>"; }).join("") : '<div class="small">Nothing here</div>') + "</div>";
    return '<div class="drawer' + (opts.static ? " static" : "") + '"><div class="bar"><span class="ico"' + (opts.static ? "" : attr("on", "close")) + ' style="cursor:pointer">›</span><div class="t">' + esc(M.entity) + " · " + esc(r.id) + "</div>" + SAMPLE + '<span class="ico" style="margin-left:auto">🗑</span></div>' +
      '<div class="dtabs"><button class="' + (tab === "d" ? "on" : "") + '"' + (opts.static ? "" : attr("on", "dtab") + attr("v", "d")) + ">DETAILS</button><button class=\"" + (tab === "a" ? "on" : "") + '"' + (opts.static ? "" : attr("on", "dtab") + attr("v", "a")) + ">ACTIVITY</button></div>" +
      '<div class="dbody">' + (tab === "d" ? details : activity) + '</div><div class="dfoot"><span class="note">' + esc(note) + '</span><span class="ico">💬</span>' + acts.join("") + "</div></div>";
  }

  function cardFields() { return main.fields.filter(function (f) { return !isStatusField(f) && f.type !== "file"; }).slice(0, 4); }
  function sheet(rows, clickable) {
    return "<table><tr><th>Action</th><th>Sr No.</th>" + main.fields.map(function (f) { return "<th" + dr(f.reqs) + ">" + esc(f.name) + '<span class="f">▾ ⋮</span></th>'; }).join("") +
      (M.statuses.length && !main.fields.some(isStatusField) ? "<th>Status</th>" : "") + "<th></th></tr>" +
      rows.map(function (r, i) {
        return '<tr class="row"' + (clickable ? attr("on", "open") + attr("row", r.id) : "") + '><td class="act">› ⋯</td><td>' + (i + 1) + "</td>" +
          main.fields.map(function (f) { return "<td>" + (isStatusField(f) ? st(r.status) : fmt(f, r.values[f.name])) + "</td>"; }).join("") +
          (M.statuses.length && !main.fields.some(isStatusField) ? "<td>" + st(r.status) + "</td>" : "") + "<td>" + SAMPLE + "</td></tr>";
      }).join("") + "</table>";
  }
  function kanban(rows, clickable, focus) {
    return '<div class="kan">' + M.statuses.map(function (s) {
      var qs = rows.filter(function (r) { return r.status === s.id; });
      return '<div class="kcol k-' + s.tone + '"><h4 class="t-' + s.tone + '">' + esc(s.label) + " (" + qs.length + ")" + (s.oi ? " " + oiChip(s.oi) : "") + prop(s.proposed) + "</h4>" +
        qs.map(function (r) {
          return '<div class="kcard' + (focus === r.id ? " hl-focus" : "") + '"' + (clickable ? attr("on", "open") + attr("row", r.id) : "") + (focus === r.id ? ' style="outline:2px solid var(--primary)"' : "") + '><div class="in">' +
            '<div class="kv"><span class="k">ID:</span><span class="v">' + esc(r.id) + "</span></div>" +
            cardFields().map(function (f) { return '<div class="kv"' + dr(f.reqs) + '><span class="k">' + esc(f.name) + ':</span><span class="v">' + fmt(f, r.values[f.name]) + "</span></div>"; }).join("") +
            '<div class="kv"><span class="k">Status:</span>' + st(r.status) + "</div></div>" +
            '<div class="ft"><span>💬</span>' + SAMPLE + "</div></div>";
        }).join("") + "</div>";
    }).join("") + "</div>";
  }
  function reportView(i, rows) {
    var r = M.reports[i];
    if (!r) return "";
    return '<div class="bar"><span class="ico">≡</span><div class="ttl"><div class="t">' + esc(r.name) + '</div><div class="sub">Report · for ' + plain(r.audience) + "</div></div></div>" +
      '<div class="report"' + dr(r.reqs) + '><div class="small">' + plain(r.measures) + prop(r.proposed) + " " + reqChips(r.reqs) + "</div>" +
      '<div class="kpis">' + (M.statuses.length ? M.statuses.map(function (s) {
        return '<div class="kpi"><div class="n">' + rows.filter(function (x) { return x.status === s.id; }).length + '</div><div class="small t-' + s.tone + '">' + esc(s.label) + "</div></div>";
      }).join("") : '<div class="kpi"><div class="n">' + rows.length + '</div><div class="small">' + esc(M.entity) + "</div></div>") + "</div>" +
      '<div class="small">Counts from the sample rows here, to show the idea. The real report is set up in the build.</div></div>';
  }
  function rulesView() {
    return '<div class="bar"><span class="ico">≡</span><div class="ttl"><div class="t">Rules</div><div class="sub">Master data · Total rows: ' + M.rules.length + "</div></div></div>" +
      "<table><tr><th>Sr No.</th><th>Rule</th><th>When</th><th>Action / notify whom</th></tr>" +
      M.rules.map(function (r, i) {
        return "<tr" + dr(r.reqs) + "><td>" + (i + 1) + '</td><td class="wrap">' + esc(r.rule) + prop(r.proposed) + " " + reqChips(r.reqs) + '</td><td class="wrap">' + plain(r.when) + '</td><td class="wrap">' + plain(r.action) + "</td></tr>";
      }).join("") + "</table>";
  }

  // ---------- App tab ----------
  function viewApp() {
    var rows = S.rows, main_;
    if (S.screen.indexOf("report:") === 0) main_ = reportView(Number(S.screen.slice(7)), rows);
    else if (S.screen === "rules") main_ = rulesView();
    else {
      var open = S.open && row(S.open);
      main_ = '<div class="bar"><span class="ico">≡</span><div class="ttl"><div class="t">' + esc(M.entity) + ' sheet</div><div class="sub">Total rows: ' + rows.length + "</div></div>" +
        '<div class="acts">' + (M.statuses.length ? '<div class="viewsw">' + ["sheet", "kanban"].map(function (v) {
          return '<button class="' + (S.view === v ? "on" : "") + '"' + attr("on", "view") + attr("v", v) + ">" + (v === "sheet" ? "Sheet" : "Kanban") + "</button>";
        }).join("") + "</div>" : "") + '<span class="ico">⟳</span><span class="ico">⚲</span><span class="ico">⋮</span></div></div>' +
        '<div class="searchrow"><div class="searchpill">🔍 Search</div><span class="ico">⚲</span></div>' +
        '<div class="body">' + (S.view === "kanban" && M.statuses.length ? kanban(rows, true) : sheet(rows, true)) + "</div>" +
        (S.view === "sheet" || !M.statuses.length ? '<div class="pager"><span>1–' + rows.length + " of " + rows.length + "</span><span>|‹ ‹ › ›|</span></div>" : "") +
        (canEdit({ status: starts[0] }, S.role) ? '<button class="fab" title="New ' + esc(M.entity) + '"' + attr("on", "create") + ">+</button>" : "") +
        (open ? '<div class="dim"' + attr("on", "close") + "></div>" + drawer(open, S.role) : "");
    }
    var me = roleByName[S.role] || {};
    var allRoleReqs = uniq(M.roles.reduce(function (a, r) { return a.concat(r.reqs); }, []));
    return '<div class="A"><div class="dev-wrap"><div class="dev-title"><span' + dr(allRoleReqs) + '><select title="View as"' + attr("change", "role") + ">" +
      M.roles.map(function (r) { return '<option value="' + esc(r.role) + '"' + (S.role === r.role ? " selected" : "") + ">" + esc(r.person + " (" + r.role + (r.proposed ? ", proposed" : "") + ")") + "</option>"; }).join("") +
      '</select></span><span style="font-size:12px">' + oiChip(me.oi) + prop(me.proposed) + " " + reqChips(me.reqs) + ' <span class="small">' + plain(me.does) + "</span></span></div>" +
      '<div class="dev"><div class="lp">' + launcher(S.role, false) + '</div><div class="mp">' + main_ + "</div></div></div></div>";
  }

  // ---------- Scenarios tab ----------
  // Rows as they stand after step k of the scenario (sample rows, then each step's new status).
  function scenarioRows(sc, k) {
    var rows = clone(M.rows);
    sc.steps.slice(0, k + 1).forEach(function (s) {
      rows.forEach(function (r) { if (r.id === s.row && s.status) r.status = s.status; });
    });
    return rows;
  }
  function phoneHome(role, notifs, cap) {
    return '<div class="phone"><div class="dev-title sm">' + esc(who(role)) + '</div><div class="dev"><div class="scr">' + launcher(role, true, notifs) + "</div></div>" + (cap ? '<div class="cap">' + cap + "</div>" : "") + "</div>";
  }
  function chatPhone(role, r, opts) {
    opts = opts || {};
    var ts = r ? mine(r, role) : [];
    var past = (S.chat[role] || []).filter(function (c) { return !opts.static; });
    var card = r ? '<div class="card"><b>' + esc(r.id) + "</b>" + SAMPLE + "<br>" + cardFields().map(function (f) { return esc(f.name) + ": " + fmt(f, r.values[f.name]); }).join("<br>") + "<br>Status: " + st(r.status) + "</div>" : "";
    var buttons = opts.static ? (opts.done ? '<div class="acts"><span class="tbtn">✓ ' + esc(opts.done.action) + "</span></div>" : "") :
      ts.length ? '<div class="acts">' + ts.map(function (t) {
        var why = blocked(t, r);
        return '<button class="tbtn' + (/reject|lost|cancel/i.test(t.action) ? " red" : "") + '"' + (why ? " disabled" : "") + ' title="' + esc(why || t.trigger) + '"' + attr("on", "act") + attr("row", r.id) + attr("t", t.id) + attr("role", role) + dr(t.reqs) + ">" + esc(t.action) + "</button>";
      }).join("") + "</div>" : "";
    var reqs = uniq(ts.reduce(function (a, t) { return a.concat(t.reqs); }, []).concat(opts.done ? opts.done.reqs : []));
    var head = r ? "Action needed" : "Nothing waits for you";
    return '<div class="phone"><div class="dev-title sm">' + esc(who(role)) + GUESSED + '</div><div class="dev">' +
      '<div class="bar"><span class="ico">‹</span><div class="avatar" style="width:28px;height:28px">🤖</div><div><div class="t" style="font-size:14px">' + esc(M.name) + '</div><div class="sub" style="font-size:12px">bot</div></div></div>' +
      '<div class="chat"><div class="datepill">Today</div>' +
      (r ? '<div class="bub in"' + dr(reqs) + '><div class="nm">' + esc(M.name) + "</div>✨ <b>" + esc(head) + "!</b>" + card + buttons + '<div class="tm">now</div></div>' : '<div class="bub in"><div class="nm">' + esc(M.name) + "</div>" + esc(head) + "</div>") +
      past.map(function (c) { return '<div class="bub out">' + esc(c.text) + '<div class="tm">' + esc(c.when) + " ✓✓</div></div>"; }).join("") +
      (opts.static && opts.done ? '<div class="bub out">✓ ' + esc(opts.done.action) + '<div class="tm">now ✓✓</div></div>' : "") +
      '</div><div class="cbar"><div class="in">Message</div><span class="ico">➤</span></div></div>' +
      '<div class="cap">Approve from bot chat · guessed: no real Neome approval screen seen yet</div></div>';
  }
  function viewScen() {
    if (!M.scenarios.length) return "";
    var sc = M.scenarios[S.sc] || M.scenarios[0], s = sc.steps[S.step] || sc.steps[0];
    var rows = scenarioRows(sc, S.step);
    var r = s.row ? rows.filter(function (x) { return x.id === s.row; })[0] : null;
    var t = s.transition ? tById(s.transition) : null;
    var desk;
    // The chat shows the message the actor answered, so the record as it was before the step.
    if (s.screen === "chat") desk = chatPhone(s.actor, r && t ? Object.assign(clone(r), { status: t.from }) : r, { static: true, done: t });
    else {
      var inner = s.screen === "record" ? drawer(r, s.actor, { static: true, done: t })
        : s.screen === "kanban" ? '<div class="mp"><div class="body">' + kanban(rows, false, s.row) + "</div></div>"
        : s.screen === "report" ? '<div class="mp">' + reportView(M.reports.map(function (x) { return x.name; }).indexOf(s.report), rows) + "</div>"
        : s.screen === "rules" ? '<div class="mp">' + rulesView() + "</div>"
        : '<div class="mp"><div class="body">' + sheet(rows, false) + "</div></div>";
      desk = '<div class="desk dev-wrap"><div class="dev-title sm">' + esc(who(s.actor)) + '</div><div class="dev">' + inner + "</div></div>";
    }
    var phones = r && t ? s.notify.slice(0, 2).map(function (n) {
      return phoneHome(n, [{ to: n, when: "now", row: r.id, title: label(t.to), text: r.id + ": " + t.action + " by " + who(s.actor) }], "Neome tells the next role (bot message)");
    }).join("") : "";
    var actor = roleByName[s.actor];
    var covered = function (id) { return M.scenarios.some(function (x) { return x.steps.some(function (y) { return y.proves.indexOf(id) >= 0; }); }); };
    var tCovered = function (id) { return M.scenarios.some(function (x) { return x.steps.some(function (y) { return y.transition === id; }); }); };
    var last = S.step >= sc.steps.length - 1;
    return '<div class="B"><div class="B-list">' + M.scenarios.map(function (x, k) {
      return '<div class="sc' + (k === S.sc ? " on" : "") + '"' + attr("on", "scen") + attr("sc", k) + '><div class="t">' + (k + 1) + ". " + esc(x.title) + prop(true) + '</div><div class="small">' + esc(x.summary) + "</div></div>";
    }).join("") + "</div>" +
      '<div class="B-stage"><div class="small">Scenario ' + (S.sc + 1) + " · step " + (S.step + 1) + " of " + sc.steps.length + " · proposed by Neomenta, to confirm · sample data</div>" +
      '<h2 style="margin:4px 0 0;font-weight:400">' + esc(sc.title) + "</h2>" +
      '<div class="prog">' + sc.steps.map(function (_, k) { return '<span class="' + (k <= S.step ? "on" : "") + '"></span>'; }).join("") + "</div>" +
      (s.oi ? '<div class="callout"><b>' + esc(s.oi) + " open:</b> " + esc(M.ois[s.oi]) + " The Enterprise must answer before this is final.</div>" : "") +
      '<p class="step"' + dr(s.proves) + "><b>" + esc(who(s.actor)) + "</b>" + (actor ? prop(actor.proposed) : "") + " · " + esc(s.action) +
      (t ? ' <span class="small">(' + esc(label(t.from)) + " → " + esc(label(t.to)) + ")</span>" : "") + "</p>" +
      '<div class="B-two">' + desk + phones + "</div>" +
      '<div style="display:flex;gap:8px;margin-top:14px"><button class="tbtn"' + (S.step === 0 ? " disabled" : "") + attr("on", "step") + attr("d", -1) + ">‹ Back</button>" +
      '<button class="tbtn"' + attr("on", "step") + attr("d", 1) + ">" + (last ? "Next scenario ›" : "Next ›") + "</button></div></div>" +
      '<div class="B-proof"><h5>This step proves</h5>' + (s.proves.length ? s.proves.map(function (id) {
        var q = reqById[id];
        return '<div style="margin:8px 0 14px"' + dr([id]) + '><span class="chip req"' + attr("on", "trace") + attr("id", id) + ">" + esc(id) + "</span> <b>" + esc(q.title) + '</b> <span class="small">' + esc(q.priority) + "</span>" + prop(q.proposed) +
          q.acceptance.map(function (a) { return '<div class="acc">' + plain(a) + "</div>"; }).join("") + "</div>";
      }).join("") : '<div class="small">No Requirement yet. See the Open Item.</div>') +
      (s.oi ? '<h5 style="color:var(--oi);margin-top:16px">Open Item</h5><div>' + oiChip(s.oi) + " " + esc(M.ois[s.oi]) + "</div>" : "") +
      '<h5 style="margin-top:20px">Requirements in scenarios</h5><div class="small">' + M.requirements.map(function (q) {
        return "<div>" + (covered(q.id) ? "✓" : "✗") + " " + esc(q.id) + " " + esc(q.title) + "</div>";
      }).join("") + '</div><h5 style="margin-top:16px">Transitions in scenarios</h5><div class="small">' + M.transitions.map(function (x) {
        return "<div>" + (tCovered(x.id) ? "✓" : "✗") + " " + esc(label(x.from)) + " → " + esc(label(x.to)) + "</div>";
      }).join("") + "</div></div></div>";
  }

  // ---------- Mobile + trace tab ----------
  function viewMob() {
    var role = S.mrole, me = roleByName[role] || { reqs: [] };
    var r = S.rows.filter(function (x) { return mine(x, role).length; })[0] || null;
    var shown = r || S.rows[0];
    var waiting = r ? [{ to: role, when: "sample", row: r.id, title: "Action needed", text: r.id + " · " + label(r.status) + " waits for you" }] : [];
    var home = '<div class="phone"' + dr(me.reqs) + '><div class="dev-title sm">' + esc(who(role)) + '</div><div class="dev"><div class="scr">' + launcher(role, true, waiting) + '</div></div><div class="cap">home · bot notifications</div></div>';
    var rec = shown ? '<div class="phone"><div class="dev-title sm">' + esc(who(role)) + '</div><div class="dev">' +
      '<div class="bar" style="background:#fff;border-bottom:1px solid var(--line)"><span class="ico">‹</span><div class="t">' + esc(M.entity) + " · " + esc(shown.id) + "</div>" + SAMPLE + "</div>" +
      '<div class="scr white">' + (M.statuses.length && !main.fields.some(isStatusField) ? '<div class="ofld ro"><label>Status</label><div class="val">' + st(shown.status) + "</div></div>" : "") +
      main.fields.map(function (f) { return fieldHTML(shown, f, false); }).join("") + "</div>" +
      '<div class="dfoot">' + mine(shown, role).map(function (t) {
        var why = blocked(t, shown);
        return '<button class="tbtn"' + (why ? " disabled" : "") + ' title="' + esc(why || t.trigger) + '"' + attr("on", "act") + attr("row", shown.id) + attr("t", t.id) + attr("role", role) + dr(t.reqs) + ">" + esc(t.action) + "</button>";
      }).join("") + '</div></div><div class="cap">record</div></div>' : "";
    var chat = chatPhone(role, r);
    var phones = keyRoles.length ? keyRoles : M.roles;
    return '<div class="C"><div class="C-main"><div class="rolesw">' + phones.map(function (x) {
      return '<button class="' + (x.role === role ? "on" : "") + '"' + attr("on", "mrole") + attr("role", x.role) + ">" + esc(who(x.role)) + "</button>";
    }).join("") + '</div><div class="C-phones">' + home + rec + chat + "</div></div>" +
      '<div class="C-trace"><h5>Requirement trace</h5><div class="small" style="margin-bottom:12px">Click a Requirement to light up where it shows, in every tab. Click a place to go there.</div>' +
      M.requirements.map(function (q) {
        var places = M.trace[q.id] || [];
        return '<div class="r' + (S.req === q.id ? " on" : "") + '"' + attr("on", "trace") + attr("id", q.id) + '><span class="chip req">' + esc(q.id) + "</span> <b>" + esc(q.title) + "</b> " +
          q.ois.map(oiChip).join(" ") + prop(q.proposed) + '<div class="small" style="margin-top:3px">' + esc(q.priority) + " · " + plain(q.statement) + "</div>" +
          '<ul class="places">' + places.map(function (p, i) {
            return "<li><a" + attr("on", "goto") + attr("id", q.id) + attr("i", i) + ">" + esc({ app: "App", scen: "Scenarios", mob: "Mobile" }[p.tab]) + "</a> · " + esc(p.what) + "</li>";
          }).join("") + "</ul></div>";
      }).join("") + "</div></div>";
  }

  // ---------- page ----------
  var TABS = [["app", "App", viewApp], ["scen", "Scenarios", viewScen], ["mob", "Mobile + trace", viewMob]];
  function render() {
    var appLabel = M.app === undefined ? "Not mapped yet" : M.app === null ? "No catalog App (custom)" : "Neome App: " + M.app;
    var banner = '<div class="banner"><b>PROTOTYPE</b> · ' + esc(M.enterprise) + ' · Module <span class="chip">' + esc(M.prefix) + "</span> " + esc(M.name) +
      " · " + M.requirements.length + " Requirements · " + Object.keys(M.ois).length + ' Open Items · <span class="chip">sample data</span>' +
      '<span class="right"><span class="chip">' + esc(appLabel) + "</span>" + (M.delivery ? '<span class="chip">' + esc(M.delivery) + " · indicative</span>" : "") + "</span></div>";
    var tabs = '<div class="ptabs">' + TABS.map(function (t) { return '<button class="' + (S.tab === t[0] ? "on" : "") + '"' + attr("on", "tab") + attr("v", t[0]) + ">" + t[1] + "</button>"; }).join("") +
      '<div class="right"><label class="small"><input type="checkbox"' + (S.tags ? " checked" : "") + attr("change", "tags") + "> show Requirement tags</label>" +
      '<button class="tbtn"' + attr("on", "reset") + ' title="Put the sample data back">Reset</button></div></div>';
    var q = S.req && reqById[S.req];
    var hl = q ? '<div class="hlbar">Showing where <span class="chip req">' + esc(q.id) + "</span> <b>" + esc(q.title) + "</b> shows (" + (M.trace[q.id] || []).length + ' places) <button class="tbtn"' + attr("on", "clear") + ">Clear</button></div>" : "";
    var view = TABS.filter(function (t) { return t[0] === S.tab; })[0] || TABS[0];
    document.body.classList.toggle("showtags", S.tags);
    document.getElementById("app").innerHTML = banner + tabs + hl + view[2]();
    if (S.req) {
      Array.prototype.forEach.call(document.querySelectorAll("#app [data-req]"), function (el) {
        if (el.getAttribute("data-req").split(" ").indexOf(S.req) >= 0) el.classList.add("hl");
      });
    }
  }

  // ---------- events ----------
  var ON = {
    noop: function () {},
    tab: function (d) { S.tab = d.v; },
    view: function (d) { S.view = d.v; },
    screen: function (d) { S.screen = d.screen; S.open = null; },
    open: function (d) { S.tab = "app"; S.screen = "entity"; S.open = d.row; S.dtab = "d"; },
    close: function () { S.open = null; },
    dtab: function (d) { S.dtab = d.v; },
    act: function (d) { act(d.row, d.t, d.role); },
    create: function () {
      S.seq += 1;
      var id = M.prefix + "-NEW-" + S.seq;
      S.rows.unshift({ id: id, status: starts[0] || null, values: {}, children: {}, log: [["now · " + S.seq, who(S.role), "Created"]] });
      S.open = id; S.dtab = "d";
    },
    scen: function (d) { S.sc = Number(d.sc); S.step = 0; },
    step: function (d) {
      var sc = M.scenarios[S.sc];
      if (Number(d.d) < 0) S.step = Math.max(0, S.step - 1);
      else if (S.step < sc.steps.length - 1) S.step += 1;
      else { S.sc = (S.sc + 1) % M.scenarios.length; S.step = 0; }
    },
    mrole: function (d) { S.mrole = d.role; },
    trace: function (d) { S.req = S.req === d.id ? null : d.id; },
    clear: function () { S.req = null; },
    goto: function (d) {
      var p = (M.trace[d.id] || [])[Number(d.i)];
      S.req = d.id;
      if (!p) return;
      S.tab = p.tab;
      if (p.tab === "scen") { S.sc = p.sc; S.step = p.step; }
      if (p.tab === "mob" && p.role) S.mrole = p.role;
      if (p.tab === "app") {
        S.open = null;
        var m = /^(Report|Rules): (.*)$/.exec(p.what);
        if (m && m[1] === "Report") S.screen = "report:" + M.reports.map(function (x) { return x.name; }).indexOf(m[2]);
        else if (m) S.screen = "rules";
        else {
          S.screen = "entity";
          if (/^(Record|Action):/.test(p.what) && S.rows[0]) {
            var t = /^Action:/.test(p.what) ? M.transitions.filter(function (x) { return p.what.indexOf("Action: " + x.action + " (") === 0; })[0] : null;
            var target = t ? S.rows.filter(function (x) { return x.status === t.from; })[0] : S.rows[0];
            if (t && t.by[0] !== "system") S.role = t.by[0];
            S.open = (target || S.rows[0]).id;
            S.dtab = "d";
          }
        }
      }
    },
    reset: function () { S = fresh(S); },
  };
  var CHANGE = {
    role: function (el) { S.role = el.value; S.open = null; },
    tags: function (el) { S.tags = el.checked; },
    field: function (el) {
      var r = row(el.getAttribute("data-row"));
      if (!r) return;
      var type = el.getAttribute("data-type");
      var v = el.value;
      r.values[el.getAttribute("data-field")] = (type === "number" || type === "money") && v.trim() !== "" && !isNaN(Number(v)) ? Number(v) : v;
    },
  };
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-on]");
    if (!el || el.disabled) return;
    if (el.tagName === "A") e.preventDefault();
    var fn = ON[el.getAttribute("data-on")];
    if (!fn) return;
    e.stopPropagation();
    fn(el.dataset);
    render();
  });
  document.addEventListener("change", function (e) {
    var el = e.target.closest("[data-change]");
    if (!el) return;
    CHANGE[el.getAttribute("data-change")](el);
    render();
  });

  S = fresh();
  render();
})();
