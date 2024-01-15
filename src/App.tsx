import { useState, useEffect, ReactNode } from 'react';
import { get } from './util/http';
import BlogPosts, { type BlogPost } from './components/BlogPosts';
import dataFetching from './assets/data-fetching.png';
import { z } from 'zod';
import ErrorMessage from './components/ErrorMessage';

const rawDataBlogPostSchema = z.object({
	id: z.number(),
	userId: z.number(),
	title: z.string(),
	body: z.string(),
});

const expectedResponseDataSchema = z.array(rawDataBlogPostSchema);

function App() {
	const [posts, setPosts] = useState<BlogPost[]>();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>('');

	useEffect(() => {
		try {
			setIsLoading(true);
			async function fetchPosts() {
				const data = (await get(
					'https://jsonplaceholder.typicode.com/posts'
				)) as (typeof rawDataBlogPostSchema)[];

				const parsedData = expectedResponseDataSchema.parse(data);

				const blogPosts: BlogPost[] = parsedData.map((rawPost) => {
					return {
						id: rawPost.id,
						title: rawPost.title,
						text: rawPost.body,
					};
				});

				setPosts(blogPosts);
				setIsLoading(false);
			}
			fetchPosts();
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message);
			}
		}
	}, []);

	let content: ReactNode;

	if (posts) {
		content = <BlogPosts posts={posts} />;
	}

	if (!posts) {
		content = <p>No posts to display</p>;
	}

	if (isLoading) {
		content = <p id='loading-fallback'>Loading posts ...</p>;
	}

	if (error !== '') {
		content = <ErrorMessage text={error} />;
	}

	return (
		<main>
			<img src={dataFetching} alt='data fetching blog header image' />
			{content}
		</main>
	);
}

export default App;
