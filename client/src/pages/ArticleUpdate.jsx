import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'

const ArticleUpdate = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const articleId = location.pathname.split("/")[2];
    const[newArticle, setNewArticle] = useState({
        title: "",
        desc: "",
        price: null,
        cover: "",
    })
    const [article, setArticle] = useState([])
    useEffect(() =>{
      const fetchArticle = async ()=>{
          try {
              const res = await axios.get("http://localhost:8080/articles/"+articleId)
              setArticle(res.data)
          } catch (error) {
              console.log(error)
          }
      }
      fetchArticle()
    }, [articleId])
    const handleChange = (e) => {
      setNewArticle((prev)=>({...prev, [e.target.name]: e.target.value}))
    }

    const handleClick = async (e) => {
        e.preventDefault();
    
        try {
          await axios.put(`http://localhost:8080/articles/${articleId}`, newArticle);
          navigate("/");
        } catch (err) {
          console.log(err);
        }
      };
    
  return (
    <div className='form'>
        <h1>Update article</h1>
        <input type="text" placeholder={article.title} onChange={handleChange} name="title" />
        <input type="text" placeholder={article.subtitle} onChange={handleChange} name="subtitle" />
        <input type="text" placeholder={article.content} onChange={handleChange} name="content" />
        <button onClick={handleClick}>Update</button>
        <Link className='back-link' to="/">Go back</Link>
    </div>
  )
}

export default ArticleUpdate
 