import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Promo {
  id: string;
  code: string;
  store: string;
  discount: string;
  description: string;
  category: string;
  expiresAt: string;
  isTop?: boolean;
  uses: number;
}

const categories = [
  { id: 'all', name: 'Все', icon: 'Grid3x3' },
  { id: 'fashion', name: 'Мода', icon: 'Shirt' },
  { id: 'electronics', name: 'Электроника', icon: 'Smartphone' },
  { id: 'food', name: 'Еда', icon: 'UtensilsCrossed' },
  { id: 'beauty', name: 'Красота', icon: 'Sparkles' },
  { id: 'travel', name: 'Путешествия', icon: 'Plane' },
  { id: 'home', name: 'Дом', icon: 'Home' },
];

const promos: Promo[] = [
  {
    id: '1',
    code: 'SAVE50NOW',
    store: 'Wildberries',
    discount: '-50%',
    description: 'Скидка 50% на первый заказ',
    category: 'fashion',
    expiresAt: '31.01.2026',
    isTop: true,
    uses: 1524,
  },
  {
    id: '2',
    code: 'TECH2026',
    store: 'DNS',
    discount: '-3000₽',
    description: 'Скидка 3000₽ на ноутбуки',
    category: 'electronics',
    expiresAt: '20.01.2026',
    isTop: true,
    uses: 892,
  },
  {
    id: '3',
    code: 'FOOD15',
    store: 'Яндекс Еда',
    discount: '-15%',
    description: 'Скидка 15% на доставку еды',
    category: 'food',
    expiresAt: '25.01.2026',
    uses: 634,
  },
  {
    id: '4',
    code: 'BEAUTY20',
    store: 'Л\'Этуаль',
    discount: '-20%',
    description: 'Скидка 20% на косметику',
    category: 'beauty',
    expiresAt: '15.02.2026',
    isTop: true,
    uses: 1203,
  },
  {
    id: '5',
    code: 'FLY2026',
    store: 'Aviasales',
    discount: '-2000₽',
    description: 'Скидка 2000₽ на авиабилеты',
    category: 'travel',
    expiresAt: '28.02.2026',
    uses: 445,
  },
  {
    id: '6',
    code: 'HOME30',
    store: 'IKEA',
    discount: '-30%',
    description: 'Скидка 30% на мебель',
    category: 'home',
    expiresAt: '10.02.2026',
    uses: 723,
  },
  {
    id: '7',
    code: 'OZON100',
    store: 'Ozon',
    discount: '-100₽',
    description: 'Скидка 100₽ при заказе от 1000₽',
    category: 'electronics',
    expiresAt: '31.01.2026',
    uses: 987,
  },
  {
    id: '8',
    code: 'LAMODA25',
    store: 'Lamoda',
    discount: '-25%',
    description: 'Скидка 25% на обувь и аксессуары',
    category: 'fashion',
    expiresAt: '18.01.2026',
    uses: 556,
  },
];

