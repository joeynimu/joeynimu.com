import { GetStaticProps } from "next";
import { getAllFilesFrontMatter } from "lib/getFiles";

export default function Home({ posts }) {
  return (
    <div className="container">
      <h1>Hey 👋, I'm Joey</h1>
      <p>
        I am a Javascript Engineer from Nairobi, Kenya 🇰🇪. I mostly build React
        apps powered by GraphQL backends.
      </p>
      <p>
        I learn by sharing my knowledge with the community through blog posts,
        workshops, and Open-source. I also hold Graphql meetups so be sure to
        check that out if that's your jam.
      </p>
      <p>
        I take contract/project-based jobs from time to time. If you want to
        discuss a project, you can drop me an email at joeynimu[at]gmail.com.
      </p>
      <p>
        During my spare time, I spend time with my family, watching Liverpool FC
        play and making road trips to discover new places. You can reach me on
        Twitter @africansinatra.
      </p>
      <h3>Latest Posts</h3>
      <ul>
        {posts.map(({ slug, content }) => (
          <li key={slug}>
            <h4>{slug}</h4>
            <p>13.04.2021</p>
            <p>{content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getAllFilesFrontMatter("blog");
  return {
    props: {
      posts,
    },
  };
};
