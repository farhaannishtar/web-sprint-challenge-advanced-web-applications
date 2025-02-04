import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import { ProtectedRoute } from './ProtectedRoute';
import axios from 'axios';
import { axiosWithAuth } from '.././axios/index'


const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { 
    /* ✨ implement */ 
    navigate('/')

  }
  const redirectToArticles = () => { 
    /* ✨ implement */
    navigate('/articles');

  }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
      setMessage("Goodbye!")
      redirectToLogin();
    }

  }

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!   
    setSpinnerOn(true);
    axios.post("http://localhost:9000/api/login", { "username": username, "password": password })
    .then((res) => {
      setMessage(`Here are your articles, ${username}!`);
      localStorage.setItem('token', res.data.token);
      setSpinnerOn(false);
      redirectToArticles();
    })
    .catch((err) => {
      console.log({ err })
      console.log("ERROR ERROR ERROR")
    })
  }

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    setSpinnerOn(true);
    axiosWithAuth()
      .get("http://localhost:9000/api/articles")
      .then(res => {
        setMessage(res.data.message)
        setArticles(res.data.articles)
        setSpinnerOn(false);
      })
      .catch(err => {
        redirectToLogin();
      })
  }

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    setSpinnerOn(true);
    axiosWithAuth()
      .post("http://localhost:9000/api/articles", { "title": article.title, "text": article.text, "topic": article.topic})
      .then(res => {
        // setMessage()
        console.log("Inside postArticle");
        console.log(res);
        setArticles([ 
          ...articles,
          res.data.article
        ])
        setMessage(res.data.message);
        setSpinnerOn(false);
      })
      .catch(err => {
        redirectToLogin();
      })
  }

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!
    console.log('Inside updateArticle: ');
    console.log("article: ", article);
    axiosWithAuth()
      .put(`http://localhost:9000/api/articles/${article_id}`, { "title": article.title, "text": article.text, "topic": article.topic })
      .then(res => {
        console.log("res in updateArticle: ", res);
        setArticles(
          articles.map(art => {
            if (art.article_id === res.data.article.article_id) {
              return res.data.article;               
            } else {
              return art;
            }
          }  
        ))
        setMessage(res.data.message);
      })
      .catch(err => console.log({err}))
  }


  const deleteArticle = article_id => {
    // ✨ implement
    console.log("WE ALMOST DONE BOIS")
    axiosWithAuth()
      .delete(`http://localhost:9000/api/articles/${article_id}`)
      .then(res => {
        console.log(res);
        setArticles(articles.filter(article => article.article_id !== article_id));
        setMessage(res.data.message);
      })
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <React.StrictMode>
      <Spinner on={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="/articles" element={
             <ProtectedRoute>
             <>
               <ArticleForm 
                currentArticleId={currentArticleId} 
                setCurrentArticleId={setCurrentArticleId} 
                postArticle={postArticle}
                articles={articles}
                updateArticle={updateArticle} 
               />
               <Articles 
                getArticles={getArticles} 
                articles={articles} 
                setArticles={setArticles} 
                updateArticle={updateArticle} 
                currentArticleId={currentArticleId} 
                setCurrentArticleId={setCurrentArticleId} 
                deleteArticle={deleteArticle} />
             </>
            </ProtectedRoute>
          }
          />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </React.StrictMode>
  )
}