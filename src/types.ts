export enum AgentType {
    산업기능요원 = "1",
    전문연구요원 = "2",
    승선근무예비역 = "3",
}

export enum IndustryCode {
    철강 = "11101",
    기계 = "11102",
    전기 = "11103",
    전자 = "11104",
    화학 = "11105",
    섬유 = "11106",
    신발 = "11107",
    시멘요업 = "11108",
    생활용품 = "11109",
    통신기기 = "11110",
    정보처리 = "11111",
    게임SW = "11112",
    영상게임 = "11113",
    의료의약 = "11114",
    식음료 = "11115",
    농산물가공 = "11116",
    수산물가공 = "11117",
    임산물가공 = "11118",
    동물약품 = "11119",
    애니메이션 = "11120",
    석탄채굴 = "11201",
    일반광물채굴 = "11202",
    선광제련 = "11203",
    에너지 = "11301",
    국내건설 = "11401",
    국외건설 = "11402",
    내항화물 = "11501",
    외항화물 = "11502",
    내항선박관리 = "11503",
    외항선박관리 = "11504",
    근해 = "11601",
    원양 = "11602",
}

export enum CompanySizeCode {
    대기업 = "01",
    중소기업 = "02",
    중견기업 = "04",
    농어민후계 = "A1",
    기타 = "Z",
}

export type AgentTypeKeys = keyof typeof AgentType;
export type IndustryCodeKeys = keyof typeof IndustryCode;
export type CompanySizeCodeKeys = keyof typeof CompanySizeCode;

export type SidoAddr =
    | "서울특별시"
    | "부산광역시"
    | "대구광역시"
    | "인천광역시"
    | "광주광역시"
    | "대전광역시"
    | "울산광역시"
    | "세종특별자치시"
    | "경기도"
    | "충청북도"
    | "충청남도"
    | "전라남도"
    | "경상북도"
    | "경상남도"
    | "제주특별자치도"
    | "강원특별자치도"
    | "전북특별자치도";

export interface SearchQuery {
    eopjong_gbcd: AgentTypeKeys;
    gegyumo_cd?: "" | CompanySizeCodeKeys;
    eopjong_cd?: IndustryCodeKeys | IndustryCodeKeys[];
    eopche_nm?: string;
    sido_addr?: SidoAddr;
    sigungu_addr?: string;
    chaeyongym?: "" | "Y";
    bjinwonym?: "H" | "B" | ("H" | "B")[];
}

export class MMAApiError extends Error {
    statusCode?: number;

    constructor(message: string, statusCode?: number) {
        super(message);
        this.name = "MMAApiError";
        this.statusCode = statusCode;
    }
}
