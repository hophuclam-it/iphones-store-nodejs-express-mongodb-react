// File: controllers/productController.js
const Product = require("../models/Product");
const Category = require("../models/Category");
const mongoose = require("mongoose");
const slugify = require("slugify");
const removeVietnameseTones = require("../utils/removeVietnameseTones"); // Hàm loại bỏ dấu tiếng Việt

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      richDescription,
      brand,
      category,
      specs,
      variants,
    } = req.body;

    if (!name || !category) {
      return res
        .status(400)
        .json({ message: "Tên sản phẩm và danh mục là bắt buộc" });
    }

    const parsedSpecs =
      typeof specs === "string" ? JSON.parse(specs) : specs || {};
    const parsedVariants =
      typeof variants === "string" ? JSON.parse(variants) : variants || [];

    // const productImage = req.files?.['image']?.[0]?.filename || req.body.image || null;
    const productImage =
      req.files?.['image']?.[0]?.filename ||
      req.body.image ||
      '/uploads/default-image.png'; // Ảnh mặc định

    // const parsedImages = Array.isArray(req.body.images)
    //   ? req.body.images
    //   : typeof req.body.images === 'string'
    //   ? JSON.parse(req.body.images)
    //   : [];

    let parsedImages = [];
    if (Array.isArray(req.body.images)) {
      parsedImages = req.body.images;
    } else if (typeof req.body.images === 'string') {
      try {
        parsedImages = JSON.parse(req.body.images);
      } catch (err) {
        console.warn('Không thể parse images:', err.message);
        parsedImages = [];
      }
    }


    const product = new Product({
      name,
      description,
      richDescription,
      brand,
      category,
      specs: parsedSpecs,
      variants: [],
      // image: req.body.image
      image: productImage,
      images: parsedImages,
    });




    await product.save();

    const variantImages = req.files?.["variantImages"] || [];

    const processedVariants = parsedVariants.map((variant, index) => {
      // const variantName = `${name} ${variant.color}`;
      const variantName = `${name} ${variant.storage}`;


      const slug = slugify(removeVietnameseTones(variantName), { lower: true, strict: true });
      // const sku = `${name.replace(/\s+/g, '-').toUpperCase()}-${removeVietnameseTones(`${variant.storage}`).toUpperCase().replace(/\s+/g, '-')}`;

      const sku = `${ removeVietnameseTones(name).replace(/\s+/g, '-').toUpperCase()}-${removeVietnameseTones(`${variant.storage}`).toUpperCase().replace(/\s+/g, '-')}`;


      let images = [];

      // Nếu có file upload
      const uploadedImages = variantImages.filter((img) =>
        img.originalname.startsWith(`variant-${index}`)
      );
      if (uploadedImages.length > 0) {
        images = uploadedImages.map((img) => img.filename);
      } else if (Array.isArray(variant.images)) {
        // Nếu không có file, dùng URL từ body
        images = variant.images;
      }

      return {
        ...variant,
        product: product._id,
        name: variantName,
        slug,
        sku,
        images,
      };
    });

    product.variants.push(...processedVariants);
    await product.save();

    // return res.status(201).json({
    //   message: 'Thêm sản phẩm thành công',
    //   product
    // });

    res.status(201).json(product);
  } catch (err) {
    console.error("Lỗi tạo sản phẩm:", err);
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống", error: err.message });
  }
};



// // GET - Lấy danh sách tất cả sản phẩm /api/products
// const getAllProducts = async (req, res) => {
//   try {
//     const { category, search, page = 1, limit = 10 } = req.query;

//     const filter = {};
//     if (category) filter.category = category;
//     if (search) filter.name = { $regex: search, $options: 'i' };

//     const skip = (page - 1) * limit;

//     const products = await Product.find(filter)
//       .populate('category')
//       .populate({
//         path: 'reviews', // Populate danh sách review
//         populate: { path: 'user', select: 'name email' } // Populate thông tin người dùng trong review
//       })
//       .sort({ createdAt: -1 }) // Sắp xếp giảm dần theo `createdAt`
//       .skip(skip)
//       .limit(parseInt(limit));


//     const total = await Product.countDocuments(filter);

