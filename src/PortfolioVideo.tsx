type PortfolioVideoProps = {
  src: string
  title: string
  variant: 'assistant' | 'news'
}

export default function PortfolioVideo({ src, title, variant }: PortfolioVideoProps) {
  return (
    <article className="portfolio-video-card">
      <div className={`portfolio-player player-${variant}`}>
        <video src={src} controls playsInline preload="metadata" aria-label={`فيديو ${title}`} />
      </div>
      <div className="portfolio-video-caption" dir="ltr">
        <h3>{title}</h3>
        <span>مشروع أتمتة وذكاء اصطناعي</span>
      </div>
    </article>
  )
}
