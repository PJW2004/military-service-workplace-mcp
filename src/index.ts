#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    ListToolsRequestSchema,
    CallToolRequestSchema,
    Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { SearchQuery, MMAApiError } from "./types.js";
import { searchDesignatedEntities } from "./mma-api.js";

const INDUSTRY_SECTORS = [
    "철강", "기계", "전기", "전자", "화학", "섬유", "신발", "시멘요업",
    "생활용품", "통신기기", "정보처리", "게임SW", "영상게임", "의료의약",
    "식음료", "농산물가공", "수산물가공", "임산물가공", "동물약품", "애니메이션",
    "석탄채굴", "일반광물채굴", "선광제련", "에너지",
    "국내건설", "국외건설", "내항화물", "외항화물",
    "내항선박관리", "외항선박관리", "근해", "원양",
] as const;

const SIDO_LIST = [
    "서울특별시", "부산광역시", "대구광역시", "인천광역시", "광주광역시",
    "대전광역시", "울산광역시", "세종특별자치시", "경기도", "충청북도",
    "충청남도", "전라남도", "경상북도", "경상남도", "제주특별자치도",
    "강원특별자치도", "전북특별자치도",
] as const;

const TOOLS: Tool[] = [
    {
        name: "search_military_companies",
        description:
            "병무청 병역일터에서 병역특례 지정업체를 검색합니다 (Search military service alternative companies from MMA). " +
            "산업기능요원, 전문연구요원, 승선근무예비역 복무가 가능한 업체 정보를 조회합니다. " +
            "병역특례, 산업기능요원, 전문연구요원, 승선근무예비역, 보충역, 현역 관련 질문에 이 도구를 사용하세요. " +
            "결과는 CSV 형식으로 전체 업체 목록을 반환합니다.",
        inputSchema: {
            type: "object",
            properties: {
                service_type: {
                    type: "string",
                    enum: ["산업기능요원", "전문연구요원", "승선근무예비역"],
                    description: "(필수) 복무 형태",
                },
                company_size: {
                    type: "string",
                    enum: ["대기업", "중소기업", "중견기업", "농어민후계", "기타"],
                    description: "기업 규모 (미지정 시 전체)",
                },
                industry_sectors: {
                    oneOf: [
                        { type: "string", enum: [...INDUSTRY_SECTORS] },
                        {
                            type: "array",
                            items: { type: "string", enum: [...INDUSTRY_SECTORS] },
                        },
                    ],
                    description: "업종 (여러 개 가능, 미지정 시 전체)",
                },
                company_name: {
                    type: "string",
                    description: "회사명 검색 (미지정 시 전체)",
                },
                city_province: {
                    type: "string",
                    enum: [...SIDO_LIST],
                    description: "시/도 (미지정 시 전국)",
                },
                city_district: {
                    type: "string",
                    description: "시/군/구",
                },
                is_hiring: {
                    type: "boolean",
                    description: "채용 공고 등록 업체만 조회",
                },
                military_service_type: {
                    oneOf: [
                        { type: "string", enum: ["현역", "보충역"] },
                        {
                            type: "array",
                            items: { type: "string", enum: ["현역", "보충역"] },
                        },
                    ],
                    description: "현역/보충역 TO 유무 (미지정 시 전체)",
                },
            },
            required: ["service_type"],
        },
    },
];

const server = new Server(
    { name: "military-service-workplace-mcp", version: "0.0.1" },
    { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (name !== "search_military_companies") {
        return {
            content: [{ type: "text", text: `알 수 없는 도구: ${name}` }],
            isError: true,
        };
    }

    if (!args?.service_type) {
        return {
            content: [{ type: "text", text: "복무 형태(service_type)를 입력해주세요." }],
            isError: true,
        };
    }

    const bjinwonym: ("H" | "B")[] = [];
    const mst = args.military_service_type as string | string[] | undefined;
    if (mst) {
        const types = Array.isArray(mst) ? mst : [mst];
        if (types.includes("현역")) bjinwonym.push("H");
        if (types.includes("보충역")) bjinwonym.push("B");
    }

    const query: SearchQuery = {
        eopjong_gbcd: args.service_type as SearchQuery["eopjong_gbcd"],
        gegyumo_cd: (args.company_size as SearchQuery["gegyumo_cd"]) || "",
        eopjong_cd: args.industry_sectors as SearchQuery["eopjong_cd"],
        eopche_nm: args.company_name as string | undefined,
        sido_addr: args.city_province as SearchQuery["sido_addr"],
        sigungu_addr: args.city_district as string | undefined,
        chaeyongym: args.is_hiring ? "Y" : "",
        bjinwonym: bjinwonym.length > 0 ? bjinwonym : undefined,
    };

    try {
        const result = await searchDesignatedEntities(query);
        return {
            content: [{ type: "text", text: result }],
        };
    } catch (error) {
        const message =
            error instanceof MMAApiError
                ? `MMA API Error: ${error.message}`
                : `Error: ${error instanceof Error ? error.message : String(error)}`;
        return {
            content: [{ type: "text", text: message }],
            isError: true,
        };
    }
});

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main().catch((error) => {
    console.error("서버 시작 실패:", error);
    process.exit(1);
});
