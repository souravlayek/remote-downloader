import https from "https";
import http from "http";
import { URL } from "url";
import * as ytdl from "@distube/ytdl-core";

export const validateUrl = async (fileUrl) => {
  const { protocol, host, pathname } = new URL(fileUrl);
  const httpModule = protocol === "https:" ? https : http;
  return new Promise((resolve, reject) => {
    if (ytdl.validateURL(fileUrl)) {
      resolve("youtube");
      return;
    }
    const req = httpModule.request(
      { method: "HEAD", host, path: pathname },
      (res) => {
        const contentType = res.headers["content-type"];

        if (!contentType) {
          reject(new Error("Could not determine the content type."));
        } else if (contentType.startsWith("text/html")) {
          reject(new Error("The URL points to an HTML page."));
        } else {
          resolve(contentType);
        }
      },
    );

    req.on("error", (err) =>
      reject(new Error(`Request error: ${err.message}`)),
    );

    req.end();
  });
};

/**
 * Extracts the filename and extension from a given URL.
 * @param {string} fileUrl - The URL containing the file.
 * @returns {Object} - An object with the `filename` and `extension` properties.
 */
export const extractFileInfo = (fileUrl) => {
  try {
    // Parse the URL
    const urlObj = new URL(fileUrl);

    // Extract the file name from the `response-content-disposition` query parameter
    const contentDisposition = urlObj.searchParams.get(
      "response-content-disposition",
    );
    let filename = "";

    if (contentDisposition) {
      const match = contentDisposition.match(/filename\*?=(UTF-8'')?(.+)/i);
      if (match && match[2]) {
        filename = decodeURIComponent(match[2].replace(/['"]/g, ""));
      }
    }

    // Fallback: extract the file name from the pathname if not found in query parameters
    if (!filename) {
      const pathname = urlObj.pathname;
      filename = pathname.substring(pathname.lastIndexOf("/") + 1);
    }

    // Extract the file extension
    const extension = filename.includes(".") ? filename.split(".").pop() : "";

    return {
      filename,
      extension,
    };
  } catch (error) {
    throw new Error(`Error extracting file info: ${error.message}`);
  }
};
