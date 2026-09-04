import "server-only";

import { readJsonFile, SETTINGS_FILE, writeJsonFile } from "./local-store";

export const DEFAULT_WHATSAPP_NUMBER = "966598863130";

export type SiteSettings = {
  whatsapp_number: string;
  updated_at?: string;
};

export async function readSiteSettings(): Promise<SiteSettings> {
  const settings = await readJsonFile<SiteSettings>(
    SETTINGS_FILE,
    { whatsapp_number: DEFAULT_WHATSAPP_NUMBER },
  );

  return {
    whatsapp_number:
      settings?.whatsapp_number ||
      DEFAULT_WHATSAPP_NUMBER,
    updated_at: settings?.updated_at,
  };
}

export async function writeSiteSettings(
  whatsappNumber: string,
) {
  await writeJsonFile(SETTINGS_FILE, {
    whatsapp_number: whatsappNumber,
    updated_at: new Date().toISOString(),
  });
}
