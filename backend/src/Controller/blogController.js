const { json } = require("express");
const User = require('../Models/userModels')
const Admin = require('../Models/adminModel')
const Blog = require('../Models/blogModel')

const throw_error = (errorMsg) => {
    console.log("throw error funtion");
    const error_response = new Error(errorMsg);
    error_response.message = errorMsg;
    throw error_response;
}

// Admin
const uploadBlog = async (req, res) => {
    const { title, category, content, videoURL, image } = req.body;
    try {
        if (
            title.length == 0 ||
            category.length == 0 ||
            content.length == 0 ||
            videoURL.length == 0 ||
            image.length == 0
        ) {
            throw_error("Fields cannot be left empty");
        }
        const createBlog = new Blog({ title, category, content, videoURL, image });
        await createBlog.save();
        console.log("Bloag Posted");
        return res.status(200).json({ message: "Blog Posted", Blog: createBlog })

    } catch (error) {
        console.log(error);
        return res.status(404).json({ catch: true, message: error.message })
    }
};



const updateBlog = async (req, res) => {
    const { title, category, content, videoURL, image } = req.body;
    try {
        const getBlog = await Blog.updateOne({ _id: req.params.id },
            {
                $set: {
                    title: title,
                    category: category,
                    content: content,
                    videoURL: videoURL,
                    image: image
                }
            });
        return res.status(200).json({ status: true, message: "Blog Updated", blog: getBlog })
    } catch (error) {
        return res.status(404).json({ catch: true, message: error })
    }

};



const deleteBlog = async (req, res) => {
    try {
        const blogID = req.params.id
        const delBlog = await Blog.deleteOne({ _id: blogID });
        res.status(200).json({ adminLogin: true, data: delBlog });
    } catch (error) {
        return res.status(404).json({ message: error });
    }
}


// User 
const viewallBlogs = async (req, res) => {
    try {
        const getallBlogs = await Blog.find();
        return res.status(200).json({ messgae: "All Blogs", blogs: getallBlogs })
    } catch (error) {
        console.log(error)
        return res.status(404).json({ messgae: error })
    }
}

const viewBlogbyID = async (req, res) => {
    try {
        const getBlog = await Blog.findOne({ _id: req.params.id });
        const blogViews = getBlog.views;
        const updateBlogViews = await Blog.updateOne({ _id: req.params.id },
            {
                $set: {
                    views:blogViews+1
                }
            });
        return res.status(200).json({ message: "Get Blog By ID", data: getBlog })
    } catch (error) {
        console.log(error)
        return res.status(404).json({ catch: true, message: error })
    }
}

module.exports = { uploadBlog, updateBlog, viewallBlogs, viewBlogbyID, deleteBlog };