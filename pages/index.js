import Head from "next/head";
import styles from "../styles/Home.module.css";
import Banner from "../componenets/banner/banner";
import NavBar from "../componenets/navbar/navbar";
import SectionCards from "../componenets/card/section-cards";
import {
  getPopularVideos,
  getVideos,
  getWatchItAgainVideos,
} from "../lib/videos";
import redirectUser from "@/utils/redirectUser";

export async function getServerSideProps(context) {
  const { userId, token } = await redirectUser(context);
  if (!userId) {
    return {
      props: {},
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const watchItAgainVideos = await getWatchItAgainVideos(userId, token);

  const disneyVideos = await getVideos("disney official trailer");

  const productivityVideos = await getVideos("Productivity and better");

  const travelVideos = await getVideos("wonders of travel");

  const popularVideos = await getPopularVideos();
  return {
    props: {
      disneyVideos,
      travelVideos,
      productivityVideos,
      popularVideos,
      watchItAgainVideos,
    },
  };
}

export default function Home({
  disneyVideos,
  travelVideos,
  productivityVideos,
  popularVideos,
  watchItAgainVideos = [],
}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <NavBar username="ankita@ank.com" />

        <Banner
          videoId="4zH5iYM4wJo"
          title="Clifford The Red Dog"
          subTitle="A very cute dog"
          imgUrl="/static/clifford.webp"
        />
        <div className={styles.sectionWrapper}>
          <SectionCards title="Disney" videos={disneyVideos} size="large" />
          {watchItAgainVideos?.length > 0 && (
            <SectionCards
              title="Watch it again"
              videos={watchItAgainVideos}
              size="small"
            />
          )}

          <SectionCards title="Travel" videos={travelVideos} size="small" />
          <SectionCards
            title="Productivity"
            videos={productivityVideos}
            size="medium"
          />
          <SectionCards title="Popular" videos={popularVideos} size="small" />
        </div>
      </div>
    </div>
  );
}
