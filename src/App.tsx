
import { useState } from 'react';
import { FaCog } from 'react-icons/fa';
import { motion } from 'framer-motion';


import {
  ConfigProvider,
  AdaptivityProvider,
  AppRoot,
  View,
  Panel,
  PanelHeader,
  Group,
  Button,
  Div,
  Title,
  Text,
  Spinner,
  Card,
  Input,
  FormItem,
  SimpleCell,
  
} from '@vkontakte/vkui';
import {
  Icon28FavoriteOutline,
  Icon28DeleteOutline,
  Icon28ShareOutline,
  Icon28AddOutline,
  Icon28ChevronDownOutline,
  Icon28ChevronUpOutline,
} from '@vkontakte/icons';
import '@vkontakte/vkui/dist/vkui.css';
import bridge from '@vkontakte/vk-bridge';

export const App = () => {
  const [meals, setMeals] = useState<string[]>([
    'Шаурма', 'Пельмени', 'Суп с фрикадельками', 'Курица с рисом', 'Спагетти с соусом',
    'Сырники', 'Блины с мёдом', 'Овощной салат', 'Борщ', 'Плов',
  ]);
  const [meal, setMeal] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [excludedMeals, setExcludedMeals] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [showExcluded, setShowExcluded] = useState(false);
  const [showAllMeals, setShowAllMeals] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newMeal, setNewMeal] = useState('');
  const [selectionCount, setSelectionCount] = useState(0);

  const filteredMeals = meals.filter((m) =>
    m.toLowerCase().includes(search.toLowerCase())
  );
  const availableMeals = meals.filter((m) => !excludedMeals.includes(m));

  const getRandomMeal = () => {
    if (availableMeals.length === 0) {
      setMeal('Нечего больше предлагать 😢');
      return;
    }

    setLoading(true);
    setMeal(null);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * availableMeals.length);
      const selected = availableMeals[randomIndex];
      setMeal(selected);
      setSelectionCount((count) => count + 1);
      setLoading(false);
    }, 1200);
  };

  const addToFavorites = () => {
    if (meal && !favorites.includes(meal)) {
      setFavorites([...favorites, meal]);
    }
  };

  const excludeMeal = () => {
    if (meal && !excludedMeals.includes(meal)) {
      setExcludedMeals([...excludedMeals, meal]);
      setMeal(null);
    }
  };

  const removeFromFavorites = (item: string) => {
    setFavorites(favorites.filter((f) => f !== item));
  };

  const removeFromExcluded = (item: string) => {
    setExcludedMeals(excludedMeals.filter((e) => e !== item));
  };

  const addNewMeal = () => {
    if (newMeal.trim() && !meals.includes(newMeal.trim())) {
      setMeals([...meals, newMeal.trim()]);
      setNewMeal('');
    }
  };

  const shareMeal = () => {
    if (!meal || meal === 'Нечего больше предлагать 😢') return;
    bridge.send('VKWebAppShare', {
      link: `https://vk.com/app`,
    });
  };

  return (
    <ConfigProvider>
      <AdaptivityProvider>
        <AppRoot>
          <View activePanel="main">
            <Panel id="main">
              <PanelHeader>🍽 Случайное блюдо</PanelHeader>

              <Group>
                <Div>
                  <Title level="2" weight="2" style={{ color: '#E91E63' }}>
                    Не знаешь, что поесть?
                  </Title>
                  <Text style={{ marginBottom: 12 }}>
                    Нажми на кнопку ниже и получи вкусное предложение!
                  </Text>

                  <Button size="l" stretched onClick={getRandomMeal} mode="primary">
                    🎲 Что поесть сегодня?
                  </Button>

                 {loading && (
  <Div style={{ marginTop: 30, textAlign: 'center' }}>
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      style={{ fontSize: 50, color: '#888', display: 'inline-block' }}
    >
      <FaCog />
    </motion.div>
    <Text style={{ marginTop: 10, color: '#888' }}>
      Генерация блюда...
    </Text>
  </Div>
)}

                  {meal && !loading && (
                    <Card mode="shadow" style={{ marginTop: 20, padding: 16 }}>
                      <Title level="3">🍽 Тебе стоит поесть:</Title>
                      <Text
                        weight="2"
                        style={{
                          fontSize: 34,
                          textTransform: 'uppercase',
                          color: '#673AB7',
                          textAlign: 'center',
                          marginBottom: 12,
                        }}
                      >
                        {meal}
                      </Text>

                      {meal !== 'Нечего больше предлагать 😢' && (
                        <Div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <Button
                            mode="secondary"
                            before={<Icon28FavoriteOutline />}
                            onClick={addToFavorites}
                          >
                            Добавить в избранное
                          </Button>
                          <Button
                            mode="secondary"
                            before={<Icon28DeleteOutline />}
                            onClick={excludeMeal}
                          >
                            Больше не показывать
                          </Button>
                          <Button
                            mode="outline"
                            before={<Icon28ShareOutline />}
                            onClick={shareMeal}
                          >
                            Поделиться в VK
                          </Button>
                        </Div>
                      )}
                    </Card>
                  )}

                  <Text style={{ marginTop: 12, color: '#888' }}>
                    📊 Кол-во генераций: {selectionCount}
                  </Text>
                </Div>
              </Group>

              <Group header={<PanelHeader>⭐ Избранное блюда</PanelHeader>}>
                <Button
                  mode="link"
                  onClick={() => setShowFavorites(!showFavorites)}
                  before={showFavorites ? <Icon28ChevronUpOutline /> : <Icon28ChevronDownOutline />}
                >
                  {showFavorites ? 'Скрыть' : 'Показать'} избранные блюда
                </Button>

                {showFavorites &&
                  (favorites.length > 0 ? (
                    <Div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {favorites.map((fav, i) => (
                        <Card key={i} mode="outline" style={{ padding: 12 }}>
                          <SimpleCell
                            after={
                              <Button
                                mode="tertiary"
                                size="s"
                                onClick={() => removeFromFavorites(fav)}
                              >
                                ❌
                              </Button>
                            }
                          >
                            {fav}
                          </SimpleCell>
                        </Card>
                      ))}
                    </Div>
                  ) : (
                    <Text style={{ padding: 12 }}>Нет избранных блюд.</Text>
                  ))}
              </Group>

              <Group header={<PanelHeader>🚫 Исключённые блюда</PanelHeader>}>
                <Button
                  mode="link"
                  onClick={() => setShowExcluded(!showExcluded)}
                  before={showExcluded ? <Icon28ChevronUpOutline /> : <Icon28ChevronDownOutline />}
                >
                  {showExcluded ? 'Скрыть' : 'Показать'} исключённые блюда
                </Button>

                {showExcluded &&
                  (excludedMeals.length > 0 ? (
                    <Div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {excludedMeals.map((item, i) => (
                        <Card key={i} mode="outline" style={{ padding: 12 }}>
                          <SimpleCell
                            after={
                              <Button
                                mode="tertiary"
                                size="s"
                                onClick={() => removeFromExcluded(item)}
                              >
                                ♻️
                              </Button>
                            }
                          >
                            {item}
                          </SimpleCell>
                        </Card>
                      ))}
                    </Div>
                  ) : (
                    <Text style={{ padding: 12 }}>Нет исключённых блюд.</Text>
                  ))}
              </Group>

              <Group header={<PanelHeader>📋 Все блюда</PanelHeader>}>
                <Button
                  mode="link"
                  onClick={() => setShowAllMeals(!showAllMeals)}
                  before={showAllMeals ? <Icon28ChevronUpOutline /> : <Icon28ChevronDownOutline />}
                >
                  {showAllMeals ? 'Скрыть' : 'Показать'} все блюда
                </Button>

                {showAllMeals && (
                  <>
                    <FormItem top="🔍 Поиск по блюдам">
                      <Input
                        placeholder="Например: Борщ"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </FormItem>
                    <Div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {filteredMeals.map((m, i) => (
                        <SimpleCell key={i}>• {m}</SimpleCell>
                      ))}
                    </Div>
                  </>
                )}
              </Group>

              <Group header={<PanelHeader>➕ Добавить новое блюдо</PanelHeader>}>
                <FormItem top="Название блюда">
                  <Input
                    placeholder="Например: Хинкали"
                    value={newMeal}
                    onChange={(e) => setNewMeal(e.target.value)}
                  />
                </FormItem>
                <Div>
                  <Button
                    mode="primary"
                    size="l"
                    before={<Icon28AddOutline />}
                    onClick={addNewMeal}
                    disabled={!newMeal.trim()}
                  >
                    Добавить
                  </Button>
                </Div>
              </Group>
            </Panel>
          </View>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
};
