require("dotenv").config();
const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const galleryDatabaseId = process.env.NOTION_DATABASE_ID_GALLERY;
const packageDatabaseId = process.env.NOTION_DATABASE_ID_PACKAGE;

// Hàm lấy dữ liệu Gallery
const getGalleryImages = async () => {
  try {
    const response = await notion.databases.query({ database_id: galleryDatabaseId });
    return response.results.map((page) => ({
      id: page.id,
      title: page.properties.Title?.title[0]?.text.content || "No Title",
      url: page.properties["Image URL"]?.url || "",
      category: page.properties.Category?.select?.name || "Uncategorized",
      description: page.properties.Description?.rich_text[0]?.text.content || "",
    }));
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return [];
  }
};

// Hàm lấy dữ liệu Package
const getPackages = async () => {
  try {
    const response = await notion.databases.query({ database_id: packageDatabaseId });

    return response.results.map(page => ({
      id: page.id,
      title: page.properties.Title?.title[0]?.text.content || "No Title",
      url: page.properties["Image URL"]?.url || "",
      category: page.properties.Category?.select?.name || "Uncategorized",
      price: page.properties.Price?.number || 0,
      description: page.properties.Description?.rich_text[0]?.text.content || ""
    }));
  } catch (error) {
    console.error("Error fetching packages:", error);
    return [];
  }
};

// Xuất hai hàm
module.exports = { getGalleryImages, getPackages };
