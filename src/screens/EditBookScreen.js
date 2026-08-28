import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '../components/Header';
import { updateBook, getBookById } from '../services/storageService';
import { CATEGORIES, STATUS_OPTIONS } from '../services/categoryService';
import { colors, spacing, borderRadius } from '../constants/colors';

export default function EditBookScreen({ route, navigation }) {
  const { book } = route.params;
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState(book?.title || '');
  const [author, setAuthor] = useState(book?.author || '');
  const [selectedCategory, setSelectedCategory] = useState(book?.category || CATEGORIES[0].name);
  const [selectedStatus, setSelectedStatus] = useState(book?.status || STATUS_OPTIONS[0].value);
  const [totalPages, setTotalPages] = useState(book?.totalPages?.toString() || '');
  const [currentPage, setCurrentPage] = useState(book?.currentPage?.toString() || '0');
  const [description, setDescription] = useState(book?.description || '');
  const [rating, setRating] = useState(book?.rating || 0);

  useEffect(() => {
    loadBook();
  }, []);

  const loadBook = async () => {
    if (book?.id) {
      const freshBook = await getBookById(book.id);
      if (freshBook) {
        setTitle(freshBook.title);
        setAuthor(freshBook.author);
        setSelectedCategory(freshBook.category);
        setSelectedStatus(freshBook.status);
        setTotalPages(freshBook.totalPages?.toString() || '');
        setCurrentPage(freshBook.currentPage?.toString() || '0');
        setDescription(freshBook.description || '');
        setRating(freshBook.rating || 0);
      }
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!title.trim() || !author.trim()) {
      Alert.alert('Erro', 'Título e autor são obrigatórios!');
      return;
    }

    const updatedBook = {
      ...book,
      title: title.trim(),
      author: author.trim(),
      category: selectedCategory,
      status: selectedStatus,
      totalPages: parseInt(totalPages) || 0,
      currentPage: parseInt(currentPage) || 0,
      description: description.trim(),
      rating,
    };

    const savedBook = await updateBook(updatedBook);
    
    if (savedBook) {
      Alert.alert('Sucesso', 'Livro atualizado com sucesso!');
      navigation.goBack();
    } else {
      Alert.alert('Erro', 'Não foi possível atualizar o livro.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Editar Livro" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Título *</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="book" size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Digite o título do livro"
                placeholderTextColor={colors.textLight}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Autor *</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="account" size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.input}
                value={author}
                onChangeText={setAuthor}
                placeholder="Digite o nome do autor"
                placeholderTextColor={colors.textLight}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Categoria</Text>
            <View style={styles.optionsContainer}>
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.optionButton,
                    selectedCategory === category.name && styles.optionButtonSelected,
                    { borderColor: category.color }
                  ]}
                  onPress={() => setSelectedCategory(category.name)}
                >
                  <Text 
                    style={[
                      styles.optionText,
                      selectedCategory === category.name && styles.optionTextSelected
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Status de Leitura</Text>
            <View style={styles.optionsContainer}>
              {STATUS_OPTIONS.map((status) => (
                <TouchableOpacity
                  key={status.id}
                  style={[
                    styles.optionButton,
                    selectedStatus === status.value && styles.optionButtonSelected,
                    { borderColor: status.color }
                  ]}
                  onPress={() => setSelectedStatus(status.value)}
                >
                  <Text 
                    style={[
                      styles.optionText,
                      selectedStatus === status.value && styles.optionTextSelected
                    ]}
                  >
                    {status.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Total de Páginas</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="pages" size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.input}
                value={totalPages}
                onChangeText={setTotalPages}
                placeholder="Quantas páginas tem o livro?"
                placeholderTextColor={colors.textLight}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Página Atual</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="page-next" size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.input}
                value={currentPage}
                onChangeText={setCurrentPage}
                placeholder="Em qual página você está?"
                placeholderTextColor={colors.textLight}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Avaliação</Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  style={styles.starButton}
                >
                  <MaterialCommunityIcons
                    name={star <= rating ? 'star' : 'star-outline'}
                    size={32}
                    color={star <= rating ? colors.accent : colors.border}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Adicione uma descrição (opcional)"
              placeholderTextColor={colors.textLight}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Atualizar Livro</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  form: {
    padding: spacing.md,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    height: 100,
    paddingTop: spacing.md,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  optionButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  optionButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  optionTextSelected: {
    color: colors.white,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  starButton: {
    padding: spacing.xs,
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});