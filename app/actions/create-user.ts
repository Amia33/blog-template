"use server";

import { checkBotId } from "botid/server";

export async function createUser(formData: FormData) {
  const verification = await checkBotId();

  if (verification.isBot) {
    throw new Error("Access denied");
  }

  const userData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
  };

  const user = await saveUser(userData);
  return { success: true, user };
}

async function saveUser(userData: { name: string; email: string }) {
  // Your database logic here
  console.log("Saving user:", userData);
  return { id: "123", ...userData };
}
