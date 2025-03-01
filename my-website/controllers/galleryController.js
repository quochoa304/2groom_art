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

exports.getGalleryDetail = async (req, res) => {
  const galleryId = req.params.id;

  try {
    console.log("Fetching gallery details for ID:", galleryId);

    // Lấy dữ liệu từ Notion
    const response = await notion.pages.retrieve({ page_id: galleryId });

    console.log("Notion Response:", JSON.stringify(response, null, 2));

    // Lấy danh sách ảnh từ Notion, tách thành mảng URL
    const imageUrls = response.properties?.["Image URL"]?.url
      ? response.properties["Image URL"].url
          .split(/[\s|]+/) // Tách bằng khoảng trắng hoặc dấu "|"
          .filter((url) => url.trim()) // Loại bỏ các chuỗi rỗng
      : [];

    console.log("Processed Image URLs:", imageUrls);

    // Nếu yêu cầu API (JSON), trả về JSON
    if (req.xhr || req.headers.accept?.includes("application/json")) {
      return res.json({ id: galleryId, images: imageUrls });
    }

    // Nếu là request từ trình duyệt, render trang chi tiết
    res.render("gallery-detail", { galleryId, images: imageUrls });
  } catch (error) {
    console.error("Error fetching gallery details:", error.message);

    if (req.xhr || req.headers.accept?.includes("application/json")) {
      return res.status(500).json({ error: error.message });
    }

    res.status(500).send("Error loading gallery details.");
  }
};
