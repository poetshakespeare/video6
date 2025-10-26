interface FileEntry {
  path: string;
  content: string;
}

interface ProjectStructure {
  sourceFiles: FileEntry[];
  configFiles: FileEntry[];
  publicFiles: FileEntry[];
}

const ALL_PROJECT_FILES = {
  source: [
    'src/main.tsx',
    'src/App.tsx',
    'src/index.css',
    'src/vite-env.d.ts',
    'src/components/CastSection.tsx',
    'src/components/CheckoutModal.tsx',
    'src/components/ErrorMessage.tsx',
    'src/components/FloatingNav.tsx',
    'src/components/Header.tsx',
    'src/components/HeroCarousel.tsx',
    'src/components/LoadingSpinner.tsx',
    'src/components/MovieCard.tsx',
    'src/components/NetflixNovelSection.tsx',
    'src/components/NetflixSection.tsx',
    'src/components/NovelasModal.tsx',
    'src/components/NovelCard.tsx',
    'src/components/OptimizedImage.tsx',
    'src/components/PriceCard.tsx',
    'src/components/Toast.tsx',
    'src/components/VideoPlayer.tsx',
    'src/config/api.ts',
    'src/context/AdminContext.tsx',
    'src/context/CartContext.tsx',
    'src/hooks/useContentSync.ts',
    'src/hooks/useOptimizedContent.ts',
    'src/hooks/usePerformance.ts',
    'src/pages/AdminPanel.tsx',
    'src/pages/Anime.tsx',
    'src/pages/Cart.tsx',
    'src/pages/Home.tsx',
    'src/pages/MovieDetail.tsx',
    'src/pages/Movies.tsx',
    'src/pages/NovelDetail.tsx',
    'src/pages/Search.tsx',
    'src/pages/TVDetail.tsx',
    'src/pages/TVShows.tsx',
    'src/services/api.ts',
    'src/services/contentFilter.ts',
    'src/services/contentSync.ts',
    'src/services/tmdb.ts',
    'src/types/movie.ts',
    'src/utils/errorHandler.ts',
    'src/utils/fileSystemReader.ts',
    'src/utils/performance.ts',
    'src/utils/sourceCodeGenerator.ts',
    'src/utils/systemExport.ts',
    'src/utils/whatsapp.ts'
  ],
  config: [
    'package.json',
    'vite.config.ts',
    'tailwind.config.js',
    'tsconfig.json',
    'tsconfig.app.json',
    'tsconfig.node.json',
    'postcss.config.js',
    'eslint.config.js',
    'index.html',
    'vercel.json',
    '.gitignore'
  ],
  public: [
    'public/_redirects'
  ]
};

export async function readProjectFiles(): Promise<ProjectStructure> {
  const structure: ProjectStructure = {
    sourceFiles: [],
    configFiles: [],
    publicFiles: []
  };

  const readFileWithRetry = async (filePath: string, maxRetries = 2): Promise<string | null> => {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(`/${filePath}?t=${Date.now()}`);
        if (response.ok) {
          return await response.text();
        }
      } catch (error) {
        if (attempt === maxRetries) {
          console.warn(`Could not read ${filePath} after ${maxRetries + 1} attempts`);
        }
      }
    }
    return null;
  };

  try {
    const sourcePromises = ALL_PROJECT_FILES.source.map(async (filePath) => {
      const content = await readFileWithRetry(filePath);
      if (content !== null) {
        structure.sourceFiles.push({ path: filePath, content });
      }
    });

    const configPromises = ALL_PROJECT_FILES.config.map(async (filePath) => {
      const content = await readFileWithRetry(filePath);
      if (content !== null) {
        structure.configFiles.push({ path: filePath, content });
      }
    });

    const publicPromises = ALL_PROJECT_FILES.public.map(async (filePath) => {
      const content = await readFileWithRetry(filePath);
      if (content !== null) {
        structure.publicFiles.push({ path: filePath, content });
      }
    });

    await Promise.all([...sourcePromises, ...configPromises, ...publicPromises]);
  } catch (error) {
    console.error('Error reading project files:', error);
  }

  return structure;
}

