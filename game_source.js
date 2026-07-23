// ============================================================
// ============================================================
//  NUS 校园寻鸟游戏 — Source §3 Rune 版本
//  SICP Source Academy 运行：先在 Modules 标签页导入 sound 和 rune
// ============================================================

import { sine_sound, triangle_sound, sawtooth_sound, square_sound, play, consecutively, simultaneously, silence_sound, adsr, phase_mod } from "sound";
import { circle, overlay, translate, rotate, scale, square, triangle, blank, ellipse, text } from "rune";

// rectangle 不在 rune, 用 scale 组合实现
function rectangle(w, h, mode, color) {
    return scale(w / h, 1, square(h, mode, color));
}

// empty_scene: 新版 rune 没有此函数，用 blank 替代
function empty_scene(w, h) {
    return blank;
}

// ==================== 画布尺寸 ====================
const W = 900;
const H = 600;
const HW = 450;
const HH = 300;

// ==================== 场景常量 ====================
const SCENE_LAWN = 0;
const SCENE_CANTEEN = 1;

// ==================== 鸟索引 (0-7) ====================
const B_BULBUL = 0;
const B_MYNA = 1;
const B_SPARROW = 2;
const B_ZEBRADOVE = 3;
const B_OWL = 4;
const B_JUNGLEFOWL = 5;
const B_PIGEONA = 6;
const B_PIGEONB = 7;

// ==================== 鸽子剧情阶段 ====================
const PS_IDLE = 0;
const PS_BUBBLE_IN = 1;
const PS_BUBBLE_SHOW = 2;
const PS_DROPPING = 3;
const PS_DONE = 4;

// ==================== 状态索引 ====================
const SI_SCENE = 0;
const SI_BITS = 1;
const SI_TRIG = 2;
const SI_MISS = 3;
const SI_PANEL = 4;
const SI_BOUNCE = 5;
const SI_COMPLETE = 6;
const SI_PHASE = 7;
const SI_FRAME = 8;
const SI_PY = 9;
const SI_ANIM_TIME = 10;
const SI_FOUND_FLASH = 11;
const SI_COMP_PROG = 12;
const SI_FOUND_ORDER = 13;

const STATE_LEN = 14;

// ==================== 颜色 ====================
const C_SKY = "#87CEEB";
const C_LAWN = "#4A7C2E";
const C_LAWN_L = "#7CB342";
const C_TRUNK = "#8B6914";
const C_CANOPY_A = "#4A8B2C";
const C_CANOPY_B = "#5C9E3A";
const C_CANOPY_C = "#3D7A22";
const C_CANOPY_D = "#6BAF3F";
const C_HOLE = "#2A1A0A";
const C_FENCE_R = "#8D6E63";
const C_FENCE_P = "#A1887F";
const C_DIRT = "#6B4226";
const C_FLOWER_R = "#FF6B6B";
const C_FLOWER_Y = "#FFD93D";
const C_FLOWER_M = "#FFA000";
const C_CEIL = "#F5F0E8";
const C_WALL = "#EFEBE0";
const C_FLOOR = "#C4B8A8";
const C_TABLE_C = "#A1887F";
const C_TABLE_L = "#8D6E63";
const C_PLATE = "#FAFAFA";
const C_CHAIR_S = "#6D4C41";
const C_CHAIR_L = "#5D4037";
const C_WINDOW = "#87CEEB";
const C_WIN_F = "#5D4037";
const C_SIGN_BG = "#5D4037";
const C_SIGN_TX = "#FFF8E1";
const C_PERSON_B = "#1565C0";
const C_SKIN = "#FFCC80";
const C_HAIR = "#3E2723";
const C_WHITE = "#FFFFFF";
const C_BLACK = "#000000";
const C_RED = "#FF0000";
const C_GREEN = "#4CAF50";
const C_ORANGE = "#FF9800";
const C_DGREEN = "#2E7D32";
const C_PANEL_BG = "#FFFEF9";
const C_PANEL_BD = "#8D6E63";
const C_BROWN = "#8B6914";
const C_DARK_BR = "#6B4F12";
const C_YELLOW = "#FFD600";
const C_DARK_GY = "#3A3A3A";
const C_DARKER_G = "#2A2A2A";
const C_EYE_YEL = "#FFB300";
const C_EAK_ORA = "#FF8F00";
const C_SP_BODY = "#A0522D";
const C_SP_HEAD = "#8B4513";
const C_SP_CHEEK = "#F5F5DC";
const C_ZEBRA = "#8B8682";
const C_ZEBRA_L = "#A09894";
const C_OWL_BODY = "#6B5B4B";
const C_OWL_FACE = "#7D6B5A";
const C_OWL_TUFT = "#5A4A3A";
const C_OWL_EYE = "#FFFEF0";
const C_OWL_PUPIL = "#1A1A00";
const C_JF_BODY = "#8B3A3A";
const C_JF_GOLD = "#CC8833";
const C_JF_WING = "#7A2E2E";
const C_JF_HEAD = "#A04030";
const C_JF_COMB = "#FF2020";
const C_JF_TAIL = "#2A1A0A";
const C_PIG_BODY = "#808080";
const C_PIG_HEAD = "#707070";
const C_PIG_WING = "#6E6E6E";
const C_PIG_TAIL = "#555555";
const C_PIG_EYE = "#FF6F00";
const C_NECK_P = "#9B59B6";
const C_NECK_B = "#3498DB";
const C_NECK_G = "#2ECC71";

// ==================== 鸟位置 [x, y, w, h] ====================
const POS_LAWN_0 = [580,  70, 60, 45];
const POS_LAWN_1 = [350, 395, 55, 40];
const POS_LAWN_2 = [200, 360, 40, 30];
const POS_LAWN_3 = [680, 320, 55, 40];
const POS_LAWN_4 = [130, 280, 50, 50];

const POS_CANT_0 = [620, 370, 70, 55];
const POS_CANT_1 = [350, 250, 50, 40];
const POS_CANT_2 = [750, 220, 50, 40];

// ==================== 鸟文字描述 [zh, en, line1, line2, line3, line4] ====================
const INFO_0 = ["黄臀鹎","Yellow-vented Bulbul",
    "新加坡最常见鸣禽之一。","头顶深褐，臀部鲜黄色。",
    "叫声清脆上扬，常在树冠活动。","以果实和昆虫为食。"];
const INFO_1 = ["爪哇八哥","Javan Myna",
    "全身深灰近黑，眼周鲜黄裸皮。","性格大胆，常在草地和餐厅觅食。",
    "叫声响亮多变，擅长模仿。","原产爪哇岛。"];
const INFO_2 = ["家麻雀","Eurasian Tree Sparrow",
    "体型小巧，头顶栗色。","脸颊白色带黑斑。",
    "成群活动于草丛灌木丛。","NUS校园随处可见。"];
const INFO_3 = ["斑姬地鸠","Zebra Dove",
    "灰褐色羽毛，体型纤长。","颈侧黑白条纹如斑马纹。",
    "常在地面觅食，点头步态。","叫声低沉\"咕咕\"声。"];
