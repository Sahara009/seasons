import s from './Banner.module.css';
import { currentIssue } from '@/data/content';

// Рекламная полоса нового номера: готовая картинка, вся целиком ссылка в магазин.
export default function Banner() {
  return (
    <a className={s.banner} href={currentIssue.shop} target="_blank" rel="noopener" aria-label="Говорим о воспоминаниях в новом осеннем номере. Купить">
      <img src="/img/banner.png" alt="" />
    </a>
  );
}
