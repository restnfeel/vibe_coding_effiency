# 가성비 바이브 코딩 가이드

## Cursor + Opencode + vLLM 연계로 비용 줄이고 효율 극대화하기

---

## 📌 개요 및 핵심 전략

노트 요약:

- **RAP(Rapid Agentic Programming)** 방식으로 도메인을 나누고, 도메인별 거대 Task를 정의
- Task별 Skills를 문서화하고 **반복 자동화** 구조를 만든다
- 비싼 모델은 도메인 이해/설계에만, 저렴한 모델은 반복 실행에 투입
- **Cursor** + **Opencode** 두 가지 바이브 코딩 툴을 역할 분리하여 병행 사용

---

## 🗂️ Chapter 1. 전체 아키텍처 — 도메인 → Task → Skills

### 1-1. 도메인 분리 (RAP 방식)

```
전체 프로젝트
├── 도메인 A  →  거대 Task A1, A2, A3
├── 도메인 B  →  거대 Task B1, B2
└── 도메인 C  →  거대 Task C1
```

- 도메인 경계를 먼저 잡는다 (세션 교체 시 학습 영향 최소화)
- 각 도메인은 독립적으로 Skills화 + Agent화 가능한 단위로 설계

### 1-2. Task 분류

| Task 유형           | 설명                                      | 적합한 접근                 |
| ------------------- | ----------------------------------------- | --------------------------- |
| 도메인 문해 Task    | 설계, 아키텍처 결정, 복잡한 비즈니스 로직 | 고성능 모델 (Opus 4.6 등)   |
| 반복 자동화 Task    | Skills 기반 코드 생성, 테스트, 빌드       | 저렴한 특화 모델            |
| 비반복 build & test | 새 기능 개발 + 검증                       | 자동 모델선정 + Skills 조합 |

### 1-3. Skills 문서화 원칙

- Task별 Skills를 **문서로 구현** → Cursor/Opencode의 Rules 또는 `.cursorrules`, `CLAUDE.md`에 등록
- 기본서(반복 작업)를 Skills화하면 → 저렴한 모델로도 고품질 출력 가능
- Skills = 프롬프트 템플릿 + 컨텍스트 압축 + 자동화 스크립트의 조합

---

## 🤖 Chapter 2. 모델 선정 전략

### 2-1. 모델 분류 기준

```
모델 선택 기준
├── ① 독립적·복잡한 판단이 필요한 모델  →  비싸도 OK (설계 단계)
└── ② 저렴하지만 특화된 모델           →  반복 실행에 투입
```

### 2-2. 추천 모델 조합 (2025 기준)

| 용도                   | 모델                      | 특징                          | 비용 |
| ---------------------- | ------------------------- | ----------------------------- | ---- |
| 도메인 설계 / 문해     | **Claude Opus 4.6**       | 최고 추론 능력, 컨텍스트 장악 | 高   |
| 코드 생성 (고품질)     | **Grok Code**             | 코딩 특화                     | 中高 |
| 빠른 UI/디자인 작업    | **Gemini Flash**          | 속도 ↑, 비용 ↓                | 低   |
| 경량 에이전트          | **Kimi k2.5**             | 반복 Skills 실행에 적합       | 低   |
| 바탕질 / 에이전트 루프 | **바탕질, 에이전트 모델** | 저렴하게 Skills 잘 수행       | 低   |

### 2-3. 도메인 Task별 모델 자동 선정 흐름

```
도메인 Task 분화
     │
     ├── Auto & Model 선정  →  Skills & Subagents로 분배
     │        │
     │        ├── 복잡 판단  →  Opus 4.6 (Load 조절)
     │        └── 반복 실행  →  경량 모델 (Kimi, Gemini Flash)
     │
     └── 비반복 build & test  →  자동 모델 + Skills 조합
```

**핵심 원칙:** 대중적(범용) 판단은 고성능 모델, 아메리칸 컨트롤(반복·예측 가능한 작업)은 경량 모델로 Load 분산

---

## 🛠️ Chapter 3. Cursor 효율적 사용법

### 3-1. Cursor 모델 선정

- **도메인 문해 작업** → `claude-opus-4-6` 지정 (대화 대상 모델 아님, 설계용)
- **하위 Task 문화** → Auto 모드 활용 (Cursor가 자동으로 모델 선택)
- **Skills를 통한 반복** → Auto 모드 + `.cursorrules` 조합

