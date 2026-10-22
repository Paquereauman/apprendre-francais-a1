<?php
// Sauvegarde de progression : 1 fichier JSON par code secret + copies de sécurité horodatées.
header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-store");
// Espace de noms optionnel (?app=fr) : l'appli de français a ses propres profils et son propre classement.
// Sans ?app, le comportement est identique à l'ancienne version (appli chinoise).
$app = preg_match("/^[a-z]{2,8}$/", $_GET["app"] ?? "") ? $_GET["app"] : "";
$base = "/var/lib/chinois" . ($app ? "/$app" : "");
if ($app && !is_dir("$base/bak")) { @mkdir("$base/bak", 0700, true); }
/* anti-aspiration : au plus 240 requêtes par minute et par adresse IP (le salon interroge ~40 fois/min) */
(function () {
  $ip = $_SERVER["REMOTE_ADDR"] ?? "0"; $dir = "/var/lib/chinois/rl"; if (!is_dir($dir)) { @mkdir($dir, 0700, true); }
  $f = "$dir/" . md5($ip) . ".json"; $now = time(); $win = intdiv($now, 60); $st = is_file($f) ? json_decode(@file_get_contents($f), true) : null;
  if (!is_array($st) || ($st["w"] ?? 0) !== $win) { $st = ["w" => $win, "n" => 0]; }
  $st["n"]++; @file_put_contents($f, json_encode($st), LOCK_EX);
  if ($st["n"] > 240) { http_response_code(429); header("Retry-After: 60"); echo "{\"error\":\"rate\"}"; exit; }
  if (mt_rand(1, 400) === 1) { foreach (glob("$dir/*.json") ?: [] as $o) { if ($now - filemtime($o) > 600) { @unlink($o); } } }
})();
$k = $_GET["k"] ?? "";
if (isset($_GET["rank"])) { rank_main($k, $base, $app); exit; }
if (isset($_GET["admin"])) { admin_main($k, $base, $app); exit; }
if (isset($_GET["room"])) { room_main($k, $base); exit; }
if (isset($_GET["msg"])) { msg_main($k, $base, $app); exit; }
if (isset($_GET["report"])) { report_main($k, $base); exit; }
if (isset($_GET["forum"])) { forum_main($k, $base); exit; }
if (isset($_GET["gram"])) { gram_main($k, $base); exit; }
if (isset($_GET["team"])) { team_main($k, $base); exit; }
if (isset($_GET["donate"])) { donate_main($k, $base); exit; }
if (isset($_GET["accpos"])) { accpos_main($k, $base); exit; }
if (isset($_GET["classes"])) {
  $adm0 = admin_load($base); $o = ["app" => $app, "classes" => [], "teachers" => []];
  $tm = is_file("$base/team.json") ? json_decode(@file_get_contents("$base/team.json"), true) : []; if (!is_array($tm)) { $tm = []; }
  foreach ($adm0 as $ai => $ah) { if ($ai !== 0 && !(isset($tm[$ah]) && (int)($tm[$ah]["show"] ?? 1))) continue; $au = is_file("$base/users/$ah.json") ? json_decode(@file_get_contents("$base/users/$ah.json"), true) : null; if (!is_array($au)) continue;
    $o["teachers"][] = ["id" => substr($ah, 0, 12), "name" => (string)($au["name"] ?? "?"), "role" => (string)($tm[$ah]["role"] ?? "")]; }
  $own0 = $adm0 ? substr($adm0[0], 0, 12) : "";
  foreach (classes_load($base) as $c) { $c["owner"] = isset($c["owner"]) ? substr((string)$c["owner"], 0, 12) : $own0; $o["classes"][] = $c; }
  if (preg_match("/^[a-z0-9]{8,40}$/", $k)) {
    $uf = "$base/users/" . hash("sha256", $k) . ".json";
    $u = is_file($uf) ? json_decode(@file_get_contents($uf), true) : null;
    if (is_array($u) && array_key_exists("cls", $u)) { $o["mine"] = (string)$u["cls"]; }
  }
  echo json_encode($o, JSON_UNESCAPED_UNICODE); exit;
}
if (isset($_GET["setcls"])) { self_setcls($k, $base, $app); exit; }
if (isset($_GET["email"])) { email_main($k, $base, $app); exit; }
if (isset($_GET["recover"])) { recover_main($base, $app); exit; }
if (isset($_GET["avail"])) { echo json_encode(["free" => ($app !== "" ? name_free($base, clean_name($_GET["n"] ?? "", 20), "") : true)]); exit; }
if (isset($_GET["quiz"])) { quiz_main($k, $base, $app); exit; }
if (!preg_match("/^[a-z0-9]{8,40}$/", $k)) { http_response_code(400); echo "{\"error\":\"bad key\"}"; exit; }
$h = hash("sha256", $k);
$f = "$base/$h.json";
if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $b = file_get_contents("php://input", false, null, 0, 300001);
  if (strlen($b) > 300000 || !is_array(json_decode($b, true))) { http_response_code(400); echo "{\"error\":\"bad body\"}"; exit; }
  // un nom de compte ne peut être pris que par une seule personne (vérifié à la création du profil)
  $n0 = clean_name($_GET["n"] ?? "", 20);
  if ($app !== "" && $n0 !== "" && !is_file("$base/users/$h.json") && !name_free($base, $n0, $h)) { http_response_code(409); echo "{\"error\":\"name taken\"}"; exit; }
  // copie de sécurité de la version précédente (au plus 1 toutes les 10 min, 40 gardées)
  if (is_file($f)) {
    $dir = "$base/bak"; $last = glob("$dir/{$h}_*.json"); sort($last);
    if (!$last || filemtime(end($last)) < time() - 600) {
      copy($f, "$dir/{$h}_" . date("Ymd_His") . ".json");
      $last = glob("$dir/{$h}_*.json"); sort($last);
      while (count($last) > 40) { unlink(array_shift($last)); }
    }
  }
  file_put_contents($f, $b, LOCK_EX);
  $n = clean_name($_GET["n"] ?? "", 20);
  if ($app && $n !== "") {
    $ud = "$base/users"; if (!is_dir($ud)) { @mkdir($ud, 0700, true); }
    $prev = is_file("$ud/$h.json") ? json_decode(@file_get_contents("$ud/$h.json"), true) : null; if (!is_array($prev)) { $prev = []; }
    $cls = array_key_exists("cls", $prev) ? (string)$prev["cls"] : "";
    if (!array_key_exists("cls", $prev)) { $c = preg_replace("/[^a-z0-9]/", "", (string)($_GET["c"] ?? "")); if ($c !== "" && class_exists_in($base, $c)) { $cls = $c; } }
    file_put_contents("$ud/$h.json", json_encode(["name" => $n, "ts" => time(), "cls" => $cls], JSON_UNESCAPED_UNICODE), LOCK_EX);
  }
  echo "{\"ok\":true}";
} else {
  echo is_file($f) ? file_get_contents($f) : "null";
}

// Classement : opt-in (nom public). Les stats sont lues dans le fichier de progression, jamais envoyées par le client.
function rank_main($k, $base, $app) {
  $dir = "$base/rank"; if (!is_dir($dir)) { @mkdir($dir, 0700, true); }
  $kok = preg_match("/^[a-z0-9]{8,40}$/", $k); $h = $kok ? hash("sha256", $k) : "";
  if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (!$kok || !is_file("$base/$h.json")) { http_response_code(400); echo "{\"error\":\"no profile\"}"; exit; }
    $b = json_decode(file_get_contents("php://input", false, null, 0, 2001), true);
    if (!is_array($b)) { http_response_code(400); echo "{\"error\":\"bad body\"}"; exit; }
    if ($app !== "") {
      $ro = "$base/rankout"; if (!is_dir($ro)) { @mkdir($ro, 0700, true); }
      if (!empty($b["leave"])) { file_put_contents("$ro/$h", "1"); echo "{\"ok\":true,\"left\":true}"; exit; }
      @unlink("$ro/$h"); echo "{\"ok\":true}"; exit;
    }
    if (!empty($b["leave"])) { @unlink("$dir/$h.json"); echo "{\"ok\":true,\"left\":true}"; exit; }
    $name = trim(preg_replace("/[^\p{L}\p{N} _.\-]/u", "", (string)($b["name"] ?? "")));
    $name = mb_substr($name, 0, 20);
    if (mb_strlen($name) < 2) { http_response_code(400); echo "{\"error\":\"bad name\"}"; exit; }
    file_put_contents("$dir/$h.json", json_encode(["name" => $name, "ts" => time()], JSON_UNESCAPED_UNICODE), LOCK_EX);
    echo "{\"ok\":true}"; exit;
  }
  $out = []; $me = false; $yday = date("Y-m-d", time() - 86400); $ym = cur_ym(); $ymp = cur_ym(-1);
  $src = []; $adminsR = admin_load($base);
  if ($app !== "") {
    foreach (array_slice(glob("$base/users/*.json") ?: [], 0, 500) as $uf) {
      $uid = basename($uf, ".json"); if (!preg_match("/^[a-f0-9]{64}$/", $uid) || is_file("$base/rankout/$uid")) continue;
      $u = json_decode(@file_get_contents($uf), true); if (is_array($u)) { $src[] = [$uid, (string)($u["name"] ?? "?"), (string)($u["cls"] ?? "")]; }
    }
  } else {
    foreach (array_slice(glob("$dir/*.json") ?: [], 0, 300) as $rf) {
      $rid = basename($rf, ".json"); $r0 = json_decode(@file_get_contents($rf), true);
      if (is_array($r0)) { $src[] = [$rid, (string)($r0["name"] ?? "?"), ""]; }
    }
  }
  foreach ($src as $it) {
    list($id, $rname, $rcls) = $it; $pf = "$base/$id.json";
    if (!is_file($pf)) continue;
    $S = json_decode(@file_get_contents($pf), true); if (!is_array($S)) continue;
    $words = 0; foreach (($S["known"] ?? []) as $a) { if (is_array($a)) $words += count($a); }
    $streak = (int)($S["streak"] ?? 0); if (($S["last"] ?? "") < $yday) $streak = 0;
    $av = []; foreach (($S["av"] ?? []) as $ak => $av_v) { if (!is_string($ak) || !preg_match("/^[a-zA-Z]{2,8}$/", $ak) || count($av) >= 30) continue; if (is_int($av_v) && $av_v >= 0 && $av_v < 100) $av[$ak] = $av_v; elseif (is_string($av_v) && preg_match("/^#[0-9a-fA-F]{6}$/", $av_v)) $av[$ak] = $av_v; }
    $qr = ($app !== "") ? qres_load($base, $id) : null;
    list($pts, $chp) = $qr ? res_points($qr) : [0, 0];
    $lts = 0; if ($qr) { foreach ($qr["res"] as $e0) { $lts = max($lts, (int)($e0["ts"] ?? 0)); } }
    list($mpts, $mts) = $qr ? month_pts($qr["hist"], $ym) : [0, 0];
    list($ppts, $pts2) = $qr ? month_pts($qr["hist"], $ymp) : [0, 0];
    $isme = ($id === $h); if ($isme) $me = true;
    $out[] = ["name" => (($nk = clean_name($S["nick"] ?? "", 20)) !== "" ? $nk : $rname), "cls" => $rcls, "login" => $rname, "adm" => (in_array($id, $adminsR, true) && ($S["admshow"] ?? true) !== false), "emo" => clean_emo($S["emo"] ?? ""), "col" => max(0, min(9, (int)($S["col"] ?? 0))), "frm" => max(0, min(4, (int)($S["frm"] ?? 0))), "ttl" => title_ok((int)($S["ttl"] ?? 0), $chp), "motto" => clean_motto($S["motto"] ?? ""), "pts" => $pts, "ch" => $chp, "lts" => $lts, "m" => $mpts, "mt" => $mts, "pm" => $ppts, "pmt" => $pts2, "xp" => (int)($S["xp"] ?? 0), "words" => $words, "streak" => $streak, "av" => $av, "me" => $isme];
  }
  $byPts = ($app !== "");
  usort($out, function ($a, $b) use ($byPts) { return $byPts ? [-$a["pts"], $a["lts"] ?: PHP_INT_MAX] <=> [-$b["pts"], $b["lts"] ?: PHP_INT_MAX] : [$b["xp"], $b["words"]] <=> [$a["xp"], $a["words"]]; });
  $win = null;
  if ($app !== "") { $c = array_filter($out, function ($u) { return $u["pm"] > 0; }); usort($c, function ($a, $b) { return [$b["pm"], $a["pmt"]] <=> [$a["pm"], $b["pmt"]]; }); if ($c) { $w = array_values($c)[0]; $win = ["ym" => $ymp, "name" => $w["name"], "emo" => $w["emo"], "pts" => $w["pm"]]; } }
  if ($app !== "" && !(preg_match("/^[a-z0-9]{8,40}$/", $k) && is_file("$base/users/" . hash("sha256", $k) . ".json"))) { $out = []; $win = null; $me = false; }   /* pas de compte : aucune donnée personnelle */
  echo json_encode(["app" => $app, "ym" => $ym, "winner" => $win, "classes" => ($app !== "" ? classes_load($base) : []), "list" => array_slice($out, 0, 300), "me" => $me, "total" => count($out)], JSON_UNESCAPED_UNICODE);
}

