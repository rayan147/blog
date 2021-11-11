import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from '../../styles/Home.module.scss'
import { useState,useEffect } from 'react'
import Script from 'next/script'

const { CONTENTFUL_API_URL, CONTENTFUL_API_KEY } = process.env

async function getPost(slug: string) {
	const res = await fetch(
		`${CONTENTFUL_API_URL}/ghost/api/v3/content/posts/slug/${slug}?key=${CONTENTFUL_API_KEY}&fields=title,slug,html`
	).then((res) => res.json())

	const posts = res.posts

	return posts[0]
}

// Ghost CMS Request
export const getStaticProps = async ({ params} :any) => {
	const post = await getPost(params.slug)
	return {
		props: { post },
		revalidate: 10
	}
}

// hello-world - on first request = Ghost CMS call is made (1)
// hello-world - on other requests ... = filesystem is called (1M)

export const getStaticPaths = () => {
	// paths -> slugs which are allowed
	// fallback ->
	return {
		paths: [],
		fallback: true //
	}
}

type Post = {
	title: string
	html: string
	slug: string
}

const Post: React.FC<{ post: Post }> = (props) => {
	console.log(props)

	const { post } = props
	const [enableLoadComments, setEnableLoadComments] = useState<boolean>(true)

	const router = useRouter()

	if (router.isFallback) {
		return <h1>Loading...</h1>
	}



	function loadComments() {
		setEnableLoadComments(false)
		;(window as any).disqus_config = function () {
			this.page.url = window.location.href
			this.page.identifier = post.slug
		}

		const script = document.createElement('script')
		script.src = 'https://blog-rayanr-com.disqus.com/embed.js'
		script.setAttribute('data-timestamp', Date.now().toString())

		document.body.appendChild(script)
	}

	return (
		<div className={styles.container}>
			
			<p className={styles.goback}>
				<Link href="/">
					<a>Go back</a>
				</Link>
			</p>
			<h1>{post.title}</h1>
			<div dangerouslySetInnerHTML={{ __html: post.html }}></div>

			{enableLoadComments && (
				<p className={styles.goback} onClick={loadComments}>
					Load Comments
				</p>
			)}

			<div id="disqus_thread"></div>
		</div>
	)
}

export default Post