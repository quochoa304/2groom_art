const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const { getPackages } = require("../services/notionService");

// Hiển thị trang package
exports.getPackagePage = (req, res) => {
  res.render("package", { title: "Package" });
};

// Lấy danh sách tất cả các gói chụp ảnh nhưng chỉ lấy ảnh đầu của mỗi gói

exports.getPackages = async (req, res) => {
  try {
    const packages = await getPackages(); // Gọi một lần để lấy danh sách packages

    // Lọc ảnh đầu tiên của mỗi gói (nếu có nhiều ảnh)
    const processedPackages = packages.map(pkg => ({
      ...pkg,
      url: pkg.url ? pkg.url.split(/[\s|]+/)[0].trim() : "", // Lấy ảnh đầu tiên
    }));

    res.render("package", { packages: processedPackages });
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

    // Lấy danh sách ảnh từ Notion, tách thành mảng URL
    const imageUrls = response.properties?.["Image URL"]?.url
      ? response.properties["Image URL"].url
          .split(/[\s|]+/) // Tách bằng khoảng trắng hoặc dấu "|"
          .filter((url) => url.trim()) // Loại bỏ các chuỗi rỗng
      : [];

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
