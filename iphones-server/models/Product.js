const mongoose = require('mongoose');
const slugify = require('slugify');


// Variant schema
const variantSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  slug: { type: String, required: true},
  name: { type: String},
  sku: { type: String, required: true},
  color: { type: String, required: true },
  storage: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, min: 0, max: 100 },
  stock: { type: Number, required: true },
  images: [String]
});



variantSchema.virtual('finalPrice').get(function () {
  if (!this.price || this.price < 0 ) return 0;
  return this.discount ? this.price - (this.price * this.discount) / 100 : this.price;
});

variantSchema.set('toJSON', { virtuals: true });
variantSchema.set('toObject', { virtuals: true });

// Specs
const specsSchema = new mongoose.Schema({
  screen: String,
  chip: String,
  camera: String,
  battery: String
});

// Product schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String},
  description: String,
  richDescription: String,
  image: String,
  images: [String],
  brand: { type: String, default: 'Apple' },
  variants: [variantSchema],
  colorVariants: [variantSchema],
  specs: specsSchema,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  isFeatured: { type: Boolean, default: false },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }], // Tham chiếu đến model Review
  averageRating: { type: Number, default: 5 },
  numReviews: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }, 
  updatedAt: { type: Date, default: Date.now }
});

productSchema.pre('save', function (next) {
  if (!this.isModified('name')) return next();
  if (!this.name || this.name.trim()===''){
    return next(new Error('Tên sản phẩm không được để trống.'));
  }
  // this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

productSchema.pre('remove', async function (next) {
  try {
    await this.model('Variant').deleteMany({ product: this._id });
    next();
  } catch (err) {
    next(err);
  }
});

productSchema.path('averageRating').get(v => (v == null || v < 0 || v > 5 ? 5 : v));
productSchema.path('numReviews').get(v => (v == null || v < 0 ? 0 : v));
productSchema.set('toJSON', { virtuals: true, getters: true });
productSchema.set('toObject', { virtuals: true, getters: true });

// Exports
const Product = mongoose.model('Product', productSchema);
const Variant = mongoose.model('Variant', variantSchema);
const Specs = mongoose.model('Specs', specsSchema);

module.exports = Product;
