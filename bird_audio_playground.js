// ============================================================
//  NUS Bird Finder — 8种鸟叫 (真实MP3, arcade_2d)
//  playBird(0)~playBird(7)  试听
// ============================================================

import { create_audio, play_audio } from "arcade_2d";

const BASE = "https://raw.githubusercontent.com/jiayihe096-sudo/nus-bird-audio/master/";

const clips = [
    create_audio(BASE + "bird_01_bulbul.mp3", 1),
    create_audio(BASE + "bird_02_myna.mp3", 1),
    create_audio(BASE + "bird_03_sparrow.mp3", 1),
    create_audio(BASE + "bird_04_zebra_dove.mp3", 1),
    create_audio(BASE + "bird_05_owl.mp3", 1),
    create_audio(BASE + "bird_06_junglefowl.mp3", 1),
    create_audio(BASE + "bird_07_pigeon_a.mp3", 1),
    create_audio(BASE + "bird_08_pigeon_b.mp3", 1)
];

function playBird(n) {
    play_audio(clips[n]);
}

playBird(0);

"Ready: playBird(0-7)";
