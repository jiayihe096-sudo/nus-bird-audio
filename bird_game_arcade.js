// NUS Bird Finder - 长卷轴全景版
import { create_rectangle, create_text, create_sprite,
         update_position, update_text, update_color, update_scale,
         query_pointer_position, input_left_mouse_down, pointer_over_gameobject,
         set_dimensions, update_loop, build_game,
         create_audio, play_audio, stop_audio } from "arcade_2d";

set_dimensions([900, 600]);
function go(o, x, y) { update_position(o, [x, y]); }
function off(o) { update_position(o, [-9999, -9999]); }
function cc(o, c) { update_color(o, c); }

// === 长卷轴 (2D 自由滚动) ===
const WORLD_W = 2400;
const WORLD_H = 1200;
let scrollX = 0;
let scrollY = 0;

const bg = create_rectangle(WORLD_W, WORLD_H);
go(bg, WORLD_W / 2, WORLD_H / 2);
cc(bg, [100, 180, 240, 255]);

const ground = create_rectangle(WORLD_W, 200);
go(ground, WORLD_W / 2, WORLD_H - 100);

// 吃饭的人 + 餐桌场景 (世界坐标 canteen 区域)
const guyX = 1580;
const guyY = 755;
const guyBody = create_rectangle(22, 32);
off(guyBody);
cc(guyBody, [21, 101, 192, 255]);
const guyHead = create_rectangle(20, 20);
off(guyHead);
cc(guyHead, [255, 204, 128, 255]);
// 餐桌
const tbl = create_rectangle(100, 14);
off(tbl);
cc(tbl, [161, 136, 127, 255]);
// 餐盘
const plate = create_rectangle(22, 8);
off(plate);
cc(plate, [250, 250, 250, 255]);
// 食物
const food = create_rectangle(8, 8);
off(food);
cc(food, [255, 180, 50, 255]);
// 筷子
const chop1 = create_rectangle(2, 18);
off(chop1);
cc(chop1, [139, 90, 43, 255]);
const chop2 = create_rectangle(2, 18);
off(chop2);
cc(chop2, [139, 90, 43, 255]);
cc(ground, [80, 160, 40, 255]);

// === 鸟 sprite (全部MJ出图 — 需要remove.bg抠底!) ===
const SP = "https://raw.githubusercontent.com/jiayihe096-sudo/nus-bird-audio/master/";
const sprites = [];
// 0=黄臀鹎 1=八哥 2=麻雀 3=斑鸠 4=猫头鹰 5=鸡 6=鸽子A 7=鸽子B
const CACHE = "?ts=" + "0cfd2a1";
const F = ["bulbul.png"+CACHE,"myna.png"+CACHE,"sparrow.png"+CACHE,"zebra_dove.png"+CACHE,"owl.png"+CACHE,"junglefowl.png"+CACHE,"pigeon_a.png"+CACHE,"pigeon_b.png"+CACHE];
for (let i = 0; i < 8; i = i + 1) {
    sprites[i] = create_sprite(SP + F[i]);
    off(sprites[i]);
    update_scale(sprites[i], [0.03, 0.03]);
}

// 世界坐标散布在 2400x1200 中
const WX = [280, 520, 780, 1050, 340, 1550, 1800, 2200];
const WY = [200, 800, 950, 650, 450, 850, 350, 600];
const WS = [0.03, 0.03, 0.03, 0.03, 0.03, 0.03, 0.03, 0.03];
function sx(i) { return WX[i] - scrollX; }
function sy(i) { return WY[i] - scrollY; }

// === UI (固定在屏幕上不动) ===
const cnt = create_text("x 8"); go(cnt, 780, 30);
const pbg = create_rectangle(340, 200); off(pbg); cc(pbg, [255,254,249,255]);
const pti = create_text(""); off(pti);
const pde = create_text(""); off(pde);
const pcb = create_rectangle(80, 30); off(pcb); cc(pcb, [76,175,80,255]);
const pct = create_text("CLOSE"); off(pct);
const ebg = create_rectangle(900, 600); off(ebg); cc(ebg, [0,0,0,180]);
const eti = create_text(""); off(eti);
const esc = create_text(""); off(esc);
const ebt = create_rectangle(120, 36); off(ebt); cc(ebt, [255,152,0,255]);
const ebtt = create_text("RESTART"); off(ebtt);

