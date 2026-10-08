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
if (isset($_GET["classes"])) { echo json_encode(["app" => $app, "classes" => classes_load($base)], JSON_UNESCAPED_UNICODE); exit; }
if (!preg_match("/^[a-z0-9]{8,40}$/", $k)) { http_response_code(400); echo "{\"error\":\"bad key\"}"; exit; }
$h = hash("sha256", $k);
$f = "$base/$h.json";
if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $b = file_get_contents("php://input", false, null, 0, 300001);
  if (strlen($b) > 300000 || !is_array(json_decode($b, true))) { http_response_code(400); echo "{\"error\":\"bad body\"}"; exit; }
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
  $out = []; $me = false; $yday = date("Y-m-d", time() - 86400);
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
    $isme = ($id === $h); if ($isme) $me = true;
    $out[] = ["name" => (($nk = clean_name($S["nick"] ?? "", 20)) !== "" ? $nk : $rname), "cls" => $rcls, "emo" => clean_emo($S["emo"] ?? ""), "xp" => (int)($S["xp"] ?? 0), "words" => $words, "streak" => $streak, "av" => $av, "me" => $isme];
  }
  usort($out, function ($a, $b) { return [$b["xp"], $b["words"]] <=> [$a["xp"], $a["words"]]; });
  echo json_encode(["app" => $app, "classes" => ($app !== "" ? classes_load($base) : []), "list" => array_slice($out, 0, 300), "me" => $me, "total" => count($out)], JSON_UNESCAPED_UNICODE);
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
    if (in_array($act, ["promote", "demote", "kick", "setclass"], true) && !preg_match("/^[a-f0-9]{64}$/", $id)) { http_response_code(400); echo "{\"error\":\"bad id\"}"; return; }
    $cls = classes_load($base);
    if ($act === "promote") { $admins[] = $id; admin_save($base, $admins); }
    elseif ($act === "demote") {
      if (count($admins) <= 1 && $id === $admins[0]) { http_response_code(400); echo "{\"error\":\"last admin\"}"; return; }
      admin_save($base, array_diff($admins, [$id]));
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
      $cid = preg_replace("/[^a-z0-9]/", "", (string)($b["cls"] ?? "")); $df = (string)($b["from"] ?? ""); $dt = (string)($b["to"] ?? "");
      $okd = function ($d) { return $d === "" || (bool)preg_match("/^\d{4}-\d{2}-\d{2}$/", $d); };
      if (!class_exists_in($base, $cid) || !$okd($df) || !$okd($dt) || (($df === "") !== ($dt === "")) || ($df !== "" && $dt < $df)) { http_response_code(400); echo "{\"error\":\"bad period\"}"; return; }
      foreach ($cls as $i => $c) { if ($c["id"] === $cid) { if ($df === "") { unset($cls[$i]["from"], $cls[$i]["to"]); } else { $cls[$i]["from"] = $df; $cls[$i]["to"] = $dt; } } }
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
    $users = [];
    foreach (array_slice(glob("$base/users/*.json") ?: [], 0, 500) as $uf) {
      $id = basename($uf, ".json"); if (!preg_match("/^[a-f0-9]{64}$/", $id)) continue;
      $u = json_decode(@file_get_contents($uf), true); if (!is_array($u)) continue;
      $S = is_file("$base/$id.json") ? json_decode(@file_get_contents("$base/$id.json"), true) : null; if (!is_array($S)) $S = [];
      $kn = []; $words = 0;
      foreach (($S["known"] ?? []) as $cid => $a) { if (is_array($a) && preg_match("/^[a-z0-9_]{1,20}$/", (string)$cid)) { $kn[$cid] = count($a); $words += count($a); } }
      $best = []; foreach (($S["best"] ?? []) as $cid => $v) { if (is_numeric($v) && preg_match("/^[a-z0-9_]{1,20}$/", (string)$cid)) { $best[$cid] = (float)$v; } }
      $test = []; foreach (($S["test"] ?? []) as $cid => $v) { if (is_numeric($v) && preg_match("/^[a-z0-9_]{1,20}$/", (string)$cid)) { $test[$cid] = (float)$v; } }
      $users[] = ["id" => $id, "name" => (string)($u["name"] ?? "?"), "cls" => (string)($u["cls"] ?? ""), "nick" => clean_name($S["nick"] ?? "", 20), "emo" => clean_emo($S["emo"] ?? ""), "seen" => (int)($u["ts"] ?? 0), "xp" => (int)($S["xp"] ?? 0), "words" => $words,
        "known" => $kn, "best" => $best, "test" => $test, "phr" => (int)($S["phr"] ?? 0), "streak" => (int)($S["streak"] ?? 0),
        "admin" => in_array($id, $admins, true), "rank" => ($app !== "" ? !is_file("$base/rankout/$id") : is_file("$base/rank/$id.json")), "me" => $id === $h];
    }
    usort($users, function ($a, $b) { return $b["seen"] <=> $a["seen"]; });
    $out["users"] = $users; $out["classes"] = classes_load($base);
  }
  echo json_encode($out, JSON_UNESCAPED_UNICODE);
}
