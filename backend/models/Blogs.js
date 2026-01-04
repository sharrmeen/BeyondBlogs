import mongoose from 'mongoose';
const { Schema } = mongoose;

const blogSchema = new Schema({
  title: {type:String,required:true}, 
  content: {type:String,required:true},
  updated_content: String,
  url: String,
  related_articles: [String],
//   created_at: { type: Date},
  updated_at: { type: Date, default: Date.now },
  is_updated:{type:Boolean,default:false}
});

export const Blog = mongoose.model('Blog', blogSchema);
