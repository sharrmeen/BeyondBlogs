import axios from 'axios';

const API=axios.create({
    baseURL:'http://localhost:3000/api/blogs'

    //testing
    // base_url:'https://jsonplaceholder.typicode.com/posts'
});

export const fetchArticles=()=>API.get('/')
export const getArticles=(id)=>API.get(`/${id}`)
export const processArticle=(id)=>API.patch(`/${id}/process`)