```
Cursor 설정 흐름
├── 도메인 진입  →  Opus 4.6로 컨텍스트 구성
├── 하위 Task   →  Auto 비교 모드 활성화
└── Skills 반복 →  Auto + Rules 자동화
```

### 3-2. Cursor OpenRouter 연결

Cursor에서 여러 모델을 비용 효율적으로 쓰려면 **OpenRouter**를 통해 연결:

```
Cursor Settings
└── Models
    └── Add Custom Model
        ├── URL: https://openrouter.ai/api/v1
        ├── API Key: sk-or-v1-...
        └── Model: openai/gpt-4o  또는  anthropic/claude-opus-4-6  등
```

**장점:**

- 모델별 가격 비교 후 최적 모델 선택 가능
- Cursor 내에서 ChatGPT Type API 형식으로 모든 모델 사용
- 단일 API 키로 Gemini, Grok, Kimi 등 통합 관리

### 3-3. Cursor Rules (Skills 등록)

`.cursor/rules/` 또는 프로젝트 루트 `.cursorrules` 파일에 Skills 등록:

```markdown
# Skills: API 개발

- FastAPI 기반, 항상 Pydantic v2 사용
- 에러 핸들링은 HTTPException + custom error schema
- 테스트는 pytest + httpx 비동기 패턴

# Skills: 코드 리뷰

- 보안 취약점 우선 체크
- 타입 힌트 100% 적용 여부 확인
```

---

## 🔧 Chapter 4. Opencode 연계법

### 4-1. Opencode란?

터미널 기반 AI 코딩 에이전트로, **Cursor와 역할을 분리**하여 병행 사용:

| 도구         | 주요 역할                           | 장점                           |
| ------------ | ----------------------------------- | ------------------------------ |
| **Cursor**   | IDE 내 대화형 코딩, 파일 편집       | UI, 실시간 수정, 컨텍스트 유지 |
| **Opencode** | 터미널 배치 작업, 자동화 파이프라인 | CLI 자동화, Subagent 실행      |

### 4-2. Opencode 설치 및 기본 설정

```bash
# 설치
npm install -g opencode-ai

# 설정 파일 (~/.opencode/config.json)
{
  "model": "anthropic/claude-opus-4-6",
  "providers": {
    "openrouter": {
      "apiKey": "sk-or-v1-...",
      "baseURL": "https://openrouter.ai/api/v1"
    }
  }
}
```

### 4-3. Opencode에서 lazy JSON 패턴

Opencode는 구조화된 출력(lazy JSON)을 활용하여 Skills 파이프라인 자동화:

```bash
# Task를 JSON으로 받아 처리하는 패턴
opencode run --model kimi-k2.5 \
  --prompt "다음 Task를 수행하고 결과를 JSON으로 반환: $(cat task.json)" \
  --output result.json
```

### 4-4. SysPrompts 자동화 활용

Opencode에서 SysPrompts를 파일로 관리하고 자동 적용:

```bash
# skills/ 폴더 구조
skills/
├── api_dev.md        # API 개발 Skills
├── test_gen.md       # 테스트 생성 Skills
├── code_review.md    # 코드 리뷰 Skills
└── deploy.md         # 배포 Skills

# 실행 시 Skills 자동 적용
opencode run --sysprompt skills/api_dev.md --task "user CRUD API 생성"
```

---

## 🔗 Chapter 5. Serving LLM — vLLM 연계

### 5-1. 로컬 vLLM 서버 구성

```bash
# vLLM 설치
pip install vllm

# 서버 실행 (OpenAI 호환 API)
python -m vllm.entrypoints.openai.api_server \
  --model Qwen/Qwen2.5-Coder-7B-Instruct \
  --port 8000 \
  --tensor-parallel-size 1
```

### 5-2. Cursor에서 vLLM 로컬 모델 연결

```
Cursor Settings → Models → Add Custom Model
├── URL: http://localhost:8000/v1
├── API Key: token-abc (아무 값)
└── Model: Qwen2.5-Coder-7B-Instruct
```

### 5-3. Opencode에서 vLLM 연결

```json
{
  "providers": {
    "local-vllm": {
      "apiKey": "not-needed",
      "baseURL": "http://localhost:8000/v1"
    }
  },
  "model": "local-vllm/Qwen2.5-Coder-7B-Instruct"
}
```