const INFO_4 = ["领角鸮","Collared Scops Owl",
    "小型猫头鹰，有耳簇羽。","灰棕斑驳树皮色。",
    "白天藏在树洞里只露半脸。","大圆眼睛是发现关键！"];
const INFO_5 = ["红原鸡","Red Junglefowl",
    "家鸡的野生祖先！","羽毛红棕金橙相间。",
    "鲜红肉冠是标志。","NUS校园大摇大摆散步。"];
const INFO_6 = ["鸽子 A","Rock Pigeon",
    "从天而降精准落在餐桌——","看来也是个美食家！",
    "灰蓝羽毛，彩虹颈环。","导航能力惊人。"];
const INFO_7 = ["鸽子 B","Rock Pigeon",
    "直接可见的灰蓝色鸽子。","颈部有彩虹闪光羽毛。",
    "导航能力可达数百公里。","对COM3餐桌很感兴趣。"];

// ==================== 鸟叫声 [freq, dur, freq, dur, ..., -1] ====================
// 节奏和频率基于真实鸟叫特征精调
// 谐波叠加由 play_snd_for 自动处理 (基频 + 二次谐波同时播放)

// 黄臀鹎: 4音节清脆上扬, 800→1450Hz
const SND_0 = [800,0.10, 950,0.08, 1100,0.08, 1450,0.20, -1];

// 爪哇八哥: 5音节响亮多变, 480→430Hz 逐渐下降
const SND_1 = [480,0.08, 560,0.08, 620,0.10, 520,0.16, 430,0.18, -1];

// 家麻雀: 5个超短啾, 间隔极短, 1000Hz附近微变
const SND_2 = [1000,0.04, 980,0.04, 1030,0.04, 950,0.04, 990,0.05, -1];

// 斑姬地鸠: 4音节低频柔和咕咕, 285→305→315→295Hz
const SND_3 = [285,0.22, 305,0.20, 315,0.20, 295,0.26, -1];

// 领角鸮: 2音节低沉 goog-gook, 245→265Hz
const SND_4 = [245,0.40, 265,0.45, -1];

// 红原鸡: 4音节逐降喔喔, 最后一音突然截断
const SND_5 = [720,0.16, 650,0.13, 560,0.11, 480,0.06, -1];

// 鸽子A: 3音节颤抖咕咕, 快速音高微变模拟waver
const SND_6 = [350,0.06, 355,0.06, 350,0.06, 348,0.06, 345,0.06, 346,0.06, 345,0.06, 348,0.06, 350,0.06, 350,0.06, 348,0.06, 350,0.10, -1];

// 鸽子B: 同上, 音高略不同
const SND_7 = [355,0.06, 358,0.06, 355,0.06, 352,0.06, 350,0.06, 351,0.06, 350,0.06, 352,0.06, 355,0.06, 355,0.06, 352,0.06, 355,0.10, -1];

// ==================== 工具函数 ====================

// 检查位 (不用位运算, 用除法和取模)
function bit_test(bits, n) {
    const mask = math_pow(2, n);
    return math_floor(bits / mask) % 2 === 1;
}

// 设置位
function bit_set(bits, n) {
    const mask = math_pow(2, n);
    if (math_floor(bits / mask) % 2 === 1) {
        return bits;
    }
    return bits + mask;
}

// 碰撞检测
function rect_hit(mx, my, rx, ry, rw, rh) {
    return mx >= rx && mx <= rx + rw
        && my >= ry && my <= ry + rh;
}

// 复制状态数组 (Source §3 需要手动逐元素复制)
function copy_state(s) {
    const ns = [];
    ns[0] = s[0]; ns[1] = s[1]; ns[2] = s[2]; ns[3] = s[3];
    ns[4] = s[4]; ns[5] = s[5]; ns[6] = s[6]; ns[7] = s[7];
    ns[8] = s[8]; ns[9] = s[9]; ns[10] = s[10]; ns[11] = s[11];
    ns[12] = s[12]; ns[13] = s[13];
    return ns;
}

// ==================== 初始状态 ====================

function make_initial_state() {
    const s = [];
    s[SI_SCENE] = SCENE_LAWN;
    s[SI_BITS] = 0;
    s[SI_TRIG] = 0;
    s[SI_MISS] = 0;
    s[SI_PANEL] = -1;
    s[SI_BOUNCE] = 0;
    s[SI_COMPLETE] = 0;
    s[SI_PHASE] = PS_IDLE;
    s[SI_FRAME] = 0;
    s[SI_PY] = -100;
    s[SI_ANIM_TIME] = 0;
    s[SI_FOUND_FLASH] = 0;
    s[SI_COMP_PROG] = 0;
    s[SI_FOUND_ORDER] = 0;
    return s;
}

// ==================== 场景计数 ====================

function scene_found_count(state, scene_type) {
    let count = 0;
    if (scene_type === SCENE_LAWN) {
        if (bit_test(state[SI_BITS], 0)) { count = count + 1; }
        if (bit_test(state[SI_BITS], 1)) { count = count + 1; }
        if (bit_test(state[SI_BITS], 2)) { count = count + 1; }
        if (bit_test(state[SI_BITS], 3)) { count = count + 1; }
        if (bit_test(state[SI_BITS], 4)) { count = count + 1; }
    } else {
        if (bit_test(state[SI_BITS], 5)) { count = count + 1; }
        if (bit_test(state[SI_BITS], 6)) { count = count + 1; }
        if (bit_test(state[SI_BITS], 7)) { count = count + 1; }
    }
    return count;
}

function all_found(state) {
    return state[SI_BITS] === 255;
}

// 计算已找到的鸟数量
function count_found(bits) {
    let count = 0;
    for (let i = 0; i < 8; i = i + 1) {
        if (bit_test(bits, i)) { count = count + 1; }
    }
    return count;
}

// ==================== 鸟点击检测 ====================

