import { sine_sound, triangle_sound, play, consecutively,
         simultaneously, silence_sound, adsr } from "sound";

// 温暖音色: triangle 打底 + 微弱 sine 2倍泛音
function note(freq, dur) {
    const tri = triangle_sound(freq, dur);
    const har = sine_sound(freq * 2, dur);
    const env_tri = adsr(0.02, 0.06, 0.55, 0.08)(tri);
    const env_har = adsr(0.02, 0.06, 0.15, 0.08)(har);
    return simultaneously(list(env_tri, env_har));
}
const g = silence_sound(0.04);

// 黄臀鹎
function p0() { play(consecutively(list(
    note(800,0.12), g, note(950,0.10), g, note(1100,0.10), g, note(1450,0.22)
))); }

// 爪哇八哥
function p1() { play(consecutively(list(
    note(480,0.10), g, note(580,0.10), g, note(640,0.12), g, note(520,0.18), g, note(430,0.20)
))); }

// 家麻雀
function p2() { play(consecutively(list(
    note(1100,0.06), g, note(1050,0.06), g, note(1120,0.06), g, note(1020,0.06), g, note(1080,0.08)
))); }

// 斑姬地鸠
function p3() { play(consecutively(list(
    note(285,0.25), g, note(310,0.22), g, note(320,0.22), g, note(295,0.30)
))); }

// 领角鸮
function p4() { play(consecutively(list(
    note(240,0.45), g, note(260,0.50)
))); }

// 红原鸡
function p5() { play(consecutively(list(
    note(720,0.18), g, note(640,0.15), g, note(560,0.12), g, note(470,0.08)
))); }

// 鸽子A
function p6() { play(consecutively(list(
    note(350,0.10), g, note(352,0.10), g, note(350,0.10), g, note(348,0.10), g,
    note(345,0.10), g, note(346,0.10), g, note(348,0.10), g, note(350,0.18)
))); }

// 鸽子B
function p7() { play(consecutively(list(
    note(360,0.10), g, note(362,0.10), g, note(360,0.10), g, note(356,0.10), g,
    note(352,0.10), g, note(354,0.10), g, note(356,0.10), g, note(360,0.18)
))); }

// 完成音效
function fanfare() { play(consecutively(list(
    note(523,0.18), g, note(659,0.18), g, note(784,0.18), g, note(880,0.18), g, note(1047,0.25)
))); }

p0();

"p0-p7, fanfare()";