// ---- Messagerie entre usagers (comptes de l'appli) : conversations à deux, blocage, limite quotidienne.
function msg_uid_by_name($base, $name) {
  $n = mb_strtolower(trim((string)$name), "UTF-8"); if ($n === "") { return null; }
  foreach (glob("$base/users/*.json") ?: [] as $uf) {
    $u = json_decode(@file_get_contents($uf), true);
    if (is_array($u) && mb_strtolower(trim((string)($u["name"] ?? "")), "UTF-8") === $n) { return basename($uf, ".json"); }
  }
  return null;
}
function msg_card($base, $id) {
  $u = is_file("$base/users/$id.json") ? json_decode(@file_get_contents("$base/users/$id.json"), true) : null;
  $S = is_file("$base/$id.json") ? json_decode(@file_get_contents("$base/$id.json"), true) : null;
  $nick = is_array($S) ? clean_name($S["nick"] ?? "", 20) : "";
  $av = []; foreach ((is_array($S) ? ($S["av"] ?? []) : []) as $ak => $v) { if (!is_string($ak) || !preg_match("/^[a-zA-Z]{2,8}$/", $ak) || count($av) >= 30) continue; if (is_int($v) && $v >= 0 && $v < 100) $av[$ak] = $v; elseif (is_string($v) && preg_match("/^#[0-9a-fA-F]{6}$/", $v)) $av[$ak] = $v; }
  return ["name" => is_array($u) ? (string)($u["name"] ?? "?") : "?", "nick" => $nick, "emo" => is_array($S) ? clean_emo($S["emo"] ?? "") : "", "av" => (object)$av, "cls" => is_array($u) ? (string)($u["cls"] ?? "") : ""];
}
function msg_main($k, $base, $app) {
  if (!preg_match("/^[a-z0-9]{8,40}$/", $k)) { http_response_code(400); echo "{\"error\":\"bad key\"}"; return; }
  $h = hash("sha256", $k);
  if (!is_file("$base/users/$h.json")) { http_response_code(403); echo "{\"error\":\"no account\"}"; return; }
  $dir = "$base/msgs"; if (!is_dir($dir)) { @mkdir($dir, 0700, true); }
  $act = (string)($_GET["msg"] ?? "list");
  $bf = "$dir/block_$h.json"; $blocked = is_file($bf) ? (json_decode(@file_get_contents($bf), true) ?: []) : [];
  $tf = function ($o) use ($dir, $h) { $p = [$h, $o]; sort($p); return "$dir/" . $p[0] . "_" . $p[1] . ".json"; };
  if ($act === "list") {
    $th = []; $unread = 0;
    foreach (glob("$dir/*_*.json") ?: [] as $f) {
      $b = basename($f, ".json"); if (strpos($b, "block_") === 0 || strpos($b, "rate_") === 0 || strpos($b, $h) === false) continue;
      $pp = explode("_", $b); if (count($pp) !== 2) continue; $o = $pp[0] === $h ? $pp[1] : $pp[0]; if (in_array($o, $blocked, true)) continue;
      $T = json_decode(@file_get_contents($f), true); if (!is_array($T) || empty($T["m"])) continue;
      $rd = (int)($T["r"][$h] ?? 0); $un = 0; foreach ($T["m"] as $m) { if ($m["f"] !== $h && (int)$m["t"] > $rd) { $un++; } }
      $last = end($T["m"]); $unread += $un;
      $th[] = array_merge(msg_card($base, $o), ["last" => mb_substr($last["x"], 0, 80), "t" => (int)$last["t"], "mine" => $last["f"] === $h, "unread" => $un]);
    }
    usort($th, function ($a, $b) { return $b["t"] <=> $a["t"]; });
    echo json_encode(["threads" => $th, "unread" => $unread], JSON_UNESCAPED_UNICODE); return;
  }
  if ($act === "people") {   /* annuaire : les comptes de l'appli (nom, emoji, classe), sans soi-même */
    $o = [];
    foreach (array_slice(glob("$base/users/*.json") ?: [], 0, 500) as $uf) { $id = basename($uf, ".json"); if ($id === $h || in_array($id, $blocked, true)) continue; $o[] = msg_card($base, $id); }
    usort($o, function ($a, $b) { return strcasecmp($a["name"], $b["name"]); });
    echo json_encode(["people" => $o], JSON_UNESCAPED_UNICODE); return;
  }
  $with = msg_uid_by_name($base, $_GET["with"] ?? "");
  if ($act === "thread") {
    if (!$with) { http_response_code(404); echo "{\"error\":\"unknown\"}"; return; }
    $f = $tf($with); $T = is_file($f) ? json_decode(@file_get_contents($f), true) : null; if (!is_array($T)) { $T = ["m" => [], "r" => []]; }
    $T["r"][$h] = time(); if (is_file($f)) { file_put_contents($f, json_encode($T, JSON_UNESCAPED_UNICODE), LOCK_EX); }
    $ms = []; foreach ($T["m"] as $m) { $ms[] = ["me" => $m["f"] === $h, "t" => (int)$m["t"], "x" => $m["x"]]; }
    echo json_encode(["with" => msg_card($base, $with), "m" => $ms, "blocked" => in_array($with, $blocked, true)], JSON_UNESCAPED_UNICODE); return;
  }
  if ($_SERVER["REQUEST_METHOD"] !== "POST") { http_response_code(405); echo "{\"error\":\"post\"}"; return; }
  $b = json_decode(file_get_contents("php://input", false, null, 0, 3001), true); if (!is_array($b)) { http_response_code(400); echo "{\"error\":\"bad body\"}"; return; }
  if ($act === "classsend") {   /* message à toute une classe : réservé à l'administrateur propriétaire de la classe */
    $adm0 = admin_load($base); if (!in_array($h, $adm0, true)) { http_response_code(403); echo "{\"error\":\"admin only\"}"; return; }
    $cid = preg_replace("/[^a-z0-9]/", "", (string)($b["cls"] ?? "")); $ok = false;
    foreach (classes_load($base) as $c0) { if ($c0["id"] === $cid) { $ow = isset($c0["owner"]) ? (string)$c0["owner"] : (string)($adm0[0] ?? ""); $ok = ($ow === $h); } }
    if (!$ok || $cid === "") { http_response_code(403); echo "{\"error\":\"not your class\"}"; return; }
    $x = mb_substr(trim(preg_replace('/[\x00-\x08\x0b\x0c\x0e-\x1f<>]/u', " ", (string)($b["text"] ?? ""))), 0, 500);
    if ($x === "") { http_response_code(400); echo "{\"error\":\"empty\"}"; return; }
    $rf = "$dir/rate_$h.json"; $now = time(); $rt = is_file($rf) ? (json_decode(@file_get_contents($rf), true) ?: []) : [];
    $rt = array_values(array_filter($rt, function ($t) use ($now) { return $now - (int)$t < 86400; }));
    if (count($rt) >= 60) { http_response_code(429); echo "{\"error\":\"limit\"}"; return; }
    $rt[] = $now; file_put_contents($rf, json_encode($rt), LOCK_EX);
    $n = 0;
    foreach (array_slice(glob("$base/users/*.json") ?: [], 0, 500) as $uf) {
      $id = basename($uf, ".json"); if (!preg_match("/^[a-f0-9]{64}$/", $id) || $id === $h) continue;
      $uu = json_decode(@file_get_contents($uf), true); if (!is_array($uu) || (string)($uu["cls"] ?? "") !== $cid) continue;
      $ob = "$dir/block_$id.json"; $obl = is_file($ob) ? (json_decode(@file_get_contents($ob), true) ?: []) : []; if (in_array($h, $obl, true)) continue;
      $f = $tf($id); $fp = fopen($f, "c+"); if (!$fp) continue;
      flock($fp, LOCK_EX); $T = json_decode(stream_get_contents($fp), true); if (!is_array($T)) { $T = ["m" => [], "r" => []]; }
      $T["m"][] = ["f" => $h, "t" => $now, "x" => $x]; if (count($T["m"]) > 200) { $T["m"] = array_slice($T["m"], -200); } $T["r"][$h] = $now;
      ftruncate($fp, 0); rewind($fp); fwrite($fp, json_encode($T, JSON_UNESCAPED_UNICODE)); fflush($fp); flock($fp, LOCK_UN); fclose($fp); $n++;
    }
    echo json_encode(["ok" => true, "n" => $n]); return;
  }
  $to = msg_uid_by_name($base, $b["to"] ?? "");
  if (!$to || $to === $h) { http_response_code(404); echo "{\"error\":\"unknown\"}"; return; }
  if ($act === "block") {
    $blocked = array_values(array_diff($blocked, [$to])); if (!empty($b["on"])) { $blocked[] = $to; }
    file_put_contents($bf, json_encode(array_values(array_unique($blocked))), LOCK_EX); echo "{\"ok\":true}"; return;
  }
  if ($act !== "send") { http_response_code(400); echo "{\"error\":\"bad action\"}"; return; }
  $x = mb_substr(trim(preg_replace('/[\x00-\x08\x0b\x0c\x0e-\x1f<>]/u', " ", (string)($b["text"] ?? ""))), 0, 500);
  if ($x === "") { http_response_code(400); echo "{\"error\":\"empty\"}"; return; }
  $ob = "$dir/block_$to.json"; $oblocked = is_file($ob) ? (json_decode(@file_get_contents($ob), true) ?: []) : [];
  if (in_array($h, $oblocked, true) || in_array($to, $blocked, true)) { http_response_code(403); echo "{\"error\":\"blocked\"}"; return; }
  $rf = "$dir/rate_$h.json"; $now = time(); $rt = is_file($rf) ? (json_decode(@file_get_contents($rf), true) ?: []) : [];
  $rt = array_values(array_filter($rt, function ($t) use ($now) { return $now - (int)$t < 86400; }));
  if (count($rt) >= 60) { http_response_code(429); echo "{\"error\":\"limit\"}"; return; }
  $rt[] = $now; file_put_contents($rf, json_encode($rt), LOCK_EX);
  $f = $tf($to); $fp = fopen($f, "c+"); if (!$fp) { http_response_code(500); echo "{\"error\":\"io\"}"; return; }
  flock($fp, LOCK_EX); $T = json_decode(stream_get_contents($fp), true); if (!is_array($T)) { $T = ["m" => [], "r" => []]; }
  $T["m"][] = ["f" => $h, "t" => $now, "x" => $x]; if (count($T["m"]) > 200) { $T["m"] = array_slice($T["m"], -200); } $T["r"][$h] = $now;
  ftruncate($fp, 0); rewind($fp); fwrite($fp, json_encode($T, JSON_UNESCAPED_UNICODE)); fflush($fp); flock($fp, LOCK_UN); fclose($fp);
  echo "{\"ok\":true}";
}
// ---- Salon : pièce vue du dessus, présence et position des usagers connectés (interrogation régulière, sans serveur temps réel).
function room_main($k, $base) {
  if (!preg_match("/^[a-z0-9]{8,40}$/", $k)) { http_response_code(400); echo "{\"error\":\"bad key\"}"; return; }
  $h = hash("sha256", $k); $uf = "$base/users/$h.json";
  if (!is_file($uf)) { http_response_code(403); echo "{\"error\":\"no account\"}"; return; }
  $dir = "$base/room"; if (!is_dir($dir)) { @mkdir($dir, 0700, true); }
  $now = time(); $mine = "$dir/$h.json";
  if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $b = json_decode(file_get_contents("php://input", false, null, 0, 1001), true); if (!is_array($b)) { http_response_code(400); echo "{\"error\":\"bad body\"}"; return; }
    $P = is_file($mine) ? (json_decode(@file_get_contents($mine), true) ?: []) : [];
    if (isset($b["x"], $b["y"])) { $P["x"] = max(0, min(15, (int)$b["x"])); $P["y"] = max(0, min(9, (int)$b["y"])); $P["sit"] = !empty($b["sit"]) ? 1 : 0; }
    if (isset($b["say"])) { $say = mb_substr(trim(preg_replace('/[\x00-\x1f<>]/u', " ", (string)$b["say"])), 0, 70); if ($say !== "") { $P["say"] = $say; $P["st"] = $now; } }
    $P["x"] = $P["x"] ?? 7; $P["y"] = $P["y"] ?? 6; $P["t"] = $now;
    file_put_contents($mine, json_encode($P, JSON_UNESCAPED_UNICODE), LOCK_EX); echo "{\"ok\":true}"; return;
  }
  $users = []; $adminsRm = admin_load($base);
  foreach (glob("$dir/*.json") ?: [] as $f) {
    $age = $now - filemtime($f);
    if ($age > 25) { if ($age > 3600) { @unlink($f); } continue; }
    $id = basename($f, ".json"); $P = json_decode(@file_get_contents($f), true); if (!is_array($P) || $now - (int)($P["t"] ?? 0) > 25) continue;
    $card = msg_card($base, $id); $S = is_file("$base/$id.json") ? json_decode(@file_get_contents("$base/$id.json"), true) : null;
    $av = []; foreach ((is_array($S) ? ($S["av"] ?? []) : []) as $ak => $v) { if (!is_string($ak) || !preg_match("/^[a-zA-Z]{2,8}$/", $ak) || count($av) >= 30) continue; if (is_int($v) && $v >= 0 && $v < 100) $av[$ak] = $v; elseif (is_string($v) && preg_match("/^#[0-9a-fA-F]{6}$/", $v)) $av[$ak] = $v; }
    $users[] = ["me" => $id === $h, "name" => $card["name"], "nick" => $card["nick"], "emo" => $card["emo"], "av" => $av, "adm" => (in_array($id, $adminsRm, true) && (!is_array($S) || ($S["admshow"] ?? true) !== false)), "x" => (int)$P["x"], "y" => (int)$P["y"], "sit" => !empty($P["sit"]), "say" => (isset($P["st"]) && $now - (int)$P["st"] < 8) ? (string)$P["say"] : "", "st" => (int)($P["st"] ?? 0)];
    if (count($users) >= 40) break;
  }
  echo json_encode(["users" => $users, "now" => $now], JSON_UNESCAPED_UNICODE);
}
// ---- Signalements : un élève connecté signale un mot ou un élément qui ne va pas ; les administrateurs les traitent.
function report_main($k, $base) {
  if ($_SERVER["REQUEST_METHOD"] !== "POST" || !preg_match("/^[a-z0-9]{8,40}$/", $k)) { http_response_code(400); echo "{\"error\":\"bad request\"}"; return; }
  $h = hash("sha256", $k); $uf = "$base/users/$h.json";
  if (!is_file($uf)) { http_response_code(403); echo "{\"error\":\"no account\"}"; return; }
  $b = json_decode(file_get_contents("php://input", false, null, 0, 2001), true); if (!is_array($b)) { http_response_code(400); echo "{\"error\":\"bad body\"}"; return; }
  $u = json_decode(@file_get_contents($uf), true);
  $cl = function ($x, $n) { return mb_substr(trim(preg_replace('/[\x00-\x08\x0b\x0c\x0e-\x1f<>]/u', " ", (string)$x)), 0, $n); };
  $item = $cl($b["item"] ?? "", 80); if ($item === "") { http_response_code(400); echo "{\"error\":\"empty\"}"; return; }
  $f = "$base/reports.json"; $fp = fopen($f, "c+"); if (!$fp) { http_response_code(500); echo "{\"error\":\"io\"}"; return; }
  flock($fp, LOCK_EX); $R = json_decode(stream_get_contents($fp), true); if (!is_array($R)) { $R = []; }
  $now = time(); $mine = 0; foreach ($R as $r) { if (($r["uid"] ?? "") === $h && $now - (int)$r["ts"] < 86400) { $mine++; } }
  if ($mine >= 10) { flock($fp, LOCK_UN); fclose($fp); http_response_code(429); echo "{\"error\":\"limit\"}"; return; }
  $R[] = ["id" => bin2hex(random_bytes(6)), "ts" => $now, "uid" => $h, "by" => (string)($u["name"] ?? "?"), "item" => $item, "where" => $cl($b["where"] ?? "", 80), "note" => $cl($b["note"] ?? "", 300)];
  if (count($R) > 500) { $R = array_slice($R, -500); }
  ftruncate($fp, 0); rewind($fp); fwrite($fp, json_encode($R, JSON_UNESCAPED_UNICODE)); fflush($fp); flock($fp, LOCK_UN); fclose($fp);
  echo "{\"ok\":true}";
}
// ---- Communauté : forum, fiches de grammaire, équipe. Stockage : $base/forum/, $base/gram.json, $base/team.json. Ne touche à aucune donnée d'élève (progression, classement, temps). ----
function cm_clean($s, $n) { return mb_substr(trim(preg_replace('/[\x00-\x08\x0b\x0c\x0e-\x1f]/u', " ", str_replace("\r", "", (string)$s))), 0, $n); }
function cm_read($f, $d) { $a = is_file($f) ? json_decode(@file_get_contents($f), true) : null; return is_array($a) ? $a : $d; }
function cm_write($f, $v) { file_put_contents($f, json_encode($v, JSON_UNESCAPED_UNICODE), LOCK_EX); }
function cm_av($a) {
  if (!is_array($a)) return null; $o = []; $i = 0;
  foreach ($a as $k => $v) { if (++$i > 40) break; if (preg_match('/^[A-Za-z0-9_]{1,8}$/', (string)$k) && (is_int($v) || is_float($v) || (is_string($v) && preg_match('/^#?[0-9a-fA-F]{1,8}$/', $v)))) { $o[$k] = $v; } }
  return $o ?: null;
}
function cm_me($k, $base) {   /* identité : compte existant uniquement ; admin = profil listé dans admins.json */
  if (!preg_match("/^[a-z0-9]{8,40}$/", $k)) return null;
  $h = hash("sha256", $k); $uf = "$base/users/$h.json"; if (!is_file($uf)) return null;
  $u = json_decode(@file_get_contents($uf), true); if (!is_array($u)) return null;
  return ["h" => $h, "uf" => $uf, "u" => $u, "name" => (string)($u["name"] ?? "?"), "adm" => in_array($h, admin_load($base), true)];
}
function cm_meta($t, $h) {
  return ["id" => $t["id"], "title" => $t["title"], "cat" => $t["cat"], "lvl" => $t["lvl"], "st" => $t["st"], "pin" => (int)($t["pin"] ?? 0), "lock" => (int)($t["lock"] ?? 0), "by" => $t["by"], "av" => $t["av"] ?? null,
    "adm" => (int)($t["adm"] ?? 0), "ts" => (int)$t["ts"], "last" => (int)$t["last"], "n" => (int)$t["n"], "votes" => count($t["v"] ?? []), "voted" => in_array($h, $t["v"] ?? [], true), "ex" => mb_substr($t["body"], 0, 160), "mine" => $t["uid"] === $h];
}
function forum_main($k, $base) {
  $act = (string)($_GET["forum"] ?? "list"); $me = cm_me($k, $base);
  if (!$me) { http_response_code(403); echo "{\"error\":\"no account\"}"; return; }
  $h = $me["h"]; $adm = $me["adm"]; $now = time(); $dir = "$base/forum"; if (!is_dir($dir)) { @mkdir($dir, 0700, true); }
  $IF = "$dir/index.json"; $CATS = ["ann", "sug", "bug", "help", "cours", "free"]; $LVLS = ["all", "A1", "A2", "B1"]; $STS = ["open", "review", "doing", "done", "no"];
  $meo = ["name" => $me["name"], "adm" => $adm, "rules" => (int)($me["u"]["forum_rules"] ?? 0)];
  $fp = fopen($IF, "c+"); if (!$fp) { http_response_code(500); echo "{\"error\":\"io\"}"; return; }
  flock($fp, $act === "list" || $act === "thread" || $act === "badge" ? LOCK_SH : LOCK_EX);
  $idx = json_decode(stream_get_contents($fp), true); if (!is_array($idx)) { $idx = []; }
  $save = function () use ($fp, &$idx) { ftruncate($fp, 0); rewind($fp); fwrite($fp, json_encode(array_values($idx), JSON_UNESCAPED_UNICODE)); fflush($fp); };
  $done = function ($code, $o) use ($fp) { flock($fp, LOCK_UN); fclose($fp); http_response_code($code); echo json_encode($o, JSON_UNESCAPED_UNICODE); };
  $g = function ($n, $d = "") { return (string)($_GET[$n] ?? $d); };
  if ($act === "list") {
    $cat = $g("cat"); $lvl = $g("lvl"); $st = $g("st"); $sort = $g("sort", "act"); $q = mb_strtolower($g("q")); $mine = $g("mine"); $L = [];
    foreach ($idx as $t) {
      if ($cat !== "" && $t["cat"] !== $cat) continue; if ($lvl !== "" && $t["lvl"] !== $lvl && $t["lvl"] !== "all") continue;
      if ($st === "open" && !in_array($t["st"], ["open", "review", "doing"], true)) continue; if ($st !== "" && $st !== "open" && $t["st"] !== $st) continue;
      if ($mine === "1" && $t["uid"] !== $h) continue; if ($q !== "" && mb_strpos(mb_strtolower($t["title"] . " " . $t["body"]), $q) === false) continue;
      if ($sort === "unans" && (int)$t["n"] !== 0) continue; $L[] = $t;
    }
    usort($L, function ($a, $b) use ($sort) { $p = (int)($b["pin"] ?? 0) <=> (int)($a["pin"] ?? 0); if ($p) return $p;
      if ($sort === "new" || $sort === "unans") return $b["ts"] <=> $a["ts"]; if ($sort === "votes") return count($b["v"] ?? []) <=> count($a["v"] ?? []); return $b["last"] <=> $a["last"]; });
    $off = max(0, (int)$g("off", "0")); $o = []; foreach (array_slice($L, $off, 20) as $t) { $o[] = cm_meta($t, $h); }
    $done(200, ["threads" => $o, "total" => count($L), "me" => $meo]); return;
  }
  if ($act === "badge") { $since = (int)$g("since", "0"); $n = 0; foreach ($idx as $t) { if ((int)$t["last"] > $since && ($t["lastby"] ?? "") !== $h) $n++; } $done(200, ["n" => $n]); return; }
  if ($act === "thread") {
    $id = preg_replace("/[^a-f0-9]/", "", $g("id")); $t = null; foreach ($idx as $x) { if ($x["id"] === $id) { $t = $x; break; } }
    if (!$t) { $done(404, ["error" => "none"]); return; }
    $P = cm_read("$dir/p_$id.json", []); $o = [];
    foreach ($P as $p) { $o[] = ["id" => $p["id"], "by" => $p["by"], "av" => $p["av"] ?? null, "adm" => (int)($p["adm"] ?? 0), "ts" => (int)$p["ts"], "body" => $p["body"], "votes" => count($p["v"] ?? []), "voted" => in_array($h, $p["v"] ?? [], true), "mine" => $p["uid"] === $h, "sol" => (int)($p["sol"] ?? 0)]; }
    $done(200, ["t" => array_merge(cm_meta($t, $h), ["body" => $t["body"]]), "posts" => $o, "me" => $meo]); return;
  }
  if ($_SERVER["REQUEST_METHOD"] !== "POST") { $done(400, ["error" => "post"]); return; }
  $b = json_decode(file_get_contents("php://input", false, null, 0, 20001), true); if (!is_array($b)) { $done(400, ["error" => "body"]); return; }
  if ($act === "rules") { $u = $me["u"]; $u["forum_rules"] = 1; cm_write($me["uf"], $u); $done(200, ["ok" => true]); return; }
  if ($act === "new") {
    if (!$meo["rules"]) { $done(403, ["error" => "rules"]); return; }
    $cat = cm_clean($b["cat"] ?? "", 8); $lvl = cm_clean($b["lvl"] ?? "", 4); $title = cm_clean($b["title"] ?? "", 90); $body = cm_clean($b["body"] ?? "", 4000);
    if (!in_array($cat, $CATS, true) || !in_array($lvl, $LVLS, true) || mb_strlen($title) < 4 || mb_strlen($body) < 5) { $done(400, ["error" => "invalid"]); return; }
    if ($cat === "ann" && !$adm) { $done(403, ["error" => "admin only"]); return; }
    $rc = 0; foreach ($idx as $t) { if ($t["uid"] === $h && $now - (int)$t["ts"] < 3600) $rc++; } if ($rc >= 5) { $done(429, ["error" => "limit"]); return; }
    $t = ["id" => bin2hex(random_bytes(5)), "uid" => $h, "by" => $me["name"], "adm" => $adm ? 1 : 0, "av" => cm_av($b["av"] ?? null), "title" => $title, "body" => $body, "cat" => $cat, "lvl" => $lvl, "st" => "open", "ts" => $now, "last" => $now, "lastby" => $h, "n" => 0, "v" => []];
    $idx[] = $t; if (count($idx) > 3000) { $idx = array_slice($idx, -3000); } $save(); $done(200, ["id" => $t["id"]]); return;
  }
  $id = preg_replace("/[^a-f0-9]/", "", cm_clean($b["id"] ?? "", 20)); $ti = -1; foreach ($idx as $i => $x) { if ($x["id"] === $id) { $ti = $i; break; } }
  if ($ti < 0) { $done(404, ["error" => "none"]); return; }
  $t = &$idx[$ti]; $pf = "$dir/p_$id.json"; $P = cm_read($pf, []); $pid = preg_replace("/[^a-f0-9]/", "", cm_clean($b["pid"] ?? "", 20));
  if ($act === "reply") {
    if (!$meo["rules"]) { $done(403, ["error" => "rules"]); return; }
    $body = cm_clean($b["body"] ?? "", 4000); if (mb_strlen($body) < 2) { $done(400, ["error" => "invalid"]); return; }
    if (!empty($t["lock"]) && !$adm) { $done(403, ["error" => "locked"]); return; }
    $rc = 0; foreach ($P as $p) { if ($p["uid"] === $h && $now - (int)$p["ts"] < 600) $rc++; } if ($rc >= 8) { $done(429, ["error" => "limit"]); return; }
    $P[] = ["id" => bin2hex(random_bytes(5)), "uid" => $h, "by" => $me["name"], "adm" => $adm ? 1 : 0, "av" => cm_av($b["av"] ?? null), "ts" => $now, "body" => $body, "v" => []];
    if (count($P) > 500) { $P = array_slice($P, -500); } cm_write($pf, $P); $t["n"] = count($P); $t["last"] = $now; $t["lastby"] = $h; $save(); $done(200, ["ok" => true]); return;
  }
  if ($act === "vote") {
    if ($pid !== "") { $pi = -1; foreach ($P as $i => $p) { if ($p["id"] === $pid) { $pi = $i; break; } } if ($pi < 0) { $done(404, ["error" => "none"]); return; }
      $v = $P[$pi]["v"] ?? []; $has = in_array($h, $v, true); $v = $has ? array_values(array_diff($v, [$h])) : array_merge($v, [$h]); $P[$pi]["v"] = $v; cm_write($pf, $P); $done(200, ["votes" => count($v), "voted" => !$has]); return; }
    $v = $t["v"] ?? []; $has = in_array($h, $v, true); $v = $has ? array_values(array_diff($v, [$h])) : array_merge($v, [$h]); $t["v"] = $v; $save(); $done(200, ["votes" => count($v), "voted" => !$has]); return;
  }
  if ($act === "mod") {
    $op = cm_clean($b["op"] ?? "", 12); $own = $t["uid"] === $h;
    if ($pid !== "") { foreach ($P as $p) { if ($p["id"] === $pid) { $own = $p["uid"] === $h; break; } } }
    if ($op === "del") {
      if (!$adm && !$own) { $done(403, ["error" => "forbidden"]); return; }
      if ($pid !== "") { $P = array_values(array_filter($P, function ($p) use ($pid) { return $p["id"] !== $pid; })); cm_write($pf, $P); $t["n"] = count($P); $save(); }
      else { unset($t); array_splice($idx, $ti, 1); @unlink($pf); $save(); }
      $done(200, ["ok" => true]); return;
    }
    if (!$adm) { $done(403, ["error" => "forbidden"]); return; }
    if ($op === "pin" || $op === "unpin") { $t["pin"] = $op === "pin" ? 1 : 0; }
    elseif ($op === "lock" || $op === "unlock") { $t["lock"] = $op === "lock" ? 1 : 0; }
    elseif ($op === "st" && in_array(cm_clean($b["v"] ?? "", 8), $STS, true)) { $t["st"] = cm_clean($b["v"], 8); }
    elseif ($op === "move" && in_array(cm_clean($b["cat"] ?? "", 8), $CATS, true)) { $t["cat"] = cm_clean($b["cat"], 8); if (in_array(cm_clean($b["lvl"] ?? "", 4), $LVLS, true)) { $t["lvl"] = cm_clean($b["lvl"], 4); } }
    elseif ($op === "sol" && $pid !== "") { foreach ($P as $i => $p) { $P[$i]["sol"] = ($p["id"] === $pid && empty($p["sol"])) ? 1 : 0; } cm_write($pf, $P); }
    else { $done(400, ["error" => "op"]); return; }
    $save(); $done(200, ["ok" => true]); return;
  }
  $done(400, ["error" => "act"]);
}
function gram_main($k, $base) {
  $act = (string)($_GET["gram"] ?? "list"); $f = "$base/gram.json"; $S = cm_read($f, []);
  if ($act === "list") { echo json_encode(["sheets" => array_values($S)], JSON_UNESCAPED_UNICODE); return; }   /* lecture publique */
  $me = cm_me($k, $base); if (!$me || !$me["adm"]) { http_response_code(403); echo "{\"error\":\"admin only\"}"; return; }
  $b = json_decode(file_get_contents("php://input", false, null, 0, 2000001), true); if ($_SERVER["REQUEST_METHOD"] !== "POST" || !is_array($b)) { http_response_code(400); echo "{\"error\":\"body\"}"; return; }
  if ($act === "save") {
    $s = is_array($b["sheet"] ?? null) ? $b["sheet"] : []; $id = preg_replace("/[^a-f0-9]/", "", cm_clean($s["id"] ?? "", 20)); if ($id === "") { $id = bin2hex(random_bytes(4)); }
    $ex = []; foreach (array_slice(is_array($s["ex"] ?? null) ? $s["ex"] : [], 0, 40) as $e) { if (is_array($e) && count($e) >= 2) { $ex[] = [cm_clean($e[0], 200), cm_clean($e[1], 200)]; } }
    $lvl = cm_clean($s["lvl"] ?? "", 4); if (!in_array($lvl, ["A1", "A2", "B1"], true)) { $lvl = "A1"; }
    $blocks = []; $tot = 0; foreach (array_slice(is_array($s["blocks"] ?? null) ? $s["blocks"] : [], 0, 60) as $bk) { if (!is_array($bk)) continue; $bt = (string)($bk["t"] ?? ""); if (!in_array($bt, ["title", "text", "ex", "tip", "img", "qz"], true)) continue; $bc = (int)($bk["c"] ?? 12); if (!in_array($bc, [3, 4, 6, 8, 12], true)) { $bc = 12; } $ba = (string)($bk["al"] ?? "l"); if (!in_array($ba, ["l", "c", "r", "j"], true)) { $ba = "l"; }
      $br = ["t" => $bt, "c" => $bc, "al" => $ba, "fr" => cm_clean($bk["fr"] ?? "", 4000), "zh" => cm_clean($bk["zh"] ?? "", 4000)];
      if ($bt === "img") { $src = is_string($bk["src"] ?? null) ? $bk["src"] : ""; if (!(strlen($src) <= 250000 && preg_match('#^data:image/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$#', $src))) continue; $tot += strlen($src); if ($tot > 1500000) break; $br["src"] = $src; }
      if (isset($bk["x"])) { $br["x"] = max(0, min(800, (int)$bk["x"])); $br["y"] = max(0, min(6000, (int)$bk["y"] ?? 0)); $br["w"] = max(40, min(800, (int)($bk["w"] ?? 720))); $br["fs"] = max(8, min(96, (int)($bk["fs"] ?? 18))); $br["b"] = !empty($bk["b"]) ? 1 : 0; $br["i"] = !empty($bk["i"]) ? 1 : 0; $cl = (string)($bk["col"] ?? ""); $br["col"] = preg_match('/^#[0-9a-fA-F]{6}$/', $cl) ? $cl : ""; $lg = (string)($bk["lg"] ?? ""); $br["lg"] = in_array($lg, ["fr", "zh"], true) ? $lg : ""; $br["pg"] = max(0, min(19, (int)($bk["pg"] ?? 0))); $br["h"] = max(0, min(3000, (int)($bk["h"] ?? 0))); $br["tx"] = cm_clean($bk["tx"] ?? "", 4000); }
      $blocks[] = $br; }
    $row = ["id" => $id, "lvl" => $lvl, "theme" => cm_clean($s["theme"] ?? "", 40) ?: "Divers", "order" => (int)($s["order"] ?? 0), "tfr" => cm_clean($s["tfr"] ?? "", 90), "tzh" => cm_clean($s["tzh"] ?? "", 90), "bfr" => cm_clean($s["bfr"] ?? "", 8000), "bzh" => cm_clean($s["bzh"] ?? "", 8000), "ex" => $ex, "blocks" => $blocks, "ts" => time()];
    if ($row["tfr"] === "") { http_response_code(400); echo "{\"error\":\"title\"}"; return; }
    $S = array_values(array_filter($S, function ($x) use ($id) { return $x["id"] !== $id; })); $S[] = $row; cm_write($f, $S); echo json_encode(["id" => $id]); return;
  }
  if ($act === "del") { $id = cm_clean($b["id"] ?? "", 20); $S = array_values(array_filter($S, function ($x) use ($id) { return $x["id"] !== $id; })); cm_write($f, $S); echo "{\"ok\":true}"; return; }
  http_response_code(400); echo "{\"error\":\"act\"}";
}
function cm_links($L) {
  $o = []; if (!is_array($L)) return $o;
  foreach (array_slice($L, 0, 4) as $x) { if (!is_array($x)) continue; $l = cm_clean($x["l"] ?? "", 24); $u = cm_clean($x["u"] ?? "", 200);
    if ($l !== "" && preg_match('#^https://[^\s<>"\']+$#', $u)) { $o[] = ["l" => $l, "u" => $u]; } }
  return $o;
}
function team_main($k, $base) {
  $act = (string)($_GET["team"] ?? "list"); $f = "$base/team.json"; $T = cm_read($f, []); $me = cm_me($k, $base);
  if ($act === "list") {
    $m = []; foreach ($T as $key => $v) { if ((int)($v["show"] ?? 1)) { $v["key"] = substr($key, 0, 8); $LS = is_file("$base/$key.json") ? json_decode(@file_get_contents("$base/$key.json"), true) : null; if (is_array($LS) && is_array($LS["av"] ?? null)) { $v["av"] = cm_av($LS["av"]); } $m[] = $v; } }
    usort($m, function ($a, $b) { return ((int)($a["ord"] ?? 999)) <=> ((int)($b["ord"] ?? 999)); });
    $mine = ($me && isset($T[$me["h"]])) ? $T[$me["h"]] : null;
    echo json_encode(["members" => $m, "me" => $mine, "adm" => (bool)($me && $me["adm"]), "canedit" => $mine !== null, "founder" => (bool)($me && substr($me["h"], 0, 8) === "095ad09e")], JSON_UNESCAPED_UNICODE); return;
  }
  if (!$me) { http_response_code(403); echo "{\"error\":\"no account\"}"; return; }
  $b = json_decode(file_get_contents("php://input", false, null, 0, 90001), true); if ($_SERVER["REQUEST_METHOD"] !== "POST" || !is_array($b)) { http_response_code(400); echo "{\"error\":\"body\"}"; return; }
  if ($act === "add" && $me["adm"]) {
    $id = msg_uid_by_name($base, $b["name"] ?? ""); if (!$id) { http_response_code(404); echo "{\"error\":\"unknown\"}"; return; }
    $u = json_decode(@file_get_contents("$base/users/$id.json"), true);
    if (!isset($T[$id])) { $T[$id] = ["name" => (string)($u["name"] ?? "?"), "role" => "", "bio" => "", "links" => [], "photo" => "", "show" => 1, "ts" => time()]; cm_write($f, $T); }
    echo "{\"ok\":true}"; return;
  }
  if ($act === "order" && substr($me["h"], 0, 8) === "095ad09e") {
    $keys = is_array($b["keys"] ?? null) ? array_slice($b["keys"], 0, 60) : []; foreach ($keys as $i => $key) { $key = substr(preg_replace("/[^a-f0-9]/", "", (string)$key), 0, 8); if (strlen($key) < 8) continue; foreach (array_keys($T) as $kk) { if (substr($kk, 0, 8) === $key) { $T[$kk]["ord"] = (int)$i; } } }
    cm_write($f, $T); echo "{\"ok\":true}"; return;
  }
  if ($act === "del" && $me["adm"]) {
    $key = preg_replace("/[^a-f0-9]/", "", (string)($b["key"] ?? "")); foreach (array_keys($T) as $kk) { if (substr($kk, 0, 8) === substr($key, 0, 8) && strlen($key) >= 8) { unset($T[$kk]); } }
    cm_write($f, $T); echo "{\"ok\":true}"; return;
  }
  if ($act === "save") {
    if (!$me["adm"] && !isset($T[$me["h"]])) { http_response_code(403); echo "{\"error\":\"not a team member\"}"; return; }
    $e = $T[$me["h"]] ?? ["photo" => ""]; $e["name"] = (($e["name"] ?? "") !== "") ? $e["name"] : $me["name"]; $e["role"] = cm_clean($b["role"] ?? "", 80); $e["bio"] = cm_clean($b["bio"] ?? "", 300);
    $e["links"] = cm_links($b["links"] ?? []); $e["show"] = (($b["show"] ?? true) === false) ? 0 : 1; $e["av"] = cm_av($b["av"] ?? null); $e["ts"] = time();
    if (isset($b["photo"]) && is_string($b["photo"])) {
      if ($b["photo"] === "") { $e["photo"] = ""; }
      elseif (strlen($b["photo"]) <= 70000 && preg_match('#^data:image/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$#', $b["photo"])) { $e["photo"] = $b["photo"]; }
    }
    $T[$me["h"]] = $e; cm_write($f, $T); echo "{\"ok\":true}"; return;
  }
  http_response_code(400); echo "{\"error\":\"act\"}";
}

