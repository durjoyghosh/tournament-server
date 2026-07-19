"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => {
    return async (req, _res, next) => {
        try {
            const parsed = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            // Assign parsed/validated values back to request only if they are defined in the schema
            if (schema && 'shape' in schema) {
                const shape = schema.shape;
                if ('body' in shape)
                    req.body = parsed.body;
                if ('query' in shape)
                    req.query = parsed.query;
                if ('params' in shape)
                    req.params = parsed.params;
            }
            else {
                req.body = parsed.body;
                req.query = parsed.query;
                req.params = parsed.params;
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.validate = validate;
exports.default = exports.validate;
