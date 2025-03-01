const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const { getPackages } = require("../services/notionService");

// Hiển thị trang package
exports.getPackagePage = (req, res) => {
  res.render("package", { title: "Package" });
};

exports.getPackages = async (req, res) => {
  try {
    const packages = await getPackages();

    console.log("Raw Packages Data:", JSON.stringify(packages, null, 2)); // Debug

    res.render("package", { packages: packages });
  } catch (error) {
    console.error("Error fetching packages:", error);
    res.status(500).send("Lỗi lấy dữ liệu package");
  }
};

exports.getPackageDetail = async (req, res) => {
  const packageId = req.params.id;

  try {
    console.log("Fetching package details for ID:", packageId);

    // Lấy dữ liệu từ Notion
    const response = await notion.pages.retrieve({ page_id: packageId });

    console.log("Notion Response:", JSON.stringify(response, null, 2));

    // Kiểm tra và lấy danh sách ảnh từ thuộc tính File & media
    const imageProperty = response.properties?.["Image URL"]?.files || [];
    const imageUrls = imageProperty
      .map((file) => file.file?.url || file.external?.url)
      .filter(Boolean);

    console.log("Processed Image URLs:", imageUrls);

    // Nếu yêu cầu API (JSON), trả về JSON
    if (req.xhr || req.headers.accept?.includes("application/json")) {
      return res.json({ id: packageId, images: imageUrls });
    }

    // Nếu là request từ trình duyệt, render trang chi tiết
    res.render("package-detail", { packageId, images: imageUrls });
  } catch (error) {
    console.error("Error fetching package details:", error.message);

    if (req.xhr || req.headers.accept?.includes("application/json")) {
      return res.status(500).json({ error: error.message });
    }

    res.status(500).send("Error loading package details.");
  }
};
