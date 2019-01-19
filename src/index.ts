import {ADT} from "./adt";

async function run() {
  if (process.argv.length < 5) {
    console.log("adt [host] [user] [pwd]");
    return undefined;
  }
  const adt = await ADT.login(process.argv[2], process.argv[3], process.argv[4]);

  console.dir(await adt.readPackage("ZHVAM"));
  console.dir(await adt.readClass("zcl_cloud_ssl_test"));

  return undefined;
}

run().then(() => {
  process.exit();
}).catch((err) => {
  console.dir(err);
  process.exit(1);
});