import { validateUrl } from "@/utils/helper";
import { downloadFile } from "@/utils/downloadHelper";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const { url, name } = req.body;
  try {
    await validateUrl(url);
  } catch (error) {
    res.status(400).json({ error: error.message });
    return;
  }
  downloadFile(url, name);
  res.status(200).json({ name: "John Doe" });
}
