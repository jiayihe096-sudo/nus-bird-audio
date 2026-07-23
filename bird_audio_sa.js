// ============================================================
//  NUS Bird Finder - 8 Bird Calls for Source Academy Playground
//  1. Modules 标签页 -> 搜索 "sound" -> 点击 Import
//  2. 复制此文件全部代码运行
//  3. play_bird(1) 到 play_bird(8)
//  4. play_all() 依次播放全部
// ============================================================

// ---- 基础音色 ----
function chirp(freq, dur) {
    return adsr(0.02, 0.05, 0.5, 0.03)(sawtooth_sound(freq, dur));
}
function soft_note(freq, dur) {
    return adsr(0.03, 0.08, 0.65, 0.1)(triangle_sound(freq, dur));
}
function whistle(freq, dur) {
    return adsr(0.02, 0.06, 0.6, 0.05)(sine_sound(freq, dur));
}
function harsh_note(freq, dur) {
    return adsr(0.01, 0.04, 0.5, 0.04)(square_sound(freq, dur));
}
function bright_note(freq, dur) {
    return adsr(0.01, 0.05, 0.65, 0.02)(sawtooth_sound(freq, dur));
}
function pause(dur) {
    return silence_sound(dur);
}

// ---- 1. Yellow-vented Bulbul: 4-note rising song ----
function make_bulbul() {
    const g = pause(0.04);
    return consecutively(list(
        whistle(800, 0.12), g,
        whistle(950, 0.10), g,
        whistle(1100, 0.10), g,
        adsr(0.02, 0.12, 0.7, 0.08)(sine_sound(1450, 0.22))
    ));
}
// ---- 2. Javan Myna: loud varied whistles ----
function make_myna() {
    const g = pause(0.03);
    const w3_sq = harsh_note(620, 0.10);
    const w3_saw = adsr(0.01, 0.04, 0.3, 0.04)(sawtooth_sound(620, 0.10));
    const w3 = simultaneously(list(w3_sq, w3_saw));
    return consecutively(list(
        harsh_note(480, 0.10), g,
        harsh_note(560, 0.10), g,
        w3, g,
        adsr(0.02, 0.08, 0.55, 0.08)(square_sound(520, 0.18)), g,
        adsr(0.02, 0.10, 0.5, 0.10)(square_sound(430, 0.20))
    ));
}
// ---- 3. Eurasian Tree Sparrow: 5 fast cheeps ----
function make_sparrow() {
    return consecutively(list(
        chirp(1000, 0.05), pause(0.04),
        chirp(980, 0.05),  pause(0.04),
        chirp(1030, 0.05), pause(0.04),
        chirp(950, 0.05),  pause(0.04),
        chirp(990, 0.06)
    ));
}
// ---- 4. Zebra Dove: soft staccato coos ----
function make_zebra_dove() {
    const g = pause(0.12);
    return consecutively(list(
        soft_note(285, 0.25), g,
        soft_note(305, 0.22), g,
        soft_note(315, 0.22), g,
        soft_note(295, 0.30)
    ));
}
// ---- 5. Collared Scops Owl: low "goog gook" ----
function make_owl() {
    const goog = adsr(0.04, 0.15, 0.6, 0.2)(triangle_sound(245, 0.45));
    const gook = adsr(0.04, 0.12, 0.6, 0.25)(triangle_sound(265, 0.50));
    return consecutively(list(goog, pause(0.2), gook));
}
// ---- 6. Red Junglefowl: short abrupt crow ----
function make_junglefowl() {
    const g = pause(0.06);
    return consecutively(list(
        bright_note(720, 0.18), g,
        bright_note(650, 0.15), g,
        bright_note(560, 0.13), g,
        adsr(0.01, 0.03, 0.5, 0.005)(sawtooth_sound(480, 0.10))
    ));
}
// ---- 7. Pigeon A: soft wavering coo ----
function make_pigeon() {
    const env = adsr(0.03, 0.1, 0.6, 0.12);
    return consecutively(list(
        env(phase_mod(355, 0.35, 0.003)(sine_sound(6, 0.35))),
        pause(0.06),
        env(phase_mod(345, 0.28, 0.004)(sine_sound(5, 0.28))),
        pause(0.06),
        env(phase_mod(350, 0.35, 0.003)(sine_sound(6, 0.35)))
    ));
}
// ---- 8. Pigeon B: slightly different pitch ----
function make_pigeon_b() {
    const env = adsr(0.03, 0.1, 0.6, 0.12);
    return consecutively(list(
        env(phase_mod(360, 0.32, 0.004)(sine_sound(6, 0.32))),
        pause(0.06),
        env(phase_mod(350, 0.25, 0.003)(sine_sound(5, 0.25))),
        pause(0.05),
        env(phase_mod(355, 0.30, 0.004)(sine_sound(6, 0.30)))
    ));
}

// ---- 播放 ----
function play_bird(n) {
    if (n === 1) { play(make_bulbul());      return "1. Yellow-vented Bulbul";      }
    if (n === 2) { play(make_myna());        return "2. Javan Myna";               }
    if (n === 3) { play(make_sparrow());     return "3. Eurasian Tree Sparrow";    }
    if (n === 4) { play(make_zebra_dove());  return "4. Zebra Dove";               }
    if (n === 5) { play(make_owl());         return "5. Collared Scops Owl";       }
    if (n === 6) { play(make_junglefowl());  return "6. Red Junglefowl";           }
    if (n === 7) { play(make_pigeon());      return "7. Rock Pigeon A";            }
    if (n === 8) { play(make_pigeon_b());    return "8. Rock Pigeon B";            }
    return "Enter 1-8";
}

function play_all() {
    const g = pause(0.5);
    play(consecutively(list(
        make_bulbul(),      g,
        make_myna(),        g,
        make_sparrow(),     g,
        make_zebra_dove(),  g,
        make_owl(),         g,
        make_junglefowl(),  g,
        make_pigeon(),      g,
        make_pigeon_b()
    )));
    return "Playing all 8 bird calls...";
}

"Ready. play_bird(1-8) or play_all()";
