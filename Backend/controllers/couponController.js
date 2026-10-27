const Coupon = require('../models/Coupon');
const CouponUsage = require('../models/CouponUsage');

// @desc    Create a new coupon
// @route   POST /api/coupons
// @access  Admin
exports.createCoupon = async (req, res) => {
  try {
    const coupon = new Coupon(req.body);
    await coupon.save();
    
    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: coupon
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code already exists'
      });
    }
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Admin
exports.getAllCoupons = async (req, res) => {
  try {
    const { active, expired } = req.query;
    let query = {};
    
    if (active) {
      query.isActive = true;
      query.validTo = { $gte: new Date() };
    }
    
    if (expired) {
      query.validTo = { $lt: new Date() };
    }
    
    const coupons = await Coupon.find(query)
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: coupons.length,
      data: coupons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get coupon by ID
// @route   GET /api/coupons/:id
// @access  Admin
exports.getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }
    
    res.json({
      success: true,
      data: coupon
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Admin
exports.updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Coupon updated successfully',
      data: coupon
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Admin
exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Validate coupon code
// @route   POST /api/coupons/validate
// @access  Public
exports.validateCoupon = async (req, res) => {
  try {
    const { code, orderValue, userId, cartItems } = req.body;
    
    if (!code || !orderValue) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code and order value are required'
      });
    }
    
    // Find coupon
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid coupon code'
      });
    }
    
    // Check if coupon is valid
    const validityCheck = coupon.isValid();
    if (!validityCheck.valid) {
      return res.status(400).json({
        success: false,
        message: validityCheck.message
      });
    }
    
    // Check per-user limit
    if (userId && coupon.perUserLimit) {
      const userUsageCount = await CouponUsage.getUserUsageCount(userId, coupon._id);
      if (userUsageCount >= coupon.perUserLimit) {
        return res.status(400).json({
          success: false,
          message: 'You have already used this coupon the maximum number of times'
        });
      }
    }
    
    // Check category restrictions
    if (coupon.applicableCategories && coupon.applicableCategories.length > 0) {
      const hasApplicableProduct = cartItems.some(item =>
        coupon.applicableCategories.includes(item.category)
      );
      
      if (!hasApplicableProduct) {
        return res.status(400).json({
          success: false,
          message: 'This coupon is not applicable to items in your cart'
        });
      }
    }
    
    // Check excluded products
    if (coupon.excludedProducts && coupon.excludedProducts.length > 0) {
      const hasExcludedProduct = cartItems.some(item =>
        coupon.excludedProducts.includes(item.productId)
      );
      
      if (hasExcludedProduct) {
        return res.status(400).json({
          success: false,
          message: 'This coupon cannot be applied to some items in your cart'
        });
      }
    }
    
    // Calculate discount
    const discountResult = coupon.calculateDiscount(orderValue, cartItems);
    
    if (discountResult.discount === 0) {
      return res.status(400).json({
        success: false,
        message: discountResult.message
      });
    }
    
    const responseData = {
      couponId: coupon._id,
      code: coupon.code,
      discount: discountResult.discount,
      finalAmount: orderValue - discountResult.discount,
      savings: discountResult.discount,
      message: discountResult.message
    };
    
    // Add bundle-specific info
    if (coupon.isBundle) {
      responseData.isBundle = true;
      responseData.bundleQuantity = coupon.bundleQuantity;
      responseData.bundlePrice = coupon.bundlePrice;
    }
    
    res.json({
      success: true,
      message: discountResult.message || 'Coupon applied successfully',
      data: responseData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Record coupon usage
// @route   POST /api/coupons/use
// @access  Private
exports.recordCouponUsage = async (req, res) => {
  try {
    const {
      couponId,
      couponCode,
      userId,
      orderId,
      orderValue,
      discountApplied,
      source,
      campaign,
      customerEmail,
      customerPhone
    } = req.body;
    
    // Create usage record
    const usage = new CouponUsage({
      couponId,
      couponCode,
      userId,
      orderId,
      orderValue,
      discountApplied,
      finalAmount: orderValue - discountApplied,
      source,
      campaign,
      customerEmail,
      customerPhone
    });
    
    await usage.save();
    
    // Increment coupon used count
    await Coupon.findByIdAndUpdate(couponId, {
      $inc: { usedCount: 1 }
    });
    
    res.json({
      success: true,
      message: 'Coupon usage recorded'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get coupon analytics
// @route   GET /api/coupons/analytics
// @access  Admin
exports.getCouponAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, couponId } = req.query;
    
    if (couponId) {
      // Analytics for specific coupon
      const analytics = await CouponUsage.getAnalytics(couponId, startDate, endDate);
      const coupon = await Coupon.findById(couponId);
      
      return res.json({
        success: true,
        data: {
          coupon: {
            code: coupon.code,
            type: coupon.type,
            discount: coupon.discount
          },
          analytics
        }
      });
    }
    
    // Overall analytics
    const match = {};
    if (startDate || endDate) {
      match.usedAt = {};
      if (startDate) match.usedAt.$gte = new Date(startDate);
      if (endDate) match.usedAt.$lte = new Date(endDate);
    }
    
    const overallAnalytics = await CouponUsage.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$couponCode',
          couponId: { $first: '$couponId' },
          totalUses: { $sum: 1 },
          totalRevenue: { $sum: '$finalAmount' },
          totalDiscount: { $sum: '$discountApplied' },
          avgOrderValue: { $avg: '$orderValue' }
        }
      },
      { $sort: { totalUses: -1 } }
    ]);
    
    res.json({
      success: true,
      data: overallAnalytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Generate coupon report
// @route   GET /api/coupons/report
// @access  Admin
exports.generateCouponReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Get all coupons
    const coupons = await Coupon.find();
    
    // Get usage data
    const match = {};
    if (startDate || endDate) {
      match.usedAt = {};
      if (startDate) match.usedAt.$gte = new Date(startDate);
      if (endDate) match.usedAt.$lte = new Date(endDate);
    }
    
    const usageData = await CouponUsage.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$couponId',
          uses: { $sum: 1 },
          revenue: { $sum: '$finalAmount' },
          discount: { $sum: '$discountApplied' }
        }
      }
    ]);
    
    // Combine data
    const report = coupons.map(coupon => {
      const usage = usageData.find(u => u._id.equals(coupon._id)) || {
        uses: 0,
        revenue: 0,
        discount: 0
      };
      
      const now = new Date();
      const status = coupon.isActive && coupon.validTo >= now ? 'Active' : 'Expired';
      
      return {
        code: coupon.code,
        type: coupon.type,
        discount: coupon.discount,
        status,
        totalUses: usage.uses,
        totalRevenue: usage.revenue,
        totalDiscount: usage.discount,
        conversionRate: coupon.usedCount > 0 ? 
          ((usage.uses / coupon.usedCount) * 100).toFixed(2) + '%' : 'N/A'
      };
    });
    
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