function bird_hit(state, mx, my) {
    const sc = state[SI_SCENE];
    const bits = state[SI_BITS];
    const trig = state[SI_TRIG];

    if (sc === SCENE_LAWN) {
        // bulbul
        const b0 = POS_LAWN_0;
        if (!bit_test(bits, B_BULBUL)) {
            if (rect_hit(mx, my, b0[0]-b0[2]/2, b0[1]-b0[3]/2, b0[2], b0[3])) {
                return B_BULBUL;
            }
        }
        // myna
        const b1 = POS_LAWN_1;
        if (!bit_test(bits, B_MYNA)) {
            if (rect_hit(mx, my, b1[0]-b1[2]/2, b1[1]-b1[3]/2, b1[2], b1[3])) {
                return B_MYNA;
            }
        }
        // sparrow
        const b2 = POS_LAWN_2;
        if (!bit_test(bits, B_SPARROW)) {
            if (rect_hit(mx, my, b2[0]-b2[2]/2, b2[1]-b2[3]/2, b2[2], b2[3])) {
                return B_SPARROW;
            }
        }
        // zebra dove
        const b3 = POS_LAWN_3;
        if (!bit_test(bits, B_ZEBRADOVE)) {
            if (rect_hit(mx, my, b3[0]-b3[2]/2, b3[1]-b3[3]/2, b3[2], b3[3])) {
                return B_ZEBRADOVE;
            }
        }
        // owl
        const b4 = POS_LAWN_4;
        if (!bit_test(bits, B_OWL)) {
            if (rect_hit(mx, my, b4[0]-b4[2]/2, b4[1]-b4[3]/2, b4[2], b4[3])) {
                return B_OWL;
            }
        }
    } else {
        // junglefowl
        const b0 = POS_CANT_0;
        if (!bit_test(bits, B_JUNGLEFOWL)) {
            if (rect_hit(mx, my, b0[0]-b0[2]/2, b0[1]-b0[3]/2, b0[2], b0[3])) {
                return B_JUNGLEFOWL;
            }
        }
        // pigeonA (仅在trigger后、未找到时可见)
        const b1 = POS_CANT_1;
        if (trig === 1 && !bit_test(bits, B_PIGEONA)) {
            const py = state[SI_PHASE] === PS_DROPPING ? state[SI_PY] : b1[1];
            if (rect_hit(mx, my, b1[0]-b1[2]/2, py-b1[3]/2, b1[2], b1[3])) {
                return B_PIGEONA;
            }
        }
        // pigeonB
        const b2 = POS_CANT_2;
        if (!bit_test(bits, B_PIGEONB)) {
            if (rect_hit(mx, my, b2[0]-b2[2]/2, b2[1]-b2[3]/2, b2[2], b2[3])) {
                return B_PIGEONB;
            }
        }
    }
    return -1;
}

// ==================== 音效 ====================

// 每只鸟的 oscillator 类型
// 0=sine, 1=triangle, 2=sawtooth, 3=square, 4=square+saw 叠加, 5=sine+vibrato
const OSC_TYPES = [0, 4, 2, 1, 1, 2, 5, 5];

// 每只鸟的 ADSR 包络 [attack, decay, sustain_level, release]
// 根据鸟的叫声特征精调
const ENV_0 = [0.02, 0.06, 0.65, 0.04]; // 黄臀鹎: 清脆上扬
const ENV_1 = [0.01, 0.05, 0.55, 0.05]; // 爪哇八哥: 响亮短促
const ENV_2 = [0.01, 0.02, 0.50, 0.02]; // 家麻雀: 超短啾
const ENV_3 = [0.04, 0.10, 0.70, 0.08]; // 斑姬地鸠: 柔和缓慢
const ENV_4 = [0.06, 0.15, 0.75, 0.12]; // 领角鸮: 低沉悠长
const ENV_5 = [0.01, 0.04, 0.55, 0.03]; // 红原鸡: 响亮急促, 末音截断
const ENV_6 = [0.02, 0.06, 0.65, 0.04]; // 鸽子A/B: 平稳咕叫+颤抖
const ENV_7 = [0.02, 0.06, 0.65, 0.04];
const ENVS = [ENV_0, ENV_1, ENV_2, ENV_3, ENV_4, ENV_5, ENV_6, ENV_7];

// 每只鸟的 SND 数据数组
const ALL_SNDS = [SND_0, SND_1, SND_2, SND_3, SND_4, SND_5, SND_6, SND_7];

// 制作单音
function make_note(osc_type, freq, dur, env) {
    let raw = sine_sound(freq, dur);
    if (osc_type === 1) {
        raw = triangle_sound(freq, dur);
    } else if (osc_type === 2) {
        raw = sawtooth_sound(freq, dur);
    } else if (osc_type === 3) {
        raw = square_sound(freq, dur);
    } else if (osc_type === 4) {
        // square + saw 叠加, 模仿爪哇八哥响亮多变的叫声
        raw = simultaneously(list(
            square_sound(freq, dur),
            sawtooth_sound(freq, dur)
        ));
    } else if (osc_type === 5) {
        // sine + phase_mod vibrato, 模仿鸽子颤抖的咕咕声
        raw = phase_mod(sine_sound(freq, dur), 6, 4);
    } else { }
    return adsr(env[0], env[1], env[2], env[3])(raw);
}

// 播放合成鸟叫 (用指定的 oscillator 类型 + ADSR 包络)
function play_synth_call(index) {
    const osc_type = OSC_TYPES[index];
    const snd_arr = ALL_SNDS[index];
    const env = ENVS[index];

    let parts = null;
    let i = 0;
    while (i < 20 && snd_arr[i] >= 0) {
        const freq = snd_arr[i];
        const dur = snd_arr[i + 1];
        if (freq >= 0 && dur > 0) {
            const note = make_note(osc_type, freq, dur, env);
            if (parts === null) {
                parts = note;
            } else {
                parts = consecutively(list(parts, silence_sound(0.02), note));
            }
        }
        i = i + 2;
    }
    if (parts !== null) {
        play(parts);
    }
    return undefined;
}

// 播放完成音效: 欢快的上升 5 音阶
function play_complete_fanfare() {
    const notes = [523, 659, 784, 880, 1047]; // C5 E5 G5 A5 C6
    let song = null;
    for (let i = 0; i < 5; i = i + 1) {
        const note = adsr(0.02, 0.08, 0.7, 0.06)(triangle_sound(notes[i], 0.15));
        if (song === null) {
            song = note;
        } else {
            song = consecutively(list(song, silence_sound(0.04), note));
        }
    }
    if (song !== null) { play(song); }
    return undefined;
}

// ==================== Rune 绘图辅助 ====================

// 在场景的绝对坐标 (px, py) 处叠加图像
// 坐标原点 = 场景左上角, Rune 原点 = 场景中心
function place(px, py, img, scene) {
    return overlay(translate(px - HW, py - HH, img), scene);
}

// 叠加多个图像 (第一项在最上面)
function stack_all(imgs, n) {
    let result = imgs[n - 1];
    for (let i = n - 2; i >= 0; i = i - 1) {
        result = overlay(imgs[i], result);
    }
    return result;
}

// ==================== 鸟类绘图 (返回 Image) ====================

function mk_bulbul() {
    const body = ellipse(40, 26, "solid", C_BROWN);
    const head = translate(16, -8, circle(10, "solid", C_DARK_BR));
    const rump = translate(-14, 2, ellipse(14, 10, "solid", C_YELLOW));
    const eye  = translate(20, -10, circle(3, "solid", C_BLACK));
    const beak = translate(28, -8, rotate(0.3, triangle(8, "solid", "#333333")));
    const wing = translate(-2, -2, rotate(-0.3, ellipse(28, 16, "solid", "#7A5A10")));
    let img = body;
    img = overlay(head, img);
    img = overlay(rump, img);
    img = overlay(eye, img);
    img = overlay(beak, img);
    img = overlay(wing, img);
    return img;
}

