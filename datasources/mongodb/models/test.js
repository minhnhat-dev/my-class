const kf_framework = require('../internal/kf_framework');

const {
  mongoose,
  mongoose_deleted_field,
  mongoose_delete,
  mongoose_auto_increment,
} = kf_framework.Models;
const { Schema } = mongoose;
const common = require('../common');

const { Helper } = common;
const { Constants } = common;
const timestamps = require('mongoose-timestamp');

const STATUS = {
  draft: 'draft',
  confirmed: 'confirmed',
  closed: 'closed',
  canceled: 'canceled',
};
exports.STATUS = STATUS;

const LINE_STATUS = {
  waiting: 'waiting',
  recording: 'recording',
  confirmed: 'confirmed',
};
exports.LINE_STATUS = LINE_STATUS;

const ProductSchema = {
  _id: false,
  type: new mongoose.Schema({
    id: {
      type: mongoose.Types.ObjectId,
      default: null,
    },
    name: { type: String, default: '' },
    internal_code: { type: String, required: false },
    description: { type: String, default: '' },
    base_unit: {
      type: new mongoose.Schema({
        _id: false,
        id: {
          type: mongoose.Types.ObjectId,
          default: null,
        },
        name: { type: String, required: false },
      }),
    },
    category: {
      type: new mongoose.Schema({
        _id: false,
        id: {
          type: mongoose.Types.ObjectId,
          default: null,
        },
        name: { type: String, required: false },
        manager: {
          type: mongoose.Types.ObjectId,
          default: null,
        },
        code: { type: Number },
        level: { type: Number, default: 1 },
      }),
    },
    category_1: {
      type: new mongoose.Schema({
        _id: false,
        id: {
          type: mongoose.Types.ObjectId,
          default: null,
        },
        name: { type: String, required: false },
        manager: {
          type: mongoose.Types.ObjectId,
          default: null,
        },
        code: { type: Number },
        level: { type: Number, default: 1 },
      }),
    },
  }),
};

const VariantSchema = new mongoose.Schema({
  _id: false,
  id: { type: mongoose.Types.ObjectId, default: null },
  barcode: { type: String, required: false },
  unit: {
    type: new mongoose.Schema({
      _id: false,
      id: {
        type: mongoose.Types.ObjectId,
        default: null,
      },
      name: { type: String, required: false },
      type: { type: String, required: false },
      conversion: { type: Number, required: false },
    }),
  },
});

const TrayIemSchema = new mongoose.Schema({
  _id: false,
  id: {
    type: mongoose.Types.ObjectId,
    default: null,
  },
  tray_code: { type: String, required: false },
  location: { type: Number, required: false },
  short_tray_code: { type: String, required: false },
  short_module_code: { type: String, required: false },
});

const LineItemSchema = new Schema({
  stocktake_id: {
    type: mongoose.Types.ObjectId,
    default: null,
  },
  stocktake_code: { type: String, default: '' },
  branch: new Schema({
    _id: false,
    id: {
      type: mongoose.Types.ObjectId,
      default: null,
    },
    name: { type: String, required: false },
    code: { type: String, required: false },
  }),
  unique_code: { type: String, unique: true },
  product: ProductSchema,
  base_variant: VariantSchema,
  stock_lines: [
    new Schema({
      variant: VariantSchema,
      tray_item: TrayIemSchema,
      quantity: { type: Number, default: 0 },
    }),
  ],
  status: { type: String, enum: Object.values(LINE_STATUS), default: LINE_STATUS.waiting, required: false },
  actual_stock: { type: Number, required: false, default: 0 },
  quantity: { type: Number, required: false, default: -1 },
  modified_by: { type: mongoose.SchemaTypes.ObjectId, required: false },
  modified_email: { type: String, required: false },
  modified_name: { type: String, required: false },
  modified_at: { type: Date, required: false },
  reasons: [
    new mongoose.Schema({
      _id: false,
      reason: { type: String, default: '' },
      quantity: { type: Number, default: 0 },
    }),
  ],
  reason_desc: { type: String, default: '' },
  confirmed_count: { type: Number, default: 0 },
});

LineItemSchema.pre(['save'], function (next) {
  if (this.stocktake_code && this.base_variant) {
    this.unique_code = `${this.stocktake_code}_${this.base_variant.barcode}`;
  }

  return next();
});

LineItemSchema.plugin(timestamps, {
  createdAt: 'created_at',
  updatedAt: 'modified_at',
});

LineItemSchema.plugin(mongoose_delete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
});

LineItemSchema.plugin(mongoose_deleted_field);

exports.LineItemSchema = LineItemSchema;

const StockTakeLineModel = mongoose.model('StockTakeLineModel', LineItemSchema, Constants.KF_STOCKTAKE_LINES);
exports.StockTakeLineModel = StockTakeLineModel;

/**
 * Model Head
 */
const ModelSchema = new Schema({
  code: { type: String, default: '', unique: true },
  reference_number: { type: String, default: '' },
  status: { type: String, enum: Object.values(STATUS), default: STATUS.draft, required: false },
  created_date: { type: Date, required: false },
  created_by: { type: mongoose.SchemaTypes.ObjectId, required: false },
  modified_by: { type: mongoose.SchemaTypes.ObjectId, required: false },
  note: { type: String, required: false },
  branch: new Schema({
    _id: false,
    id: {
      type: mongoose.Types.ObjectId,
      default: null,
    },
    name: { type: String, required: false },
    code: { type: String, required: false },
  }),
});

ModelSchema.pre(['save'], function (next) {
  if (this.code) {
    this.hash = this.code;
  }

  return next();
});

ModelSchema.plugin(timestamps, {
  createdAt: 'created_at',
  updatedAt: 'modified_at',
});

ModelSchema.plugin(mongoose_delete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
});

ModelSchema.plugin(mongoose_deleted_field);

exports.ModelSchema = ModelSchema;

const Model = mongoose.model('StockTakeModel', ModelSchema, Constants.KF_STOCKTAKES);
exports.Model = Model;

/**
 * Model StockTakeLineHistory
 */
const StockLineHistorySchema = new Schema({
  old: { type: Schema.Types.Mixed },
  updated: { type: Schema.Types.Mixed },
  user: { type: Schema.Types.Mixed },
});

StockLineHistorySchema.pre(['save'], (next) => next());

StockLineHistorySchema.plugin(timestamps, {
  createdAt: 'created_at',
  updatedAt: 'modified_at',
});

StockLineHistorySchema.plugin(mongoose_delete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
});

StockLineHistorySchema.plugin(mongoose_deleted_field);

exports.StockLineHistorySchema = StockLineHistorySchema;

const StockTakeLineHistoryModel = mongoose.model('StockTakeLineHistoryModel', StockLineHistorySchema, Constants.KF_STOCKTAKE_LINE_HISTORY);
exports.StockTakeLineHistoryModel = StockTakeLineHistoryModel;