function donate_pub($D) {
  $dn = []; foreach (($D["donors"] ?? []) as $d) { $dn[] = ["n" => !empty($d["anon"]) ? "" : (string)($d["n"] ?? ""), "anon" => !empty($d["anon"]) ? 1 : 0]; }
  return ["methods" => $D["methods"] ?? [], "costs" => $D["costs"] ?? [], "note" => (string)($D["note"] ?? ""), "donors" => $dn];
}
function donate_main($k, $base) {
  $act = (string)($_GET["donate"] ?? "get"); $f = "$base/donate.json"; $D = cm_read($f, []);
  $me = cm_me($k, $base);
  if ($act === "get") { echo json_encode(array_merge(donate_pub($D), ["adm" => (bool)($me && $me["adm"])]), JSON_UNESCAPED_UNICODE); return; }
  if (!$me || !$me["adm"]) { http_response_code(403); echo "{\"error\":\"admin only\"}"; return; }
  $b = json_decode(file_get_contents("php://input", false, null, 0, 400001), true); if ($_SERVER["REQUEST_METHOD"] !== "POST" || !is_array($b)) { http_response_code(400); echo "{\"error\":\"body\"}"; return; }
  if ($act === "save") {
    $ms = [];
    foreach (array_slice(is_array($b["methods"] ?? null) ? $b["methods"] : [], 0, 6) as $x) {
      if (!is_array($x)) continue; $t = cm_clean($x["t"] ?? "", 8); if (!in_array($t, ["stripe", "paypal", "wechat", "alipay", "other"], true)) { $t = "other"; }
      $u = cm_clean($x["u"] ?? "", 300); if ($u !== "" && !preg_match('#^https://[^\s<>"\']+$#', $u)) { $u = ""; }
      $qr = is_string($x["qr"] ?? null) ? $x["qr"] : ""; if ($qr !== "" && !(strlen($qr) <= 90000 && preg_match('#^data:image/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$#', $qr))) { $qr = ""; }
      if ($u !== "" || $qr !== "") { $ms[] = ["t" => $t, "l" => cm_clean($x["l"] ?? "", 40) ?: $t, "u" => $u, "qr" => $qr]; }
    }
    $cs = []; foreach (array_slice(is_array($b["costs"] ?? null) ? $b["costs"] : [], 0, 8) as $c) { if (is_array($c) && cm_clean($c["l"] ?? "", 40) !== "") { $cs[] = ["l" => cm_clean($c["l"], 40), "a" => cm_clean($c["a"] ?? "", 20)]; } }
    $D["methods"] = $ms; $D["costs"] = $cs; $D["note"] = cm_clean($b["note"] ?? "", 400); cm_write($f, $D); echo "{\"ok\":true}"; return;
  }
  if ($act === "adddonor") { $n = cm_clean($b["name"] ?? "", 30); if (mb_strlen($n) < 2) { http_response_code(400); echo "{\"error\":\"name\"}"; return; }
    $D["donors"][] = ["n" => $n, "anon" => !empty($b["anon"]) ? 1 : 0, "ts" => time()]; cm_write($f, $D); echo "{\"ok\":true}"; return; }
  if ($act === "deldonor") { $i = (int)($b["i"] ?? -1); $L = $D["donors"] ?? []; if ($i >= 0 && $i < count($L)) { array_splice($L, $i, 1); $D["donors"] = $L; cm_write($f, $D); } echo "{\"ok\":true}"; return; }
  http_response_code(400); echo "{\"error\":\"act\"}";
}

