import * as XLSX from "xlsx";
import {
    SearchQuery,
    AgentType,
    IndustryCode,
    CompanySizeCode,
    MMAApiError,
} from "./types.js";

const MMA_API_ENDPOINT =
    "https://work.mma.go.kr/caisBYIS/search/downloadBYJJEopCheExcel.do";

function buildFormData(query: SearchQuery): string {
    const params = new URLSearchParams();

    params.append("eopjong_gbcd", AgentType[query.eopjong_gbcd]);
    params.append("al_eopjong_gbcd_yn", "");

    if (query.gegyumo_cd) {
        const code = CompanySizeCode[query.gegyumo_cd];
        if (code) params.append("gegyumo_cd", code);
    } else {
        params.append("gegyumo_cd", "");
    }

    if (query.eopjong_cd) {
        const codes = Array.isArray(query.eopjong_cd)
            ? query.eopjong_cd
            : [query.eopjong_cd];
        const codeValues: string[] = [];

        for (const industry of codes) {
            const code = IndustryCode[industry];
            if (code) {
                params.append("eopjong_cd", code);
                codeValues.push(code);
            }
        }

        if (codeValues.length > 0) {
            const joined = codeValues.join(",");
            params.append("al_eopjong_gbcd", joined);
            params.append("eopjong_gbcd_list", joined);
        }
    }

    if (query.eopche_nm) params.append("eopche_nm", query.eopche_nm);
    if (query.sido_addr) params.append("sido_addr", query.sido_addr);
    if (query.sigungu_addr) params.append("sigungu_addr", query.sigungu_addr);
    if (query.chaeyongym) params.append("chaeyongym", query.chaeyongym);

    if (query.bjinwonym) {
        const values = Array.isArray(query.bjinwonym)
            ? query.bjinwonym
            : [query.bjinwonym];
        for (const v of values) {
            params.append("bjinwonym", v);
        }
    }

    return params.toString();
}

export async function searchDesignatedEntities(
    query: SearchQuery
): Promise<string> {
    const formData = buildFormData(query);

    const response = await fetch(MMA_API_ENDPOINT, {
        method: "POST",
        headers: {
            accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "accept-language": "ko,en-US;q=0.9,en;q=0.8",
            "cache-control": "no-cache",
            "content-type": "application/x-www-form-urlencoded",
            Referer:
                "https://work.mma.go.kr/caisBYIS/search/byjjecgeomsaek.do",
        },
        body: formData,
    }).catch((error: Error) => {
        throw new MMAApiError(
            `MMA API request failed: ${error.message}`
        );
    });

    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });

    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
        throw new MMAApiError("No worksheet found in the response");
    }

    const worksheet = workbook.Sheets[sheetName];
    const csv = XLSX.utils.sheet_to_csv(worksheet, { FS: ",", RS: "\n" });

    const rows = csv.split("\n");
    const header = rows[0];
    const dataRows = rows.slice(1).filter((row) => row.trim() !== "");

    if (dataRows.length === 0) {
        return "No data found for the given search criteria.";
    }

    return `${header}\n${dataRows.join("\n")}`;
}