export function injectConfigIntoFile(fileContent: string, config: any, filePath: string): string {
  if (filePath.includes('AdminContext.tsx')) {
    const initialStateMatch = fileContent.match(/const\s+initialState:\s*AdminState\s*=\s*\{[\s\S]*?\};/);
    if (initialStateMatch) {
      const updatedInitialState = `const initialState: AdminState = {
  isAuthenticated: false,
  prices: ${JSON.stringify(config.prices, null, 4).split('\n').join('\n  ')},
  deliveryZones: ${JSON.stringify(config.deliveryZones, null, 4).split('\n').join('\n  ')},
  novels: ${JSON.stringify(config.novels, null, 4).split('\n').join('\n  ')},
  notifications: [],
  systemConfig: ${JSON.stringify(config.settings || {
    version: config.version || '2.1.0',
    settings: {
      autoSync: true,
      syncInterval: 300000,
      enableNotifications: true,
      maxNotifications: 100
    }
  }, null, 4).split('\n').join('\n  ')},
  syncStatus: {
    lastSync: new Date().toISOString(),
    isOnline: true,
    pendingChanges: 0
  }
};`;
      return fileContent.replace(initialStateMatch[0], updatedInitialState);
    }
  }

  if (filePath.includes('CartContext.tsx')) {
    const priceMatch = fileContent.match(/moviePrice:\s*\d+/);
    const seriesPriceMatch = fileContent.match(/seriesPrice:\s*\d+/);
    const feeMatch = fileContent.match(/transferFeePercentage:\s*\d+/);
    const novelMatch = fileContent.match(/novelPricePerChapter:\s*\d+/);

    let updated = fileContent;
    if (priceMatch && config.prices?.moviePrice) {
      updated = updated.replace(priceMatch[0], `moviePrice: ${config.prices.moviePrice}`);
    }
    if (seriesPriceMatch && config.prices?.seriesPrice) {
      updated = updated.replace(seriesPriceMatch[0], `seriesPrice: ${config.prices.seriesPrice}`);
    }
    if (feeMatch && config.prices?.transferFeePercentage) {
      updated = updated.replace(feeMatch[0], `transferFeePercentage: ${config.prices.transferFeePercentage}`);
    }
    if (novelMatch && config.prices?.novelPricePerChapter) {
      updated = updated.replace(novelMatch[0], `novelPricePerChapter: ${config.prices.novelPricePerChapter}`);
    }
    return updated;
  }

  if (filePath.includes('CheckoutModal.tsx')) {
    const deliveryZonesMatch = fileContent.match(/const\s+deliveryZones:\s*DeliveryZone\[\]\s*=\s*\[[\s\S]*?\];/);
    if (deliveryZonesMatch && config.deliveryZones) {
      const updatedZones = `const deliveryZones: DeliveryZone[] = ${JSON.stringify(config.deliveryZones, null, 2)};`;
      return fileContent.replace(deliveryZonesMatch[0], updatedZones);
    }
  }

  if (filePath.includes('NovelasModal.tsx')) {
    const novelsMatch = fileContent.match(/const\s+novelas:\s*Novel\[\]\s*=\s*\[[\s\S]*?\];/);
    if (novelsMatch && config.novels) {
      const updatedNovels = `const novelas: Novel[] = ${JSON.stringify(config.novels, null, 2)};`;
      return fileContent.replace(novelsMatch[0], updatedNovels);
    }
  }

  if (filePath.includes('PriceCard.tsx')) {
    let updated = fileContent;
    if (config.prices?.moviePrice) {
      updated = updated.replace(/price:\s*\d+,?\s*\/\/\s*Películas/g, `price: ${config.prices.moviePrice}, // Películas`);
    }
    if (config.prices?.seriesPrice) {
      updated = updated.replace(/price:\s*\d+,?\s*\/\/\s*Series/g, `price: ${config.prices.seriesPrice}, // Series`);
    }
    return updated;
  }

  return fileContent;
}