function mk_myna() {
    const body = ellipse(42, 28, "solid", C_DARK_GY);
    const head = translate(14, -10, circle(11, "solid", C_DARKER_G));
    const ep   = translate(16, -13, circle(5, "solid", C_EYE_YEL));
    const pup  = translate(17, -13, circle(2, "solid", C_BLACK));
    const beak = translate(27, -9, rotate(0.2, triangle(8, "solid", C_EAK_ORA)));
    const wing = translate(0, 0, rotate(-0.2, ellipse(32, 18, "solid", "#2E2E2E")));
    const tail = translate(-22, 2, rotate(0.2, triangle(14, "solid", C_DARKER_G)));
    let img = body;
    img = overlay(head, img);
    img = overlay(ep, img);
    img = overlay(pup, img);
    img = overlay(beak, img);
    img = overlay(wing, img);
    img = overlay(tail, img);
    return img;
}

function mk_sparrow() {
    const body  = ellipse(28, 20, "solid", C_SP_BODY);
    const head  = translate(10, -7, circle(8, "solid", C_SP_HEAD));
    const cheek = translate(12, -4, circle(5, "solid", C_SP_CHEEK));
    const eye   = translate(13, -9, circle(2, "solid", C_BLACK));
    const beak  = translate(19, -6, rotate(0.4, triangle(5, "solid", "#555555")));
    let img = body;
    img = overlay(head, img);
    img = overlay(cheek, img);
    img = overlay(eye, img);
    img = overlay(beak, img);
    return img;
}

function mk_zebra_dove() {
    const body = ellipse(40, 26, "solid", C_ZEBRA);
    const head = translate(15, -8, circle(9, "solid", C_ZEBRA_L));
    const eye  = translate(18, -10, circle(2, "solid", C_BLACK));
    const beak = translate(25, -7, rotate(0.3, triangle(6, "solid", "#444444")));
    const s1 = translate(6, -2, rectangle(3, 10, "solid", C_BLACK));
    const s2 = translate(12, -2, rectangle(3, 10, "solid", C_WHITE));
    const s3 = translate(9, -1, rectangle(3, 10, "solid", C_BLACK));
    const s4 = translate(15, -1, rectangle(3, 10, "solid", C_WHITE));
    let img = body;
    img = overlay(head, img);
    img = overlay(s1, img);
    img = overlay(s2, img);
    img = overlay(s3, img);
    img = overlay(s4, img);
    img = overlay(eye, img);
    img = overlay(beak, img);
    return img;
}

function mk_owl() {
    const body   = ellipse(36, 20, "solid", C_OWL_BODY);
    const face   = translate(0, -4, ellipse(32, 24, "solid", C_OWL_FACE));
    const tuft_l = translate(-10, -18, rotate(-0.6, triangle(14, "solid", C_OWL_TUFT)));
    const tuft_r = translate(10, -18, rotate(0.6, triangle(14, "solid", C_OWL_TUFT)));
    const ew_l   = translate(-9, -10, circle(10, "solid", C_OWL_EYE));
    const ew_r   = translate(9, -10, circle(10, "solid", C_OWL_EYE));
    const pl_l   = translate(-9, -10, circle(6, "solid", C_OWL_PUPIL));
    const pl_r   = translate(9, -10, circle(6, "solid", C_OWL_PUPIL));
    const gl_l   = translate(-7, -12, circle(2, "solid", C_WHITE));
    const gl_r   = translate(11, -12, circle(2, "solid", C_WHITE));
    const beak   = translate(0, -4, triangle(5, "solid", "#444444"));
    let img = body;
    img = overlay(face, img);
    img = overlay(tuft_l, img);
    img = overlay(tuft_r, img);
    img = overlay(ew_l, img);
    img = overlay(ew_r, img);
    img = overlay(pl_l, img);
    img = overlay(pl_r, img);
    img = overlay(gl_l, img);
    img = overlay(gl_r, img);
    img = overlay(beak, img);
    return img;
}

function mk_junglefowl() {
    const body  = ellipse(52, 34, "solid", C_JF_BODY);
    const chest = translate(8, 2, ellipse(24, 20, "solid", C_JF_GOLD));
    const wing  = translate(-3, 0, rotate(-0.3, ellipse(40, 22, "solid", C_JF_WING)));
    const head  = translate(18, -12, circle(11, "solid", C_JF_HEAD));
    const c1 = translate(14, -28, rotate(-0.3, triangle(14, "solid", C_JF_COMB)));
    const c2 = translate(18, -32, triangle(12, "solid", C_JF_COMB));
    const c3 = translate(22, -28, rotate(0.3, triangle(14, "solid", C_JF_COMB)));
    const eo  = translate(22, -14, circle(3, "solid", "#FF8F00"));
    const eb  = translate(23, -14, circle(2, "solid", C_BLACK));
    const beak = translate(30, -12, rotate(0.15, triangle(10, "solid", "#FF8F00")));
    const t1 = translate(-33, -10, rotate(-0.4, triangle(20, "solid", C_JF_TAIL)));
    const t2 = translate(-37, -2, rotate(-0.2, triangle(18, "solid", C_JF_TAIL)));
    const ll = translate(-2, 32, rectangle(4, 18, "solid", C_TRUNK));
    const lr = translate(8, 32, rectangle(4, 18, "solid", C_TRUNK));
    let img = body;
    img = overlay(chest, img);
    img = overlay(wing, img);
    img = overlay(head, img);
    img = overlay(c1, img);
    img = overlay(c2, img);
    img = overlay(c3, img);
    img = overlay(eo, img);
    img = overlay(eb, img);
    img = overlay(beak, img);
    img = overlay(t1, img);
    img = overlay(t2, img);
    img = overlay(ll, img);
    img = overlay(lr, img);
    return img;
}

function mk_pigeon() {
    const body  = ellipse(38, 26, "solid", C_PIG_BODY);
    const belly = translate(2, 3, ellipse(24, 16, "solid", "#A0A0A0"));
    const head  = translate(16, -8, circle(9, "solid", C_PIG_HEAD));
    const np = translate(6, 2, ellipse(18, 10, "solid", C_NECK_P));
    const nb = translate(11, 0, ellipse(16, 8, "solid", C_NECK_B));
    const ng = translate(10, -2, ellipse(14, 7, "solid", C_NECK_G));
    const eo = translate(19, -10, circle(3, "solid", C_PIG_EYE));
    const eb = translate(20, -10, circle(2, "solid", C_BLACK));
    const beak = translate(25, -8, rotate(0.4, triangle(7, "solid", "#444444")));
    const wing = translate(-2, -2, rotate(-0.2, ellipse(28, 18, "solid", C_PIG_WING)));
    const tail = translate(-20, 0, rotate(-0.1, triangle(12, "solid", C_PIG_TAIL)));
    let img = body;
    img = overlay(belly, img);
    img = overlay(head, img);
    img = overlay(np, img);
    img = overlay(nb, img);
    img = overlay(ng, img);
    img = overlay(eo, img);
    img = overlay(eb, img);
    img = overlay(beak, img);
    img = overlay(wing, img);
    img = overlay(tail, img);
    return img;
}

