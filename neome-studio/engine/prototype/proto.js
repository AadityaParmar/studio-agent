// Prototype template script. Draws every screen from the embedded page model.
// Tabs: How it works (swimlane flow + guided steps) · Try it (clickable app, desktop or phone) · By role ·
// Questions for you. Consultant mode adds Requirement IDs, coverage and the trace.
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
  M.roles.forEach(function (r, i) { r.color = i % 6; roleByName[r.role] = r; });
  var reqById = {};
  M.requirements.forEach(function (r) { reqById[r.id] = r; });
  var keyRoles = M.roles.filter(function (r) { return r.key; });
  var starts = M.statuses.filter(function (s) { return s.start; }).map(function (s) { return s.id; });
  var owners = uniq(M.transitions.filter(function (t) { return starts.indexOf(t.from) >= 0; })
    .reduce(function (a, t) { return a.concat(t.by); }, []).filter(function (b) { return b !== "system"; }));
  var oiIds = Object.keys(M.ois);

  function fresh(keep) {
    var s = {
      rows: clone(M.rows), notifs: [], chat: {}, seq: 0,
      tab: "how", sc: 0, step: 0,
      role: (keyRoles[0] || M.roles[0] || { role: "" }).role, device: "desk", view: M.statuses.length ? "kanban" : "sheet",
      screen: "entity", open: null, dtab: "d",
      consult: false, req: null, answers: {}, notes: {}, copied: "",
    };
    if (keep) ["tab", "sc", "step", "role", "device", "view", "consult", "req", "answers", "notes"].forEach(function (k) { s[k] = keep[k]; });
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
  function person(role) { return role === "system" ? "Neome" : roleByName[role] ? roleByName[role].person : role; }
  function who(role) {
    if (role === "system") return "Neome";
    var r = roleByName[role];
    return r && r.person !== r.role ? r.person + " (" + r.role + ")" : role;
  }
  function avatar(role, small) {
    var r = roleByName[role];
    var c = role === "system" ? "sys" : "c" + (r ? r.color : 0);
    return '<span class="ava ' + c + (small ? " sm" : "") + '">' + (role === "system" ? "⚙" : esc(person(role).charAt(0).toUpperCase())) + "</span>";
  }
  function label(id) { return statusById[id] ? statusById[id].label : id; }
  // Our suggestion (proposed by Neomenta): dotted underline, explained once in the header.
  function sug(html, p) { return p ? '<span class="sug" title="Our suggestion, please confirm">' + html + "</span>" : html; }
  function pill(id) {
    var s = statusById[id];
    return s ? '<span class="pill p-' + s.tone + '">' + sug(esc(s.label), s.proposed) + "</span>" + qmark(s.oi) : "";
  }
  function fmt(f, v) {
    if (v === undefined || v === null || v === "") return "";
    if ((f.type === "money" || f.type === "number") && typeof v === "number") return esc(v.toLocaleString("en"));
    if (f.type === "link-to-entity") return '<a class="lnk" href="#" data-on="noop">' + esc(v) + "</a>";
    if (f.type === "file") return "📎 " + esc(v);
    return esc(v);
  }
  function isStatusField(f) { return /^status$/i.test(f.name) && M.statuses.length > 0; }

  // ---------- Consultant overlay ----------
  function reqChips(ids) {
    return (ids || []).map(function (id) {
      return '<span class="chip req c-only"' + attr("on", "trace") + attr("id", id) + ' title="' + esc(reqById[id] ? reqById[id].title : "") + '">' + esc(id) + "</span>";
    }).join(" ");
  }
  // An open question on an element: "?" for the customer, the OI id in Consultant mode.
  function qmark(id) {
    return id && M.ois[id] ? ' <span class="qmark" title="' + esc("Question for you: " + M.ois[id]) + '">?</span><span class="chip oi c-only">' + esc(id) + "</span>" : "";
  }

  // ---------- behaviour (Try it) ----------
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
    return bad.length ? "Only when " + bad.map(function (g) { return g.field + " " + g.op + " " + g.value; }).join(" and ") : "";
  }
  function outOf(r) { return M.transitions.filter(function (t) { return t.from === r.status; }); }
  function mine(r, role) { return outOf(r).filter(function (t) { return t.by.indexOf(role) >= 0; }); }
  function systemOut(r) { return outOf(r).filter(function (t) { return t.by[0] === "system"; }); }
  function canEdit(r, role) { return (!M.statuses.length || starts.indexOf(r.status) >= 0) && (owners.indexOf(role) >= 0 || !owners.length); }
  function tById(id) { return M.transitions.filter(function (t) { return t.id === id; })[0]; }
  function isRed(t) { return /reject|lost|cancel|close/i.test(t.action); }

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
  function tile(kind, glyph, name, on, handler, extra) {
    return '<div class="tile ' + kind + (on ? " on" : "") + '"' + (handler || "") + (extra || "") + '><div class="g">' + glyph + "</div>" + esc(name) + "</div>";
  }
  function notifsFor(role) { return S.notifs.filter(function (n) { return n.to === role; }); }
  function notifHTML(n, phone) {
    return '<div class="notif"' + (n.row && !phone ? attr("on", "open") + attr("row", n.row) : "") + '><div class="avatar">🤖</div><div style="flex:1;min-width:0"><div class="who"><span>' +
      esc(M.name) + '</span><span class="time">' + esc(n.when) + '</span></div><div class="msg">✨ <b>' + esc(n.title) + "!</b> " + esc(n.text) + "</div></div></div>";
  }
  function launcher(role, phone, extraNotifs) {
    var me = roleByName[role] || { reqs: [] };
    var tiles = tile("green", "▤", M.entity, !phone && S.screen === "entity", phone ? "" : attr("on", "screen") + attr("screen", "entity"));
    M.reports.forEach(function (r, i) {
      tiles += tile("blue", "▦", r.name, !phone && S.screen === "report:" + i, phone ? "" : attr("on", "screen") + attr("screen", "report:" + i), dr(r.reqs));
    });
    if (M.rules.length) tiles += tile("grey", "⚙", "Rules", !phone && S.screen === "rules", phone ? "" : attr("on", "screen") + attr("screen", "rules"), dr(M.rules.reduce(function (a, r) { return a.concat(r.reqs); }, [])));
    var list = (extraNotifs || []).concat(notifsFor(role));
    return '<div class="bar"' + dr(me.reqs) + ">" + avatar(role) + '<div class="t">' + esc(who(role)) + '</div><span class="ico" style="margin-left:auto">🔔</span></div>' +
      '<div class="searchpill">🔍 Search messages or data</div><div class="tiles">' + tiles + "</div>" +
      list.map(function (n) { return notifHTML(n, phone); }).join("");
  }

  function fieldHTML(r, f, editable, mode) {
    var v;
    if (isStatusField(f)) v = pill(r.status);
    else if (mode === "new" && f.auto) v = '<span class="auto">' + (fmt(f, r.values[f.name]) || "—") + "</span>";
    else if (editable && f.type !== "file") {
      var cur = r.values[f.name];
      if (f.type === "choice" && f.choices) {
        v = "<select" + attr("change", "field") + attr("row", r.id) + attr("field", f.name) + '><option value=""></option>' +
          f.choices.map(function (c) { return "<option" + (c === cur ? " selected" : "") + ">" + esc(c) + "</option>"; }).join("") + "</select>";
      } else {
        v = '<input value="' + esc(cur == null ? "" : cur) + '"' + (f.type === "number" || f.type === "money" ? ' inputmode="decimal"' : "") +
          attr("change", "field") + attr("row", r.id) + attr("field", f.name) + attr("type", f.type) + ">";
      }
    } else v = fmt(f, r.values[f.name]) || '<span class="small">—</span>';
    var trail = (!editable && mode !== "new") || isStatusField(f) ? "" : f.type === "date" ? "📅" : f.type === "link-to-entity" ? "＋ ✕" : f.type === "person" ? "✕" : f.type === "file" ? "📎" : f.type === "choice" ? "▾" : "";
    var auto = f.auto && mode === "new" ? '<span class="autotag">filled by Neome</span>' : "";
    return "<div" + dr(f.reqs) + '><div class="ofld' + ((editable || mode === "new") && !isStatusField(f) && !f.auto ? "" : " ro") + '"><label>' + sug(esc(f.name), f.proposed) + (f.required && mode === "new" && !f.auto ? " *" : "") + '</label><div class="val">' + v + "</div>" +
      auto + (trail && !f.auto ? '<span class="tr">' + trail + "</span>" : "") + "</div>" +
      (f.oi || (f.reqs && f.reqs.length) ? '<div class="tags">' + qmark(f.oi) + " " + reqChips(f.reqs) + "</div>" : "") +
      (editable && f.notes && !/^(Values|Links to):/i.test(f.notes) ? '<div class="helper">' + plain(f.notes) + "</div>" : "") + "</div>";
  }

  function childTable(r, rec) {
    var rows = (r.children && r.children[rec.entity]) || [];
    return '<div class="secdiv">' + esc(rec.entity) + '</div><table class="sub-t"><tr>' +
      rec.fields.map(function (f) { return "<th" + dr(f.reqs) + ">" + sug(esc(f.name), f.proposed) + qmark(f.oi) + " " + reqChips(f.reqs) + "</th>"; }).join("") + "</tr>" +
      (rows.length ? rows.map(function (c) { return "<tr>" + rec.fields.map(function (f) { return "<td>" + fmt(f, c[f.name]) + "</td>"; }).join("") + "</tr>"; }).join("")
        : '<tr><td colspan="' + rec.fields.length + '" class="small">Nothing here</td></tr>') + "</table>";
  }

  function gateList(r) {
    var items = [];
    outOf(r).filter(function (t) { return t.rules.length || t.guard.length; }).forEach(function (t) {
      t.rules.forEach(function (n) {
        var rule = M.rules.filter(function (x) { return x.rule === n; })[0];
        if (rule) items.push("<li" + dr(t.reqs) + "><b>" + esc(t.action) + ":</b> " + sug(plain(rule.when) + " → " + plain(rule.action), rule.proposed) + "</li>");
      });
      t.guard.forEach(function (g) { items.push("<li" + dr(t.reqs) + "><b>" + esc(t.action) + ":</b> only when " + esc(g.field + " " + g.op + " " + g.value) + "</li>"); });
    });
    return items.length ? '<ul class="gates">' + items.join("") + "</ul>" : "";
  }
  function hotBtn(t, actor) {
    return '<button class="btn solid hot' + (isRed(t) ? " red" : "") + '"' + dr(t.reqs) + ">" + sug(esc(t.action), t.proposed) +
      '<span class="tip">' + esc(person(actor)) + " presses " + esc(t.action) + "</span></button>";
  }
  function actBtn(r, t, role) {
    var why = role === "system" ? "" : blocked(t, r);
    return '<button class="btn' + (isRed(t) ? " red" : " solid") + '"' + (why ? " disabled" : "") + ' title="' + esc(why || t.trigger) + '"' +
      attr("on", "act") + attr("row", r.id) + attr("t", t.id) + attr("role", role) + dr(t.reqs) + ">" + (role === "system" ? "⏱ " : "") + sug(esc(t.action), t.proposed) + (role === "system" ? " (Neome)" : "") + "</button>";
  }

  // The record drawer. opts.static = picture in a step (no clicks); opts.hot = transition pressed in this step;
  // opts.mode = "new" for a create step.
  function drawer(r, role, opts) {
    opts = opts || {};
    var editable = !opts.static && canEdit(r, role);
    var tab = opts.static ? "d" : S.dtab;
    var acts = "", note = "";
    if (opts.mode === "new") {
      acts = '<button class="btn">Cancel</button><button class="btn solid hot">Save<span class="tip">' + esc(person(role)) + " presses Save</span></button>";
    } else if (opts.static) {
      if (opts.hot) acts = hotBtn(opts.hot, role);
    } else {
      acts = mine(r, role).map(function (t) { return actBtn(r, t, role); }).concat(systemOut(r).map(function (t) { return actBtn(r, t, "system"); })).join("");
      var others = uniq(outOf(r).filter(function (t) { return t.by.indexOf(role) < 0 && t.by[0] !== "system"; }).reduce(function (a, t) { return a.concat(t.by); }, []));
      if (!mine(r, role).length && others.length) note = "Waiting on " + others.map(person).join(", ");
      else if (!outOf(r).length && M.statuses.length) note = "No more steps";
    }
    var details = (M.statuses.length && !main.fields.some(isStatusField) && opts.mode !== "new" ? '<div class="ofld ro"><label>Status</label><div class="val">' + pill(r.status) + "</div></div>" : "") +
      (opts.mode === "new" || opts.static ? "" : gateList(r)) + main.fields.filter(function (f) { return !(opts.mode === "new" && isStatusField(f)); }).map(function (f) { return fieldHTML(r, f, editable, opts.mode); }).join("") +
      children.map(function (c) { return childTable(r, c); }).join("");
    var activity = '<div class="timeline">' + (r.log.length ? r.log.slice().reverse().map(function (l) { return '<div><div class="when">' + esc(l[0]) + " · " + esc(l[1]) + "</div>" + esc(l[2]) + "</div>"; }).join("") : '<div class="small">Nothing here yet</div>') + "</div>";
    var title = opts.mode === "new" ? "New " + esc(M.entity) : esc(M.entity) + " · " + esc(r.id);
    return '<div class="drawer' + (opts.static ? " static" : "") + '"><div class="bar"><span class="ico"' + (opts.static ? "" : attr("on", "close")) + ' style="cursor:pointer">›</span><div class="t">' + title + '</div><div class="dacts">' + acts + "</div></div>" +
      (opts.mode === "new" ? "" : '<div class="dtabs"><button class="' + (tab === "d" ? "on" : "") + '"' + (opts.static ? "" : attr("on", "dtab") + attr("v", "d")) + ">DETAILS</button><button class=\"" + (tab === "a" ? "on" : "") + '"' + (opts.static ? "" : attr("on", "dtab") + attr("v", "a")) + ">HISTORY</button></div>") +
      '<div class="dbody">' + (tab === "d" ? details : activity) + "</div>" + (note ? '<div class="dfoot">' + esc(note) + "</div>" : "") + "</div>";
  }

  // Kanban card / sheet: skip a field that only repeats the row id.
  function cardFields(rows) {
    return main.fields.filter(function (f) {
      return !isStatusField(f) && f.type !== "file" && !rows.every(function (r) { return String(r.values[f.name]) === r.id; });
    }).slice(0, 3);
  }
  function sheet(rows, clickable, focus) {
    var hasStatusCol = M.statuses.length && !main.fields.some(isStatusField);
    return "<table><tr><th>#</th>" + main.fields.map(function (f) { return "<th" + dr(f.reqs) + ">" + sug(esc(f.name), f.proposed) + "</th>"; }).join("") +
      (hasStatusCol ? "<th>Status</th>" : "") + "</tr>" +
      rows.map(function (r, i) {
        return '<tr class="row' + (focus === r.id ? " focus" : "") + '"' + (clickable ? attr("on", "open") + attr("row", r.id) : "") + "><td>" + (i + 1) + "</td>" +
          main.fields.map(function (f) { return "<td>" + (isStatusField(f) ? pill(r.status) : fmt(f, r.values[f.name])) + "</td>"; }).join("") +
          (hasStatusCol ? "<td>" + pill(r.status) + "</td>" : "") + "</tr>";
      }).join("") + "</table>";
  }
  function kanban(rows, clickable, focus) {
    var cf = cardFields(rows);
    return '<div class="kan">' + M.statuses.map(function (s) {
      var qs = rows.filter(function (r) { return r.status === s.id; });
      return '<div class="kcol k-' + s.tone + '"><h4 class="t-' + s.tone + '">' + sug(esc(s.label), s.proposed) + " (" + qs.length + ")" + qmark(s.oi) + "</h4>" +
        qs.map(function (r) {
          return '<div class="kcard' + (focus === r.id ? " focus" : "") + '"' + (clickable ? attr("on", "open") + attr("row", r.id) : "") + '><div class="in">' +
            '<div class="kid">' + esc(r.id) + "</div>" +
            cf.map(function (f) { return '<div class="kv"' + dr(f.reqs) + '><span class="k">' + esc(f.name) + ':</span><span class="v">' + fmt(f, r.values[f.name]) + "</span></div>"; }).join("") +
            "</div></div>";
        }).join("") + "</div>";
    }).join("") + "</div>";
  }
  function reportView(i, rows) {
    var r = M.reports[i];
    if (!r) return "";
    return '<div class="bar"><span class="ico">≡</span><div class="ttl"><div class="t">' + sug(esc(r.name), r.proposed) + '</div><div class="sub">Report · for ' + plain(r.audience) + "</div></div></div>" +
      '<div class="report"' + dr(r.reqs) + '><div class="small">' + plain(r.measures) + " " + reqChips(r.reqs) + "</div>" +
      '<div class="kpis">' + (M.statuses.length ? M.statuses.map(function (s) {
        return '<div class="kpi"><div class="n">' + rows.filter(function (x) { return x.status === s.id; }).length + '</div><div class="small t-' + s.tone + '">' + esc(s.label) + "</div></div>";
      }).join("") : '<div class="kpi"><div class="n">' + rows.length + '</div><div class="small">' + esc(M.entity) + "</div></div>") + "</div>" +
      '<div class="small">Counts from the example records, to show the idea. The real report is set up in the build.</div></div>';
  }
  function rulesView() {
    return '<div class="bar"><span class="ico">≡</span><div class="ttl"><div class="t">Rules</div><div class="sub">' + M.rules.length + " rules</div></div></div>" +
      '<table><tr><th>#</th><th>Rule</th><th>When</th><th>What happens</th></tr>' +
      M.rules.map(function (r, i) {
        return "<tr" + dr(r.reqs) + "><td>" + (i + 1) + '</td><td class="wrap">' + sug(esc(r.rule), r.proposed) + " " + reqChips(r.reqs) + '</td><td class="wrap">' + plain(r.when) + '</td><td class="wrap">' + plain(r.action) + "</td></tr>";
      }).join("") + "</table>";
  }

  // ---------- phones ----------
  function bubbleCard(r) {
    var cf = cardFields([r]);
    return '<div class="card"><b>' + esc(r.id) + "</b><br>" + cf.map(function (f) { return esc(f.name) + ": " + fmt(f, r.values[f.name]); }).join("<br>") + (M.statuses.length ? "<br>Status: " + pill(r.status) : "") + "</div>";
  }
  function phoneShell(role, inner, cap, guessed) {
    return '<div class="phone"><div class="ph-title">' + avatar(role, true) + esc(who(role)) + "</div>" + '<div class="dev">' + inner + "</div>" +
      (cap ? '<div class="cap">' + cap + (guessed ? ' <span class="guess" title="No real Neome approval screen seen yet">· layout guessed</span>' : "") + "</div>" : "") + "</div>";
  }
  function chatPhone(role, r, opts) {
    opts = opts || {};
    var ts = r ? mine(r, role) : [];
    var buttons = opts.static ? (opts.hot ? '<div class="acts">' + hotBtn(opts.hot, role) + "</div>" : "")
      : ts.length ? '<div class="acts">' + ts.map(function (t) { return actBtn(r, t, role); }).join("") + "</div>" : "";
    var past = opts.static ? [] : (S.chat[role] || []);
    var head = r ? "Action needed" : "Nothing waits for you";
    var inner = '<div class="bar"><span class="ico">‹</span><div class="avatar">🤖</div><div><div class="t">' + esc(M.name) + '</div><div class="sub">bot</div></div></div>' +
      '<div class="chat"><div class="datepill">Today</div>' +
      (r ? '<div class="bub in"><div class="nm">' + esc(M.name) + "</div>✨ <b>" + esc(head) + "!</b>" + bubbleCard(r) + buttons + '<div class="tm">now</div></div>' : '<div class="bub in"><div class="nm">' + esc(M.name) + "</div>" + esc(head) + "</div>") +
      past.map(function (c) { return '<div class="bub out">' + esc(c.text) + '<div class="tm">' + esc(c.when) + " ✓✓</div></div>"; }).join("") +
      '</div><div class="cbar"><div class="in">Message</div><span class="ico">➤</span></div>';
    return phoneShell(role, inner, "Bot chat", true);
  }

  // ---------- How it works ----------
  // Rows as they stand before step k of the scenario (sample rows, then each earlier step's new status).
  function rowsBefore(sc, k) {
    var rows = clone(M.rows);
    sc.steps.slice(0, k).forEach(function (s) {
      rows.forEach(function (r) { if (r.id === s.row && s.status) r.status = s.status; });
    });
    return rows;
  }
  function laneName(l) {
    if (l === "system") return '<span class="lname">' + avatar("system") + "<span>Neome<small>automatic</small></span></span>";
    var r = roleByName[l];
    return '<span class="lname">' + avatar(l) + "<span>" + sug(esc(person(l)), r && r.proposed) + "<small>" + esc(l) + "</small></span></span>";
  }
  function flowMap(sc) {
    var n = sc.steps.length;
    var cols = "grid-template-columns:132px repeat(" + n + ",minmax(124px,1fr))";
    var h = '<div class="lanes" id="lanes" style="' + cols + '"><div class="lh">Status</div>';
    sc.steps.forEach(function (s) { h += '<div class="sc-st">' + (s.status ? pill(s.status) : "") + "</div>"; });
    sc.lanes.forEach(function (l, li) {
      var cls = "lane l" + (l === "system" ? "s" : li % 2);
      h += '<div class="' + cls + ' lhead">' + laneName(l) + "</div>";
      sc.steps.forEach(function (s, i) {
        h += '<div class="' + cls + '">' + (s.actor === l ? '<button class="box' + (i === S.step ? " cur" : i < S.step ? " done" : "") + (s.proposed ? " sugg" : "") + (s.oi ? " q" : "") + '"' +
          attr("on", "go") + attr("i", i) + ' id="bx' + i + '"><b>Step ' + (i + 1) + (s.oi ? " · ?" : "") + "</b>" + esc(s.label) + "</button>" : "") + "</div>";
      });
    });
    return '<div class="card flow"><h3>The flow · who does what · click a step</h3><div class="lanes-wrap">' + h + '<svg class="wires" id="wires"></svg></div></div></div>';
  }
  function drawWires() {
    var svg = document.getElementById("wires"), lanes = document.getElementById("lanes");
    if (!svg || !lanes) return;
    var o = lanes.getBoundingClientRect(), p = "";
    svg.setAttribute("width", lanes.scrollWidth);
    svg.setAttribute("height", lanes.scrollHeight);
    p += '<defs><marker id="ah" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#9AA3B2"/></marker>' +
      '<marker id="ahc" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#1565C0"/></marker></defs>';
    for (var i = 0; ; i++) {
      var a = document.getElementById("bx" + i), b = document.getElementById("bx" + (i + 1));
      if (!a || !b) break;
      var ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
      var x1 = ra.right - o.left, y1 = ra.top + ra.height / 2 - o.top, x2 = rb.left - o.left, y2 = rb.top + rb.height / 2 - o.top, mx = (x1 + x2) / 2;
      var on = i < S.step;
      p += '<path d="M' + x1 + "," + y1 + " C" + mx + "," + y1 + " " + mx + "," + y2 + " " + (x2 - 2) + "," + y2 + '" fill="none" stroke="' + (on ? "#1565C0" : "#9AA3B2") + '" stroke-width="' + (on ? 2 : 1.5) + '" marker-end="url(#' + (on ? "ahc" : "ah") + ')"/>';
    }
    svg.innerHTML = p;
  }
  function stepScreen(sc, s) {
    var rows = rowsBefore(sc, S.step);
    var r = s.row ? rows.filter(function (x) { return x.id === s.row; })[0] : null;
    var t = s.transition ? tById(s.transition) : null;
    if (s.screen === "chat") return chatPhone(s.actor, r, { static: true, hot: t });
    var inner;
    if (s.create && r) inner = drawer(r, s.actor, { static: true, mode: "new" });
    else if (s.screen === "record" && r) inner = drawer(r, s.actor, { static: true, hot: t });
    else if (s.screen === "kanban") inner = '<div class="mp"><div class="body">' + kanban(rows, false, s.row) + "</div></div>";
    else if (s.screen === "report") inner = '<div class="mp">' + reportView(M.reports.map(function (x) { return x.name; }).indexOf(s.report), rows) + "</div>";
    else if (s.screen === "rules") inner = '<div class="mp">' + rulesView() + "</div>";
    else inner = '<div class="mp"><div class="body">' + sheet(rows, false, s.row) + "</div></div>";
    return '<div class="screen"><div class="sv">' + avatar(s.actor, true) + esc(person(s.actor)) + "'s view</div><div class=\"dev\">" + inner + "</div></div>";
  }
  function statusLine(s) {
    if (s.create) return '<div class="change">New ' + esc(M.entity) + " → " + pill(s.status) + "</div>";
    if (s.transition) return '<div class="change">Status: ' + pill(s.from) + " → " + pill(s.status) + "</div>";
    if (s.row && s.status) return '<div class="change">Status stays ' + pill(s.status) + "</div>";
    return "";
  }
  function bubbleText(s) {
    var t = s.transition ? tById(s.transition) : null;
    if (t) return "<b>" + esc(label(t.to)) + "!</b> " + esc(s.row) + ": " + esc(t.action) + " by " + esc(who(s.actor));
    return esc(s.action);
  }
  function sideCards(sc, s) {
    var key = S.sc + ":" + S.step;
    var acc = uniq(s.proves.reduce(function (a, id) { return a.concat(reqById[id] ? reqById[id].acceptance : []); }, []));
    var h = acc.length ? '<div class="card side-c"' + dr(s.proves) + "><h4>What this shows</h4>" + acc.map(function (a) { return '<div class="acc">' + plain(a) + "</div>"; }).join("") + reqChips(s.proves) + "</div>" : "";
    if (s.behind.length) h += '<div class="card side-c"><h4>Behind the scenes</h4><ul class="bs">' + s.behind.map(function (b) { return "<li>" + plain(b) + "</li>"; }).join("") + "</ul></div>";
    h += '<div class="card side-c"><h4>Who gets a message</h4>' + (s.notify.length ? s.notify.slice(0, 2).map(function (n) {
      return '<div class="mini"><div class="ph">' + avatar(n, true) + esc(person(n)) + "'s phone</div><div class=\"bub in\"><div class=\"nm\">" + esc(M.name) + " bot</div>" + bubbleText(s) + "</div></div>";
    }).join("") : '<div class="small">Nobody. Nothing is sent.</div>') + "</div>";
    if (s.oi) {
      h += '<div class="qcard"><h4>Question for you <span class="chip oi c-only">' + esc(s.oi) + "</span></h4>" + esc(M.ois[s.oi]) +
        '<textarea placeholder="Your answer"' + attr("change", "answer") + attr("key", s.oi) + ">" + esc(S.answers[s.oi] || "") + "</textarea></div>";
    } else {
      var n = S.notes[key] || {};
      h += '<div class="card side-c"><h4>Does this look right?</h4><div class="fb"><button class="btn' + (n.ok === true ? " solid" : "") + '"' + attr("on", "fb") + attr("v", "yes") + ">👍 Yes</button>" +
        '<button class="btn' + (n.ok === false ? " solid" : "") + '"' + attr("on", "fb") + attr("v", "change") + ">✏️ Needs change</button></div>" +
        (n.ok === false ? '<textarea placeholder="What should change?"' + attr("change", "note") + attr("key", key) + ">" + esc(n.text || "") + "</textarea>" : "") + "</div>";
    }
    return h;
  }
  function viewHow() {
    if (!M.scenarios.length) return '<div class="pad small">No stories yet.</div>';
    var sc = M.scenarios[S.sc] || M.scenarios[0], s = sc.steps[S.step] || sc.steps[0];
    var last = S.step >= sc.steps.length - 1;
    var pick = '<div class="pick">' + M.scenarios.map(function (x, k) {
      return '<button class="' + (k === S.sc ? "on" : "") + '"' + attr("on", "scen") + attr("sc", k) + ">" + (k + 1) + " · " + esc(x.title) + '<span class="kind">' + esc(x.kind) + "</span></button>";
    }).join("") + "</div>";
    var stage = '<div class="card stage"><div class="headline"><span class="n">Step ' + (S.step + 1) + " of " + sc.steps.length + "</span>" + reqChips(s.proves) + "</div>" +
      (S.step === 0 && sc.summary ? '<div class="summary">' + esc(sc.summary) + "</div>" : "") +
      '<div class="say"' + dr(s.proves) + '><span class="who">' + esc(who(s.actor)) + "</span> · " + esc(s.action) + (s.proposed ? ' <span class="why">· our suggestion</span>' : "") + "</div>" +
      statusLine(s) + stepScreen(sc, s) +
      '<div class="nav"><button class="btn"' + (S.step === 0 ? " disabled" : "") + attr("on", "step") + attr("d", -1) + ">‹ Back</button>" +
      '<button class="btn solid"' + attr("on", "step") + attr("d", 1) + ">" + (last ? "Next story ›" : "Next step ›") + '</button><span class="small">or click a step in the flow, or use ← →</span></div></div>';
    return '<div class="pad">' + pick + flowMap(sc) + '<div class="stagewrap">' + stage + '<div class="side">' + sideCards(sc, s) + "</div></div></div>";
  }

  // ---------- Try it ----------
  function hint(role) {
    var counts = {};
    S.rows.forEach(function (r) { mine(r, role).forEach(function (t) { counts[t.action] = (counts[t.action] || 0) + 1; }); });
    var can = Object.keys(counts).map(function (a) { return a + " (" + counts[a] + ")"; });
    if (canEdit({ status: starts[0] }, role)) can.unshift("New " + M.entity);
    return can.length ? esc(person(role)) + " can: " + esc(can.join(", ")) : "Nothing waits for " + esc(person(role));
  }
  function desk() {
    var rows = S.rows, mp;
    if (S.screen.indexOf("report:") === 0) mp = reportView(Number(S.screen.slice(7)), rows);
    else if (S.screen === "rules") mp = rulesView();
    else {
      var open = S.open && row(S.open);
      mp = '<div class="bar"><span class="ico">≡</span><div class="ttl"><div class="t">' + esc(M.entity) + '</div><div class="sub">' + rows.length + " records</div></div>" +
        '<div class="acts">' + (M.statuses.length ? '<div class="viewsw">' + ["sheet", "kanban"].map(function (v) {
          return '<button class="' + (S.view === v ? "on" : "") + '"' + attr("on", "view") + attr("v", v) + ">" + (v === "sheet" ? "Sheet" : "Kanban") + "</button>";
        }).join("") + "</div>" : "") + "</div></div>" +
        '<div class="body">' + (S.view === "kanban" && M.statuses.length ? kanban(rows, true) : sheet(rows, true)) + "</div>" +
        (canEdit({ status: starts[0] }, S.role) ? '<button class="fab" title="New ' + esc(M.entity) + '"' + attr("on", "create") + ">+</button>" : "") +
        (open ? '<div class="dim"' + attr("on", "close") + "></div>" + drawer(open, S.role) : "");
    }
    return '<div class="dev desk"><div class="lp">' + launcher(S.role, false) + '</div><div class="mp">' + mp + "</div></div>";
  }
  function phones() {
    var role = S.role;
    var r = S.rows.filter(function (x) { return mine(x, role).length; })[0] || null;
    var shown = r || S.rows[0];
    var waiting = r ? [{ to: role, when: "now", row: r.id, title: "Action needed", text: r.id + " · " + label(r.status) + " waits for you" }] : [];
    var home = phoneShell(role, '<div class="scr">' + launcher(role, true, waiting) + "</div>", "Home · bot messages");
    var rec = shown ? phoneShell(role, '<div class="bar white"><span class="ico">‹</span><div class="t">' + esc(M.entity) + " · " + esc(shown.id) + "</div></div>" +
      '<div class="scr white">' + (M.statuses.length && !main.fields.some(isStatusField) ? '<div class="ofld ro"><label>Status</label><div class="val">' + pill(shown.status) + "</div></div>" : "") +
      main.fields.map(function (f) { return fieldHTML(shown, f, false); }).join("") + "</div>" +
      '<div class="pfoot">' + mine(shown, role).map(function (t) { return actBtn(shown, t, role); }).join("") + "</div>", "Record") : "";
    return '<div class="phones">' + home + rec + chatPhone(role, r) + "</div>";
  }
  function viewTry() {
    var me = roleByName[S.role] || {};
    var chips = '<div class="rolechips">' + M.roles.map(function (r) {
      return '<button class="' + (r.role === S.role ? "on" : "") + '"' + attr("on", "role") + attr("role", r.role) + dr(r.reqs) + ">" + avatar(r.role, true) + sug(esc(r.person), r.proposed) + ' <span class="small">· ' + esc(r.role) + "</span></button>";
    }).join("") + '<span class="grow"></span><div class="viewsw">' + [["desk", "Desktop"], ["phone", "Phone"]].map(function (d) {
      return '<button class="' + (S.device === d[0] ? "on" : "") + '"' + attr("on", "device") + attr("v", d[0]) + ">" + d[1] + "</button>";
    }).join("") + '</div><button class="btn"' + attr("on", "reset") + ' title="Put the example records back">Reset</button></div>';
    var line = '<div class="hint">' + hint(S.role) + (me.does ? ' <span class="small">· ' + plain(me.does) + "</span>" : "") + qmark(me.oi) + " " + reqChips(me.reqs) + "</div>";
    return '<div class="pad">' + chips + line + (S.device === "phone" ? phones() : desk()) + "</div>";
  }

  // ---------- By role ----------
  function viewRoles() {
    var ordered = keyRoles.concat(M.roles.filter(function (r) { return !r.key; }));
    return '<div class="pad roles">' + ordered.map(function (r) {
      var presses = M.transitions.filter(function (t) { return t.by.indexOf(r.role) >= 0; });
      var told = M.transitions.filter(function (t) { return t.notify.indexOf(r.role) >= 0; });
      var name = r.role.toLowerCase();
      var sees = M.rules.filter(function (x) { return (String(x.when) + " " + String(x.action)).toLowerCase().indexOf(name) >= 0; });
      return '<div class="card rcard"' + dr(r.reqs) + '><div class="rhead">' + avatar(r.role) + "<div><b>" + sug(esc(r.person), r.proposed) + "</b> · " + esc(r.role) + qmark(r.oi) + '<div class="small">' + plain(r.does) + "</div></div></div>" +
        "<h4>Presses</h4>" + (presses.length ? "<ul>" + presses.map(function (t) {
          return "<li" + dr(t.reqs) + "><b>" + sug(esc(t.action), t.proposed) + "</b> when " + pill(t.from) + " → " + pill(t.to) + "</li>";
        }).join("") + "</ul>" : '<div class="small">No buttons. Views only.</div>') +
        "<h4>Gets a message when</h4>" + (told.length ? "<ul>" + told.map(function (t) {
          return "<li>" + esc(t.by.map(person).join(" or ")) + " presses <b>" + esc(t.action) + "</b> → " + pill(t.to) + "</li>";
        }).join("") + "</ul>" : '<div class="small">Never.</div>') +
        (sees.length ? "<h4>Rules about them</h4><ul>" + sees.map(function (x) { return "<li>" + sug(plain(x.when) + " → " + plain(x.action), x.proposed) + "</li>"; }).join("") + "</ul>" : "") +
        '<button class="btn"' + attr("on", "seeas") + attr("role", r.role) + ">See it as " + esc(r.person) + " ›</button></div>";
    }).join("") + "</div>";
  }

  // ---------- Questions for you ----------
  function wheres(id) {
    var w = [];
    M.scenarios.forEach(function (sc) { sc.steps.forEach(function (s, k) { if (s.oi === id) w.push("Step " + (k + 1) + " of “" + sc.title + "”"); }); });
    M.statuses.forEach(function (s) { if (s.oi === id) w.push("Status " + s.label); });
    M.records.forEach(function (rec) { rec.fields.forEach(function (f) { if (f.oi === id) w.push("Field " + f.name); }); });
    M.roles.forEach(function (r) { if (r.oi === id) w.push(r.role); });
    M.transitions.forEach(function (t) { if (t.oi === id) w.push("Button " + t.action); });
    return w;
  }
  function viewQ() {
    var tied = oiIds.filter(function (id) { return wheres(id).length; }), loose = oiIds.filter(function (id) { return !wheres(id).length; });
    var card = function (id) {
      var w = wheres(id);
      return '<div class="qcard"><div class="small">' + (w.length ? esc(w.join(" · ")) : "About this whole " + esc(M.name)) + ' <span class="chip oi c-only">' + esc(id) + "</span></div>" +
        '<div class="qt">' + esc(M.ois[id]) + '</div><textarea placeholder="Your answer"' + attr("change", "answer") + attr("key", id) + ">" + esc(S.answers[id] || "") + "</textarea></div>";
    };
    var notes = noteLines();
    return '<div class="pad qs"><p class="lead">We need your answer on these before we build. Write what you know; leave blank if unsure.</p>' +
      tied.map(card).join("") + (loose.length ? "<h3>About this whole " + esc(M.name) + "</h3>" + loose.map(card).join("") : "") +
      "<h3>Your notes on steps</h3>" + (notes.length ? "<ul>" + notes.map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("") + "</ul>" : '<div class="small">None yet. Use “Does this look right?” in How it works.</div>') +
      '<div class="copy"><button class="btn solid"' + attr("on", "copy") + ">Copy answers</button> <span class=\"small\">" + (S.copied ? "Copied. Send it to your Neomenta contact." : "Copies your answers and notes as text.") + "</span>" +
      '<textarea id="copy-out" readonly>' + esc(S.copied) + "</textarea></div></div>";
  }
  function noteLines() {
    var out = [];
    M.scenarios.forEach(function (sc, i) {
      sc.steps.forEach(function (s, k) {
        var n = S.notes[i + ":" + k];
        if (!n || n.ok === undefined) return;
        out.push("Story “" + sc.title + "” step " + (k + 1) + " (" + who(s.actor) + ": " + s.action + "): " + (n.ok ? "Looks right" : "Needs change: " + (n.text || "")));
      });
    });
    return out;
  }
  function feedbackText() {
    return ["Prototype feedback · " + M.enterprise + " · " + M.prefix + " " + M.name].concat(
      oiIds.map(function (id) { return "Q " + id + ": " + M.ois[id] + "\nA: " + (S.answers[id] ? S.answers[id] : "(no answer)"); }),
      noteLines()
    ).join("\n");
  }

  // ---------- Consultant panel ----------
  function consultPanel() {
    var covered = function (id) { return M.scenarios.some(function (x) { return x.steps.some(function (y) { return y.proves.indexOf(id) >= 0; }); }); };
    var tCovered = function (id) { return M.scenarios.some(function (x) { return x.steps.some(function (y) { return y.transition === id; }); }); };
    var tabName = function (p) { return p.tab === "how" ? "How it works" : p.phone ? "Try it · phone" : "Try it"; };
    return '<aside class="trace"><h4>Coverage</h4><div class="small">' +
      M.requirements.map(function (q) { return "<div>" + (covered(q.id) ? "✓" : "–") + " " + esc(q.id) + " " + esc(q.title) + "</div>"; }).join("") +
      '</div><h4>Status changes in stories</h4><div class="small">' +
      M.transitions.map(function (x) { return "<div>" + (tCovered(x.id) ? "✓" : "✗") + " " + esc(label(x.from)) + " → " + esc(label(x.to)) + "</div>"; }).join("") +
      '</div><h4>Requirement trace</h4><div class="small">Click a Requirement to light up where it shows. Click a place to go there.</div>' +
      M.requirements.map(function (q) {
        var places = M.trace[q.id] || [];
        return '<div class="r' + (S.req === q.id ? " on" : "") + '"' + attr("on", "trace") + attr("id", q.id) + '><span class="chip req">' + esc(q.id) + "</span> <b>" + esc(q.title) + "</b> " +
          (q.proposed ? '<span class="why">proposed</span>' : "") + '<div class="small">' + esc(q.priority) + " · " + plain(q.statement) + "</div>" +
          '<ul class="places">' + places.map(function (p, i) {
            return "<li><a" + attr("on", "goto") + attr("id", q.id) + attr("i", i) + ">" + esc(tabName(p)) + "</a> · " + esc(p.what) + "</li>";
          }).join("") + "</ul></div>";
      }).join("") + "</aside>";
  }

  // ---------- page ----------
  var TABS = [["how", "How it works", viewHow], ["try", "Try it", viewTry], ["role", "By role", viewRoles]];
  if (oiIds.length) TABS.push(["q", "Questions for you", viewQ]);
  function render() {
    var appLabel = M.app === undefined ? "Not mapped yet" : M.app === null ? "No catalog App (custom)" : "Neome App: " + M.app;
    var head = '<div class="top"><div class="hrow"><h1>' + esc(M.name) + " <small>" + esc(M.enterprise) + ' · how it will work in Neome</small></h1><span class="ptag">Prototype · not the live app</span></div>' +
      '<div class="note"><span>👀 All names and records are made-up examples.</span><span><span class="sug">Dotted</span> = our suggestion, please confirm.</span>' +
      (oiIds.length ? '<span><span class="qmark">?</span> = we have a question for you.</span>' : "") + "</div>" +
      '<div class="cinfo c-only"><span class="chip">' + esc(M.prefix) + "</span> " + M.requirements.length + " Requirements · " + oiIds.length + ' Open Items · <span class="chip">' + esc(appLabel) + "</span>" +
      (M.delivery ? ' <span class="chip">' + esc(M.delivery) + " · indicative</span>" : "") + "</div>" +
      '<div class="tabs">' + TABS.map(function (t) {
        return '<button class="' + (S.tab === t[0] ? "on" : "") + '"' + attr("on", "tab") + attr("v", t[0]) + ">" + t[1] + (t[0] === "q" ? ' <span class="count">' + oiIds.length + "</span>" : "") + "</button>";
      }).join("") + '<label class="right small"><input type="checkbox"' + (S.consult ? " checked" : "") + attr("change", "consult") + "> Consultant mode</label></div></div>";
    var q = S.req && reqById[S.req];
    var hl = q ? '<div class="hlbar">Showing where <span class="chip req">' + esc(q.id) + "</span> <b>" + esc(q.title) + '</b> shows <button class="btn"' + attr("on", "clear") + ">Clear</button></div>" : "";
    var view = TABS.filter(function (t) { return t[0] === S.tab; })[0] || TABS[0];
    document.body.classList.toggle("consult", S.consult);
    document.getElementById("app").innerHTML = head + hl + '<div class="wrap"><main>' + view[2]() + "</main>" + (S.consult ? consultPanel() : "") + "</div>";
    if (S.req) {
      Array.prototype.forEach.call(document.querySelectorAll("#app [data-req]"), function (el) {
        if (el.getAttribute("data-req").split(" ").indexOf(S.req) >= 0) el.classList.add("hl");
      });
    }
    if (view[0] === "how") drawWires();
  }

  // ---------- events ----------
  function goStep(d) {
    var sc = M.scenarios[S.sc];
    if (!sc) return;
    if (d < 0) S.step = Math.max(0, S.step - 1);
    else if (S.step < sc.steps.length - 1) S.step += 1;
    else { S.sc = (S.sc + 1) % M.scenarios.length; S.step = 0; }
  }
  var ON = {
    noop: function () {},
    tab: function (d) { S.tab = d.v; },
    view: function (d) { S.view = d.v; },
    device: function (d) { S.device = d.v; S.open = null; },
    screen: function (d) { S.screen = d.screen; S.open = null; },
    open: function (d) { S.tab = "try"; S.device = "desk"; S.screen = "entity"; S.open = d.row; S.dtab = "d"; },
    close: function () { S.open = null; },
    dtab: function (d) { S.dtab = d.v; },
    act: function (d) { act(d.row, d.t, d.role); },
    role: function (d) { S.role = d.role; S.open = null; },
    seeas: function (d) { S.role = d.role; S.tab = "try"; S.open = null; },
    create: function () {
      S.seq += 1;
      var id = M.prefix + "-NEW-" + S.seq;
      S.rows.unshift({ id: id, status: starts[0] || null, values: {}, children: {}, log: [["now · " + S.seq, who(S.role), "Created"]] });
      S.open = id; S.dtab = "d";
    },
    scen: function (d) { S.sc = Number(d.sc); S.step = 0; },
    go: function (d) { S.step = Number(d.i); },
    step: function (d) { goStep(Number(d.d)); },
    fb: function (d) {
      var key = S.sc + ":" + S.step, n = S.notes[key] || {};
      n.ok = d.v === "yes";
      S.notes[key] = n;
    },
    copy: function () {
      S.copied = feedbackText();
      try { if (navigator.clipboard) navigator.clipboard.writeText(S.copied).catch(function () {}); } catch (e) { /* select the box instead */ }
    },
    trace: function (d) { S.req = S.req === d.id ? null : d.id; },
    clear: function () { S.req = null; },
    goto: function (d) {
      var p = (M.trace[d.id] || [])[Number(d.i)];
      S.req = d.id;
      if (!p) return;
      if (p.tab === "how") { S.tab = "how"; S.sc = p.sc; S.step = p.step; return; }
      S.tab = "try";
      S.open = null;
      if (p.phone) { S.device = "phone"; if (p.role) S.role = p.role; return; }
      S.device = "desk";
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
    },
    reset: function () { S = fresh(S); S.tab = "try"; },
  };
  var CHANGE = {
    consult: function (el) { S.consult = el.checked; if (!S.consult) S.req = null; },
    field: function (el) {
      var r = row(el.getAttribute("data-row"));
      if (!r) return;
      var type = el.getAttribute("data-type");
      var v = el.value;
      r.values[el.getAttribute("data-field")] = (type === "number" || type === "money") && v.trim() !== "" && !isNaN(Number(v)) ? Number(v) : v;
    },
  };
  // Typing: keep the text, do not redraw (a redraw would drop the cursor).
  var TYPE = {
    answer: function (el) { S.answers[el.getAttribute("data-key")] = el.value; },
    note: function (el) { var n = S.notes[el.getAttribute("data-key")] || { ok: false }; n.text = el.value; S.notes[el.getAttribute("data-key")] = n; },
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
  document.addEventListener("input", function (e) {
    var el = e.target.closest("[data-change]");
    if (el && TYPE[el.getAttribute("data-change")]) TYPE[el.getAttribute("data-change")](el);
  });
  document.addEventListener("change", function (e) {
    var el = e.target.closest("[data-change]");
    if (!el || !CHANGE[el.getAttribute("data-change")]) return;
    CHANGE[el.getAttribute("data-change")](el);
    render();
  });
  document.addEventListener("keydown", function (e) {
    if (S.tab !== "how" || /TEXTAREA|INPUT|SELECT/.test(e.target.tagName)) return;
    if (e.key === "ArrowRight") { goStep(1); render(); }
    if (e.key === "ArrowLeft") { goStep(-1); render(); }
  });
  window.addEventListener("resize", function () { if (S.tab === "how") drawWires(); });

  S = fresh();
  render();
})();