//     res.status(200).json(products);
//   } catch (err) {
//     console.error('Lỗi khi lấy danh sách sản phẩm:', err);
//     res.status(500).json({ message: 'Lỗi server', error: err.message });
//   }
// };


// GET - Lấy toàn bộ sản phẩm (không phân trang, frontend sẽ xử lý)
const getAllProducts = async (req, res) => {
  try {
    const { category, search } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const products = await Product.find(filter)
      .populate("category")
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'name email' }
      })
      .sort({ createdAt: -1 }); // Mới nhất trước
      // .sort({ createdAt: 1 }); // Cũ nhất trước
      // .sort({updatedAt: 1}) // Sắp xếp theo updatedAt mới nhất trước

    res.status(200).json(products);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// GET - Lấy chi tiết sản phẩm theo ID /api/products/:id
const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId)
      .populate("category")
      .populate({
        path: "reviews", // Populate danh sách review
        populate: { path: "user", select: "name email" }, // Populate thông tin người dùng trong review
      });
    // console.log('Product after populate:', product);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.status(200).json(product);
    // res.status(200).json({
    //   message: 'Lấy chi tiết sản phẩm thành công',
    //   product
    // });
  } catch (err) {
    console.error("Lỗi khi lấy chi tiết sản phẩm:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};


const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Log dữ liệu nhận được
    // console.log('req.body:', req.body);
    // console.log('req.files:', req.files);

    const { name, description, richDescription, brand, category, specs, variants } = req.body;

    // Kiểm tra nếu `req.body` không chứa các trường cần thiết
    if (!name || !category) {
      return res.status(400).json({ message: 'Tên sản phẩm và danh mục là bắt buộc' });
    }

    // Parse specs và variants nếu cần
    let parsedSpecs = {};
    if (typeof specs === "string") {
      try {
        parsedSpecs = JSON.parse(specs);
      } catch {
        throw new Error("Dữ liệu specs không hợp lệ.");
      }
    } else {
      parsedSpecs = specs;
    }

    let parsedVariants = [];
    if (typeof variants === "string") {
      parsedVariants = JSON.parse(variants);
    } else {
      parsedVariants = variants;
    }

    // Tạo slug cho sản phẩm nếu tên thay đổi
    const slug = name
      ? slugify(name, { lower: true, strict: true })
      : undefined;



    // Xử lý từng biến thể
    const processedVariants = parsedVariants.map((variant, index) => {
      if (!variant.color || !variant.storage) {
        throw new Error(
          `Biến thể tại vị trí ${index} thiếu thông tin 'color' hoặc 'storage'.`
        );
      }

      const variantName = `${name} ${variant.storage}`;
      const variantSlug = slugify(
        removeVietnameseTones(`${name} ${variant.storage}`),
        { lower: true, strict: true }
      );
      // const variantSku = `${name.replace(/\s+/g, '-').toUpperCase()}-${removeVietnameseTones(`${variant.storage}`).toUpperCase().replace(/\s+/g, '-')}`;
      const variantSku = `${removeVietnameseTones(name).replace(/\s+/g, '-').toUpperCase()}-${removeVietnameseTones(`${variant.storage}`).toUpperCase().replace(/\s+/g, '-')}`;

      return {
        ...variant,
        name: variantName,
        slug: variantSlug,
        sku: variantSku,
        product: productId // Thêm ID sản phẩm vào biến thể
      };
    });

    // Cập nhật dữ liệu sản phẩm
    const updatedData = {
      name,
      slug,
      description,
      richDescription,
      brand,
      category,
      specs: parsedSpecs,
      variants: processedVariants,
      updatedAt: new Date(), // Cập nhật thời gian sửa đổi
      ...(req.body.image && { image: req.body.image }),
      ...(req.body.images && { images: req.body.images }),
    };

    // Cập nhật sản phẩm trong cơ sở dữ liệu
    const product = await Product.findByIdAndUpdate(productId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    // res.status(200).json({
    //   message: "Cập nhật sản phẩm thành công",
    //   product,
    // });

    res.status(200).json(product);
  } catch (err) {
    console.error('Lỗi khi cập nhật sản phẩm:', err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};


// // PUT - Cập nhật sản phẩm theo ID /api/products/:id
// const updateProduct = async (req, res) => {
//   try {
//     const productId = req.params.id;

//     const { name, description, richDescription, brand, category, specs, variants } = req.body;

//     let parsedSpecs = {};
//     if (typeof specs === 'string') {
//       try {
//         parsedSpecs = JSON.parse(specs);
//       } catch {
//         throw new Error('Dữ liệu specs không hợp lệ.');
//       }
//     } else {
//       parsedSpecs = specs;
//     }

//     let parsedVariants = [];
//     if (typeof variants === 'string') {
//       parsedVariants = JSON.parse(variants);
//     } else {
//       parsedVariants = variants;
//     }




//     // Tạo slug cho sản phẩm nếu tên thay đổi
//     const slug = name ? slugify(name, { lower: true, strict: true }) : undefined;

//     // Xử lý từng biến thể
//     const processedVariants = parsedVariants.map((variant, index) => {
//       if (!variant.color || !variant.storage) {
//         throw new Error(`Biến thể tại vị trí ${index} thiếu thông tin 'color' hoặc 'storage'.`);
//       }

//       const variantName = `${name} Màu ${variant.color}`;
//       const variantSlug = slugify(
//         removeVietnameseTones(`${name} Màu ${variant.color}`),
//         { lower: true, strict: true }
//       );
//       const variantSku = `${name.replace(/\s+/g, '').toUpperCase()}-${removeVietnameseTones(`Màu-${variant.color}`).toUpperCase().replace(/\s+/g, '-')}`;

//       return {
//         ...variant,
//         name: variantName,
//         slug: variantSlug,
//         sku: variantSku
//       };
//     });

//     // Cập nhật dữ liệu sản phẩm
//     const updatedData = {
//       name,
//       slug,
//       description,
//       richDescription,
//       brand,
//       category,
//       specs: parsedSpecs,
//       variants: processedVariants,
//       ...(req.body.image && { image: req.body.image }),
//       ...(req.body.images && { images: req.body.images })
//     };

//     // Cập nhật sản phẩm trong cơ sở dữ liệu
//     const product = await Product.findByIdAndUpdate(productId, updatedData, { new: true, runValidators: true });

//     if (!product) {
//       return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
//     }

//     res.status(200).json(product);

//   } catch (err) {
//     console.error('Lỗi khi cập nhật sản phẩm:', err);
//     res.status(500).json({ message: 'Lỗi server', error: err.message });
//   }
// };

// DELETE - Xoá sản phẩm theo ID /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Xóa sản phẩm
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    // res.status(200).json({
    //   message: "Xóa sản phẩm thành công",
    // });
    res.status(200).json(product);

  } catch (err) {
    console.error("Lỗi khi xóa sản phẩm:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// GET - Lấy chi tiết sản phẩm theo slug /api/products/slug/:slug
const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // Tìm sản phẩm theo slug hoặc slug trong biến thể
    const product = await Product.findOne({
      $or: [
        { slug }, // Tìm slug trong sản phẩm
        { "variants.slug": slug }, // Tìm slug trong biến thể
      ],
    }).populate("category");

    if (!product) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm với slug này" });
    }

    // Nếu slug nằm trong biến thể, tìm biến thể tương ứng
    const variant = product.variants.find((variant) => variant.slug === slug);

    res.status(200).json({
      message: "Lấy chi tiết sản phẩm thành công",
      product,
      variant: variant || null, // Trả về biến thể nếu tìm thấy
    });
  } catch (err) {
    console.error("Lỗi khi lấy chi tiết sản phẩm bằng slug:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// GET - Tìm kiếm sản phẩm theo tên /api/products/search
const searchProductsByName = async (req, res) => {
  try {
    const { name, page = 1, limit = 10 } = req.query;

    if (!name) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp tên sản phẩm để tìm kiếm" });
    }

    const filter = {
      name: { $regex: name, $options: "i" }, // Tìm kiếm không phân biệt hoa thường
    };

    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .populate("category")
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      message: "Tìm kiếm sản phẩm thành công",
      products,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Lỗi khi tìm kiếm sản phẩm theo tên:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductBySlug,
  searchProductsByName,
};
