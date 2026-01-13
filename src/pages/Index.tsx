import { useState } from 'react';
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
  },
  {
    id: '3',
    code: 'FOOD15',
    store: 'Яндекс Еда',
    discount: '-15%',
    description: 'Скидка 15% на доставку еды',
    category: 'food',
    expiresAt: '25.01.2026',
  },
  {
    id: '4',
    code: 'BEAUTY20',
    store: 'Л'Этуаль',
    discount: '-20%',
    description: 'Скидка 20% на косметику',
    category: 'beauty',
    expiresAt: '15.02.2026',
    isTop: true,
  },
  {
    id: '5',
    code: 'FLY2026',
    store: 'Aviasales',
    discount: '-2000₽',
    description: 'Скидка 2000₽ на авиабилеты',
    category: 'travel',
    expiresAt: '28.02.2026',
  },
  {
    id: '6',
    code: 'HOME30',
    store: 'IKEA',
    discount: '-30%',
    description: 'Скидка 30% на мебель',
    category: 'home',
    expiresAt: '10.02.2026',
  },
  {
    id: '7',
    code: 'OZON100',
    store: 'Ozon',
    discount: '-100₽',
    description: 'Скидка 100₽ при заказе от 1000₽',
    category: 'electronics',
    expiresAt: '31.01.2026',
  },
  {
    id: '8',
    code: 'LAMODA25',
    store: 'Lamoda',
    discount: '-25%',
    description: 'Скидка 25% на обувь и аксессуары',
    category: 'fashion',
    expiresAt: '18.01.2026',
  },
];

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  const filteredPromos = promos.filter((promo) => {
    const matchesCategory = selectedCategory === 'all' || promo.category === selectedCategory;
    const matchesSearch =
      promo.store.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promo.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Tag" className="text-primary" size={32} />
              <h1 className="text-2xl font-bold">ПромоГид</h1>
            </div>
            <nav className="hidden md:flex gap-6">
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
          <h3 className="text-2xl font-semibold mb-6">
            {selectedCategory === 'all' ? 'Все промокоды' : 'Промокоды по категории'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPromos.map((promo) => (
              <Card key={promo.id} className="hover:shadow-lg transition-shadow animate-fade-in">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-lg mb-1">{promo.store}</h4>
                      <p className="text-sm text-muted-foreground">{promo.description}</p>
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
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Icon name="Clock" size={14} />
                      до {promo.expiresAt}
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
