const { getGalleryImages } = require("../services/notionService");



exports.getHomePage = async (req, res) => {
  try {
    let images = await getGalleryImages();

    // Đảm bảo images là một mảng và lấy 2 ảnh mới nhất
    if (Array.isArray(images)) {
      images = images.slice(0, 2);
    }

    console.log("Latest 2 images:", images);
    res.render("home", { title: "Trang chủ", images });
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).send("Lỗi lấy dữ liệu ảnh");
  }
};


exports.getImageById = async (req, res) => {
  const imageId = req.params.id;

  try {
    console.log("Fetching image with ID:", imageId);

    const response = await notion.pages.retrieve({ page_id: imageId });

    console.log("Notion Response:", JSON.stringify(response, null, 2));

    const title =
      response.properties?.Title?.title?.[0]?.text?.content || "No Title";
    const description =
      response.properties?.Description?.rich_text?.[0]?.text?.content ||
      "No Description";
    const imageUrl = response.properties?.["Image URL"]?.url || "";

    res.json({ id: imageId, title, description, url: imageUrl });
  } catch (error) {
    console.error("Error fetching image:", error.message);
    res.status(500).json({ error: error.message });
  }
};
