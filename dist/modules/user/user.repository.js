"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = exports.UserRepository = void 0;
const user_model_1 = require("./user.model");
class UserRepository {
    async findById(id) {
        return user_model_1.User.findOne({ _id: id, isDeleted: false });
    }
    async findByEmail(email, includePassword = false) {
        const query = user_model_1.User.findOne({ email: email.toLowerCase(), isDeleted: false });
        if (includePassword) {
            query.select('+password');
        }
        return query;
    }
    async create(userData) {
        return user_model_1.User.create(userData);
    }
    async update(id, updateData) {
        return user_model_1.User.findOneAndUpdate({ _id: id, isDeleted: false }, updateData, {
            new: true,
            runValidators: true,
        });
    }
    async softDelete(id, deletedBy) {
        return user_model_1.User.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true, updatedBy: deletedBy }, { new: true });
    }
    async findAll(query) {
        const page = Math.max(1, query.page || 1);
        const limit = Math.max(1, query.limit || 10);
        const skip = (page - 1) * limit;
        const filter = {};
        if (query.showDeleted === 'true') {
            filter.isDeleted = true;
        }
        else {
            filter.isDeleted = false;
        }
        // Search query
        if (query.search) {
            filter.$or = [
                { name: { $regex: query.search, $options: 'i' } },
                { email: { $regex: query.search, $options: 'i' } },
            ];
        }
        // Role filtering
        if (query.role) {
            filter.role = query.role;
        }
        // Status filtering
        if (query.status) {
            filter.status = query.status;
        }
        // Sorting
        const sortField = query.sort || 'createdAt';
        const sortOrder = query.order === 'desc' ? -1 : 1;
        const sortObj = { [sortField]: sortOrder };
        const total = await user_model_1.User.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);
        const data = await user_model_1.User.find(filter)
            .sort(sortObj)
            .skip(skip)
            .limit(limit);
        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages,
            },
        };
    }
}
exports.UserRepository = UserRepository;
exports.userRepository = new UserRepository();
