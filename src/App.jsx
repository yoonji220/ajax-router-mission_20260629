import { useState, useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Posts from "./pages/Posts";
import PostDetail from "./pages/PostDetail";
import NotFound from "./pages/NotFound";

function App() {
  const [posts, setPosts] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // let alive = true; // 상품조회 시작.... 열일 중!
    const controller = new AbortController();

    async function fetchData() {
      try {
        // fetch("/data/blog.json")
        //   .then(res => res.json())
        //   .then(result => {
        //     if (alive) {
        //       setPosts(result);
        //       setLoaded(true);
        //     }
        //   });
        const res = await fetch("/data/blog.json", {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("메시지");
        const data = await res.json();
        setPosts(data);
      } catch (e) {
        console.error(e);
        setPosts([]); // 로딩 중 에러 시 목록 비움
      } finally {
        setLoaded(true);
      }
    }
    fetchData();

    return () => {
      // alive = false;
      controller.abort();
    }; //정리함수
  }, []);

  const onDelete = _id => {
    setPosts(prev => prev.filter(post => post.id !== _id));
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout loaded={loaded} />}>
          <Route index element={<Home posts={posts} />} />
          <Route path="posts" element={<Posts posts={posts} />} />
          <Route
            path="post/:id"
            element={<PostDetail posts={posts} onDelete={onDelete} />}
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
