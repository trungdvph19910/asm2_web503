import Category from "../model/category";
import Product from "../model/product";
import productValidate from "../schema/product";


//them
export const create = async (req, res) => {
    try {
        const body = req.body;
        const { error } = productValidate.validate(body)
        if (error) {
            const errors = error.details.map((item) => item.message);
            return res.json({
                message: errors
            })
        }
        //
        const data = await Product.create(body);
        await Category.findByIdAndUpdate(data.categoryId, {
            $addToSet: {
                product: data._id
            }
        })
        res.json({
            message: "Thêm thành công",
            data
        })
    } catch (error) {
        return res.json({
            message: "Thêm thất bại",
            error
        })
    }
}
// getAll 

export const getAll = async (req, res) => {
    const { _sort = "price", _order = "asc", _limit = 4, _page = 1 } = req.query;
    const option = {
        page: _page,
        limit: _limit,
        sort: {
            [_sort]: _order === "desc" ? 1 : -1,
        },
    };
    try {
        const { docs, totalDocs, totalPages } = await Product.paginate({}, option);
        if (docs.length === 0) {
            return res.json({
                message: "Không có sản phẩm nào"
            })
        }
        return res.json({ data: docs, totalDocs, totalPages })


    } catch (error) {
        return res.json({
            message: "Không có danh sách nào",
            error
        })
    }
}
// getOne

export const getOne = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Product.findById(id);
        return res.json({
            message: "Tìm thấy sản phẩm",
            data
        })
    } catch (error) {
        return res.json({
            message: "Không tìm được sản phẩm",
            error
        })
    }
}

//xoa

export const remove = async (req, res) => {
    try {
        const id = req.params.id;
        await Product.findByIdAndDelete(id)
        return res.json({
            message: "Xoá thành công"
        })
    } catch (error) {
        return res.json({
            message: "Xoá thất bại",
            error
        })
    }
}

// update
export const update = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const data = await Product.findByIdAndUpdate(id, body, { new: true });
        return res.json({
            message: "Sửa thành công",
            data
        })
    } catch (error) {
        return res.json({
            message: "Sửa thất bại",
            error
        })
    }
}