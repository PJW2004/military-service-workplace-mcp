# military-service-workplace-mcp

병무청 병역일터에서 병역특례 지정업체를 검색하는 MCP 서버입니다.<br/>
산업기능요원, 전문연구요원, 승선근무예비역 복무가 가능한 업체 정보를 조회합니다.

> [!NOTE]
> [원본](https://github.com/antegral/agent-for-agent)이 있으나, 이슈 응답이 2일 이상 없어 별도로 작성했습니다.

## 기능

복무 형태와 조건을 입력하면 병무청에서 지정업체 목록을 조회하여 CSV 형식으로 반환합니다.

| 필터 | 설명 |
|------|------|
| 복무 형태 | 산업기능요원, 전문연구요원, 승선근무예비역 |
| 기업 규모 | 대기업, 중소기업, 중견기업, 농어민후계, 기타 |
| 업종 | 32개 업종 (정보처리, 게임SW, 전자, 의료의약 등) |
| 지역 | 17개 시도 + 시군구 |
| 채용 여부 | 채용 공고 등록 업체만 필터 |
| 역종 | 현역, 보충역 |

## MCP 도구

### `search_military_companies`

병무청 병역일터에서 병역특례 지정업체를 검색합니다.

#### 파라미터

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|----------|------|------|--------|------|
| `service_type` | string | ✅ | - | 복무 형태 (`산업기능요원`, `전문연구요원`, `승선근무예비역`) |
| `company_size` | string | - | 전체 | 기업 규모 (`대기업`, `중소기업`, `중견기업`, `농어민후계`, `기타`) |
| `industry_sectors` | string \| string[] | - | 전체 | 업종 (여러 개 가능) |
| `company_name` | string | - | 전체 | 회사명 검색 |
| `city_province` | string | - | 전국 | 시/도 |
| `city_district` | string | - | 전체 | 시/군/구 |
| `is_hiring` | boolean | - | `false` | 채용 공고 등록 업체만 조회 |
| `military_service_type` | string \| string[] | - | 전체 | 현역/보충역 TO 유무 |

#### 지원 업종 목록

<details>
<summary>32개 업종 펼치기</summary>

제조: 철강, 기계, 전기, 전자, 화학, 섬유, 신발, 시멘요업, 생활용품, 통신기기, 정보처리, 게임SW, 영상게임, 의료의약, 식음료, 농산물가공, 수산물가공, 임산물가공, 동물약품, 애니메이션

광업: 석탄채굴, 일반광물채굴, 선광제련

에너지: 에너지

건설: 국내건설, 국외건설

해운: 내항화물, 외항화물, 내항선박관리, 외항선박관리

수산: 근해, 원양

</details>

## 설치

```bash
# pnpm 없는 경우 "npm install -g pnpm"
pnpm install
pnpm build
```

## 사용법

### npx로 실행 (권장)

#### Claude Code

```bash
claude mcp add military-service-workplace -- npx -y military-service-workplace-mcp
```

#### Claude Desktop

`claude_desktop_config.json`에 추가:

```json
{
  "mcpServers": {
    "military-service-workplace": {
      "command": "npx",
      "args": ["-y", "military-service-workplace-mcp"]
    }
  }
}
```

### 로컬 빌드로 실행

#### Claude Code

```bash
claude mcp add military-service-workplace -- node /path/to/military-service-workplace-mcp/dist/index.js
```

#### Claude Desktop

```json
{
  "mcpServers": {
    "military-service-workplace": {
      "command": "node",
      "args": ["/path/to/military-service-workplace-mcp/dist/index.js"]
    }
  }
}
```

### 질문 예시

```
산업기능요원 정보처리 업종 지정업체 검색해줘
```
```
서울에서 게임SW 전문연구요원 채용 중인 업체 알려줘
```
```
경기도 중소기업 산업기능요원 보충역 지정업체 찾아줘
```

## 제한사항

- 병무청 API에서 Excel 파일을 다운로드하여 파싱하는 방식이므로, API 응답 형식 변경 시 동작하지 않을 수 있습니다.
- 짧은 시간에 너무 많은 요청을 보내면 병무청 서버에서 접근을 제한할 수 있습니다.

## License

MIT License. See [LICENSE](LICENSE) for details.