function draw_bird(index) {
    if (index === B_BULBUL)     { return mk_bulbul(); }
    if (index === B_MYNA)       { return mk_myna(); }
    if (index === B_SPARROW)    { return mk_sparrow(); }
    if (index === B_ZEBRADOVE)  { return mk_zebra_dove(); }
    if (index === B_OWL)        { return mk_owl(); }
    if (index === B_JUNGLEFOWL) { return mk_junglefowl(); }
    return mk_pigeon();
}

// 带动画的鸟绘图: 呼吸 + 发现弹跳
function draw_bird_animated(index, anim_time, found_flash) {
    let img = draw_bird(index);

    // 呼吸动画: 微小缩放 (±3%)
    const breath = 1 + math_sin(anim_time * 0.04 + index * 0.9) * 0.025;
    img = scale(breath, breath, img);

    // 发现弹跳: flash = bird_id*100 + timer
    if (found_flash > 0) {
        const flash_bird = math_floor(found_flash / 100);
        if (flash_bird === index) {
            const flash_timer = found_flash - flash_bird * 100;
            const pop = 1 + flash_timer / 15 * 0.4; // timer 15→0, scale 1.4→1.0
            img = scale(pop, pop, img);
        }
    }

    return img;
}

// ==================== 场景元素绘图 ====================

// 云 (以原点为中心, 缩放 s)
function mk_cloud(s) {
    const a = circle(25 * s, "solid", "#FFFFFFD9");
    const b = translate(20 * s, -12 * s, circle(20 * s, "solid", "#FFFFFFD9"));
    const c = translate(40 * s, 0, circle(22 * s, "solid", "#FFFFFFD9"));
    const d = translate(15 * s, 8 * s, circle(18 * s, "solid", "#FFFFFFD9"));
    let img = a;
    img = overlay(b, img);
    img = overlay(c, img);
    img = overlay(d, img);
    return img;
}

// 大树 (原点=树干底部中心)
function mk_tree() {
    const s = 0.85;
    const tw = 24 * s;
    const th = 160 * s;
    const trunk = translate(0, -th/2, rectangle(tw, th, "solid", C_TRUNK));
    const hole = translate(-4 * s, -125 * s, ellipse(12 * s, 15 * s, "solid", C_HOLE));
    let canopy = empty_scene(2, 2);
    const cols = [C_CANOPY_A, C_CANOPY_B, C_CANOPY_C, C_CANOPY_D];
    for (let i = 0; i < 15; i = i + 1) {
        const cx = math_sin(i * 1.3) * 60 * s;
        const cy = (-120 + math_cos(i * 0.9) * 50) * s;
        const cr = (22 + (i % 5) * 7) * s;
        const ci = i % 4;
        let col = C_CANOPY_A;
        if (ci === 1) { col = C_CANOPY_B; }
        if (ci === 2) { col = C_CANOPY_C; }
        if (ci === 3) { col = C_CANOPY_D; }
        canopy = overlay(translate(cx, cy, circle(cr, "solid", col)), canopy);
    }
    let img = trunk;
    img = overlay(hole, img);
    img = overlay(canopy, img);
    return img;
}

// 花坛
function mk_flowerbed(w, h) {
    let img = rectangle(w, h, "solid", C_DIRT);
    for (let i = 0; i < 5; i = i + 1) {
        const fx = -w/2 + 15 + i * (w / 5);
        const fy = (i % 2 === 0) ? -h/3 : 0;
        const col = (i % 2 === 0) ? C_FLOWER_R : C_FLOWER_Y;
        const petal = circle(7, "solid", col);
        const center = circle(3, "solid", C_FLOWER_M);
        img = overlay(translate(fx, fy, overlay(center, petal)), img);
    }
    return img;
}

// 栏杆
function mk_fence(w) {
    const r1 = translate(0, -5, rectangle(w, 4, "solid", C_FENCE_R));
    const r2 = translate(0, -30, rectangle(w, 4, "solid", C_FENCE_R));
    let posts = empty_scene(w, 60);
    for (let i = 0; i < 8; i = i + 1) {
        const fx = -w/2 + 5 + i * (w / 7);
        const top = translate(0, -8, triangle(8, "solid", C_FENCE_P));
        const pole = rectangle(6, 50, "solid", C_FENCE_P);
        posts = overlay(translate(fx, 0, overlay(top, pole)), posts);
    }
    let img = r2;
    img = overlay(r1, img);
    img = overlay(posts, img);
    return img;
}

// 餐桌
function mk_table(w, h) {
    const top = rectangle(w, h, "solid", C_TABLE_C);
    const leg = translate(0, h/2 + 15, rectangle(w * 0.7, 30, "solid", C_TABLE_L));
    const p1 = translate(-w * 0.2, -h * 0.1, circle(15, "solid", C_PLATE));
    let img = top;
    img = overlay(leg, img);
    img = overlay(p1, img);
    if (w > 140) {
        const p2 = translate(w * 0.2, -h * 0.1, circle(15, "solid", C_PLATE));
        img = overlay(p2, img);
    }
    return img;
}

// 椅子
function mk_chair() {
    const seat = rectangle(35, 30, "solid", C_CHAIR_S);
    const back = translate(0, -25, rectangle(35, 25, "solid", C_CHAIR_S));
    const ll = translate(-12, 15, rectangle(8, 25, "solid", C_CHAIR_L));
    const lr = translate(12, 15, rectangle(8, 25, "solid", C_CHAIR_L));
    let img = seat;
    img = overlay(back, img);
    img = overlay(ll, img);
    img = overlay(lr, img);
    return img;
}

// 窗户
function mk_window() {
    const glass = rectangle(120, 80, "solid", C_WINDOW);
    const frame = rectangle(120, 80, "outline", C_WIN_F);
    const vb = translate(60, 0, rectangle(3, 80, "solid", C_WIN_F));
    const hb = translate(0, 40, rectangle(120, 3, "solid", C_WIN_F));
    const t1 = translate(30, 20, circle(16, "solid", C_LAWN_L));
    const t2 = translate(95, 15, circle(13, "solid", C_LAWN_L));
    let img = glass;
    img = overlay(frame, img);
    img = overlay(vb, img);
    img = overlay(hb, img);
    img = overlay(t1, img);
    img = overlay(t2, img);
    return img;
}

// 吃饭的人
function mk_person() {
    const body  = translate(0, -5, rectangle(24, 30, "solid", C_PERSON_B));
    const head  = translate(0, -24, circle(11, "solid", C_SKIN));
    const hair  = translate(0, -28, circle(12, "solid", C_HAIR));
    const al    = translate(-14, 0, rectangle(5, 15, "solid", C_SKIN));
    const ar    = translate(14, 0, rectangle(5, 15, "solid", C_SKIN));
    const phone = translate(13, -2, rectangle(8, 12, "solid", C_BLACK));
    const plate = translate(5, 5, circle(10, "solid", C_PLATE));
    let img = body;
    img = overlay(head, img);
    img = overlay(hair, img);
    img = overlay(al, img);
    img = overlay(ar, img);
    img = overlay(phone, img);
    img = overlay(plate, img);
    return img;
}

