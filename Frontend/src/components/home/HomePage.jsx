import React from 'react';
import { HeroBanner } from './HeroBanner';
import { CategoryGrid } from './CategoryGrid';
import { BestSellersCarousel } from './BestSellersCarousel';
import { CuratedDenimSection } from './CuratedDenimSection';
import { CuratedEssentialsSection } from './CuratedEssentialsSection';
import { CuratedSneakersSection } from './CuratedSneakersSection';
import { LookbookReel } from './LookbookReel';

export const HomePage = () => {
  return (
    <div className="animate-fadeIn">
      <HeroBanner />
      <CategoryGrid />
      <BestSellersCarousel />
      <CuratedDenimSection />
      <CuratedEssentialsSection />
      <CuratedSneakersSection />
      <LookbookReel />
    </div>
  );
};