// === 音频 ===
const V = "https://raw.githubusercontent.com/jiayihe096-sudo/nus-bird-audio/master/";
const FL = ["bird_01_bulbul.mp3","bird_02_myna.mp3","bird_03_sparrow.mp3",
            "bird_04_zebra_dove.mp3","bird_05_owl.mp3","bird_06_junglefowl.mp3",
            "bird_08_pigeon_b.mp3","bird_07_pigeon_a.mp3"];
const CL = [];
for (let i = 0; i < 8; i = i + 1) { CL[i] = create_audio(V + FL[i], 1); }

// === 状态 ===
let playing = -1; let aq = -1;
let bi = 0; let mi = 0; let pa = -1; let bo = 0; let co = 0;
let at = 0; let lc = 0;

// 鸽子A (index 6) 剧情
let trig = 0; let ph = 0; let pf = 0;

function HB(b, n) { return math_floor(b / math_pow(2, n)) % 2 === 1; }
function SET(b, n) { const m = math_pow(2, n); if (math_floor(b / m) % 2 === 1) { return b; } else { return b + m; } }
function IR(x, y, rx, ry, rw, rh) {
    if (x > rx - rw/2) { if (x < rx + rw/2) { if (y > ry - rh/2) { if (y < ry + rh/2) { return true; } } } } return false;
}
function tf() { let c = 0; for (let i = 0; i < 8; i = i + 1) { if (HB(bi, i)) { c = c + 1; } } return c; }
function INF(i) {
    if (i === 0) { return ["黄臀鹎","Bulbul","清脆上扬鸣叫","树冠活动吃果实昆虫"]; }
    else if (i === 1) { return ["爪哇八哥","Myna","响亮多变叫声","草地餐厅大胆觅食"]; }
    else if (i === 2) { return ["家麻雀","Sparrow","短促啾啾声","成群活动草丛"]; }
    else if (i === 3) { return ["斑姬地鸠","Zebra Dove","低沉咕咕声","地面觅食点头步态"]; }
    else if (i === 4) { return ["领角鸮","Scops Owl","悠长呼——呼——","树洞半露大圆眼"]; }
    else if (i === 5) { return ["红原鸡","Junglefowl","响亮咯咯咯","NUS大摇大摆散步"]; }
    else if (i === 6) { return ["鸽子A","Pigeon A","平稳咕咕声","从天而降"]; }
    else { return ["鸽子B","Pigeon B","平稳咕咕声","喜欢COM3"]; }
}
function stopCur() { if (playing >= 0) { stop_audio(CL[playing]); playing = -1; } }