// ==================== 场景绘制 ====================

function draw_lawn_background() {
    let scene = empty_scene(W, H);
    // 天空 + 草坪
    scene = place(0, 0, rectangle(W, 350, "solid", C_SKY), scene);
    scene = place(0, 350, rectangle(W, 250, "solid", C_LAWN), scene);
    scene = place(0, 340, rectangle(W, 40, "solid", C_LAWN_L), scene);
    // 云
    scene = place(120, 45, mk_cloud(0.8), scene);
    scene = place(550, 70, mk_cloud(0.6), scene);
    scene = place(780, 30, mk_cloud(0.9), scene);
    // 大树 (树干底部在 [80, 380])
    scene = place(80, 380, mk_tree(), scene);
    // 花坛
    scene = place(620, 430, mk_flowerbed(120, 40), scene);
    scene = place(380, 470, mk_flowerbed(90, 35), scene);
    scene = place(720, 510, mk_flowerbed(100, 35), scene);
    // 栏杆
    scene = place(675, 330, mk_fence(250), scene);
    return scene;
}

function draw_canteen_background() {
    let scene = empty_scene(W, H);
    // 天花板 + 墙壁 + 地板
    scene = place(0, 0, rectangle(W, 200, "solid", C_CEIL), scene);
    scene = place(0, 200, rectangle(W, 150, "solid", C_WALL), scene);
    scene = place(0, 350, rectangle(W, 250, "solid", C_FLOOR), scene);
    // 窗户 x5
    for (let i = 0; i < 5; i = i + 1) {
        scene = place(80 + i * 170, 10, mk_window(), scene);
    }
    // 招牌
    scene = place(350, 95, rectangle(200, 35, "solid", C_SIGN_BG), scene);
    scene = place(450, 112, text("COM3 餐厅", 18, C_SIGN_TX), scene);
    // 餐桌 (位置是餐桌左上角)
    scene = place(120, 410, mk_table(160, 80), scene);
    scene = place(370, 400, mk_table(180, 85), scene);
    scene = place(650, 415, mk_table(150, 75), scene);
    scene = place(250, 510, mk_table(140, 70), scene);
    scene = place(550, 505, mk_table(160, 75), scene);
    scene = place(750, 500, mk_table(130, 65), scene);
    // 椅子
    scene = place(60, 405, mk_chair(), scene);
    scene = place(260, 405, mk_chair(), scene);
    scene = place(300, 405, mk_chair(), scene);
    scene = place(470, 395, mk_chair(), scene);
    scene = place(550, 400, mk_chair(), scene);
    scene = place(590, 415, mk_chair(), scene);
    scene = place(710, 415, mk_chair(), scene);
    // 栏杆
    scene = place(0, 300, mk_fence(900), scene);
    return scene;
}

// ==================== to_draw ====================

