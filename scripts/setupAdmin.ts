import { initDefaultAdmin } from "../lib/initDefaultAdmin"; // ✅ works with ts-node

async function main() {
  await initDefaultAdmin();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