// ---- E-mail de récupération : relier une adresse à son compte, recevoir un code pour changer son mot de passe. ----
// Envoi via une API (Brevo ou Resend) configurée par le fondateur (clé stockée côté serveur, jamais renvoyée au navigateur).
function email_cfg($base) { $f = "$base/mail.json"; $c = is_file($f) ? json_decode(@file_get_contents($f), true) : null; return (is_array($c) && !empty($c["from"]) && (!empty($c["key"]) || ($c["provider"] ?? "") === "local")) ? $c : null; }
function email_ok($e) { return (bool)preg_match('/^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/', $e) && strlen($e) <= 120; }
function email_mask($e) { $p = explode("@", $e, 2); if (count($p) < 2) return ""; $l = $p[0]; return mb_substr($l, 0, 1) . str_repeat("*", max(2, min(6, mb_strlen($l) - 1))) . "@" . $p[1]; }
function email_send($base, $to, $subject, $html, $text) {
  $c = email_cfg($base); if (!$c || !email_ok($to)) return false;
  $name = (string)($c["name"] ?? "Je parle baguette");
  if (($c["provider"] ?? "") === "local") {   /* e-mail envoyé par le serveur lui-même (Postfix, signé DKIM) */
    $b = "jpb" . bin2hex(random_bytes(8)); $dom = substr(strrchr($c["from"], "@"), 1);
    $h = "From: =?UTF-8?B?" . base64_encode($name) . "?= <" . $c["from"] . ">\r\nMIME-Version: 1.0\r\nMessage-ID: <" . bin2hex(random_bytes(10)) . "@" . $dom . ">\r\nAuto-Submitted: auto-generated\r\nContent-Type: multipart/alternative; boundary=\"$b\"";
    $body = "--$b\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n" . chunk_split(base64_encode($text)) . "--$b\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n" . chunk_split(base64_encode($html)) . "--$b--\r\n";
    return @mail($to, "=?UTF-8?B?" . base64_encode($subject) . "?=", $body, $h, "-f" . $c["from"]);
  }
  if (($c["provider"] ?? "brevo") === "resend") {
    $url = "https://api.resend.com/emails"; $hdr = ["Authorization: Bearer " . $c["key"], "Content-Type: application/json"];
    $body = ["from" => $name . " <" . $c["from"] . ">", "to" => [$to], "subject" => $subject, "html" => $html, "text" => $text];
  } else {
    $url = "https://api.brevo.com/v3/smtp/email"; $hdr = ["api-key: " . $c["key"], "Content-Type: application/json", "accept: application/json"];
    $body = ["sender" => ["name" => $name, "email" => $c["from"]], "to" => [["email" => $to]], "subject" => $subject, "htmlContent" => $html, "textContent" => $text];
  }
  $ch = curl_init($url); curl_setopt_array($ch, [CURLOPT_POST => true, CURLOPT_HTTPHEADER => $hdr, CURLOPT_POSTFIELDS => json_encode($body, JSON_UNESCAPED_UNICODE), CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 15]);
  $r = curl_exec($ch); $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE); curl_close($ch);
  return $code >= 200 && $code < 300;
}
function email_rate($base, $key, $max, $secs) {   /* limite de demandes : renvoie false si dépassée */
  $d = "$base/emailrate"; if (!is_dir($d)) { @mkdir($d, 0700, true); } $f = "$d/" . hash("sha256", $key) . ".json"; $now = time();
  $a = is_file($f) ? (json_decode(@file_get_contents($f), true) ?: []) : []; $a = array_values(array_filter($a, function ($t) use ($now, $secs) { return $now - (int)$t < $secs; }));
  if (count($a) >= $max) return false; $a[] = $now; file_put_contents($f, json_encode($a), LOCK_EX); return true;
}
function email_idx_add($base, $email, $h) { $d = "$base/emailidx"; if (!is_dir($d)) { @mkdir($d, 0700, true); } $f = "$d/" . hash("sha256", strtolower($email)) . ".json"; $a = is_file($f) ? (json_decode(@file_get_contents($f), true) ?: []) : []; if (!in_array($h, $a, true)) { $a[] = $h; } file_put_contents($f, json_encode(array_slice($a, 0, 5)), LOCK_EX); }
function email_idx_del($base, $email, $h) { $f = "$base/emailidx/" . hash("sha256", strtolower($email)) . ".json"; if (!is_file($f)) return; $a = array_values(array_diff(json_decode(@file_get_contents($f), true) ?: [], [$h])); if ($a) { file_put_contents($f, json_encode($a), LOCK_EX); } else { @unlink($f); } }
function email_main($k, $base, $app) {
  $act = (string)($_GET["email"] ?? "status"); $cfg = email_cfg($base); $H = ""; $U = null; $uf = "";
  if (preg_match("/^[a-z0-9]{8,40}$/", (string)$k)) { $H = hash("sha256", $k); $uf = "$base/users/$H.json"; $U = is_file($uf) ? json_decode(@file_get_contents($uf), true) : null; if (!is_array($U)) { $U = null; } }
  $founder = $U !== null && substr($H, 0, 8) === "095ad09e";
  if ($act === "status") { echo json_encode(["enabled" => $cfg !== null, "linked" => ($U !== null && !empty($U["email"])) ? email_mask((string)$U["email"]) : null, "founder" => $founder, "from" => $founder && $cfg ? $cfg["from"] : null, "provider" => $founder && $cfg ? ($cfg["provider"] ?? "brevo") : null]); return; }
  if ($_SERVER["REQUEST_METHOD"] !== "POST") { http_response_code(405); echo "{\"error\":\"post\"}"; return; }
  $b = json_decode(file_get_contents("php://input", false, null, 0, 2001), true); if (!is_array($b)) { http_response_code(400); echo "{\"error\":\"body\"}"; return; }
  if ($act === "cfg") {   /* configuration de l'envoi : fondateur seulement */
    if (!$founder) { http_response_code(403); echo "{\"error\":\"founder only\"}"; return; }
    $prov = in_array($b["provider"] ?? "", ["brevo", "resend", "local"], true) ? $b["provider"] : "brevo"; $from = trim((string)($b["from"] ?? "")); $key = trim((string)($b["key"] ?? ""));
    $old = email_cfg($base); if ($key === "" && $old) { $key = $old["key"]; }
    if (!email_ok($from) || ($prov !== "local" && (strlen($key) < 10 || strlen($key) > 300))) { http_response_code(400); echo "{\"error\":\"invalid\"}"; return; }
    file_put_contents("$base/mail.json", json_encode(["provider" => $prov, "from" => $from, "key" => ($prov === "local" ? "-" : $key), "name" => "Je parle baguette"]), LOCK_EX); @chmod("$base/mail.json", 0600);
    $ok = true; if (!empty($b["test"]) && email_ok((string)$b["test"])) { $ok = email_send($base, $b["test"], "Test — Je parle baguette", "<p>L'envoi d'e-mails fonctionne ✅</p><p>邮件发送正常 ✅</p>", "L'envoi d'e-mails fonctionne. 邮件发送正常。"); }
    echo json_encode(["ok" => true, "test" => $ok]); return;
  }
  if (!$cfg) { http_response_code(503); echo "{\"error\":\"disabled\"}"; return; }
  if ($act === "forgot") {   /* sans connexion : on envoie un code de récupération aux comptes reliés à cette adresse (réponse toujours identique) */
    $e = strtolower(trim((string)($b["email"] ?? ""))); $ip = (string)($_SERVER["REMOTE_ADDR"] ?? "");
    if (!email_ok($e)) { echo "{\"ok\":true}"; return; }
    if (!email_rate($base, "ip:" . $ip, 8, 3600) || !email_rate($base, "em:" . $e, 3, 3600)) { http_response_code(429); echo "{\"error\":\"limit\"}"; return; }
    $f = "$base/emailidx/" . hash("sha256", $e) . ".json"; $ids = is_file($f) ? (json_decode(@file_get_contents($f), true) ?: []) : [];
    $rd = "$base/recover"; if (!is_dir($rd)) { @mkdir($rd, 0700, true); } $al = "abcdefghjkmnpqrstuvwxyz23456789"; $lines = []; $tl = [];
    foreach (array_slice($ids, 0, 3) as $id) { if (!preg_match("/^[a-f0-9]{64}$/", $id) || !is_file("$base/users/$id.json")) continue;
      $u = json_decode(@file_get_contents("$base/users/$id.json"), true); if (!is_array($u) || strtolower((string)($u["email"] ?? "")) !== $e) continue;
      $code = ""; for ($i = 0; $i < 12; $i++) { $code .= $al[random_int(0, strlen($al) - 1)]; } file_put_contents("$rd/" . hash("sha256", $code) . ".json", json_encode(["id" => $id, "exp" => time() + 1800]), LOCK_EX);
      $cf = substr($code, 0, 4) . "-" . substr($code, 4, 4) . "-" . substr($code, 8, 4); $nm = htmlspecialchars((string)($u["name"] ?? "?"), ENT_QUOTES, "UTF-8");
      $lines[] = "<p>Compte / 用户名 : <b>$nm</b><br>Code / 代码 : <b style=\"font-size:20px;letter-spacing:2px\">$cf</b></p>"; $tl[] = "Compte / 用户名 : " . ($u["name"] ?? "?") . " — Code / 代码 : $cf"; }
    if ($lines) { email_send($base, $e, "Ton code pour changer ton mot de passe · 修改密码的代码", "<p>Bonjour ! Pour changer ton mot de passe : site → Connexion → <b>« Mot de passe oublié »</b> → nom de compte + code ci-dessous → nouveau mot de passe. Valable <b>30 minutes</b>, une seule fois.</p><p>你好！修改密码：打开网站 → 登录 → <b>「忘记密码」</b> → 输入用户名和下面的代码 → 设置新密码。<b>30分钟</b>内有效，仅限一次。</p>" . implode("", $lines) . "<p style=\"color:#888\">Si ce n'est pas toi, ignore ce message. · 如果不是你本人操作，请忽略此邮件。</p>", "Mot de passe oublié (valable 30 min) / 忘记密码（30分钟内有效）\n" . implode("\n", $tl)); }
    echo "{\"ok\":true}"; return;
  }
  if ($U === null) { http_response_code(403); echo "{\"error\":\"no account\"}"; return; }
  $pf = "$base/emailv"; if (!is_dir($pf)) { @mkdir($pf, 0700, true); } $pending = "$pf/$H.json";
  if ($act === "link") {
    $e = strtolower(trim((string)($b["email"] ?? ""))); if (!email_ok($e)) { http_response_code(400); echo "{\"error\":\"email\"}"; return; }
    if (!email_rate($base, "link:" . $H, 4, 3600)) { http_response_code(429); echo "{\"error\":\"limit\"}"; return; }
    $code = (string)random_int(100000, 999999); file_put_contents($pending, json_encode(["email" => $e, "ch" => hash("sha256", $code . $H), "exp" => time() + 900, "tries" => 0]), LOCK_EX);
    $ok = email_send($base, $e, "Ton code de vérification : $code · 验证码", "<p>Ton code pour relier cette adresse à ton compte : <b style=\"font-size:22px;letter-spacing:3px\">$code</b></p><p>用于绑定邮箱的验证码：<b style=\"font-size:22px;letter-spacing:3px\">$code</b></p><p>Valable 15 minutes. · 15分钟内有效。</p>", "Code / 验证码 : $code (15 min)");
    echo json_encode(["ok" => $ok]); return;
  }
  if ($act === "verify") {
    $p = is_file($pending) ? json_decode(@file_get_contents($pending), true) : null; $c = preg_replace("/[^0-9]/", "", (string)($b["code"] ?? ""));
    if (!is_array($p) || (int)$p["exp"] < time() || (int)$p["tries"] >= 5) { http_response_code(400); echo "{\"error\":\"expired\"}"; return; }
    if (!hash_equals($p["ch"], hash("sha256", $c . $H))) { $p["tries"] = (int)$p["tries"] + 1; file_put_contents($pending, json_encode($p), LOCK_EX); http_response_code(400); echo "{\"error\":\"code\"}"; return; }
    if (!empty($U["email"])) { email_idx_del($base, (string)$U["email"], $H); }
    $U["email"] = $p["email"]; file_put_contents($uf, json_encode($U, JSON_UNESCAPED_UNICODE), LOCK_EX); email_idx_add($base, $p["email"], $H); @unlink($pending);
    echo json_encode(["ok" => true, "linked" => email_mask($p["email"])]); return;
  }
  if ($act === "unlink") { if (!empty($U["email"])) { email_idx_del($base, (string)$U["email"], $H); unset($U["email"]); file_put_contents($uf, json_encode($U, JSON_UNESCAPED_UNICODE), LOCK_EX); } echo "{\"ok\":true}"; return; }
  http_response_code(400); echo "{\"error\":\"act\"}";
}
// ---- Administration : les administrateurs sont des profils (hash de la clé) listés dans admins.json.
// Premier administrateur : jeton de première activation (hash dans admin_setup.sha256), utilisable une seule fois.
// Classes : classes.json ; chaque compte nommé a une entrée users/<hash>.json {name, ts, cls}. cls = "" pour un élève individuel.
function admin_load($base) { $f = "$base/admins.json"; $a = is_file($f) ? json_decode(@file_get_contents($f), true) : null; return is_array($a) ? $a : []; }
function admin_save($base, $a) { file_put_contents("$base/admins.json", json_encode(array_values(array_unique($a))), LOCK_EX); }
function classes_load($base) {
  $f = "$base/classes.json"; $a = is_file($f) ? json_decode(@file_get_contents($f), true) : null;
  if (!is_array($a) || !$a) { $a = [["id" => "classe2026", "name" => "Classe 2026", "from" => "2027-01-15", "to" => "2027-03-07"]]; }
  return array_values($a);
}
function classes_save($base, $a) { file_put_contents("$base/classes.json", json_encode(array_values($a), JSON_UNESCAPED_UNICODE), LOCK_EX); }
function class_exists_in($base, $cid) { foreach (classes_load($base) as $c) { if ($c["id"] === $cid) return true; } return false; }
function user_set_cls($base, $id, $cid) {
  $uf = "$base/users/$id.json"; $u = is_file($uf) ? json_decode(@file_get_contents($uf), true) : null;
  if (!is_array($u)) return false;
  $u["cls"] = $cid; file_put_contents($uf, json_encode($u, JSON_UNESCAPED_UNICODE), LOCK_EX); return true;
}
function clean_emo($s) { $s = (string)$s; return (mb_strlen($s) <= 8 && preg_match('/^[\p{So}\p{Sk}\p{Cf}\p{Mn}\p{Mc}\x{20E3}]+$/u', $s)) ? $s : ""; }
function clean_name($s, $max) { return mb_substr(trim(preg_replace("/[^\p{L}\p{N} _.\-]/u", "", (string)$s)), 0, $max); }
function admin_main($k, $base, $app) {
  if (!preg_match("/^[a-z0-9]{8,40}$/", $k)) { http_response_code(400); echo "{\"error\":\"bad key\"}"; return; }
  $h = hash("sha256", $k); $admins = admin_load($base); $isAdmin = in_array($h, $admins, true);
  $tokf = "$base/admin_setup.sha256";
  $claimable = !$admins && is_file($tokf) && is_file("$base/$h.json");
  if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $b = json_decode(file_get_contents("php://input", false, null, 0, 2001), true);
    if (!is_array($b)) { http_response_code(400); echo "{\"error\":\"bad body\"}"; return; }
    $act = (string)($b["action"] ?? "");
    if ($act === "claim") {
      $tok = (string)($b["token"] ?? "");
      if (!$claimable || !hash_equals(trim((string)@file_get_contents($tokf)), hash("sha256", $tok))) { sleep(1); http_response_code(403); echo "{\"error\":\"denied\"}"; return; }
      admin_save($base, [$h]); @unlink($tokf); echo "{\"ok\":true}"; return;
    }
    if ($act === "reqadmin") {   /* un enseignant demande les droits admin : l'administrateur valide dans sa fenêtre Gestion */
      if (!is_file("$base/$h.json")) { http_response_code(400); echo "{\"error\":\"no profile\"}"; return; }
      $rq = "$base/adminreq"; if (!is_dir($rq)) { @mkdir($rq, 0700, true); }
      file_put_contents("$rq/$h", json_encode(["note" => mb_substr(trim(preg_replace('/[\x00-\x1f<>]/u', " ", (string)($b["note"] ?? ""))), 0, 120), "ts" => time()], JSON_UNESCAPED_UNICODE), LOCK_EX); echo "{\"ok\":true}"; return;
    }
    if (!$isAdmin) { http_response_code(403); echo "{\"error\":\"denied\"}"; return; }
    if ($act === "reportdone") {   /* traité : on retire le signalement */
      $rid = preg_replace("/[^a-f0-9]/", "", (string)($b["rid"] ?? "")); $rf = "$base/reports.json";
      $R = is_file($rf) ? json_decode(@file_get_contents($rf), true) : []; if (!is_array($R)) { $R = []; }
      $R = array_values(array_filter($R, function ($r) use ($rid) { return ($r["id"] ?? "") !== $rid; }));
      file_put_contents($rf, json_encode($R, JSON_UNESCAPED_UNICODE), LOCK_EX); echo "{\"ok\":true}"; return;
    }
    $id = (string)($b["id"] ?? "");
    if (in_array($act, ["promote", "demote", "kick", "setclass", "recovery", "denyreq"], true) && !preg_match("/^[a-f0-9]{64}$/", $id)) { http_response_code(400); echo "{\"error\":\"bad id\"}"; return; }
    $cls = classes_load($base);
    if ($act === "promote") { $admins[] = $id; admin_save($base, $admins); @unlink("$base/adminreq/$id"); }
    elseif ($act === "denyreq") { @unlink("$base/adminreq/$id"); }
    elseif ($act === "demote") {
      if (count($admins) <= 1 && $id === $admins[0]) { http_response_code(400); echo "{\"error\":\"last admin\"}"; return; }
      admin_save($base, array_diff($admins, [$id]));
    }
    elseif ($act === "recovery") {
      if (!is_file("$base/$id.json")) { http_response_code(400); echo "{\"error\":\"no profile\"}"; return; }
      $al = "abcdefghjkmnpqrstuvwxyz23456789"; $code = "";
      for ($i = 0; $i < 12; $i++) { $code .= $al[random_int(0, strlen($al) - 1)]; }
      $rd = "$base/recover"; if (!is_dir($rd)) { @mkdir($rd, 0700, true); }
      file_put_contents("$rd/" . hash("sha256", $code) . ".json", json_encode(["id" => $id, "exp" => time() + 259200]), LOCK_EX);
      echo json_encode(["ok" => true, "code" => substr($code, 0, 4) . "-" . substr($code, 4, 4) . "-" . substr($code, 8, 4), "days" => 3]); return;
    }
    elseif ($act === "kick") { if ($app !== "") { $ro = "$base/rankout"; if (!is_dir($ro)) { @mkdir($ro, 0700, true); } file_put_contents("$ro/$id", "1"); } else { @unlink("$base/rank/$id.json"); } }
    elseif ($act === "setclass") {
      $cid = preg_replace("/[^a-z0-9]/", "", (string)($b["cls"] ?? ""));
      if (($cid !== "" && !class_exists_in($base, $cid)) || !user_set_cls($base, $id, $cid)) { http_response_code(400); echo "{\"error\":\"bad class\"}"; return; }
    }
    elseif ($act === "addclass") {
      $name = clean_name($b["name"] ?? "", 30);
      if (mb_strlen($name) < 2) { http_response_code(400); echo "{\"error\":\"bad name\"}"; return; }
      $cid = substr(preg_replace("/[^a-z0-9]/", "", strtolower((string)@iconv("UTF-8", "ASCII//TRANSLIT", $name))), 0, 16);
      if ($cid === "") { $cid = "c" . time(); }
      if (class_exists_in($base, $cid)) { $cid .= substr((string)time(), -4); }
      $cls[] = ["id" => $cid, "name" => $name, "owner" => $h]; classes_save($base, $cls);
    }
    elseif ($act === "setperiod") {
      $cid = preg_replace("/[^a-z0-9]/", "", (string)($b["cls"] ?? "")); $df = (string)($b["from"] ?? ""); $dt = (string)($b["to"] ?? ""); $de = (string)($b["end"] ?? "");
      $okd = function ($d) { return $d === "" || (bool)preg_match("/^\d{4}-\d{2}-\d{2}$/", $d); };
      if (!class_exists_in($base, $cid) || !$okd($df) || !$okd($dt) || !$okd($de) || (($df === "") !== ($dt === "")) || ($df !== "" && $dt < $df) || ($de !== "" && $dt !== "" && $de < $dt)) { http_response_code(400); echo "{\"error\":\"bad period\"}"; return; }
      foreach ($cls as $i => $c) { if ($c["id"] === $cid) { if ($df === "") { unset($cls[$i]["from"], $cls[$i]["to"]); } else { $cls[$i]["from"] = $df; $cls[$i]["to"] = $dt; } if ($de === "") { unset($cls[$i]["end"]); } else { $cls[$i]["end"] = $de; } } }
      classes_save($base, $cls);
    }
    elseif ($act === "renameclass") {
      $cid = preg_replace("/[^a-z0-9]/", "", (string)($b["cls"] ?? "")); $name = clean_name($b["name"] ?? "", 30);
      if (mb_strlen($name) < 2 || !class_exists_in($base, $cid)) { http_response_code(400); echo "{\"error\":\"bad class\"}"; return; }
      foreach ($cls as $i => $c) { if ($c["id"] === $cid) { $cls[$i]["name"] = $name; } }
      classes_save($base, $cls);
    }
    elseif ($act === "delclass") {
      $cid = preg_replace("/[^a-z0-9]/", "", (string)($b["cls"] ?? ""));
      $keep = []; foreach ($cls as $c) { if ($c["id"] !== $cid) { $keep[] = $c; } }
      classes_save($base, $keep);
      foreach (glob("$base/users/*.json") ?: [] as $uf) {
        $u = json_decode(@file_get_contents($uf), true);
        if (is_array($u) && (($u["cls"] ?? "") === $cid)) { $u["cls"] = ""; file_put_contents($uf, json_encode($u, JSON_UNESCAPED_UNICODE), LOCK_EX); }
      }
    }
    else { http_response_code(400); echo "{\"error\":\"bad action\"}"; return; }
    echo "{\"ok\":true}"; return;
  }
  $out = ["admin" => $isAdmin, "claimable" => $claimable];
  if ($isAdmin) {
    $rf0 = "$base/reports.json"; $out["reports"] = is_file($rf0) ? (json_decode(@file_get_contents($rf0), true) ?: []) : [];
    $users = []; $months = [cur_ym(), cur_ym(-1), cur_ym(-2), cur_ym(-3), cur_ym(-4), cur_ym(-5)]; $mt = [];
    foreach (array_slice(glob("$base/users/*.json") ?: [], 0, 500) as $uf) {
      $id = basename($uf, ".json"); if (!preg_match("/^[a-f0-9]{64}$/", $id)) continue;
      $u = json_decode(@file_get_contents($uf), true); if (!is_array($u)) continue;
      $S = is_file("$base/$id.json") ? json_decode(@file_get_contents("$base/$id.json"), true) : null; if (!is_array($S)) $S = [];
      $kn = []; $words = 0;
      foreach (($S["known"] ?? []) as $cid => $a) { if (is_array($a) && preg_match("/^[a-z0-9_]{1,20}$/", (string)$cid)) { $kn[$cid] = count($a); $words += count($a); } }
      $best = []; foreach (($S["best"] ?? []) as $cid => $v) { if (is_numeric($v) && preg_match("/^[a-z0-9_]{1,20}$/", (string)$cid)) { $best[$cid] = (float)$v; } }
      $test = []; foreach (($S["test"] ?? []) as $cid => $v) { if (is_numeric($v) && preg_match("/^[a-z0-9_]{1,20}$/", (string)$cid)) { $test[$cid] = (float)$v; } }
      $qr = qres_load($base, $id);
      $nm = clean_name($S["nick"] ?? "", 20); if ($nm === "") { $nm = (string)($u["name"] ?? "?"); }
      foreach ($months as $ym2) { list($pp, $tt) = month_pts($qr["hist"], $ym2); if ($pp > 0) { $mt[$ym2][] = ["name" => $nm, "pts" => $pp, "ts" => $tt]; } }
      $users[] = ["id" => $id, "res" => (object)$qr["res"], "name" => (string)($u["name"] ?? "?"), "cls" => (string)($u["cls"] ?? ""), "nick" => clean_name($S["nick"] ?? "", 20), "emo" => clean_emo($S["emo"] ?? ""), "seen" => (int)($u["ts"] ?? 0), "xp" => (int)($S["xp"] ?? 0), "words" => $words,
        "known" => $kn, "best" => $best, "test" => $test, "phr" => (int)($S["phr"] ?? 0), "streak" => (int)($S["streak"] ?? 0),
        "admin" => in_array($id, $admins, true), "areq" => is_file("$base/adminreq/$id"), "rank" => ($app !== "" ? !is_file("$base/rankout/$id") : is_file("$base/rank/$id.json")), "me" => $id === $h];
    }
    usort($users, function ($a, $b) { return $b["seen"] <=> $a["seen"]; });
    $win = [];
    foreach ($months as $ym2) { $l = $mt[$ym2] ?? []; usort($l, function ($a, $b) { return [$b["pts"], $a["ts"]] <=> [$a["pts"], $b["ts"]]; }); $win[] = ["ym" => $ym2, "top" => array_slice($l, 0, 3)]; }
    $out["users"] = $users; $out["classes"] = array_map(function ($c) use ($h, $admins) { $ow = isset($c["owner"]) ? (string)$c["owner"] : (string)($admins[0] ?? ""); $c["mine"] = ($ow === $h); return $c; }, classes_load($base)); $out["winners"] = $win;
  }
  echo json_encode($out, JSON_UNESCAPED_UNICODE);
}

