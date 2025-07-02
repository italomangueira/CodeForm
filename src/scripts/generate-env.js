// scripts/generate-env.js
const fs = require("fs");

const envContent = `
export const environment = {
  QR_CODE_DATA: "${process.env.QR_CODE_DATA || ""}",
  CHAVE_PIX: "${process.env.CHAVE_PIX || ""}"
};
`;

fs.writeFileSync("src/environments/environment.ts", envContent);
fs.writeFileSync("src/environments/environment.prod.ts", envContent);
