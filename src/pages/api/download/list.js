import db from "@/utils/dbHelper";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  // Get query parameters
  const status = req.query.status;
  const name = req.query.name;
  if (status) {
    res.status(200).json(await db.getFilesByStatus(status));
  } else if (name) {
    res.status(200).json(await db.getFilesByName(name));
  } else {
    res.status(200).json(await db.getAllFiles());
  }
};

export default handler;
