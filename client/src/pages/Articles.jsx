import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Articles = () => {
  const [articles, setArticles] = useState([])
  const link = "http://localhost:8080/articles"

  useEffect(() =>{
    const fetchAllArticles = async ()=>{
        try {
            const res = await axios.get(link)
            setArticles(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    fetchAllArticles()
  }, [])

  const handleDelete = async (id)=>{
    try {
        await axios.delete(link+id)
        window.location.reload()
    } catch (error) {
        console.log(error)
    }
  }

  return(
    <div>
        <div className='articles'>
            {articles.map((article)=>(
                <div className='article' key={article.id}>
                    <h2><Link className='link' to={`/details/{$article.id}`}>{article.title}</Link></h2>
                    <p>{article.subtitle}</p>
                    <span>{article.publicationDate}</span>
                    <p>{article.content}</p>
                    <button className='update'> <Link className='update-link' to={`/update/${article.id}`}>Update</Link></button>
                    <button className='delete' onClick={()=>handleDelete(article.id)}>Delete</button>
                </div>
            ))}
        </div>
        <br/>
        <button className='add-button'><Link className='link' to="/add">Add new article</Link></button>
    </div>
  )
}

export default Articles