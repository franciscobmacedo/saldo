import { DoutorFinancasRequest, DoutorFinancasResponse } from "./types";

export class DoutorFinancasAPI {
  private static readonly API_URL = "https://www.doutorfinancas.pt/wp-json/simulators/v1/net-salary";
  
  static async calculate(request: DoutorFinancasRequest): Promise<DoutorFinancasResponse> {
    const response = await fetch(this.API_URL, {
      method: "POST",
      headers: {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-GB,en;q=0.9,en-US;q=0.8,pt;q=0.7,pt-PT;q=0.6",
        "content-type": "application/json",
        "origin": "https://www.doutorfinancas.pt",
        "referer": "https://www.doutorfinancas.pt/ferramentas/simulador-salario-liquido-2025/",
        "user-agent": "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36"
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      console.error('Doutor Finanças API error:', response);
      console.log('request was:', request);
      throw new Error(`Doutor Finanças API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }
}
