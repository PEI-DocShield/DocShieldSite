import React, { useEffect, useState, useRef, useCallback } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

const PHRASE = 'A safe and practical solution for document anonymization.';
const LETTERS = 'ocShield';
const CIPHER_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?<>{}[]~^';

export default function AnimatedHero(): React.JSX.Element {
  const shieldUrl = useBaseUrl('/assets/logo.png');

  const [shieldReady, setShieldReady] = useState(false);
  const [revealedLetters, setRevealedLetters] = useState(0);
  const [phraseText, setPhraseText] = useState('');
  const [phraseVisible, setPhraseVisible] = useState(false);
  const [phase, setPhase] = useState<'shield' | 'letters' | 'phrase' | 'done'>('shield');

  const phraseIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phraseIterRef = useRef(0);

  // Phase 1: Shield rotates from 90° clockwise back to 0°
  useEffect(() => {
    const timer = setTimeout(() => {
      setShieldReady(true);
      // Wait for shield animation to finish, then start letters
      setTimeout(() => setPhase('letters'), 1100);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Phase 2: Letters appear one by one, smooth stagger
  useEffect(() => {
    if (phase !== 'letters') return;

    let count = 0;
    const interval = setInterval(() => {
      count++;
      setRevealedLetters(count);
      if (count >= LETTERS.length) {
        clearInterval(interval);
        setTimeout(() => setPhase('phrase'), 300);
      }
    }, 90);

    return () => clearInterval(interval);
  }, [phase]);

  // Phase 3: Encryption text — full length appears immediately,
  // all characters resolve at roughly the same time
  const scramblePhrase = useCallback(() => {
    const totalChars = PHRASE.length;
    // Fewer total iterations = faster, all resolve close together
    const totalIters = 40;

    phraseIterRef.current = 0;
    setPhraseVisible(true);

    phraseIntervalRef.current = setInterval(() => {
      phraseIterRef.current++;
      const iter = phraseIterRef.current;

      let result = '';
      for (let i = 0; i < totalChars; i++) {
        if (PHRASE[i] === ' ') {
          result += ' ';
          continue;
        }
        // Each char has a random resolve point between 60%-100% of totalIters
        // This makes them all finish around the same time
        // Use a deterministic seed based on char index for consistency
        const seed = ((i * 7 + 13) % 17) / 17; // 0..1 deterministic per char
        const resolveAt = Math.floor(totalIters * (0.55 + seed * 0.4));
        if (iter >= resolveAt) {
          result += PHRASE[i];
        } else {
          result += CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)];
        }
      }

      setPhraseText(result);

      if (iter >= totalIters) {
        setPhraseText(PHRASE);
        if (phraseIntervalRef.current) clearInterval(phraseIntervalRef.current);
        setPhase('done');
      }
    }, 30);
  }, []);

  useEffect(() => {
    if (phase === 'phrase') {
      scramblePhrase();
    }
    return () => {
      if (phraseIntervalRef.current) clearInterval(phraseIntervalRef.current);
    };
  }, [phase, scramblePhrase]);

  return (
    <div className="animated-hero">
      {/* Logo: shield + letters side by side */}
      <div className="animated-hero__logo-row">
        <div className={`animated-hero__shield ${shieldReady ? 'animated-hero__shield--visible' : ''}`}>
          <img src={shieldUrl} alt="DocShield Shield" draggable={false} />
        </div>
        <div className="animated-hero__letters">
          {LETTERS.split('').map((char, i) => (
            <span
              key={i}
              className={`animated-hero__letter ${i < revealedLetters ? 'animated-hero__letter--visible' : ''}`}
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>

      {/* Phrase */}
      <p className={`animated-hero__phrase ${phraseVisible ? 'animated-hero__phrase--visible' : ''}`}>
        {phraseText || '\u00A0'}
      </p>
    </div>
  );
}
