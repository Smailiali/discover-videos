import Link from "next/link";
import Card from "./card";
import clsx from "classnames";
import styles from "./section-cards.module.css";

const SectionCards = (props) => {
  const { title, videos = [], size, shouldWrap = false } = props;
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={clsx(styles.cardWrapper, shouldWrap && styles.wrap)}>
        {videos.map((video, idx) => {
          return (
            <Link href={`/video/${video.id}`} key={video.id}>
              <Card key={idx} id={idx} imgUrl={video.imgUrl} size={size} />
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default SectionCards;