type SortOption = 'popular' | 'expiring' | 'newest';

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedFavorites = localStorage.getItem('promogid-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const parseDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split('.');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  const filteredPromos = promos
    .filter((promo) => {
      const matchesCategory = selectedCategory === 'all' || promo.category === selectedCategory;
      const matchesSearch =
        promo.store.toLowerCase().includes(searchQuery.toLowerCase()) ||
        promo.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') {
        return b.uses - a.uses;
      } else if (sortBy === 'expiring') {
        return parseDate(a.expiresAt).getTime() - parseDate(b.expiresAt).getTime();
      }
      return 0;
    });

  const topStores = Array.from(new Set(promos.filter(p => p.isTop).map(p => p.store)));

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast({
      title: 'Промокод скопирован!',
      description: `Код ${code} скопирован в буфер обмена`,
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getDaysLeft = (dateStr: string) => {
    const expiryDate = parseDate(dateStr);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const toggleFavorite = (promoId: string) => {
    const newFavorites = favorites.includes(promoId)
      ? favorites.filter(id => id !== promoId)
      : [...favorites, promoId];
    setFavorites(newFavorites);
    localStorage.setItem('promogid-favorites', JSON.stringify(newFavorites));
    toast({
      title: favorites.includes(promoId) ? 'Удалено из избранного' : 'Добавлено в избранное',
      description: favorites.includes(promoId) 
        ? 'Промокод удалён из избранного' 
        : 'Промокод добавлен в избранное',
    });
  };

  const displayedPromos = showFavorites
    ? filteredPromos.filter(promo => favorites.includes(promo.id))
    : filteredPromos;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Tag" className="text-primary" size={32} />
              <h1 className="text-2xl font-bold">ПромоГид</h1>
            </div>
            <nav className="hidden md:flex gap-6 items-center">
              <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
                Главная
              </a>
              <a href="#categories" className="text-sm font-medium hover:text-primary transition-colors">
                Категории
              </a>
              <a href="#top-stores" className="text-sm font-medium hover:text-primary transition-colors">
                Топ магазины
              </a>
              <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">
                О проекте
              </a>
              <a href="#contacts" className="text-sm font-medium hover:text-primary transition-colors">
                Контакты
              </a>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFavorites(!showFavorites)}
                className="gap-2 relative"
              >
                <Icon name="Heart" size={20} className={showFavorites ? 'fill-primary text-primary' : ''} />
                {favorites.length > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {favorites.length}
                  </Badge>
                )}
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-br from-primary/10 via-accent/5 to-background py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            Лучшие промокоды и скидки
          </h2>
          <p className="text-lg text-muted-foreground mb-8 animate-fade-in">
            Экономьте на покупках в любимых магазинах
          </p>
          <div className="max-w-xl mx-auto animate-scale-in">
            <div className="relative">
              <Icon
                name="Search"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={20}
              />
              <Input
                type="text"
                placeholder="Поиск по магазинам..."
                className="pl-10 h-12 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="py-12">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-semibold mb-6">Категории</h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className="gap-2"
              >
                <Icon name={category.icon as any} size={18} />
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section id="top-stores" className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-semibold mb-6">Топ магазины</h3>
          <div className="flex flex-wrap gap-4">
            {topStores.map((store) => (
              <Badge key={store} variant="secondary" className="text-base px-4 py-2">
                <Icon name="Store" size={16} className="mr-2" />
                {store}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold">
              {selectedCategory === 'all' ? 'Все промокоды' : 'Промокоды по категории'}
            </h3>
            <div className="flex gap-2">
              <Button
                variant={sortBy === 'popular' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('popular')}
                className="gap-2"
              >
                <Icon name="TrendingUp" size={16} />
                Популярные
              </Button>
              <Button
                variant={sortBy === 'expiring' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('expiring')}
                className="gap-2"
              >
                <Icon name="Clock" size={16} />
                Скоро истекут
              </Button>
            </div>
          </div>
          {showFavorites && displayedPromos.length === 0 && (
            <div className="text-center py-12 col-span-full">
              <Icon name="Heart" size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">В избранном пока нет промокодов</p>
              <p className="text-sm text-muted-foreground">Нажмите на сердечко в карточке промокода, чтобы добавить его в избранное</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedPromos.map((promo) => (
              <Card key={promo.id} className="hover:shadow-lg transition-shadow animate-fade-in relative">
                <CardContent className="p-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => toggleFavorite(promo.id)}
                  >
                    <Icon
                      name="Heart"
                      size={18}
                      className={favorites.includes(promo.id) ? 'fill-primary text-primary' : 'text-muted-foreground'}
                    />
                  </Button>
                  <div className="flex justify-between items-start mb-4 pr-8">
                    <div>
                      <h4 className="font-semibold text-lg mb-1">{promo.store}</h4>
                      <p className="text-sm text-muted-foreground">{promo.description}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <Icon name="Users" size={14} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {promo.uses.toLocaleString()} использований
                        </span>
                      </div>
                    </div>
                    {promo.isTop && (
                      <Badge variant="default" className="ml-2">
                        ТОП
                      </Badge>
                    )}
                  </div>
                  <div className="bg-primary/10 rounded-lg p-4 mb-4 border-2 border-dashed border-primary/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Промокод</p>
                        <p className="font-mono font-bold text-lg tracking-wider">{promo.code}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{promo.discount}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs">
                      {(() => {
                        const daysLeft = getDaysLeft(promo.expiresAt);
                        const isExpiringSoon = daysLeft <= 7;
                        return (
                          <>
                            <Icon name="Clock" size={14} className={isExpiringSoon ? 'text-destructive' : 'text-muted-foreground'} />
                            <span className={isExpiringSoon ? 'text-destructive font-medium' : 'text-muted-foreground'}>
                              {daysLeft <= 0 ? 'Истёк' : daysLeft === 1 ? '1 день' : `${daysLeft} дн.`}
                            </span>
                          </>
                        );
                      })()}
                    </div>
                    <Button
                      onClick={() => copyToClipboard(promo.code, promo.id)}
                      size="sm"
                      className="gap-2"
                    >
                      {copiedId === promo.id ? (
                        <>
                          <Icon name="Check" size={16} />
                          Скопировано
                        </>
                      ) : (
                        <>
                          <Icon name="Copy" size={16} />
                          Копировать
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {filteredPromos.length === 0 && (
            <div className="text-center py-12">
              <Icon name="SearchX" size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Промокоды не найдены</p>
            </div>
          )}
        </div>
      </section>

      <section id="about" className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h3 className="text-3xl font-semibold mb-4">О проекте</h3>
          <p className="text-muted-foreground mb-6">
            ПромоГид — это агрегатор актуальных промокодов и скидок от популярных интернет-магазинов.
            Мы собираем лучшие предложения в одном месте, чтобы вы могли экономить на каждой покупке.
          </p>
          <p className="text-muted-foreground">
            Все промокоды проверяются и обновляются ежедневно. Копируйте код одним кликом и
            получайте скидку при оформлении заказа в магазине.
          </p>
        </div>
      </section>

      <section id="contacts" className="py-16">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h3 className="text-3xl font-semibold mb-4">Контакты</h3>
          <p className="text-muted-foreground mb-8">
            Есть вопросы или предложения? Свяжитесь с нами!
          </p>
          <div className="flex justify-center gap-6">
            <a
              href="mailto:info@promogid.ru"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Icon name="Mail" size={20} />
              info@promogid.ru
            </a>
            <a
              href="https://t.me/promogid"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Icon name="MessageCircle" size={20} />
              Telegram
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 ПромоГид. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}