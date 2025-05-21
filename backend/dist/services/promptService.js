"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPrompts = getAllPrompts;
exports.savePrompt = savePrompt;
exports.getPromptByName = getPromptByName;
exports.deletePrompt = deletePrompt;
exports.updatePrompt = updatePrompt;
/**
 * 프롬프트 관리 서비스
 * @description 프롬프트를 파일에 저장/불러오기/삭제/수정 (MVP: JSON 파일)
 */
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const PROMPT_FILE = path_1.default.resolve(__dirname, '../../data/prompts.json');
/**
 * 모든 프롬프트 목록을 불러옵니다.
 */
async function getAllPrompts() {
    try {
        const data = await promises_1.default.readFile(PROMPT_FILE, 'utf-8');
        return JSON.parse(data);
    }
    catch (err) {
        if (err.code === 'ENOENT')
            return [];
        throw new Error('프롬프트 목록을 불러오는 중 오류 발생: ' + err.message);
    }
}
/**
 * 프롬프트를 저장합니다. (이름 중복 불가)
 */
async function savePrompt(prompt) {
    try {
        const prompts = await getAllPrompts();
        if (prompts.find(p => p.name === prompt.name)) {
            throw new Error('이미 존재하는 프롬프트 이름입니다.');
        }
        prompts.push(prompt);
        await promises_1.default.mkdir(path_1.default.dirname(PROMPT_FILE), { recursive: true });
        await promises_1.default.writeFile(PROMPT_FILE, JSON.stringify(prompts, null, 2), 'utf-8');
    }
    catch (err) {
        throw new Error('프롬프트 저장 중 오류 발생: ' + err.message);
    }
}
/**
 * 프롬프트를 이름으로 불러옵니다.
 */
async function getPromptByName(name) {
    try {
        const prompts = await getAllPrompts();
        return prompts.find(p => p.name === name);
    }
    catch (err) {
        throw new Error('프롬프트 불러오기 오류: ' + err.message);
    }
}
/**
 * 프롬프트를 삭제합니다.
 */
async function deletePrompt(name) {
    try {
        const prompts = await getAllPrompts();
        const filtered = prompts.filter(p => p.name !== name);
        if (filtered.length === prompts.length) {
            throw new Error('삭제할 프롬프트가 존재하지 않습니다.');
        }
        await promises_1.default.writeFile(PROMPT_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    }
    catch (err) {
        throw new Error('프롬프트 삭제 오류: ' + err.message);
    }
}
/**
 * 프롬프트를 수정합니다.
 */
async function updatePrompt(name, value) {
    try {
        const prompts = await getAllPrompts();
        const idx = prompts.findIndex(p => p.name === name);
        if (idx === -1)
            throw new Error('수정할 프롬프트가 존재하지 않습니다.');
        prompts[idx].value = value;
        await promises_1.default.writeFile(PROMPT_FILE, JSON.stringify(prompts, null, 2), 'utf-8');
    }
    catch (err) {
        throw new Error('프롬프트 수정 오류: ' + err.message);
    }
}
