# 배포 가이드

## npm 배포

### 사전 준비

- [npm](https://www.npmjs.com) 계정 필요
- Node.js 20 이상

### 배포 절차

```bash
# 1. npm 로그인 (최초 1회)
npm login

# 2. 빌드
pnpm build

# 3. 배포
npm publish --access public
```

> `prepublishOnly` 스크립트가 설정되어 있어 `npm publish`만 실행해도 자동으로 빌드됩니다.

### 버전 업데이트 시

`package.json`과 `src/index.ts`의 버전을 동일하게 맞춘 후 배포합니다:

```jsonc
// package.json
{ "version": "0.0.1" }
```

```ts
// src/index.ts
const server = new Server(
    { name: "military-service-workplace-mcp", version: "0.0.1" },
    ...
);
```

---

## 버전 업데이트 체크리스트

1. `package.json`의 `version` 수정
2. `src/index.ts`의 Server 버전 수정
3. `pnpm build` 확인
4. `npm publish --access public`