// ---- Un élève change lui-même sa classe (ou passe en « individuel »).
function self_setcls($k, $base, $app) {
  if (!$app || !preg_match("/^[a-z0-9]{8,40}$/", $k) || $_SERVER["REQUEST_METHOD"] !== "POST") { http_response_code(400); echo "{\"error\":\"bad request\"}"; return; }
  $h = hash("sha256", $k);
  if (!is_file("$base/$h.json")) { http_response_code(400); echo "{\"error\":\"no profile\"}"; return; }
  $b = json_decode(file_get_contents("php://input", false, null, 0, 501), true);
  $cid = preg_replace("/[^a-z0-9]/", "", (string)(is_array($b) ? ($b["cls"] ?? "") : ""));
  if ($cid !== "" && !class_exists_in($base, $cid)) { http_response_code(400); echo "{\"error\":\"bad class\"}"; return; }
  $ud = "$base/users"; if (!is_dir($ud)) { @mkdir($ud, 0700, true); }
  $uf = "$ud/$h.json"; $u = is_file($uf) ? json_decode(@file_get_contents($uf), true) : null;
  if (!is_array($u)) { $u = ["name" => "", "ts" => time()]; }
  $u["cls"] = $cid;
  $tch = preg_replace("/[^a-f0-9]/", "", (string)(is_array($b) ? ($b["tch"] ?? "") : ""));
  if ($tch !== "") { foreach (admin_load($base) as $ah) { if (substr($ah, 0, 12) === substr($tch, 0, 12)) { $u["tch"] = substr($ah, 0, 12); } } }
  file_put_contents($uf, json_encode($u, JSON_UNESCAPED_UNICODE), LOCK_EX);
  echo json_encode(["ok" => true, "cls" => $cid]);
}

