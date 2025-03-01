const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const { getGalleryImages } = require("../services/notionService");

// Hiển thị trang gallery
exports.getGallery = async (req, res) => {
  try {
    const images = await getGalleryImages();
    res.render("gallery", { images });
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).send("Lỗi lấy dữ liệu ảnh");
  }
};

// Lấy thông tin ảnh theo ID
exports.getImageById = async (req, res) => {
  const imageId = req.params.id;

  try {
    console.log("Fetching image with ID:", imageId);

    const response = await notion.pages.retrieve({ page_id: imageId });

    console.log("Notion Response:", JSON.stringify(response, null, 2));
    console.log("Notion Response:", response);

    const title =
      response.properties?.Title?.title?.[0]?.text?.content || "No Title";
    const description =
      response.properties?.Description?.rich_text?.[0]?.text?.content ||
      "No Description";

    // Lấy URL ảnh từ Notion
    const imageUrls = response.properties?.["Image URL"]?.url
      ? [response.properties["Image URL"].url]
      : [];

    res.json({ id: imageId, title, description, images: imageUrls });
  } catch (error) {
    console.error("Error fetching image:", error.message);
    res.status(500).json({ error: error.message });
  }
};
