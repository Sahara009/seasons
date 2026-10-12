'use client';

import { useRef, useState } from 'react';
import s from './Issue.module.css';
import Magazine from './Magazine';
import { currentIssue, issues } from '@/data/content';

// Свежий номер: журнал листается нажатием. Пока никто не нажал, рядом тыкает анимированный палец.
export default function Issue() {
  const [touched, setTouched] = useState(false);
  const mag = useRef(null);

  return (
    <section id="issue" className={s.sec} aria-label="Свежий номер">
      <p className={s.label}><span>№{currentIssue.number}</span> {currentIssue.season} · {currentIssue.theme}</p>

      <div className={s.stage}>
        <Magazine ref={mag} cover={currentIssue} issues={issues} onFlip={() => setTouched(true)} />

        <div className={s.finger} data-gone={touched ? '1' : '0'} aria-hidden="true">
          <span className={s.ring} />
          <svg viewBox="0 0 64 80" width="64" height="80">
            <path d="M24 6c-4 0-7 3-7 7v28l-5-5c-3-3-8-1-8 3 0 2 1 4 2 5l14 21c3 5 7 7 13 7h12c9 0 15-6 15-15V38c0-3-2-5-5-5-1 0-3 .5-4 1.5C50 32 48 31 46 31c-2 0-4 1-5 2.5C40 32 38 31 37 31V13c0-4-3-7-7-7z" fill="#F3D2B8" stroke="#3F4B2E" strokeWidth="2.2" strokeLinejoin="round" />
            <path d="M37 31v8M46 31v8" stroke="#3F4B2E" strokeWidth="1.8" strokeLinecap="round" opacity=".55" />
          </svg>
        </div>
      </div>

      <p className={s.tip} data-gone={touched ? '1' : '0'}>нажмите на страницу, чтобы листать</p>
    </section>
  );
}
