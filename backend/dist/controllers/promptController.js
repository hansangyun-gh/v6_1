"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPrompts = getAllPrompts;
exports.savePrompt = savePrompt;
exports.getPromptByName = getPromptByName;
exports.deletePrompt = deletePrompt;
exports.updatePrompt = updatePrompt;
const promptService = __importStar(require("../services/promptService"));
/**
 * 모든 프롬프트 목록 반환
 */
async function getAllPrompts(req, res, next) {
    try {
        const prompts = await promptService.getAllPrompts();
        res.json({ success: true, prompts });
    }
    catch (err) {
        next(err);
    }
}
/**
 * 프롬프트 저장
 */
async function savePrompt(req, res, next) {
    try {
        const { name, value } = req.body;
        if (!name || !value) {
            return res.status(400).json({ success: false, error: '프롬프트 이름과 내용을 모두 입력하세요.' });
        }
        await promptService.savePrompt({ name, value });
        res.json({ success: true });
    }
    catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
}
/**
 * 프롬프트 이름으로 불러오기
 */
async function getPromptByName(req, res, next) {
    try {
        const { name } = req.params;
        const prompt = await promptService.getPromptByName(name);
        if (!prompt) {
            return res.status(404).json({ success: false, error: '해당 프롬프트가 존재하지 않습니다.' });
        }
        res.json({ success: true, prompt });
    }
    catch (err) {
        next(err);
    }
}
/**
 * 프롬프트 삭제
 */
async function deletePrompt(req, res, next) {
    try {
        const { name } = req.params;
        await promptService.deletePrompt(name);
        res.json({ success: true });
    }
    catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
}
/**
 * 프롬프트 수정
 */
async function updatePrompt(req, res, next) {
    try {
        const { name } = req.params;
        const { value } = req.body;
        if (!value) {
            return res.status(400).json({ success: false, error: '수정할 프롬프트 내용을 입력하세요.' });
        }
        await promptService.updatePrompt(name, value);
        res.json({ success: true });
    }
    catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
}
