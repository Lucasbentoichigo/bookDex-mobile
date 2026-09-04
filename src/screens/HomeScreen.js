import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '../components/Header';
import BookCard from '../components/BookCard';
import EmptyState from '../components/EmptyState';
import { getAllBooks, deleteBook } from '../services/storageService';
import { getReadingStats } from '../utils/missionUtils';
import { colors, spacing } from '../constants/colors';

export default function HomeScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Carrega a lista de livros
  const loadBooks = async () => {
    try {
      const data = await getAllBooks();
      setBooks(data || []);
    } catch (error) {
      console.error('Erro ao carregar livros:', error);
    } finally {
      setLoading(false);
    }
  };

  // Atualiza a tela sempre que ela entra em foco
  useFocusEffect(
    useCallback(() => {
      loadBooks();
    }, [])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBooks();
    setRefreshing(false);
  };

  const handleDelete = async (id) => {
    await deleteBook(id);
    await loadBooks();
  };

  const stats = getReadingStats(books);

  return (
    <View style={styles.container}>
      <Header 
        title="bookDex" 
        subtitle={`${stats.total} livros • ${stats.read} lidos`}
      />
      
      {books.length === 0 && !loading ? (
        <EmptyState
          icon="bookshelf"
          title="Sua biblioteca está vazia"
          message="Adicione seu primeiro livro clicando no botão abaixo"
        />
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <BookCard
              book={item}
              onPress={() => navigation.navigate('BookDetail', { book: item })}
              onEdit={() => navigation.navigate('EditBook', { book: item })}
              onDelete={() => handleDelete(item.id)}
            />
          )}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
            />
          }
        />
      )}

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('AddBook')}
      >
        <MaterialCommunityIcons name="plus" size={32} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.md,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});