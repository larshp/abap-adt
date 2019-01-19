import * as puppeteer from "puppeteer";
import * as https from "https";
import axios from "axios";

export class HTTP {
  private httpsAgent: https.Agent;
  private token: string;
  private headers: any = {};
  private host: string;

  constructor(host: string) {
    this.host = host;
  }

  public async login(username: string, password: string) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(this.host + "/sap/bc/adt/repository/");
    await page.waitForNavigation();

    await page.keyboard.type(username);
    await page.keyboard.press("Tab");
    await page.keyboard.type(password);
    await page.keyboard.press("Enter");
    await page.waitForNavigation();

    const cookies = await page.cookies();
    await browser.close();

    this.httpsAgent = new https.Agent({keepAlive: true});

    this.headers.Cookie = cookies.map((cookie: any) => { return `${cookie.name}=${cookie.value}`; }).join(";");
    this.headers["x-csrf-token"] = "Fetch";
    const resp = await axios.get(this.host + "/sap/bc/adt/packages/settings", {
      headers: this.headers,
      httpsAgent: this.httpsAgent,
      responseType: "blob",
    });
//    console.dir(resp.headers["x-csrf-token"]);
    this.token = resp.headers["x-csrf-token"];
  }

  public async post(path: string, data: string) {
    const headers = this.headers;

    headers["x-csrf-token"] = this.token;
    headers["accept"] = "application/vnd.sap.adt.repository.virtualfolders.result.v1+xml";
    headers["content-type"] = "application/vnd.sap.adt.repository.virtualfolders.request.v1+xml";
    const resp = await axios.post(this.host + path, data, {
      headers,
      httpsAgent: this.httpsAgent,
      responseType: "blob",
    });

    return resp.data as string;
  }

  public async get(path: string) {
    const headers = this.headers;

    headers["accept"] = "*/*";
    headers["x-csrf-token"] = this.token;
    const resp = await axios.get(this.host + path, {
      headers,
      httpsAgent: this.httpsAgent,
      responseType: "blob",
    });

    return resp.data as string;
  }

}