import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'
import Link from 'next/link'

const { CONTENTFUL_API_URL, CONTENTFUL_API_KEY } = process.env

type Posts = {
  title: string,
  slug: string,

}

async function getPosts(): Promise<Posts> {
  const res = await fetch(`${CONTENTFUL_API_URL}/ghost/api/v3/content/posts/?key=${CONTENTFUL_API_KEY}&fields=title,slug,experpt,reading_time,feature_image`)
  const data = await res.json()
  const posts = data.posts
  console.log(posts)
  return posts
 
}


export const getStaticProps = async () => {
  const posts = await getPosts()
  return {  
    revalidate: 10,
    props: {posts}
  }
}


const Home:React.FC<{posts:Posts[]}> =({posts}) =>{
  return (
    <div className={styles.container}>
     
      <h2>Welcome to my personal blog</h2>
      <ul>
        {posts.map((post, index) => (
          <li className={styles.postitem} key={post.slug}>
          <Link href="/post/[slug]" as={`/post/${post.slug}`}>
            <a>{post.title}</a>
          </Link>
        </li>
        ))}
      </ul>
    </div>
  )
}
export default Home