// ---- Récupération de compte : un administrateur génère un code à usage unique (valable 3 jours) pour un élève ;
// l'élève choisit lui-même un nouveau mot de passe (nouvelle clé) et son profil est transféré. L'admin ne voit jamais de mot de passe.
function recover_main($base, $app) {
  if (!$app || $_SERVER["REQUEST_METHOD"] !== "POST") { http_response_code(400); echo "{\"error\":\"bad request\"}"; return; }
  $b = json_decode(file_get_contents("php://input", false, null, 0, 501), true);
  $code = strtolower(preg_replace("/[^a-zA-Z0-9]/", "", (string)(is_array($b) ? ($b["code"] ?? "") : "")));
  $nk = (string)(is_array($b) ? ($b["newk"] ?? "") : "");
  $fail = function ($m) { sleep(1); http_response_code(403); echo json_encode(["error" => $m]); };
  if (strlen($code) !== 12 || !preg_match("/^[a-z0-9]{8,40}$/", $nk)) { $fail("bad code"); return; }
  $rf = "$base/recover/" . hash("sha256", $code) . ".json";
  $r = is_file($rf) ? json_decode(@file_get_contents($rf), true) : null;
  if (!is_array($r) || (int)($r["exp"] ?? 0) < time() || !preg_match("/^[a-f0-9]{64}$/", (string)($r["id"] ?? ""))) { $fail("invalid"); return; }
  $old = $r["id"]; $new = hash("sha256", $nk);
  if ($new !== $old) {
    if (is_file("$base/$new.json")) { $fail("exists"); return; }
    if (!is_file("$base/$old.json")) { $fail("gone"); return; }
    rename("$base/$old.json", "$base/$new.json");
    foreach (["users/$old.json" => "users/$new.json", "rankout/$old" => "rankout/$new", "quizres/$old.json" => "quizres/$new.json"] as $from => $to) { if (is_file("$base/$from")) { @rename("$base/$from", "$base/$to"); } }
    $uu = is_file("$base/users/$new.json") ? json_decode(@file_get_contents("$base/users/$new.json"), true) : null; if (is_array($uu) && !empty($uu["email"])) { email_idx_del($base, (string)$uu["email"], $old); email_idx_add($base, (string)$uu["email"], $new); }
    $adm = admin_load($base);
    if (in_array($old, $adm, true)) { $adm = array_diff($adm, [$old]); $adm[] = $new; admin_save($base, $adm); }
  }
  @unlink($rf); echo json_encode(["ok" => true]);
}

