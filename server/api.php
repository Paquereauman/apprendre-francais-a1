<?php
// Sauvegarde de progression : 1 fichier JSON par code secret + copies de sécurité horodatées.
header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-store");
// Espace de noms optionnel (?app=fr) : l'appli de français a ses propres profils et son propre classement.
// Sans ?app, le comportement est identique à l'ancienne version (appli chinoise).
$app = preg_match("/^[a-z]{2,8}$/", $_GET["app"] ?? "") ? $_GET["app"] : "";
$base = "/var/lib/chinois" . ($app ? "/$app" : "");
if ($app && !is_dir("$base/bak")) { @mkdir("$base/bak", 0700, true); }
$k = $_GET["k"] ?? "";
if (isset($_GET["rank"])) { rank_main($k, $base, $app); exit; }
if (isset($_GET["admin"])) { admin_main($k, $base, $app); exit; }
if (isset($_GET["classes"])) {
  $o = ["app" => $app, "classes" => classes_load($base)];
  if (preg_match("/^[a-z0-9]{8,40}$/", $k)) {
    $uf = "$base/users/" . hash("sha256", $k) . ".json";
    $u = is_file($uf) ? json_decode(@file_get_contents($uf), true) : null;
    if (is_array($u) && array_key_exists("cls", $u)) { $o["mine"] = (string)$u["cls"]; }
  }
  echo json_encode($o, JSON_UNESCAPED_UNICODE); exit;
}
if (isset($_GET["setcls"])) { self_setcls($k, $base, $app); exit; }
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
  $src = [];
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
    $out[] = ["name" => (($nk = clean_name($S["nick"] ?? "", 20)) !== "" ? $nk : $rname), "cls" => $rcls, "emo" => clean_emo($S["emo"] ?? ""), "col" => max(0, min(9, (int)($S["col"] ?? 0))), "frm" => max(0, min(4, (int)($S["frm"] ?? 0))), "ttl" => title_ok((int)($S["ttl"] ?? 0), $chp), "motto" => clean_motto($S["motto"] ?? ""), "pts" => $pts, "ch" => $chp, "lts" => $lts, "m" => $mpts, "mt" => $mts, "pm" => $ppts, "pmt" => $pts2, "xp" => (int)($S["xp"] ?? 0), "words" => $words, "streak" => $streak, "av" => $av, "me" => $isme];
  }
  $byPts = ($app !== "");
  usort($out, function ($a, $b) use ($byPts) { return $byPts ? [-$a["pts"], $a["lts"] ?: PHP_INT_MAX] <=> [-$b["pts"], $b["lts"] ?: PHP_INT_MAX] : [$b["xp"], $b["words"]] <=> [$a["xp"], $a["words"]]; });
  $win = null;
  if ($app !== "") { $c = array_filter($out, function ($u) { return $u["pm"] > 0; }); usort($c, function ($a, $b) { return [$b["pm"], $a["pmt"]] <=> [$a["pm"], $b["pmt"]]; }); if ($c) { $w = array_values($c)[0]; $win = ["ym" => $ymp, "name" => $w["name"], "emo" => $w["emo"], "pts" => $w["pm"]]; } }
  echo json_encode(["app" => $app, "ym" => $ym, "winner" => $win, "classes" => ($app !== "" ? classes_load($base) : []), "list" => array_slice($out, 0, 300), "me" => $me, "total" => count($out)], JSON_UNESCAPED_UNICODE);
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
    if (!$isAdmin) { http_response_code(403); echo "{\"error\":\"denied\"}"; return; }
    $id = (string)($b["id"] ?? "");
    if (in_array($act, ["promote", "demote", "kick", "setclass", "recovery"], true) && !preg_match("/^[a-f0-9]{64}$/", $id)) { http_response_code(400); echo "{\"error\":\"bad id\"}"; return; }
    $cls = classes_load($base);
    if ($act === "promote") { $admins[] = $id; admin_save($base, $admins); }
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
      $cls[] = ["id" => $cid, "name" => $name]; classes_save($base, $cls);
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
        "admin" => in_array($id, $admins, true), "rank" => ($app !== "" ? !is_file("$base/rankout/$id") : is_file("$base/rank/$id.json")), "me" => $id === $h];
    }
    usort($users, function ($a, $b) { return $b["seen"] <=> $a["seen"]; });
    $win = [];
    foreach ($months as $ym2) { $l = $mt[$ym2] ?? []; usort($l, function ($a, $b) { return [$b["pts"], $a["ts"]] <=> [$a["pts"], $b["ts"]]; }); $win[] = ["ym" => $ym2, "top" => array_slice($l, 0, 3)]; }
    $out["users"] = $users; $out["classes"] = classes_load($base); $out["winners"] = $win;
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
  $u["cls"] = $cid; file_put_contents($uf, json_encode($u, JSON_UNESCAPED_UNICODE), LOCK_EX);
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
  foreach ($V["units"] as $u) { foreach ($u["items"] as $x) { $all[] = $x; } }
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
