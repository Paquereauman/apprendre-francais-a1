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
  $n = mb_substr(trim(preg_replace("/[^\p{L}\p{N} _.\-]/u", "", (string)($_GET["n"] ?? ""))), 0, 20);
  if ($app && $n !== "") {
    $ud = "$base/users"; if (!is_dir($ud)) { @mkdir($ud, 0700, true); }
    file_put_contents("$ud/$h.json", json_encode(["name" => $n, "ts" => time()], JSON_UNESCAPED_UNICODE), LOCK_EX);
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
    if (!empty($b["leave"])) { @unlink("$dir/$h.json"); echo "{\"ok\":true,\"left\":true}"; exit; }
    $name = trim(preg_replace("/[^\p{L}\p{N} _.\-]/u", "", (string)($b["name"] ?? "")));
    $name = mb_substr($name, 0, 20);
    if (mb_strlen($name) < 2) { http_response_code(400); echo "{\"error\":\"bad name\"}"; exit; }
    file_put_contents("$dir/$h.json", json_encode(["name" => $name, "ts" => time()], JSON_UNESCAPED_UNICODE), LOCK_EX);
    echo "{\"ok\":true}"; exit;
  }
  $out = []; $me = false; $yday = date("Y-m-d", time() - 86400);
  foreach (array_slice(glob("$dir/*.json") ?: [], 0, 300) as $rf) {
    $id = basename($rf, ".json"); $r = json_decode(@file_get_contents($rf), true); $pf = "$base/$id.json";
    if (!is_array($r) || !is_file($pf)) continue;
    $S = json_decode(@file_get_contents($pf), true); if (!is_array($S)) continue;
    $words = 0; foreach (($S["known"] ?? []) as $a) { if (is_array($a)) $words += count($a); }
    $streak = (int)($S["streak"] ?? 0); if (($S["last"] ?? "") < $yday) $streak = 0;
    $av = []; foreach (($S["av"] ?? []) as $ak => $av_v) { if (!is_string($ak) || !preg_match("/^[a-zA-Z]{2,8}$/", $ak) || count($av) >= 30) continue; if (is_int($av_v) && $av_v >= 0 && $av_v < 100) $av[$ak] = $av_v; elseif (is_string($av_v) && preg_match("/^#[0-9a-fA-F]{6}$/", $av_v)) $av[$ak] = $av_v; }
    $isme = ($id === $h); if ($isme) $me = true;
    $out[] = ["name" => $r["name"], "xp" => (int)($S["xp"] ?? 0), "words" => $words, "streak" => $streak, "av" => $av, "me" => $isme];
  }
  usort($out, function ($a, $b) { return [$b["xp"], $b["words"]] <=> [$a["xp"], $a["words"]]; });
  echo json_encode(["app" => $app, "list" => array_slice($out, 0, 100), "me" => $me, "total" => count($out)], JSON_UNESCAPED_UNICODE);
}

// ---- Administration : les administrateurs sont des profils (hash de la clé) listés dans admins.json.
// Premier administrateur : jeton de première activation (hash dans admin_setup.sha256), utilisable une seule fois.
function admin_load($base) { $f = "$base/admins.json"; $a = is_file($f) ? json_decode(@file_get_contents($f), true) : null; return is_array($a) ? $a : []; }
function admin_save($base, $a) { file_put_contents("$base/admins.json", json_encode(array_values(array_unique($a))), LOCK_EX); }
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
    if (!preg_match("/^[a-f0-9]{64}$/", $id)) { http_response_code(400); echo "{\"error\":\"bad id\"}"; return; }
    if ($act === "promote") { $admins[] = $id; admin_save($base, $admins); }
    elseif ($act === "demote") {
      if (count($admins) <= 1 && $id === $admins[0]) { http_response_code(400); echo "{\"error\":\"last admin\"}"; return; }
      admin_save($base, array_diff($admins, [$id]));
    }
    elseif ($act === "kick") { @unlink("$base/rank/$id.json"); }
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
      $words = 0; foreach (($S["known"] ?? []) as $a) { if (is_array($a)) $words += count($a); }
      $users[] = ["id" => $id, "name" => (string)($u["name"] ?? "?"), "seen" => (int)($u["ts"] ?? 0), "xp" => (int)($S["xp"] ?? 0), "words" => $words,
        "admin" => in_array($id, $admins, true), "rank" => is_file("$base/rank/$id.json"), "me" => $id === $h];
    }
    usort($users, function ($a, $b) { return $b["seen"] <=> $a["seen"]; });
    $out["users"] = $users;
  }
  echo json_encode($out, JSON_UNESCAPED_UNICODE);
}
