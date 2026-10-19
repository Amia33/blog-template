import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

import { hash } from "@node-rs/argon2";

async function readPassword(): Promise<string> {
  const fromArgv = process.argv[2];

  if (fromArgv) return fromArgv;

  const readline = createInterface({ input: stdin, output: stdout });

  try {
    return await readline.question("Password: ");
  } finally {
    readline.close();
  }
}

async function main(): Promise<void> {
  const password = await readPassword();

  if (password.length === 0) {
    throw new Error("Password must not be empty.");
  }

  if (password.length < 12) {
    console.warn(
      "Warning: use a high-entropy password (12+ characters, ideally 16+). " +
        "The hash is stored in the repository and can be attacked offline.",
    );
  }

  const hashed = await hash(password, {
    algorithm: 2, // Argon2id
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
    outputLen: 32,
  });

  console.log(hashed);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
