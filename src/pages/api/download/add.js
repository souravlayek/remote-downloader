import { downloadFile, downloadYouTube } from "@/utils/downloadHelper";
import { validateUrl } from "@/utils/helper";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const { url, name } = req.body;
  if (!url || !name) {
    res.status(400).json({ error: "Missing required parameters" });
    return;
  }
  try {
    const urlType = await validateUrl(url);
    if (urlType === "youtube") {
      downloadYouTube(url, name);

      res.status(200).json({ message: "File added for download" });
      return;
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
    return;
  }
  try {
    downloadFile(url, name);
  } catch (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.status(200).json({ message: "File added for download" });
};

export default handler;