// === 主循环 ===
function tick(s) {
    if (aq >= 0) { stopCur(); play_audio(CL[aq]); playing = aq; aq = -1; }

    // 鸽子剧情
    if (ph === 1) { pf = pf + 1; if (pf >= 12) { ph = 2; pf = 0; } }
    else if (ph === 2) { pf = pf + 1; if (pf >= 60) { ph = 0; trig = 1; } }
    else { }

    if (bo > 0.01) { bo = bo * 0.85; } else { bo = 0; }
    at = at + 1;

    // 鼠标自由滚屏 (上下左右)
    const mp = query_pointer_position();
    const mx = mp[0];
    const my = mp[1];
    scrollX = mx / 900 * (WORLD_W - 900);
    scrollY = my / 600 * (WORLD_H - 600);
    if (scrollX < 0) { scrollX = 0; }
    if (scrollX > WORLD_W - 900) { scrollX = WORLD_W - 900; }
    if (scrollY < 0) { scrollY = 0; }
    if (scrollY > WORLD_H - 600) { scrollY = WORLD_H - 600; }

    // 更新背景跟上视口
    go(bg, WORLD_W / 2 - scrollX, WORLD_H / 2 - scrollY);
    go(ground, WORLD_W / 2 - scrollX, WORLD_H - 100 - scrollY);

    // 更新鸟位置
    for (let i = 0; i < 8; i = i + 1) {
        if (!HB(bi, i)) {
            if (i === 6 && trig === 0 && ph === 0) { off(sprites[i]); }
            else if (i === 6 && ph === 2) {
                const t = pf / 60;
                const fsx = 2100 - 400 * t;
                const fsy = -80 + 290 * t + math_sin(t * 3.14) * 60;
                const fsc = 0.2 + 0.8 * t;
                go(sprites[6], fsx - scrollX, fsy - scrollY);
                update_scale(sprites[6], [fsc, fsc]);
            }
            else {
                go(sprites[i], sx(i), sy(i));
            }
        }
        else { off(sprites[i]); }
    }

    // 呼吸+悬停动画
    for (let i = 0; i < 8; i = i + 1) {
        if (!HB(bi, i)) {
            if (i === 6 && trig === 0 && ph === 0) { }
            else if (i === 6 && ph === 2) { }
            else {
                const brh = 1 + math_sin(at * 0.05 + i * 1.2) * 0.04;
                let s = WS[i] * brh;
                if (pointer_over_gameobject(sprites[i])) { s = s * 1.2; }
                update_scale(sprites[i], [s, s]);
            }
        }
    }

    // 计数器
    const rem = 8 - tf();
    update_text(cnt, stringify(rem) + " left");

    // 吃饭场景可见性
    if (trig === 0 && ph === 0 && !HB(bi, 6)) {
        go(tbl, guyX - scrollX, guyY + 20 - scrollY);
        go(plate, guyX + 22 - scrollX, guyY + 16 - scrollY);
        go(food, guyX + 22 - scrollX, guyY + 14 - scrollY);
        go(chop1, guyX + 18 - scrollX, guyY + 8 - scrollY);
        go(chop2, guyX + 22 - scrollX, guyY + 8 - scrollY);
        go(guyBody, guyX - scrollX, guyY - scrollY);
        go(guyHead, guyX - scrollX, guyY - 28 - scrollY);
    } else {
        off(tbl); off(plate); off(food); off(chop1); off(chop2);
        off(guyBody); off(guyHead);
    }

    // 弹窗
    if (pa >= 0) {
        const info = INF(pa);
        go(pbg, 450, 300); go(pti, 450, 265); update_text(pti, info[0]);
        go(pde, 450, 295); update_text(pde, info[2]);
        go(pcb, 450, 382); go(pct, 450, 382);
    } else { off(pbg); off(pti); off(pde); off(pcb); off(pct); }

    // 结算
    if (co === 1) {
        go(ebg, 450, 300); go(eti, 450, 240); update_text(eti, "ALL 8 BIRDS FOUND!");
        go(esc, 450, 290); update_text(esc, "Miss: " + stringify(mi));
        go(ebt, 450, 370); go(ebtt, 450, 370);
    }

    // 点击
    if (input_left_mouse_down()) { lc = lc + 1; }
    if (lc > 0) { lc = lc - 1;
        if (co === 1) { if (IR(mx, 370, 450, 370, 120, 36)) {
            bi = 0; trig = 0; mi = 0; pa = -1; bo = 0; co = 0; ph = 0; pf = 0; at = 0; scrollX = 0; scrollY = 0;
            stopCur(); off(ebg); off(eti); off(esc); off(ebt); off(ebtt);
        } }
        if (pa >= 0) { if (IR(mx, 382, 450, 382, 80, 30)) { pa = -1; stopCur(); } }
        if (ph === 0) { if (pa < 0) { if (co === 0) {
            // 全景中点击鸟: 世界坐标 = 屏幕坐标 + scrollX/scrollY
            const wx = mx + scrollX;
            const wy = my + scrollY;
            let hit = -1;
            for (let i = 0; i < 8; i = i + 1) {
                if (!HB(bi, i)) {
                    if (i === 6 && trig === 0 && ph === 0) { }
                    else if (i === 6 && ph === 2) {
                        const f2t = pf / 60;
                        const f2x = 2100 - 400 * f2t;
                        const f2y = -80 + 290 * f2t + math_sin(f2t * 3.14) * 60;
                        if (IR(wx, wy, f2x, f2y, 60, 50)) { hit = i; }
                    }
                    else {
                        if (IR(wx, wy, WX[i], WY[i], 60, 50)) { hit = i; }
                    }
                }
            }
            // 鸽子A触发: 点吃饭的人
            if (hit < 0 && wy > 720 && wy < 790 && wx > 1550 && wx < 1610) {
                if (trig === 0 && !HB(bi, 6)) { ph = 1; pf = 0; }
            }
            if (hit >= 0) {
                bi = SET(bi, hit); pa = hit; bo = 1; aq = hit;
                if (hit === 6 && ph === 2) { trig = 1; ph = 0; }
                if (tf() >= 8) { co = 1; }
            } else { mi = mi + 1; }
        } } }
    }
}

update_loop(tick);
build_game();
