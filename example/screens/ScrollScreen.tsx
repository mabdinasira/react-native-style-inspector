import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';

const ListHeader = () => (
  <>
    <Text style={styles.title}>Scrollable Content</Text>
    <Text style={styles.subtitle}>Tests snapshot invalidation when layout changes on scroll</Text>

    <Text style={styles.sectionTitle}>ScrollView</Text>
    <ScrollView
      horizontal
      style={styles.horizontalScroll}
      contentContainerStyle={styles.horizontalContent}
      showsHorizontalScrollIndicator={false}
    >
      {SCROLL_CARDS.map((card) => (
        <View key={card.id} style={[styles.scrollCard, { backgroundColor: card.color }]}>
          <Text style={styles.scrollCardText}>{card.label}</Text>
        </View>
      ))}
    </ScrollView>

    <Text style={styles.sectionTitle}>List Items</Text>
  </>
);

/** ScrollView, FlatList — tests snapshot invalidation on scroll. */
export const ScrollScreen = () => {
  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.flatListContent}
      data={FLAT_LIST_DATA}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={ListHeader}
      renderItem={({ item }) => (
        <View style={styles.listItem}>
          <View style={[styles.listDot, { backgroundColor: item.color }]} />
          <View style={{ flex: 1 }}>
            <Text style={styles.listTitle}>{item.title}</Text>
            <Text style={styles.listSubtitle}>{item.subtitle}</Text>
          </View>
          <Text style={styles.listMeta}>{item.meta}</Text>
        </View>
      )}
    />
  );
};

const COLORS = ['#E94560', '#61AFEF', '#98C379', '#C678DD', '#D19A66', '#56B6C2'];

const SCROLL_CARDS = Array.from({ length: 10 }, (_, index) => ({
  id: `card-${COLORS[index % COLORS.length]}-${index}`,
  label: `Card ${index + 1}`,
  color: COLORS[index % COLORS.length],
}));

const FLAT_LIST_DATA = Array.from({ length: 20 }, (_, i) => ({
  id: String(i),
  title: `List Item ${i + 1}`,
  subtitle: `Description for item ${i + 1}`,
  meta: `${Math.floor(Math.random() * 100)}%`,
  color: COLORS[i % COLORS.length],
}));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#61AFEF',
    paddingHorizontal: 16,
    marginBottom: 8,
    marginTop: 8,
  },
  horizontalScroll: {
    marginBottom: 8,
  },
  horizontalContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  scrollCard: {
    width: 120,
    height: 80,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollCardText: {
    color: '#FFF',
    fontWeight: '600',
  },
  flatListContent: {
    paddingBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#16213E',
  },
  listDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  listTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  listSubtitle: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  listMeta: {
    color: '#98C379',
    fontSize: 14,
    fontWeight: '600',
  },
});
