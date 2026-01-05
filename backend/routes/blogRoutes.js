import express from 'express';
import { getArticles,updateArticle,deleteArticle,createArticle } from '../controllers/blogController.js';

const router=express.Router()

router.get('/',getArticles)
router.post('/',createArticle)
router.patch('/:id',updateArticle)
router.delete('/:id',deleteArticle)
export default router;