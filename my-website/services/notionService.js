require("dotenv").config();
const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const galleryDatabaseId = process.env.NOTION_DATABASE_ID_GALLERY;
const packageDatabaseId = process.env.NOTION_DATABASE_ID_PACKAGE;

// Hàm lấy dữ liệu Gallery
const getGalleryImages = async () => {
  try {
    const response = await notion.databases.query({
      database_id: galleryDatabaseId,
    });
    return response.results.map((page) => {
      // Lấy danh sách file từ "Image URL"
      const imageFiles = page.properties["Image URL"]?.files || [];
      // Lấy URL của hình ảnh đầu tiên (nếu có)
      const firstImageUrl =
        imageFiles.length > 0
          ? imageFiles[0].type === "file"
            ? imageFiles[0].file?.url || ""
            : imageFiles[0].external?.url || ""
          : "";
      return {
        id: page.id,
        title: page.properties.Title?.title[0]?.text.content || "No Title",
        url: firstImageUrl, // Chỉ trả về URL đầu tiên
        category: page.properties.Category?.select?.name || "Uncategorized",
        description:
          page.properties.Description?.rich_text[0]?.text.content || "",
      };
    });
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return [];
  }
};

const getPackages = async () => {
  try {
    const response = await notion.databases.query({
      database_id: packageDatabaseId,
    });

    return response.results.map((page) => {
      // Lấy danh sách file từ "Image URL"
      const imageFiles = page.properties["Image URL"]?.files || [];
      const imageUrls = imageFiles
        .map((file) => {
          if (file.type === "file") {
            return file.file?.url || "";
          } else if (file.type === "external") {
            return file.external?.url || "";
          }
          return "";
        })
        .filter((url) => url !== ""); // Lọc bỏ URL trống

      return {
        id: page.id,
        title: page.properties.Title?.title[0]?.text.content || "No Title",
        url: imageUrls, // Trả về tất cả ảnh dưới dạng mảng chuỗi
        category: page.properties.Category?.select?.name || "Uncategorized",
        price: page.properties.Price?.number || 0,
        description:
          page.properties.Description?.rich_text[0]?.text.content || "",
      };
    });
  } catch (error) {
    console.error("Error fetching packages:", error);
    return [];
  }
};

// Xuất hai hàm
module.exports = { getGalleryImages, getPackages };
