import { Blog } from "../models/Blogs";

export const getArticles=async(req,res)=>{
    try {
        const articles=await Blog.find();
        res.status(200).json(articles);
    } catch (error) {
        res.status(500).json({message:error.message});
    }  
};

export const updateArticle=async(req,res)=>{
    const {id}=req.params;
    try {
       const updatedArticle=await Blog.findByIdAndUpdate(id,req.body,{new:true});
       res.status(200).json(updatedArticle);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

export const createArticle=async(req,res)=>{
    try {
        const newArticle=await Blog.create(req.body);
        res.status(201).json(newArticle);
    } catch (error) {
        res.status(400).json({message:error.message});
    }
}

export const deleteArticle=async(req,res)=>{
    const {id}=req.params;
    try {
        const deletedArticle=await Blog.findByIdAndDelete(id);
        if (!deletedArticle) {
            return res.status(404).json({ message: "Article not found" });
        }
        res.status(200).json({message:"Article deleted successfully",id})
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}