function to_draw(state) {
    let scene = state[SI_SCENE] === SCENE_LAWN
        ? draw_lawn_background()
        : draw_canteen_background();

    const sc = state[SI_SCENE];
    const bits = state[SI_BITS];
    const trig = state[SI_TRIG];

    // --- 画出活跃的鸟 ---
    const anim_t = state[SI_ANIM_TIME];
    const flash = state[SI_FOUND_FLASH];
    if (sc === SCENE_LAWN) {
        if (!bit_test(bits, B_BULBUL))    { scene = place(POS_LAWN_0[0], POS_LAWN_0[1], draw_bird_animated(B_BULBUL, anim_t, flash), scene); }
        if (!bit_test(bits, B_MYNA))      { scene = place(POS_LAWN_1[0], POS_LAWN_1[1], draw_bird_animated(B_MYNA, anim_t, flash), scene); }
        if (!bit_test(bits, B_SPARROW))   { scene = place(POS_LAWN_2[0], POS_LAWN_2[1], draw_bird_animated(B_SPARROW, anim_t, flash), scene); }
        if (!bit_test(bits, B_ZEBRADOVE)) { scene = place(POS_LAWN_3[0], POS_LAWN_3[1], draw_bird_animated(B_ZEBRADOVE, anim_t, flash), scene); }
        if (!bit_test(bits, B_OWL))       { scene = place(POS_LAWN_4[0], POS_LAWN_4[1], draw_bird_animated(B_OWL, anim_t, flash), scene); }
    } else {
        // junglefowl
        if (!bit_test(bits, B_JUNGLEFOWL)) {
            scene = place(POS_CANT_0[0], POS_CANT_0[1], draw_bird_animated(B_JUNGLEFOWL, anim_t, flash), scene);
        }
        // pigeonA (剧情触发后可见)
        if (trig === 1 && !bit_test(bits, B_PIGEONA)) {
            const py = state[SI_PHASE] === PS_DROPPING ? state[SI_PY] : POS_CANT_1[1];
            scene = place(POS_CANT_1[0], py, draw_bird_animated(B_PIGEONA, anim_t, flash), scene);
        }
        // pigeonB
        if (!bit_test(bits, B_PIGEONB)) {
            scene = place(POS_CANT_2[0], POS_CANT_2[1], draw_bird_animated(B_PIGEONB, anim_t, flash), scene);
        }
        // 吃饭的人
        if (trig === 0) {
            scene = place(440, 310, mk_person(), scene);
        }
    }

    // --- 右上角计数器 ---
    const remaining = (sc === SCENE_LAWN ? 5 : 3) - scene_found_count(state, sc);
    const bounce = 1 + state[SI_BOUNCE] * 0.3;
    // 小鸟图标
    const body_icon = circle(10, "solid", C_YELLOW);
    const head_icon = translate(-7, 8, circle(6, "solid", "#FF8F00"));
    const eye_icon  = translate(-9, 7, circle(2, "solid", C_BLACK));
    const beak_icon = translate(-12, 8, triangle(5, "solid", "#FFB300"));
    let icon = body_icon;
    icon = overlay(head_icon, icon);
    icon = overlay(eye_icon, icon);
    icon = overlay(beak_icon, icon);
    const counter = overlay(
        translate(28, 6, text("x " + stringify(remaining), 16, C_WHITE)),
        scale(bounce, bounce, icon)
    );
    scene = place(W - 140, 30, counter, scene);

    // --- 场景切换按钮 ---
    const lf = scene_found_count(state, SCENE_LAWN);
    const cf = scene_found_count(state, SCENE_CANTEEN);
    const is_lawn = sc === SCENE_LAWN;
    const is_cant = sc === SCENE_CANTEEN;

    // 草坪按钮
    const lbl_l = "🌿 中央大草坪 (" + stringify(lf) + "/5)";
    const bg_l = is_lawn ? "#FFFFFFF2" : "#FFFFFF8C";
    const ol_l = is_lawn ? C_GREEN : "#FFFFFF4D";
    const tc_l = is_lawn ? C_DGREEN : "#555555";
    const btn_l = overlay(
        translate(115, 23, text(lbl_l, 14, tc_l)),
        overlay(rectangle(230, 38, "outline", ol_l), rectangle(230, 38, "solid", bg_l))
    );
    scene = place(180, H - 45, btn_l, scene);

    // 餐厅按钮
    const lbl_c = "🍽️ COM3 餐厅 (" + stringify(cf) + "/3)";
    const bg_c = is_cant ? "#FFFFFFF2" : "#FFFFFF8C";
    const ol_c = is_cant ? C_GREEN : "#FFFFFF4D";
    const tc_c = is_cant ? C_DGREEN : "#555555";
    const btn_c = overlay(
        translate(115, 23, text(lbl_c, 14, tc_c)),
        overlay(rectangle(230, 38, "outline", ol_c), rectangle(230, 38, "solid", bg_c))
    );
    scene = place(500, H - 45, btn_c, scene);

    // --- 介绍弹窗 ---
    const panel_idx = state[SI_PANEL];
    if (panel_idx >= 0 && panel_idx < 8) {
        const pw = 400;
        const ph = 240;
        const px = HW - pw/2;
        const py = HH - ph/2;
        // 遮罩
        scene = place(0, 0, rectangle(W, H, "solid", "#00000080"), scene);
        // 获取鸟信息
        let info = INFO_0;
        if (panel_idx === 1) { info = INFO_1; }
        if (panel_idx === 2) { info = INFO_2; }
        if (panel_idx === 3) { info = INFO_3; }
        if (panel_idx === 4) { info = INFO_4; }
        if (panel_idx === 5) { info = INFO_5; }
        if (panel_idx === 6) { info = INFO_6; }
        if (panel_idx === 7) { info = INFO_7; }
        // 面板
        let panel = rectangle(pw, ph, "solid", C_PANEL_BG);
        panel = overlay(rectangle(pw, ph, "outline", C_PANEL_BD), panel);
        panel = overlay(translate(pw/2, 25, text(info[0], 20, "#3E2723")), panel);
        panel = overlay(translate(pw/2, 50, text(info[1], 14, "#795548")), panel);
        panel = overlay(translate(0, 65, rectangle(pw - 60, 1, "solid", "#D7CCC8")), panel);
        for (let i = 0; i < 4; i = i + 1) {
            panel = overlay(translate(pw/2, 85 + i * 26, text(info[2 + i], 14, "#4E342E")), panel);
        }
        const cls_btn = overlay(
            translate(40, 16, text("关闭", 14, C_WHITE)),
            rectangle(80, 32, "solid", C_GREEN)
        );
        panel = overlay(translate(pw/2 - 40, ph - 45, cls_btn), panel);
        scene = place(px, py, panel, scene);
    }

    // --- 通关结算 ---
    if (state[SI_COMPLETE] === 1) {
        const comp_prog = state[SI_COMP_PROG];
        const ease = comp_prog < 0.5
            ? 2 * comp_prog * comp_prog
            : 1 - math_pow(-2 * comp_prog + 2, 2) / 2; // easeInOutCubic

        const pw = 500;
        const ph = 430;
        const px = HW - pw/2;
        const py = HH - ph/2;

        // 遮罩淡入
        scene = place(0, 0, rectangle(W, H, "solid", "#000000B2"), scene);

        // --- Confetti 粒子 (确定性轨迹, 基于动画帧) ---
        const confetti_colors = ["#FF6B6B","#FFD93D","#4CAF50","#2196F3",
                                  "#FF9800","#9C27B0","#00BCD4","#FF4081",
                                  "#EF7C00","#003D7C","#FFC107","#E91E63"];
        const num_confetti = 50;
        const anim_t_c = state[SI_ANIM_TIME];
        for (let ci = 0; ci < num_confetti; ci = ci + 1) {
            const seed = ci * 137.508;
            const cx = (seed * 31) % 900;
            const vy = 0.8 + (ci % 7) * 0.25;
            const start_delay = ci * 3;
            const elapsed = anim_t_c - start_delay;
            if (elapsed > 0 && comp_prog > 0.1) {
                const cy = (elapsed * vy) % 650 - 50;
                if (cy > -30 && cy < 650) {
                    const col = confetti_colors[ci % 12];
                    const cw = 5 + (seed % 5);
                    const ch = 4 + ((seed * 3) % 7);
                    scene = place(cx, cy, rectangle(cw, ch, "solid", col), scene);
                }
            }
        }

        // --- 面板入场动画 ---
        const panel_scale = 0.5 + 0.5 * ease;

        // 面板背景
        let ep = rectangle(pw, ph, "solid", "#FFFEF9");
        ep = overlay(rectangle(pw, ph, "outline", "#FFD600"), ep);

        // 标题
        ep = overlay(translate(pw/2, 35, text("🎉 恭喜！找到所有鸟类！", 20, "#3E2723")), ep);
        ep = overlay(translate(pw/2, 58, text("NUS 8 种校园鸟类全部集齐", 13, "#795548")), ep);

        // 分隔线
        ep = overlay(translate(0, 70, rectangle(pw - 80, 1, "solid", "#D7CCC8")), ep);

        // 统计信息
        const miss_text = "🎯 误点: " + stringify(state[SI_MISS]) + " 次";
        ep = overlay(translate(55, 88, text(miss_text, 14, "#4E342E")), ep);

        // --- 鸟图鉴 2x4 ---
        const gallery_label = "🦜 鸟类图鉴";
        ep = overlay(translate(pw/2, 118, text(gallery_label, 15, "#3E2723")), ep);

        const bird_keys = [0, 1, 2, 3, 4, 5, 6, 7]; // B_BULBUL..B_PIGEONB
        const bird_names = ["黄臀鹎","爪哇八哥","家麻雀","斑姬地鸠",
                            "领角鸮","红原鸡","鸽子A","鸽子B"];
        const cell_w = 110;
        const cell_h = 55;
        const grid_x = 35;
        const grid_y = 132;

        for (let bi = 0; bi < 8; bi = bi + 1) {
            const col = bi % 4;
            const row = math_floor(bi / 4);
            const cx = grid_x + col * cell_w + cell_w/2;
            const cy = grid_y + row * cell_h + cell_h/2;
            const bkey = bird_keys[bi];
            const found = bit_test(state[SI_BITS], bkey);

            // 迷你鸟图
            const mini = scale(0.35, 0.35, draw_bird(bkey));
            ep = overlay(translate(cx - cell_w/2 + 45, cy - 8, mini), ep);

            // 鸟名
            const name_color = found ? "#2E7D32" : "#BDBDBD";
            ep = overlay(translate(cx - cell_w/2 + 58, cy + 6,
                text(bird_names[bi], 11, name_color)), ep);

            // 发现状态图标
            const icon_char = found ? "✓" : "✗";
            const icon_color = found ? "#4CAF50" : "#BDBDBD";
            ep = overlay(translate(cx - cell_w/2 + 58, cy - 14,
                text(icon_char, 18, icon_color)), ep);
        }

        // 重组面板 (面板内容画完后 overlay 分隔线等)
        // 再玩一次按钮
        const replay_label = "再玩一次";
        const btn_w = 130;
        const btn_h = 38;
        const replay_btn = overlay(
            translate(btn_w/2, btn_h/2 + 3, text(replay_label, 14, "#FFFFFF")),
            rectangle(btn_w, btn_h, "solid", "#FF9800")
        );
        ep = overlay(translate(pw/2 - btn_w/2, ph - 52, replay_btn), ep);

        // 面板应用入场缩放
        const scaled_ep = scale(panel_scale, panel_scale, ep);
        scene = place(px + pw/2 * (1 - panel_scale), py + ph/2 * (1 - panel_scale), scaled_ep, scene);
    }

    return scene;
}

