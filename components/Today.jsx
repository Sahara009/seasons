'use client';

import { useEffect, useState } from 'react';
import s from './Today.module.css';
import { currentIssue } from '@/data/content';

// Виджет «Сегодня»: дата и время в Москве, погода, какой сейчас сезон и что читаем.
// Погоду берём у open-meteo (без ключа); если не загрузилась, строка просто не показывается.
const SEASON = ['зима', 'зима', 'весна', 'весна', 'весна', 'лето', 'лето', 'лето', 'осень', 'осень', 'осень', 'зима'];
const SKY = (c) => (c === 0 ? 'ясно' : c <= 2 ? 'облачно с прояснениями' : c === 3 ? 'пасмурно' : c <= 48 ? 'туман' : c <= 57 ? 'морось' : c <= 67 ? 'дождь' : c <= 77 ? 'снег' : c <= 82 ? 'ливень' : c <= 86 ? 'снегопад' : 'гроза');
const TZ = 'Europe/Moscow';

export default function Today() {
  const [now, setNow] = useState(null);
  const [wx, setWx] = useState(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30000);
    const ac = new AbortController();
    fetch('https://api.open-meteo.com/v1/forecast?latitude=55.75&longitude=37.62&current_weather=true&timezone=Europe%2FMoscow', { signal: ac.signal })
      .then((r) => r.json())
      .then((d) => d.current_weather && setWx({ t: Math.round(d.current_weather.temperature), sky: SKY(d.current_weather.weathercode) }))
      .catch(() => {});
    return () => { clearInterval(t); ac.abort(); };
  }, []);

  if (!now) return null;
  const date = now.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', timeZone: TZ });
  const time = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', timeZone: TZ });
  const month = Number(now.toLocaleDateString('en-US', { month: 'numeric', timeZone: TZ })) - 1;

  return (
    <aside className={s.today} aria-label="Сегодня">
      <p className={s.label}>[ сегодня ]</p>
      <p className={s.row}><b>{date}</b> · Москва {time}</p>
      {wx && <p className={s.row}>{wx.t > 0 ? '+' : ''}{wx.t}° · {wx.sky}</p>}
      <p className={s.row}>сейчас {SEASON[month]} · читаем <b>№{currentIssue.number}</b> «{currentIssue.theme}»</p>
    </aside>
  );
}
