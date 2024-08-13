import fs from "fs";
import path from "path";
import https from "https";
import { extractFileInfo } from "./helper";
import db from "./dbHelper";
import * as ytdl from "@distube/ytdl-core";

const outputPath = path.join(process.cwd(), "output");

export const downloadYouTube = (videoUrl, fileName) => {
  if (!fileName) {
    fileName = `${ytdl.getURLVideoID(videoUrl)}.mp4`;
  } else if (!fileName.includes(".")) {
    fileName = `${fileName}.mp4`;
  }
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
  }

  if (fs.existsSync(path.join(outputPath, fileName))) {
    fileName = `${fileName.split(".")[0]}_${Date.now()}.mp4`;
  }

  const video = ytdl(videoUrl);
  const file = path.join(outputPath, fileName);

  video.pipe(fs.createWriteStream(file));
  db.addFile(fileName, videoUrl, "youtube", "downloading");

  video.on("progress", (chunkLength, downloaded, total) => {
    const percent = ((downloaded / total) * 100).toFixed(2);
    console.log(`Progress: ${percent}%`);
  });

  video.on("end", () => {
    console.log(`Finished downloading video to ${fileName}`);
    db.updateFileStatus(fileName, "completed");
  });

  video.on("error", (err) => {
    console.log(`Error downloading video: ${err.message}`, err);
    console.error(`Error: ${err.message}`);
    db.updateFileStatus(fileName, "failed");
  });
};

export const downloadFile = async (fileUrl, fileName) => {
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
  }
  const { extension } = extractFileInfo(fileUrl);
  // Check if filename contains extension
  if (!fileName.includes(".")) {
    if (!extension) {
      throw new Error("Could not determine the file extension.");
    }
    fileName = `${fileName}.${extension}`;
  }
  console.log(fileName, extension);
  if (fs.existsSync(path.join(outputPath, fileName))) {
    fileName = `${fileName.split(".")[0]}-${Date.now()}.${extension}`;
  }

  const file = fs.createWriteStream(path.join(outputPath, fileName));
  db.addFile(fileName, fileUrl, extension, "downloading");
  https.get(fileUrl, (response) => {
    response.on("end", () => {
      console.log("Request closed", Date.now());
      db.updateFileStatus(fileName, "completed");
    });
    response.on("error", (error) => {
      db.updateFileStatus(fileName, "failed");
      console.error(error);
    });
    response.pipe(file);
  });
};