// ==================== on_tick ====================

function on_tick(state) {
    // 计数器衰减
    let nb = state[SI_BOUNCE];
    if (nb > 0.01) { nb = nb * 0.85; }
    else { nb = 0; }

    // 动画时间推进
    let anim_time = state[SI_ANIM_TIME] + 1;

    // 发现闪动衰减: bird_id*100 + timer, timer 递减
    let flash = state[SI_FOUND_FLASH];
    if (flash > 0) {
        const flash_timer = flash - math_floor(flash / 100) * 100;
        if (flash_timer > 1) {
            flash = flash - 1; // decrement timer part
        } else {
            flash = 0; // 闪动结束
        }
    }

    // 通关入场动画进度
    let comp_prog = state[SI_COMP_PROG];
    if (state[SI_COMPLETE] === 1 && comp_prog < 1) {
        if (comp_prog === 0) {
            // 首次进入完成状态, 播放庆祝音效
            play_complete_fanfare();
        }
        comp_prog = comp_prog + 0.035;
        if (comp_prog > 1) { comp_prog = 1; }
    }

    // 鸽子剧情动画
    let ph = state[SI_PHASE];
    let fr = state[SI_FRAME];
    let py = state[SI_PY];
    let trig = state[SI_TRIG];

    if (ph === PS_BUBBLE_IN) {
        fr = fr + 1;
        if (fr >= 12) { ph = PS_BUBBLE_SHOW; fr = 0; }
    } else if (ph === PS_BUBBLE_SHOW) {
        fr = fr + 1;
        if (fr >= 45) { ph = PS_DROPPING; fr = 0; py = -60; }
    } else if (ph === PS_DROPPING) {
        py = py + 15;
        if (py >= 250) { ph = PS_DONE; py = 250; trig = 1; }
    } else { }

    const ns = [];
    ns[SI_SCENE] = state[SI_SCENE];
    ns[SI_BITS] = state[SI_BITS];
    ns[SI_TRIG] = trig;
    ns[SI_MISS] = state[SI_MISS];
    ns[SI_PANEL] = state[SI_PANEL];
    ns[SI_BOUNCE] = nb;
    ns[SI_COMPLETE] = state[SI_COMPLETE];
    ns[SI_PHASE] = ph;
    ns[SI_FRAME] = fr;
    ns[SI_PY] = py;
    ns[SI_ANIM_TIME] = anim_time;
    ns[SI_FOUND_FLASH] = flash;
    ns[SI_COMP_PROG] = comp_prog;
    ns[SI_FOUND_ORDER] = state[SI_FOUND_ORDER];
    return ns;
}

// ==================== on_mouse ====================

function on_mouse(state, x, y, event) {
    if (event !== "button_down") { return state; }

    // 游戏完成 → 再玩一次
    if (state[SI_COMPLETE] === 1) {
        // 按钮位于面板底部中央: px+185, py+378, 130x38
        // px=200, py=85 → 按钮约在 [385, 463, 130, 38]
        const panel_px = HW - 250;
        const panel_py = HH - 215;
        const rbx = panel_px + 185;
        const rby = panel_py + 378;
        if (rect_hit(x, y, rbx, rby, 130, 38)) {
            return make_initial_state();
        }
        return state;
    }

    // 面板打开 → 关闭按钮
    if (state[SI_PANEL] >= 0) {
        const cbx = HW - 40;
        const cby = HH + 120 - 45;
        if (rect_hit(x, y, cbx, cby, 80, 32)) {
            const ns = copy_state(state);
            ns[SI_PANEL] = -1;
            return ns;
        }
        return state;
    }

    // 鸽子剧情中 → 屏蔽
    const ph = state[SI_PHASE];
    if (ph === PS_BUBBLE_IN || ph === PS_BUBBLE_SHOW || ph === PS_DROPPING) {
        return state;
    }

    // 场景切换
    if (rect_hit(x, y, 180, H - 45, 230, 38) && state[SI_SCENE] !== SCENE_LAWN) {
        const ns = copy_state(state);
        ns[SI_SCENE] = SCENE_LAWN;
        ns[SI_PANEL] = -1;
        return ns;
    }
    if (rect_hit(x, y, 500, H - 45, 230, 38) && state[SI_SCENE] !== SCENE_CANTEEN) {
        const ns = copy_state(state);
        ns[SI_SCENE] = SCENE_CANTEEN;
        ns[SI_PANEL] = -1;
        return ns;
    }

    // 鸽子剧情触发 (场景B, 点击吃饭的人)
    if (state[SI_SCENE] === SCENE_CANTEEN
        && state[SI_TRIG] === 0
        && !bit_test(state[SI_BITS], B_PIGEONA)
        && state[SI_PHASE] === PS_IDLE) {
        if (rect_hit(x, y, 425, 275, 35, 55)) {
            const ns = copy_state(state);
            ns[SI_PHASE] = PS_BUBBLE_IN;
            ns[SI_FRAME] = 0;
            return ns;
        }
    }

    // 鸟点击
    const hit = bird_hit(state, x, y);
    if (hit >= 0) {
        const ns = copy_state(state);
        ns[SI_BITS] = bit_set(state[SI_BITS], hit);
        ns[SI_PANEL] = hit;
        ns[SI_BOUNCE] = 1;
        ns[SI_FOUND_FLASH] = hit * 100 + 15; // bird_id*100 + flash_timer
        // 发现顺序: 用位打包记录 (每4位存一个bird_id)
        const order_count = count_found(state[SI_BITS]);
        ns[SI_FOUND_ORDER] = state[SI_FOUND_ORDER] + hit * math_pow(16, order_count);
        if (all_found(ns)) {
            ns[SI_COMPLETE] = 1;
            // 完成音效在下一帧触发,避免与鸟叫叠加
        } else { }
        play_synth_call(hit);
        return ns;
    }

    // 误点
    const ns = copy_state(state);
    ns[SI_MISS] = state[SI_MISS] + 1;
    return ns;
}

function stop_when(state) {
    return false;
}

// ==================== 启动游戏 ====================

const INITIAL_STATE = make_initial_state();

// Source §3 使用位置参数形式的 big_bang
// 如果报错，尝试改为:
//   big_bang(INITIAL_STATE, to_draw, on_tick);
//   或者查看你环境中的 big_bang 文档
big_bang(INITIAL_STATE, to_draw, on_tick, on_mouse, stop_when);