### 5-4. Serving API 구성 (칼름3 / Clm k-6 / Kimi)

```python
# FastAPI로 통합 Serving API 래퍼 구성
from fastapi import FastAPI
import httpx

app = FastAPI()

MODELS = {
    "local":  "http://localhost:8000/v1",       # vLLM
    "openrouter": "https://openrouter.ai/api/v1" # 클라우드
}

@app.post("/v1/chat/completions")
async def proxy(request: dict, model_tier: str = "local"):
    base_url = MODELS[model_tier]
    async with httpx.AsyncClient() as client:
        return await client.post(f"{base_url}/chat/completions", json=request)
```

---

## 💰 Chapter 6. 비용 최적화 전략 — 가성비 개발 공식

### 6-1. 비용 계층 구조

```
비용 계층
├── Tier 1 (설계·판단)   →  Opus 4.6, GPT-4o         월 $20~50
├── Tier 2 (코드 생성)   →  Gemini Flash, Kimi k2.5   월 $5~15
└── Tier 3 (반복 실행)   →  로컬 vLLM (무료)          전기세만
```

### 6-2. 작업별 모델 배분 공식

| 작업                   | 사용 툴           | 모델         | 예상 비용        |
| ---------------------- | ----------------- | ------------ | ---------------- |
| 도메인 설계 / 아키텍처 | Cursor            | Opus 4.6     | 세션당 $0.5~2    |
| 기능 구현 코드 생성    | Cursor / Opencode | Gemini Flash | 세션당 $0.05~0.2 |
| 테스트 코드 자동 생성  | Opencode (배치)   | Kimi k2.5    | 세션당 $0.02~0.1 |
| 반복 리팩터링          | Opencode + vLLM   | 로컬 모델    | $0               |
| 코드 리뷰              | Cursor            | Grok Code    | 세션당 $0.1~0.5  |

### 6-3. 세션 관리 팁

- 세션을 바꾸면 모델의 **학습 영향이 리셋** → 도메인 컨텍스트 손실 주의
- `.cursorrules` + `CLAUDE.md`에 도메인 컨텍스트를 저장해두면 세션 전환 후에도 빠르게 복원
- 기본 반복 작업은 **Skills로 문서화** → 저렴한 모델도 일관된 퀄리티 유지

### 6-4. Subagent 패턴으로 병렬 처리

```
메인 에이전트 (Opus 4.6)
├── Subagent A (Kimi k2.5)  →  API 엔드포인트 생성
├── Subagent B (Gemini Flash)  →  테스트 코드 생성
└── Subagent C (로컬 vLLM)  →  문서 자동화
```

---

## 📋 Chapter 7. 실전 워크플로우 예시

### 7-1. 신규 기능 개발 플로우

```
1. [Cursor + Opus 4.6]
   → 도메인 분석 + 설계 + Task 분리

2. [Cursor + Auto 모드]
   → 하위 Task 자동 모델 선정 + 코드 생성

3. [Opencode + Kimi k2.5]
   → Skills 기반 반복 구현 (CRUD, 테스트 등)

4. [로컬 vLLM]
   → 리팩터링, 문서화, 타입 힌트 추가

5. [Cursor + Grok Code]
   → 최종 코드 리뷰 + 보안 체크
```

### 7-2. 비용 절감 체크리스트

- [ ] `.cursorrules`에 프로젝트 Skills 등록 완료
- [ ] `skills/` 폴더에 반복 작업 SysPrompts 저장
- [ ] OpenRouter로 모델 가격 비교 후 적합 모델 지정
- [ ] 반복성 높은 작업은 로컬 vLLM으로 오프로드
- [ ] 세션 전환 전 도메인 컨텍스트 문서 업데이트
- [ ] Subagent 분리로 병렬 처리 구성

---

## 🔑 핵심 요약

> **설계는 비싼 모델로 한 번, 실행은 저렴한 모델로 반복.**
> Skills를 문서화하면 어떤 모델도 일관된 퀄리티를 낸다.
> Cursor(IDE)와 Opencode(CLI)를 역할 분리하면 커버리지가 극대화된다.
> 로컬 vLLM으로 반복 작업을 무료화하는 것이 가성비의 핵심이다.

---

_문서 기반: 노트 OCR (IMG_2474~2476) + 실전 바이브 코딩 경험 정리_