// =====================================================================================================
// Quiz de fin de chapitre : fabriqué, corrigé et enregistré par le SERVEUR (le navigateur ne peut pas falsifier un score).
// - Le navigateur reçoit les questions sans les réponses ; il envoie ses réponses une par une ; le serveur corrige.
// - Le classement ne compte que ces résultats. Meilleur score conservé par chapitre ; historique des essais pour le classement mensuel.
// - Garde-fous : réponse < 0,6 s = fausse, durée maximale de session, 6 essais par chapitre et par 24 h.
// =====================================================================================================
function quiz_max() { return 6; }
function vocab_data() {
  static $v = null;
  if ($v === null) { $f = __DIR__ . "/vocab-fr.json"; $v = is_file($f) ? json_decode(@file_get_contents($f), true) : null; if (!is_array($v)) { $v = ["steps" => [], "units" => [], "phrases" => []]; } }
  return $v;
}
function quiz_keys() { $o = []; foreach (vocab_data()["steps"] as $s) { $o[] = (string)$s["key"]; } return $o; }
function qres_load($base, $h) {
  $f = "$base/quizres/$h.json"; $a = is_file($f) ? json_decode(@file_get_contents($f), true) : null;
  if (!is_array($a)) { $a = []; }
  foreach (["res", "tries", "hist"] as $k) { if (!isset($a[$k]) || !is_array($a[$k])) { $a[$k] = []; } }
  return $a;
}
function qres_save($base, $h, $a) {
  $d = "$base/quizres"; if (!is_dir($d)) { @mkdir($d, 0700, true); }
  if (count($a["hist"]) > 600) { $a["hist"] = array_slice($a["hist"], -600); }
  file_put_contents("$d/$h.json", json_encode($a), LOCK_EX);
}
function res_points($qr) { $p = 0; $c = 0; foreach ($qr["res"] as $e) { $b = (int)($e["b"] ?? 0); if ($b >= 0 && $b <= 100) { $p += $b; if ($b >= 80) { $c++; } } } return [$p, $c]; }
function accents_off($s) {
  $s = mb_strtolower((string)$s, "UTF-8");
  $s = strtr($s, ["à" => "a", "â" => "a", "ä" => "a", "é" => "e", "è" => "e", "ê" => "e", "ë" => "e", "î" => "i", "ï" => "i", "ô" => "o", "ö" => "o", "ù" => "u", "û" => "u", "ü" => "u", "ç" => "c", "œ" => "oe", "æ" => "ae", "ÿ" => "y", "’" => "'"]);
  $s = preg_replace("/[^a-z0-9' ]/", "", $s);
  return trim(preg_replace("/\\s+/", " ", $s));
}
// ---- mois : points gagnés pendant le mois (progrès par rapport aux meilleurs scores d'avant le mois)
function cur_ym($off = 0) { $d = new DateTime("now", new DateTimeZone("Europe/Paris")); $d->modify("first day of this month"); if ($off) { $d->modify($off . " month"); } return $d->format("Y-m"); }
function month_range($ym) { $s = new DateTime($ym . "-01 00:00:00", new DateTimeZone("Europe/Paris")); $e = clone $s; $e->modify("+1 month"); return [$s->getTimestamp(), $e->getTimestamp()]; }
function month_pts($hist, $ym) {
  list($s, $e) = month_range($ym); $before = []; $within = []; $when = [];
  foreach ($hist as $x) {
    if (!is_array($x) || count($x) < 3) { continue; }
    $ts = (int)$x[0]; $key = (string)$x[1]; $pc = (int)$x[2];
    if ($ts < $s) { $before[$key] = max($before[$key] ?? 0, $pc); }
    elseif ($ts < $e && $pc > ($within[$key] ?? 0)) { $within[$key] = $pc; $when[$key] = $ts; }
  }
  $pts = 0; $last = 0;
  foreach ($within as $key => $w) { $b = $before[$key] ?? 0; if ($w > $b) { $pts += $w - $b; $last = max($last, $when[$key]); } }
  return [$pts, $last];
}
// ---- fabrication des questions
function quiz_distractors($it, $pool, $all) {
  $c = [];
  foreach ($pool as $x) { if ($x[0] !== $it[0] && $x[2] !== $it[2]) { $c[] = $x; } }
  shuffle($c);
  if (count($c) < 3) {
    $more = []; foreach ($all as $x) { if ($x[0] !== $it[0] && $x[2] !== $it[2] && !in_array($x, $c, true)) { $more[] = $x; } }
    shuffle($more); foreach ($more as $x) { if (count($c) >= 3) { break; } $c[] = $x; }
  }
  return array_slice($c, 0, 3);
}
function quiz_question($t, $it, $pool, $all) {
  $emo = $it[4] ?? "";
  if ($t === "p") { return ["t" => "p", "item" => $it, "right" => null, "pub" => ["t" => "p", "it" => ["", "", $it[2], $it[3], $emo]]]; }
  $opts = quiz_distractors($it, $pool, $all); $opts[] = $it; shuffle($opts); $right = (int)array_search($it, $opts, true);
  $fr = function ($x) { return [$x[0], $x[1], "", "", $x[4] ?? ""]; };
  $zh = function ($x) { return ["", "", $x[2], $x[3], $x[4] ?? ""]; };
  if ($t === "a") { $pub = ["t" => "a", "say" => $it[0], "it" => [$it[0], $it[1], "", "", $emo], "opts" => array_map($zh, $opts)]; }
  elseif ($t === "b") { $pub = ["t" => "b", "it" => ["", "", $it[2], $it[3], $emo], "opts" => array_map($fr, $opts)]; }
  elseif ($t === "c") { $pub = ["t" => "c", "say" => $it[0], "opts" => array_map($zh, $opts)]; }
  else { $t = "d"; $pub = ["t" => "d", "say" => $it[0], "opts" => array_map($fr, $opts)]; }
  return ["t" => $t, "item" => $it, "right" => $right, "pub" => $pub];
}
function quiz_phrase($t, $V) {
  $P = $V["phrases"]; $e = $P[random_int(0, count($P) - 1)]; $w = explode("/", $e[0]);
  $item = ["full" => implode(" ", $w), "ipa" => $e[1], "zh" => $e[2]];
  if ($t === "o") { $bank = $w; shuffle($bank); return ["t" => "o", "item" => $item, "ans" => $w, "right" => null, "pub" => ["t" => "o", "zh" => $e[2], "bank" => $bank]]; }
  $idx = random_int(0, count($w) - 1); $ans = $w[$idx]; $pool = [];
  foreach ($P as $pp) { foreach (explode("/", $pp[0]) as $x) { if ($x !== $ans) { $pool[$x] = 1; } } }
  $cands = array_map("strval", array_keys($pool)); shuffle($cands); $opts = array_slice($cands, 0, 3); $opts[] = $ans; shuffle($opts);
  $sent = $w; $sent[$idx] = "＿＿";
  return ["t" => "z", "item" => $item, "right" => (int)array_search($ans, $opts, true), "pub" => ["t" => "z", "zh" => $e[2], "sentence" => implode(" ", $sent), "opts" => $opts]];
}
function quiz_build($key) {
  $V = vocab_data(); $step = null;
  foreach ($V["steps"] as $s) { if ((string)$s["key"] === $key) { $step = $s; } }
  if (!$step) { return null; }
  $units = []; $hasPhr = false; $all = [];
  /* distracteurs : seulement le vocabulaire déjà vu (ce chapitre et les précédents) */
  foreach ($V["steps"] as $s) { foreach ($s["units"] as $uid) { if (isset($V["units"][$uid])) { foreach ($V["units"][$uid]["items"] as $x) { $all[] = $x; } } } if ($s === $step) { break; } }
  foreach ($step["units"] as $uid) { if ($uid === "m:phr") { $hasPhr = true; } elseif (isset($V["units"][$uid])) { $units[$uid] = $V["units"][$uid]["items"]; } }
  $nu = count($units); if ($nu === 0 && !$hasPhr) { return null; }
  $total = max(12, min(24, $nu * 6)); $nphr = ($hasPhr && count($V["phrases"]) > 0) ? 6 : 0; $nw = $total - $nphr;
  $picks = [];
  if ($nu > 0) {
    $per = (int)ceil($nw / $nu);
    foreach ($units as $uid => $items) { $idx = range(0, count($items) - 1); shuffle($idx); foreach (array_slice($idx, 0, min($per, count($items))) as $i) { $picks[] = [$uid, $i]; } }
    shuffle($picks); $picks = array_slice($picks, 0, $nw);
    $uids = array_keys($units);
    while (count($picks) < min($nw, 10)) { $uid = $uids[random_int(0, count($uids) - 1)]; $picks[] = [$uid, random_int(0, count($units[$uid]) - 1)]; }
  }
  $types = ["a", "b", "c", "d", "p"]; $qs = [];
  foreach ($picks as $pk) {
    $items = $units[$pk[0]]; $it = $items[$pk[1]]; $t = $types[random_int(0, 4)];
    if ($t === "p" && (mb_strlen($it[0]) > 24 || preg_match('/[…?!(,]/u', $it[0]))) { $t = "b"; }
    $qs[] = quiz_question($t, $it, $items, $all);
  }
  for ($i = 0; $i < $nphr; $i++) { $qs[] = quiz_phrase($i % 2 ? "o" : "z", $V); }
  shuffle($qs);
  return $qs;
}
function quiz_grade($q, $a) {
  if ($a === null) { return false; }
  if ($q["t"] === "p") {
    $typed = accents_off((string)$a); if ($typed === "") { return false; }
    foreach (explode(" / ", $q["item"][0]) as $part) { if ($typed === accents_off($part)) { return true; } }
    return $typed === accents_off($q["item"][0]);
  }
  if ($q["t"] === "o") { return is_array($a) && array_values($a) === $q["ans"]; }
  return is_int($a) && $a === $q["right"];
}
function quiz_main($k, $base, $app) {
  if (!$app || !preg_match("/^[a-z0-9]{8,40}$/", $k)) { http_response_code(400); echo "{\"error\":\"bad request\"}"; return; }
  $h = hash("sha256", $k);
  if (!is_file("$base/$h.json")) { http_response_code(400); echo "{\"error\":\"no profile\"}"; return; }
  $act = (string)$_GET["quiz"]; $Q = qres_load($base, $h); $now = time();
  if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $left = []; foreach (quiz_keys() as $key) { $tr = array_filter($Q["tries"][$key] ?? [], function ($x) use ($now) { return $x > $now - 86400; }); $left[$key] = max(0, quiz_max() - count($tr)); }
    echo json_encode(["res" => (object)$Q["res"], "left" => (object)$left]); return;
  }
  $b = json_decode(file_get_contents("php://input", false, null, 0, 4001), true);
  if (!is_array($b)) { http_response_code(400); echo "{\"error\":\"bad body\"}"; return; }
  $sd = "$base/quiz";
  if ($act === "start") {
    $key = preg_replace("/[^a-z0-9]/", "", (string)($b["chap"] ?? ""));
    $qs = quiz_build($key); if (!$qs) { http_response_code(400); echo "{\"error\":\"bad chapter\"}"; return; }
    $tr = array_values(array_filter($Q["tries"][$key] ?? [], function ($x) use ($now) { return $x > $now - 86400; }));
    if (count($tr) >= quiz_max()) { http_response_code(429); echo json_encode(["error" => "limit", "retry" => $tr[0] + 86400 - $now]); return; }
    $tr[] = $now; $Q["tries"][$key] = $tr; qres_save($base, $h, $Q);
    if (!is_dir($sd)) { @mkdir($sd, 0700, true); }
    foreach (glob("$sd/*.json") ?: [] as $f) { if (filemtime($f) < $now - 10800) { @unlink($f); } }
    $sid = bin2hex(random_bytes(8));
    file_put_contents("$sd/$sid.json", json_encode(["h" => $h, "chap" => $key, "q" => $qs, "i" => 0, "ok" => [], "t0" => $now, "tq" => microtime(true)], JSON_UNESCAPED_UNICODE), LOCK_EX);
    echo json_encode(["sid" => $sid, "n" => count($qs), "q" => $qs[0]["pub"], "left" => quiz_max() - count($tr)], JSON_UNESCAPED_UNICODE); return;
  }
  if ($act !== "answer") { http_response_code(400); echo "{\"error\":\"bad action\"}"; return; }
  $sid = preg_replace("/[^a-f0-9]/", "", (string)($b["sid"] ?? "")); $sf = "$sd/$sid.json";
  $s = (strlen($sid) === 16 && is_file($sf)) ? json_decode(@file_get_contents($sf), true) : null;
  if (!is_array($s) || ($s["h"] ?? "") !== $h) { http_response_code(400); echo "{\"error\":\"no session\"}"; return; }
  $i = (int)($b["i"] ?? -1);
  if ($i !== (int)$s["i"]) { http_response_code(409); echo json_encode(["error" => "out of order", "i" => $s["i"]]); return; }
  $n = count($s["q"]); $q = $s["q"][$i]; $el = microtime(true) - (float)$s["tq"];
  if ($now - (int)$s["t0"] > $n * 150 + 60) { @unlink($sf); http_response_code(410); echo "{\"error\":\"expired\"}"; return; }
  $ok = ($el >= 1.0 && $el <= 180) ? quiz_grade($q, $b["a"] ?? null) : false;
  $s["ok"][] = $ok ? 1 : 0; $s["i"] = $i + 1; $s["tq"] = microtime(true);
  $out = ["ok" => $ok, "right" => $q["right"], "fb" => $q["item"]];
  if ($s["i"] < $n) { $out["next"] = $s["q"][$s["i"]]["pub"]; file_put_contents($sf, json_encode($s, JSON_UNESCAPED_UNICODE), LOCK_EX); echo json_encode($out, JSON_UNESCAPED_UNICODE); return; }
  $good = array_sum($s["ok"]); $pct = (int)round($good * 100 / $n); $dur = max(1, $now - (int)$s["t0"]); $key = $s["chap"];
  $e = $Q["res"][$key] ?? ["b" => 0, "a" => 0]; $e["a"] = (int)($e["a"] ?? 0) + 1; $e["l"] = $pct; $e["ts"] = $now;
  if ($pct >= (int)($e["b"] ?? 0)) { $e["b"] = $pct; $e["n"] = $n; $e["t"] = $dur; }
  $Q["res"][$key] = $e; $Q["hist"][] = [$now, $key, $pct]; qres_save($base, $h, $Q); @unlink($sf);
  $out["done"] = true; $out["pct"] = $pct; $out["good"] = $good; $out["n"] = $n; $out["best"] = $e["b"]; $out["pass"] = $e["b"] >= 80; $out["a"] = $e["a"];
  echo json_encode($out, JSON_UNESCAPED_UNICODE);
}

