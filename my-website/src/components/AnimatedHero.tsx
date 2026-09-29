import React, { useEffect, useState, useRef, useCallback } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

const PHRASE = 'A safe and practical solution for document anonymization.';
const LETTERS = 'ocShield';
const CIPHER_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?<>{}[]~^';

export default function AnimatedHero(): React.JSX.Element {
  const shieldUrl = useBaseUrl('/assets/logo.png');

  const [revealedLetters, setRevealedLetters] = useState(0);
  const [phraseText, setPhraseText] = useState('');
  const [phraseVisible, setPhraseVisible] = useState(false);
  const [phase, setPhase] = useState<'centered' | 'sliding' | 'letters' | 'phrase' | 'done'>('centered');

  const phraseIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phraseIterRef = useRef(0);

  // Phase 1: Shield appears centered (fade in + rotation)
  // Phase 2: Shield slides left; letters start appearing while slide finishes
  useEffect(() => {
    // After the centered entrance animation, trigger the slide-left
    const timer = setTimeout(() => {
      setPhase('sliding');
      // Start letters while the slide is still finishing — overlap for fluidity
      setTimeout(() => setPhase('letters'), 300);
    }, 1400);
    return () => clearTimeout(timer);
  }, []);

  // Phase 3: Letters appear one by one, smooth stagger
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

  // Phase 4: Encryption text — full length appears immediately,
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

  // The shield is "centered" when in the 'centered' phase, and slides left after
  const isCentered = phase === 'centered';
  const hasSlid = phase !== 'centered'; // sliding, letters, phrase, done

  return (
    <div className="animated-hero">
      {/* Logo: shield + letters side by side */}
      <div className={`animated-hero__logo-row ${isCentered ? 'animated-hero__logo-row--centered' : ''}`}>
        <div className={`animated-hero__shield ${isCentered ? 'animated-hero__shield--centered' : ''} ${hasSlid ? 'animated-hero__shield--visible' : ''}`}>
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
