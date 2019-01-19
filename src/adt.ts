import {HTTP} from "./http";

export class ADT {
  private http: HTTP;

  private constructor() {
// force instantiation private, use login() method to create instance
  }

  public static async login(host: string, username: string, password: string) {
    const ret = new ADT();

    ret.http = new HTTP(host);
    await ret.http.login(username, password);

    return ret;
  }

  public async readPackage(devc: string) {
    const xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
      "<vfs:virtualFoldersRequest xmlns:vfs=\"http://www.sap.com/adt/ris/virtualFolders\" objectSearchPattern=\"*\">\n" +
      "  <vfs:preselection facet=\"package\">\n" +
      "    <vfs:value>.." + devc + "</vfs:value>\n" +
      "  </vfs:preselection>\n" +
      "  <vfs:facetorder>\n" +
      "    <vfs:facet>type</vfs:facet>\n" +
      "  </vfs:facetorder>\n" +
      "</vfs:virtualFoldersRequest>";

    const data = await this.http.post("/sap/bc/adt/repository/informationsystem/virtualfolders/contents", xml);

    return data;
  }

  public async readClass(name: string) {
    const data = await this.http.get("/sap/bc/adt/oo/classes/" + name.toLowerCase() + "/source/main");
    return data;
  }

}