// ---- Nom de compte libre ? (comparaison sans tenir compte des majuscules)
function name_free($base, $name, $selfId) {
  $n = mb_strtolower(trim((string)$name), "UTF-8"); if ($n === "") { return true; }
  foreach (glob("$base/users/*.json") ?: [] as $uf) {
    $id = basename($uf, ".json"); if ($id === $selfId) { continue; }
    $u = json_decode(@file_get_contents($uf), true);
    if (is_array($u) && mb_strtolower(trim((string)($u["name"] ?? "")), "UTF-8") === $n) { return false; }
  }
  return true;
}

// ---- Personnalisation du profil : titre (débloqué par chapitres validés) et devise (texte court nettoyé)
function title_ok($t, $chapters) { $need = [0, 1, 3, 6, 10, 15, 17]; return ($t >= 0 && $t <= 6 && $chapters >= $need[$t]) ? $t : 0; }
function clean_motto($s) { return mb_substr(trim(preg_replace("/[^\p{L}\p{N} _.,!?'’\-]/u", "", (string)$s)), 0, 40); }

// Réglages de position des accessoires de l'avatar : lecture publique, écriture réservée aux administrateurs.
function accpos_main($k, $base) {
  $f = "$base/accpos.json";
  if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (!preg_match("/^[a-z0-9]{8,40}$/", $k) || !in_array(hash("sha256", $k), admin_load($base), true)) { http_response_code(403); echo "{\"error\":\"denied\"}"; return; }
    $b = json_decode(file_get_contents("php://input", false, null, 0, 30001), true);
    if (!is_array($b)) { http_response_code(400); echo "{\"error\":\"bad body\"}"; return; }
    $out = [];
    foreach ($b as $key => $v) {
      if (!is_string($key) || !preg_match("/^(hat|obj|wng|aur):\d{1,2}(:\d)?$/", $key) || !is_array($v) || count($out) >= 200) continue;
      $out[$key] = ["x" => max(-200, min(200, round((float)($v["x"] ?? 0), 1))), "y" => max(-200, min(200, round((float)($v["y"] ?? 0), 1))), "s" => max(0.3, min(3, round((float)($v["s"] ?? 1), 2))), "r" => max(-180, min(180, round((float)($v["r"] ?? 0), 1)))];
    }
    file_put_contents($f, json_encode((object)$out), LOCK_EX);
    echo json_encode(["ok" => true, "n" => count($out)]); return;
  }
  echo is_file($f) ? file_get_contents($f) : "{}";
}

